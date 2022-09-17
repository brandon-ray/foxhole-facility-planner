const game = {
    services: {},
    settings: {
        quality: 'auto',
        disableSound: false,
        disableHUD: false,
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

const DISABLE_SOUNDS = false;
const fontFamily = ['Recursive', 'sans-serif'];

const COLOR_FRIENDLY = 0x276884;
const COLOR_ENEMY = 0xf22306;
const COLOR_FRIENDLY_BRIGHT = 0x43add9;
const COLOR_ENEMY_BRIGHT = 0xef3f25;

const snapshotRate = 1000/10;

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
    let currentBuildingOffset = {
        x: 0,
        y: 0
    };

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
        background: 'grass.jpg',
        wall: 'wall.png',
        concrete: 'concrete.png'
    };
    for (let i=0; i<window.objectData.buildings_list.length; i++) {
        let building = window.objectData.buildings_list[i];
        asset_list[building.icon] = building.icon;
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
            }),
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
        background.tileScale.set(0.1);
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
        debugText.x = 10;
        debugText.y = 500;
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
        return {
            x: camera.x + WIDTH / 2,
            y: camera.y + HEIGHT / 2,
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
        if (dist >= 1200 || so.entity.z !== listener_pos.z) {
            soundStop(so);
            return null;
        }

        let final_vol = 0;
        let ignorePos = false;
        if (dist <= 150) {
            final_vol = so.volume;
            ignorePos = true;
        } else {
            let percent = (1 - (dist / 1200));
            let vol = so.volume * percent;

            if (percent <= 0.05) {
                soundStop(so);
                return null;
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
                    so.sound.pos((so.entity.x * camera.zoom) / 100000, 0, (so.entity.y * camera.zoom) / 100000, so.id);
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

    let lastmx = 0;
    let lastmy = 0;
    let mdx = 0;
    let mdy = 0;
    let eventPrefix = 'mouse';
    if (isMobile) {
        eventPrefix = 'pointer';
    }

    let mouseEventListenerObject = game.app.view;
    let dragCamera = false;
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
        if (mouseButton === 0) {
            if (!currentBuilding) {
                for (let i=0; i<entities.length; i++) {
                    let entity = entities[i];
                    let entityCenter = {
                        x: entity.x + entity.width/2,
                        y: entity.y + entity.height/2
                    }
                    if (entity.type === 'building' && Math.distanceBetween(entityCenter, {x: gmx, y: gmy}) < 50) {
                        currentBuildingOffset = {
                            x: gmx - entity.x,
                            y: gmy - entity.y
                        };
                        currentBuilding = entity;
                    }
                }
            }
        } else if (mouseButton === 1 || mouseButton === 4) {
            dragCamera = true;
        } else if (mouseButton === 2) {
            if (currentBuilding) {
                currentBuilding.remove();
                currentBuilding = null;
            }
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
        if (mouseButton === 0) {
            if (currentBuilding) {
                currentBuilding = null;
                game.playSound('button_click');
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

        entity.onRemove = function () {};

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

    window.onbeforeunload = function() {
        if (!game.disconnected && !game.isInMenu && socket && socket.connected) {
            return 'Are you sure you want to leave?';
        }
    };

    function createBuilding(type, x, y, z, netData) {
        let entity = createEntity('building', type, x, y, z, netData);

        let building = window.objectData.buildings[type];
        let sprite = new PIXI.TilingSprite(resources['wall'].texture);
        sprite.width = building.width * 32;
        sprite.height = building.length * 32;
        entity.addChild(sprite);

        if (building.texture && resources[building.texture]) {
            sprite.texture = resources[building.texture].texture;
            sprite.tileScale.set(0.5);
        }

        if (!building.texture) {
            let icon = new PIXI.Sprite(resources[building.icon].texture);
            icon.anchor.set(0.5);
            icon.width = 64;
            icon.height = 64;
            icon.position.x = sprite.width / 2;
            icon.position.y = sprite.height / 2;
            entity.addChild(icon);
        }

        return entity;
    }

    game.startBuild = function(building) {
        currentBuilding = createBuilding(building.key, 0, 0, 0, {});
        currentBuildingOffset = {
            x: currentBuilding.width/2,
            y: currentBuilding.height/2
        };
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

        let gridSize = 32;
        if (currentBuilding) {
            currentBuilding.x = gmx - currentBuildingOffset.x;
            currentBuilding.y = gmy - currentBuildingOffset.y;

            if (keys[17]) {
                currentBuilding.x = Math.floor(currentBuilding.x/gridSize) * gridSize;
                currentBuilding.y = Math.floor(currentBuilding.y/gridSize) * gridSize;
            }
        }

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
        if (window.ga && socket && socket.connected && !game.isInMenu) {
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