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
        selectedFaction: null,
        selectedTier: 3,
        displayFactionTheme: true,
        defaultBuildingCategory: 'all',
        showUpgradesAsBuildings: false,
        showFacilityName: true,
        showRanges: false,
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
            game.settings = Object.assign({}, game.settings, JSON.parse(newSettings));
        }
    }
} catch(e) {
    console.error('Failed to parse settings.');
}

const COLOR_WHITE = 0xFFFFFF; // Also resets tint.
const COLOR_DARKGREY = 0x505050;
const COLOR_CHARCOAL = 0x0B0B0B;
const COLOR_BLACK = 0x000000;
const COLOR_ORANGE = 0xFF8F00;
const COLOR_RED = 0xFF0000;

const COLOR_SELECTION = 0xE16931; // Orange
const COLOR_SELECTION_BORDER = 0xFF8248; // Lighter Orange

const COLOR_RANGE = 0x72FF5A; // Green
const COLOR_RANGE_BORDER = 0xED2323; // Red

const fontFamily = ['Recursive', 'sans-serif'];

(function() {
    let ENABLE_DEBUG = false;
    let running = false;
    let WIDTH = window.innerWidth;
    let HEIGHT = window.innerHeight;
    let GRID_WIDTH = 10000;
    let GRID_HEIGHT = 10000;
    let MAP_WIDTH = 4000;
    let MAP_HEIGHT = 4000;
    let idleTime = 0;
    let latency = 0;

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
        backgroundColor: COLOR_BLACK,
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
    let selectedEntities = [];
    let selectedBezierPoint = null;
    let pickupSelectedEntities = false;
    let pickupTime = null;
    let pickupPosition = null;
    let effects = [];

    game.facilityName = 'Unnamed Facility';
    game.selectedBuildingCategory = game.settings.defaultBuildingCategory;

    game.getEntities = () => {
        return entities;
    };

    game.getSelectedEntities = () => {
        return selectedEntities;
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
        icon_background: 'icon_background.jpg',
        white: 'white.png',
        background: 'grid_32.webp',
        building_background: 'building_background.png'
    };
    for (let i=0; i<window.objectData.buildings_list.length; i++) {
        let building = window.objectData.buildings_list[i];
        if (building.icon) {
            asset_list[building.icon] = building.icon;
        }

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

    game.updateRangeSprites = function() {
        for (let i = 0; i < entities.length; i++) {
            let entity = entities[i];
            if (!entity.selected && entity.rangeSprite) {
                entity.rangeSprite.visible = game.settings.showRanges;
            }
        }
    }

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

    app.view.tabIndex = 0;

    let keys = {};
    document.addEventListener('keydown', function (event) {
        if (!(document.activeElement && (document.activeElement.type === 'text' || document.activeElement.type === 'number'))) {
            event = event || window.event;
            let key = event.keyCode;
            switch (key) {
                case 113: // F2
                    ENABLE_DEBUG = !ENABLE_DEBUG;
                    if (debugText) {
                        debugText.visible = ENABLE_DEBUG;
                    }
                    break;
                case 27: // Escape
                    if (!selectionArea?.visible) {
                        game.deselectEntities();
                    }
                    break;
                case 46: // Delete
                    game.deselectEntities(true);
                    break;
                case 65: // A
                    if (event.ctrlKey) {
                        entities.forEach(entity => {
                            game.addSelectedEntity(entity, false);
                        });
                        game.updateSelectedBuildingMenu();
                    }
                    break;
                case 67: // C
                    if (event.ctrlKey) {
                        game.cloneSelected();
                    }
                    break;
                case 76: // L
                    game.lockSelected();
                    break;
                case 119: // F8
                    if (ENABLE_DEBUG) {
                        setTimeout(() => {
                            let x = 0;
                            let y = 0;
                            for (let i=0; i<1000; i++) {
                                let buildingData = window.objectData.buildings_list[Math.floor(Math.random()*window.objectData.buildings_list.length)];
                                createBuilding(buildingData.key, x, y, 0);
                                x += 500;
                                if (x >= 10000) {
                                    x = 0;
                                    y += 500;
                                }
                            }
                        }, 1000);
                    }
                    break;
            }
            if (!keys[key]) {
                keys[key] = true;
            }
        }
    });

    document.addEventListener('keyup', function (event) {
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
    let selectionArea = null;

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

        background = new PIXI.TilingSprite(resources['background'].texture);
        background.getZIndex = function () {
            return 100000;
        };
        background.width = GRID_WIDTH;
        background.height = GRID_HEIGHT;
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
        debugText.style.fill = COLOR_WHITE;
        debugText.style.fontFamily = fontFamily;
        debugText.anchor.x = 0;
        debugText.x = WIDTH*0.22;
        debugText.y = 12;
        debugText.getZIndex = function () {
            return -100000;
        };
        app.stage.addChild(debugText);

        selectionArea = new PIXI.Graphics();
        selectionArea.visible = false;
        selectionArea.alpha = 0.3;
        selectionArea.getZIndex = function () {
            return -1000000000;
        };
        app.cstage.addChild(selectionArea);

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

    game.downloadSave = function(isSelection) {
        let saveObject = {
            name: game.facilityName,
            faction: game.settings.selectedFaction,
            entities: []
        };
        let saveEntities = isSelection ? selectedEntities : entities;
        for (let i = 0; i < saveEntities.length; i++) {
            let entity = saveEntities[i];
            let entityData = {
                x: parseFloat(entity.x),
                y: parseFloat(entity.y),
                z: parseInt(entity.z),
                rotation: entity.rotation,
                locked: entity.locked,
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
        if (isSelection) {
            fileName += '_selection';
        }
        download(JSON.stringify(saveObject), fileName, 'application/json')
    };

    game.loadSave = function(saveObject, isSelection) {
        if (isSelection) {
            game.deselectEntities(false, true);
        } else {
            game.removeEntities();
            game.setFaction(saveObject.faction);
        }
        setTimeout(() => {
            let xTotal = 0, yTotal = 0;
            for (let i=0; i<saveObject.entities.length; i++) {
                let entityData = saveObject.entities[i];
                let entity;
                switch (entityData.type) {
                    case 'building':
                        entity = createBuilding(entityData.subtype, parseFloat(entityData.x), parseFloat(entityData.y), parseInt(entityData.z));
                        break;
                    default:
                        console.error('Attempted to load invalid entity:', entityData);
                        continue;
                }
                if (entity) {
                    entity.rotation = entityData.rotation;
                    entity.locked = entityData.locked;
                    entity.onLoad(entityData);
                    if (isSelection) {
                        game.addSelectedEntity(entity, true);
                        xTotal += parseFloat(entity.x);
                        yTotal += parseFloat(entity.y);
                    }
                }
            }
            if (isSelection) {
                let centerPos = {
                    x: Math.round(xTotal/saveObject.entities.length),
                    y: Math.round(yTotal/saveObject.entities.length)
                }
                game.setPickupEntities(true, false, centerPos, true);
                game.updateSelectedBuildingMenu();
            } else {
                game.zoomToFacilityCenter();
            }
        }, 1);
    };

    game.zoomToFacilityCenter = function() {
        let xTotal = 0;
        let yTotal = 0;
        if (entities?.length) {
            for (let i=0; i < entities.length; i++) {
                let entity = entities[i];
                xTotal += parseFloat(entity.x);
                yTotal += parseFloat(entity.y);
            }
            camera.x = Math.round(xTotal/entities.length) - WIDTH/2;
            camera.y = Math.round(yTotal/entities.length) - HEIGHT/2;
        } else {
            camera.x = (GRID_WIDTH/2) - WIDTH/2;
            camera.y = (GRID_HEIGHT/2) - HEIGHT/2;
        }
        game.resetZoom();
    }
    game.zoomToFacilityCenter();

    game.setFaction = function(faction) {
        if (game.settings.selectedFaction !== faction) {
            game.settings.selectedFaction = faction;
            game.updateSettings();
        }
    }

    game.selectEntity = function(entity) {
        game.appComponent.bmc();
        game.deselectEntities(false, true);
        return game.addSelectedEntity(entity);
    }

    game.selectEntities = function(entities) {
        if (entities?.length) {
            game.deselectEntities(false, true);
            entities.forEach(entity => {
                game.addSelectedEntity(entity, true);
            });
            game.updateSelectedBuildingMenu();
        }
    }

    game.getSelectedEntity = function() {
        return selectedEntities.length === 1 ? selectedEntities[0] : null;
    }

    game.addSelectedEntity = function(entity, noMenuUpdate) {
        game.setPickupEntities(false);
        if (entity?.selected === false) {
            selectedEntities.push(entity);
            entity.onSelect();
            if (!noMenuUpdate) {
                game.updateSelectedBuildingMenu();
            }
            return true;
        }
        return false;
    }

    game.removeSelectedEntity = function(entity, noMenuUpdate) {
        game.setPickupEntities(false);
        if (entity?.selected) {
            for (let i = 0; i < selectedEntities.length; i++) {
                let selectedEntity = selectedEntities[i];
                if (selectedEntity === entity) {
                    selectedEntities.splice(i, 1);
                    entity.onDeselect();
                    break;
                }
            }
            if (!noMenuUpdate) {
                game.updateSelectedBuildingMenu();
            }
            return true;
        }
        return false;
    }

    game.deselectEntities = function(remove, noMenuUpdate) {
        if (selectedEntities.length) {
            game.setPickupEntities(false);
            for (let i = 0; i < selectedEntities.length; i++) {
                let selectedEntity = selectedEntities[i];
                if (remove) {
                    selectedEntity.selected = false; // Ensures we don't call game.removeSelectedEntity
                    selectedEntity.remove();
                    continue;
                }
                selectedEntity.onDeselect();
            }
            selectedEntities = [];
            if (!noMenuUpdate) {
                game.updateSelectedBuildingMenu();
            }
            return true;
        }
        return false;
    }

    game.updateSelectedBuildingMenu = function() {
        let buildingMenuSelected = game.sidebarMenuComponent?.currentMenu?.key === 'building-selected';
        if (selectedEntities.length) {
            if (!buildingMenuSelected) {
                game.sidebarMenuComponent.changeMenu({
                    key: 'building-selected',
                    name: 'Building',
                    icon: 'fa-wrench'
                });
            } else {
                game.buildingSelectedMenuComponent?.refresh();
            }
        } else if (buildingMenuSelected) {
            game.sidebarMenuComponent.changeMenu(null);
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
    let mouseDown = {};
    let forceMouseDown = {};
    mouseEventListenerObject.addEventListener('wheel', (e) => {
        if (!e.ctrlKey) {
            let lastZoom = camera.zoom;
            camera.zoom -= (e.deltaY * 0.0005);
            if (camera.zoom > 1.6) {
                camera.zoom = 1.6;
            }
            if (camera.zoom < 0.1) {
                camera.zoom = 0.1;
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
        }
    });
    mouseEventListenerObject.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    }, false);
    mouseEventListenerObject.addEventListener(eventPrefix + 'down', (e) => {
        e.preventDefault();
        
        game.tryGameFocus(true);

        mx = e.clientX;
        my = e.clientY;

        let mouseButton = e.button;
        mouseDown[mouseButton] = true;
        if (mouseButton === 0) {
            if (!selectedBezierPoint) {
                if (pickupSelectedEntities) {
                    let selectedEntity = game.getSelectedEntity();
                    if (selectedEntity?.bezier && selectedEntity.shouldSelectLastRailPoint) {
                        selectedEntity.grabBezierPoint();
                    }
                } else {
                    entities.sort(function (a, b) {
                        return a.getZIndex() - b.getZIndex()
                    });
                    for (let i=0; i<entities.length; i++) {
                        let entity = entities[i];
                        if (entity.type === 'building' && entity.canGrab()) {
                            if (keys[46]) {
                                entity.remove();
                            } else {
                                if (!entity.selected) {
                                    if (e.ctrlKey || e.shiftKey) {
                                        game.addSelectedEntity(entity);
                                    } else {
                                        game.selectEntity(entity);
                                    }
                                } else if (!entity.grabBezierPoint() && (e.ctrlKey || e.shiftKey)) {
                                    game.removeSelectedEntity(entity);
                                }
                                game.setPickupEntities(true);
                            }
                            return;
                        }
                    }
                    if (!(e.ctrlKey || e.shiftKey)) {
                        game.deselectEntities();
                        if (selectionArea) {
                            selectionArea.origin = { x: gmx, y: gmy };
                        }
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

        if (selectionArea && selectionArea.origin) {
            selectionArea.clear();
            selectionArea.x = selectionArea.origin.x > gmx ? gmx : selectionArea.origin.x;
            selectionArea.y = selectionArea.origin.y > gmy ? gmy : selectionArea.origin.y;
            selectionArea.beginFill(COLOR_SELECTION);
            selectionArea.lineStyle(4, COLOR_SELECTION_BORDER);
            selectionArea.drawRect(0, 0, Math.abs(gmx - selectionArea.origin.x), Math.abs(gmy - selectionArea.origin.y));
            selectionArea.endFill();

            if (!selectionArea.visible) {
                selectionArea.visible = true;
            }

            let selectedChange = false;
            entities.forEach(entity => {
                let eX = entity.x, eY = entity.y;
                if (entity.bezier) {
                    // This should probably be stored somewhere.
                    let bounds = entity.bezier.bbox();
                    let rotatedPoint = Math.rotateAround(entity, { x: eX + bounds.x.mid, y: eY + bounds.y.mid }, -entity.rotation);
                    eX = rotatedPoint.x;
                    eY = rotatedPoint.y;
                }
                if (eX > selectionArea.x && eX < selectionArea.x + selectionArea.width) {
                    if (eY > selectionArea.y && eY < selectionArea.y + selectionArea.height) {
                        if (game.addSelectedEntity(entity, true)) {
                            selectedChange = true;
                        }
                        return;
                    }
                }
                if (game.removeSelectedEntity(entity, true)) {
                    selectedChange = true;
                }
            });
            if (selectedChange) {
                game.updateSelectedBuildingMenu();
            }
        }
    });
    document.addEventListener(eventPrefix + 'up', (e) => {
        mx = e.clientX;
        my = e.clientY;

        let mouseButton = e.button;
        mouseDown[mouseButton] = false;
        if (forceMouseDown[mouseButton]) {
            mouseDown[mouseButton] = true;
            forceMouseDown[mouseButton] = false;
        }
        if (mouseButton === 0) {
            if (selectionArea) {
                selectionArea.origin = null;
                selectionArea.visible = false;
            }
            if (pickupSelectedEntities) {
                game.setPickupEntities(false);
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
        if (!building) {
            console.error('Invalid building type:', type);
            entity.remove();
            return;
        }

        entity.building = building;
        entity.selected = false;

        if (building.range) {
            entity.rangeSprite = new PIXI.Graphics();
            entity.rangeSprite.beginFill(building.rangeColor ?? COLOR_RANGE);
            entity.rangeSprite.alpha = 0.25;
            entity.rangeSprite.visible = false;
            entity.rangeSprite.drawCircle(0, 0, building.range * METER_PIXEL_SIZE);
            entity.rangeSprite.endFill();
            if (building.overlapDist) {
                entity.rangeSprite.lineStyle(10, COLOR_RANGE_BORDER, 1);
                entity.rangeSprite.drawCircle(0, 0, building.overlapDist * METER_PIXEL_SIZE);
            }
            entity.addChild(entity.rangeSprite);
        }

        let sprite;
        if (!building.isBezier) {
            sprite = new PIXI.TilingSprite(resources['building_background'].texture);
            sprite.width = building.width * METER_PIXEL_SIZE;
            sprite.height = building.length * METER_PIXEL_SIZE;
            sprite.anchor.set(0.5);
            entity.addChild(sprite);
            entity.sprite = sprite;
            
            if (!building.texture || !building.textureIcon?.disabled) {
                sprite.tint = (building.color ? building.color : (buildingCategories[building.category] ? buildingCategories[building.category].color : COLOR_DARKGREY));
                if (building.texture?.border !== false) {
                    let spriteBorder = new PIXI.Graphics();
                    spriteBorder.lineStyle(4, COLOR_WHITE);
                    spriteBorder.drawRect(-(sprite.width/2), -(sprite.height/2), sprite.width, sprite.height);
                    entity.addChild(spriteBorder);
                }
            }
        }

        let frameX = 0;
        let frameY = 0;
        let frameWidth = 0;
        let frameHeight = 0;
        let sheet = null;
        if (building.texture && !building.isBezier) {
            if (typeof building.texture === 'object' && !Array.isArray(building.texture)) {
                sheet = loadSpritesheet(resources[building.texture.sheet].texture, building.texture.width, building.texture.height);
                frameWidth = Math.floor(resources[building.texture.sheet].texture.width/building.texture.width);
                frameHeight = Math.floor(resources[building.texture.sheet].texture.height/building.texture.height);
                entity.removeChild(sprite);
                sprite = new PIXI.Sprite(sheet[0][0]);
                sprite.width = building.width * METER_PIXEL_SIZE;
                sprite.height = building.length * METER_PIXEL_SIZE;
                sprite.anchor.set(0.5);
                entity.addChild(sprite);
            } else if (resources[building.texture]) {
                sprite.texture = resources[building.texture].texture;
            }
            entity.sprite = sprite;
        }

        let buildingIcon = building.parent?.icon ?? building.icon;
        if (sprite && buildingIcon && (!building.textureIcon || !building.textureIcon?.disabled)) {
            let iconPadding = 28;
            let iconWidth = sprite.width - iconPadding;
            iconWidth = iconWidth > 128 ? 128 : iconWidth;
            iconWidth = iconWidth > sprite.height ? sprite.height - iconPadding : iconWidth;
            let iconHeight = iconWidth;
            let iconYOffset = 0;
            let iconTexture = resources[buildingIcon].texture;

            if (building.textureIcon) {
                iconWidth = building.textureIcon.width ?? iconWidth;
                iconHeight = building.textureIcon.height ?? iconHeight;
                iconYOffset = building.textureIcon.y ?? iconYOffset;

                // Crop the icon if necessary. This icon / texture should be stored inside of resources and on building data in the future.
                if (iconWidth !== iconHeight) {
                    let meterWidth = iconTexture.width;
                    let meterHeight = iconTexture.height;
                    if (iconWidth > iconHeight) {
                        meterHeight = meterHeight * ((iconHeight / METER_PIXEL_SIZE) / (iconWidth / METER_PIXEL_SIZE));
                    } else {
                        meterWidth = meterWidth * ((iconWidth / METER_PIXEL_SIZE) / (iconHeight / METER_PIXEL_SIZE));
                    }
                    iconTexture = new PIXI.Texture(iconTexture, new PIXI.Rectangle(((iconTexture.width - meterWidth) / 2), ((iconTexture.height - meterHeight) / 2), meterWidth, meterHeight));
                }
            }

            if (iconWidth !== sprite.width && iconHeight !== sprite.height) {
                let iconBackground = new PIXI.Graphics();
                iconBackground.lineStyle(4, COLOR_WHITE);
                iconBackground.beginFill(COLOR_CHARCOAL);
                iconBackground.drawRect(-(iconWidth/2), -(iconHeight/2) + iconYOffset, iconWidth, iconHeight);
                iconBackground.endFill();
                entity.addChild(iconBackground);
            }

            let icon = new PIXI.Sprite(iconTexture);
            icon.y = iconYOffset;
            icon.width = iconWidth - 10;
            icon.height = iconHeight - 10;
            icon.anchor.set(0.5, 0.5);
            entity.addChild(icon);
        }

        // We'll have to do something special for rails and roads, maybe a sprite or something that can be overlayed on top of them in the same way the rail / road textures are done.
        let borderWidth = 6;
        entity.selectedBorder = new PIXI.Graphics();
        entity.selectedBorder.visible = false;
        entity.selectedBorder.lineStyle(borderWidth, COLOR_ORANGE);
        entity.selectedBorder.drawRect(-(entity.width/2)-borderWidth, -(entity.height/2)-borderWidth, entity.width+(borderWidth*2), entity.height+(borderWidth*2));
        entity.addChild(entity.selectedBorder);

        if (entity.rangeSprite) {
            entity.rangeSprite.visible = game.settings.showRanges;
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
                    point.handle.visible = entity.selected;
                }
            }
        };

        entity.onSelect = function() {
            entity.selected = true;
            entity.selectedBorder.tint = entity.locked ? COLOR_RED : COLOR_WHITE;
            entity.selectedBorder.visible = true;

            if (entity.rangeSprite && !entity.rangeSprite.visible) {
                entity.rangeSprite.visible = true;
            }

            entity.updateHandles();
        };

        const TRACK_SEGMENT_LENGTH = 16;
        entity.onDeselect = function() {
            entity.selected = false;
            entity.selectedBorder.visible = false;
            entity.prevRotation = null;

            if (entity.rangeSprite && !game.settings.showRanges) {
                entity.rangeSprite.visible = false;
            }

            if (entity.bezier && entity.bezier.length() <= TRACK_SEGMENT_LENGTH) {
                entity.remove();
            }

            entity.updateHandles();
        };

        let sound = null;
        entity.tick = function() {
            if (entity.sprite) {
                entity.visible = entity.isVisible();
            }

            if (sheet && entity.visible) {
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

            if (entity.visible && !pickupSelectedEntities && entity.selected && !entity.selectedBorder.visible) {
                entity.selectedBorder.visible = true;
            }

            if (entity.visible && building.isBezier) {
                if (selectedBezierPoint && !mouseDown[0]) {
                    selectedBezierPoint = null;
                }

                if (entity.selected && !entity.locked && mouseDown[0]) {
                    let gridSize = game.settings.gridSize ? game.settings.gridSize : 16;
                    let gmxGrid = gmx;
                    let gmyGrid = gmy;
                    if (game.settings.enableGrid || keys[16]) {
                        gmxGrid = Math.floor(gmxGrid / gridSize) * gridSize;
                        gmyGrid = Math.floor(gmyGrid / gridSize) * gridSize;
                    }
                    let mousePos = entity.toLocal({x: gmxGrid, y: gmyGrid}, app.cstage, undefined, true);
                    if (selectedBezierPoint) {
                        game.setPickupEntities(false);
                        if (selectedBezierPoint.index === 0) {
                            entity.x = gmx;
                            entity.y = gmy;

                            if (game.settings.enableGrid || keys[16]) {
                                entity.x = Math.floor(entity.x / gridSize) * gridSize;
                                entity.y = Math.floor(entity.y / gridSize) * gridSize;
                            }
                        } else {
                            if (mouseDown[2]) {
                                let angle = Math.angleBetween(selectedBezierPoint, mousePos);
                                if (game.settings.enableSnapRotation) {
                                    let snapRotationDegrees = Math.deg2rad(game.settings.snapRotationDegrees ? game.settings.snapRotationDegrees : 15);
                                    angle = Math.floor(angle / snapRotationDegrees) * snapRotationDegrees;
                                }
                                selectedBezierPoint.rotation = angle + Math.PI;
                            } else {
                                selectedBezierPoint.x = mousePos.x;
                                selectedBezierPoint.y = mousePos.y;
                            }

                            if (Math.abs(selectedBezierPoint.y) < 25) {
                                selectedBezierPoint.y = 0;
                            }
                        }

                        for (let i=0; i<entities.length; i++) {
                            let entity2 = entities[i];
                            if (entity2 === entity || entity2.type !== 'building' || entity2.subtype !== entity.subtype || !entity2.bezier) {
                                continue;
                            }
                            let selectedPointToEntity2Local = entity2.toLocal(selectedBezierPoint, entity, undefined, true);
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
                                selectedBezierPoint.x = local.x;
                                selectedBezierPoint.y = local.y;

                                let currentRot = entity.rotation + selectedBezierPoint.rotation;
                                let angleRight = entity2.rotation + (angle - Math.PI/2) - Math.PI/2;
                                let angleLeft = entity2.rotation + (angle + Math.PI/2) - Math.PI/2;
                                let rightDiff = Math.atan2(Math.sin(angleRight-currentRot), Math.cos(angleRight-currentRot));
                                let leftDiff = Math.atan2(Math.sin(angleLeft-currentRot), Math.cos(angleLeft-currentRot));

                                if (rightDiff < leftDiff) {
                                    selectedBezierPoint.rotation = (angleRight + Math.PI/2) - entity.rotation;
                                } else {
                                    selectedBezierPoint.rotation = (angleLeft + Math.PI/2) - entity.rotation;
                                }
                                break;
                            }
                        }

                        const MAX_SEGMENT_DISTANCE = entity.building.maxLength * METER_PIXEL_SIZE;
                        if (selectedBezierPoint.index === 1) {
                            let dist = Math.distanceBetween({x: 0, y: 0}, selectedBezierPoint);
                            let angle = Math.angleBetween({x: 0, y: 0}, selectedBezierPoint);
                            if (dist > MAX_SEGMENT_DISTANCE) {
                                dist = MAX_SEGMENT_DISTANCE;
                            }
                            selectedBezierPoint.x = Math.cos(angle) * dist;
                            selectedBezierPoint.y = Math.sin(angle) * dist;
                        }

                        entity.regenerate();
                        let curve1 = entity.bezier.curvature(0.25);
                        let curve2 = entity.bezier.curvature(0.5);
                        let curve3 = entity.bezier.curvature(0.75);
                        if ((curve1.r !== 0 && (Math.abs(curve1.r) < 100 || Math.abs(curve2.r) < 200 || Math.abs(curve3.r) < 100)) || selectedBezierPoint.x < 0) {
                            entity.sprite.tint = COLOR_RED;
                        } else {
                            entity.sprite.tint = COLOR_WHITE;
                        }

                        if (selectedBezierPoint.handle) {
                            selectedBezierPoint.handle.position.x = selectedBezierPoint.x;
                            selectedBezierPoint.handle.position.y = selectedBezierPoint.y;
                        }
                    }
                }
            }
        };

        entity.grabBezierPoint = function() {
            if (entity.selected && entity.bezier) {
                if (entity.shouldSelectLastRailPoint) {
                    entity.shouldSelectLastRailPoint = false;
                    forceMouseDown[0] = true;
                    selectedBezierPoint = points[1];
                    return true;
                } else {
                    let mousePos = entity.toLocal({x: gmx, y: gmy}, app.cstage, undefined, true);
                    for (let i = 1; i < points.length; i++) {
                        let point = points[i];
                        if (Math.distanceBetween(mousePos, point) < 20) {
                            game.selectEntity(entity);
                            selectedBezierPoint = point;
                            return true;
                        }
                    }
                }
            }
            return false;
        }

        let boundsBuffer = 15;
        entity.canGrab = function() {
            let bounds = entity.getBounds(true);
            let boundsAdjustedPos = app.cstage.toLocal({x: bounds.x, y: bounds.y}, app.stage, undefined, true);
            bounds.x = boundsAdjustedPos.x - boundsBuffer;
            bounds.y = boundsAdjustedPos.y - boundsBuffer;
            bounds.width = bounds.width/game.camera.zoom;
            bounds.height = bounds.height/game.camera.zoom;
            bounds.width += boundsBuffer * 2;
            bounds.height += boundsBuffer * 2;

            if (gmx >= bounds.x && gmx <= bounds.x+bounds.width && gmy >= bounds.y && gmy <= bounds.y+bounds.height) {
                if (entity.building?.isBezier && entity.bezier) {
                    let mousePos = entity.toLocal({x: gmx, y: gmy}, app.cstage, undefined, true);
                    let projection = entity.bezier.project(mousePos);
                    if (projection.d <= 25) {
                        return true;
                    }
                } else if (entity.sprite) {
                    // https://stackoverflow.com/a/67732811 <3
                    const w = entity.sprite.width / 2;
                    const h = entity.sprite.height / 2;
                    const r = entity.rotation;

                    // Create new oriented bounds.
                    const [ax, ay] = [Math.cos(r), Math.sin(r)];
                    const t = (x, y) => ({x: x * ax - y * ay + entity.x, y: x * ay + y * ax + entity.y});
                    const bBounds = [t(w, h), t(-w, h), t(-w, -h), t(w, -h)];

                    // Check if mouse position is within new bounds.
                    let i = 0;
                    const l = {p1: bBounds[3]};
                    while (i < bBounds.length) {
                        l.p2 = bBounds[i++];
                        if (!(0 < (l.p2.x - l.p1.x) * (gmy - l.p1.y) - (l.p2.y - l.p1.y) * (gmx - l.p1.x))) {
                            return false;
                        }
                        l.p1 = l.p2;
                    }
                    return true;
                }
            }
            return false;
        };

        entity.getZIndex = function() {
            return -entity.y - (building.sortOffset ? building.sortOffset : 0) - (entity.selected ? 10000000 : 0);
        };

        entity.onRemove = function() {
            if (entity.selected) {
                game.removeSelectedEntity(entity);
            }
            if (selectedBezierPoint) {
                selectedBezierPoint = null;
            }
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
            if (entity.building?.isBezier) {
                entityData.railPoints = [];
                for (let i=0; i<points.length; i++) {
                    let point = points[i];
                    entityData.railPoints.push({
                        x: point.x,
                        y: point.y,
                        rotation: point.rotation
                    });
                }
            } else {
                entityData.selectedProduction = entity.selectedProduction;
            }
        };
        entity.onLoad = function(entityData) {
            if (typeof entityData.selectedProduction === 'number') {
                entity.selectedProduction = entityData.selectedProduction;
            }

            if (entity.building?.isBezier && entityData.railPoints) {
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
                rotation: isNaN(rotation) ? Math.PI : rotation
            };
            points.splice(index, 0, newPoint);

            if (index !== 0) {
                let handle = new PIXI.Sprite(resources.white.texture);
                handle.anchor.set(0.5);
                handle.visible = entity.selected;
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

        if (entity.building?.isBezier) {
            entity.addPoint(0, 0);
            entity.addPoint(200, 0);
        }

        return entity;
    }

    game.setPickupEntities = function(pickup, ignoreOffset, position, ignoreLock) {
        if (pickupSelectedEntities !== pickup) {
            if (!pickup) {
                pickupSelectedEntities = false;
            }
            let locked = false;
            selectedEntities.forEach(entity => {
                if (!ignoreLock && entity.locked) {
                    locked = true;
                } else if (!locked) {
                    entity.pickupOffset = {
                        x: ignoreOffset ? (entity.building.isBezier ? 100 : 0) : (position?.x ?? gmx) - entity.x,
                        y: ignoreOffset ? 0 : (position?.y ?? gmy) - entity.y
                    };
                }
            });
            if (!locked) {
                if (pickup) {
                    pickupTime = Date.now();
                    pickupPosition = {x: gmx, y: gmy};
                }
                pickupSelectedEntities = pickup;
            }
        }
    }

    game.startBuild = function(buildingData) {
        let entity = createBuilding(buildingData.key, 0, 0, 0, {});
        game.selectEntity(entity);
        game.setPickupEntities(true, true);
        if (entity.building?.isBezier) {
            entity.shouldSelectLastRailPoint = true;
        }
        return entity;
    };

    function cloneBuilding(entity, upgrade) {
        if (entity) {
            let clone = createBuilding(upgrade ?? entity.building.key, entity.x, entity.y, 0);
            clone.locked = entity.locked;
            clone.selectedBorder.tint = clone.locked ? COLOR_RED : COLOR_WHITE;
            clone.rotation = entity.rotation;
            let entityData = {};
            entity.onSave(entityData);
            clone.onLoad(entityData);
            if (upgrade) {
                clone.selectedProduction = null;
            }
            return clone;
        }
        return null;
    }

    game.upgradeBuilding = function(entity, upgrade) {
        let bData = entity?.building;
        if (bData) {
            if (upgrade) {
                upgrade = bData.parentKey ? bData.parentKey + '_' + upgrade : bData.key + '_' + upgrade;
                upgrade = bData.key === upgrade ? bData.parentKey || bData.key : upgrade;
            }
            let clone = cloneBuilding(entity, upgrade);
            if (upgrade) {
                game.selectEntity(clone);
                entity.remove();
            }
            return clone;
        }
        return null;
    }

    game.cloneSelected = function() {
        let clonedEntities = [];
        let xTotal = 0, yTotal = 0;
        selectedEntities.forEach(selectedEntity => {
            let clone = cloneBuilding(selectedEntity);
            clonedEntities.push(clone);
            xTotal += parseFloat(clone.x);
            yTotal += parseFloat(clone.y);
        });
        game.selectEntities(clonedEntities);
        let centerPos = {
            x: Math.round(xTotal/clonedEntities.length),
            y: Math.round(yTotal/clonedEntities.length)
        }
        game.setPickupEntities(true, false, centerPos, true);
    }

    // Returns null = No buildings locked, 0 = Some buildings locked, 1 = All buildings locked.
    game.getSelectedLockState = function() {
        let locked = null; // Assume no buildings are locked.
        selectedEntities.every((selectedEntity, i) => {
            if (selectedEntity.locked) {
                if (locked === null) {
                    locked = i === 0 ? 1 : 0;  // Assume all are locked unless it's not the first index.
                }
            } else if (locked) {
                locked = 0; // Some selected aren't locked.
            }
            return locked !== 0;
        });
        return locked;
    }

    game.lockSelected = function() {
        let locked = game.getSelectedLockState();
        selectedEntities.forEach(selectedEntity => {
            selectedEntity.locked = !locked ? true : null;
            selectedEntity.selectedBorder.tint = selectedEntity.locked ? COLOR_RED : COLOR_WHITE;
        });
        if (locked && pickupSelectedEntities) {
            game.setPickupEntities(false);
        }
    }

    game.removeEntities = function() {
        game.deselectEntities();
        game.setPickupEntities(false);
        for (let i=0; i<entities.length; i++) {
            let entity = entities[i];
            entity.remove();
        }
    }

    const FPSMIN = 30;
    let fpsCheck = null;
    let menuInit = false;
    let lastTick = Date.now();
    let g_TICK = 10;
    let g_Time = 0;
    let selectionRotation = null;
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

        /*
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
        */

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

        if (pickupSelectedEntities) {
            game.buildingSelectedMenuComponent?.refresh(true);
            if (!selectedBezierPoint && (!pickupPosition || (Date.now()-pickupTime > 250 || Math.distanceBetween(pickupPosition, {x: gmx, y: gmy}) > 20))) {
                pickupPosition = null;
                if (mouseDown[2]) {
                    if (!selectionRotation) {
                        let cX = 0, cY = 0, rotationOffset = null;
                        selectedEntities.forEach(selectedEntity => {
                            if (rotationOffset !== false) {
                                if (rotationOffset === null) {
                                    rotationOffset = selectedEntity.rotation;
                                } else if (rotationOffset !== selectedEntity.rotation) {
                                    rotationOffset = false;
                                }
                            }
                            selectedEntity.rotationData = {
                                x: selectedEntity.x,
                                y: selectedEntity.y,
                                rotation: selectedEntity.rotation
                            }
                            let eX = selectedEntity.x, eY = selectedEntity.y;
                            if (selectedEntity.bezier) {
                                let bounds = selectedEntity.bezier.bbox();
                                let rotatedPoint = Math.rotateAround(selectedEntity, { x: eX + bounds.x.mid, y: eY + bounds.y.mid }, -selectedEntity.rotation);
                                eX = rotatedPoint.x;
                                eY = rotatedPoint.y;
                            }
                            cX += parseFloat(eX);
                            cY += parseFloat(eY);
                        });
                        cX = Math.round(cX / selectedEntities.length);
                        cY = Math.round(cY / selectedEntities.length);
                        selectionRotation = {
                            x: cX, // X center of selection.
                            y: cY, // Y center of selection.
                            angle: Math.angleBetween({ x: cX, y: cY }, { x: gmx, y: gmy }), // Angle of mouse from the center of selection.
                            offset: rotationOffset
                        }
                    }
                } else if (selectionRotation) {
                    selectionRotation = null;
                }
                let rotationAngle;
                if (selectionRotation) {
                    rotationAngle = selectionRotation.angle - Math.angleBetween(selectionRotation, { x: gmx, y: gmy }); // Get the angle of the mouse from center and subtract it from the angle of the selection.
                    if (game.settings.enableSnapRotation) {
                        let snapRotationDegrees = Math.deg2rad(game.settings.snapRotationDegrees ?? 15);
                        rotationAngle = Math.floor(rotationAngle / snapRotationDegrees) * snapRotationDegrees; // Snap the angle of the selection.
                        if (typeof selectionRotation.offset === 'number') {
                            rotationAngle -= (Math.floor(selectionRotation.offset / snapRotationDegrees) * snapRotationDegrees) - selectionRotation.offset; // Subtract the difference of the original offset.
                        }
                    }
                }
                for (let i = 0; i < selectedEntities.length; i++) {
                    let pickupEntity = selectedEntities[i];
                    if (!pickupEntity.building?.isBezier && pickupEntity.selectedBorder.visible) {
                        pickupEntity.selectedBorder.visible = false;
                    }
                    if (mouseDown[2]) {
                        if (selectionRotation) {
                            let rotatedPosition = Math.rotateAround(selectionRotation, pickupEntity.rotationData, rotationAngle);
                            pickupEntity.x = rotatedPosition.x;
                            pickupEntity.y = rotatedPosition.y;
                            pickupEntity.pickupOffset = {
                                x: gmx - pickupEntity.x,
                                y: gmy - pickupEntity.y
                            };
                            pickupEntity.rotation = pickupEntity.rotationData.rotation - rotationAngle;
                        }
                    } else {
                        pickupEntity.x = gmx - pickupEntity.pickupOffset.x;
                        pickupEntity.y = gmy - pickupEntity.pickupOffset.y;
                        if (game.settings.enableGrid || keys[16]) {
                            let gridSize = game.settings.gridSize ? game.settings.gridSize : 16;
                            let width = pickupEntity.building.width, length = pickupEntity.building.length;
                            let xOffsetWidth = (((width % Math.floor(width))) * METER_PIXEL_SIZE)/2;
                            let yOffsetHeight = (((length % Math.floor(length))) * METER_PIXEL_SIZE)/2;
                            let xOffset = (Math.cos(pickupEntity.rotation - Math.PI/2) * xOffsetWidth) + (Math.sin(pickupEntity.rotation) * yOffsetHeight);
                            let yOffset = (Math.sin(pickupEntity.rotation - Math.PI/2) * yOffsetHeight) + (Math.cos(pickupEntity.rotation) * xOffsetWidth);
                            pickupEntity.x = Math.round((Math.round(pickupEntity.x / gridSize) * gridSize) - xOffset);
                            pickupEntity.y = Math.round((Math.round(pickupEntity.y / gridSize) * gridSize) - yOffset);
                        }
                    }
                }
            }
            let pickupEntity = game.getSelectedEntity();
            if (pickupEntity && pickupEntity.building?.isBezier && !selectedBezierPoint) {
                for (let i=0; i<entities.length; i++) {
                    let entity = entities[i];
                    if (!entity.bezier) {
                        continue;
                    }
                    let mousePos = entity.toLocal({x: gmx, y: gmy}, app.cstage, undefined, true);
                    let projection = entity.bezier.project(mousePos);
                    let rotationStored = typeof pickupEntity.prevRotation === 'number';
                    if (entity !== pickupEntity && entity.type === 'building' && pickupEntity.subtype === entity.subtype && projection.d <= 25) {
                        if (projection.t >= 0.95) {
                            projection = entity.bezier.get(1);
                        } else if (projection.t <= 0.05) {
                            projection = entity.bezier.get(0);
                        }
                        let global = app.cstage.toLocal({x: projection.x, y: projection.y}, entity, undefined, true);
                        let normal = entity.bezier.normal(projection.t);
                        let angle = Math.angleBetween({x: 0, y: 0}, normal);
                        pickupEntity.x = global.x;
                        pickupEntity.y = global.y;

                        let angleRight = entity.rotation + (angle - Math.PI/2) - Math.PI/2;
                        let angleLeft = entity.rotation + (angle + Math.PI/2) - Math.PI/2;
                        let rightDiff = Math.atan2(Math.sin(angleRight-pickupEntity.rotation), Math.cos(angleRight-pickupEntity.rotation));
                        let leftDiff = Math.atan2(Math.sin(angleLeft-pickupEntity.rotation), Math.cos(angleLeft-pickupEntity.rotation));

                        if (!rotationStored) {
                            pickupEntity.prevRotation = pickupEntity.rotation;
                        }

                        if (rightDiff < leftDiff) {
                            pickupEntity.rotation = angleRight + Math.PI/2;
                        } else {
                            pickupEntity.rotation = angleLeft + Math.PI/2;
                        }
                        break;
                    } else if (rotationStored) {
                        pickupEntity.rotation = pickupEntity.prevRotation;
                        pickupEntity.prevRotation = null;
                        pickupEntity.pickupOffset = {
                            x: 0,
                            y: 0
                        };
                    }
                }
            }
        }

        if (ENABLE_DEBUG) {
            debugText.text = 'Press F2 to disable debug\n';
            debugText.text += 'Press F8 to spawn 1k buildings\n';
            debugText.text += 'FPS: ' + Math.round(1000/delta) + '\n';
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
    Math.rotateAround = function (center, point, radians) {
        let cos = Math.cos(radians), sin = Math.sin(radians);
        return {
            x: (cos * (point.x - center.x)) + (sin * (point.y - center.y)) + center.x,
            y: (cos * (point.y - center.y)) - (sin * (point.x - center.x)) + center.y
        };
    }
})();