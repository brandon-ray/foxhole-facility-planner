const game = {
    services: {},
    settings: {
        quality: 'auto',
        disableSound: false,
        disableHUD: false,
        enableGrid: true,
        enableStats: true,
        gridSize: 16,
        enableSnapRotation: true,
        snapRotationDegrees: 15,
        volume: 1
    },
    isPlayScreen: false
};

function escapeHtml(str) {
    if (str && str.replace) {
        return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    } else {
        return '';
    }
}
game.showGrowl = (message, data) => {
    alert(message);
};

function getQuery() {
    let vars = {}, hash;
    let hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(let i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars[hash[0]] = hash[1];
    }
    return vars;
}
game.queryData = getQuery();


try {
    if (window.localStorage) {
        let newSettings = window.localStorage.getItem('settings');
        if (newSettings) {
            game.settings = JSON.parse(newSettings);
        }
    }
} catch(e) {
    console.error('Failed to parse settings.');
}

const fontFamily = ['Recursive', 'sans-serif'];

(function() {
    let ENABLE_DEBUG = false;
    let running = false;
    let WIDTH = window.innerWidth;
    let HEIGHT = window.innerHeight;
    let MAP_WIDTH = 4000;
    let MAP_HEIGHT = 4000;
    let idleTime = 0;
    let latency = 0;
    let currentBuilding = null;
    let selectedPoint = null;
    let currentBuildingOffset = {
        x: 0,
        y: 0
    };

    game.selectedEntity = null;

    if (isMobile && !isPhoneApp) {
        console.info('Mobile is disabled for now.');
        return;
    }

    if (!PIXI.utils.isWebGLSupported()) {
        $('body').css({
            'overflow-y': 'auto'
        });
        $('#loading').hide();
        $('#webgl-disabled-message').show();
        return;
    }

    PIXI.settings.FAIL_IF_MAJOR_PERFORMANCE_CAVEAT = true;
    let app = new PIXI.Application(WIDTH, HEIGHT, {
        backgroundColor: 0x000000,
        FAIL_IF_MAJOR_PERFORMANCE_CAVEAT: true,
        antialias: false,
        powerPreference: 'high-performance'
    });
    app.stage = new PIXI.display.Stage();
    game.app = app;
    app.stop();
    PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;
    app.view.id = 'gameCanvas';
    document.body.appendChild(app.view);

    let isSmallMobile = isMobile && (WIDTH <= 900 || HEIGHT <= 900);
    let isSmallestMobile = isMobile && (WIDTH <= 800 || HEIGHT <= 800);
    game.isMobile = isMobile;
    game.isPhoneApp = isPhoneApp;
    let beforeRecordingStart = false;
    let mx = 0;
    let my = 0;
    let gmx = 0;
    let gmy = 0;
    let entities = [];
    let effects = [];

    game.facilityName = 'Unnamed Facility';

    game.getEntities = () => {
        return entities;
    };

    let timeScale = 1;

    let dropShadowFilter = new PIXI.Filter(shadowFilter.vert, shadowFilter.frag);

    let camera = {
        x: MAP_WIDTH/2,
        y: MAP_HEIGHT/2,
        z: 0,
        zoom: 1,
        screenShake: 0
    };
    game.camera = camera;
    game.resetZoom = function() {
        camera.zoom = 1;
    };
    game.resetZoom();

    window.document.addEventListener('contextmenu', function (evt) {
        if (game.isPlayScreen) {
            evt.preventDefault();
        }
    });

    let debugText = null;
    let resources = null;
    let sounds = null;
    let asset_list = {
        white: 'white.png',
        background: 'grid.webp',
        wall: 'wall.png'
    };
    for (let i=0; i<window.objectData.buildings_list.length; i++) {
        let building = window.objectData.buildings_list[i];
        asset_list[building.icon] = building.icon;

        if (building.texture) {
            if (typeof building.texture === 'object' && !Array.isArray(building.texture)) {
                asset_list[building.texture.sheet] = building.texture.sheet;
            } else {
                asset_list[building.texture] = building.texture;
            }
        }
    }

    let soundsLoaded = false;
    function loadSounds() {
        if (soundsLoaded) {
            return;
        }

        soundsLoaded = true;
        sounds = {
            button_hover: new Howl({
                src: ['assets/button_hover.mp3'],
                loop: false,
                volume: 0.1
            }),
            button_click: new Howl({
                src: ['assets/button_click.mp3'],
                loop: false,
                volume: 0.25
            })
        };

        game.sounds = sounds;
    }
    game.loadSounds = loadSounds;

    game.updateLightingQuality = function() {
        if (game.settings.quality === 'auto' || game.settings.quality === 'high') {
            diffuseGroupLayer.visible = true;
            normalGroupLayer.visible = true;
            lightGroupLayer.visible = true;

            if (background && background.backgroundNormal) {
                background.backgroundNormal.visible = true;
            }
        } else {
            diffuseGroupLayer.visible = false;
            normalGroupLayer.visible = false;
            lightGroupLayer.visible = false;

            if (background && background.backgroundNormal) {
                background.backgroundNormal.visible = false;
            }
        }
    };

    game.updateQuality = function() {
        for (let i=0; i<entities.length; i++) {
            let entity = entities[i];
            entity.qualityChanged();
        }

        game.updateLightingQuality();

        game.updateSettings();
    };

    game.updateSettings = function() {
        try {
            if (window.localStorage) {
                let settingsString = JSON.stringify(game.settings);
                window.localStorage.setItem('settings', settingsString);
            }
        } catch(e) {
            console.error('Failed to update settings.');
        }

        game.reloadSettings();

        if (game.appComponent) {
            game.appComponent.$forceUpdate();
        }
    };

    game.reloadSettings = () => {
        let volume = parseFloat(game.settings.volume ? game.settings.volume : 1);
        if (volume < 0) {
            volume = 0;
        } else if (volume > 1) {
            volume = 1;
        }
        Howler.volume(volume);

        game.updateLightingQuality();
    };

    let lastSoundPlay = Date.now() + 500;
    game.playSound = function(key) {
        try {
            if (Date.now() > lastSoundPlay + 50) {
                lastSoundPlay = Date.now();

                if (sounds[key]) {
                    sounds[key].play();
                }
            }
        } catch (e) {
            console.error('Failed to play sound:', e);
        }
    };

    let keyboardEventListenerObject = game.app.view;
    app.view.tabIndex = 0;
    let keys = {};
    keyboardEventListenerObject.addEventListener('keydown', function (event) {
        event = event || window.event;
        let key = event.keyCode;
        if (key === 113) {
            ENABLE_DEBUG = !ENABLE_DEBUG;
            if (debugText) {
                debugText.visible = ENABLE_DEBUG;
            }
        } else if (key === 27) {
            if (currentBuilding) {
                currentBuilding.remove();
                game.setCurrentBuilding(null);
            }
        }

        if (!keys[key]) {
            keys[key] = true;
        }
    });
    keyboardEventListenerObject.addEventListener('keyup', function (event) {
        event = event || window.event;
        let key = event.keyCode;

        if (keys[key]) {
            keys[key] = false;
        }
    });

    function loadAssets() {
        for (let key in asset_list) {
            PIXI.Loader.shared.add(key, 'assets/' + asset_list[key]);
        }

        loadSounds();

        PIXI.Loader.shared.load();
    }

    let background = null;

    function onWindowResize() {
        if (isMobile) {
            app.renderer.view.style.width = window.innerWidth + 'px';
            app.renderer.view.style.height = window.innerHeight + 'px';
            WIDTH = Math.round(window.innerWidth * 1.2);
            HEIGHT = Math.round(window.innerHeight * 1.2);
            app.renderer.resize(WIDTH, HEIGHT);
        } else {
            let resolution = window.devicePixelRatio;
            let w = window.innerWidth;
            let h = window.innerHeight;
            app.renderer.view.style.width = w + 'px';
            app.renderer.view.style.height = h + 'px';
            WIDTH = Math.round(w * resolution);
            HEIGHT = Math.round(h * resolution);
            if (WIDTH > 2560) {
                WIDTH = 2560;
            }
            if (HEIGHT > 1440) {
                HEIGHT = 1440;
            }
            app.renderer.resize(WIDTH, HEIGHT);
        }

        if (!game.isPlayScreen) {
            MAP_WIDTH = WIDTH;
            MAP_HEIGHT = HEIGHT;
        }

        if (debugText) {
            debugText.x = WIDTH*0.22;
        }
    }
    window.addEventListener('resize', onWindowResize);

    let playerLight;
    let ambientLight;
    let diffuseGroupLayer;
    let normalGroupLayer;
    let lightGroupLayer;
    PIXI.Loader.shared.onComplete.once(function (loader, res) {
        resources = res;
        console.info('Asset loading completed.');

        app.cstage = new PIXI.Container();
        app.stage.addChild(app.cstage);
        app.stage.filterArea = app.renderer.screen;

        diffuseGroupLayer = new PIXI.display.Layer(PIXI.lights.diffuseGroup);
        PIXI.lights.diffuseGroup.zIndex = 1;
        diffuseGroupLayer.getZIndex = () => {
            return 1;
        };
        app.cstage.addChild(diffuseGroupLayer);
        normalGroupLayer = new PIXI.display.Layer(PIXI.lights.normalGroup);
        PIXI.lights.normalGroup.zIndex = 3;
        normalGroupLayer.getZIndex = () => {
            return 2;
        };
        app.cstage.addChild(normalGroupLayer);
        lightGroupLayer = new PIXI.display.Layer(PIXI.lights.lightGroup);
        PIXI.lights.lightGroup.zIndex = 4;
        lightGroupLayer.getZIndex = () => {
            return 3;
        };
        app.cstage.addChild(lightGroupLayer);

        game.updateLightingQuality();

        //ambientLight = new PIXI.lights.AmbientLight(0xD39C71, 1.2);
        ambientLight = new PIXI.lights.AmbientLight(0xFFFFFF, 1.0);
        ambientLight.getZIndex = () => {
            return 0;
        };
        app.cstage.addChild(ambientLight);

        playerLight = new PIXI.lights.PointLight(0xFFFFFF, 0.4);
        playerLight.position.set(500, 500);
        playerLight.getZIndex = () => {
            return 0;
        };
        app.cstage.addChild(playerLight);


        background = new PIXI.TilingSprite(resources['background'].texture);
        background.getZIndex = function () {
            return 100000;
        };
        background.width = 10000;
        background.height = 10000;
        background.tileScale.set(0.5);
        background.anchor.x = 0;
        background.anchor.y = 0;
        background.position.x = 0;
        background.position.y = 0;
        app.cstage.addChild(background);

        app.cstage.updateLayersOrder = function () {
            app.cstage.children.sort(function (a, b) {
                return b.getZIndex() - a.getZIndex()
            });
        };

        debugText = new PIXI.Text();
        debugText.visible = ENABLE_DEBUG;
        debugText.style.fill = 0xFFFFFF;
        debugText.style.fontFamily = fontFamily;
        debugText.anchor.x = 0;
        debugText.x = WIDTH*0.22;
        debugText.y = 12;
        debugText.getZIndex = function () {
            return -100000;
        };
        app.stage.addChild(debugText);

        game.loadVueApp();
        document.getElementById('loading').remove();

        app.start();
        update();

        onWindowResize();
    });

    game.isRunning = function(){
        return running;
    };

    function soundPlay(sound, entity, volume, fadein) {
        let tso = {
            id: -1,
            entity: entity,
            volume: volume,
        };

        let ttso = soundUpdate(tso);
        if (ttso != null) {
            let so = {
                id: sound.play(),
                sound: sound,
                volume: volume,
                entity: entity,
                started: Date.now()
            };

            if (fadein) {
                so.fadein = 600;
            }

            so = soundUpdate(so);
            return so;
        }

        return null;
    }

    function getListenerPos() {
        let zoomRatio = WIDTH/(WIDTH*camera.zoom);
        return {
            x: (camera.x + WIDTH/2) * zoomRatio,
            y: (camera.y + HEIGHT/2) * zoomRatio,
            z: camera.z
        };
    }

    function soundUpdate(so) {
        if (so.stopped) {
            return;
        }

        let listener_pos = getListenerPos();
        let dist = Math.distanceBetween({
            x: so.entity.x,
            y: so.entity.y
        }, listener_pos);
        let zoomDiff = (1-camera.zoom) * 1000;
        if (zoomDiff < 0) {
            zoomDiff = 0;
        }
        dist += zoomDiff;
        if (so.entity.z !== listener_pos.z) {
            soundStop(so);
            return null;
        }
        /*
        if (dist >= 1200 || so.entity.z !== listener_pos.z) {
            soundStop(so);
            return null;
        }
        */

        let final_vol = 0;
        let ignorePos = false;
        if (dist <= 150) {
            final_vol = so.volume;
            ignorePos = true;
        } else {
            let percent = (1 - (dist / 1200));
            let vol = so.volume * percent;

            if (percent <= 0.0001) {
                vol = 0;
                //soundStop(so);
                //return null;
            }
            final_vol = vol;
        }

        if (so.fadein) {
            let tdiff = (Date.now() - so.started) / so.fadein;
            if (tdiff <= 0.05) {
                final_vol = 0;
            } else if (tdiff < 1) {
                final_vol *= tdiff;
            }
        }

        if (so.id !== -1) {
            so.sound.rate((so.defaultRate ? so.defaultRate : 1) * (1/timeScale), so.id);
            so.sound.volume(final_vol, so.id);
            if (!ignorePos && so.entity && so.entity.x && so.entity.y) {
                try {
                    so.sound.pos(so.entity.x / 100000, 0, so.entity.y / 100000, so.id);
                } catch (e) {
                    console.error('Sound error 1:', e);
                }
            }
        }

        return so;
    }

    function soundStop(so) {
        if (so.sound && !so.stopped) {
            so.sound.stop(so.id);
            so.stopped = true;
        }
    }

    function download(data, filename, type) {
        let file = new Blob([data], {type: type});
        if (window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(file, filename);
        } else {
            let a = document.createElement('a'),
                url = URL.createObjectURL(file);
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            setTimeout(function() {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }, 0);
        }
    }

    game.downloadSave = function() {
        let saveObject = {
            name: game.facilityName,
            entities: []
        };
        for (let i=0; i<entities.length; i++) {
            let entity = entities[i];
            let entityData = {
                x: entity.x,
                y: entity.y,
                z: entity.z,
                rotation: entity.rotation,
                type: entity.type,
                subtype: entity.subtype
            };
            entity.onSave(entityData);
            saveObject.entities.push(entityData);
        }

        let fileName = game.facilityName.toLowerCase().trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '_')
            .replace(/^-+|-+$/g, '');
        download(JSON.stringify(saveObject), fileName, 'application/json')
    };

    game.loadSave = function(saveObject) {
        for (let i=0; i<entities.length; i++) {
            let entity = entities[i];
            entity.remove();
        }
        setTimeout(() => {
            let xTotal = 0;
            let yTotal = 0;
            for (let i=0; i<saveObject.entities.length; i++) {
                let entityData = saveObject.entities[i];
                let entity;
                switch (entityData.type) {
                    case 'building':
                        entity = createBuilding(entityData.subtype, entityData.x, entityData.y, entityData.z);
                        break;
                    default:
                        console.error('Attempted to load invalid entity:', entityData);
                        continue;
                }
                xTotal += entityData.x;
                yTotal += entityData.y;
                entity.rotation = entityData.rotation;
                entity.onLoad(entityData);
            }
            camera.x = Math.round(xTotal/saveObject.entities.length) - WIDTH/2;
            camera.y = Math.round(yTotal/saveObject.entities.length) - HEIGHT/2;
            game.resetZoom();
        }, 1);
    };

    let lastmx = 0;
    let lastmy = 0;
    let mdx = 0;
    let mdy = 0;
    let eventPrefix = 'mouse';
    if (isMobile) {
        eventPrefix = 'pointer';
    }

    game.selectEntity = function(entity) {
        let lastSelectedEntity = game.selectedEntity;

        if (entity) {
            game.selectedEntity = entity;
            game.selectedEntity.onSelect();
            game.buildMenuComponent.changeMenu({
                key: 'building-selected',
                name: 'Building',
                icon: 'fa-wrench'
            });
        } else {
            game.buildMenuComponent.changeMenu(null);
            game.selectedEntity = null;
        }

        if (lastSelectedEntity) {
            lastSelectedEntity.onDeselect();
        }

        if (game.buildingSelectedMenuComponent) {
            game.buildingSelectedMenuComponent.refresh();
        }
    }

    let mouseEventListenerObject = game.app.view;
    let dragCamera = false;
    let mouseDown = {};
    let forceMouseDown = {};
    mouseEventListenerObject.addEventListener('wheel', (e) => {
        let lastZoom = camera.zoom;
        camera.zoom -= (e.deltaY * 0.0005);
        if (camera.zoom > 1.6) {
            camera.zoom = 1.6;
        }
        if (camera.zoom < 0.3) {
            camera.zoom = 0.3;
        }

        let zoomAmount = camera.zoom - lastZoom;

        let zoomRatio1 = WIDTH/(WIDTH*lastZoom);
        let pos1 = {
            x: (camera.x + WIDTH/2) * zoomRatio1,
            y: (camera.y + HEIGHT/2) * zoomRatio1,
        };
        camera.x = (pos1.x * camera.zoom) - WIDTH / 2;
        camera.y = (pos1.y * camera.zoom) - HEIGHT / 2;

        let zoomRatio2 = WIDTH/(WIDTH*camera.zoom);
        let pos2 = {
            x: (camera.x + WIDTH/2) * zoomRatio2,
            y: (camera.y + HEIGHT/2) * zoomRatio2,
        };
        let dist = Math.distanceBetween(pos2, {x: gmx, y: gmy}) * zoomAmount;
        let angle = Math.angleBetween(pos2, {x: gmx, y: gmy});
        camera.x += Math.cos(angle) * dist;
        camera.y += Math.sin(angle) * dist;
    });
    mouseEventListenerObject.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    }, false);
    mouseEventListenerObject.addEventListener(eventPrefix + 'down', (e) => {
        e.preventDefault();
        mx = e.clientX;
        my = e.clientY;

        let mouseButton = e.button;
        mouseDown[mouseButton] = true;
        if (mouseButton === 0) {
            if (game.selectedEntity) {
                game.selectEntity(null);
            }

            if (!currentBuilding && !selectedPoint) {
                entities.sort(function (a, b) {
                    return b.getZIndex() - a.getZIndex()
                });
                for (let i=0; i<entities.length; i++) {
                    let entity = entities[i];
                    if (entity.type === 'building' && entity.canGrab()) {
                        currentBuildingOffset = {
                            x: gmx - entity.x,
                            y: gmy - entity.y
                        };
                        game.setCurrentBuilding(entity);
                        game.selectEntity(entity);
                    }
                }
            }
        } else if (mouseButton === 1 || mouseButton === 4) {
            dragCamera = true;
        }
    });
    mouseEventListenerObject.addEventListener(eventPrefix + 'move', (e) => {
        e.preventDefault();
        mx = e.clientX;
        my = e.clientY;

        mdx = lastmx - mx;
        mdy = lastmy - my;

        lastmx = mx;
        lastmy = my;

        idleTime = 0;

        if (dragCamera) {
            camera.x += mdx;
            camera.y += mdy;
        }
    });
    mouseEventListenerObject.addEventListener(eventPrefix + 'up', (e) => {
        e.preventDefault();
        mx = e.clientX;
        my = e.clientY;

        let mouseButton = e.button;
        mouseDown[mouseButton] = false;
        if (forceMouseDown[mouseButton]) {
            mouseDown[mouseButton] = true;
            forceMouseDown[mouseButton] = false;
        }
        if (mouseButton === 0) {
            if (currentBuilding) {
                game.setCurrentBuilding(null);
            }
        } else if (mouseButton === 1 || mouseButton === 4) {
            dragCamera = false;
        }
    });

    game.tryFullscreen = function() {
        try {
            let fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
            if (!fullscreenElement) {
                requestFullscreen(document.body);
            } else if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) { /* Safari */
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) { /* IE11 */
                document.msExitFullscreen();
            }
        } catch (e) {}
    };

    game.tryGameFocus = function(force) {
        if (game.app && game.app.view && document.activeElement !== game.app.view && (force || !document.activeElement || (document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'SELECT' && document.activeElement.tagName !== 'TEXTAREA'))) {
            game.app.view.focus();
        }
    };

    function requestFullscreen(element) {
        // Supports most browsers and their versions.
        let requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;

        if (requestMethod) { // Native full screen.
            requestMethod.call(element);
        } else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
            let wscript = new ActiveXObject("WScript.Shell");
            if (wscript !== null) {
                wscript.SendKeys("{F11}");
            }
        }
    }

    setTimeout(function() {
        loadAssets();
    }, 1);

    let spritesheetCache = {};
    function loadSpritesheet(texture, width, height) {
        if (!spritesheetCache[texture.baseTexture.resource.url]) {
            let spritesheet = [];
            for (let w = 0; w < Math.round(texture.baseTexture.width / width); w++) {
                let arr = [];
                for (let h = 0; h < Math.round(texture.baseTexture.height / height); h++) {
                    let rectangle = new PIXI.Rectangle(w * width, h * height, width, height);
                    let ntex = new PIXI.Texture(PIXI.BaseTexture.from(texture.baseTexture.resource.url, {
                        wrapMode: PIXI.WRAP_MODES.CLAMP
                    }), rectangle);
                    arr.push(ntex);
                }
                spritesheet.push(arr);
            }
            spritesheetCache[texture.baseTexture.resource.url] = spritesheet;
            return spritesheet;
        } else {
            return spritesheetCache[texture.baseTexture.resource.url];
        }
    }

    function createLight(entity, color, minBrightness, maxBrightness, duration) {
        let light = new PIXI.lights.PointLight(color, minBrightness);
        light.createTime = Date.now();
        light.minBrightness = minBrightness;
        entity.addChild(light);

        if (maxBrightness !== undefined && duration !== undefined) {
            light.maxBrightness = maxBrightness;
            light.duration = duration;

            light.tick = () => {
                let timeSinceCreation = Date.now() - light.createTime;
                if (timeSinceCreation >= light.duration * timeScale) {
                    entity.removeChild(light);
                    entity.lights.splice(entity.lights.indexOf(light), 1);
                } else {
                    let halfDuration = (light.duration * timeScale)/2;
                    let durationNormalized = timeSinceCreation/halfDuration;
                    if (timeSinceCreation < halfDuration) {
                        light.brightness =  Math.vallerp(light.minBrightness, light.maxBrightness, durationNormalized);
                    } else {
                        light.brightness =  Math.vallerp(light.maxBrightness, light.minBrightness, durationNormalized-1);
                    }
                }
            };

            entity.lights.push(light);
        }

        return light;
    }

    let entityIds = 1;
    function createEntity(type, subtype, x, y, z, netData) {
        let entity = new PIXI.Container();
        entity.id = entityIds++;
        entity.subtype = subtype;
        entity.netData = netData;

        entity.filterArea = app.screen;

        entity.states = [];
        entity.x = x;
        entity.y = y;
        entity.z = z;
        entity.lastX = x;
        entity.lastY = y;
        entity.lastRotation = 0;
        entity.dx = 0;
        entity.dy = 0;
        entity.drotation = 0;
        entity.type = type;
        entity.valid = true;
        entity.lights = [];

        entity.tick = function (delta) {
            if (ENABLE_DEBUG && entity === player) {
                debugText.text += 'Entities: ' + entities.length + '\n';
            }

            for (let i=0; i<entity.lights.length; i++) {
                let light = entity.lights[i];
                light.tick();
            }

            if (entity.sprite) {
                entity.visible = entity.isVisible();
            }

            entity.dx = entity.x - entity.lastX;
            entity.dy = entity.y - entity.lastY;
            entity.drotation = entity.rotation - entity.lastRotation;
            entity.lastX = entity.x;
            entity.lastY = entity.y;
            entity.lastRotation = entity.rotation;
        };


        entity.qualityChanged = function() {};


        entity.soundPlay = function(data) {
            if (data && data.sound && sounds[data.sound]) {
                soundPlay(sounds[data.sound], entity, data.volume);
            }
        };

        entity.getZIndex = function () {
            return -entity.y;
        };

        entity.changeZLevel = function (newZ) {
            entity.z = newZ;
        };

        entity.isVisible = function () {
            return entity.z === camera.z && isOnScreen(entity);
        };

        entity.onSelect = function() {};
        entity.onDeselect = function() {};

        entity.onSave = function(entityData) {};
        entity.onLoad = function() {};

        entity.onRemove = function () {};
        entity.afterRemove = function() {};

        entity.createLight = function(color, minBrightness, maxBrightness, duration) {
            return createLight(entity, color, minBrightness, maxBrightness, duration);
        };

        entity.remove = function () {
            entity.valid = false;
            entity.onRemove();
            app.cstage.removeChild(entity);
        };

        app.cstage.addChild(entity);
        entities.push(entity);
        return entity;
    }

    function getPositionAlongLine(x1, y1, x2, y2, percentage) {
        return {x : x1 * (1.0 - percentage) + x2 * percentage, y : y1 * (1.0 - percentage) + y2 * percentage};
    }

    let maxScreenshakeDistance = 350;
    function applyScreenShake(x, y, z, size) {
        size *= 3;
        let target = {
            x: camera.x + WIDTH/2,
            y: camera.y + HEIGHT/2,
            z: camera.z
        };
        if (player && player.valid && (!player.netData || player.netData.alive)) {
            target.x = player.x;
            target.y = player.y;
            target.z = player.z;
        }
        if (z === target.z) {
            let dist = Math.distanceBetween({x: x, y: y}, target);
            if (dist < maxScreenshakeDistance) {
                camera.screenShake = size * (1 - (dist/maxScreenshakeDistance));
            }
        }
    }

    function blendColors(colorA, colorB, amount) {
        const [rA, gA, bA] = colorA.match(/\w\w/g).map((c) => parseInt(c, 16));
        const [rB, gB, bB] = colorB.match(/\w\w/g).map((c) => parseInt(c, 16));
        const r = Math.round(rA + (rB - rA) * amount).toString(16).padStart(2, '0');
        const g = Math.round(gA + (gB - gA) * amount).toString(16).padStart(2, '0');
        const b = Math.round(bA + (bB - bA) * amount).toString(16).padStart(2, '0');
        return '#' + r + g + b;
    }

    function createEffect(type, x, y, z, width, height, data) {
        if (beforeRecordingStart) {
            return {};
        }

        let effect = new PIXI.Container();
        if (!data) {
            data = {};
        }

        let frames = 0;
        let framesY = 0;

        effect.x = x;
        effect.y = y;
        effect.z = z;
        effect.valid = true;
        effect.lastX = x;
        effect.lastY = y;
        effect.velocityX = 0;
        effect.velocityY = 0;
        effect.dx = 0;
        effect.dy = 0;
        effect.type = type;
        effect.maxLifetime = 100;
        effect.lights = [];
        if (data.rotation) {
            effect.rotation = data.rotation;
        } else {
            effect.rotation = (Math.PI * 2) * Math.random();
        }

        effect.createLight = function(color, minBrightness, maxBrightness, duration) {
            return createLight(effect, color, minBrightness, maxBrightness, duration);
        };

        let zOffset = 100;
        let spritesheet = null;
        let effectSound = null;
        let disableLighting = false;
        if (type === 'smoke') {
            spritesheet = loadSpritesheet(resources['smoke_particles'].texture, 64, 64);
            effect.maxLifetime = 200 + Math.round(Math.random() * 50);
            effect.sprite = new PIXI.Sprite(spritesheet[Math.round(Math.random()*3)][Math.round(Math.random())]);
            effect.sprite.width = width;
            effect.sprite.height = height;
            effect.sprite.anchor.set(0.5);
            effect.addChild(effect.sprite);
        }

        if (data.dx) {
            effect.dx = data.dx;
        }
        if (data.dy) {
            effect.dy = data.dy;
        }
        if (data.tint) {
            effect.sprite.tint = data.tint;
        }
        if (data.alpha) {
            effect.sprite.alpha = data.alpha;
        }
        if (data.maxLifetime) {
            effect.maxLifetime = data.maxLifetime;
        }

        if (effect.sprite && !disableLighting) {
            effect.sprite.parentGroup = PIXI.lights.diffuseGroup;
        }

        effect.lifetime = effect.maxLifetime;
        effect.tick = function () {
            if (effect.lifetime > 0) {
                effect.lifetime -= (1/timeScale);

                for (let i=0; i<effect.lights.length; i++) {
                    let light = effect.lights[i];
                    light.tick();
                }
            } else {
                effect.remove();
            }

            if (effectSound) {
                soundUpdate(effectSound);
            }
            if (effectSound && effectSound.stopped) {
                effectSound = null;
            }

            if (effect.sprite) {
                effect.visible = effect.isVisible();
            }

            effect.x += effect.dx * (1/timeScale);
            effect.y += effect.dy * (1/timeScale);

            effect.velocityX = effect.x - effect.lastX;
            effect.velocityY = effect.y - effect.lastY;

            effect.lastX = effect.x;
            effect.lastY = effect.y;
        };

        effect.getZIndex = function () {
            return -effect.y - zOffset;
        };

        effect.isVisible = function () {
            return effect.z === camera.z && isOnScreen(effect);
        };

        effect.onRemove = function () {
            if (effectSound) {
                soundStop(effectSound);
                effectSound = null;
            }
        };

        effect.remove = function () {
            effect.valid = false;
            effect.onRemove();
            app.cstage.removeChild(effect);
        };

        app.cstage.addChild(effect);
        effects.push(effect);
        return effect;
    }

    game.getMousePosition = () => {
        if (app.renderer.plugins.interaction && app.renderer.plugins.interaction.mouse && app.renderer.plugins.interaction.mouse.global) {
            let pos = app.renderer.plugins.interaction.mouse.global;
            let zoomRatio = WIDTH/(WIDTH*camera.zoom);
            return {
                x: (pos.x + camera.x) * zoomRatio,
                y: (pos.y + camera.y) * zoomRatio
            };
        }

        return {
            x: 0,
            y: 0
        };
    };

    let screenOffset = 250;
    function isOnScreen(pos, bufferOverride) {
        let buffer = screenOffset;
        if (bufferOverride) {
            buffer = bufferOverride;
        }
        return pos.x * camera.zoom >= camera.x - buffer && pos.y * camera.zoom >= camera.y - buffer && pos.x * camera.zoom <= camera.x + WIDTH + buffer && pos.y * camera.zoom <= camera.y + HEIGHT + buffer;
    }

    /*
    window.onbeforeunload = function() {
        if (!game.isInMenu) {
            return 'Are you sure you want to leave?';
        }
    };
    */

    game.createBuildingAtCenter = function(key) {
        let zoomRatio = WIDTH/(WIDTH*camera.zoom);
        createBuilding(key, (camera.x + WIDTH/2) * zoomRatio, (camera.y + HEIGHT/2) * zoomRatio, 0);
    };

    const METER_PIXEL_SIZE = 32;
    function createBuilding(type, x, y, z, netData) {
        let entity = createEntity('building', type, x, y, z, netData);

        let building = window.objectData.buildings[type];
        entity.building = building;
        let sprite;

        entity.isRail = false;
        if (entity.subtype === 'rail_small_gauge') {
            entity.isRail = true;
        }

        if (!entity.isRail) {
            sprite = new PIXI.TilingSprite(resources['wall'].texture);
            sprite.width = building.width * METER_PIXEL_SIZE;
            sprite.height = building.length * METER_PIXEL_SIZE;
            sprite.anchor.set(0.5);
            entity.addChild(sprite);
        }

        let frameX = 0;
        let frameY = 0;
        let frameWidth = 0;
        let frameHeight = 0;
        let sheet = null;
        if (building.texture && !entity.isRail) {
            if (typeof building.texture === 'object' && !Array.isArray(building.texture)) {
                sheet = loadSpritesheet(resources[building.texture.sheet].texture, building.texture.width, building.texture.height);
                frameWidth = Math.floor(resources[building.texture.sheet].texture.width/building.texture.width);
                frameHeight = Math.floor(resources[building.texture.sheet].texture.height/building.texture.height);
                entity.removeChild(sprite);
                sprite = new PIXI.Sprite(sheet[0][0]);
                sprite.width = building.width * 32;
                sprite.height = building.length * 32;
                sprite.anchor.set(0.5);
                entity.addChild(sprite);
            } else if (resources[building.texture]) {
                sprite.texture = resources[building.texture].texture;
                sprite.tileScale.set(0.5);
            }
        }

        if (!building.texture && !entity.isRail) {
            let iconBackground = new PIXI.Sprite(resources['white'].texture);
            iconBackground.tint = 0x3d3d3d;
            iconBackground.anchor.set(0.5);
            iconBackground.width = 64;
            iconBackground.height = 64;
            iconBackground.anchor.set(0.5);
            entity.addChild(iconBackground);

            let icon = new PIXI.Sprite(resources[building.icon].texture);
            icon.anchor.set(0.5);
            icon.width = iconBackground.width;
            icon.height = iconBackground.height;
            icon.anchor.set(0.5);
            entity.addChild(icon);
        }

        setTimeout(() => {
            if (game.statisticsMenuComponent) {
                game.statisticsMenuComponent.refresh();
            }
        }, 1);

        entity.updateHandles = function() {
            for (let i = 0; i < points.length; i++) {
                let point = points[i];
                if (point.handle) {
                    point.handle.visible = game.selectedEntity === entity;
                }
            }
        };

        const TRACK_SEGMENT_LENGTH = 16;
        entity.onSelect = function() {
            entity.updateHandles();
        };
        entity.onDeselect = function() {
            if (entity.isRail && entity.shouldSelectLastRailPoint && !selectedPoint) {
                entity.shouldSelectLastRailPoint = false;
                forceMouseDown[0] = true;
                selectedPoint = points[1];
                game.selectedEntity = entity;
            } else if (entity.bezier && entity.bezier.length() <= TRACK_SEGMENT_LENGTH) {
                selectedPoint = null;
                entity.remove();
                game.selectEntity(null);
            }
            entity.updateHandles();
        };

        let sound = null;
        entity.tick = function() {
            if (sheet) {
                frameX += building.texture.speed ? building.texture.speed : 0.1;
                if (frameX >= frameWidth) {
                    frameX -= frameWidth;
                }
                if (frameY >= frameHeight) {
                    frameY -= frameHeight;
                }
                sprite.texture = sheet[Math.floor(frameX)][Math.floor(frameY)];
            }

            if (!sound && building.sound && sounds[building.sound]) {
                sound = soundPlay(sounds[building.sound], entity, 0.4);
            }

            if (sound) {
                soundUpdate(sound);
                if (sound.stopped) {
                    sound = null;
                }
            }

            if (entity.isRail) {
                if (selectedPoint && !mouseDown[0]) {
                    selectedPoint = null;
                }

                if (game.selectedEntity === entity && mouseDown[0]) {
                    let gridSize = game.settings.gridSize ? game.settings.gridSize : 16;
                    let gmxGrid = gmx;
                    let gmyGrid = gmy;
                    if (game.settings.enableGrid || keys[16]) {
                        gmxGrid = Math.floor(gmxGrid / gridSize) * gridSize;
                        gmyGrid = Math.floor(gmyGrid / gridSize) * gridSize;
                    }
                    let mousePos = entity.toLocal({x: gmxGrid, y: gmyGrid}, app.cstage, undefined, true);
                    if (selectedPoint) {
                        game.setCurrentBuilding(null);
                        if (selectedPoint.index === 0) {
                            entity.x = gmx;
                            entity.y = gmy;

                            if (game.settings.enableGrid || keys[16]) {
                                entity.x = Math.floor(entity.x / gridSize) * gridSize;
                                entity.y = Math.floor(entity.y / gridSize) * gridSize;
                            }
                        } else {
                            if (mouseDown[2]) {
                                let angle = Math.angleBetween(selectedPoint, mousePos);
                                if (game.settings.enableSnapRotation) {
                                    let snapRotationDegrees = Math.deg2rad(game.settings.snapRotationDegrees ? game.settings.snapRotationDegrees : 15);
                                    angle = Math.floor(angle / snapRotationDegrees) * snapRotationDegrees;
                                }
                                selectedPoint.rotation = angle + Math.PI;
                            } else {
                                selectedPoint.x = mousePos.x;
                                selectedPoint.y = mousePos.y;
                            }

                            if (Math.abs(selectedPoint.y) < 25) {
                                selectedPoint.y = 0;
                            }
                        }

                        for (let i=0; i<entities.length; i++) {
                            let entity2 = entities[i];
                            if (entity2 === entity || entity2.type !== 'building' || !entity2.isRail || !entity2.bezier) {
                                continue;
                            }
                            let selectedPointToEntity2Local = entity2.toLocal(selectedPoint, entity, undefined, true);
                            let projection = entity2.bezier.project(selectedPointToEntity2Local);
                            if (projection.d <= 25) {
                                if (projection.t >= 0.95) {
                                    projection = entity2.bezier.get(1);
                                } else if (projection.t <= 0.05) {
                                    projection = entity2.bezier.get(0);
                                }
                                let local = entity.toLocal({x: projection.x, y: projection.y}, entity2, undefined, true);
                                let normal = entity2.bezier.normal(projection.t);
                                let angle = Math.angleBetween({x: 0, y: 0}, normal);
                                selectedPoint.x = local.x;
                                selectedPoint.y = local.y;

                                let currentRot = entity.rotation + selectedPoint.rotation;
                                let angleRight = entity2.rotation + (angle - Math.PI/2) - Math.PI/2;
                                let angleLeft = entity2.rotation + (angle + Math.PI/2) - Math.PI/2;
                                let rightDiff = Math.atan2(Math.sin(angleRight-currentRot), Math.cos(angleRight-currentRot));
                                let leftDiff = Math.atan2(Math.sin(angleLeft-currentRot), Math.cos(angleLeft-currentRot));

                                if (rightDiff < leftDiff) {
                                    selectedPoint.rotation = (angleRight + Math.PI/2) - entity.rotation;
                                } else {
                                    selectedPoint.rotation = (angleLeft + Math.PI/2) - entity.rotation;
                                }
                                break;
                            }
                        }

                        const MAX_SEGMENT_DISTANCE = 35 * METER_PIXEL_SIZE;
                        if (selectedPoint.index === 1) {
                            let dist = Math.distanceBetween({x: 0, y: 0}, selectedPoint);
                            let angle = Math.angleBetween({x: 0, y: 0}, selectedPoint);
                            if (dist > MAX_SEGMENT_DISTANCE) {
                                dist = MAX_SEGMENT_DISTANCE;
                            }
                            selectedPoint.x = Math.cos(angle) * dist;
                            selectedPoint.y = Math.sin(angle) * dist;
                        }

                        entity.regenerate();
                        let curve1 = entity.bezier.curvature(0.25);
                        let curve2 = entity.bezier.curvature(0.5);
                        let curve3 = entity.bezier.curvature(0.75);
                        if ((curve1.r !== 0 && (Math.abs(curve1.r) < 100 || Math.abs(curve2.r) < 200 || Math.abs(curve3.r) < 100)) || selectedPoint.x < 0) {
                            entity.sprite.tint = 0xFF0000;
                        } else {
                            entity.sprite.tint = 0xFFFFFF;
                        }

                        if (selectedPoint.handle) {
                            selectedPoint.handle.position.x = selectedPoint.x;
                            selectedPoint.handle.position.y = selectedPoint.y;
                        }
                    } else {
                        for (let i = 1; i < points.length; i++) {
                            let point = points[i];
                            let dist = Math.distanceBetween(mousePos, point);
                            if (dist < 20) {
                                selectedPoint = point;
                                game.selectEntity(entity);
                                break;
                            }
                        }
                    }
                }
            }
        };

        let boundsBuffer = 15;
        entity.canGrab = function() {
            if (entity.isRail && entity.bezier) {
                let bounds = entity.getBounds(true);
                bounds.x -= boundsBuffer;
                bounds.y -= boundsBuffer;
                bounds.width += boundsBuffer*2;
                bounds.height += boundsBuffer*2;
                if (mx >= bounds.x && mx <= bounds.x+bounds.width && my >= bounds.y && my <= bounds.y+bounds.height) {
                    let mousePos = entity.toLocal({x: mx, y: my}, undefined, undefined, true);
                    let projection = entity.bezier.project(mousePos);
                    if (projection.d <= 20) {
                        return true;
                    }
                }
                return false;
            }
            return Math.distanceBetween(entity, {x: gmx, y: gmy}) < 50;
        };

        entity.getZIndex = function() {
            return -entity.y - (building.sortOffset ? building.sortOffset : 0);
        };

        entity.onRemove = function() {
            if (sound) {
                soundStop(sound);
                sound = null;
            }
        };

        entity.afterRemove = function() {
            setTimeout(() => {
                if (game.statisticsMenuComponent) {
                    game.statisticsMenuComponent.refresh();
                }
            }, 1);
        };

        let points = [];
        entity.onSave = function(entityData) {
            if (entity.isRail) {
                entityData.railPoints = [];
                for (let i=0; i<points.length; i++) {
                    let point = points[i];
                    entityData.railPoints.push({
                        x: point.x,
                        y: point.y,
                        rotation: point.rotation
                    });
                }
            }
        };
        entity.onLoad = function(entityData) {
            if (entity.isRail && entityData.railPoints) {
                for (let i=0; i<points.length; i++) {
                    let point = points[i];
                    entity.removeChild(point.handle);
                }
                points = [];
                for (let i=0; i<entityData.railPoints.length; i++) {
                    let point = entityData.railPoints[i];
                    entity.addPoint(point.x, point.y, null, point.rotation);
                }
                entity.regenerate();
            }
        };

        entity.addPoint = function(x, y, index, rotation) {
            if (index == null) {
                index = points.length;
            }

            let newPoint = {
                index: index,
                points: 0,
                x: x,
                y: y,
                rotation: rotation ? rotation : Math.PI
            };
            points.splice(index, 0, newPoint);

            if (index !== 0) {
                let handle = new PIXI.Sprite(resources.white.texture);
                handle.anchor.set(0.5);
                handle.visible = game.selectedEntity === entity;
                handle.width = 16;
                handle.height = 16;
                handle.position.x = newPoint.x;
                handle.position.y = newPoint.y;
                entity.addChild(handle);
                newPoint.handle = handle;
            }

            entity.regenerate();
            return newPoint;
        };

        entity.regenerate = function() {
            if (entity.sprite) {
                entity.removeChild(entity.sprite);
            }

            if (points.length >= 2) {
                let bezierPoints = [];
                for (let i=0; i<points.length; i++) {
                    let point = points[i];
                    if (i < points.length-1) {
                        bezierPoints.push({
                            x: point.x,
                            y: point.y
                        });

                        let point2 = points[i+1];
                        if (point2) {
                            let dist = Math.distanceBetween(point, point2)*0.4;
                            bezierPoints.push({
                                x: point.x + dist,
                                y: point.y
                            });
                        }
                    } else {
                        let point1 = points[i-1];
                        if (point1) {
                            let dist = Math.distanceBetween(point, point1)*0.4;
                            bezierPoints.push({
                                x: point.x + (Math.cos(point.rotation) * dist),
                                y: point.y + (Math.sin(point.rotation) * dist)
                            });
                        }

                        bezierPoints.push({
                            x: point.x,
                            y: point.y
                        });
                    }
                }
                entity.bezier = new Bezier(bezierPoints);
                resources[entity.building.texture].texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
                let segments = Math.round(entity.bezier.length()/TRACK_SEGMENT_LENGTH);
                entity.sprite = new PIXI.SimpleRope(resources[entity.building.texture].texture, entity.bezier.getLUT(segments), 1);
                entity.addChild(entity.sprite);
            }
        };

        if (entity.isRail) {
            entity.addPoint(0, 0);
            entity.addPoint(200, 0);
        }

        return entity;
    }

    game.setCurrentBuilding = function(building) {
        currentBuilding = building;
        if (currentBuilding) {
            currentBuilding.selectTime = Date.now();
        }
    };

    game.startBuild = function(building) {
        game.setCurrentBuilding(createBuilding(building.key, 0, 0, 0, {}));
        currentBuildingOffset = {
            x: 0,
            y: 0
        };
        game.selectEntity(currentBuilding);
        if (currentBuilding.isRail) {
            currentBuilding.shouldSelectLastRailPoint = true;
            currentBuildingOffset = {
                x: 100,
                y: 0
            };
        }
        return currentBuilding;
    };

    const FPSMIN = 30;
    let fpsCheck = null;
    let menuInit = false;
    let lastTick = Date.now();
    let g_TICK = 10;
    let g_Time = 0;
    function update() {
        requestAnimationFrame(update);

        let timeDiff = 1;
        let timeNow = Date.now();
        timeDiff = timeNow - g_Time;
        if (timeDiff < g_TICK) {
            return;
        }
        g_Time = timeNow;

        let delta = Date.now() - lastTick;
        lastTick = Date.now();

        game.tryGameFocus();

        if (game.settings.quality === 'auto') {
            let fps = Math.round(1000/delta);
            if (fps < FPSMIN) {
                if (!fpsCheck) {
                    fpsCheck = Date.now();
                } else if (Date.now()-fpsCheck >= 1500) {
                    game.settings.quality = 'low';
                    game.updateQuality();
                    game.showGrowl('Graphics quality was set to Low Quality due to low FPS.', {type: 'danger'});
                }
            } else {
                fpsCheck = null;
            }
        } else {
            fpsCheck = null;
        }


        if (!game.isPlayScreen) {
            if (!menuInit) {
                MAP_WIDTH = WIDTH+5;
                MAP_HEIGHT = HEIGHT+5;
                menuInit = true;

                game.appComponent.gameLoaded();
            }
        }

        for (let i=0; i<entities.length; i++) {
            let entity = entities[i];
            if (entity.valid) {
                entity.tick(delta);
            } else {
                entities.splice(i, 1);
                i--;
                entity.afterRemove();
            }
        }

        for (let i = 0; i < effects.length; i++) {
            let effect = effects[i];
            if (effect.valid) {
                effect.tick(delta);
            } else {
                effects.splice(i, 1);
                i--;
            }
        }

        if (currentBuilding) {
            if (mouseDown[2]) {
                let angle = Math.angleBetween(currentBuilding, {x: gmx, y: gmy});
                if (game.settings.enableSnapRotation) {
                    let snapRotationDegrees = Math.deg2rad(game.settings.snapRotationDegrees ? game.settings.snapRotationDegrees : 15);
                    angle = Math.floor(angle / snapRotationDegrees) * snapRotationDegrees;
                }
                currentBuildingOffset = {
                    x: gmx - currentBuilding.x,
                    y: gmy - currentBuilding.y
                };
                currentBuilding.rotation = angle;
            } else {
                if (!selectedPoint && Date.now()-currentBuilding.selectTime > 250) {
                    currentBuilding.x = gmx - currentBuildingOffset.x;
                    currentBuilding.y = gmy - currentBuildingOffset.y;

                    if (game.settings.enableGrid || keys[16]) {
                        let gridSize = game.settings.gridSize ? game.settings.gridSize : 16;
                        currentBuilding.x = Math.floor(currentBuilding.x / gridSize) * gridSize;
                        currentBuilding.y = Math.floor(currentBuilding.y / gridSize) * gridSize;
                    }
                }

                if (currentBuilding.isRail && !selectedPoint) {
                    for (let i=0; i<entities.length; i++) {
                        let entity = entities[i];
                        if (!entity.isRail || !entity.bezier) {
                            continue;
                        }
                        let mousePos = entity.toLocal({x: mx, y: my}, undefined, undefined, true);
                        let projection = entity.bezier.project(mousePos);
                        if (entity !== currentBuilding && entity.type === 'building' && projection.d <= 25) {
                            if (projection.t >= 0.95) {
                                projection = entity.bezier.get(1);
                            } else if (projection.t <= 0.05) {
                                projection = entity.bezier.get(0);
                            }
                            let global = app.cstage.toLocal({x: projection.x, y: projection.y}, entity, undefined, true);
                            let normal = entity.bezier.normal(projection.t);
                            let angle = Math.angleBetween({x: 0, y: 0}, normal);
                            currentBuilding.x = global.x;
                            currentBuilding.y = global.y;

                            let angleRight = entity.rotation + (angle - Math.PI/2) - Math.PI/2;
                            let angleLeft = entity.rotation + (angle + Math.PI/2) - Math.PI/2;
                            let rightDiff = Math.atan2(Math.sin(angleRight-currentBuilding.rotation), Math.cos(angleRight-currentBuilding.rotation));
                            let leftDiff = Math.atan2(Math.sin(angleLeft-currentBuilding.rotation), Math.cos(angleLeft-currentBuilding.rotation));

                            if (rightDiff < leftDiff) {
                                currentBuilding.rotation = angleRight + Math.PI/2;
                            } else {
                                currentBuilding.rotation = angleLeft + Math.PI/2;
                            }
                            //currentBuilding.shouldSelectLastRailPoint = true;
                            break;
                        }
                    }
                }
            }
        }

        if (ENABLE_DEBUG) {
            debugText.text = 'Press F2 to disable debug\n';
            debugText.text += 'FPS: ' + Math.round(1000/delta) + '\n';
            debugText.text += 'Latency: ' + latency + ' ms\n';
        }

        app.cstage.x = Math.floor(-camera.x);
        app.cstage.y = Math.floor(-camera.y);
        app.cstage.scale.x = camera.zoom;
        app.cstage.scale.y = camera.zoom;
        app.cstage.updateLayersOrder();

        let mousePos = game.getMousePosition();
        if (mousePos && (mousePos.x || mousePos.y)) {
            gmx = mousePos.x;
            gmy = mousePos.y;
        }

        let listener_pos = getListenerPos();
        if (listener_pos && listener_pos.x && listener_pos.y) {
            try {
                Howler.pos(listener_pos.x / 100000, 0, listener_pos.y / 100000);
            } catch (e) {
                console.error('Sound error 2:', e);
            }
        }
    }

    setInterval(function() {
        if (window.ga) {
            ga('send', 'event', 'heartbeat', '60s');
        }
    }, 60000);

    Math.PI2 = Math.PI * 2;
    Math.angleBetween = function (p1, p2) {
        return Math.atan2(p2.y - p1.y, p2.x - p1.x);
    };
    Math.distanceBetween = function (p1, p2) {
        return Math.sqrt(Math.pow((p1.x - p2.x), 2) + Math.pow((p1.y - p2.y), 2));
    };
    Math.deg2rad = function(degrees) {
        return degrees * (Math.PI/180);
    };
    Math.rad2deg = function(radians) {
        return radians * (180/Math.PI);
    };
    Math.magnitude = function (p1) {
        return Math.hypot(p1.dx, p1.dy);
    };
    Math.dot = function (p1, p2) {
        return (p1.x*p2.x) + (p1.y*p2.y);
    };
    Math.randomInt = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min)
    };
    Math.vallerp = function (val1, val2, value) {
        return val1 + (val2 - val1) * value;
    };
    Math.lerp = function (vec1, vec2, value) {
        return {
            x: vec1.x + (vec2.x - vec1.x) * value,
            y: vec1.y + (vec2.y - vec1.y) * value
        };
    };
})();