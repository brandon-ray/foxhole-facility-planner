const COLOR_WHITE = 0xFFFFFF; // Also resets tint.
const COLOR_DARKGREY = 0x505050;
const COLOR_CHARCOAL = 0x0B0B0B;
const COLOR_BLACK = 0x000000;
const COLOR_ORANGE = 0xFF8F00;
const COLOR_RED = 0xFF0000;
const COLOR_GREEN = 0x00FF00;
const COLOR_BLUE = 0x0000FF;
const COLOR_LIGHTBLUE = 0x00E1FF;
const COLOR_YELLOW = 0xFFFF00;
const COLOR_PURPLE = 0x9900FF;

const COLOR_SELECTION = 0xE16931; // Orange
const COLOR_SELECTION_BORDER = 0xFF8248; // Lighter Orange

const COLOR_RANGES = {
    default: 0x72FF5A, // Green
    killbox: COLOR_ORANGE,
    killboxMG: COLOR_BLUE,
    killboxAT: COLOR_RED,
    killboxArty: COLOR_YELLOW,
    radio: COLOR_PURPLE,
    crane: COLOR_LIGHTBLUE
};
const COLOR_RANGE_BORDER = 0xED2323; // Red

const DEFAULT_TEXT_STYLE = {
    fontFamily: 'Jost',
    dropShadow: true,
    dropShadowAlpha: 0.25,
    dropShadowBlur: 6,
    dropShadowDistance: 0,
    padding: 12
};

const DEFAULT_SHAPE_STYLE = {
    alpha: 1,
    fill: true,
    fillColor: COLOR_WHITE,
    border: false,
    lineWidth: 8,
    lineColor: COLOR_WHITE
};

const METER_PIXEL_SIZE = 32;
const METER_UNREAL_UNITS = 100, METER_PIXEL_UNIT = 50; // 100 Unreal Units = 50 Pixels // Both equivalent to one meter.
const METER_TEXTURE_SCALE = METER_UNREAL_UNITS / METER_PIXEL_UNIT;
const METER_PIXEL_SCALE = METER_PIXEL_UNIT / METER_PIXEL_SIZE;
const SELECTION_BORDER_WIDTH = 6, TRACK_SEGMENT_LENGTH = 16;

const game = {
    services: {},
    settings: {
        quality: 'auto',
        disableSound: false,
        disableHUD: false,
        enableDarkMode: false,
        enableDebug: false,
        enableExperimental: false,
        enableHistory: true,
        historySize: 25,
        enableAutoLoading: true,
        enableGrid: true,
        enableStats: true,
        gridSize: 16,
        enableSnapRotation: true,
        snapRotationDegrees: 15,
        zoomSpeed: 3,
        selectedFaction: null,
        selectedTier: 3,
        showSelectedTierOnly: true,
        disableLockedMouseEvents: false,
        bringSelectedToFront: true,
        displayFactionTheme: true,
        defaultBuildingCategory: 'all',
        showParentProductionList: true,
        showCollapsibleBuildingList: true,
        showUpgradesAsBuildings: false,
        showFacilityName: true,
        styles: {
            label: {
                fontSize: 64,
                fontStyle: 'normal',
                fontWeight: 'normal',
                fill: '#ffffff',
                align: 'center'
            },
            rectangle: DEFAULT_SHAPE_STYLE,
            circle: Object.assign({}, DEFAULT_SHAPE_STYLE),
            line: Object.assign({}, DEFAULT_SHAPE_STYLE, {
                lineWidth: 14,
                frontArrow: true,
                backArrow: true
            })
        },
        volume: 0.2
    },
    isPlayScreen: false
};

