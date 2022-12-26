const game = {
    services: {},
    settings: {
        quality: 'auto',
        disableSound: false,
        disableHUD: false,
        enableExperimental: false,
        enableGrid: true,
        enableStats: true,
        gridSize: 16,
        enableSnapRotation: true,
        snapRotationDegrees: 15,
        selectedFaction: null,
        selectedTier: 3,
        displayFactionTheme: true,
        defaultBuildingCategory: 'all',
        showCollapsibleBuildingList: false,
        showUpgradesAsBuildings: false,
        showFacilityName: true,
        showRanges: false,
        showProductionIcons: false,
        volume: 0.2
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
    let followEntity = null;
    let pickupSelectedEntities = false;
    let pickupTime = null;
    let pickupPosition = null;
    let ignoreMousePickup = true;
    let constructionCursor = null;
    let effects = [];

    game.facilityName = 'Unnamed Facility';
    game.selectedBuildingCategory = game.settings.defaultBuildingCategory;

    game.constructionModes = [
        {
            key: 'text',
            title: 'Text Tool',
            icon: 'fa-font',
            eType: 'text'
        },
        {
            key: 'rectangle',
            title: 'Rectangle Tool',
            icon: 'fa-square-o',
            eType: 'shape',
            eSubType: 'rectangle'
        },
        {
            key: 'circle',
            title: 'Circle Tool',
            icon: 'fa-circle-thin',
            eType: 'shape',
            eSubType: 'circle'
        },
        {
            key: 'line',
            title: 'Line Tool',
            text: '/',
            eType: 'shape',
            eSubType: 'line'
        },
        {
            key: 'select',
            title: 'Selection Tool',
            icon: 'fa-mouse-pointer'
        }
    ];

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

    game.followEntity = function(entity) {
        if (entity !== followEntity) {
            if (followEntity) {
                followEntity.following = false;
            }
            followEntity = entity;
            if (followEntity) {
                followEntity.following = true;
            }
            game.buildingSelectedMenuComponent?.refresh();
        }
    }

    game.updateConstructionCursor = function(visible) {
        if (constructionCursor) {
            constructionCursor.visible = visible && game.constructionMode.key !== 'select';
            if (constructionCursor.visible) {
                constructionCursor.x = gmx;
                constructionCursor.y = gmy;
                if (document.body.style.cursor !== 'none') {
                    document.body.style.cursor = 'none';
                }
            } else if (document.body.style.cursor !== 'unset') {
                document.body.style.cursor = 'unset';
            }
        }
    }

    game.setConstructionMode = function(mode) {
        mode = mode ?? game.constructionModes[game.constructionModes.length - 1];
        if (game.constructionMode !== mode) {
            game.constructionMode = mode;
            if (mode.key === 'select') {
                game.updateConstructionCursor(false);
            }
            game.constructionMenuComponent?.refresh();
            return true;
        }
        return false;
    }

    game.updateConstructionMode = function(type, subtype) {
        if (type) {
            for (let i = 0; i < game.constructionModes.length; i++) {
                const mode = game.constructionModes[i];
                if (mode.eType === type && (!subtype || mode.eSubType === subtype)) {
                    return game.setConstructionMode(mode);
                }
            }
        }
        return game.resetConstructionMode();
    }

    game.resetConstructionMode = function() {
        return game.setConstructionMode(null);
    }
    game.resetConstructionMode();

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
        point: 'point.webp',
        pointer: 'pointer.webp',
        bipointer: 'bipointer.webp',
        power: 'power.webp',
        power_x128: 'power_x128.webp',
        foundation_border: 'foundation_border.webp',
        smoke_particles: 'smoke_particles.png'
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

    for (let i=0; i<window.objectData.resources_list.length; i++) {
        let resource = window.objectData.resources_list[i];
        if (resource.icon) {
            asset_list[resource.icon] = resource.icon;
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
            }),
            train_wheel_loop: new Howl({
                src: ['assets/train_wheel_loop.wav'],
                loop: true,
                volume: 0.25
            }),
            train_engine: new Howl({
                src: ['assets/train_engine.wav'],
                loop: true,
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

    game.updateProductionIcons = function() {
        for (let i = 0; i < entities.length; i++) {
            let entity = entities[i];
            if (entity.productionIcons) {
                entity.productionIcons.visible = game.settings.showProductionIcons;
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
        if (!(document.activeElement && (document.activeElement.type === 'text' || document.activeElement.type === 'number' || document.activeElement.type === 'textarea'))) {
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
                    game.resetConstructionMode();
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
                case 80: // P
                    game.settings.showProductionIcons = !game.settings.showProductionIcons;
                    game.updateProductionIcons();
                    break;
                case 119: // F8
                    if (ENABLE_DEBUG) {
                        setTimeout(() => {
                            let x = 0;
                            let y = 0;
                            for (let i=0; i<1000; i++) {
                                let buildingData = window.objectData.buildings_list[Math.floor(Math.random()*window.objectData.buildings_list.length)];
                                createSelectableEntity('building', buildingData.key, x, y, 0);
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
            /*
            if (WIDTH > 2560) {
                WIDTH = 2560;
            }
            if (HEIGHT > 1440) {
                HEIGHT = 1440;
            }
            */
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

        constructionCursor = new PIXI.Graphics();
        constructionCursor.visible = false;
        constructionCursor.alpha = 0.75;
        constructionCursor.lineStyle(SELECTION_BORDER_WIDTH, COLOR_WHITE).moveTo(-20, 0).lineTo(20, 0);
        constructionCursor.lineStyle(SELECTION_BORDER_WIDTH, COLOR_WHITE).moveTo(0, 20).lineTo(0, -20);
        constructionCursor.getZIndex = function () {
            return -1000000000;
        };
        app.cstage.addChild(constructionCursor);

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

    game.getSaveData = function(isSelection) {
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
            entity.onSave(entityData, isSelection);
            saveObject.entities.push(entityData);
        }
        return saveObject;
    }

    game.downloadSave = function(isSelection) {
        let fileName = game.facilityName.toLowerCase().trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '_')
            .replace(/^-+|-+$/g, '');
        if (isSelection) {
            fileName += '_selection';
        }
        download(JSON.stringify(game.getSaveData(isSelection)), fileName, 'application/json');
    };

    game.loadSave = function(saveObject, isSelection) {
        if (isSelection) {
            game.deselectEntities(false, true);
        } else {
            if (entities.length > 0) {
                game.confirmDeletion(confirmed => {
                    if (confirmed) {
                        game.loadSave(saveObject, isSelection);
                    }
                }, true);
                return;
            }
            game.setFaction(saveObject.faction);
        }
        setTimeout(() => {
            let xTotal = 0, yTotal = 0;
            let entityIdMap = {};
            for (let i = 0; i < saveObject.entities.length; i++) {
                let entityData = saveObject.entities[i];
                let entity;
                switch (entityData.type) {
                    case 'building':
                    case 'text':
                    case 'shape':
                        entity = createSelectableEntity(entityData.type, entityData.subtype, parseFloat(entityData.x || 0), parseFloat(entityData.y || 0), parseInt(entityData.z || 0), entityData.rotation || 0);
                        break;
                    default:
                        console.error('Attempted to load invalid entity:', entityData);
                        continue;
                }
                if (entity) {
                    entityData.createdEntity = entity;
                    if (entity.id !== entityData.id) {
                        entityIdMap[entityData.id] = entity.id;
                    }
                    entity.locked = entityData.locked;
                    entity.onLoad(entityData);
                    if (isSelection) {
                        game.addSelectedEntity(entity, true);
                        xTotal += parseFloat(entity.x);
                        yTotal += parseFloat(entity.y);
                    }
                }
            }
            setTimeout(() => {
                for (let i = 0; i < saveObject.entities.length; i++) {
                    let entityData = saveObject.entities[i];
                    entityData.createdEntity?.afterLoad(entityData, entityIdMap);
                }
            }, 1);

            if (isSelection) {
                let centerPos = {
                    x: Math.round(xTotal/saveObject.entities.length),
                    y: Math.round(yTotal/saveObject.entities.length)
                }
                if (game.settings.enableGrid) {
                    let gridSize = game.settings.gridSize ? game.settings.gridSize : 16;
                    centerPos.x = Math.floor(centerPos.x / gridSize) * gridSize;
                    centerPos.y = Math.floor(centerPos.y / gridSize) * gridSize;
                }
                game.setPickupEntities(true, false, centerPos, true);
                game.updateSelectedBuildingMenu();
            } else {
                game.zoomToFacilityCenter();
            }
        }, 1);
    };

    game.zoomToFacilityCenter = function() {
        if (followEntity) {
            game.followEntity(null);
        }
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
        if (selectedEntities.length > 1 || selectedEntities[0] !== entity) {
            game.deselectEntities(false, true);
        }
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
        if (entity?.selected) {
            for (let i = 0; i < selectedEntities.length; i++) {
                let selectedEntity = selectedEntities[i];
                if (selectedEntity === entity) {
                    selectedEntities.splice(i, 1);
                    entity.onDeselect();
                    break;
                }
            }
            if (!selectedEntities.length) {
                game.setPickupEntities(false);
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

        //const followNext = followEntity !== null;
        if (mouseButton !== 2) {
            game.followEntity(null);
        }

        mouseDown[mouseButton] = true;
        if (mouseButton === 0) {
            if (!selectedHandlePoint) {
                if (pickupSelectedEntities) {
                    let selectedEntity = game.getSelectedEntity();
                    if (selectedEntity?.hasHandle && selectedEntity.shouldSelectLastHandlePoint) {
                        selectedEntity.grabHandlePoint();
                    }
                } else {
                    entities.sort(function (a, b) {
                        return a.getZIndex() - b.getZIndex()
                    });
                    for (let i=0; i<entities.length; i++) {
                        let entity = entities[i];
                        if (entity.valid && entity.visible && entity.selectable && entity.canGrab()) {
                            if (keys[46]) {
                                entity.remove();
                            } else {
                                if (!entity.selected) {
                                    if (e.ctrlKey || e.shiftKey) {
                                        game.addSelectedEntity(entity);
                                    } else {
                                        game.selectEntity(entity);
                                    }
                                } else if (!(entity.hasHandle && entity.grabHandlePoint()) && (e.ctrlKey || e.shiftKey)) {
                                    game.removeSelectedEntity(entity);
                                }
                                /* Not sure how I feel about this yet. Might be worth keeping, unsure.
                                if (entity.selected && followNext) {
                                    game.followEntity(entity);
                                }
                                */
                                if (entity.selected && entity.type === 'text') {
                                    game.buildingSelectedMenuComponent?.focusText();
                                }
                                game.setPickupEntities(true);
                            }
                            return;
                        }
                    }
                    if (game.constructionMode.key !== 'select' || !(e.ctrlKey || e.shiftKey)) {
                        game.deselectEntities();
                    }
                    if (game.constructionMode.key === 'select') {
                        if (selectionArea) {
                            selectionArea.origin = { x: gmx, y: gmy };
                        }
                    } else if (constructionCursor) {
                        let gmxGrid = gmx;
                        let gmyGrid = gmy;
                        if (game.settings.enableGrid || keys[16]) {
                            let gridSize = game.settings.gridSize ? game.settings.gridSize : 16;
                            gmxGrid = Math.round(gmxGrid / gridSize) * gridSize;
                            gmyGrid = Math.round(gmyGrid / gridSize) * gridSize;
                        }
                        const entity = game.create(game.constructionMode.eType, game.constructionMode.eSubType, gmxGrid, gmyGrid);
                        if (entity.hasHandle) {
                            entity.grabHandlePoint();
                        }
                    }
                }
            }
        } else if (mouseButton === 1 || mouseButton === 4) {
            dragCamera = true;
        }
    });

    mouseEventListenerObject.addEventListener(eventPrefix + 'enter', (e) => {
        game.updateConstructionCursor(true);
    });
    mouseEventListenerObject.addEventListener(eventPrefix + 'leave', (e) => {
        game.updateConstructionCursor(false);
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

        game.updateConstructionCursor(true);

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
                    const midPoint = app.cstage.toLocal({x: entity.bezier.mid.x, y: entity.bezier.mid.y}, entity, undefined, true);
                    eX = midPoint.x;
                    eY = midPoint.y;
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
            if (game.constructionMode.key !== 'select' && selectedHandlePoint) {
                selectedHandlePoint = null;
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

        if (typeof id === 'number' && id >= _entityIds) {
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
        entity.afterLoad = function() {};

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

    let windAngle = (Math.PI*2) * Math.random();
    let windStrength = 0.01;
    let environmentUpdateTime = Date.now() + 5000;
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
            //effect.sprite.parentGroup = PIXI.lights.diffuseGroup;
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

            if (type === 'smoke') {
                let angle = windAngle;
                let speed = windStrength;
                effect.dx += Math.cos(angle) * speed;
                effect.dy += Math.sin(angle) * speed;

                let lifePercentage = (effect.lifetime/effect.maxLifetime);
                effect.sprite.alpha = 0.75 * lifePercentage;
                zOffset = 2000000 + (-25 * lifePercentage);
                effect.scale.set(0.5 + ((1-(effect.lifetime/effect.maxLifetime)) * 2.5));
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
            return (-effect.y - zOffset) - 6000000;
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
        if (entities.length > 0) {
            return 'Are you sure you want to leave?';
        }
    };

    const METER_PIXEL_SIZE = 32;
    const METER_UNREAL_UNITS = 100, METER_PIXEL_UNIT = 50; // 100 Unreal Units = 50 Pixels // Both equivalent to one meter.
    const METER_TEXTURE_SCALE = METER_UNREAL_UNITS / METER_PIXEL_UNIT;
    const METER_PIXEL_SCALE = METER_PIXEL_UNIT / METER_PIXEL_SIZE;
    const SELECTION_BORDER_WIDTH = 6, TRACK_SEGMENT_LENGTH = 16;

    const DEFAULT_LABEL_STYLE = {
        fontFamily: 'Arial',
        fontSize: 64,
        fontStyle: 'normal',
        fontWeight: 'normal',
        fill: '#ffffff',
        align: 'center',
        dropShadow: true,
        dropShadowAlpha: 0.25,
        dropShadowBlur: 6,
        dropShadowDistance: 0,
        padding: 12
    };

    const DEFAULT_SHAPE_STYLE = {
        alpha: 0.75,
        fill: true,
        fillColor: COLOR_WHITE,
        border: false,
        lineWidth: 4,
        lineColor: COLOR_WHITE,
        //zOffset: 0 // Would be cool to have buttons like bring to front or send to back. So people could position it exactly where it needs to be layer-wise.
    }

    const DEFAULT_LINE_STYLE = Object.assign({}, DEFAULT_SHAPE_STYLE, {
        lineWidth: 8,
        frontArrow: true,
        backArrow: true
    });

    function createSelectableEntity(type, subtype, x, y, z, rotation, id, netData) {
        let entity = createEntity(type, subtype, x, y, z, id, netData);
        
        entity.rotation = rotation ?? 0;

        // TODO: Change building to metaData.
        let building;
        if (type === 'building') {
            building = window.objectData.buildings[subtype];
            if (!building) {
                console.error('Invalid building type:', subtype);
                entity.remove();
                return;
            }
            entity.building = building;
        }

        entity.selected = false;
        entity.selectable = true;
        entity.hasHandle = (type === 'shape' || entity.building?.hasHandle) ?? false;

        entity.selectionArea = new PIXI.Graphics();
        entity.selectionArea.visible = false;
        if (!entity.hasHandle) {
            entity.addChild(entity.selectionArea);
        }

        entity.setSelectionSize = function(width, height) {
            entity.selectionArea.clear();
            entity.selectionArea.lineStyle(SELECTION_BORDER_WIDTH, COLOR_ORANGE);
            entity.selectionArea.drawRect(-(width/2)-SELECTION_BORDER_WIDTH, -(height/2)-SELECTION_BORDER_WIDTH, width+(SELECTION_BORDER_WIDTH*2), height+(SELECTION_BORDER_WIDTH*2));
        }

        if (type === 'text') {
            entity.labelStyle = Object.assign({}, DEFAULT_LABEL_STYLE);
            entity.label = new PIXI.Text('', entity.labelStyle);
            entity.label.anchor.set(0.5);
            entity.setSelectionSize(entity.label.width, entity.label.height);
            entity.addChild(entity.label);

            entity.setLabel = function(text) {
                if (entity.label.text !== text) {
                    entity.label.text = text;
                    entity.setSelectionSize(entity.label.width, entity.label.height);
                }
            }

            entity.setLabelStyle = function(style) {
                entity.labelStyle = style;
                entity.label.style = style;
                entity.setSelectionSize(entity.label.width, entity.label.height);
            }

            entity.onSave = function(entityData) {
                entityData.label = entity.label.text;
                for (const[key, value] of Object.entries(entity.labelStyle)) {
                    if (value !== DEFAULT_LABEL_STYLE[key]) {
                        if (!entityData.labelStyle) {
                            entityData.labelStyle = {};
                        }
                        entityData.labelStyle[key] = value;
                    }
                }
            };

            entity.onLoad = function(entityData) {
                entity.label.text = entityData.label;
                Object.assign(entity.labelStyle, entityData.labelStyle);
                entity.setLabelStyle(entity.labelStyle);
            };
        }

        let frameWidth = 0, frameHeight = 0;
        let sheet = null;
        if (type === 'building') {
            if (building.texture && !building.hasHandle) {
                let sprite;
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
                    sprite.x = (-building.textureOffset.x / METER_TEXTURE_SCALE) / METER_PIXEL_SCALE;
                    sprite.y = (-building.textureOffset.y / METER_TEXTURE_SCALE) / METER_PIXEL_SCALE;
                }
                entity.sprite = sprite;
            }
            if (!entity.sprite) {
                entity.sprite = new PIXI.Container();
            }
            entity.addChild(entity.sprite);

            if (entity.building.textureFrontCap) {
                entity.frontCap = new PIXI.Sprite(resources[entity.building.textureFrontCap].texture);
                entity.frontCap.anchor.set(0, 0.5);
                entity.addChild(entity.frontCap);
            }

            if (entity.building.textureBackCap) {
                entity.backCap = new PIXI.Sprite(resources[entity.building.textureBackCap].texture);
                entity.backCap.anchor.set(1, 0.5);
                entity.addChild(entity.backCap);
            }

            if (building.range || building.overlapDist) {
                entity.rangeSprite = new PIXI.Graphics();
                entity.rangeSprite.alpha = 0.25;
                entity.rangeSprite.visible = game.settings.showRanges;
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

            let buildingWidth, buildingLength;
            if (!building.hasHandle) {
                buildingWidth = building.width ? building.width * METER_PIXEL_SIZE : entity.sprite?.width ?? 0;
                buildingLength = building.length ? building.length * METER_PIXEL_SIZE : entity.sprite?.height ?? 0;
                entity.setSelectionSize(buildingWidth, buildingLength);
            } else {
                entity.selectionArea.clear();
            }

            if (building.vehicle) {
                const vehicle = building.vehicle;
                entity.isTrain = (vehicle.type === 'train' || vehicle.type === 'smalltrain') ?? false;
                entity.mass = vehicle.mass ?? 25;
    
                if (entity.isTrain) {
                    entity.trackVelocity = 0;
                    entity.trackDirection = 1;
                    if (vehicle.engine) {
                        entity.userThrottle = 0;
                    }
                }
            }

            const socketWidth = 32, socketThickness = 6, powerSocketSize = 8;
            entity.createSocket = function(socketData, x, y, rotation) {
                if (!entity.sockets) {
                    entity.sockets = new PIXI.Container();
                    entity.addChild(entity.sockets);
                }

                let socket;
                if (ENABLE_DEBUG || !socketData.temp) {
                    socket = new PIXI.Graphics();
                } else {
                    socket = new PIXI.Container();
                }

                socket.connections = {};
                socket.socketData = socketData;
                socket.socketData.x = x ?? (isNaN(socket.socketData.x) ? 0 : (-buildingWidth/2) + ((socket.socketData.x / METER_TEXTURE_SCALE) / METER_PIXEL_SCALE));
                socket.socketData.y = y ?? (isNaN(socket.socketData.y) ? 0 : (-buildingLength/2) + ((socket.socketData.y / METER_TEXTURE_SCALE) / METER_PIXEL_SCALE));
                socket.socketData.rotation = rotation ?? socket.socketData.rotation;
                socket.position.set(socket.socketData.x, socket.socketData.y);
                socket.rotation = rotation ?? Math.deg2rad(socket.socketData.rotation);
                if (ENABLE_DEBUG || !socketData.temp) {
                    if (socket.socketData.flow === 'in') {
                        socket.beginFill(COLOR_RED);
                        socket.drawRect(-socketWidth/2, -socketThickness, socketWidth, socketThickness);
                    } else if (socket.socketData.flow === 'out') {
                        socket.beginFill(COLOR_GREEN);
                        socket.drawRect(-socketWidth/2, -socketThickness, socketWidth, socketThickness);
                    } else if (socket.socketData.type === 'pipe' && socket.socketData.cap !== 'left' && socket.socketData.cap !== 'right') {
                        socket.beginFill(COLOR_BLUE);
                        socket.drawRect(-socketWidth/2, -socketThickness, socketWidth, socketThickness);
                    } else if (socket.socketData.type === 'power') {
                        socket.beginFill(COLOR_YELLOW);
                        socket.drawRect(-powerSocketSize/2, -powerSocketSize/2, powerSocketSize, powerSocketSize);
                    } else if (socket.socketData.type === 'traincar' || socket.socketData.type === 'smalltraincar' || socket.socketData.type === 'smallrail' || socket.socketData.type === 'largerail' || socket.socketData.type === 'cranerail' || socket.socketData.type === 'road') {
                        socket.beginFill(COLOR_ORANGE);
                        socket.drawRect(-socketThickness/2, -socketThickness, socketThickness, socketThickness);
                    }
                    socket.endFill();
                    // Might want to add what kind of liquid it expects, water, oil, power, etc.
                    if (socket.socketData.flow === 'in') {
                        socket.pointer = new PIXI.Sprite(resources.pointer.texture);
                        socket.pointer.anchor.set(0.5, -0.5);
                        socket.pointer.rotation = Math.PI;
                    } else if (socket.socketData.flow === 'out') {
                        socket.pointer = new PIXI.Sprite(resources.pointer.texture);
                        socket.pointer.anchor.set(0.5, 1.5);
                    } else if (socket.socketData.type === 'pipe' && socket.socketData.cap !== 'left' && socket.socketData.cap !== 'right') {
                        socket.pointer = new PIXI.Sprite(resources.bipointer.texture);
                        socket.pointer.anchor.set(0.5, 1.5);
                    } else if (socket.socketData.type === 'power') {
                        socket.pointer = new PIXI.Sprite(resources.power.texture);
                        socket.pointer.anchor.set(0.5, 1.5);
                        socket.pointer.rotation = -(entity.rotation + socket.rotation);
                    } else if (socket.socketData.type === 'foundation') {
                        socket.pointer = new PIXI.Sprite(resources.foundation_border.texture);
                        socket.pointer.width = resources.foundation_border.texture.width / METER_PIXEL_SCALE;
                        socket.pointer.height = resources.foundation_border.texture.height / METER_PIXEL_SCALE;
                        socket.pointer.anchor.set(0.5, 1.0);
                    } else if (socket.socketData.temp) {
                        socket.pointer = new PIXI.Sprite(resources.bipointer.texture);
                        socket.pointer.anchor.set(0.5, 1.5);
                    }
                    if (socket.pointer) {
                        socket.addChild(socket.pointer);
                    }
                }
                socket.setConnection = function(connectingEntityId, connectingSocket, connectingSocketId) {
                    if (!isNaN(connectingEntityId) && (typeof connectingSocketId === 'number' || connectingSocket?.socketData) && (isNaN(socket.connections[connectingEntityId]) || socket.connections[connectingEntityId] !== (connectingSocketId ?? connectingSocket.socketData.id))) {
                        if (connectingSocket) {
                            socket.removeConnections();
                            connectingSocket.connections[entity.id] = socket.socketData.id;
                            connectingSocket.setVisible(false);
                        } else if (typeof connectingSocketId === 'number') {
                            const connectingEntity = game.getEntityById(connectingEntityId);
                            if (connectingEntity?.sockets) {
                                for (let i = 0; i < connectingEntity.sockets.children.length; i++) {
                                    const connectingEntitySocket = connectingEntity.sockets.children[i];
                                    if (connectingEntitySocket.socketData.id === connectingSocketId) {
                                        connectingSocket = connectingEntitySocket;
                                        break;
                                    }
                                }
                                if (!connectingSocket) {
                                    const socketPosition = connectingEntity.toLocal(socket, entity);
                                    connectingSocket = socket.createConnection(connectingEntity, socketPosition.x, socketPosition.y, ((entity.rotation + socket.rotation) - connectingEntity.rotation) + Math.PI, connectingSocketId);
                                }
                            }
                        }
                        socket.connections[connectingEntityId] = connectingSocketId ?? connectingSocket.socketData.id;
                        socket.setVisible(false);
                        return connectingSocket;
                    }
                }
                // This works for rails, unsure about anything else. Could just use the position of the socket, but we already have positional and rotation data from snapping.
                socket.createConnection = function(connectingEntity, x, y, rotation, id) {
                    if (connectingEntity?.sockets) {
                        let connectingSocket = null;
                        for (let i = 0; i < connectingEntity.sockets.children.length; i++) {
                            const socket2 = connectingEntity.sockets.children[i];
                            if (typeof socket2.connections[entity.id] === 'number') {
                                connectingSocket = socket2;
                                break;
                            }
                        }
                        if (connectingSocket) {
                            if (connectingSocket.socketData.cap) {
                                socket.removeConnections();
                                connectingSocket = null;
                            } else {
                                connectingSocket.position.set(x, y);
                                connectingSocket.rotation = rotation;
                            }
                        }

                        if (!connectingSocket) {
                            let socketData = {
                                'id': id ?? connectingEntity.sockets.children.length,
                                'type': socket.socketData.type,
                                'temp': true,
                                'switch': 'rail'
                            };
                            connectingSocket = connectingEntity.createSocket(socketData, x, y, rotation);

                            if (connectingSocket) {
                                connectingSocket.connections[entity.id] = socket.socketData.id;
                                if (Object.keys(socket.connections).length) {
                                    socket.removeConnections();
                                }
                                socket.connections[connectingEntity.id] = connectingSocket.socketData.id;
                                socket.setVisible(false);
                            }
                        }

                        if (connectingSocket) {
                            const projection = connectingEntity.bezier?.project({x: x, y: y});
                            connectingSocket.switchT = projection.t;

                            return connectingSocket;
                        }
                    }
                    return false;
                }
                socket.removeConnections = () => entity.removeConnections(socket.socketData.id);
                socket.setVisible = function(visible) {
                    if (!ENABLE_DEBUG) {
                        if (socket.socketData.type !== 'power') {
                            socket.visible = visible;
                        } else if (socket.pointer) {
                            socket.pointer.visible = visible ?? Object.keys(socket.connections).length === 0;
                        }
                    }
                }

                if (game.settings.enableExperimental && socketData.switch === 'rail') {
                    let railSwitch = new PIXI.Sprite(resources['white'].texture);
                    railSwitch.anchor.set(0.5);
                    railSwitch.tint = 0xFF0000;
                    railSwitch.width = 30;
                    railSwitch.height = 30;
                    railSwitch.position.x += 100;
                    railSwitch.interactive = true;
                    socket.switchEnabled = false;
                    railSwitch.on('pointerdown', () => {
                        socket.switchEnabled = !socket.switchEnabled;
                        if (socket.switchEnabled) {
                            railSwitch.tint = COLOR_GREEN;
                        } else {
                            railSwitch.tint = COLOR_RED;
                        }
                    });
                    socket.addChild(railSwitch);
                }

                entity.sockets.addChild(socket);
                return socket;
            }

            if (building.sockets) {
                for (let i = 0; i < building.sockets.length; i++) {
                    entity.createSocket(Object.assign({}, building.sockets[i]));
                }
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

            setTimeout(() => {
                if (game.statisticsMenuComponent) {
                    game.statisticsMenuComponent.refresh();
                }
            }, 1);

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

            entity.hasConnectionToEntityId = function(entityId, ignoredSocket) {
                if (entity.sockets) {
                    for (let i = 0; i < entity.sockets.children.length; i++) {
                        const entitySocket = entity.sockets.children[i];
                        if ((!ignoredSocket || entitySocket !== ignoredSocket) && typeof entitySocket.connections[entityId] === 'number') {
                            return true;
                        }
                    }
                }
                return false;
            }

            entity.hasConnectionToEntity = (connectingEntity, ignoredSocket) => entity.hasConnectionToEntityId(connectingEntity.id, ignoredSocket);

            entity.removeConnections = function(socketId, ignoreSelected, ignoreSocket, entityId) {
                if (entity.sockets) {
                    // Iterate sockets to make sure we either remove the connections and update the socket or remove the entity altogether.
                    for (let i = 0; i < entity.sockets.children.length; i++) {
                        const entitySocket = entity.sockets.children[i];
                        if (typeof socketId !== 'number' || (ignoreSocket ? entitySocket.socketData.id !== socketId : entitySocket.socketData.id === socketId)) {
                            let connectionEstablished = false;
                            for (const [connectedEntityId, connectedSocketId] of Object.entries(entitySocket.connections)) {
                                if (typeof entityId === 'number' && connectedEntityId === entityId) {
                                    connectionEstablished = true;
                                    continue;
                                }
                                const connectedEntity = game.getEntityById(connectedEntityId);
                                if (connectedEntity) {
                                    if (ignoreSelected && connectedEntity.selected) {
                                        connectionEstablished = true;
                                        continue;
                                    }
                                    for (let k = 0; k < connectedEntity.sockets.children.length; k++) {
                                        const connectedSocket = connectedEntity.sockets.children[k];
                                        if (connectedSocket.socketData.id === connectedSocketId) {
                                            delete connectedSocket.connections[entity.id];
                                            if (Object.keys(connectedSocket.connections).length === 0) {
                                                if (connectedEntity.building?.requireConnection) {
                                                    connectedEntity.remove();
                                                } else if (connectedSocket.socketData.temp) {
                                                    connectedEntity.sockets.removeChild(connectedSocket);
                                                } else {
                                                    connectedSocket.setVisible(true);
                                                }
                                            }
                                            break;
                                        }
                                    }
                                }
                                delete entitySocket.connections[connectedEntityId];
                            }
                            if (!connectionEstablished) {
                                if (entitySocket.socketData.temp) {
                                    entity.sockets.removeChild(entitySocket);
                                } else {
                                    entitySocket.setVisible(true);
                                }
                            }
                        }
                    }
                }
            }

            entity.removeConnectionsToEntityId = (connectingEntityId) => entity.removeConnections(undefined, undefined, undefined, connectingEntityId);

            entity.removeConnectionsToEntity = (connectingEntity) => entity.removeConnectionsToEntityId(connectingEntity.id);

            entity.afterRemove = function() {
                setTimeout(() => {
                    if (game.statisticsMenuComponent) {
                        game.statisticsMenuComponent.refresh();
                    }
                }, 1);
            };

            entity.afterLoad = function(entityData, entityIdMap) {
                if (entity.sockets && entityData.connections) {
                    for (let i = 0; i < entity.sockets.children.length; i++) {
                        const socket = entity.sockets.children[i];
                        const socketConnectionData = entityData.connections[socket.socketData.id];
                        if (socketConnectionData) {
                            for (const [connectedEntityId, connectedSocketId] of Object.entries(socketConnectionData)) {
                                const remappedEntityId = (entityIdMap && typeof entityIdMap[connectedEntityId] === 'number') ? entityIdMap[connectedEntityId] : connectedEntityId;
                                const connectedEntity = game.getEntityById(remappedEntityId);
                                if (connectedEntity) {
                                    socket.setConnection(remappedEntityId, undefined, connectedSocketId);
                                }
                            }
                        }
                    }
                }

                if (entity.isTrain && typeof entityData.currentTrackId === 'number') {
                    if (entityIdMap && typeof entityIdMap[entityData.currentTrackId] === 'number') {
                        entity.currentTrack = game.getEntityById(entityIdMap[entityData.currentTrackId]);
                    } else {
                        entity.currentTrack = game.getEntityById(entityData.currentTrackId);
                    }
                    entity.currentTrackT = entityData.currentTrackT;
                }
            }

            function createProductionIcon(icon) {
                let productionIcon = new PIXI.Graphics();
                productionIcon.beginFill(COLOR_CHARCOAL);
                productionIcon.lineStyle(3, COLOR_GREEN);
                productionIcon.drawRect(-47, -47, 94, 94);
                productionIcon.endFill();

                productionIcon.icon = new PIXI.Sprite(icon);
                productionIcon.icon.anchor.set(0.5);
                productionIcon.icon.width = 84;
                productionIcon.icon.height = 84;
                productionIcon.addChild(productionIcon.icon);
                entity.productionIcons.addChild(productionIcon);
                return productionIcon;
            }

            entity.setProductionId = function(id) {
                if (entity.building?.production && entity.building.selectedProduction !== id) {
                    entity.selectedProduction = id;
                    if (game.getSelectedEntity() === entity) {
                        game.buildingSelectedMenuComponent?.updateProduction();
                    }
                    entity.removeChild(entity.productionIcons);
                    if (typeof id === 'number') {
                        entity.productionIcons = new PIXI.Container();
                        entity.productionIcons.visible = game.settings.showProductionIcons;
                        entity.productionIcons.rotation = -entity.rotation;
                        for (let i = 0; i < entity.building.production.length; i++) {
                            const production = entity.building.production[i];
                            if (production.id === id) {
                                if (production.output) {
                                    for (const resource of Object.keys(production.output)) {
                                        createProductionIcon(resources[window.objectData.resources[resource].icon].texture);
                                    }
                                }
                                if (entity.building.power > 0 || production.power > 0) {
                                    createProductionIcon(resources.power_x128.texture);
                                }
                                const productionIcons = entity.productionIcons.children;
                                if (productionIcons.length) {
                                    const productionIcon = productionIcons[0];
                                    if (productionIcons.length > 1) {
                                        productionIcon.x = -55;
                                        productionIcons[1].x = 55;
                                    } else if (entity.sprite.width < 125 && entity.sprite.height < 125) { // Small
                                        productionIcon.width = 64;
                                        productionIcon.height = 64;
                                    } else if (entity.sprite.width < 200 && entity.sprite.height < 200) { // Medium
                                        productionIcon.width = 80;
                                        productionIcon.height = 80;
                                    } else if (entity.sprite.width > 280 && entity.sprite.height > 280) { // Extra Large
                                        productionIcon.width = 192;
                                        productionIcon.height = 192;
                                    } else {
                                        productionIcon.width = 128;
                                        productionIcon.height = 128;
                                    }
                                }
                                break;
                            }
                        }
                        entity.addChild(entity.productionIcons);
                    }
                }
            }
        }

        if (entity.type === 'building' || entity.type === 'shape') {
            let points = [];
            entity.updateHandles = function() {
                for (let i = 0; i < points.length; i++) {
                    let point = points[i];
                    if (point.handle) {
                        point.handle.tint = entity.locked ? COLOR_RED : (point.index === 0 ? COLOR_ORANGE : COLOR_WHITE);
                        point.handle.visible = entity.selected;
                    }
                }
            };

            entity.grabHandlePoint = function() {
                if (entity.selected && entity.hasHandle) {
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

            entity.onSave = function(entityData, isSelection) {
                if (entity.hasHandle) {
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
                    entityData.productionScale = entity.productionScale;
                    entityData.selectedProduction = entity.selectedProduction;
                }

                if (entity.sockets) {
                    for (let i = 0; i < entity.sockets.children.length; i++) {
                        let socket = entity.sockets.children[i];
                        let socketConnections = isSelection ? {} : socket.connections;
                        if (isSelection) {
                            for (const [connectedEntityId, connectedSocketId] of Object.entries(socket.connections)) {
                                const connectedEntity = game.getEntityById(connectedEntityId);
                                if (connectedEntity?.selected) {
                                    socketConnections[connectedEntityId] = connectedSocketId;
                                }
                            }
                        }
                        if (Object.keys(socketConnections).length) {
                            if (!entityData.connections) {
                                entityData.connections = {};
                            }
                            entityData.connections[socket.socketData.id] = socketConnections;
                        }
                    }
                }

                if (entity.type === 'shape') {
                    for (const[key, value] of Object.entries(entity.shapeStyle)) {
                        if (value !== DEFAULT_SHAPE_STYLE[key]) {
                            if (!entityData.shapeStyle) {
                                entityData.shapeStyle = {};
                            }
                            entityData.shapeStyle[key] = value;
                        }
                    }
                }

                if (entity.isTrain && entity.currentTrack) {
                    let trackFound = !isSelection;
                    if (isSelection) {
                        for (let i = 0; i < selectedEntities.length; i++) {
                            const selectedEntity = selectedEntities[i];
                            if (selectedEntity.id === entity.currentTrack.id) {
                                trackFound = true;
                                break;
                            }
                        }
                    }
                    if (trackFound) {
                        entityData.currentTrackId = entity.currentTrack.id;
                        entityData.currentTrackT = entity.currentTrackT;

                        if (typeof entity.trackDirection === 'number') {
                            entityData.trackDirection = entity.trackDirection;
                        }
                    }
                }
            };

            entity.onLoad = function(entityData) {
                if (entity.building && typeof entityData.selectedProduction === 'number') {
                    entity.productionScale = entityData.productionScale;
                    entity.setProductionId(entityData.selectedProduction);
                }

                if (entity.hasHandle && entityData.railPoints) {
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

                if (entity.type === 'shape') {
                    Object.assign(entity.shapeStyle, entityData.shapeStyle);
                    entity.setShapeStyle(entity.shapeStyle);
                }

                if (entity.isTrain && typeof entityData.trackDirection === 'number') {
                    entity.trackDirection = entityData.trackDirection;
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

                let handle = new PIXI.Sprite(resources.white.texture);
                handle.anchor.set(0.5);
                handle.visible = entity.selected;
                handle.width = 16;
                handle.height = 16;
                handle.position.x = newPoint.x;
                handle.position.y = newPoint.y;
                entity.addChild(handle);
                newPoint.handle = handle;

                if (index === 0) {
                    handle.tint = COLOR_ORANGE;
                }

                entity.regenerate();
                return newPoint;
            };

            function updateTextureCap(sprite, point, rotationOffset) {
                if (sprite) {
                    sprite.position.set(point.x, point.y);
                    sprite.rotation = point.rotation + rotationOffset;
                }
            }

            entity.regenerate = function() {
                if (entity.sprite) {
                    if (entity.sprite.rope) {
                        entity.sprite.removeChild(entity.sprite.rope);
                    }
                    if (points.length >= 2) {
                        const frontPoint = points[0], backPoint = points[points.length - 1];
                        if (entity.building) {
                            let bezierPoints = [];
                            for (let i=0; i<points.length; i++) {
                                let point = points[i];

                                if (subtype === 'pipeline' || subtype === 'pipeline_insulation' || subtype === 'barbedwirespline') {
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
                            const lut = entity.bezier.getLUT(Math.round(entity.bezier.length()/TRACK_SEGMENT_LENGTH));
                            if (entity.building.texture) {
                                resources[entity.building.texture].texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
                                entity.sprite.rope = new PIXI.SimpleRope(resources[entity.building.texture].texture, lut, 1);
                                if (typeof entity.building.color === 'number') {
                                    entity.sprite.rope.tint = entity.building.color;
                                }
                                entity.sprite.addChild(entity.sprite.rope);
                            }
                            updateTextureCap(entity.frontCap, frontPoint, Math.PI);
                            updateTextureCap(entity.backCap, backPoint, Math.PI);
                            entity.bezier.mid = entity.bezier.get(0.5);
                            if (entity.sockets) {
                                let midNormal = entity.bezier.normal(entity.bezier.mid.t);
                                let midAngle = Math.angleBetween({x: 0, y: 0}, midNormal) - Math.PI/2;
                                for (let i = 0; i < entity.sockets.children.length; i++) {
                                    let socket = entity.sockets.children[i];
                                    let socketPosition, socketRotation;
                                    if (socket.socketData.cap === 'left' || socket.socketData.cap === 'right') {
                                        socketRotation = midAngle + Math.deg2rad(socket.socketData.rotation);
                                        socketPosition = Math.extendPoint(entity.bezier.mid, 8, socketRotation - Math.PI/2);
                                    }
                                    switch (socket.socketData.cap) {
                                        case 'left':
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
                            if (entity.building.hasOutline !== false) {
                                entity.sprite.removeChild(entity.sprite.outline);
                                entity.sprite.outline = new PIXI.SimpleRope(resources.white.texture, lut, 1);
                                entity.sprite.outline.tint = entity.locked ? COLOR_RED : COLOR_ORANGE;
                                entity.sprite.addChild(entity.sprite.outline);
                            }
                        } else if (entity.type === 'shape') {
                            entity.sprite.clear();
                            entity.sprite.alpha = entity.shapeStyle.alpha;
                            let endPoint = points[points.length - 1];
                            /*
                            if (entity.shapeStyle.fill) {
                                entity.sprite.beginFill(entity.shapeStyle.fillColor);
                            }
                            if (entity.subtype === 'line') {
                                entity.sprite.lineStyle(entity.shapeStyle.lineWidth, entity.shapeStyle.fillColor).moveTo((entity.shapeStyle.frontArrow ? entity.shapeStyle.lineWidth * 1.875 : 0), 0).lineTo(endPoint.x - (entity.shapeStyle.backArrow ? entity.shapeStyle.lineWidth * 1.875 : 0), endPoint.y);
                                updateTextureCap(entity.frontCap, frontPoint, Math.PI/2);
                                updateTextureCap(entity.backCap, backPoint, -Math.PI/2);
                            } else if (entity.shapeStyle.border) {
                                entity.sprite.lineStyle(entity.shapeStyle.lineWidth, entity.shapeStyle.lineColor, 1);
                            }
                            */
                            if (entity.subtype === 'line') {
                                entity.sprite.lineStyle(entity.shapeStyle.lineWidth, entity.shapeStyle.fillColor).moveTo((entity.shapeStyle.frontArrow ? entity.shapeStyle.lineWidth * 1.875 : 0), 0).lineTo(endPoint.x - (entity.shapeStyle.backArrow ? entity.shapeStyle.lineWidth * 1.875 : 0), endPoint.y);
                                updateTextureCap(entity.frontCap, frontPoint, Math.PI/2);
                                updateTextureCap(entity.backCap, backPoint, -Math.PI/2);
                            } else if (entity.shapeStyle.border) {
                                entity.sprite.lineStyle(entity.shapeStyle.lineWidth, entity.shapeStyle.fillColor, 1);
                            } else {
                                entity.sprite.beginFill(entity.shapeStyle.fillColor);
                            }
                            if (entity.subtype === 'rectangle') {
                                const p1 = { x: endPoint.x < 0 ? endPoint.x : 0, y: endPoint.y < 0 ? endPoint.y : 0 };
                                const w = endPoint.x > 0 ? endPoint.x : -endPoint.x;
                                const h = endPoint.y > 0 ? endPoint.y : -endPoint.y;
                                entity.sprite.drawRect(p1.x, p1.y, w, h);
                            } else if (entity.subtype === 'circle') {
                                entity.sprite.drawCircle(0, 0, endPoint.x);
                            }
                            entity.sprite.endFill();
                        }
                    }
                }
            };

            if (entity.type ==='shape') {
                entity.sprite = new PIXI.Graphics();
                entity.addChild(entity.sprite);
                entity.shapeStyle = Object.assign({}, entity.subtype === 'line' ? DEFAULT_LINE_STYLE : DEFAULT_SHAPE_STYLE);

                function updateArrow(sprite, visible) {
                    if (visible) {
                        if (!sprite) {
                            sprite = new PIXI.Sprite(resources.point.texture);
                            sprite.anchor.set(0.5, 0);
                            entity.sprite.addChild(sprite);
                        }
                        sprite.width = entity.shapeStyle.lineWidth * 6;
                        sprite.height = entity.shapeStyle.lineWidth * 6;
                        sprite.tint = entity.shapeStyle.fillColor;
                        return sprite;
                    } else {
                        entity.sprite.removeChild(sprite);
                    }
                    return null;
                }

                entity.setShapeStyle = function(style) {
                    entity.shapeStyle = style;
                    entity.frontCap = updateArrow(entity.frontCap, entity.shapeStyle.frontArrow);
                    entity.backCap = updateArrow(entity.backCap, entity.shapeStyle.backArrow);
                    entity.regenerate();
                }

                entity.selectionArea.clear();
            }

            if (entity.hasHandle) {
                entity.addPoint(0, 0);
                entity.addPoint(entity.building ? (entity.building.minLength > 1 ? entity.building.minLength * METER_PIXEL_SIZE : 200) : 0, 0);
                if (entity.shapeStyle) {
                    entity.setShapeStyle(entity.shapeStyle);
                }
            }
        }

        if (entity.hasHandle) {
            entity.addChild(entity.selectionArea);
        }

        entity.onSelect = function() {
            entity.selected = true;
            entity.selectionArea.tint = entity.locked ? COLOR_RED : COLOR_WHITE;
            entity.selectionArea.visible = true;

            if (entity.rangeSprite && !entity.rangeSprite.visible) {
                entity.rangeSprite.visible = true;
            }

            if (entity.sprite?.outline) {
                entity.sprite.outline.tint = entity.locked ? COLOR_RED : COLOR_ORANGE;
            }

            if (entity.hasHandle) {
                entity.updateHandles();
            }
        };

        entity.onDeselect = function() {
            entity.selected = false;
            entity.selectionArea.visible = false;
            delete entity.prevRotation;

            if (entity.rangeSprite && !game.settings.showRanges) {
                entity.rangeSprite.visible = false;
            }

            if (entity.building || entity.type === 'shape') {
                if (entity.building) {
                    if (entity.bezier && entity.bezier.length() <= entity.building.minLength) {
                        entity.remove();
                    } else if (entity.building.requireConnection) {
                        // Requires all sockets have at least one connection. Mainly for power lines.
                        for (let i = 0; i < entity.sockets.children.length; i++) {
                            const socket = entity.sockets.children[i];
                            if (Object.keys(socket.connections).length === 0) {
                                entity.remove();
                                break;
                            }
                        }
                    }
                } else if (entity.type === 'shape' && (entity.sprite.width < 16 || (entity.subtype !== 'line' && entity.sprite.height < 16))) {
                    // TODO: Need to adjust this better for lines. They can still be really short.
                    entity.remove();
                    return;
                }
                entity.updateHandles();
            } else if (entity.type === 'text' && entity.label.text.length === 0) {
                entity.remove();
            }
        };

        entity.onRemove = function() {
            if (entity.selected) {
                game.removeSelectedEntity(entity);
            }
            if (entity.following) {
                game.followEntity(null);
            }
            if (selectedHandlePoint) {
                selectedHandlePoint = null;
            }
            if (entity.sockets) {
                entity.removeConnections();
            }
            if (sound) {
                soundStop(sound);
                sound = null;
            }
        };

        let boundsBuffer = 15;
        entity.canGrab = function() {
            if (entity.type === 'shape' && entity.subtype === 'circle') {
                if (Math.distanceBetween(entity, { x: gmx, y: gmy }) < ((entity.sprite.width/2) + (boundsBuffer/2))) {
                    return true;
                }
            } else {
                let bounds = entity.getBounds(true);
                let boundsAdjustedPos = app.cstage.toLocal({x: bounds.x, y: bounds.y}, app.stage, undefined, true);
                bounds.x = boundsAdjustedPos.x - boundsBuffer;
                bounds.y = boundsAdjustedPos.y - boundsBuffer;
                bounds.width = bounds.width/game.camera.zoom;
                bounds.height = bounds.height/game.camera.zoom;
                bounds.bufferWidth = bounds.width + (boundsBuffer * 2);
                bounds.bufferHeight = bounds.height + (boundsBuffer * 2);

                if (gmx >= bounds.x && gmx <= bounds.x + bounds.bufferWidth && gmy >= bounds.y && gmy <= bounds.y + bounds.bufferHeight) {
                    // TODO: Add padding around sprite so that it's easier to select.
                    // Will need to check for entity.building?.isBezier and entity.bezier when that happens.
                    if (entity.bezier) {
                        let mousePos = entity.toLocal({x: gmx, y: gmy}, app.cstage, undefined, true);
                        let projection = entity.bezier.project(mousePos);
                        if (projection.d <= (entity.building?.lineWidth ?? 25)) {
                            return true;
                        }
                    } else {
                        // https://stackoverflow.com/a/67732811 <3
                        let w = entity.selectionArea.width / 2;
                        let h = entity.selectionArea.height / 2;
                        const r = entity.rotation;

                        const [ax, ay] = [Math.cos(r), Math.sin(r)];
                        const t = (x, y) => ({x: x * ax - y * ay + entity.x, y: x * ay + y * ax + entity.y});
                        let bBounds;
                        if (entity.hasHandle) {
                            w = entity.sprite.width;
                            h = entity.subtype === 'rectangle' ? entity.sprite.height : entity.sprite.height / 2;
                            bBounds = [t(w, h), t(0, h), t(0, entity.subtype !== 'rectangle' ? -h : 0), t(w, entity.subtype !== 'rectangle' ? -h : 0)];
                        } else {
                            bBounds = [t(w, h), t(-w, h), t(-w, -h), t(w, -h)];
                        }
                        return Math.isPointWithinBounds({ x: gmx, y: gmy }, bBounds);
                    }
                }
            }
            return false;
        };

        entity.getZIndex = function() {
            return -entity.y - ((entity.building ?? entity.metaData)?.sortOffset ?? 0) - (entity.type === 'text' ? 10000000 : (entity.selected && !entity.following ? 5000000 : 0));
        };

        if (entity.building && entity.building.isBezier) {
            entity.isVisible = function () {
                return true;
            };
        }

        let frameX = 0, frameY = 0;
        let sound = null;
        entity.tick = function() {
            if (entity.sprite) {
                entity.visible = entity.isVisible();
            }

            if (entity.visible && !pickupSelectedEntities && entity.selected && !entity.selectionArea.visible) {
                entity.selectionArea.visible = true;
            }

            if (entity.building) {
                if (sheet && entity.visible) {
                    frameX += entity.building.texture.speed ? entity.building.texture.speed : 0.1;
                    if (frameX >= frameWidth) {
                        frameX -= frameWidth;
                    }
                    if (frameY >= frameHeight) {
                        frameY -= frameHeight;
                    }
                    entity.sprite.texture = sheet[Math.floor(frameX)][Math.floor(frameY)];
                }

                if (entity.building.sound) {
                    if (!sound && entity.building.sound && sounds[entity.building.sound]) {
                        sound = soundPlay(sounds[entity.building.sound], entity, 0.4);
                    }

                    if (sound) {
                        soundUpdate(sound);
                        if (sound.stopped) {
                            sound = null;
                        }
                    }
                } else if (entity.isTrain) {
                    let rate = Math.abs(entity.trackVelocity)/6;
                    if (rate < 0) {
                        rate = 0;
                    }
                    if (rate > 1) {
                        rate = 1;
                    }

                    if (entity.subtype === 'trainengine' && entity.currentTrack && Math.abs(entity.userThrottle) > 0) {
                        if (game.settings.quality === 'auto' || game.settings.quality === 'high') {
                            if (!entity.smokeTime || entity.smokeTime <= 0) {
                                entity.smokeTime = 6 - Math.floor(Math.abs(entity.trackVelocity)*0.5);
                                let angle = (Math.PI * 2) * Math.random();
                                let size = 70 + Math.round(Math.random() * 10);
                                let speed = 0.25 + (Math.random() * 0.2);
                                createEffect('smoke', entity.x + Math.cos(entity.rotation) * 90, entity.y + Math.sin(entity.rotation) * 90, entity.z, size, size, {
                                    dx: Math.cos(angle) * (speed * Math.random()),
                                    dy: Math.sin(angle) * (speed * Math.random()),
                                    tint: 0xCCCCCC
                                });
                            }
                            entity.smokeTime--;
                        }
                    }

                    if (rate > 0.15) {
                        if (!sound) {
                            let soundKey = 'train_wheel_loop';
                            if (entity.subtype === 'trainengine' && Math.abs(entity.userThrottle) >= 0.05) {
                                soundKey = 'train_engine';
                            }
                            sound = soundPlay(sounds[soundKey], entity, 0.4);
                        }

                        if (sound) {
                            soundUpdate(sound);

                            sound.sound.rate(rate, sound.id);
                            if (sound.stopped) {
                                sound = null;
                            }
                        }
                    } else {
                        if (sound) {
                            soundStop(sound);
                            sound = null;
                        }
                    }
                }
            }

            if (entity.visible && entity.hasHandle) {
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
                        } else if (entity.type === 'shape' || entity.building) {
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

                            if (entity.subtype === 'line' || entity.subtype === 'circle') {
                                let angle = Math.angleBetween(entity, { x: gmx, y: gmy });
                                if (game.settings.enableSnapRotation) {
                                    let snapRotationDegrees = Math.deg2rad(game.settings.snapRotationDegrees ? game.settings.snapRotationDegrees : 15);
                                    angle = Math.round(angle / snapRotationDegrees) * snapRotationDegrees;
                                }
                                entity.rotation = angle;
                                selectedHandlePoint.y = 0;
                            }

                            if (entity.building) {
                                if (!entity.building.isBezier || Math.abs(selectedHandlePoint.y) < 25) {
                                    if (!entity.building.isBezier && (entity.building.canSnapRotate || !entity.hasConnections())) {
                                        let angle = Math.angleBetween(entity, { x: gmx, y: gmy });
                                        if (!entity.building.ignoreSnapSettings && game.settings.enableSnapRotation) {
                                            let snapRotationDegrees = Math.deg2rad(game.settings.snapRotationDegrees ? game.settings.snapRotationDegrees : 15);
                                            angle = Math.round(angle / snapRotationDegrees) * snapRotationDegrees;
                                        }
                                        entity.rotation = angle;
                                    }
                                    selectedHandlePoint.y = 0;
                                }

                                if (!entity.building.isBezier && entity.building.minLength) {
                                    const minLength = entity.building.minLength * METER_PIXEL_SIZE;
                                    if (selectedHandlePoint.x < minLength) {
                                        selectedHandlePoint.x = minLength;
                                    }
                                }
                            }
                        }

                        if (entity.building && !mouseDown[2]) {
                            let handleSocket;
                            let connectionEstablished = false;
                            if (entity.sockets) {
                                // TODO: Store this somewhere in sockets.
                                for (let i = 0; i < entity.sockets.children.length; i++) {
                                    const entitySocket = entity.sockets.children[i];
                                    if (entitySocket.socketData?.cap === 'back') {
                                        handleSocket = entitySocket;
                                        break;
                                    }
                                }
                                entity.removeConnections(0, false, true);
                            }
                            for (let i = 0; i < entities.length; i++) {
                                let entity2 = entities[i];
                                if (!entity2.visible || entity2 === entity || entity2.type !== 'building' || !(entity.sockets && entity2.sockets) || Math.distanceBetween({x: gmx, y: gmy}, entity2) > 1000) {
                                    continue;
                                }

                                if (entity2.sockets) {
                                    if (entity.building?.canSnapStructureType !== false || entity.subtype !== entity2.subtype) {
                                        const mousePos2 = entity2.toLocal({x: gmx, y: gmy}, app.cstage, undefined, true);
                                        let nearestSocket, nearestSocketPos, nearestSocketDist = null;
                                        for (let i = 0; i < entity2.sockets.children.length; i++) {
                                            const entitySocket = entity2.sockets.children[i];
                                            if (typeof handleSocket.socketData.type === 'string' && handleSocket.socketData.type === entitySocket.socketData.type && !entitySocket.socketData.temp) {
                                                const socketDistance = Math.distanceBetween(mousePos2, entitySocket);
                                                if ((socketDistance < 35 && (nearestSocketDist === null || socketDistance < nearestSocketDist)) || entity.subtype === 'power_line' && entity2.canGrab()) {
                                                    const entityConnections = Object.keys(entitySocket.connections).length;
                                                    if (entitySocket.connections[entity.id] === handleSocket.socketData.id || (!entity.hasConnectionToEntity(entity2, handleSocket) && (entityConnections === 0 || (entitySocket.socketData.connectionLimit && entityConnections < entitySocket.socketData.connectionLimit)))) {
                                                        nearestSocketPos = app.cstage.toLocal({x: entitySocket.x, y: entitySocket.y}, entity2, undefined, true);
                                                        if (Math.floor(Math.distanceBetween(entity, nearestSocketPos)) <= (entity.building?.maxLength * METER_PIXEL_SIZE)) {
                                                            nearestSocket = entitySocket;
                                                            nearestSocketDist = socketDistance;
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                        if (nearestSocket) {
                                            if (handleSocket.socketData.type === 'power') {
                                                entity.rotation = Math.angleBetween(entity, nearestSocketPos);
                                            }
                                            nearestSocketPos = entity.toLocal(nearestSocketPos, app.cstage, undefined, true);
                                            const socketRotation = Math.angleNormalized(((entity2.rotation + nearestSocket.rotation) - entity.rotation) - Math.deg2rad(handleSocket.socketData.rotation));
                                            // TODO: Only force rotate snap constraint whenever the first socket is connected, otherwise the entity should be able to rotate and attempt snapping.
                                            if (handleSocket.socketData.type === 'power' || Math.angleDifference(Math.angleNormalized(selectedHandlePoint.rotation), socketRotation) === 0 && Math.round(nearestSocketPos.y) === 0 || entity.building?.isBezier) {
                                                handleSocket.setConnection(entity2.id, nearestSocket);
                                                selectedHandlePoint.x = nearestSocketPos.x;
                                                if (entity.building?.isBezier) {
                                                    selectedHandlePoint.y = nearestSocketPos.y;
                                                    selectedHandlePoint.rotation = socketRotation;
                                                }
                                                connectionEstablished = true;
                                                break;
                                            }
                                        }
                                    }
                                }
                                
                                if (!connectionEstablished && !entity.hasConnectionToEntity(entity2, handleSocket) && entity2.bezier && entity2.building?.isBezier && entity2.building?.canSnapAlongBezier && entity.subtype === entity2.subtype) {
                                    let selectedPointToEntity2Local = entity2.toLocal(selectedHandlePoint, entity, undefined, true);
                                    let projection = entity2.bezier.project(selectedPointToEntity2Local);
                                    if (projection.d <= (entity2.building?.lineWidth ?? 25) && (!entity.building?.maxLength || Math.distanceBetween(entity, {x: gmx, y: gmy}) <= entity.building.maxLength * METER_PIXEL_SIZE)) {
                                        let local = entity.toLocal({x: projection.x, y: projection.y}, entity2, undefined, true);
                                        let normal = entity2.bezier.normal(projection.t);
                                        let angle = Math.angleBetween({x: 0, y: 0}, normal);
                                        selectedHandlePoint.x = local.x;
                                        selectedHandlePoint.y = local.y;

                                        let currentRot = entity.rotation + selectedHandlePoint.rotation;
                                        let angleRight = entity2.rotation + (angle - Math.PI/2) - Math.PI/2;
                                        let angleLeft = entity2.rotation + (angle + Math.PI/2) - Math.PI/2;
                                        let rightDiff = Math.angleNormalized(angleRight - currentRot);
                                        let leftDiff = Math.angleNormalized(angleLeft - currentRot);

                                        // TODO: Handle saving previous rotations of snapped handles as well.

                                        if (rightDiff < leftDiff) {
                                            selectedHandlePoint.rotation = (angleRight + Math.PI/2) - entity.rotation;
                                        } else {
                                            selectedHandlePoint.rotation = (angleLeft + Math.PI/2) - entity.rotation;
                                        }

                                        if (handleSocket && (entity.subtype === 'rail_large_gauge' || entity.subtype === 'rail_small_gauge')) {
                                            handleSocket.createConnection(entity2, projection.x, projection.y, angle + Math.PI);
                                        }

                                        connectionEstablished = true;
                                        break;
                                    }
                                }
                            }
                            if (handleSocket && !connectionEstablished) {
                                handleSocket.removeConnections();
                            }
                        }

                        const MIN_SEGMENT_DISTANCE = entity.building?.minLength * METER_PIXEL_SIZE;
                        const MAX_SEGMENT_DISTANCE = entity.building?.maxLength * METER_PIXEL_SIZE;
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
                        if (entity.building?.isBezier && entity.sprite?.rope) {
                            if (entity.subtype === 'pipeline' || entity.subtype === 'pipeline_insulation' || subtype === 'barbedwirespline') {
                                if (dist < 3*METER_PIXEL_SIZE) {
                                    entity.sprite.rope.tint = COLOR_RED;
                                } else {
                                    entity.sprite.rope.tint = COLOR_WHITE;
                                }
                            } else {
                                let curve1 = entity.bezier.curvature(0.25);
                                let curve2 = entity.bezier.curvature(0.5);
                                let curve3 = entity.bezier.curvature(0.75);
                                if (dist < MIN_SEGMENT_DISTANCE || (curve1.r !== 0 && (Math.abs(curve1.r) < 100 || Math.abs(curve2.r) < 200 || Math.abs(curve3.r) < 100)) || selectedHandlePoint.x < 0) {
                                    entity.sprite.rope.tint = COLOR_RED;
                                } else {
                                    entity.sprite.rope.tint = COLOR_WHITE;
                                }
                            }
                        }

                        if (selectedHandlePoint.handle) {
                            selectedHandlePoint.handle.position.x = selectedHandlePoint.x;
                            selectedHandlePoint.handle.position.y = selectedHandlePoint.y;
                        }
                    }
                }
            }

            if (entity.isTrain && entity.currentTrack && entity.currentTrack.bezier) {
                if (entity.currentTrackT === null) {
                    const projection = entity.currentTrack.bezier?.project(entity.currentTrack.toLocal({x: entity.x, y: entity.y}, app.cstage, undefined, true));
                    entity.currentTrackT = projection.t;

                    if (Math.abs(entity.lastTrackT - entity.currentTrackT) <= 0.1) {
                        entity.trackDirection *= -1;
                    }
                }

                let normal = entity.currentTrack.bezier.normal(entity.currentTrackT);
                let angle = Math.angleBetween({x: 0, y: 0}, normal);
                if (entity.trackDirection === -1) {
                    angle += Math.PI;
                }
                entity.rotation = Math.normalizeAngleRadians(entity.currentTrack.rotation + (angle - Math.PI/2));

                if (entity.building.vehicle.engine) {
                    entity.throttle = 0.01 * entity.userThrottle;
                }

                entity.trackVelocity *= 0.999;
                if (Math.abs(entity.trackVelocity) <= 0.0001) {
                    entity.trackVelocity = 0;
                }

                let maxVelocity = entity.building.vehicle.maxSpeed;
                if (entity.trackVelocity > maxVelocity) {
                    entity.trackVelocity = maxVelocity;
                } else if (entity.trackVelocity < -maxVelocity) {
                    entity.trackVelocity = -maxVelocity;
                }
                entity.moveAlongBezier((entity.trackVelocity/entity.currentTrack.bezier.length()) * entity.trackDirection);

                if (entity.throttle) {
                    entity.trackVelocity += entity.throttle;
                }
            }
        };

        entity.moveAlongBezier = function(amount) {
            let previousTrackT = entity.currentTrackT;
            entity.currentTrackT += amount;
            if (entity.currentTrackT < 0 || entity.currentTrackT > 1) {
                let closestSocket = null;
                let closestDist = 1000000;
                for (let j = 0; j < entity.currentTrack.sockets.children.length; j++) {
                    const socket = entity.currentTrack.sockets.children[j];
                    let worldSocketPos = app.cstage.toLocal({
                        x: socket.x,
                        y: socket.y
                    }, entity.currentTrack, undefined, true);
                    let dist = Math.distanceBetween(entity, worldSocketPos);
                    if (dist <= closestDist) {
                        closestDist = dist;
                        closestSocket = socket;
                    }
                }

                if (closestSocket && closestSocket.connections && Object.keys(closestSocket.connections).length) {
                    for (const [connectedEntityId] of Object.entries(closestSocket.connections)) {
                        entity.currentTrack = game.getEntityById(connectedEntityId);
                        entity.lastTrackT = entity.currentTrackT;
                        entity.currentTrackT = null;
                        break;
                    }
                } else {
                    if (entity.currentTrackT >= 1) {
                        entity.currentTrackT = 1;
                    } else if (entity.currentTrackT <= 0) {
                        entity.currentTrackT = 0;
                    }
                    entity.userThrottle = 0;
                    entity.trackVelocity = 0;
                }
            } else {
                let closeSocket = null;
                for (let j = 0; j < entity.currentTrack.sockets.children.length; j++) {
                    const socket = entity.currentTrack.sockets.children[j];
                    if (socket.switchEnabled &&
                        ((previousTrackT <= socket.switchT && entity.currentTrackT >= socket.switchT) ||
                        (previousTrackT >= socket.switchT && entity.currentTrackT <= socket.switchT))
                    ) {
                        closeSocket = socket;
                        break;
                    }
                }

                if (closeSocket && closeSocket.socketData.switch === 'rail') {
                    for (const [connectedEntityId] of Object.entries(closeSocket.connections)) {
                        let projection1 = entity.currentTrack.bezier.get(entity.currentTrackT);
                        let curTrackPos = app.cstage.toLocal({
                            x: projection1.x,
                            y: projection1.y
                        }, entity.currentTrack, undefined, true);
                        let angle1 = Math.angleBetween(entity, curTrackPos);

                        let newTrack = game.getEntityById(connectedEntityId);
                        let projection2 = newTrack.bezier?.project(newTrack.toLocal({x: entity.x, y: entity.y}, app.cstage, undefined, true));
                        let newTrackGet = newTrack.bezier.get(projection2.t + (projection2.t > 0.5 ? -0.1 : 0.1));
                        let newTrackPos = app.cstage.toLocal({
                            x: newTrackGet.x,
                            y: newTrackGet.y
                        }, newTrack, undefined, true);
                        let angle2 = Math.angleBetween(entity, newTrackPos);
                        let angleDiff = Math.abs(Math.differenceBetweenAngles(angle1, angle2));
                        if (angleDiff <= Math.PI/4) {
                            entity.currentTrack = newTrack;
                            entity.lastTrackT = entity.currentTrackT;
                            entity.currentTrackT = null;
                        }
                        break;
                    }
                }
            }

            if (entity.currentTrackT === null) {
                const projection = entity.currentTrack.bezier?.project(entity.currentTrack.toLocal({x: entity.x, y: entity.y}, app.cstage, undefined, true));
                entity.currentTrackT = projection.t;

                let normal = entity.currentTrack.bezier.normal(entity.currentTrackT);
                let newAngle = Math.angleBetween({x: 0, y: 0}, normal);
                if (entity.trackDirection === -1) {
                    newAngle += Math.PI;
                }
                newAngle = Math.normalizeAngleRadians(entity.currentTrack.rotation + (newAngle - Math.PI / 2));
                let currentAngle = Math.normalizeAngleRadians(entity.rotation);
                if (Math.abs(Math.differenceBetweenAngles(currentAngle, newAngle)) >= Math.PI / 2) {
                    entity.trackDirection *= -1;
                }
            }

            let projection = entity.currentTrack.bezier.get(entity.currentTrackT);
            let global = app.cstage.toLocal({
                x: projection.x,
                y: projection.y
            }, entity.currentTrack, undefined, true);
            entity.x = global.x;
            entity.y = global.y;

            if (game.getSelectedEntity() === entity) {
                game.buildingSelectedMenuComponent?.refresh(true);
            }
        };

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
                        x: ignoreOffset ? (entity.building?.hasHandle ? (entity.building.minLength > 1 ? (entity.building.minLength * METER_PIXEL_SIZE) / 2 : 100) : 0) : (position?.x ?? gmx) - entity.x,
                        y: ignoreOffset ? 0 : (position?.y ?? gmy) - entity.y
                    };
                }
            });
            if (!locked) {
                if (pickup) {
                    pickupTime = Date.now();
                    pickupPosition = {x: position?.x ?? gmx, y: position?.y ?? gmy};
                    ignoreMousePickup = true;
                }
                pickupSelectedEntities = pickup;
            }
        }
    }

    game.create = function(type, subtype, x, y, z) {
        game.updateConstructionMode(type, subtype);
        let entity = createSelectableEntity(type, subtype, x ?? 0, y ?? 0, z ?? 0);
        game.selectEntity(entity);
        game.setPickupEntities(true, true);
        if (entity.hasHandle) {
            entity.shouldSelectLastHandlePoint = true;
        }
        return entity;
    }

    game.createBuildingAtCenter = function(key) {
        let zoomRatio = WIDTH/(WIDTH*camera.zoom);
        game.resetConstructionMode();
        return createSelectableEntity('building', key, (camera.x + WIDTH/2) * zoomRatio, (camera.y + HEIGHT/2) * zoomRatio, 0);
    };

    game.cloneSelected = function() {
        game.loadSave(game.getSaveData(true), true);
    }

    game.upgradeSelected = function(upgrade) {
        let entity = game.getSelectedEntity();
        let bData = entity?.building;
        if (bData) {
            if (upgrade) {
                upgrade = bData.parentKey ? bData.parentKey + '_' + upgrade : bData.key + '_' + upgrade;
                upgrade = bData.key === upgrade ? bData.parentKey || bData.key : upgrade;
            }
            let clone = createSelectableEntity('building', upgrade ?? entity.building.key, entity.x, entity.y, entity.z, entity.rotation, entity.id);
            if (upgrade) {
                let position = { x: clone.x, y: clone.y };
                if (entity.building?.positionOffset) {
                    position.x -= ((entity.building.positionOffset.x ?? 0) / METER_TEXTURE_SCALE) / METER_PIXEL_SCALE;
                    position.y -= ((entity.building.positionOffset.y ?? 0) / METER_TEXTURE_SCALE) / METER_PIXEL_SCALE;
                }
                if (clone.building?.positionOffset) {
                    position.x += ((clone.building.positionOffset.x ?? 0) / METER_TEXTURE_SCALE) / METER_PIXEL_SCALE;
                    position.y += ((clone.building.positionOffset.y ?? 0) / METER_TEXTURE_SCALE) / METER_PIXEL_SCALE;
                }
                position = Math.rotateAround(clone, position, entity.rotation);
                clone.position.set(position.x, position.y);
            }
            clone.locked = entity.locked;
            clone.selectionArea.tint = clone.locked ? COLOR_RED : COLOR_WHITE;
            let entityData = {};
            entity.onSave(entityData);
            entityData.selectedProduction = null;
            clone.onLoad(entityData);
            clone.afterLoad(entityData);
            game.selectEntity(clone);
            entity.sockets = null;
            entity.remove();
            return clone;
        }
        return null;
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
            if (selectedEntity.sprite?.outline) {
                selectedEntity.sprite.outline.tint = selectedEntity.locked ? COLOR_RED : COLOR_ORANGE;
            }
            if (selectedEntity.hasHandle) {
                selectedEntity.updateHandles();
            }
        });
        if (locked && pickupSelectedEntities) {
            game.setPickupEntities(false);
        }
    }

    game.removeEntities = function() {
        game.deselectEntities();
        game.setPickupEntities(false);
        for (let i = 0; i < entities.length; i++) {
            let entity = entities[i];
            entity.remove();
        }
        entities = [];
        _entityIds = 0;
        if (game.statisticsMenuComponent) {
            game.statisticsMenuComponent.refresh();
        }
    }

    game.confirmDeletion = function(callback, loading) {
        game.confirmationPopup.showPopup(loading ? 'save-work' : 'delete', confirmed => {
            if (confirmed) {
                game.removeEntities();
            }
            if (typeof callback === 'function') {
                callback(confirmed);
            }
        });
    }

    function shuffle(array) {
        let currentIndex = array.length, temporaryValue, randomIndex;
        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
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

        if (Date.now() >= environmentUpdateTime) {
            environmentUpdateTime = Date.now() + 5000;
            windAngle += -0.4 + (Math.random() * 0.8);
            windStrength += -0.001 + (Math.random() * 0.002);
            if (windStrength > 0.03) {
                windStrength = 0.03;
            } else if (windStrength < 0.005) {
                windStrength = 0.005;
            }
        }

        if (!game.isPlayScreen) {
            if (!menuInit) {
                MAP_WIDTH = WIDTH+5;
                MAP_HEIGHT = HEIGHT+5;
                menuInit = true;

                game.appComponent.gameLoaded();
            }
        }

        let vehicles = [];
        for (let i=0; i<entities.length; i++) {
            let entity = entities[i];
            if (entity.valid) {
                entity.tick(delta);

                if (entity.isTrain && entity.currentTrack) {
                    vehicles.push(entity);
                }
            } else {
                entities.splice(i, 1);
                if (entities.length === 0) {
                    _entityIds = 0;
                }
                i--;
                entity.afterRemove();
            }
        }

        shuffle(vehicles);
        const SOLVER_STEPS = 4;
        for (let k=0; k<SOLVER_STEPS; k++) {
            for (let i = 0; i < vehicles.length; i++) {
                let entity = vehicles[i];
                if (entity.valid && entity.isTrain && entity.currentTrack) {
                    for (let j=vehicles.length-1; j>=0; j--) {
                        if (i !== j) {
                            let entity2 = vehicles[j];
                            if (!entity2 || !entity2.isTrain || !entity2.currentTrack) {
                                continue;
                            }
                            let dist = Math.distanceBetween(entity, entity2);
                            if (dist > 1000) {
                                continue;
                            }

                            let buffer = 15;
                            let poly1Width = (entity.sprite.width-buffer)/2;
                            let poly1Height = (entity.sprite.height-buffer)/2;
                            let box1 = new SAT.Polygon(new SAT.Vector(entity.x, entity.y), [
                                new SAT.Vector(-poly1Width,-poly1Height),
                                new SAT.Vector(poly1Width,-poly1Height),
                                new SAT.Vector(poly1Width,poly1Height),
                                new SAT.Vector(-poly1Width,poly1Height),
                            ]);
                            box1.setAngle(entity.rotation);
                            let poly2Width = (entity2.sprite.width-buffer)/2;
                            let poly2Height = (entity2.sprite.height-buffer)/2;
                            let box2 = new SAT.Polygon(new SAT.Vector(entity2.x, entity2.y), [
                                new SAT.Vector(-poly2Width,-poly2Height),
                                new SAT.Vector(poly2Width,-poly2Height),
                                new SAT.Vector(poly2Width,poly2Height),
                                new SAT.Vector(-poly2Width,poly2Height),
                            ]);
                            box2.setAngle(entity2.rotation);

                            let response = new SAT.Response();
                            if (SAT.testPolygonPolygon(box1, box2, response)) {
                                let pPos = app.cstage.toLocal(entity.currentTrack.bezier.get(entity.currentTrackT + (0.05 * entity.trackDirection)), entity.currentTrack, undefined, true);
                                let pNeg = app.cstage.toLocal(entity.currentTrack.bezier.get(entity.currentTrackT - (0.05 * entity.trackDirection)), entity.currentTrack, undefined, true);

                                let distDiff = response.overlap;
                                let distDiffScaled = (distDiff / entity.currentTrack.bezier.length()) * entity.trackDirection;
                                if (Math.distanceBetween(entity2, pPos) >= Math.distanceBetween(entity2, pNeg)) {
                                    entity.moveAlongBezier(distDiffScaled/2);
                                    entity.trackVelocity += distDiff/entity.mass;
                                } else {
                                    entity.moveAlongBezier(-distDiffScaled/2);
                                    entity.trackVelocity -= distDiff/entity.mass;
                                }

                                if (k === 0) {
                                    let closestSocketDist = 25;
                                    let closestEntitySocket = null;
                                    let closestEntity2Socket = null;
                                    if (!entity.hasConnectionToEntity(entity2)) {
                                        for (let l = 0; l < entity.sockets.children.length; l++) {
                                            let entitySocket = entity.sockets.children[l];
                                            if (!Object.keys(entitySocket.connections).length) {
                                                for (let p = 0; p < entity2.sockets.children.length; p++) {
                                                    let entity2Socket = entity2.sockets.children[p];
                                                    if (!Object.keys(entity2Socket.connections).length) {
                                                        let socket1Pos = app.cstage.toLocal(entitySocket.position, entity, undefined, true);
                                                        let socket2Pos = app.cstage.toLocal(entity2Socket.position, entity2, undefined, true);
                                                        let socketDist = Math.distanceBetween(socket1Pos, socket2Pos);
                                                        if (socketDist <= closestSocketDist) {
                                                            closestEntitySocket = entitySocket;
                                                            closestEntity2Socket = entity2Socket;
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }

                                    if (closestEntitySocket && closestEntity2Socket) {
                                        closestEntitySocket.setConnection(entity2.id, closestEntity2Socket);
                                    }
                                }
                            }

                            if (entity.hasConnectionToEntity(entity2) && dist > entity.sprite.width/2+entity2.sprite.width/2+5) {
                                if (dist > entity.sprite.width/2+entity2.sprite.width/2+30) {
                                    entity.removeConnectionsToEntity(entity2);
                                    continue;
                                }
                                let pPos = app.cstage.toLocal(entity.currentTrack.bezier.get(entity.currentTrackT + (0.05 * entity.trackDirection)), entity.currentTrack, undefined, true);
                                let pNeg = app.cstage.toLocal(entity.currentTrack.bezier.get(entity.currentTrackT - (0.05 * entity.trackDirection)), entity.currentTrack, undefined, true);

                                let distDiff = dist-(entity.sprite.width/2+entity2.sprite.width/2+10);
                                let distDiffScaled = (distDiff / entity.currentTrack.bezier.length()) * entity.trackDirection;
                                if (Math.distanceBetween(entity2, pPos) >= Math.distanceBetween(entity2, pNeg)) {
                                    entity.trackVelocity -= distDiff/entity.mass;
                                    entity.moveAlongBezier(-distDiffScaled/2);
                                } else {
                                    entity.trackVelocity += distDiff/entity.mass;
                                    entity.moveAlongBezier(distDiffScaled/2);
                                }
                            }
                        }
                    }
                }
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
                    let midPoint = null;
                    if (selectedEntity.bezier) {
                        midPoint = app.cstage.toLocal({x: selectedEntity.bezier.mid.x, y: selectedEntity.bezier.mid.y}, selectedEntity, undefined, true);
                    } else if (selectedEntity.type === 'shape' && (selectedEntity.subtype === 'rectangle' || selectedEntity.subtype === 'line')) {
                        midPoint = app.cstage.toLocal({x: selectedEntity.sprite.width/2, y: selectedEntity.subtype !== 'line' ? selectedEntity.sprite.height/2 : 0}, selectedEntity, undefined, true);
                    }
                    cX += parseFloat(midPoint?.x ?? selectedEntity.x);
                    cY += parseFloat(midPoint?.y ?? selectedEntity.y);
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
            rotationAngle = Math.angleBetween(selectionRotation, { x: gmx, y: gmy }) - selectionRotation.angle; // Get the angle of the mouse from the center and subtract the angle of the selection from it.
            if (game.settings.enableSnapRotation) {
                let snapRotationDegrees = Math.deg2rad(game.settings.snapRotationDegrees ?? 15);
                rotationAngle = Math.round(rotationAngle / snapRotationDegrees) * snapRotationDegrees; // Snap the angle of the selection.
                if (typeof selectionRotation.offset === 'number') {
                    rotationAngle += (Math.round(selectionRotation.offset / snapRotationDegrees) * snapRotationDegrees) - selectionRotation.offset; // Subtract the difference to snap entities with the same rotation to grid.
                }
            }
            rotationAngle = Math.angleNormalized(rotationAngle);
        }

        if (pickupSelectedEntities) {
            game.buildingSelectedMenuComponent?.refresh(true);
            if (!selectedHandlePoint && (!ignoreMousePickup || (Date.now()-pickupTime > 250 || Math.distanceBetween(pickupPosition, {x: gmx, y: gmy}) > 20))) {
                if (ignoreMousePickup) {
                    if (followEntity) {
                        game.followEntity(null);
                    }
                    for (let i = 0; i < selectedEntities.length; i++) {
                        // Destroying any connections with entities that aren't selected, it might be worth checking if the mouse / selection position has changed before doing so or checking for rotation.
                        let pickupEntity = selectedEntities[i];
                        if (pickupEntity.building) {
                            pickupEntity.removeConnections(undefined, true);
                        }
                    }
                }
                ignoreMousePickup = false;
                let snappedMX = gmx, snappedMY = gmy;
                if (game.settings.enableGrid || keys[16]) {
                    let gridSize = game.settings.gridSize ? game.settings.gridSize : 16;
                    let mXDiff = pickupPosition.x - snappedMX;
                    let mYDiff = pickupPosition.y - snappedMY;
                    snappedMX = pickupPosition.x - (Math.round(mXDiff / gridSize) * gridSize);
                    snappedMY = pickupPosition.y - (Math.round(mYDiff / gridSize) * gridSize);
                }

                let pickupEntity = game.getSelectedEntity();
                if (pickupEntity?.isTrain) {
                    pickupEntity.currentTrack = null;
                    pickupEntity.currentTrackT = null;
                    pickupEntity.trackVelocity = 0;
                }

                let connectionEstablished = false;
                if (!selectionRotation && pickupEntity && (pickupEntity.building?.canSnap || pickupEntity.isTrain)) {
                    for (let i = 0; i < entities.length; i++) {
                        let entity = entities[i];
                        if (!entity.visible || entity === pickupEntity || entity.type !== 'building' || !((pickupEntity.sockets && entity.sockets) || pickupEntity.isTrain) || Math.distanceBetween({x: gmx, y: gmy}, entity) > 1000) {
                            continue;
                        }
                        // TODO: When a connection is established while snapping nearest, to connect further sockets, need to base connections on entity position instead of mouse, also, reduce the socket distance to something like 1. Really small.
                        if (pickupEntity.subtype === entity.subtype || (pickupEntity.sockets && entity.sockets) || pickupEntity.isTrain) {
                            const mousePos = entity.toLocal({x: gmx, y: gmy}, app.cstage, undefined, true);
                            const projection = entity.bezier?.project(mousePos);
                            if (!projection || projection.d <= (entity.building?.lineWidth ?? 25)) {
                                if (pickupEntity.sockets && entity.sockets && pickupEntity.building?.canSnap && (pickupEntity.building?.canSnapStructureType !== false || pickupEntity.subtype !== entity.subtype)) {
                                    let frontSocket = null, nearestSocket = null, nearestSocketDist = null;
                                    const connectEntitiesBySockets = function(fromSocket, toSocket) {
                                        fromSocket.setConnection(entity.id, toSocket);
                                        if (!connectionEstablished) {
                                            if (pickupEntity.building?.snapNearest) {
                                                pickupEntity.removeConnections(fromSocket.socketData.id, undefined, true);
                                            }

                                            if (isNaN(pickupEntity.prevRotation)) {
                                                pickupEntity.prevRotation = pickupEntity.rotation;
                                            }
    
                                            let pickupEntityPosition = app.cstage.toLocal({x: toSocket.x, y: toSocket.y}, entity, undefined, true);
                                            const pickupEntityRotation = Math.angleNormalized(-Math.angleDifference(entity.rotation + toSocket.rotation + Math.PI, fromSocket.rotation));
                                            if (fromSocket.x !== 0 || fromSocket.y !== 0) {
                                                const fromSocketDist = Math.distanceBetween({ x: 0, y: 0 }, fromSocket);
                                                const socketAngleDiff = Math.angleBetween({ x: 0, y: 0 }, fromSocket) + Math.PI;
                                                pickupEntityPosition = Math.extendPoint(pickupEntityPosition, fromSocketDist, pickupEntityRotation + socketAngleDiff);
                                            }

                                            pickupEntity.position.set(pickupEntityPosition.x, pickupEntityPosition.y);
                                            pickupEntity.rotation = pickupEntityRotation;

                                            connectionEstablished = true;
                                            return true;
                                        }
                                    }
                                    for (let j = 0; j < entity.sockets.children.length; j++) {
                                        let entitySocket = entity.sockets.children[j];
                                        if (!entitySocket.socketData.temp) {
                                            let socketDistance = Math.distanceBetween(mousePos, entitySocket);
                                            // Checks socket distance is close, closer than previous socket distance, or hovering a building with a power socket.
                                            if (pickupEntity.building?.snapNearest || ((socketDistance < 35 && (nearestSocketDist === null || socketDistance < nearestSocketDist)) || pickupEntity.subtype === 'power_line' && entity.canGrab())) {
                                                for (let k = 0; k < pickupEntity.sockets.children.length; k++) {
                                                    let pickupSocket = pickupEntity.sockets.children[k];
                                                    if (typeof entitySocket.socketData.type === 'string' && entitySocket.socketData.type === pickupSocket.socketData.type) {
                                                        if (Object.keys(entitySocket.connections).length === 0 || Object.keys(entitySocket.connections).length < entitySocket.socketData.connectionLimit || entitySocket.connections[pickupEntity.id] === pickupSocket.socketData.id) {
                                                            if (entitySocket.socketData.flow && entitySocket.socketData.flow === pickupSocket.socketData.flow) {
                                                                continue;
                                                            }
    
                                                            if (pickupEntity.building?.snapNearest) {
                                                                let pickupSocketPos;
                                                                if (connectionEstablished) {
                                                                    pickupSocketPos = app.cstage.toLocal({x: pickupSocket.x, y: pickupSocket.y}, pickupEntity, undefined, true);
                                                                } else {
                                                                    pickupSocketPos = Math.rotateAround({x: 0, y: 0}, pickupSocket, (pickupEntity.prevRotation ?? pickupEntity.rotation));
                                                                    pickupSocketPos.x += gmx - pickupEntity.pickupOffset.x;
                                                                    pickupSocketPos.y += gmy - pickupEntity.pickupOffset.y;
                                                                }
                                                                let entitySocketPos = app.cstage.toLocal({x: entitySocket.x, y: entitySocket.y}, entity, undefined, true);
                                                                if (Math.floor(Math.distanceBetween(pickupSocketPos, entitySocketPos)) >= (!connectionEstablished ? 35 : 2)) {
                                                                    continue;
                                                                }
                                                                let pickupSocketRot = Math.angleNormalized((pickupEntity.rotation + pickupSocket.rotation) - Math.PI);
                                                                let entitySocketRot = Math.angleNormalized(entity.rotation + entitySocket.rotation);
                                                                if (!Math.anglesWithinRange(entitySocketRot, pickupSocketRot, Math.PI / 8)) {
                                                                    continue;
                                                                }

                                                                if (connectEntitiesBySockets(pickupSocket, entitySocket)) {
                                                                    i = -1;
                                                                }
                                                                break;
                                                            }

                                                            frontSocket = pickupSocket;
                                                            nearestSocket = entitySocket;
                                                            nearestSocketDist = socketDistance;
                                                            
                                                            break;
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    if (nearestSocket) {
                                        connectEntitiesBySockets(frontSocket, nearestSocket);
                                        break;
                                    }
                                }

                                if (projection && ((!connectionEstablished && entity.bezier && entity.building?.isBezier && entity.building?.canSnapAlongBezier && pickupEntity.subtype === entity.subtype) || (pickupEntity.isTrain && entity.subtype === pickupEntity.building.vehicle.track))) {
                                    let global = app.cstage.toLocal({x: projection.x, y: projection.y}, entity, undefined, true);
                                    let normal = entity.bezier.normal(projection.t);
                                    let angle = Math.angleBetween({x: 0, y: 0}, normal);
                                    pickupEntity.x = global.x;
                                    pickupEntity.y = global.y;

                                    let angleRight = entity.rotation + (angle - Math.PI/2) - Math.PI/2;
                                    let angleLeft = entity.rotation + (angle + Math.PI/2) - Math.PI/2;
                                    let rightDiff = Math.angleNormalized(angleRight - pickupEntity.rotation);
                                    let leftDiff = Math.angleNormalized(angleLeft - pickupEntity.rotation);

                                    if (isNaN(pickupEntity.prevRotation)) {
                                        pickupEntity.prevRotation = pickupEntity.rotation;
                                    }

                                    if (pickupEntity.isTrain) {
                                        pickupEntity.currentTrack = entity;
                                        pickupEntity.currentTrackT = projection.t;
                                    }

                                    if (rightDiff < leftDiff) {
                                        pickupEntity.rotation = angleRight + Math.PI/2;
                                    } else {
                                        pickupEntity.rotation = angleLeft + Math.PI/2;
                                    }

                                    if (!connectionEstablished && pickupEntity.sockets && (pickupEntity.subtype === 'rail_large_gauge' || pickupEntity.subtype === 'rail_small_gauge')) {
                                        for (let k = 0; k < pickupEntity.sockets.children.length; k++) {
                                            let pickupSocket = pickupEntity.sockets.children[k];
                                            if (pickupSocket.socketData.cap === 'front') {
                                                // TODO: Store this somewhere so we don't have to loop each time for sockets. There will only ever be one front and back socket for rails.
                                                pickupSocket.createConnection(entity, projection.x, projection.y, angle);
                                                break;
                                            }
                                        }
                                    } else {
                                        pickupEntity.removeConnections();
                                    }

                                    connectionEstablished = true;
                                    break;
                                }
                            }
                        }
                    }
                    if (!connectionEstablished) {
                        pickupEntity.removeConnections();
                    }
                    if (!connectionEstablished && !isNaN(pickupEntity.prevRotation)) {
                        pickupEntity.rotation = pickupEntity.prevRotation;
                        delete pickupEntity.prevRotation;
                        if (!pickupEntity.building?.snapNearest) {
                            pickupEntity.pickupOffset = {
                                x: 0,
                                y: 0
                            };
                        }
                    }
                }
                if (!connectionEstablished) {
                    for (let i = 0; i < selectedEntities.length; i++) {
                        let pickupEntity = selectedEntities[i];
                        if (pickupEntity.building && !pickupEntity.hasHandle && pickupEntity.selectionArea.visible) {
                            pickupEntity.selectionArea.visible = false;
                        }
                        if (selectionRotation) {
                            let rotatedPosition = Math.rotateAround(selectionRotation, pickupEntity.rotationData, rotationAngle);
                            pickupEntity.x = rotatedPosition.x;
                            pickupEntity.y = rotatedPosition.y;
                            pickupEntity.pickupOffset = {
                                x: snappedMX - pickupEntity.x,
                                y: snappedMY - pickupEntity.y
                            };
                            pickupEntity.rotation = Math.angleNormalized(pickupEntity.rotationData.rotation + rotationAngle);
                            if (!isNaN(pickupEntity.prevRotation)) {
                                pickupEntity.prevRotation = pickupEntity.rotation;
                            }
                        } else {
                            pickupEntity.x = snappedMX - pickupEntity.pickupOffset.x;
                            pickupEntity.y = snappedMY - pickupEntity.pickupOffset.y;
                            if (selectedEntities.length === 1 && !pickupEntity.building?.ignoreSnapSettings && (game.settings.enableGrid || keys[16])) {
                                let gridSize = game.settings.gridSize ? game.settings.gridSize : 16;
                                pickupEntity.x = (Math.round(pickupEntity.x / gridSize) * gridSize);
                                pickupEntity.y = (Math.round(pickupEntity.y / gridSize) * gridSize);
                            }
                        }
                    }
                }
            }
        } else if (followEntity) {
            if (followEntity.selectionArea.visible) {
                followEntity.selectionArea.visible = false;
            }
            camera.x = (followEntity.x * camera.zoom) - WIDTH/2;
            camera.y = (followEntity.y * camera.zoom) - HEIGHT/2;
        }

        for (let i = 0; i < entities.length; i++) {
            const entity = entities[i];
            if (entity.visible) {
                if (entity.sprite?.outline && entity.sprite.outline.visible !== entity.selected) {
                    entity.sprite.outline.visible = entity.selected;
                }
                if (entity.selected) {
                    if (entity.productionIcons) {
                        entity.productionIcons.rotation = -entity.rotation;
                    }
                    if (entity.sockets) {
                        for (let i = 0; i < entity.sockets.children.length; i++) {
                            let socket = entity.sockets.children[i];
                            if (socket.pointer?.visible && socket.socketData.type === 'power') {
                                socket.pointer.rotation = -(entity.rotation + socket.rotation);
                            }
                        }
                    }
                }
            }
        }

        if (constructionCursor) {
            constructionCursor.width = 32 / camera.zoom;
            constructionCursor.height = 32 / camera.zoom;
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
    Math.normalizeAngleRadians = function(radians) {
        return radians - Math.PI2 * Math.floor(radians / Math.PI2);
    };
    Math.differenceBetweenAngles = function(current, target) {
        let mod = function ( a, n ) { return ( a % n + n ) % n; }

        let a = mod( ( current - target ), Math.PI2 );
        let b = mod( ( target - current ), Math.PI2 );

        return a < b ? -a : b;
    };
    Math.angleNormalized = function(angle) {
        return Math.atan2(Math.sin(angle), Math.cos(angle));
    };
    Math.angleDifference = function(angle1, angle2) {
        return (angle2 - angle1) % Math.PI2;
    };
    Math.anglesWithinRange = function(angle1, angle2, diff) {
        const angleDiff = Math.angleNormalized(Math.angleDifference(angle1, angle2));
        return angleDiff <= diff && angleDiff >= -diff;
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
    Math.rotateAround = function({x: cx, y: cy}, {x, y}, angle) {
        const cos = Math.cos(angle), sin = Math.sin(angle);
        return {
            x: cx + (x - cx) * cos - (y - cy) * sin,
            y: cy + (x - cx) * sin + (y - cy) * cos
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