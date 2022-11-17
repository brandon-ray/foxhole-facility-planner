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
const COLOR_GREEN = 0x00FF00;
const COLOR_BLUE = 0x0000FF;
const COLOR_YELLOW = 0xFFFF00;

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

    let _entityIds = 0;
    let entities = [];
    let selectedEntities = [];
    let selectedHandlePoint = null;
    let pickupSelectedEntities = false;
    let pickupTime = null;
    let pickupPosition = null;
    let ignoreMousePickup = true;
    let effects = [];

    game.facilityName = 'Unnamed Facility';
    game.selectedBuildingCategory = game.settings.defaultBuildingCategory;

    game.getEntities = () => {
        return entities;
    };

    game.getEntityById = (id) => {
        const entityId = typeof id !== 'number' ? Number(id) : id;
        for (let i = 0; i < entities.length; i++) {
            const entity = entities[i];
            if (entity.id === entityId) {
                return entity;
            }
        }
    }

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
        building_background: 'building_background.png',
        pointer: 'pointer.webp',
        bipointer: 'bipointer.webp',
        power: 'power.webp'
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
        
        if (building.textureFrontCap) {
            asset_list[building.textureFrontCap] = building.textureFrontCap;
        }
        
        if (building.textureBackCap) {
            asset_list[building.textureBackCap] = building.textureBackCap;
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
            entityIds: _entityIds,
            entities: []
        };
        let saveEntities = isSelection ? selectedEntities : entities;
        for (let i = 0; i < saveEntities.length; i++) {
            let entity = saveEntities[i];
            let entityData = {
                id: entity.id,
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
            let entityIds = _entityIds;
            if (typeof saveObject.entityIds === 'number') {
                _entityIds += saveObject.entityIds;
            }
            for (let i=0; i<saveObject.entities.length; i++) {
                let entityData = saveObject.entities[i];
                let entity;
                switch (entityData.type) {
                    case 'building':
                        entity = createBuilding(entityData.subtype, parseFloat(entityData.x), parseFloat(entityData.y), parseInt(entityData.z), isNaN(entityData.id) ? undefined : entityIds + parseInt(entityData.id));
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
            if (!selectedHandlePoint) {
                if (pickupSelectedEntities) {
                    let selectedEntity = game.getSelectedEntity();
                    if (selectedEntity?.building?.hasHandle && selectedEntity.shouldSelectLastHandlePoint) {
                        selectedEntity.grabHandlePoint();
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
                                } else if (!entity.grabHandlePoint() && (e.ctrlKey || e.shiftKey)) {
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

    function createEntity(type, subtype, x, y, z, id, netData) {
        let entity = new PIXI.Container();
        if (typeof id === 'number' && _entityIds <= id) {
            _entityIds = id + 1;
        }
        entity.id = id ?? _entityIds++;
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
    const METER_UNREAL_UNITS = 100;
    const METER_PIXEL_SCALE = METER_UNREAL_UNITS / METER_PIXEL_SIZE;
    function createBuilding(type, x, y, z, id, netData) {
        let entity = createEntity('building', type, x, y, z, id, netData);

        let building = window.objectData.buildings[type];
        if (!building) {
            console.error('Invalid building type:', type);
            entity.remove();
            return;
        }

        entity.building = building;
        entity.selected = false;

        let sprite;
        let frameX = 0;
        let frameY = 0;
        let frameWidth = 0;
        let frameHeight = 0;
        let sheet = null;

        // All this texture stuff should be done once on load with the textures themselves, not here. Makes no sense here.

        if (building.texture && !building.hasHandle) {
            if (typeof building.texture === 'object' && !Array.isArray(building.texture)) {
                sheet = loadSpritesheet(resources[building.texture.sheet].texture, building.texture.width, building.texture.height);
                frameWidth = Math.floor(resources[building.texture.sheet].texture.width/building.texture.width);
                frameHeight = Math.floor(resources[building.texture.sheet].texture.height/building.texture.height);
                sprite = new PIXI.Sprite(sheet[0][0]);
                sprite.width = building.width * METER_PIXEL_SIZE;
                sprite.height = building.length * METER_PIXEL_SIZE;
            } else if (resources[building.texture]) {
                sprite = new PIXI.Sprite(resources[building.texture].texture);
                frameWidth = resources[building.texture].texture.width;
                frameHeight = resources[building.texture].texture.height;
                sprite.width = frameWidth / METER_PIXEL_SCALE;
                sprite.height = frameHeight / METER_PIXEL_SCALE;
            }
            if (!building.textureOffset) {
                sprite.anchor.set(0.5);
            } else {
                sprite.x = -building.textureOffset.x / METER_PIXEL_SCALE;
                sprite.y = -building.textureOffset.y / METER_PIXEL_SCALE;
            }
            entity.sprite = sprite;
        }

        if (building.range || building.overlapDist) {
            entity.rangeSprite = new PIXI.Graphics();
            entity.rangeSprite.alpha = 0.25;
            entity.rangeSprite.visible = false;
            if (building.range) {
                if (isNaN(building.range)) {
                    entity.rangeSprite.lineStyle((building.range.max - building.range.min) * METER_PIXEL_SIZE, COLOR_RANGE, 1);
                    entity.rangeSprite.drawCircle(0, 0, ((building.range.min + building.range.max) / 2) * METER_PIXEL_SIZE);
                } else {
                    entity.rangeSprite.beginFill(COLOR_RANGE);
                    entity.rangeSprite.drawCircle(0, 0, building.range * METER_PIXEL_SIZE);
                    entity.rangeSprite.endFill();
                }
            }
            if (building.overlapDist) {
                entity.rangeSprite.lineStyle(10, COLOR_RANGE_BORDER, 1);
                let overlapDist = building.overlapDist * METER_PIXEL_SIZE;
                entity.rangeSprite.drawCircle(0, 0, overlapDist);
                //entity.rangeSprite.drawRect(-(sprite.width/2) - overlapDist, -(sprite.height/2) - overlapDist, sprite.width + overlapDist*2, sprite.height + overlapDist*2);
            }
            entity.addChild(entity.rangeSprite);
        }

        let borderWidth = 6;
        entity.selectionArea = new PIXI.Graphics();
        entity.selectionArea.visible = false;
        if (!building.hasHandle) {
            const buildingWidth = building.width ? building.width * METER_PIXEL_SIZE : sprite?.width ?? 0;
            const buildingLength = building.length ? building.length * METER_PIXEL_SIZE : sprite?.height ?? 0;
            entity.selectionArea.lineStyle(borderWidth, COLOR_ORANGE);
            entity.selectionArea.drawRect(-(buildingWidth/2)-borderWidth, -(buildingLength/2)-borderWidth, buildingWidth+(borderWidth*2), buildingLength+(borderWidth*2));
        } else {
            entity.selectionArea.beginFill(COLOR_ORANGE);
            entity.selectionArea.drawRect(-8, -8, 16, 16);
            entity.selectionArea.endFill();
        }
        entity.addChild(entity.selectionArea);

        if (sprite) {
            entity.addChild(sprite);
        }

        const socketWidth = 32, socketThickness = 6, powerSocketSize = 8;
        if (building.sockets) {
            entity.sockets = new PIXI.Container();
            const buildingWidthOffset = -(building.width ? building.width * METER_PIXEL_SIZE : sprite?.width ?? 0) / 2;
            const buildingLengthOffset = -(building.length ? building.length * METER_PIXEL_SIZE : sprite?.height ?? 0) / 2;
            for (let i = 0; i < building.sockets.length; i++) {
                let socket = new PIXI.Graphics();
                socket.connections = {};
                socket.socketData = Object.assign({}, building.sockets[i]);
                socket.socketData.x = isNaN(socket.socketData.x) ? 0 : buildingWidthOffset + (socket.socketData.x / METER_PIXEL_SCALE);
                socket.socketData.y = isNaN(socket.socketData.y) ? 0 : buildingLengthOffset + (socket.socketData.y / METER_PIXEL_SCALE);
                socket.position.set(socket.socketData.x, socket.socketData.y);
                socket.rotation = Math.deg2rad(socket.socketData.rotation);
                if (socket.socketData.flow === 'in') {
                    socket.beginFill(COLOR_RED);
                    socket.drawRect(-socketWidth/2, -socketThickness, socketWidth, socketThickness);
                    socket.endFill();
                } else if (socket.socketData.flow === 'out') {
                    socket.beginFill(COLOR_GREEN);
                    socket.drawRect(-socketWidth/2, -socketThickness, socketWidth, socketThickness);
                    socket.endFill();
                } else if (socket.socketData.type === 'pipe') {
                    socket.beginFill(COLOR_BLUE);
                    socket.drawRect(-socketWidth/2, -socketThickness, socketWidth, socketThickness);
                    socket.endFill();
                } else if (socket.socketData.type === 'power') {
                    socket.beginFill(COLOR_YELLOW);
                    socket.drawRect(-powerSocketSize/2, -powerSocketSize/2, powerSocketSize, powerSocketSize);
                    socket.endFill();
                } else {
                    socket.beginFill(COLOR_ORANGE);
                    socket.drawRect(-socketThickness/2, -socketThickness, socketThickness, socketThickness);
                    socket.endFill();
                }
                // Might want to add what kind of liquid it expects, water, oil, power, etc.
                if (socket.socketData.flow === 'in') {
                    socket.pointer = new PIXI.Sprite(resources.pointer.texture);
                    socket.pointer.anchor.set(0.5, -0.5);
                    socket.pointer.rotation = Math.PI;
                    socket.addChild(socket.pointer);
                } else if (socket.socketData.flow === 'out') {
                    socket.pointer = new PIXI.Sprite(resources.pointer.texture);
                    socket.pointer.anchor.set(0.5, 1.5);
                    socket.addChild(socket.pointer);
                } else if (socket.socketData.type === 'pipe') {
                    socket.pointer = new PIXI.Sprite(resources.bipointer.texture);
                    socket.pointer.anchor.set(0.5, 1.5);
                    socket.addChild(socket.pointer);
                } else if (socket.socketData.type === 'power') {
                    socket.pointer = new PIXI.Sprite(resources.power.texture);
                    socket.pointer.anchor.set(0.5, 1.5);
                    socket.pointer.rotation = -(entity.rotation + socket.rotation);
                    socket.addChild(socket.pointer);
                }
                socket.setConnection = function(connectingEntityId, connectingSocket) {
                    if (!isNaN(connectingEntityId) && connectingSocket?.socketData && (isNaN(socket.connections[connectingEntityId]) || socket.connections[connectingEntityId] !== connectingSocket.socketData.id)) {
                        entity.removeConnections(socket.socketData.cap !== 'back' || socket.socketData.id);
                        socket.connections[connectingEntityId] = connectingSocket.socketData.id;
                        connectingSocket.connections[entity.id] = socket.socketData.id;
                        socket.updatePointer(false);
                        connectingSocket.updatePointer(false);
                    }
                }
                socket.updatePointer = function(visible) {
                    if (socket.pointer) {
                        socket.pointer.visible = visible ?? Object.keys(socket.connections).length === 0;
                    }
                }
                entity.sockets.addChild(socket);
            }
            entity.addChild(entity.sockets);
        }

        /*
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
        */

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
            entity.selectionArea.tint = entity.locked ? COLOR_RED : COLOR_WHITE;
            entity.selectionArea.visible = true;

            if (entity.rangeSprite && !entity.rangeSprite.visible) {
                entity.rangeSprite.visible = true;
            }

            entity.updateHandles();
        };

        const TRACK_SEGMENT_LENGTH = 16;
        entity.onDeselect = function() {
            entity.selected = false;
            entity.selectionArea.visible = false;
            delete entity.prevRotation;

            if (entity.rangeSprite && !game.settings.showRanges) {
                entity.rangeSprite.visible = false;
            }

            if (entity.bezier && entity.bezier.length() <= entity.building?.minLength) {
                entity.remove();
            } else if (entity.building?.requireConnection) {
                // Requires all sockets have at least one connection. Mainly for power lines.
                for (let i = 0; i < entity.sockets.children.length; i++) {
                    const socket = entity.sockets.children[i];
                    if (Object.keys(socket.connections).length === 0) {
                        entity.remove();
                        break;
                    }
                }
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

            if (entity.visible && !pickupSelectedEntities && entity.selected && !entity.selectionArea.visible) {
                entity.selectionArea.visible = true;
            }

            if (entity.visible && building.hasHandle) {
                if (selectedHandlePoint && !mouseDown[0]) {
                    selectedHandlePoint = null;
                }

                if (entity.selected && !entity.locked && mouseDown[0]) {
                    let gridSize = game.settings.gridSize ? game.settings.gridSize : 16;
                    let gmxGrid = gmx;
                    let gmyGrid = gmy;
                    if (!entity.building?.ignoreSnapSettings && (game.settings.enableGrid || keys[16])) {
                        gmxGrid = Math.floor(gmxGrid / gridSize) * gridSize;
                        gmyGrid = Math.floor(gmyGrid / gridSize) * gridSize;
                    }
                    let mousePos = entity.toLocal({x: gmxGrid, y: gmyGrid}, app.cstage, undefined, true);
                    if (selectedHandlePoint) {
                        game.setPickupEntities(false);
                        if (selectedHandlePoint.index === 0) {
                            entity.x = gmx;
                            entity.y = gmy;

                            if (!entity.building?.ignoreSnapSettings && (game.settings.enableGrid || keys[16])) {
                                entity.x = Math.floor(entity.x / gridSize) * gridSize;
                                entity.y = Math.floor(entity.y / gridSize) * gridSize;
                            }
                        } else {
                            if (mouseDown[2] && entity.building?.isBezier) {
                                let angle = Math.angleBetween(selectedHandlePoint, mousePos);
                                if (!entity.building?.ignoreSnapSettings && game.settings.enableSnapRotation) {
                                    let snapRotationDegrees = Math.deg2rad(game.settings.snapRotationDegrees ? game.settings.snapRotationDegrees : 15);
                                    angle = Math.floor(angle / snapRotationDegrees) * snapRotationDegrees;
                                }
                                selectedHandlePoint.rotation = angle + Math.PI;
                            } else {
                                selectedHandlePoint.x = mousePos.x;
                                selectedHandlePoint.y = mousePos.y;
                            }
                            
                            if (!entity.building?.isBezier || Math.abs(selectedHandlePoint.y) < 25) {
                                if (!entity.building?.isBezier && (entity.subtype === 'power_line' || !entity.hasConnections())) {
                                    let angle = Math.angleBetween(entity, { x: gmx, y: gmy });
                                    if (!entity.building?.ignoreSnapSettings && game.settings.enableSnapRotation) {
                                        let snapRotationDegrees = Math.deg2rad(game.settings.snapRotationDegrees ? game.settings.snapRotationDegrees : 15);
                                        angle = Math.round(angle / snapRotationDegrees) * snapRotationDegrees;
                                    }
                                    entity.rotation = angle;
                                }
                                selectedHandlePoint.y = 0;
                            }

                            if (!entity.building?.isBezier) {
                                if (entity.building.minLength) {
                                    const minLength = entity.building?.minLength * METER_PIXEL_SIZE;
                                    if (selectedHandlePoint.x < minLength) {
                                        selectedHandlePoint.x = minLength;
                                    }
                                }
                            }
                        }

                        if (!mouseDown[2]) {
                            let handleSocket;
                            let connectionEstablished = false;
                            if (entity.sockets) {
                                handleSocket = entity.sockets.children[entity.sockets.children.length - 1];
                            }
                            for (let i = 0; i < entities.length; i++) {
                                let entity2 = entities[i];
                                if (entity2 === entity || entity2.type !== 'building' || !(entity.sockets && entity2.sockets)) {
                                    continue;
                                }
                                if (entity2.sockets) {
                                    for (let i = 0; i < entity2.sockets.children.length; i++) {
                                        let entitySocket = entity2.sockets.children[i];
                                        let mousePos2 = entity2.toLocal({x: gmx, y: gmy}, app.cstage, undefined, true);
                                        if (entity.building?.canSnapStructureType !== false || entity.subtype !== entity2.subtype) {
                                            if (Math.distanceBetween(mousePos2, entitySocket) < 35 || entity.subtype === 'power_line' && entity2.canGrab()) {
                                                if (typeof handleSocket.socketData.type === 'string' && handleSocket.socketData.type === entitySocket.socketData.type) {
                                                    if (Object.keys(entitySocket.connections).length === 0 || (entitySocket.connections[entity.id] === handleSocket.socketData.id || (!entity.hasConnectionToEntityId(entity2.id) && Object.keys(entitySocket.connections).length < entitySocket.socketData.connectionLimit))) {
                                                        let socketPosition = app.cstage.toLocal({x: entitySocket.x, y: entitySocket.y}, entity2, undefined, true);
                                                        if (Math.distanceBetween(entity, socketPosition) <= (entity.building?.maxLength * METER_PIXEL_SIZE)) {
                                                            if (handleSocket.socketData.type === 'power') {
                                                                entity.rotation = Math.angleBetween(entity, socketPosition);
                                                            }
                                                            socketPosition = entity.toLocal(socketPosition, app.cstage, undefined, true);
                                                            let socketRotation = ((entity2.rotation + entitySocket.rotation) - entity.rotation) - Math.deg2rad(handleSocket.socketData.rotation);
                                                            if (handleSocket.socketData.type === 'power' || selectedHandlePoint.rotation === socketRotation && Math.floor(socketPosition.y) === 0 || entity.building?.isBezier) {
                                                                handleSocket.setConnection(entity2.id, entitySocket);
                                                                selectedHandlePoint.x = socketPosition.x;
                                                                if (entity.building?.isBezier) {
                                                                    selectedHandlePoint.y = socketPosition.y;
                                                                    selectedHandlePoint.rotation = socketRotation;
                                                                }
                                                                connectionEstablished = true;
                                                            }
                                                            break;
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                                if (!connectionEstablished && entity2.bezier && entity2.building?.isBezier && entity.subtype === entity2.subtype) {
                                    let selectedPointToEntity2Local = entity2.toLocal(selectedHandlePoint, entity, undefined, true);
                                    let projection = entity2.bezier.project(selectedPointToEntity2Local);
                                    if (projection.d <= 25) {
                                        let local = entity.toLocal({x: projection.x, y: projection.y}, entity2, undefined, true);
                                        let normal = entity2.bezier.normal(projection.t);
                                        let angle = Math.angleBetween({x: 0, y: 0}, normal);
                                        selectedHandlePoint.x = local.x;
                                        selectedHandlePoint.y = local.y;
        
                                        let currentRot = entity.rotation + selectedHandlePoint.rotation;
                                        let angleRight = entity2.rotation + (angle - Math.PI/2) - Math.PI/2;
                                        let angleLeft = entity2.rotation + (angle + Math.PI/2) - Math.PI/2;
                                        let rightDiff = Math.atan2(Math.sin(angleRight-currentRot), Math.cos(angleRight-currentRot));
                                        let leftDiff = Math.atan2(Math.sin(angleLeft-currentRot), Math.cos(angleLeft-currentRot));
        
                                        // TODO: Handle saving previous rotations of snapped handles as well.

                                        if (rightDiff < leftDiff) {
                                            selectedHandlePoint.rotation = (angleRight + Math.PI/2) - entity.rotation;
                                        } else {
                                            selectedHandlePoint.rotation = (angleLeft + Math.PI/2) - entity.rotation;
                                        }
                                        break;
                                    }
                                }
                            }
                            if (handleSocket && !connectionEstablished) {
                                entity.removeConnections(handleSocket.socketData.id);
                            }
                        }

                        const MIN_SEGMENT_DISTANCE = entity.building.minLength * METER_PIXEL_SIZE;
                        const MAX_SEGMENT_DISTANCE = entity.building.maxLength * METER_PIXEL_SIZE;
                        let dist = Math.distanceBetween({x: 0, y: 0}, selectedHandlePoint);
                        if (selectedHandlePoint.index === 1) {
                            let angle = Math.angleBetween({x: 0, y: 0}, selectedHandlePoint);
                            if (dist > MAX_SEGMENT_DISTANCE) {
                                dist = MAX_SEGMENT_DISTANCE;
                            }
                            selectedHandlePoint.x = Math.cos(angle) * dist;
                            selectedHandlePoint.y = Math.sin(angle) * dist;
                        }

                        entity.regenerate();
                        if (entity.subtype === 'pipeline') {
                            if (dist < 3*METER_PIXEL_SIZE) {
                                entity.sprite.tint = COLOR_RED;
                            } else {
                                entity.sprite.tint = COLOR_WHITE;
                            }
                        } else {
                            let curve1 = entity.bezier.curvature(0.25);
                            let curve2 = entity.bezier.curvature(0.5);
                            let curve3 = entity.bezier.curvature(0.75);
                            if (dist < MIN_SEGMENT_DISTANCE || (curve1.r !== 0 && (Math.abs(curve1.r) < 100 || Math.abs(curve2.r) < 200 || Math.abs(curve3.r) < 100)) || selectedHandlePoint.x < 0) {
                                entity.sprite.tint = COLOR_RED;
                            } else {
                                entity.sprite.tint = COLOR_WHITE;
                            }
                        }

                        if (selectedHandlePoint.handle) {
                            selectedHandlePoint.handle.position.x = selectedHandlePoint.x;
                            selectedHandlePoint.handle.position.y = selectedHandlePoint.y;
                        }
                    }
                }
            }

            if (entity.visible && entity.sockets) {
                if (entity.outline && entity.outline.visible !== entity.selected) {
                    entity.outline.visible = entity.selected;
                }
                if (entity.selected) {
                    for (let i = 0; i < entity.sockets.children.length; i++) {
                        let socket = entity.sockets.children[i];
                        if (socket.pointer?.visible && socket.socketData.type === 'power') {
                            socket.pointer.rotation = -(entity.rotation + socket.rotation);
                        }
                    }
                }
            }
        };

        entity.grabHandlePoint = function() {
            if (entity.selected && entity.building?.hasHandle) {
                if (entity.shouldSelectLastHandlePoint) {
                    entity.shouldSelectLastHandlePoint = false;
                    forceMouseDown[0] = true;
                    selectedHandlePoint = points[1];
                    return true;
                } else {
                    let mousePos = entity.toLocal({x: gmx, y: gmy}, app.cstage, undefined, true);
                    for (let i = 1; i < points.length; i++) {
                        let point = points[i];
                        if (Math.distanceBetween(mousePos, point) < 20) {
                            game.selectEntity(entity);
                            selectedHandlePoint = point;
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
                if (entity.building?.hasHandle && entity.bezier) {
                    let mousePos = entity.toLocal({x: gmx, y: gmy}, app.cstage, undefined, true);
                    let projection = entity.bezier.project(mousePos);
                    if (projection.d <= 25) {
                        return true;
                    }
                } else if (entity.sprite) {
                    // https://stackoverflow.com/a/67732811 <3
                    const w = entity.selectionArea.width / 2;
                    const h = entity.selectionArea.height / 2;
                    const r = entity.rotation;

                    // Create new oriented bounds.
                    const [ax, ay] = [Math.cos(r), Math.sin(r)];
                    const t = (x, y) => ({x: x * ax - y * ay + entity.x, y: x * ay + y * ax + entity.y});
                    const bBounds = [t(w, h), t(-w, h), t(-w, -h), t(w, -h)];

                    return Math.isPointWithinBounds({ x: gmx, y: gmy }, bBounds);
                }
            }
            return false;
        };

        entity.hasConnections = function() {
            if (entity.sockets) {
                for (let i = 0; i < entity.sockets.children.length; i++) {
                    const entitySocket = entity.sockets.children[i];
                    if (Object.keys(entitySocket.connections).length > 0) {
                        return true;
                    }
                }
            }
            return false;
        }

        entity.hasConnectionToEntityId = function(entityId) {
            if (entity.sockets) {
                for (let i = 0; i < entity.sockets.children.length; i++) {
                    const entitySocket = entity.sockets.children[i];
                    if (typeof entitySocket.connections[entityId] === 'number') {
                        return true;
                    }
                }
            }
            return false;
        }

        entity.removeConnections = function(socketId) {
            if (entity.sockets) {
                // Iterate sockets to make sure we either remove the connections and update the socket or remove the entity altogether.
                for (let i = 0; i < entity.sockets.children.length; i++) {
                    const entitySocket = entity.sockets.children[i];
                    if (typeof socketId !== 'number' || entitySocket.socketData.id === socketId) {
                        for (const [connectedEntityId, connectedSocketId] of Object.entries(entitySocket.connections)) {
                            const connectedEntity = game.getEntityById(connectedEntityId);
                            if (connectedEntity) {
                                for (let k = 0; k < connectedEntity.sockets.children.length; k++) {
                                    const connectedSocket = connectedEntity.sockets.children[k];
                                    if (connectedSocket.socketData.id === connectedSocketId) {
                                        delete connectedSocket.connections[entity.id];
                                        if (Object.keys(connectedSocket.connections).length === 0) {
                                            if (connectedEntity.building?.requireConnection) {
                                                connectedEntity.remove();
                                            } else {
                                                connectedSocket.updatePointer(true);
                                            }
                                        }
                                        break;
                                    }
                                }
                            }
                            delete entitySocket.connections[connectedEntityId];
                        }
                        entitySocket.updatePointer(true);
                    }
                }
            }
        }

        entity.getZIndex = function() {
            return -entity.y - (building.sortOffset ? building.sortOffset : 0) - (entity.selected ? 10000000 : 0);
        };

        entity.onRemove = function() {
            if (entity.selected) {
                game.removeSelectedEntity(entity);
            }
            if (selectedHandlePoint) {
                selectedHandlePoint = null;
            }
            entity.removeConnections();
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
            if (entity.building?.hasHandle) {
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

            if (entity.building?.hasHandle && entityData.railPoints) {
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

                    if (type === 'pipeline') {
                        if (i < points.length - 1) {
                            bezierPoints.push({
                                x: point.x,
                                y: point.y
                            });

                            let point2 = points[i + 1];
                            if (point2) {
                                let dist = Math.distanceBetween(point, point2) * 0.1;
                                if (dist < 35) {
                                    dist = 35;
                                }
                                if (dist > 50) {
                                    dist = 50;
                                }
                                bezierPoints.push({
                                    x: point.x + dist,
                                    y: point.y
                                });
                                bezierPoints.push({
                                    x: point.x + dist,
                                    y: point.y
                                });
                                bezierPoints.push({
                                    x: point.x + dist,
                                    y: point.y
                                });
                            }
                        } else {
                            let point1 = points[i - 1];
                            if (point1) {
                                let dist = Math.distanceBetween(point, point1) * 0.1;
                                if (dist < 35) {
                                    dist = 35;
                                }
                                if (dist > 50) {
                                    dist = 50;
                                }
                                bezierPoints.push({
                                    x: point.x + (Math.cos(point.rotation) * dist),
                                    y: point.y + (Math.sin(point.rotation) * dist)
                                });
                                bezierPoints.push({
                                    x: point.x + (Math.cos(point.rotation) * dist),
                                    y: point.y + (Math.sin(point.rotation) * dist)
                                });
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
                    } else {
                        if (i < points.length - 1) {
                            bezierPoints.push({
                                x: point.x,
                                y: point.y
                            });

                            let point2 = points[i + 1];
                            if (point2) {
                                let dist = Math.distanceBetween(point, point2) * 0.4;
                                bezierPoints.push({
                                    x: point.x + dist,
                                    y: point.y
                                });
                            }
                        } else {
                            let point1 = points[i - 1];
                            if (point1) {
                                let dist = Math.distanceBetween(point, point1) * 0.4;
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
                }
                entity.bezier = new Bezier(bezierPoints);
                let segments = Math.round(entity.bezier.length()/TRACK_SEGMENT_LENGTH);
                if (entity.building.texture) {
                    resources[entity.building.texture].texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
                    entity.sprite = new PIXI.SimpleRope(resources[entity.building.texture].texture, entity.bezier.getLUT(segments), 1);
                    entity.addChild(entity.sprite);
                }
                const frontPoint = points[0], backPoint = points[points.length - 1];
                if (entity.building.textureFrontCap) {
                    entity.removeChild(entity.frontCap);
                    entity.frontCap = new PIXI.Sprite(resources[entity.building.textureFrontCap].texture);
                    entity.frontCap.anchor.set(0, 0.5);
                    entity.frontCap.x = frontPoint.x;
                    entity.frontCap.y = frontPoint.y;
                    entity.frontCap.rotation = frontPoint.rotation + Math.PI;
                    entity.addChild(entity.frontCap);
                }
                if (entity.building.textureBackCap) {
                    entity.removeChild(entity.backCap);
                    entity.backCap = new PIXI.Sprite(resources[entity.building.textureBackCap].texture);
                    entity.backCap.anchor.set(1, 0.5);
                    entity.backCap.x = backPoint.x;
                    entity.backCap.y = backPoint.y;
                    entity.backCap.rotation = backPoint.rotation + Math.PI;
                    entity.addChild(entity.backCap);
                }
                if (entity.sockets) {
                    let midPoint = entity.bezier.get(0.5);
                    let midNormal = entity.bezier.normal(midPoint.t);
                    let midAngle = Math.angleBetween({x: 0, y: 0}, midNormal) - Math.PI/2;
                    for (let i = 0; i < entity.sockets.children.length; i++) {
                        let socket = entity.sockets.children[i];
                        let socketPosition, socketRotation;
                        if (socket.socketData.cap === 'left' || socket.socketData.cap === 'right') {
                            socketRotation = midAngle + Math.deg2rad(socket.socketData.rotation);
                            socketPosition = Math.extendPoint(midPoint, 8, socketRotation - Math.PI/2);
                        }
                        switch (socket.socketData.cap) {
                            case 'left':
                                socket.position.set(socketPosition.x, socketPosition.y);
                                socket.rotation = socketRotation;
                                break;
                            case 'right':
                                socket.position.set(socketPosition.x, socketPosition.y);
                                socket.rotation = socketRotation;
                                break;
                            case 'back':
                                socket.position.set(backPoint.x, backPoint.y);
                                socket.rotation = backPoint.rotation - Math.PI/2;
                                break;
                        }
                    }
                }
                if (entity.building?.hasOutline !== false) {
                    entity.removeChild(entity.outline);
                    entity.outline = new PIXI.SimpleRope(resources.white.texture, entity.bezier.getLUT(segments), 1);
                    entity.outline.tint = COLOR_ORANGE;
                    entity.addChild(entity.outline);
                }
            }
        };

        if (entity.building?.hasHandle) {
            entity.addPoint(0, 0);
            entity.addPoint(entity.building.minLength > 1 ? entity.building.minLength * METER_PIXEL_SIZE : 200, 0);
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
                        x: ignoreOffset ? (entity.building.hasHandle ? (entity.building.minLength > 1 ? (entity.building.minLength * METER_PIXEL_SIZE) / 2 : 100) : 0) : (position?.x ?? gmx) - entity.x,
                        y: ignoreOffset ? 0 : (position?.y ?? gmy) - entity.y
                    };
                }
            });
            if (!locked) {
                if (pickup) {
                    pickupTime = Date.now();
                    pickupPosition = {x: gmx, y: gmy};
                    ignoreMousePickup = true;
                }
                pickupSelectedEntities = pickup;
            }
        }
    }

    game.startBuild = function(buildingData) {
        let entity = createBuilding(buildingData.key, 0, 0, 0);
        game.selectEntity(entity);
        game.setPickupEntities(true, true);
        if (entity.building?.hasHandle) {
            entity.shouldSelectLastHandlePoint = true;
        }
        return entity;
    };

    function cloneBuilding(entity, upgrade) {
        if (entity) {
            let clone = createBuilding(upgrade ?? entity.building.key, entity.x, entity.y, 0);
            clone.locked = entity.locked;
            clone.selectionArea.tint = clone.locked ? COLOR_RED : COLOR_WHITE;
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
            selectedEntity.selectionArea.tint = selectedEntity.locked ? COLOR_RED : COLOR_WHITE;
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
        _entityIds = 0;
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
                if (entities.length === 0) {
                    _entityIds = 0;
                }
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
            if (!selectedHandlePoint && (!ignoreMousePickup || (Date.now()-pickupTime > 250 || Math.distanceBetween(pickupPosition, {x: gmx, y: gmy}) > 20))) {
                if (ignoreMousePickup) {
                    for (let i = 0; i < selectedEntities.length; i++) {
                        // Destroying any connections with entities that aren't selected, it might be worth checking if the mouse / selection position has changed before doing so or checking for rotation.
                        let pickupEntity = selectedEntities[i];
                        if (pickupEntity.sockets) {
                            for (let j = 0; j < pickupEntity.sockets.children.length; j++) {
                                const pickupSocket = pickupEntity.sockets.children[j];
                                for (const [connectedEntityId, connectedSocketId] of Object.entries(pickupSocket.connections)) {
                                    const connectedEntity = game.getEntityById(connectedEntityId);
                                    if (connectedEntity && !connectedEntity.selected) {
                                        // TODO: Update entity.removeConnections to support specifying an entity to remove a connection for, because this is all basically the same code.
                                        for (let k = 0; k < connectedEntity.sockets.children.length; k++) {
                                            const connectedSocket = connectedEntity.sockets.children[k];
                                            if (connectedSocket.socketData.id === connectedSocketId) {
                                                delete connectedSocket.connections[pickupEntity.id];
                                                if (Object.keys(connectedSocket.connections).length === 0) {
                                                    if (connectedEntity.building?.requireConnection) {
                                                        connectedEntity.remove();
                                                    } else {
                                                        connectedSocket.updatePointer(true);
                                                    }
                                                }
                                                break;
                                            }
                                        }
                                        delete pickupSocket.connections[connectedEntity.id];
                                        if (Object.keys(pickupSocket.connections).length === 0) {
                                            if (pickupEntity.building?.requireConnection) {
                                                pickupEntity.remove();
                                            } else {
                                                pickupSocket.updatePointer(true);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                ignoreMousePickup = false;
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
                    if (!pickupEntity.building?.hasHandle && pickupEntity.selectionArea.visible) {
                        pickupEntity.selectionArea.visible = false;
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
                    } else if (selectedEntities.length > 1) {
                        // This assumes buildings start on the grid and won't work for importing selections and cloning selections.
                        // Also weird bug that structures will shift slightly if you spam right click. Not sure the math here is right, probably needs to account for building offsets.
                        let snappedMX = gmx, snappedMY = gmy;
                        if (game.settings.enableGrid || keys[16]) {
                            let gridSize = game.settings.gridSize ? game.settings.gridSize : 16;
                            let mXDiff = pickupPosition.x - snappedMX;
                            let mYDiff = pickupPosition.y - snappedMY;
                            snappedMX = pickupPosition.x - (Math.round(mXDiff / gridSize) * gridSize);
                            snappedMY = pickupPosition.y - (Math.round(mYDiff / gridSize) * gridSize);
                        }
                        pickupEntity.x = snappedMX - pickupEntity.pickupOffset.x;
                        pickupEntity.y = snappedMY - pickupEntity.pickupOffset.y;
                    } else {
                        pickupEntity.x = gmx - pickupEntity.pickupOffset.x;
                        pickupEntity.y = gmy - pickupEntity.pickupOffset.y;
                        if (!pickupEntity.building?.ignoreSnapSettings && (game.settings.enableGrid || keys[16])) {
                            let gridSize = game.settings.gridSize ? game.settings.gridSize : 16;
                            pickupEntity.x = (Math.round(pickupEntity.x / gridSize) * gridSize);
                            pickupEntity.y = (Math.round(pickupEntity.y / gridSize) * gridSize);
                        }
                    }
                }
            }
            let pickupEntity = game.getSelectedEntity();
            if (pickupEntity && pickupEntity.building?.canSnap && !selectedHandlePoint) {
                let connectionEstablished = false;
                for (let i=0; i<entities.length; i++) {
                    let entity = entities[i];
                    let mousePos = entity.toLocal({x: gmx, y: gmy}, app.cstage, undefined, true);
                    let projection = entity.bezier?.project(mousePos);
                    if (entity !== pickupEntity && entity.type === 'building' && (pickupEntity.subtype === entity.subtype || (pickupEntity.sockets && entity.sockets)) && (!projection || projection.d <= 25)) {
                        if (pickupEntity.sockets && entity.sockets) {
                            for (let j = 0; j < entity.sockets.children.length; j++) {
                                let entitySocket = entity.sockets.children[j];
                                if (pickupEntity.building?.canSnapStructureType !== false || pickupEntity.subtype !== entity.subtype) {
                                    if (Math.distanceBetween(mousePos, entitySocket) < 35 || pickupEntity.subtype === 'power_line' && entity.canGrab()) {
                                        for (let k = 0; k < pickupEntity.sockets.children.length; k++) {
                                            let pickupSocket = pickupEntity.sockets.children[k];
                                            if (entitySocket.socketData.type === pickupSocket.socketData.type) {
                                                if (Object.keys(entitySocket.connections).length === 0 || Object.keys(entitySocket.connections).length < entitySocket.socketData.connectionLimit || entitySocket.connections[pickupEntity.id] === pickupSocket.socketData.id) {
                                                    if (entitySocket.socketData.flow && entitySocket.socketData.flow === pickupSocket.socketData.flow) {
                                                        continue;
                                                    }
                                                    if (isNaN(pickupEntity.prevRotation)) {
                                                        pickupEntity.prevRotation = pickupEntity.rotation;
                                                    }
                                                    pickupSocket.setConnection(entity.id, entitySocket);
                                                    let socketDistance = Math.distanceBetween({ x: 0, y: 0 }, pickupSocket);
                                                    let entitySocketPosition = app.cstage.toLocal({x: entitySocket.x, y: entitySocket.y}, entity, undefined, true);
                                                    let entitySocketRotation = entity.rotation + entitySocket.rotation;
                                                    let extendedPoint = Math.extendPoint(entitySocketPosition, socketDistance, entitySocketRotation - Math.PI/2);
                                                    pickupEntity.position.set(extendedPoint.x, extendedPoint.y);
                                                    pickupEntity.rotation = entitySocketRotation + pickupSocket.rotation;
                                                    if (pickupSocket.socketData.flow) {
                                                        pickupEntity.rotation -= Math.PI;
                                                    }
                                                    connectionEstablished = true;
                                                    break;
                                                }
                                            }
                                        }
                                        if (connectionEstablished) {
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                        if (!connectionEstablished && entity.bezier && entity.building?.isBezier && pickupEntity.subtype === entity.subtype) {
                            let global = app.cstage.toLocal({x: projection.x, y: projection.y}, entity, undefined, true);
                            let normal = entity.bezier.normal(projection.t);
                            let angle = Math.angleBetween({x: 0, y: 0}, normal);
                            pickupEntity.x = global.x;
                            pickupEntity.y = global.y;

                            let angleRight = entity.rotation + (angle - Math.PI/2) - Math.PI/2;
                            let angleLeft = entity.rotation + (angle + Math.PI/2) - Math.PI/2;
                            let rightDiff = Math.atan2(Math.sin(angleRight-pickupEntity.rotation), Math.cos(angleRight-pickupEntity.rotation));
                            let leftDiff = Math.atan2(Math.sin(angleLeft-pickupEntity.rotation), Math.cos(angleLeft-pickupEntity.rotation));

                            if (isNaN(pickupEntity.prevRotation)) {
                                pickupEntity.prevRotation = pickupEntity.rotation;
                            }
    
                            if (rightDiff < leftDiff) {
                                pickupEntity.rotation = angleRight + Math.PI/2;
                            } else {
                                pickupEntity.rotation = angleLeft + Math.PI/2;
                            }
                            connectionEstablished = true;
                            break;
                        }
                    }
                }
                if (!connectionEstablished) {
                    pickupEntity.removeConnections();
                }
                if (!connectionEstablished && !isNaN(pickupEntity.prevRotation)) {
                    pickupEntity.rotation = pickupEntity.prevRotation;
                    delete pickupEntity.prevRotation;
                    pickupEntity.pickupOffset = {
                        x: 0,
                        y: 0
                    };
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
    Math.extendPoint = function (point, distance, angle) {
        return {
            x: Math.round(Math.cos(angle) * distance + point.x),
            y: Math.round(Math.sin(angle) * distance + point.y)
        };
    };
    Math.rotateAround = function (center, point, radians) {
        let cos = Math.cos(radians), sin = Math.sin(radians);
        return {
            x: (cos * (point.x - center.x)) + (sin * (point.y - center.y)) + center.x,
            y: (cos * (point.y - center.y)) - (sin * (point.x - center.x)) + center.y
        };
    };
    Math.isPointWithinBounds = function(point, bounds) {
        let i = 0, l = {p1: bounds[3]};
        while (i < bounds.length) {
            l.p2 = bounds[i++];
            if (!(0 < (l.p2.x - l.p1.x) * (point.y - l.p1.y) - (l.p2.y - l.p1.y) * (point.x - l.p1.x))) {
                return false;
            }
            l.p1 = l.p2;
        }
        return true;
    };
})();