game.defaultSettings = JSON.parse(JSON.stringify(game.settings));
game.playMode = false;

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
    let entityMap = {};
    let selectedEntities = [];
    let selectedHandlePoint = null;
    let followEntity = null;
    let pickupSelectedEntities = false;
    let pickupTime = null;
    let pickupPosition = null;
    let ignoreMousePickup = true;
    let effects = [];

    game.projectName = 'Unnamed Project';

    game.projectSettings = {
        showProductionIcons: true,
        showRangeWhenSelected: true,
        ranges: {
            crane: false,
            radio: false,
            resourceField: false,
            preventDecay: false,
            killbox: false,
            killboxMG: false,
            killboxAT: false,
            killboxArty: false
        }
    };

    game.selectedBuildingCategory = game.settings.defaultBuildingCategory;

    game.constructionModes = [
        {
            key: 'label',
            title: 'Text Tool',
            cursor: 'text',
            icon: 'fa-font',
            eType: 'text'
        },
        {
            key: 'rectangle',
            title: 'Rectangle Tool',
            cursor: 'crosshair',
            icon: 'fa-square-o',
            eType: 'shape',
            eSubType: 'rectangle'
        },
        {
            key: 'circle',
            title: 'Circle Tool',
            cursor: 'crosshair',
            icon: 'fa-circle-thin',
            eType: 'shape',
            eSubType: 'circle'
        },
        {
            key: 'line',
            title: 'Line Tool',
            cursor: 'crosshair',
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

    game.constructionLayers = {
        foundation: 1000,
        road: 10000,
        rail: 15000,
        resource: 17500,
        pipe: 20000,
        unspecified: 50000,
        upgrade: 75000,
        vehicle: 120000,
        container: 150000,
        wall: 200000,
        overhead: 500000,
        power_pole: 750000,
        power_line: 100000,
        player: 1500000,
        crane: 2000000,
        range: 3000000,
        shape: 4000000,
        text: 4500000,
        selected: 5000000
    };

    game.getEntities = () => {
        return entities;
    };

    game.getSelectedEntities = () => {
        return selectedEntities;
    };

    game.getEntityById = (id) => {
        const entityId = typeof id !== 'number' ? Number(id) : id;

        const mappedEntity = entityMap[id];
        if (mappedEntity) {
            return mappedEntity;
        }

        for (let i = 0; i < entities.length; i++) {
            const entity = entities[i];
            if (entity.id === entityId) {
                return entity;
            }
        }

        console.error(`Failed to find entity with id: ${id}`);
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

    game.setPlaying = function(playing) {
        if (game.playMode !== playing) {
            game.playMode = playing;
            game.appComponent.$forceUpdate();
        }
    }

    game.setDarkMode = function(darkMode) {
        if (game.settings.enableDarkMode !== darkMode) {
            game.settings.enableDarkMode = darkMode;
            background.texture = resources[game.settings.enableDarkMode ? 'background_dark' : 'background'].texture;
            game.updateSettings();
        }
    }

    game.setConstructionMode = function(mode) {
        mode = mode ?? game.constructionModes[game.constructionModes.length - 1];
        if (game.constructionMode !== mode) {
            game.constructionMode = mode;
            app.view.style.cursor = mode.cursor ? `url(/assets/${mode.cursor}.webp) 16 16, auto` : 'unset';
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
        white: 'white.png',
        background: 'grid_32.webp',
        background_dark: 'grid_32_dark.webp',
        point: 'point.webp',
        pointer: 'pointer.webp',
        bipointer: 'bipointer.webp',
        power: 'power.webp',
        power_x128: 'power_x128.webp',
        smoke_particles: 'smoke_particles.png'
    };

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

    game.updateEntityUnions = function() {
        const unionEntities = [];
        for (const unionEntity of entities) {
            if (unionEntity?.building?.canUnion) {
                unionEntity.removeUnion();
                unionEntities.push(unionEntity);
            }
        }
        for (const unionEntity of unionEntities) {
            for (const entitySocket of unionEntity.sockets) {
                for (const entityId of Object.keys(entitySocket.connections)) {
                    const connectedEntity = game.getEntityById(entityId);
                    if (connectedEntity?.building?.canUnion) {
                        unionEntity.setUnion(connectedEntity);
                    }
                }
            }
        }
    };

    game.updateEntityOverlays = function() {
        for (const entity of entities) {
            entity.updateOverlays();
        }
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

    app.view.tabIndex = 0;

    let keys = {};
    document.addEventListener('keydown', function (event) {
        event = event || window.event;
        let key = event.keyCode;
        switch (key) {
            case 27: // Escape
                game.resetConstructionMode();
                if (!selectionArea?.visible) {
                    game.deselectEntities();
                }
                break;
            case 113: // F2
                ENABLE_DEBUG = !ENABLE_DEBUG;
                if (debugText) {
                    debugText.visible = ENABLE_DEBUG;
                }
                break;
            case 119: // F8
                if (ENABLE_DEBUG) {
                    setTimeout(() => {
                        let x = 0;
                        let y = 0;
                        const buildings = Object.values(window.objectData.buildings);
                        for (let i=0; i<1000; i++) {
                            let buildingData = buildings[Math.floor(Math.random() * buildings.length)];
                            if ((game.settings.enableExperimental || !window.objectData.categories[buildingData.category].experimental) && (game.settings.enableDebug || (!buildingData.hideInList && (!buildingData.parent || !buildingData.parent.hideInList)))) {
                                createSelectableEntity('building', buildingData.key, x, y, 0);
                                x += 500;
                                if (x >= 10000) {
                                    x = 0;
                                    y += 500;
                                }
                            }
                        }
                    }, 1);
                }
                break;
            case 120: // F9
                if (ENABLE_DEBUG) {
                    setTimeout(() => {
                        let x = 0, y = 0;
                        for (const [key, category] of Object.entries(window.objectData.categories)) {
                            if (game.settings.enableExperimental || !category.experimental) {
                                for (let i = 0; i < category.buildings.length; i++) {
                                    const building = category.buildings[i];
                                    if (!building.preset && (game.settings.enableDebug || (!building.hideInList && (!building.parent || !building.parent.hideInList)))) {
                                        createSelectableEntity('building', building.key, x * 600, y * 600, 0);
                                        x++;
                                        if (x >= 10) {
                                            x = 0;
                                            y++;
                                        }
                                    }
                                }
                            }
                        }
                    }, 1);
                }
                break;
        }
        if (!(document.activeElement && (document.activeElement.type === 'text' || document.activeElement.type === 'number' || document.activeElement.type === 'textarea'))) {
            if (event.ctrlKey) {
                switch (key) {
                    case 37: // Left Arrow
                        game.moveSelected(-1, 0, true);
                        break;
                    case 38: // Up Arrow
                        game.moveSelected(0, -1, true);
                        break;
                    case 39: // Right Arrow
                        game.moveSelected(1, 0, true);
                        break;
                    case 40: // Down Arrow
                        game.moveSelected(0, 1, true);
                        break;
                    case 65: // A
                        entities.forEach(entity => {
                            game.addSelectedEntity(entity, false);
                        });
                        game.updateSelectedBuildingMenu();
                        break;
                    case 67: // C
                        game.cloneSelected();
                        break;
                    case 89: // Y
                        game.redo();
                        break;
                    case 90: // Z
                        if (event.shiftKey) {
                            game.redo();
                        } else {
                            game.undo();
                        }
                        break;
                }
            } else {
                switch (key) {
                    case 32: // Space
                        game.setPlaying(!game.playMode);
                        break;
                    case 37: // Left Arrow
                        game.moveSelected(-1, 0);
                        break;
                    case 38: // Up Arrow
                        game.moveSelected(0, -1);
                        break;
                    case 39: // Right Arrow
                        game.moveSelected(1, 0);
                        break;
                    case 40: // Down Arrow
                        game.moveSelected(0, 1);
                        break;
                    case 46: // Delete
                        game.deselectEntities(true);
                        break;
                    case 65: // A
                        game.moveSelected(event.shiftKey ? -16 : -32, 0);
                        break;
                    case 68: // D
                        game.moveSelected(event.shiftKey ? 16 : 32, 0);
                        break;
                    case 69: // E
                        game.rotateSelected(Math.PI / (event.shiftKey ? 2 : 4));
                        break;
                    case 76: // L
                        game.lockSelected();
                        break;
                    case 80: // P
                        game.projectSettings.showProductionIcons = !game.projectSettings.showProductionIcons;
                        game.updateEntityOverlays();
                        break;
                    case 81: // Q
                        game.rotateSelected(-Math.PI / (event.shiftKey ? 2 : 4));
                        break;
                    case 83: // S
                        game.moveSelected(0, event.shiftKey ? 16 : 32);
                        break;
                    case 87: // W
                        game.moveSelected(0, event.shiftKey ? -16 : -32);
                        break;
                }
            }
        }
        if (!keys[key]) {
            keys[key] = true;
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
        PIXI.Loader.shared.add('Jost', 'assets/fonts/jost-webfont.ttf');

        for (let key in asset_list) {
            PIXI.Loader.shared.add(key, 'assets/' + asset_list[key]);
        }

        for (let key in game_asset_list) {
            PIXI.Loader.shared.add(key, game_asset_list[key]);
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

        background = new PIXI.TilingSprite(resources[game.settings.enableDarkMode ? 'background_dark' : 'background'].texture);
        app.stage.addChild(background);

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

        app.cstage.updateLayersOrder = function () {
            app.cstage.children.sort(function (a, b) {
                return b.getZIndex() - a.getZIndex();
            });
        };

        debugText = new PIXI.Text();
        debugText.visible = ENABLE_DEBUG;
        debugText.style.fill = COLOR_WHITE;
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
        
        if (game.settings.enableDebug) {
            fetch(`/games/foxhole/assets/presets/debug.json`).then(response => {
                return response.json();
            }).then(saveObject => {
                try {
                    game.loadSave(saveObject, undefined, undefined, true);
                } catch (e) {
                    console.error('Failed to load debug save:', e);
                }
            }).catch(e => {
                console.info('Failed to load debug preset. This will typically occur if one doesn\'t exist.');
            });
        } else if (game.settings.enableHistory && game.settings.enableAutoLoading) {
            try {
                if (window.localStorage) {
                    const newSaveString = window.localStorage.getItem('save');
                    if (newSaveString) {
                        try {
                            game.loadSave(JSON.parse(newSaveString), undefined, undefined, true);
                        } catch (e) {
                            console.error('Failed to load save:', e);
                        }
                    }
                }
            } catch(e) {
                console.error('Failed to parse save.');
            }
        } else {
            game.updateHistory();
        }
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
            name: (game.projectName !== 'Unnamed Project' && game.projectName) || undefined,
            faction: game.settings.selectedFaction || undefined,
            projectSettings: game.projectSettings,
            entities: []
        };
        let saveEntities = isSelection ? selectedEntities : entities;
        for (let i = 0; i < saveEntities.length; i++) {
            let entity = saveEntities[i];
            if (entity.valid) {
                let entityData = {
                    id: entity.id,
                    x: parseFloat(entity.x),
                    y: parseFloat(entity.y),
                    z: parseFloat(entity.z) || undefined,
                    rotation: entity.rotation || undefined,
                    locked: entity.locked || undefined,
                    type: entity.type,
                    subtype: entity.subtype
                };
                entity.onSave(entityData, isSelection);
                saveObject.entities.push(entityData);
            }
        }
        saveObject.entities.sort((a, b) => a.id - b.id);
        return saveObject;
    }

    game.downloadSave = function(isSelection) {
        let fileName = game.projectName.toLowerCase().trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '_')
            .replace(/^-+|-+$/g, '');
        if (isSelection) {
            fileName += '_selection';
        }
        download(JSON.stringify(game.getSaveData(isSelection)), fileName, 'application/json');
    };

    game.loadSave = function(saveObject, isSelection, ignoreConfirmation, isAutoLoad) {
        if (isSelection) {
            game.deselectEntities(false, true);
        } else {
            if (!ignoreConfirmation && entities.length > 0) {
                game.confirmDeletion(confirmed => {
                    if (confirmed) {
                        game.loadSave(saveObject, isSelection);
                    }
                }, true);
                return;
            } else {
                game.removeEntities(true);
            }
            game.projectName = saveObject.name || 'Unnamed Project';
            game.setFaction(saveObject.faction, true);
            if (saveObject.projectSettings) {
                Object.assign(game.projectSettings, saveObject.projectSettings);
            }
        }
        setTimeout(() => {
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
                    }
                }
            }

            for (let i = 0; i < saveObject.entities.length; i++) {
                let entityData = saveObject.entities[i];
                entityData.createdEntity?.afterLoad(entityData, entityIdMap);
            }

            if (!isSelection) {
                const saveString = JSON.stringify(game.getSaveData());
                if (!isAutoLoad) {
                    game.updateSave(saveString);
                } else {
                    game.updateHistory(saveString);
                }
            }

            if (isSelection) {
                let centerPos = game.getEntitiesCenter(selectedEntities, isSelection);
                if (game.settings.enableGrid) {
                    let gridSize = game.settings.gridSize ? game.settings.gridSize : 16;
                    centerPos.x = Math.round(centerPos.x / gridSize) * gridSize;
                    centerPos.y = Math.round(centerPos.y / gridSize) * gridSize;
                }
                game.setPickupEntities(true, false, centerPos, true);
                game.updateSelectedBuildingMenu();
                game.statisticsMenuComponent?.refresh();
            } else if (!ignoreConfirmation) {
                game.zoomToEntitiesCenter();
            }
        }, 1);
    };

    game.getEntitiesCenter = function(ents, isSelection) {
        const count = ents?.length ?? 1;
        if (Array.isArray(ents)) {
            let sumX = 0, sumY = 0;
            for (const entity of ents) {
                let midPoint = entity.mid;
                if (entity.bezier && (isSelection && selectedEntities.length === 1)) {
                    midPoint = {
                        x: entity.x,
                        y: entity.y
                    }
                }
                sumX += midPoint.x;
                sumY += midPoint.y;
            }
            return {
                x: sumX / count,
                y: sumY / count
            };
        }
        return ents.mid;
    };

    game.zoomToEntitiesCenter = function() {
        if (followEntity) {
            game.followEntity(null);
        }
        if (entities?.length) {
            const centerPos = game.getEntitiesCenter(entities);
            camera.x = centerPos.x - WIDTH/2;
            camera.y = centerPos.y - HEIGHT/2;
        } else {
            camera.x = (GRID_WIDTH/2) - WIDTH/2;
            camera.y = (GRID_HEIGHT/2) - HEIGHT/2;
        }
        game.resetZoom();
    }
    game.zoomToEntitiesCenter();

    game.setFaction = function(faction = null, isLoading) {
        game.settings.selectedFaction = faction;
        game.updateSettings();
        if (!isLoading) {
            game.updateSave();
        }
    }

    game.selectEntity = function(entity) {
        game.appComponent.bmc();
        if (selectedEntities.length > 1 || selectedEntities[0] !== entity) {
            game.deselectEntities(false, true);
        }
        return game.addSelectedEntity(entity);
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
                game.statisticsMenuComponent?.refresh();
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
                game.statisticsMenuComponent?.refresh();
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
            if (remove) {
                game.saveStateChanged = true;
            }
            selectedEntities = [];
            if (!noMenuUpdate) {
                game.updateSelectedBuildingMenu();
                game.statisticsMenuComponent?.refresh();
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
                    name: 'Properties',
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
            camera.zoom *= (1 - e.deltaY * (game.settings.zoomSpeed * 0.000225));
            camera.zoom = Math.max(0.01, Math.min(1.6, camera.zoom));

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
                } else if (game.constructionMode.key !== 'select') {
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
                } else {
                    entities.sort(function (a, b) {
                        return a.getZIndex() - b.getZIndex()
                    });
                    for (let i=0; i<entities.length; i++) {
                        let entity = entities[i];
                        if (entity.valid && entity.visible && entity.selectable) {
                            if (entity.selected && entity.hasHandle && entity.grabHandlePoint()) {
                                return;
                            }
                            if (entity.canGrab()) {
                                if (keys[46]) {
                                    entity.remove();
                                } else {
                                    if (!entity.selected) {
                                        if (e.ctrlKey || e.shiftKey) {
                                            game.addSelectedEntity(entity);
                                        } else {
                                            game.selectEntity(entity);
                                        }
                                    } else if (e.ctrlKey || e.shiftKey) {
                                        game.removeSelectedEntity(entity);
                                    }
                                    /* Not sure how I feel about this yet. Might be worth keeping, unsure.
                                    if (entity.selected && followNext) {
                                        game.followEntity(entity);
                                    }
                                    */
                                    game.setPickupEntities(true);
                                }
                                return;
                            }
                        }
                    }
                    if (!(e.ctrlKey || e.shiftKey)) {
                        game.deselectEntities();
                    }
                    if (selectionArea) {
                        selectionArea.origin = { x: gmx, y: gmy };
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
                if (entity.canGrab(true)) {
                    if (entity.mid.x > selectionArea.x && entity.mid.x < selectionArea.x + selectionArea.width) {
                        if (entity.mid.y > selectionArea.y && entity.mid.y < selectionArea.y + selectionArea.height) {
                            if (game.addSelectedEntity(entity, true)) {
                                selectedChange = true;
                            }
                            return;
                        }
                    }
                }
                if (!e.ctrlKey && game.removeSelectedEntity(entity, true)) {
                    selectedChange = true;
                }
            });
            if (selectedChange) {
                game.updateSelectedBuildingMenu();
                game.statisticsMenuComponent?.refresh();
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
                game.resetConstructionMode();
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

        entityMap[entity.id] = entity;

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

    function createSelectableEntity(type, subtype, x, y, z, rotation, id, netData) {
        let entity = createEntity(type, subtype, x, y, z, id, netData);
        
        entity.mid = {
            x: entity.x,
            y: entity.y
        };

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

        entity.sortLayer = building ? (building?.sortLayer ?? 'unspecified') : entity.type;
        entity.sortOffset = game.constructionLayers[entity.sortLayer];

        entity.selected = false;
        entity.selectable = true;
        entity.hasHandle = (type === 'shape' || entity.building?.hasHandle) ?? false;

        entity.selectionArea = new PIXI.Graphics();
        entity.selectionArea.visible = false;

        // TODO: Clean up / combine these two functions.
        entity.setSelectionColor = function(color) {
            const width = building?.width ? building.width * METER_PIXEL_SIZE : entity.sprite?.width ?? 0;
            const height = building?.length ? building.length * METER_PIXEL_SIZE : entity.sprite?.height ?? 0;
            entity.setSelectionSize(width, height, color);
        }

        entity.setSelectionSize = function(width, height, color = COLOR_ORANGE) {
            entity.selectionArea.clear();
            entity.selectionArea.lineStyle(SELECTION_BORDER_WIDTH, color);
            if (building?.radius) {
                entity.selectionArea.drawCircle(0, 0, building.radius * METER_PIXEL_SIZE);
            } else if (building?.hitArea && (game.settings.enableDebug || building.hitArea?.length === 1)) {
                if (game.settings.enableDebug) {
                    for (const poly of building.hitArea) {
                        entity.selectionArea.drawPolygon(new PIXI.Polygon(poly.shape));
                    }
                } else {
                    entity.selectionArea.drawPolygon(new PIXI.Polygon(building.hitArea[0].shape));
                }
            } else {
                entity.selectionArea.drawRect(-(width/2)-SELECTION_BORDER_WIDTH, -(height/2)-SELECTION_BORDER_WIDTH, width+(SELECTION_BORDER_WIDTH*2), height+(SELECTION_BORDER_WIDTH*2));
            }
        }

        entity.updateOverlays = function() {
            if (entity.productionIcons) {
                entity.productionIcons.visible = game.projectSettings.showProductionIcons;
            }
            if (entity.rangeSprite) {
                const showWhenSelected = game.projectSettings.showRangeWhenSelected && entity.selected;
                const rangeType = entity.building?.range?.type || (entity.baseUpgrades?.base && entity.building.baseUpgrades.base[entity.baseUpgrades.base].range?.type);
                entity.rangeSprite.visible = showWhenSelected || (rangeType && game.projectSettings.ranges[rangeType]);
                entity.updateRangeMask();
            }
        }

        if (type === 'text') {
            entity.labelStyle = Object.assign({}, game.settings.styles.label, DEFAULT_TEXT_STYLE);
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
                entityData.sortOffset = entity.sortOffset - game.constructionLayers[entity.sortLayer];
                entityData.label = entity.label.text;
                for (const[key, value] of Object.entries(entity.labelStyle)) {
                    if (!(key in DEFAULT_TEXT_STYLE) && value !== game.defaultSettings.styles.label[key]) {
                        if (!entityData.labelStyle) {
                            entityData.labelStyle = {};
                        }
                        entityData.labelStyle[key] = value;
                    }
                }
            };

            entity.onLoad = function(entityData) {
                if (typeof entityData.sortOffset === 'number') {
                    entity.sortOffset += entityData.sortOffset;
                }
                entity.label.text = entityData.label;
                Object.assign(entity.labelStyle, game.defaultSettings.styles.label, entityData.labelStyle);
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
                    // TODO: Add support for percentages. <= 1 could set anchor so we don't need exact pixels.
                    sprite.x = (-building.textureOffset.x / METER_TEXTURE_SCALE) / METER_PIXEL_SCALE;
                    sprite.y = (-building.textureOffset.y / METER_TEXTURE_SCALE) / METER_PIXEL_SCALE;
                }
                entity.sprite = sprite;
            }
            if (!entity.sprite) {
                entity.sprite = new PIXI.Container();
            }

            if (building.hitArea) {
                entity.sprite.hitArea = new HitAreaShapes({
                    'polygon': building.hitArea
                });
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

            entity.assignRange = function(rangeData) {
                entity.removeChild(entity.rangeSprite);
                if (rangeData) {
                    const rangeColor = COLOR_RANGES[rangeData.type] ?? COLOR_RANGES.default;
                    entity.rangeSprite = new PIXI.Graphics();
                    entity.rangeSprite.alpha = 0.15;
                    entity.updateOverlays();
                    if (!isNaN(rangeData.arc)) {
                        entity.rangeSprite.beginFill(rangeColor);
                        entity.rangeSprite.lineStyle(1, rangeColor);
                        if(!isNaN(rangeData.min)) {
                            const rangeArc = Math.deg2rad(rangeData.arc);
                            entity.rangeSprite.arc(0, 0, rangeData.min * METER_PIXEL_SIZE, Math.PI/2 + rangeArc, Math.PI/2 - rangeArc, true);
                        } else {
                            entity.rangeSprite.moveTo(0, 0);
                        }
                        const rangeArc = Math.deg2rad(rangeData.arc);
                        entity.rangeSprite.arc(0, 0, rangeData.max * METER_PIXEL_SIZE, Math.PI/2 - rangeArc, Math.PI/2 + rangeArc);
                        if(isNaN(rangeData.min)) entity.rangeSprite.lineTo(0, 0);
                        entity.rangeSprite.endFill();
                    } else if (!isNaN(rangeData.min)) {
                        entity.rangeSprite.lineStyle((rangeData.max - rangeData.min) * METER_PIXEL_SIZE, rangeColor, 1);
                        entity.rangeSprite.drawCircle(0, 0, ((rangeData.min + rangeData.max) / 2) * METER_PIXEL_SIZE);
                    } else {
                        entity.rangeSprite.beginFill(rangeColor);
                        entity.rangeSprite.drawCircle(0, 0, rangeData.max * METER_PIXEL_SIZE);
                        entity.rangeSprite.endFill();
                    }
                    if (rangeData.overlap) {
                        entity.rangeSprite.lineStyle(10, COLOR_RANGE_BORDER, 1);
                        entity.rangeSprite.drawCircle(0, 0, rangeData.overlap * METER_PIXEL_SIZE);
                    }
                    entity.addChild(entity.rangeSprite);
                }
            }

            entity.updateRangeMask = function() {
                if (game.settings.enableExperimental && entity.building.range?.lineOfSight && entity.rangeSprite?.visible) {
                    function rayCast(polygons, rayStart, rayEnd) {
                        let closestIntersection = null;
    
                        for (let polygon of polygons) {
                            for (let i = 0; i < polygon.length; i++) {
                                let p1 = polygon[i];
                                let p2 = polygon[(i + 1) % polygon.length];
    
                                let intersection = getLineIntersection(p1, p2, rayStart, rayEnd);
                                if (!intersection) continue;
    
                                if (!closestIntersection || Math.distanceBetween(rayStart, intersection) < Math.distanceBetween(rayStart, closestIntersection)) {
                                    closestIntersection = intersection;
                                }
                            }
                        }
    
                        return closestIntersection;
                    }

                    function getLineIntersection(p1, p2, p3, p4) {
                        let denominator = (p4.y - p3.y) * (p2.x - p1.x) - (p4.x - p3.x) * (p2.y - p1.y);
                        if (denominator == 0) return null;
    
                        let ua = ((p4.x - p3.x) * (p1.y - p3.y) - (p4.y - p3.y) * (p1.x - p3.x)) / denominator;
                        let ub = ((p2.x - p1.x) * (p1.y - p3.y) - (p2.y - p1.y) * (p1.x - p3.x)) / denominator;
    
                        if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
                            return {
                                x: p1.x + ua * (p2.x - p1.x),
                                y: p1.y + ua * (p2.y - p1.y)
                            };
                        }
    
                        return null;
                    }
                    
                    const polygons = [], entitySortLayer = game.constructionLayers[entity.sortLayer];
                    for (const e2 of entities) {
                        if (!e2.valid || e2 === entity || !e2.building || e2.bezier) {
                            continue;
                        }
                        if (game.constructionLayers[e2.sortLayer] >= entitySortLayer && Math.distanceBetween(entity, e2) < 1200) {
                            if (e2.building?.hitArea) {
                                for (const poly of e2.building.hitArea) {
                                    if (poly.shape) {
                                        const shapePoints = [];
                                        for (let i = 0; i < poly.shape.length; i += 2) {
                                            shapePoints.push(entity.toLocal({
                                                x: poly.shape[i],
                                                y: poly.shape[i + 1]
                                            }, e2));
                                        }
                                        polygons.push(shapePoints);
                                    }
                                }
                            } else {
                                const w = ((e2.building?.width * METER_PIXEL_SIZE) || e2.sprite.width) / 2;
                                const h = ((e2.building?.length * METER_PIXEL_SIZE) || e2.sprite.height) / 2;
                                polygons.push([
                                    entity.toLocal({ x: -w, y: -h }, e2),
                                    entity.toLocal({ x: w, y: -h }, e2),
                                    entity.toLocal({ x: w, y: h }, e2),
                                    entity.toLocal({ x: -w, y: h }, e2)
                                ]);
                            }
                        }
                    }
                    
                    const maxDist = (entity.building.range.max * 2) * METER_PIXEL_SIZE, hitPoints = [];

                    hitPoints.push(rayCast(polygons, { x: 0, y: 0 }, { x: -maxDist, y: -maxDist }) || { x: -maxDist, y: -maxDist });
                    hitPoints.push(rayCast(polygons, { x: 0, y: 0 }, { x: maxDist, y: -maxDist }) || { x: maxDist, y: -maxDist });
                    hitPoints.push(rayCast(polygons, { x: 0, y: 0 }, { x: maxDist, y: maxDist }) || { x: maxDist, y: maxDist });
                    hitPoints.push(rayCast(polygons, { x: 0, y: 0 }, { x: -maxDist, y: maxDist }) || { x: -maxDist, y: maxDist });
    
                    for (const poly of polygons) {
                        for (const p of poly) {
                            hitPoints.push(rayCast(polygons, { x: 0, y: 0 }, p));
                        }
                    }

                    for (const poly of polygons) {
                        for (const p of poly) {
                            let angle = Math.angleBetween({ x: 0, y: 0 }, p);
                            let p1 = Math.extendPoint({ x: 0, y: 0 }, maxDist, angle - 0.001);
                            let p2 = Math.extendPoint({ x: 0, y: 0 }, maxDist, angle + 0.001);
                            hitPoints.push(rayCast(polygons, { x: 0, y: 0 }, p1) || p1);
                            hitPoints.push(rayCast(polygons, { x: 0, y: 0 }, p2) || p2);
                        }
                    }

                    hitPoints.sort((p1, p2) => {
                        return Math.angleBetween({ x: 0, y: 0}, p1) - Math.angleBetween({ x: 0, y: 0}, p2);
                    });

                    entity.removeChild(entity.lineOfSightRange);
                    if (ENABLE_DEBUG) {
                        entity.lineOfSightRange = new PIXI.Container();
                        for (const p of hitPoints) {
                            let line = new PIXI.Graphics();
                            line.lineStyle(2, COLOR_GREEN).moveTo(0, 0).lineTo(p.x, p.y);
                            entity.lineOfSightRange.addChild(line);
                        }
                        entity.addChild(entity.lineOfSightRange);
                    }
    
                    if (!entity.rangeSpriteMask) {
                        entity.rangeSpriteMask = new PIXI.Graphics();
                        entity.addChild(entity.rangeSpriteMask);
                        entity.rangeSprite.mask = entity.rangeSpriteMask;
                    }

                    entity.rangeSpriteMask.clear();
                    entity.rangeSpriteMask.beginFill(0xFF3300);
                    entity.rangeSpriteMask.drawPolygon(new PIXI.Polygon(hitPoints));
                    entity.rangeSpriteMask.endFill();
                }
            }

            if (building.range) {
                entity.assignRange(building.range);
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
                    entity.sockets = [];
                    entity.bottomSockets = new PIXI.Container();
                    entity.bottomSockets.zIndex = -1;
                    entity.addChild(entity.bottomSockets);
                    // TODO: Sort top sockets above selectionArea.
                    entity.topSockets = new PIXI.Container();
                    entity.topSockets.zIndex = 1;
                    entity.addChild(entity.topSockets);
                    entity.sortChildren();
                }

                const socket = new PIXI.Container();
                socket.connections = {};
                socket.socketData = socketData;
                socket.socketData.x = x ?? (isNaN(socket.socketData.x) ? 0 : (-buildingWidth/2) + ((socket.socketData.x / METER_TEXTURE_SCALE) / METER_PIXEL_SCALE));
                socket.socketData.y = y ?? (isNaN(socket.socketData.y) ? 0 : (-buildingLength/2) + ((socket.socketData.y / METER_TEXTURE_SCALE) / METER_PIXEL_SCALE));
                socket.socketData.rotation = rotation ?? socket.socketData.rotation;
                socket.position.set(socket.socketData.x, socket.socketData.y);
                socket.rotation = rotation ?? Math.deg2rad(socket.socketData.rotation);

                if (ENABLE_DEBUG || !socketData.temp) {
                    // Might want to add what kind of liquid it expects, water, oil, power, etc.
                    if (socket.socketData.flow === 'in') {
                        socket.pointer = new PIXI.Sprite(resources.pointer.texture);
                        socket.pointer.anchor.set(0.5, -0.5);
                        socket.pointer.rotation = Math.PI;
                    } else if (socket.socketData.flow === 'out') {
                        socket.pointer = new PIXI.Sprite(resources.pointer.texture);
                        socket.pointer.anchor.set(0.5, 1.5);
                    } else if (socket.socketData.flow === 'bi' && socket.socketData.cap !== 'left' && socket.socketData.cap !== 'right') {
                        socket.pointer = new PIXI.Sprite(resources.bipointer.texture);
                        socket.pointer.anchor.set(0.5, 1.5);
                    } else if (socket.socketData.name === 'power') {
                        socket.pointer = new PIXI.Sprite(resources.power.texture);
                        socket.pointer.anchor.set(0.5, 1.5);
                        socket.pointer.rotation = -(entity.rotation + socket.rotation);
                        entity.handleTick = true;
                    } else if (entity.building?.textureBorder && !entity.building.trenchConnector) {
                        let textureBorder = resources[entity.building.textureBorder].texture;
                        socket.pointer = new PIXI.Sprite(textureBorder);
                        socket.pointer.width = textureBorder.width / METER_PIXEL_SCALE;
                        socket.pointer.height = textureBorder.height / METER_PIXEL_SCALE;
                        socket.pointer.anchor.set(0.5, 1.0);
                    } else if (socket.socketData.temp) {
                        socket.pointer = new PIXI.Sprite(resources.bipointer.texture);
                        socket.pointer.anchor.set(0.5, 1.5);
                    } else if (socket.socketData.texture) {
                        socket.pointer = new PIXI.Sprite(resources[socket.socketData.texture].texture);
                        socket.pointer.width = socket.pointer.width / METER_PIXEL_SCALE;
                        socket.pointer.height = socket.pointer.height / METER_PIXEL_SCALE;
                        socket.pointer.anchor.set(0.5, 0.5);
                    }
                    if (socket.pointer) {
                        socket.addChild(socket.pointer);
                    }

                    function createSocketIndicator(color, width, length, center) {
                        socket.indicator = new PIXI.Graphics();
                        socket.indicator.beginFill(color ?? COLOR_ORANGE);
                        socket.indicator.drawRect(-(width ?? socketWidth)/2, -(length ?? socketThickness) / (center ? 2 : 1), (width ?? socketWidth), (length ?? socketThickness));
                        socket.indicator.endFill();
                        socket.addChild(socket.indicator);
                    }

                    if (socket.socketData.flow === 'in') {
                        createSocketIndicator(COLOR_RED);
                    } else if (socket.socketData.flow === 'out') {
                        createSocketIndicator(COLOR_GREEN);
                    } else if (socket.socketData.flow === 'bi') {
                        if (socket.socketData.cap !== 'left' && socket.socketData.cap !== 'right') {
                            createSocketIndicator(COLOR_BLUE);
                        }
                    } else if (socket.socketData.name === 'power') {
                        createSocketIndicator(COLOR_YELLOW, powerSocketSize, powerSocketSize, true);
                    } else if (socket.socketData.type === 'traincar' || socket.socketData.type === 'smalltraincar' || entity.building?.hasHandle || game.settings.enableDebug) {
                        createSocketIndicator(undefined, socketThickness, socketThickness, true);
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
                                for (let i = 0; i < connectingEntity.sockets.length; i++) {
                                    const connectingEntitySocket = connectingEntity.sockets[i];
                                    if (connectingEntitySocket.socketData.id === connectingSocketId) {
                                        connectingSocket = connectingEntitySocket;
                                        break;
                                    }
                                }
                                if (!connectingSocket && (entity.subtype === 'rail_large_gauge' || entity.subtype === 'rail_small_gauge')) {
                                    const socketPosition = connectingEntity.toLocal(socket, entity);
                                    connectingSocket = socket.createConnection(connectingEntity, socketPosition.x, socketPosition.y, ((entity.rotation + socket.rotation) - connectingEntity.rotation) + Math.PI, connectingSocketId);
                                }
                            }
                        }
                        socket.connections[connectingEntityId] = connectingSocketId ?? connectingSocket.socketData.id;
                        socket.setVisible(false);
                        if (building.canUnion) {
                            entity.setUnion(game.getEntityById(connectingEntityId));
                        }
                        return connectingSocket;
                    }
                }
                // This works for rails, unsure about anything else. Could just use the position of the socket, but we already have positional and rotation data from snapping.
                socket.createConnection = function(connectingEntity, x, y, rotation, id) {
                    if (connectingEntity?.sockets) {
                        let connectingSocket = null;
                        for (let i = 0; i < connectingEntity.sockets.length; i++) {
                            const socket2 = connectingEntity.sockets[i];
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
                                'id': id ?? connectingEntity.sockets.length,
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
                socket.canConnect = function(connectingSocket) {
                    if (connectingSocket?.socketData?.type) {
                        const socketType = socket.socketData.type, connectingSocketType = connectingSocket.socketData.type;
                        if (typeof socketType === typeof connectingSocketType) {
                            if (!socket.socketData.flow || (socket.socketData.flow === 'bi' || (socket.socketData.flow !== connectingSocket.socketData.flow))) {
                                if (typeof connectingSocketType === 'object' && Array.isArray(connectingSocketType)) {
                                    for (const socketTypeA of socketType) {
                                        for (const socketTypeB of connectingSocketType) {
                                            if ((socketTypeA.category & socketTypeB.mask) !== 0 && (socketTypeB.category & socketTypeA.mask) !== 0) {
                                                return true;
                                            }
                                        }
                                    }
                                } else {
                                    return socketType === connectingSocketType;
                                }
                            }
                        }
                    }
                    return false;
                }
                socket.remove = function() {
                    if (socketData.temp) {
                        if (socketData.below) {
                            entity.bottomSockets.removeChild(socket);
                        } else {
                            entity.topSockets.removeChild(socket);
                        }
                        entity.sockets = entity.sockets.filter(obj => obj !== socket);
                    }
                }
                socket.removeConnections = function(entityId, ignoreSelected) {
                    if (Object.keys(socket.connections).length) {
                        let connectionEstablished = false;
                        for (const [connectedEntityId, connectedSocketId] of Object.entries(socket.connections)) {
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
                                for (let k = 0; k < connectedEntity.sockets.length; k++) {
                                    const connectedSocket = connectedEntity.sockets[k];
                                    if (connectedSocket.socketData.id === connectedSocketId) {
                                        delete connectedSocket.connections[entity.id];
                                        if (Object.keys(connectedSocket.connections).length === 0) {
                                            if (connectedEntity.building?.requireConnection) {
                                                connectedEntity.remove();
                                            } else if (connectedSocket.socketData.temp) {
                                                connectedSocket.remove();
                                            } else {
                                                connectedSocket.setVisible(true);
                                            }
                                        }
                                        break;
                                    }
                                }
                            }
                            delete socket.connections[connectedEntityId];
                        }
                        if (!connectionEstablished) {
                            if (socket.socketData.temp) {
                                socket.remove();
                            } else {
                                socket.setVisible(true);
                            }
                            if (building.canUnion) {
                                game.updateEntityUnions();
                            }
                        }
                    }
                }
                socket.setVisible = function(visible) {
                    if (!ENABLE_DEBUG) {
                        if (socket.indicator && socket.socketData.name !== 'power') {
                            socket.indicator.visible = visible;
                        }
                        if (socket.pointer) {
                            const connectedEntityIds = Object.keys(socket.connections);
                            visible = visible ?? connectedEntityIds.length === 0;
                            if (socket.socketData.textureAlt) {
                                let texture = resources[visible ? socket.socketData.texture : socket.socketData.textureAlt].texture;
                                socket.pointer.texture = texture;
                                socket.pointer.width = texture.width / METER_PIXEL_SCALE;
                                socket.pointer.height = texture.height / METER_PIXEL_SCALE;
                                visible = true;
                            } else if (socket.socketData.texture && !visible) {
                                if (connectedEntityIds.length === 1) {
                                    const e2 = game.getEntityById(connectedEntityIds[0]);
                                    if (e2 && (game.constructionLayers[e2.sortLayer] < game.constructionLayers[entity.sortLayer])) {
                                        visible = true;
                                    }
                                }
                            }
                            socket.pointer.visible = visible;
                        }
                    }
                }

                if (socketData.switch === 'rail') {
                    let railSwitch = new PIXI.Sprite(resources['trackswitch_inactive'].texture);
                    railSwitch.anchor.set(0.5);
                    railSwitch.width = 32;
                    railSwitch.height = 32;
                    railSwitch.position.x += (entity.subtype === 'rail_large_gauge' ? 100 : 70);
                    railSwitch.interactive = true;
                    socket.switchEnabled = false;
                    railSwitch.on('pointerdown', () => {
                        socket.switchEnabled = !socket.switchEnabled;
                        if (socket.switchEnabled) {
                            railSwitch.texture = resources['trackswitch_active'].texture;
                        } else {
                            railSwitch.texture = resources['trackswitch_inactive'].texture;
                        }
                    });
                    socket.addChild(railSwitch);
                }

                entity.sockets.push(socket);
                if (socketData.below) {
                    entity.bottomSockets.addChild(socket);
                } else {
                    entity.topSockets.addChild(socket);
                }
                return socket;
            }

            entity.getSocketById = function(id) {
                for (let i = 0; i < entity.sockets.length; i++) {
                    const socket = entity.sockets[i];
                    if (socket.socketData?.id === id) {
                        return socket;
                    }
                }
                return null;
            }

            if (building.canUnion) {
                entity.union = entity;
                entity.unionRank = 0;

                entity.getUnion = function() {
                    if (entity.union !== entity) {
                        entity.union = entity.union.getUnion();
                    }
                    return entity.union;
                };

                entity.getUnionEntities = function() {
                    let union = entity.getUnion(), unionEntities = [];
                    for (let unionEntity of entities) {
                        if (unionEntity?.building?.canUnion && unionEntity.getUnion() === union) {
                            unionEntities.push(unionEntity);
                        }
                    }
                    return unionEntities;
                };

                entity.setUnion = function(unionEntity) {
                    if (unionEntity?.building?.canUnion) {
                        let unionEntityA = entity.getUnion(), unionEntityB = unionEntity.getUnion();
                        if (unionEntityA === unionEntityB) {
                            return;
                        }
                        if (unionEntityA.unionRank < unionEntityB.unionRank) {
                            unionEntityA.union = unionEntityB;
                        } else if (unionEntityA.unionRank > unionEntityB.unionRank) {
                            unionEntityB.union = unionEntityA;
                        } else {
                            unionEntityB.union = unionEntityA;
                            unionEntityA.unionRank++;
                        }
                        entity.setSelectionColor(COLOR_LIGHTBLUE);
                        unionEntity.setSelectionColor(COLOR_LIGHTBLUE);
                    }
                };

                entity.removeUnion = function() {
                    entity.union = entity;
                    entity.setSelectionColor();
                };
            }

            if (building.sockets) {
                for (let i = 0; i < building.sockets.length; i++) {
                    entity.createSocket(Object.assign({}, building.sockets[i]));
                }
            }

            if (building.baseUpgrades) {
                entity.baseUpgrades = {};
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
                    for (let i = 0; i < entity.sockets.length; i++) {
                        const entitySocket = entity.sockets[i];
                        if (Object.keys(entitySocket.connections).length > 0) {
                            return true;
                        }
                    }
                }
                return false;
            }

            entity.hasConnectionToEntityId = function(entityId, ignoredSocket) {
                if (entity.sockets) {
                    for (let i = 0; i < entity.sockets.length; i++) {
                        const entitySocket = entity.sockets[i];
                        if ((!ignoredSocket || entitySocket !== ignoredSocket) && typeof entitySocket.connections[entityId] === 'number') {
                            return true;
                        }
                    }
                }
                return false;
            }

            entity.hasConnectionToEntity = (connectingEntity, ignoredSocket) => entity.hasConnectionToEntityId(connectingEntity.id, ignoredSocket);

            entity.attemptReconnections = function(removeConnections = true) {
                if (removeConnections) {
                    entity.removeConnections();
                }
                for (const e2 of entities) {
                    if (e2 === entity || !e2.sockets || Math.distanceBetween(entity.mid ?? entity, e2.mid ?? e2) > 1000) {
                        continue;
                    }
                    for (const eSocket of entity.sockets) {
                        const eSocketPosition = app.cstage.toLocal({x: eSocket.x, y: eSocket.y}, entity);
                        for (const e2Socket of e2.sockets) {
                            const e2SocketPosition = app.cstage.toLocal({x: e2Socket.x, y: e2Socket.y}, e2, undefined, true);
                            if (eSocket.canConnect(e2Socket) && (!e2Socket.socketData.connectionLimit || Object.keys(e2Socket.connections).length < e2Socket.socketData.connectionLimit) && (Math.distanceBetween(eSocketPosition, e2SocketPosition) < 1)) {
                                let eSocketRotation = Math.angleNormalized((entity.rotation + eSocket.rotation) - Math.PI);
                                let e2SocketRotation = Math.angleNormalized(e2.rotation + e2Socket.rotation);
                                let angleDiff = Math.angleDifference(eSocketRotation, e2SocketRotation);
                                if (angleDiff < 0.001 && angleDiff > -0.001) {
                                    eSocket.setConnection(e2.id, e2Socket);
                                }
                            }
                        }
                    }
                }
            }

            entity.recoverConnections = function(recoveredEntities = [entity]) {
                for (const eSocket of entity.sockets) {
                    for (const [connectedEntityId, connectedSocketId] of Object.entries(eSocket.connections)) {
                        const connectedEntity = game.getEntityById(connectedEntityId);
                        if (connectedEntity && connectedEntity.sockets && !recoveredEntities.includes(connectedEntity)) {
                            const e2Socket = connectedEntity.getSocketById(connectedSocketId);
                            if (e2Socket) {
                                recoveredEntities.push(connectedEntity);

                                let connectedEntityPosition = app.cstage.toLocal({x: eSocket.x, y: eSocket.y}, entity);
                                const connectedEntityRotation = Math.angleNormalized(-Math.angleDifference(entity.rotation + eSocket.rotation + Math.PI, e2Socket.rotation));
                                if (e2Socket.x !== 0 || e2Socket.y !== 0) {
                                    const e2SocketDist = Math.distanceBetween({ x: 0, y: 0 }, e2Socket);
                                    const socketAngleDiff = Math.angleBetween({ x: 0, y: 0 }, e2Socket) + Math.PI;
                                    connectedEntityPosition = Math.extendPoint(connectedEntityPosition, e2SocketDist, connectedEntityRotation + socketAngleDiff);
                                }

                                connectedEntity.position.set(connectedEntityPosition.x, connectedEntityPosition.y);
                                connectedEntity.rotation = connectedEntityRotation;

                                connectedEntity.recoverConnections(recoveredEntities);
                            }
                        }
                    }
                }
            }

            entity.removeConnections = function(socketId, ignoreSelected, ignoreSocket, entityId) {
                if (entity.sockets) {
                    // Iterate sockets to make sure we either remove the connections and update the socket or remove the entity altogether.
                    for (let i = 0; i < entity.sockets.length; i++) {
                        const entitySocket = entity.sockets[i];
                        if (typeof socketId !== 'number' || (ignoreSocket ? entitySocket.socketData.id !== socketId : entitySocket.socketData.id === socketId)) {
                            entitySocket.removeConnections(entityId, ignoreSelected);
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
                    for (let i = 0; i < entity.sockets.length; i++) {
                        const socket = entity.sockets[i];
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

                if (entity.rangeSprite) {
                    entity.updateRangeMask();
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

            entity.setProductionId = function(id, useBaseProduction = false) {
                if (entity.building?.production && !(entity.baseProduction === useBaseProduction && entity.selectedProduction === id)) {
                    entity.baseProduction = useBaseProduction;
                    entity.selectedProduction = id;
                    if (game.getSelectedEntity() === entity) {
                        game.buildingSelectedMenuComponent?.updateProduction();
                    }
                    entity.removeChild(entity.productionIcons);
                    if (typeof id === 'number') {
                        entity.productionIcons = new PIXI.Container();
                        entity.productionIcons.visible = game.projectSettings.showProductionIcons;
                        entity.productionIcons.rotation = -entity.rotation;
                        const productionList = (entity.baseProduction ? entity.building.parent : entity.building).production;
                        for (let i = 0; i < productionList.length; i++) {
                            const production = productionList[i];
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

            entity.setBaseUpgrade = function(tree, key = undefined) {
                entity.baseUpgrades[tree] = key;
                entity.assignRange(key && entity.building.baseUpgrades[tree][key].range ? entity.building.baseUpgrades[tree][key].range : entity.building.range);
                if (entity.selected) {
                    game.buildingSelectedMenuComponent?.refresh();
                }
                game.statisticsMenuComponent?.refresh();
            };
        }

        let points;
        if (entity.type === 'building' || entity.type === 'shape') {
            points = [];
            entity.updateHandles = function() {
                for (let i = 0; i < points.length; i++) {
                    let point = points[i];
                    if (point.handle) {
                        point.handle.visible = entity.selected;
                        if (point.handle.visible) {
                            point.handle.tint = entity.locked ? COLOR_RED : (point.index === 0 ? COLOR_ORANGE : COLOR_WHITE);
                        }
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
                entityData.sortOffset = entity.sortOffset - game.constructionLayers[entity.sortLayer];

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
                }

                if (entity.building && !entityData.upgrading) {
                    if (typeof entity.productionScale === 'number') {
                        entityData.productionScale = entity.productionScale;
                    }
                    if (entity.baseProduction) {
                        entityData.baseProduction = entity.baseProduction;
                    }
                    entityData.selectedProduction = entity.selectedProduction;

                    if (entity.baseUpgrades) {
                        entityData.baseUpgrades = Object.assign({}, entity.baseUpgrades);
                    }
                }

                if (entity.sockets) {
                    for (let i = 0; i < entity.sockets.length; i++) {
                        let socket = entity.sockets[i];
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
                    const defaultSettings = game.defaultSettings.styles[entity.subtype];
                    for (const[key, value] of Object.entries(entity.shapeStyle)) {
                        if (!defaultSettings || value !== defaultSettings[key]) {
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
                if (typeof entityData.sortOffset === 'number') {
                    entity.sortOffset += entityData.sortOffset;
                }

                if (entity.building) {
                    if (typeof entityData.selectedProduction === 'number') {
                        if (typeof entityData.productionScale === 'number') {
                            entity.productionScale = entityData.productionScale;
                        }
                        entity.setProductionId(entityData.selectedProduction, entityData.baseProduction);
                    }
                    if (entityData.baseUpgrades) {
                        for (const [tree, key] of Object.entries(entityData.baseUpgrades)) {
                            entity.setBaseUpgrade(tree, key);
                        }
                    }
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
                    Object.assign(entity.shapeStyle, game.defaultSettings.styles[entity.subtype], entityData.shapeStyle);
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

            entity.regenerate = function() {
                if (entity.sprite) {
                    if (entity.sprite.rope) {
                        entity.sprite.removeChild(entity.sprite.rope);
                    }
                    if (points.length >= 2) {
                        const frontPoint = points[0], backPoint = points[points.length - 1];
                        const updateTextureCap = function(sprite, point, rotationOffset) {
                            if (sprite) {
                                sprite.position.set(point.x, point.y);
                                sprite.rotation = point.rotation + rotationOffset;
                            }
                        }
                        if (entity.building) {
                            if (entity.building?.trenchConnector) {
                                entity.sprite.removeChild(entity.sprite.trapezoid);

                                const floorHalfHeight = 57, floorTexturePadding = 100;
                                const frontPoint = points[0], endPoint = points[points.length - 1];
                                const frontPoint1 = { x: 0, y: -floorHalfHeight };
                                const frontPoint2 = { x: 0, y: floorHalfHeight };
                                const endPoint1 = Math.extendPoint(endPoint, floorHalfHeight, endPoint.rotation - Math.PI/2);
                                const endPoint2 = Math.extendPoint(endPoint, floorHalfHeight, endPoint.rotation + Math.PI/2);

                                const angle = Math.angleBetween({x: 0, y: 0}, endPoint);
                                entity.sprite.trapezoid = new PIXI.Container();

                                const trapezoid = new PIXI.Polygon([
                                    frontPoint1.x, frontPoint1.y,
                                    frontPoint2.x, frontPoint2.y,
                                    endPoint1.x, endPoint1.y,
                                    endPoint2.x, endPoint2.y
                                ]);

                                const floorMask = new PIXI.Graphics();
                                floorMask.beginFill(0xFF3300);
                                floorMask.drawPolygon(trapezoid);
                                floorMask.endFill();
                                entity.sprite.trapezoid.addChild(floorMask);

                                entity.sprite.hitArea = trapezoid;

                                entity.sprite.trapezoid.floor = new PIXI.TilingSprite(resources[entity.building.texture].texture, Math.distanceBetween(frontPoint, endPoint) + floorTexturePadding);
                                entity.sprite.trapezoid.floor.anchor.set((floorTexturePadding / entity.sprite.trapezoid.floor.width) / 2, 0.5);
                                entity.sprite.trapezoid.floor.mask = floorMask;
                                entity.sprite.trapezoid.floor.rotation = angle;
                                entity.sprite.trapezoid.addChild(entity.sprite.trapezoid.floor);

                                const textureBorderHeight = resources[entity.building.textureBorder].texture.height;

                                const connectorTopBorder = new PIXI.TilingSprite(resources[entity.building.textureBorder].texture, Math.distanceBetween(frontPoint1, endPoint2), textureBorderHeight);
                                connectorTopBorder.y = -floorHalfHeight;
                                connectorTopBorder.anchor.set(0, 0.5);
                                connectorTopBorder.rotation = Math.angleBetween(frontPoint1, endPoint2);
                                entity.sprite.trapezoid.addChild(connectorTopBorder);

                                const connectorBottomBorder = new PIXI.TilingSprite(resources[entity.building.textureBorder].texture, Math.distanceBetween(frontPoint2, endPoint1), textureBorderHeight);
                                connectorBottomBorder.y = floorHalfHeight;
                                connectorBottomBorder.scale.y = -1;
                                connectorBottomBorder.anchor.set(0, 0.5);
                                connectorBottomBorder.rotation = Math.angleBetween(frontPoint2, endPoint1);
                                entity.sprite.trapezoid.addChild(connectorBottomBorder);

                                entity.sprite.addChild(entity.sprite.trapezoid);

                                // TODO: Get the max rotation for a socket from the data.
                                const maxAngle = Math.deg2rad((15 * 3) + 1), angleBetweenPoints = Math.angleBetween(frontPoint, endPoint);
                                const limitReached = (entity.building?.minLength && (Math.distanceBetween(frontPoint, endPoint) < (entity.building.minLength * METER_PIXEL_SIZE))) || ((Math.abs(angleBetweenPoints) > maxAngle) || (Math.abs(Math.angleNormalized(-angleBetweenPoints + endPoint.rotation + Math.PI)) > maxAngle));
                                if (limitReached) {
                                    entity.sprite.trapezoid.floor.tint = COLOR_RED;
                                    connectorTopBorder.tint = COLOR_RED;
                                    connectorBottomBorder.tint = COLOR_RED;
                                }

                                for (let i = 0; i < entity.sockets.length; i++) {
                                    let socket = entity.sockets[i];
                                    if (socket.socketData.cap === 'back') {
                                        socket.position.set(endPoint.x, endPoint.y);
                                        socket.rotation = endPoint.rotation - Math.PI/2;
                                    }
                                    socket.pointer.tint = limitReached ? COLOR_RED : COLOR_WHITE;
                                }
                            } else {
                                let bezierPoints = [];
                                for (let i=0; i<points.length; i++) {
                                    let point = points[i];
                                    
                                    if (entity.building?.simpleBezier) {
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
                                    for (let i = 0; i < entity.sockets.length; i++) {
                                        let socket = entity.sockets[i];
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
                                    entity.sprite.outline.visible = entity.selected;
                                    entity.sprite.outline.tint = entity.locked ? COLOR_RED : COLOR_ORANGE;
                                    entity.sprite.addChild(entity.sprite.outline);
                                }
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
                        entity.handleTick = true;
                    }
                }
            };

            if (entity.type ==='shape') {
                entity.sprite = new PIXI.Graphics();
                entity.addChild(entity.sprite);
                entity.shapeStyle = Object.assign({}, entity.subtype === 'line' ? game.settings.styles.line : (entity.subtype === 'circle' ? game.settings.styles.circle : game.settings.styles.rectangle));

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
                    if (entity.subtype === 'line') {
                        entity.frontCap = updateArrow(entity.frontCap, entity.shapeStyle.frontArrow);
                        entity.backCap = updateArrow(entity.backCap, entity.shapeStyle.backArrow);
                        entity.updateHandles();
                    }
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

        entity.addChild(entity.selectionArea);

        entity.onSelect = function() {
            entity.selected = true;
            entity.selectionArea.tint = entity.locked ? COLOR_RED : COLOR_WHITE;
            entity.selectionArea.visible = true;

            entity.updateOverlays();

            if (entity.sprite?.outline) {
                entity.sprite.outline.tint = entity.locked ? COLOR_RED : COLOR_ORANGE;
            }

            if (entity.hasHandle) {
                entity.updateHandles();
            }

            if (keys[16] && entity.union) {
                for (const unionEntity of entity.getUnionEntities()) {
                    game.addSelectedEntity(unionEntity);
                }
            }
        };

        entity.onDeselect = function() {
            entity.selected = false;
            entity.selectionArea.visible = false;
            delete entity.prevPosition;
            delete entity.prevRotation;

            entity.updateOverlays();

            if (entity.building || entity.type === 'shape') {
                if (entity.building) {
                    if (entity.bezier && entity.bezier.length() <= entity.building.minLength) {
                        entity.remove();
                    } else if (entity.building.requireConnection) {
                        // Requires all sockets have at least one connection. Mainly for power lines.
                        for (let i = 0; i < entity.sockets.length; i++) {
                            const socket = entity.sockets[i];
                            if (Object.keys(socket.connections).length === 0) {
                                entity.remove();
                                break;
                            }
                        }
                    }
                } else if (entity.type === 'shape' && points && Math.distanceBetween(points[0], points[points.length - 1]) < (entity.subtype === 'circle' ? 16 : 32)) {
                    entity.remove();
                    return;
                }
                entity.updateHandles();
            } else if (entity.type === 'text' && entity.label.text.length === 0) {
                entity.remove();
            }

            if (keys[16] && entity.union) {
                for (const unionEntity of entity.getUnionEntities()) {
                    game.removeSelectedEntity(unionEntity);
                }
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
            if (entity.subtype === 'rail_large_gauge' || entity.subtype === 'rail_small_gauge') {
                for (const entity2 of entities) {
                    if (entity2.isTrain && entity2.currentTrack === entity) {
                        entity2.currentTrack = null;
                        entity2.currentTrackT = null;
                        entity2.trackVelocity = 0;
                    }
                }
            }
        };

        const boundsBuffer = 16, boundsPadding = boundsBuffer / 2;
        entity.canGrab = function(ignoreMouse) {
            const immovable = game.settings.disableLockedMouseEvents && entity.locked;
            if (ignoreMouse || immovable) {
                return !immovable;
            }
            if (entity.building?.radius || (entity.type === 'shape' && entity.subtype === 'circle')) {
                const centerDist = Math.distanceBetween(entity, { x: gmx, y: gmy });
                if (entity.building?.radius) {
                    if (centerDist < (entity.building.radius * METER_PIXEL_SIZE)) {
                        return true;
                    }
                } else if ((centerDist < ((entity.sprite.width/2) + boundsPadding)) && (!entity.shapeStyle?.border || (centerDist > (((entity.sprite.width/2) - entity.shapeStyle?.lineWidth) - boundsPadding)))) {
                    return true;
                }
            } else {
                let bounds = entity.getBounds(true);
                let boundsAdjustedPos = app.cstage.toLocal({x: bounds.x, y: bounds.y}, app.stage, undefined, true);
                bounds.x = boundsAdjustedPos.x - boundsBuffer;
                bounds.y = boundsAdjustedPos.y - boundsBuffer;
                bounds.width /= game.camera.zoom;
                bounds.height /= game.camera.zoom;
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
                        if (entity.sprite?.hitArea) {
                            const mousePos = entity.toLocal({x: gmx, y: gmy}, app.cstage, undefined, true);
                            return entity.sprite.hitArea.contains(mousePos.x, mousePos.y);
                        }

                        // https://stackoverflow.com/a/67732811 <3
                        let w = entity.selectionArea.width / 2;
                        let h = entity.selectionArea.height / 2;
                        const r = entity.rotation;

                        const lineThickness = entity.shapeStyle?.lineWidth ? entity.shapeStyle.lineWidth / 2 : 0;

                        const [ax, ay] = [Math.cos(r), Math.sin(r)];
                        const t = (x, y) => ({x: x * ax - y * ay + entity.x, y: x * ay + y * ax + entity.y});
                        let bBounds;
                        if (entity.type === 'shape' && points) {
                            let p1, p2, m1, m2;
                            for (let i = 0; i < points.length; i++) {
                                let point = points[i];
                                if (point.index === 0) {
                                    p1 = point;
                                } else if (point.index === 1) {
                                    p2 = point;
                                }
                            }
                            if (entity.subtype === 'line') {
                                m1 = {
                                    x: p1.x - lineThickness - boundsPadding,
                                    y: p1.y - lineThickness - boundsPadding
                                };
                                m2 = {
                                    x: p2.x + lineThickness + boundsPadding,
                                    y: p2.y + lineThickness + boundsPadding
                                };
                            } else {
                                const borderPadding = (entity.shapeStyle.border ? lineThickness : 0) + boundsPadding;
                                m1 = {
                                    x: p1.x + (p2.x < p1.x ? borderPadding : -borderPadding),
                                    y: p1.y + (p2.y < p1.y ? borderPadding : -borderPadding)
                                };
                                m2 = {
                                    x: p2.x + (p1.x < p2.x ? borderPadding : -borderPadding),
                                    y: p2.y + (p1.y < p2.y ? borderPadding : -borderPadding)
                                };
                            }
                            bBounds = [t(m2.x, m2.y), t(m1.x, m2.y), t(m1.x, m1.y), t(m2.x, m1.y)];
                        } else {
                            bBounds = [t(w, h), t(-w, h), t(-w, -h), t(w, -h)];
                        }
                        return Math.isPointWithinBounds({ x: gmx, y: gmy }, bBounds, (entity.subtype === 'rectangle' && entity.shapeStyle.border ? (lineThickness + boundsPadding) * 2 : undefined));
                    }
                }
            }
            return false;
        };

        entity.bringToFront = function() {
            let maxOffset = 0;
            for (let i = 0; i < entities.length; i++) {
                const ent = entities[i];
                if (!ent.selected && ent !== entity && ent.sortLayer === entity.sortLayer) {
                    maxOffset = Math.max(maxOffset, ent.sortOffset);
                }
            }
            if (maxOffset) {
                entity.sortOffset = maxOffset + 1;
            }
        };

        entity.getZIndex = function() {
            return -entity.sortOffset - ((game.settings.bringSelectedToFront && entity.selected && !entity.following) ? game.constructionLayers.selected : 0);
        };

        if (!entity.building || entity.building.isBezier) {
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

            if (entity.handleTick || entity.visible) {
                if (entity.sprite?.outline && entity.sprite.outline.visible !== entity.selected) {
                    entity.sprite.outline.visible = entity.selected;
                }

                if (selectedHandlePoint && entity.selected && !entity.locked && entity.hasHandle && mouseDown[0]) {
                    let gridSize = game.settings.gridSize ? game.settings.gridSize : 16;
                    let gmxGrid = gmx;
                    let gmyGrid = gmy;
                    if (!entity.building?.ignoreSnapSettings && (game.settings.enableGrid || keys[16])) {
                        gmxGrid = Math.round(gmxGrid / gridSize) * gridSize;
                        gmyGrid = Math.round(gmyGrid / gridSize) * gridSize;
                    }
                    let mousePos = entity.toLocal({x: gmxGrid, y: gmyGrid}, app.cstage, undefined, true);
                    game.setPickupEntities(false);
                    if (selectedHandlePoint.index === 0) {
                        entity.x = gmx;
                        entity.y = gmy;

                        if (!entity.building?.ignoreSnapSettings && (game.settings.enableGrid || keys[16])) {
                            entity.x = Math.round(entity.x / gridSize) * gridSize;
                            entity.y = Math.round(entity.y / gridSize) * gridSize;
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
                            for (let i = 0; i < entity.sockets.length; i++) {
                                const entitySocket = entity.sockets[i];
                                if (entitySocket.socketData?.cap === 'back') {
                                    handleSocket = entitySocket;
                                    break;
                                }
                            }
                            entity.removeConnections(0, false, true);
                        }
                        for (let i = 0; i < entities.length; i++) {
                            let entity2 = entities[i];
                            if (!entity2.visible || entity2 === entity || entity2.type !== 'building' || !(entity.sockets && entity2.sockets) || Math.distanceBetween({x: gmx, y: gmy}, entity2.mid) > 1000) {
                                continue;
                            }

                            if (entity2.sockets) {
                                if (entity.building?.canSnapStructureType !== false || entity.subtype !== entity2.subtype) {
                                    const mousePos2 = entity2.toLocal({x: gmx, y: gmy}, app.cstage, undefined, true);
                                    let nearestSocket, nearestSocketPos, nearestSocketDist = null;
                                    for (let i = 0; i < entity2.sockets.length; i++) {
                                        const entitySocket = entity2.sockets[i];
                                        if (handleSocket.canConnect(entitySocket) && !entitySocket.socketData.temp) {
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
                                        if (handleSocket.socketData.name === 'power') {
                                            entity.rotation = Math.angleBetween(entity, nearestSocketPos);
                                        }
                                        nearestSocketPos = entity.toLocal(nearestSocketPos, app.cstage, undefined, true);
                                        const socketRotation = Math.angleNormalized(((entity2.rotation + nearestSocket.rotation) - entity.rotation) - Math.deg2rad(handleSocket.socketData.rotation));
                                        // TODO: Only force rotate snap constraint whenever the first socket is connected, otherwise the entity should be able to rotate and attempt snapping.
                                        if (handleSocket.socketData.name === 'power' || Math.angleDifference(Math.angleNormalized(selectedHandlePoint.rotation), socketRotation) === 0 && Math.round(nearestSocketPos.y) === 0 || entity.building?.isBezier || entity.building?.trenchConnector) {
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
                        if (entity.building.simpleBezier) {
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

                if (entity.handleTick || entity.lastRotation !== entity.rotation) {
                    if (entity.productionIcons) {
                        entity.productionIcons.rotation = -entity.rotation;
                    }

                    if (entity.sockets) {
                        for (let i = 0; i < entity.sockets.length; i++) {
                            let socket = entity.sockets[i];
                            if (socket.socketData.name === 'power') {
                                socket.pointer.rotation = -(entity.rotation + socket.rotation);
                            }
                        }
                    }

                    if (selectedEntities.length === 1) {
                        game.updateSelectedBuildingMenu();
                    }
                }

                if (!pickupSelectedEntities && entity.selected && !entity.selectionArea.visible) {
                    entity.selectionArea.visible = true;
                }
            }

            if (entity.handleTick || entity.lastX !== entity.x || entity.lastY !== entity.y || entity.lastRotation !== entity.rotation) {
                entity.lastX = entity.x;
                entity.lastY = entity.y;
                entity.lastRotation = entity.rotation;
                entity.handleTick = false;

                let mid;
                if (entity.bezier) {
                    mid = entity.bezier.mid;
                } else if (points && (entity.building?.trenchConnector || (entity.type === 'shape' && (entity.subtype === 'rectangle' || entity.subtype === 'line')))) {
                    mid = {
                        x: (points[0].x + points[points.length - 1].x) / 2,
                        y: (points[0].y + points[points.length - 1].y) / 2
                    };
                }

                if (mid) {
                    entity.mid = Math.rotateAround(entity, {
                        x: entity.x + mid.x,
                        y: entity.y + mid.y
                    });
                } else {
                    entity.mid = {
                        x: entity.x,
                        y: entity.y
                    };
                }
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

                    if (game.playMode && entity.subtype === 'trainengine' && entity.currentTrack && Math.abs(entity.userThrottle) > 0) {
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

                    if (game.playMode && rate > 0.15) {
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

            if (game.playMode && entity.isTrain && entity.currentTrack && entity.currentTrack.bezier) {
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
                for (let j = 0; j < entity.currentTrack.sockets.length; j++) {
                    const socket = entity.currentTrack.sockets[j];
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
                for (let j = 0; j < entity.currentTrack.sockets.length; j++) {
                    const socket = entity.currentTrack.sockets[j];
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
                if (!pickup) {
                    delete entity.prevPosition;
                    delete entity.prevRotation;
                } else if (!ignoreLock && entity.locked) {
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
                } else {
                    game.statisticsMenuComponent?.refresh();
                }
                pickupSelectedEntities = pickup;
            }
        }
    }

    game.create = function(type, subtype, x, y, z) {
        if (type === 'preset') {
            fetch(subtype).then(response => {
                return response.json();
            }).then(saveObject => {
                try {
                    game.loadSave(saveObject, true);
                } catch (e) {
                    console.error('Failed to load preset:', e);
                }
            }).catch(e => {
                console.info('Failed to load preset. This will typically occur if one doesn\'t exist.');
            });
        } else {
            game.updateConstructionMode(type, subtype);
            let entity = createSelectableEntity(type, subtype, x ?? 0, y ?? 0, z ?? 0);
            game.selectEntity(entity);
            if (type === 'text') {
                game.resetConstructionMode();
                setTimeout(() => {
                    // Unsure what's causing the text to unfocus, so added timeout here so it's forced.
                    game.buildingSelectedMenuComponent?.focusText();
                }, 150);
            }
            game.setPickupEntities(true, true);
            if (entity.hasHandle) {
                entity.shouldSelectLastHandlePoint = true;
            }
            return entity;
        }
        return null;
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
            let upgradeKey = upgrade?.key;
            if (upgradeKey && bData.parent?.key && upgradeKey === entity.building.key) {
                upgradeKey = bData.parent.key;
            }
            let clone = createSelectableEntity('building', upgradeKey ?? entity.building.key, entity.x, entity.y, entity.z, entity.rotation, entity.id);
            if (upgradeKey) {
                let position = { x: clone.x, y: clone.y };
                if (entity.building?.positionOffset) {
                    position.x -= ((entity.building.positionOffset.x ?? 0) / METER_TEXTURE_SCALE) / METER_PIXEL_SCALE;
                    position.y -= ((entity.building.positionOffset.y ?? 0) / METER_TEXTURE_SCALE) / METER_PIXEL_SCALE;
                }
                if (clone.building?.positionOffset) {
                    position.x += ((clone.building.positionOffset.x ?? 0) / METER_TEXTURE_SCALE) / METER_PIXEL_SCALE;
                    position.y += ((clone.building.positionOffset.y ?? 0) / METER_TEXTURE_SCALE) / METER_PIXEL_SCALE;
                }
                position = Math.rotateAround(clone, position);
                clone.position.set(position.x, position.y);
            }
            clone.locked = entity.locked;
            clone.selectionArea.tint = clone.locked ? COLOR_RED : COLOR_WHITE;
            let entityData = {
                upgrading: true
            };
            entity.onSave(entityData);
            clone.onLoad(entityData);
            clone.afterLoad(entityData);
            game.selectEntity(clone);
            if (entity.sockets) {
                for (const entitySocket of entity.sockets) {
                    if (clone.sockets) {
                        let foundSocket = false;
                        for (const cloneSocket of clone.sockets) {
                            if (entitySocket.socketData.id === cloneSocket.socketData.id) {
                                foundSocket = true;
                                break;
                            }
                        }
                        if (foundSocket) {
                            continue;
                        }
                    }
                    entitySocket.removeConnections();
                }
            }
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
        game.buildingSelectedMenuComponent?.refresh(true);
    }

    game.moveSelected = function(x, y, snapped) {
        if (selectedEntities.length) {
            const gridSize = game.settings.gridSize ? game.settings.gridSize : 16;
            if (snapped) {
                x *= gridSize;
                y *= gridSize;
            }
            const selectedEntity = game.getSelectedEntity();
            if (selectedEntity) {
                const eX = selectedEntity.x + x, eY = selectedEntity.y + y;
                selectedEntity.x = snapped ? Math.round(eX / gridSize) * gridSize : eX;
                selectedEntity.y = snapped ? Math.round(eY / gridSize) * gridSize : eY;
                selectedEntity.attemptReconnections();
            } else {
                for (const selectedEntity of selectedEntities) {
                    if (selectedEntity.sockets) {
                        selectedEntity.removeConnections(undefined, true);
                    }
                    selectedEntity.x += x;
                    selectedEntity.y += y;
                }
                for (const selectedEntity of selectedEntities) {
                    selectedEntity.attemptReconnections();
                }
            }
            game.buildingSelectedMenuComponent?.refresh(true);
        }
    }

    // TODO: Add support for rotating multiple entities and add support for flipping trains.
    game.rotateSelected = function(angle) {
        const selectedEntity = game.getSelectedEntity();
        if (selectedEntity) {
            let rotation = Math.angleNormalized(selectedEntity.rotation + angle);
            if (game.settings.enableSnapRotation) {
                rotation = Math.round(rotation / angle) * angle;
            }
            if (selectedEntity.mid.x !== selectedEntity.x || selectedEntity.mid.y !== selectedEntity.y) {
                let rotatedPosition = Math.rotateAround(selectedEntity.mid, selectedEntity, angle);
                selectedEntity.x = rotatedPosition.x;
                selectedEntity.y = rotatedPosition.y;
            }
            selectedEntity.rotation = rotation;
            if (selectedEntity.sockets) {
                selectedEntity.attemptReconnections();
            }
            game.saveStateChanged = true;
        }
    }

    game.removeEntities = function(isLoading) {
        if (entities.length) {
            game.deselectEntities();
            game.setPickupEntities(false);
            for (let i = 0; i < entities.length; i++) {
                let entity = entities[i];
                entity.remove();
            }
            entities = [];
            _entityIds = 0;
            entityMap = {};
            if (!isLoading) {
                game.saveStateChanged = true;
            }
            if (game.statisticsMenuComponent) {
                game.statisticsMenuComponent.refresh();
            }
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

    game.updateSave = function(saveString = JSON.stringify(game.getSaveData())) {
        try {
            if (window.localStorage && saveString) {
                window.localStorage.setItem('save', saveString);
            }
            game.updateHistory(saveString);
        } catch(e) {
            console.error('Failed to update save.');
        }
    };

    game.updateHistory = function(saveString = JSON.stringify(game.getSaveData())) {
        if (game.constructionHistory[game.constructionHistoryPointer] !== saveString) {
            game.constructionHistory.length = game.constructionHistoryPointer + 1;
            game.constructionHistory.push(saveString);
            if (game.constructionHistory.length > game.settings.historySize) {
                game.constructionHistory.shift();
            }
            game.constructionHistoryPointer = game.constructionHistory.length - 1;
        }
    };

    game.clearHistory = function() {
        game.constructionHistoryPointer = 0;
        game.constructionHistory = [JSON.stringify(game.getSaveData())];
    };
    game.clearHistory();

    // TODO: History should be actions, create, modify, remove.
    game.traverseHistory = function(i) {
        const newPointer = Math.min(Math.max(game.constructionHistoryPointer + i, 0), game.constructionHistory.length - 1);
        if (game.constructionHistoryPointer !== newPointer) {
            game.constructionHistoryPointer = newPointer;
            const historyData = game.constructionHistory[game.constructionHistoryPointer];
            if (historyData) {
                game.loadSave(JSON.parse(historyData), false, true);
            } else {
                game.removeEntities();
            }
        }
    };

    game.undo = function() {
        game.traverseHistory(-1);
    };

    game.redo = function() {
        game.traverseHistory(1);
    };

    game.canShowListItem = function(building, search = false) {
        if (building && (!building.hideInList || game.settings.enableDebug) &&
            (!building.experimental || game.settings.enableExperimental) &&
            (search || ((!building.parent || building.parentKey || game.settings.showUpgradesAsBuildings) &&
            ((!building.tier || (!game.settings.showSelectedTierOnly && (building.tier <= game.settings.selectedTier))) || building.tier === game.settings.selectedTier) &&
            ((!building.techId || !window.objectData.tech[building.techId]) || ((building.techId === 'unlockfacilitytier2' && game.settings.selectedTier >= 2) || (building.techId === 'unlockfacilitytier3' && game.settings.selectedTier >= 3))) &&
            (!game.settings.selectedFaction || (!building.faction || building.faction === game.settings.selectedFaction))))) {
            return true;
        }
        return false;
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

        background.width = WIDTH / camera.zoom;
        background.height = HEIGHT / camera.zoom;
        background.scale.set(camera.zoom);
        background.tilePosition.x = -camera.x / camera.zoom;
        background.tilePosition.y = -camera.y / camera.zoom;

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

        if (selectedHandlePoint && !mouseDown[0]) {
            selectedHandlePoint = null;
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
                delete entityMap[entity.id];
                entities.splice(i, 1);
                if (entities.length === 0) {
                    _entityIds = 0;
                    game.saveStateChanged = true;
                }
                i--;
                entity.afterRemove();
            }
        }

        if (game.playMode) {
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
                                            for (let l = 0; l < entity.sockets.length; l++) {
                                                let entitySocket = entity.sockets[l];
                                                if (!Object.keys(entitySocket.connections).length) {
                                                    for (let p = 0; p < entity2.sockets.length; p++) {
                                                        let entity2Socket = entity2.sockets[p];
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

        if (mouseDown[2] && !selectedHandlePoint) {
            if (!selectionRotation) {
                let rotationOffset = null;
                selectedEntities.forEach(selectedEntity => {
                    if (rotationOffset !== false) {
                        if (rotationOffset === null) {
                            rotationOffset = selectedEntity.rotation;
                        } else if (rotationOffset !== selectedEntity.rotation) {
                            rotationOffset = false;
                        }
                    }
                    if (selectedEntity.sockets) {
                        selectedEntity.removeConnections(undefined, true);
                    }
                    selectedEntity.rotationData = {
                        x: selectedEntity.x,
                        y: selectedEntity.y,
                        rotation: selectedEntity.rotation
                    }
                });
                selectionRotation = game.getEntitiesCenter(selectedEntities); // Get center of selection.
                selectionRotation.angle = Math.angleBetween({ x: selectionRotation.x, y: selectionRotation.y }, { x: gmx, y: gmy }); // Angle of mouse from the center of selection.
                selectionRotation.offset = rotationOffset;
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

        // TODO: Check for mouse pickup but for right click instead.
        if (selectionRotation || pickupSelectedEntities) {
            game.buildingSelectedMenuComponent?.refresh(true);
            if (!selectedHandlePoint && (!ignoreMousePickup || (Date.now()-pickupTime > 250 || Math.distanceBetween(pickupPosition, {x: gmx, y: gmy}) > 20))) {
                if (ignoreMousePickup) {
                    if (followEntity) {
                        game.followEntity(null);
                    }
                    for (let i = 0; i < selectedEntities.length; i++) {
                        // Destroying any connections with entities that aren't selected, it might be worth checking if the mouse / selection position has changed before doing so or checking for rotation.
                        const pickupEntity = selectedEntities[i];
                        if (pickupEntity) {
                            if (game.settings.bringSelectedToFront) {
                                pickupEntity.bringToFront();
                            }
                            if (pickupEntity.building) {
                                pickupEntity.removeConnections(undefined, true);
                            }
                        }
                    }
                }
                ignoreMousePickup = false;
                let snappedMX = gmx, snappedMY = gmy;
                if (game.settings.enableGrid || keys[16]) {
                    let gridSize = game.settings.gridSize ? game.settings.gridSize : 16;
                    if (!pickupPosition) {
                        pickupPosition = {
                            x: gmx,
                            y: gmy
                        };
                    }
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
                if (!selectionRotation && selectedEntities.length) {
                    for (let i = 0; i < selectedEntities.length; i++) {
                        let selectedEntity = selectedEntities[i];
                        if (connectionEstablished && connectionEstablished !== true && selectedEntity !== connectionEstablished) {
                            if (!selectedEntity.prevPosition) {
                                selectedEntity.prevPosition = {
                                    x: selectedEntity.x,
                                    y: selectedEntity.y
                                }
                            }
                            if (isNaN(selectedEntity.prevRotation)) {
                                selectedEntity.prevRotation = selectedEntity.rotation;
                            }
                            const offsetX = connectionEstablished.prevPosition.x - connectionEstablished.x;
                            const offsetY = connectionEstablished.prevPosition.y - connectionEstablished.y;
                            const offsetRotation = Math.angleDifference(connectionEstablished.prevRotation, connectionEstablished.rotation);
                            const rotatedPosition = Math.rotateAround(connectionEstablished.prevPosition, selectedEntity.prevPosition, offsetRotation);
                            selectedEntity.position.set(rotatedPosition.x - offsetX, rotatedPosition.y - offsetY);
                            selectedEntity.rotation = selectedEntity.prevRotation + offsetRotation;
                        }
                        if (selectedEntity.building?.canSnap || selectedEntity.isTrain) {
                            for (let j = 0; j < entities.length; j++) {
                                let entity = entities[j];
                                if (!entity.visible || entity === selectedEntity || entity.type !== 'building' || entity.selected || !((selectedEntity.sockets && entity.sockets) || selectedEntity.isTrain) || Math.distanceBetween(selectedEntity, entity.mid) > 1000) {
                                    continue;
                                }
                                if (selectedEntity.subtype === entity.subtype || (selectedEntity.sockets && entity.sockets) || selectedEntity.isTrain) {
                                    const mousePos = entity.toLocal({x: gmx, y: gmy}, app.cstage, undefined, true);
                                    const projection = selectedEntities.length === 1 && entity.bezier?.project(mousePos);
                                    if (!projection || projection.d <= Math.max(entity.building?.lineWidth ?? 0, 25)) {
                                        if (selectedEntity.sockets && entity.sockets && selectedEntity.building?.canSnap && (selectedEntity.building?.canSnapStructureType !== false || selectedEntity.subtype !== entity.subtype)) {
                                            let frontSocket = null, nearestSocket = null, nearestSocketDist = null;
                                            const connectEntitiesBySockets = function(fromSocket, toSocket) {
                                                fromSocket.setConnection(entity.id, toSocket);
                                                if (!connectionEstablished) {
                                                    if (selectedEntity.building?.snapNearest) {
                                                        selectedEntity.removeConnections(fromSocket.socketData.id, true, true);
                                                    }

                                                    if (!selectedEntity.prevPosition) {
                                                        selectedEntity.prevPosition = {
                                                            x: selectedEntity.x,
                                                            y: selectedEntity.y
                                                        }
                                                    }

                                                    if (isNaN(selectedEntity.prevRotation)) {
                                                        selectedEntity.prevRotation = selectedEntity.rotation;
                                                    }
            
                                                    let selectedEntityPosition = app.cstage.toLocal({x: toSocket.x, y: toSocket.y}, entity, undefined, true);
                                                    const selectedEntityRotation = Math.angleNormalized(-Math.angleDifference(entity.rotation + toSocket.rotation + Math.PI, fromSocket.rotation));
                                                    if (fromSocket.x !== 0 || fromSocket.y !== 0) {
                                                        const fromSocketDist = Math.distanceBetween({ x: 0, y: 0 }, fromSocket);
                                                        const socketAngleDiff = Math.angleBetween({ x: 0, y: 0 }, fromSocket) + Math.PI;
                                                        selectedEntityPosition = Math.extendPoint(selectedEntityPosition, fromSocketDist, selectedEntityRotation + socketAngleDiff);
                                                    }

                                                    selectedEntity.position.set(selectedEntityPosition.x, selectedEntityPosition.y);
                                                    selectedEntity.rotation = selectedEntityRotation;

                                                    connectionEstablished = selectedEntity;
                                                    return true;
                                                }
                                            }
                                            for (let k = 0; k < entity.sockets.length; k++) {
                                                let entitySocket = entity.sockets[k];
                                                if (!entitySocket.socketData.temp) {
                                                    let socketDistance = Math.distanceBetween(mousePos, entitySocket);
                                                    // Checks socket distance is close, closer than previous socket distance, or hovering a building with a power socket.
                                                    if (selectedEntity.building?.snapNearest || ((socketDistance < 35 && (nearestSocketDist === null || socketDistance < nearestSocketDist)) || selectedEntity.subtype === 'power_line' && entity.canGrab())) {
                                                        for (let l = 0; l < selectedEntity.sockets.length; l++) {
                                                            let selectedSocket = selectedEntity.sockets[l];
                                                            if (selectedEntities.length === 1 && selectedEntity.building?.hasHandle && selectedSocket.socketData.id !== 0) {
                                                                continue;
                                                            }
                                                            if (entitySocket.canConnect(selectedSocket)) {
                                                                const sSocketConnections = Object.keys(selectedSocket.connections).length;
                                                                const eSocketConnections = Object.keys(entitySocket.connections).length;
                                                                const connectedSocket = sSocketConnections ? entity.getSocketById(selectedSocket.connections[entity.id]) : null;
                                                                if (!sSocketConnections || selectedSocket.connections[entity.id] === entitySocket.socketData.id || connectedSocket?.socketData.temp) {
                                                                    if (!eSocketConnections || (eSocketConnections < (entitySocket.socketData.connectionLimit ?? 1)) || entitySocket.connections[selectedEntity.id] === selectedSocket.socketData.id) {
                                                                        if (selectedEntity.building?.snapNearest || selectedEntities.length > 1) {
                                                                            let selectedSocketPos;
                                                                            if (connectionEstablished) {
                                                                                selectedSocketPos = app.cstage.toLocal({x: selectedSocket.x, y: selectedSocket.y}, selectedEntity, undefined, true);
                                                                            } else {
                                                                                selectedSocketPos = Math.rotateAround({x: 0, y: 0}, selectedSocket, (selectedEntity.prevRotation ?? selectedEntity.rotation));
                                                                                selectedSocketPos.x += gmx - selectedEntity.pickupOffset.x;
                                                                                selectedSocketPos.y += gmy - selectedEntity.pickupOffset.y;
                                                                            }
                                                                            let entitySocketPos = app.cstage.toLocal({x: entitySocket.x, y: entitySocket.y}, entity, undefined, true);
                                                                            if (Math.floor(Math.distanceBetween(selectedSocketPos, entitySocketPos)) >= (!connectionEstablished ? 35 : 3)) {
                                                                                continue;
                                                                            }
                                                                            let selectedSocketRot = Math.angleNormalized((selectedEntity.rotation + selectedSocket.rotation) - Math.PI);
                                                                            let entitySocketRot = Math.angleNormalized(entity.rotation + entitySocket.rotation);
                                                                            if (!Math.anglesWithinRange(entitySocketRot, selectedSocketRot, Math.PI / 8)) {
                                                                                continue;
                                                                            }

                                                                            if (connectEntitiesBySockets(selectedSocket, entitySocket)) {
                                                                                i = -1;
                                                                            }
                                                                            break;
                                                                        }
                                                                        
                                                                        frontSocket = selectedSocket;
                                                                        nearestSocket = entitySocket;
                                                                        nearestSocketDist = socketDistance;
                                                                        
                                                                        break;
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                            if (nearestSocket && connectEntitiesBySockets(frontSocket, nearestSocket)) {
                                                i = -1;
                                            }
                                        }
                                        if (pickupEntity && projection && ((!connectionEstablished && entity.bezier && entity.building?.isBezier && entity.building?.canSnapAlongBezier && selectedEntity.subtype === entity.subtype) || (selectedEntity.isTrain && entity.subtype === selectedEntity.building.vehicle.track))) {
                                            let global = app.cstage.toLocal({x: projection.x, y: projection.y}, entity, undefined, true);
                                            let normal = entity.bezier.normal(projection.t);
                                            let angle = Math.angleBetween({x: 0, y: 0}, normal);
                                            selectedEntity.x = global.x;
                                            selectedEntity.y = global.y;
            
                                            let angleRight = entity.rotation + (angle - Math.PI/2) - Math.PI/2;
                                            let angleLeft = entity.rotation + (angle + Math.PI/2) - Math.PI/2;
                                            let rightDiff = Math.angleNormalized(angleRight - selectedEntity.rotation);
                                            let leftDiff = Math.angleNormalized(angleLeft - selectedEntity.rotation);
            
                                            if (isNaN(selectedEntity.prevRotation)) {
                                                selectedEntity.prevRotation = selectedEntity.rotation;
                                            }
            
                                            if (selectedEntity.isTrain) {
                                                selectedEntity.currentTrack = entity;
                                                selectedEntity.currentTrackT = projection.t;
                                            }
            
                                            if (rightDiff < leftDiff) {
                                                selectedEntity.rotation = angleRight + Math.PI/2;
                                            } else {
                                                selectedEntity.rotation = angleLeft + Math.PI/2;
                                            }
            
                                            if (!connectionEstablished && selectedEntity.sockets && (selectedEntity.subtype === 'rail_large_gauge' || selectedEntity.subtype === 'rail_small_gauge')) {
                                                for (let k = 0; k < selectedEntity.sockets.length; k++) {
                                                    let selectedSocket = selectedEntity.sockets[k];
                                                    if (selectedSocket.socketData.cap === 'front') {
                                                        // TODO: Store this somewhere so we don't have to loop each time for sockets. There will only ever be one front and back socket for rails.
                                                        selectedSocket.createConnection(entity, projection.x, projection.y, angle);
                                                        break;
                                                    }
                                                }
                                            } else {
                                                selectedEntity.removeConnections();
                                            }
            
                                            connectionEstablished = true;
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                if (!connectionEstablished) {
                    for (let i = 0; i < selectedEntities.length; i++) {
                        let selectedEntity = selectedEntities[i];
                        if (!isNaN(selectedEntity.prevRotation)) {
                            if (selectedEntity.sockets) {
                                selectedEntity.removeConnections(undefined, true);
                            }
                            if (selectedEntity.prevPosition) {
                                selectedEntity.x = selectedEntity.prevPosition.x;
                                selectedEntity.y = selectedEntity.prevPosition.y;
                                delete selectedEntity.prevPosition;
                            }
                            selectedEntity.rotation = selectedEntity.prevRotation;
                            delete selectedEntity.prevRotation;
                            if (selectedEntities.length === 1 && selectedEntity.building?.isBezier) {
                                selectedEntity.pickupOffset = {
                                    x: 0,
                                    y: 0
                                };
                            }
                        }
                        if (selectedEntity.building && !selectedEntity.hasHandle && selectedEntity.selectionArea.visible) {
                            selectedEntity.selectionArea.visible = false;
                        }
                        if (selectionRotation) {
                            let rotatedPosition = Math.rotateAround(selectionRotation, selectedEntity.rotationData, rotationAngle);
                            selectedEntity.x = rotatedPosition.x;
                            selectedEntity.y = rotatedPosition.y;
                            selectedEntity.pickupOffset = {
                                x: snappedMX - selectedEntity.x,
                                y: snappedMY - selectedEntity.y
                            };
                            selectedEntity.rotation = Math.angleNormalized(selectedEntity.rotationData.rotation + rotationAngle);
                            if (!isNaN(selectedEntity.prevRotation)) {
                                selectedEntity.prevRotation = selectedEntity.rotation;
                            }
                        } else {
                            selectedEntity.x = snappedMX - selectedEntity.pickupOffset.x;
                            selectedEntity.y = snappedMY - selectedEntity.pickupOffset.y;
                            if (selectedEntities.length === 1 && !selectedEntity.building?.ignoreSnapSettings && (game.settings.enableGrid || keys[16])) {
                                let gridSize = game.settings.gridSize ? game.settings.gridSize : 16;
                                selectedEntity.x = (Math.round(selectedEntity.x / gridSize) * gridSize);
                                selectedEntity.y = (Math.round(selectedEntity.y / gridSize) * gridSize);
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

        if (ENABLE_DEBUG) {
            debugText.text = 'Press F2 to disable debug\n';
            debugText.text += 'Press F8 to spawn 1k buildings\n';
            debugText.text += 'Press F9 to spawn all building types\n';
            debugText.text += `x: ${gmx}, y: ${gmy}\n`;
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

        if (game.settings.enableExperimental && (game.saveStateChanged || pickupSelectedEntities)) {
            for (const entity of entities) {
                if (entity.valid && entity.rangeSprite) {
                    entity.updateRangeMask();
                }
            }
        }

        if (game.saveStateChanged && game.settings.enableHistory && !pickupSelectedEntities && !selectedHandlePoint && !selectionRotation) {
            game.saveStateChanged = false;
            game.updateSave();
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
    Math.rotateAround = function({x: cx, y: cy, rotation: cr}, {x, y}, angle) {
        const cos = Math.cos(angle ?? cr), sin = Math.sin(angle ?? cr);
        return {
            x: cx + (x - cx) * cos - (y - cy) * sin,
            y: cy + (x - cx) * sin + (y - cy) * cos
        };
    };
    Math.isPointWithinBounds = function(point, bounds, distance) {
        let intersects = 0;
        for (let i = 0; i < bounds.length; i++) {
            const a = bounds[i], b = bounds[(i + 1) % bounds.length];
            let pX = point.x, pY = point.y;
            let aX = a.x, aY = a.y;
            let bX = b.x, bY = b.y;

            if (aY > bY) {
                [aX, aY, bX, bY] = [bX, bY, aX, aY];
            }

            if (pY === aY || pY === bY) {
                pY += 0.00001;
            }

            if (pY > bY || pY < aY || pX > Math.max(aX, bX)) {
                continue;
            }

            if (pX < Math.min(aX, bX)) {
                intersects++;
                continue;
            }

            if (((pY - aY) / (pX - aX)) >= ((bY - aY) / (bX - aX))) {
                intersects++;
            }
        }

        if (intersects % 2 === 1) {
            if (!distance) {
                return true;
            }
            
            for (let i = 0; i < bounds.length; i++) {
                const a = bounds[i], b = bounds[(i + 1) % bounds.length];
                const dist = Math.abs((b.x - a.x) * (a.y - point.y) - (a.x - point.x) * (b.y - a.y)) / Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2);
                if (dist < distance) {
                    return true;
                }
            }
        }

        return false;
    };
})();
