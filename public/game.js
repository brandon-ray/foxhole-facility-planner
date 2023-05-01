const SAVE_VERSION = '1.0.2';

const COLOR_WHITE = 0xFFFFFF; // Also resets tint.
const COLOR_DARKGREY = 0x505050;
const COLOR_CHARCOAL = 0x0B0B0B;
const COLOR_BLACK = 0x000000;
const COLOR_ORANGE = 0xFF8F00;
const COLOR_RED = 0xFF0000;
const COLOR_GREEN = 0x00FF00;
const COLOR_LIMEGREEN = 0x72FF5A;
const COLOR_BLUE = 0x0000FF;
const COLOR_BLUEPRINT = 0x335cff;
const COLOR_LIGHTBLUE = 0x00E1FF;
const COLOR_YELLOW = 0xFFFF00;
const COLOR_PURPLE = 0x9900FF;

const COLOR_SELECTION = 0xE16931; // Orange
const COLOR_SELECTION_BORDER = 0xFF8248; // Lighter Orange
const COLOR_RANGE_BORDER = 0xED2323; // Red

const FILTER_BRIGHT = new PIXI.filters.ColorMatrixFilter();
FILTER_BRIGHT.brightness(2.75);

const PROJECT_LAYERS = {
    ranges: {
        preventDecay: {
            name: 'Maintenance',
            alias: 'SUPPLY'
        },
        resourceField: {
            name: 'Resource Field',
            alias: 'HARVEST'
        },
        crane: {
            name: 'Crane',
            alias: 'CRANE',
            color: COLOR_LIGHTBLUE
        },
        killbox: {
            name: 'Rifle',
            alias: 'RIFLE',
            color: COLOR_ORANGE
        },
        killboxMG: {
            name: 'Machine Gun',
            alias: 'MG',
            color: COLOR_BLUE
        },
        killboxAT: {
            name: 'Anti-Tank',
            alias: 'AT',
            color: COLOR_RED
        },
        killboxRocket: {
            name: 'Rocket',
            alias: 'RPG',
            color: COLOR_ORANGE
        },
        killboxArty: {
            name: 'Artillery',
            alias: 'ARTY',
            color: COLOR_YELLOW
        },
        radio: {
            name: 'Radio',
            alias: 'RADIO',
            color: COLOR_PURPLE
        }
    },
    region: {
        base: {
            name: 'Foxhole Map',
            description: 'The default map for Foxhole.',
            alias: 'FOXHOLE',
            disable: 'colors',
            bmm: false
        },
        colors: {
            name: 'Better Map Mod',
            description: 'A variant of the default map for Foxhole with more contrast colors and better detail.',
            alias: 'BMM',
            disable: 'base'
        },
        grid: {
            name: 'Grid',
            description: 'A grid overlay for the map.',
            preventLoad: true
        },
        subRegions: {
            name: 'Labels',
            description: 'A sub-region overlay for the map.',
            preventLoad: true
        },
        icons: {
            name: 'Icons',
            description: 'An icon overlay for the map.',
            preventLoad: true
        },
        shadows: {
            name: 'Shadows',
            description: 'A shadow overlay for the map.',
            alias: 'SHADE'
        },
        topography_values: {
            name: 'Topography',
            description: 'A topography overlay for the map.',
            alias: 'TOPO'
        },
        roads: {
            name: 'Roads',
            description: 'A roads overlay for the map.',
            alias: 'ROAD',
            disable: 'roads_tiers'
        },
        roads_tiers: {
            name: 'Road Tiers',
            description: 'A roads overlay for the map with colored tiers.',
            alias: 'ROAD+',
            disable: 'roads'
        },
        tracks: {
            name: 'Tracks',
            description: 'A tracks overlay for the map.',
            alias: 'RAIL'
        },
        rdz: {
            name: 'Rapid Decay Zone',
            description: 'A rapid decay zone overlay for the map.',
            alias: 'RDZ'
        }
    },
}

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

const TEXTURE_SCALE = 0.5; // Scale for textures to adjust values after the texture has been resized.

const METER_BOARD_PIXEL_SIZE = 32; // Size of a grid square in pixels.
const METER_TEXTURE_PIXEL_SIZE = 52.8; // Size of a meter in pixels from a texture generated with Blender that's resized by 0.5.
const METER_TEXTURE_PIXEL_SCALE = METER_TEXTURE_PIXEL_SIZE / METER_BOARD_PIXEL_SIZE;
const METER_INVERSE_PIXEL_SCALE = METER_BOARD_PIXEL_SIZE / METER_TEXTURE_PIXEL_SIZE; // Scale used for bezier objects.

const REGION_WIDTH = 2177 * METER_BOARD_PIXEL_SIZE;
const REGION_HEIGHT = 1888 * METER_BOARD_PIXEL_SIZE; // 125m x 15.104u

const game = {
    services: {},
    settings: {
        quality: 'auto',
        lazyLoadTextures: true,
        disableSound: false,
        disableHUD: false,
        enableAdvanced: false,
        enableDarkMode: true,
        enableDebug: false,
        enableExperimental: false,
        enableHistory: true,
        historySize: 25,
        enableAutoLoading: true,
        enableGrid: true,
        enableStats: true,
        enableLayers: false,
        enableSelectionStats: true,
        enableRealTimeMap: true,
        statsRequireMultiSelection: false,
        showBuildingDestructionStats: false,
        enableBunkerDryingStats: false,
        gridSize: 16,
        enableSnapRotation: true,
        snapRotationDegrees: 15,
        keySnapRotationDegrees: 45,
        zoomSpeed: 3,
        lockCameraToHex: true,
        selectedFaction: null,
        selectedTier: 3,
        showSelectedTierOnly: true,
        disableLockedMouseEvents: false,
        bringSelectedToFront: true,
        showLineOfSightRanges: true,
        displayFactionTheme: true,
        defaultBuildingCategory: 'all',
        showParentProductionList: true,
        showCollapsibleBuildingList: true,
        showUpgradesAsBuildings: false,
        buildingListFilters: {
            bunkers: true,
            facilities: true,
            vehicles: true
        },
        showFacilityName: true,
        showToolbelt: true,
        showExpandedHubSidebar: true,
        showFooterInfo: false,
        selectedToolbelt: 0,
        toolbelts: {},
        toolbeltMode: 0,
        toolbeltFilters: {
            showUpgradesAsBuildings: false,
            selectedTier: 3,
            showSelectedTierOnly: false
        },
        styles: {
            label: {
                fontSize: 64,
                fontStyle: 'normal',
                fontWeight: 'normal',
                fill: '#ffffff',
                align: 'center'
            },
            rectangle: DEFAULT_SHAPE_STYLE,
            image: Object.assign({}, DEFAULT_SHAPE_STYLE, {
                sendToBackground: false,
                maintainAspectRatio: true
            }),
            circle: Object.assign({}, DEFAULT_SHAPE_STYLE),
            line: Object.assign({}, DEFAULT_SHAPE_STYLE, {
                lineWidth: 14,
                frontArrow: true,
                backArrow: true,
                showDist: false
            })
        },
        volume: 0.2
    },
    project: {
        name: 'Unnamed Project',
        description: '',
        authors: '',
        settings: {
            showWorldRegion: true,
            showProductionIcons: true,
            showRangeWhenSelected: true,
            regionKey: '',
            regionCrop: undefined,
            region: {
                base: false,
                colors: true,
                grid: true,
                subRegions: true,
                icons: true,
                shadows: false,
                topography_values: true,
                roads: true,
                roads_tiers: false,
                tracks: true,
                rdz: true
            },
            ranges: {
                crane: false,
                radio: false,
                resourceField: false,
                preventDecay: false,
                killbox: false,
                killboxMG: false,
                killboxAT: false,
                killboxRocket: false,
                killboxArty: false
            }
        }
    },
    isPlayScreen: false,
    playMode: false
};

game.defaultSettings = JSON.parse(JSON.stringify(game.settings));
game.defaultProject = JSON.parse(JSON.stringify(game.project));

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

const draggableTypes = {
    'default': DraggableContainer,
    'text': DraggableText,
    'shape': DraggableShape
};

game.addDraggableType = function(type, classObj) {
    if (!draggableTypes[type]) {
        draggableTypes[type] = classObj;
    }
    return false;
}

try {
    if (window.localStorage) {
        let newSettings = window.localStorage.getItem('settings');
        if (newSettings) {
            newSettings = JSON.parse(newSettings);
            if (newSettings.toolbelts && Array.isArray(newSettings.toolbelts)) {
                let oldToolbelt = newSettings.toolbelts[0];
                let newToolbelt = {};
                for (let i = 0; i < oldToolbelt.length; i++) {
                    if (oldToolbelt[i]?.type) {
                        newToolbelt[i] = oldToolbelt[i];
                    }
                }
                newSettings.toolbelts = {
                    0: newToolbelt
                };
            }
            game.settings = Object.assign({}, game.settings, newSettings);
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
    let followEntity = null;
    let pickupSelectedEntities = false;
    let rotateSelectedEntities = false;
    let pickupTime = null;
    let pickupPosition = null;
    let ignoreMousePickup = true;
    let effects = [];

    game.selectedHandlePoint = null;
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
            key: 'crop-region',
            title: 'Region Crop Tool',
            cursor: 'crosshair',
            menuButton: false
        },
        {
            key: 'select',
            title: 'Selection Tool',
            icon: 'fa-mouse-pointer'
        }
    ];

    game.constructionLayers = {
        background: 0,
        road: 1000,
        trench: 2500,
        foundation: 5000,
        rail: 15000,
        resource: 17500,
        pipe: 20000,
        building: 50000,
        upgrade: 75000,
        upgrade2: 100000,
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

    game.getGlobalMousePosition = () => {
        return {
            x: gmx,
            y: gmy
        }
    }

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
            game.appComponent?.refresh();
        }
    }

    game.setDarkMode = function(darkMode) {
        game.settings.enableDarkMode = darkMode;
        background.texture = game.resources[game.settings.enableDarkMode ? 'background_dark' : 'background'].texture;
        game.updateSettings();
    }

    game.setConstructionMode = function(mode) {
        if (typeof mode === 'string') {
            mode = game.constructionModes.find(m => m.key === mode);
        }
        mode = mode ?? game.constructionModes[game.constructionModes.length - 1];
        if (game.constructionMode !== mode) {
            game.constructionMode = mode;
            app.view.style.cursor = mode.cursor ? `url(/assets/${mode.cursor}.webp) 16 16, auto` : 'unset';
            game.constructionMenuComponent?.refresh();
            game.boardUIComponent?.refresh();
            game.appComponent?.refresh();
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

    const MAP_ICONS = {
        8: {
            name: 'Forward Base',
            icon: 'MapIconForwardBase1'
        },
        11: {
            name: 'Hospital',
            icon: 'MapIconHospital'
        },
        12: {
            name: 'Vehicle Factory',
            icon: 'MapIconVehicle'
        },
        17: {
            name: 'Refinery',
            icon: 'MapIconManufacturing'
        },
        18: {
            name: 'Shipyard',
            icon: 'Shipyard'
        },
        19: {
            name: 'Tech Center',
            icon: 'MapIconTechCenter'
        },
        20: {
            name: 'Salvage Field',
            icon: 'SalvageMapIcon'
        },
        21: {
            name: 'Component Field',
            icon: 'MapIconComponents'
        },
        22: {
            name: 'Fuel Field',
            icon: 'MapIconFuel'
        },
        23: {
            name: 'Sulfur Field',
            icon: 'MapIconSulfur'
        },
        27: {
            name: 'Keep',
            icon: 'MapIconsKeep'
        },
        28: {
            name: 'Observation Tower',
            icon: 'MapIconObservationTower'
        },
        29: {
            name: 'Fort',
            icon: 'MapIconFort'
        },
        30: {
            name: 'Troop Ship',
            icon: 'MapIconTroopShip'
        },
        32: {
            name: 'Sulfur Mine',
            icon: 'MapIconSulfurMine'
        },
        33: {
            name: 'Storage Facility',
            icon: 'MapIconStorageFacility'
        },
        34: {
            name: 'Factory',
            icon: 'MapIconFactory'
        },
        35: {
            name: 'Safe House',
            icon: 'MapIconSafehouse'
        },
        37: {
            name: 'Rocket Site',
            icon: 'MapIconRocketFacility'
        },
        38: {
            name: 'Salvage Mine',
            icon: 'MapIconScrapMine'
        },
        39: {
            name: 'Construction Yard',
            icon: 'MapIconConstructionYard'
        },
        40: {
            name: 'Component Mine',
            icon: 'MapIconComponentMine'
        },
        45: {
            name: 'Relic Base',
            icon: 'MapIconRelicBase'
        },
        46: {
            name: 'Relic Base',
            icon: 'MapIconRelicBase'
        },
        47: {
            name: 'Relic Base',
            icon: 'MapIconRelicBase'
        },
        51: {
            name: 'Mass Production Factory',
            icon: 'MapIconMassProductionFactory'
        },
        52: {
            name: 'Seaport',
            icon: 'MapIconSeaport'
        },
        53: {
            name: 'Coastal Gun',
            icon: 'MapIconCoastalGun'
        },
        56: {
            name: 'Town Base',
            icon: 'MapIconTownBaseTier1'
        },
        57: {
            name: 'Town Base',
            icon: 'MapIconTownBaseTier1'
        },
        58: {
            name: 'Town Base',
            icon: 'MapIconTownBaseTier1'
        },
        59: {
            name: 'Storm Cannon',
            icon: 'MapIconStormcannon'
        },
        60: {
            name: 'Intel Center',
            icon: 'MapIconIntelcenter'
        },
        61: {
            name: 'Coal Field',
            icon: 'MapIconCoal'
        },
        62: {
            name: 'Oil Field',
            icon: 'MapIconFuel'
        }
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
            if (unionEntity.sockets) {
                for (const entitySocket of unionEntity.sockets) {
                    for (const entityId of Object.keys(entitySocket.connections)) {
                        const connectedEntity = game.getEntityById(entityId);
                        if (connectedEntity?.building?.canUnion) {
                            unionEntity.setUnion(connectedEntity);
                        }
                    }
                }
            }
        }
    };

    let apiSocket;
    const cachedMaps = {}; // { mapKey: { mapData } }

    // TODO: When switching maps, clear all icons.

    game.getMapData = function(key) {
        key = key.toLowerCase();
        const mapData = cachedMaps[key];
        if (mapData) {
            return mapData;
        }
        try {
            if (window.localStorage) {
                const cachedMap = JSON.parse(window.localStorage.getItem(`map`));
                if (cachedMap && cachedMap.key === key) {
                    return cachedMap;
                }
            }
        } catch (e) {
            console.error('Failed to get map data.');
        }
        return mapData;
    }

    game.updateMapData = function(key = game.project.settings.regionKey, mapData) {
        key = key.toLowerCase();
        if (!mapData) {
            mapData = game.getMapData(key);
        } else {
            if (!cachedMaps[key]) {
                cachedMaps[key] = {};
            }
            mapData.key = key;
            Object.assign(cachedMaps[key], mapData);
            try {
                if (window.localStorage) {
                    window.localStorage.setItem(`map`, JSON.stringify(cachedMaps[key]));
                }
            } catch (e) {
                console.error('Failed to update map data.');
            }
        }
        if (mapData) {
            // TODO: Instead of removing all children, see which ones have updated and only update those.
            if (mapData.icons) {
                mapLayer.icons.removeChildren();
                if (game.project.settings.region.icons && mapData.icons && mapData.icons.items) {
                    for (const obj of mapData.icons.items) {
                        if (MAP_ICONS[obj.iconType]) {
                            const sprite = new PIXI.Sprite(game.resources[MAP_ICONS[obj.iconType].icon].texture);
                            sprite.position.set(obj.x * REGION_WIDTH, obj.y * REGION_HEIGHT);
                            sprite.anchor.set(0.5);
                            const realtime = game.settings.enableRealTimeMap;
                            if (realtime && obj.teamId === "COLONIALS") {
                                sprite.tint = 0x516C4B;
                            } else if (realtime && obj.teamId === "WARDENS") {
                                sprite.tint = 0x245682;
                            } else if (MAP_ICONS[obj.iconType].color) {
                                sprite.tint = MAP_ICONS[obj.iconType].color;
                            }
                            // sprite.interactive = true;
                            // sprite.on('mouseover', () => {
                            //     mapLayer.hoverLabel.text = MAP_ICONS[obj.iconType].name;
                            //     mapLayer.hoverLabel.visible = true;
                            // });
                            // sprite.on('mouseout', () => {
                            //     mapLayer.hoverLabel.visible = false;
                            // });
                            mapLayer.icons.addChild(sprite);
                        } else {
                            console.error(`Unknown map icon type ${obj.iconType}`);
                        }
                    }
                    mapLayer.icons.sortChildren();
                }
            }

            if (mapData.labels) {
                const majorRegions = [];

                mapLayer.subRegionNames.removeChildren();
                mapLayer.subRegions.removeChildren();
                if (game.project.settings.region.subRegions && mapData.labels && mapData.labels.items) {
                    for (const mapLabel of mapData.labels.items) {
                        const regionPos = { x: mapLabel.x * REGION_WIDTH, y: mapLabel.y * REGION_HEIGHT };
                        const label = new PIXI.Text(mapLabel.text, Object.assign({}, game.defaultSettings.styles.label, {
                            fontFamily: 'Jost',
                            fontSize: mapLabel.mapMarkerType === 'Major' ? 36 : 26,
                            stroke: 0x505050,
                            strokeThickness: 4
                        }));
                        label.anchor.set(0.5);
                        label.position.set(regionPos.x, regionPos.y);
                        label.labelType = mapLabel.mapMarkerType;
                        mapLayer.subRegionNames.addChild(label);
                        if (mapLabel.mapMarkerType === 'Major') {
                            majorRegions.push(regionPos);
                        }
                    }

                    if (majorRegions.length) {
                        const voronoi = new Voronoi();
                        const diagram = voronoi.compute(majorRegions, { xl: 0, xr: REGION_WIDTH, yt: 0, yb: REGION_HEIGHT });
                        const graphics = new PIXI.Graphics();
                        graphics.lineStyle(100, 0x000000);
                        for (let edge of diagram.edges) {
                            if (edge.va && edge.vb) {
                                graphics.moveTo(edge.va.x, edge.va.y);
                                graphics.lineTo(edge.vb.x, edge.vb.y);
                            }
                        }
                        mapLayer.subRegions.addChild(graphics);
                    }
    
                    const polyhex = [
                        0, REGION_HEIGHT / 2,
                        REGION_WIDTH / 4, 0,
                        REGION_WIDTH * 3 / 4, 0,
                        REGION_WIDTH, REGION_HEIGHT / 2,
                        REGION_WIDTH * 3 / 4, REGION_HEIGHT,
                        REGION_WIDTH / 4, REGION_HEIGHT
                    ];
    
                    const hexlines = new PIXI.Graphics();
                    hexlines.lineStyle(200, 0x000000);
                    hexlines.drawPolygon(polyhex);
                    mapLayer.subRegions.addChild(hexlines);
    
                    const hexfill = new PIXI.Graphics();
                    hexfill.beginFill(0x000000);
                    hexfill.drawPolygon(polyhex);
                    hexfill.endFill();
                    mapLayer.subRegions.addChild(hexfill);
                    mapLayer.subRegions.mask = hexfill;
                }
            }

            lastMapScale = null;
        }
    };

    let lastMapScale;
    game.updateMapIcons = function() {
        const scale = Math.min(1 / app.cstage.scale.x, 35);
        if (game.project.settings.regionKey && game.project.settings.showWorldRegion) {
            // if (mapLayer.icons.visible && mapLayer.hoverLabel?.visible) {
            //     mapLayer.hoverLabel.scale.set(lastMapScale);
            //     mapLayer.hoverLabel.position.set(gmx - (GRID_WIDTH / 2), gmy - (GRID_HEIGHT / 2));
            // }
            if (lastMapScale !== scale) {
                lastMapScale = scale;
                if (mapLayer.grid) {
                    mapLayer.grid.children.forEach((child) => {
                        if (child instanceof PIXI.Text) {
                            child.scale.set(lastMapScale);
                        }
                    });
                }
                if (mapLayer.icons.visible) {
                    const iconScale = lastMapScale * 0.8;
                    mapLayer.icons.children.forEach((icon) => {
                        icon.scale.set(iconScale);
                    });
                }
                if (mapLayer.subRegionNames.visible) {
                    mapLayer.subRegionNames.children.forEach((label) => {
                        if (label.labelType === 'Minor') {
                            label.alpha = scale < 20 ? 1 : 1 - (scale - 20) / 15;
                        }
                        label.scale.set(lastMapScale);
                    });
                }
            }
        }
    };

    function updateMapLayer(key, file) {
        if (file) {
            if (mapLayer[key]) {
                mapLayer[key].texture = game.resources[file].texture;
            } else if (game.resources[file]) {
                const mapSpriteLayer = new PIXI.Sprite(game.resources[file].texture);
                mapSpriteLayer.visible = game.project.settings.region[key];
                mapSpriteLayer.anchor.set(0.5);
                mapSpriteLayer.width = REGION_WIDTH;
                mapSpriteLayer.height = REGION_HEIGHT;
                mapSpriteLayer.zIndex = Object.keys(PROJECT_LAYERS.region).indexOf(key);
                mapLayer.addChild(mapSpriteLayer);
                mapLayer.sortChildren();
                mapLayer[key] = mapSpriteLayer;
            }
        }
        if (mapLayer[key]) {
            mapLayer[key].visible = game.project.settings.region[key];
            if (key === 'subRegions') {
                mapLayer.subRegionNames.visible = mapLayer[key].visible;
            }
        }
    }

    // Client should only send a request if subregions and subregion names are enabled or disabled. Not if either is enabled or disabled.
    let lastRegionKey;
    let lastRegionSettings = {};
    function updateOrRequestMapData(regionKey, regionSettings) {
        if (apiSocket && (lastRegionKey !== regionKey || lastRegionSettings.subRegions !== regionSettings.subRegions || lastRegionSettings.icons !== regionSettings.icons)) {
            lastRegionKey = regionKey;
            Object.assign(lastRegionSettings, regionSettings);
            const mapKey = gameData.maps[lastRegionKey].textureKey.substring(3);
            const mapData = game.getMapData(mapKey);
            const activeLayers = {};
            if (regionSettings.icons) {
                activeLayers.icons = mapData?.icons?.version ?? true;
            }
            if (regionSettings.subRegions) {
                activeLayers.labels = mapData?.labels?.version ?? true;
            }
            apiSocket.emit('request-map', mapKey, mapData?.warId, activeLayers, game.settings.enableRealTimeMap);
        }
        game.updateMapData(regionKey);
    }

    game.updateEntityOverlays = function() {
        const regionKey = game.project.settings.regionKey;
        const regionSettings = game.project.settings.region;
        mapLayer.visible = regionKey && game.project.settings.showWorldRegion;
        if (mapLayer.visible) {
            if (gameData.maps[regionKey] && (regionSettings.subRegions || regionSettings.icons)) {
                if (!apiSocket) {
                    apiSocket = io('https://api.foxholeplanner.com', {
                        reconnectionAttempts: 20,
                        reconnectionDelayMax: 60000,
                        randomizationFactor: 0.5,
                        backoffStrategy: function(attempt) {
                            return Math.pow(2, attempt) * 1000;
                        }
                    });
                    apiSocket.on('update-map', (data) => game.updateMapData(regionKey, data));
                    apiSocket.on('connect', () => {
                        console.log('Connected to API server.');
                        updateOrRequestMapData(regionKey, regionSettings);
                    });
                }
                if (lastRegionKey) {
                    updateOrRequestMapData(regionKey, regionSettings);
                }
            }
            game.updateRegionCrop();

            // This handles all map image layers.
            const regionLayers = {};
            const loader = new PIXI.Loader();
            const textureKey = gameData.maps[regionKey].textureKey;
            for (const [key, info] of Object.entries(PROJECT_LAYERS.region)) {
                if (!info.preventLoad && regionSettings[key]) {
                    let layerPath = game_asset_dir + 'game/Textures/UI/';
                    if (info.bmm === false) {
                        layerPath += `HexMaps/Processed/${textureKey}.png`;
                    } else {
                        layerPath += `BMM/${textureKey}_${key}.png`;
                    }
                    if (!(game.resources[layerPath]?.texture ?? PIXI.utils.TextureCache[layerPath])) {
                        regionLayers[key] = layerPath;
                        loader.add(layerPath);
                    } else {
                        updateMapLayer(key, layerPath);
                    }
                } else {
                    updateMapLayer(key);
                }
            }
            loader.load((loader, res) => {
                for (const [key, file] of Object.entries(regionLayers)) {
                    if (res[file]) {
                        game.resources[file] = res[file];
                        res[file].texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
                        updateMapLayer(key, file);
                    }
                }
            });
            loader.onError.add((error, resource) => {
                console.error('Failed to load region image:', error.message);
            });
            mapLayer.gridbg.visible = regionSettings.grid;
        } else if (apiSocket) {
            apiSocket.close();
            apiSocket = null;
        }
        for (const entity of entities) {
            entity.updateOverlays();
        }
    };

    game.updateSelected = function(rotation, attemptReconnections, removeConnections = true) {
        if (selectedEntities.length && (rotation || typeof game.selectionData.rotationDegrees === 'number')) {
            game.selectionData.rotation = Math.angleNormalized(rotation !== undefined ? rotation : (Math.deg2rad(game.selectionData.rotationDegrees) - game.selectionData.origin.rotationOffset));
            if (rotation) {
                game.resetSelectionData(true);
            }
            const rotationAngle = Math.angleNormalized(game.selectionData.rotation - game.selectionData.origin.rotation);
            for (const entity of selectedEntities) {
                if (entity.selectionData) {
                    const rotatedPosition = Math.rotateAround(game.selectionData, {
                        x: game.selectionData.x + entity.selectionData.x,
                        y: game.selectionData.y + entity.selectionData.y
                    }, rotationAngle);
                    entity.x = rotatedPosition.x;
                    entity.y = rotatedPosition.y;
                    entity.rotation = Math.angleNormalized(entity.selectionData.rotation + rotationAngle);
                    if (removeConnections && entity.sockets && (!rotation || !entity.building?.emplaced)) {
                        entity.removeConnections(undefined, true);
                    }
                    if (pickupSelectedEntities) {
                        entity.pickupOffset = {
                            x: snappedMX - entity.x,
                            y: snappedMY - entity.y
                        };
                        delete entity.prevPosition;
                        delete entity.prevRotation;
                    }
                }
            }
            if (attemptReconnections) {
                for (const entity of selectedEntities) {
                    if (entity.sockets) {
                        entity.attemptReconnections(removeConnections);
                    }
                }
            }
            game.saveStateChanged = true;
        }
    };

    game.resetSelectionData = function(keepPreviousData = false, preserveRotation = false) {
        if (selectedEntities.length) {
            const centerPos = game.getSelectedEntitiesCenter();
            const selectionData = Object.assign({}, keepPreviousData ? game.selectionData : undefined, {
                x: centerPos.x.round(3),
                y: centerPos.y.round(3)
            });
            let rotation = null;
            if (!keepPreviousData) {
                for (const selectedEntity of selectedEntities) {
                    if (rotation !== false) {
                        if (rotation === null) {
                            rotation = selectedEntity.rotation;
                        } else if (rotation !== selectedEntity.rotation) {
                            rotation = false;
                        }
                    }
                    selectedEntity.selectionData = {
                        x: selectedEntity.x - centerPos.x,
                        y: selectedEntity.y - centerPos.y,
                        rotation: selectedEntity.rotation
                    };
                }
                selectionData.rotation = rotation || 0;
                selectionData.origin = Object.assign({}, selectionData);
                selectionData.origin.rotationOffset = (rotation === false && preserveRotation) ? ((game.selectionData?.origin?.rotationOffset ?? 0) + (game.selectionData?.rotation ?? 0)) : 0;
            }
            selectionData.rotationDegrees = Math.rad2deg(Math.angleNormalized(rotation || (selectionData.rotation + selectionData.origin.rotationOffset))).round(3);
            game.selectionData = selectionData;
        }
        game.updateSelectedBuildingMenu();
    };

    game.downloadSettings = function() {
        const settingsString = JSON.stringify({
            settings: game.settings,
        });
        download(settingsString, 'foxhole_planner_settings', 'application/json');
    };

    game.updateSettings = function(refreshAll = false) {
        try {
            if (window.localStorage) {
                let settingsString = JSON.stringify(game.settings);
                window.localStorage.setItem('settings', settingsString);
            }
        } catch(e) {
            console.error('Failed to update settings.');
        }

        game.reloadSettings();
        game.appComponent?.refresh();
        if (refreshAll) {
            game.buildingSelectedMenuComponent?.refresh();
            game.boardUIComponent?.refresh();
            game.constructionMenuComponent?.refresh();
            game.sidebarMenuComponent?.$forceUpdate();
            game.toolbeltComponent?.refresh();
            game.toolbeltComponent?.showList(false);
            game.loadSaveMenuComponent?.refresh();
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

        updateBuildingDB();
    };

    game.confirmResetSettings = function() {
        game.confirmationPopup.showPopup('reset-settings', confirmed => {
            if (confirmed) {
                Object.assign(game.settings, JSON.parse(JSON.stringify(game.defaultSettings)));
                game.updateSettings(true);
            }
        });
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

    game.soundPlay = function(sound, entity, volume, fadein) {
        let tso = {
            id: -1,
            entity: entity,
            volume: volume,
        };

        let ttso = game.soundUpdate(tso);
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

            so = game.soundUpdate(so);
            return so;
        }

        return null;
    }

    app.view.tabIndex = 0;

    let keys = {};
    document.addEventListener('keydown', function (event) {
        event = event || window.event;
        let key = event.keyCode;
        let inputSelected = document.activeElement && (document.activeElement.type === 'text' || document.activeElement.type === 'number' || document.activeElement.type === 'textarea');
        if (game.toolbeltComponent && (!event.shiftKey || !inputSelected)) {
            game.toolbeltComponent.setToolbeltSwapping(event.shiftKey);
        }
        switch (key) {
            case 27: // Escape
                if (game.toolbeltComponent) {
                    game.toolbeltComponent.showList(false);
                }
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
                        let x = 0, y = 0;
                        const buildings = Object.values(window.objectData.buildings);
                        for (let i=0; i<1000; i++) {
                            let buildingData = buildings[Math.floor(Math.random() * buildings.length)];
                            if ((game.settings.enableExperimental || !window.objectData.categories[buildingData.category].experimental) && (game.settings.enableDebug || (!buildingData.hideInList && (!buildingData.parent || !buildingData.parent.hideInList)))) {
                                game.createObject(buildingData, x, y, 0, 0, undefined, false);
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
                            if (game.canShowListCategory(category, true)) {
                                for (let i = 0; i < category.buildings.length; i++) {
                                    const building = category.buildings[i];
                                    if (!building.preset && (game.settings.enableDebug || (!building.hideInList && (!building.parent || !building.parent.hideInList)))) {
                                        game.createObject(building, x * 600, y * 600, 0, 0, undefined, false);
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
        if (!inputSelected) {
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
                        game.resetSelectionData();
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
                let angle;
                let snapRotationDegrees;
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
                    case 48: // 0
                        game.activateToolbeltSlot(9, event.shiftKey);
                        break;
                    case 49: // 1
                        game.activateToolbeltSlot(0, event.shiftKey);
                        break;
                    case 50: // 2
                        game.activateToolbeltSlot(1, event.shiftKey);
                        break;
                    case 51: // 3
                        game.activateToolbeltSlot(2, event.shiftKey);
                        break;
                    case 52: // 4
                        game.activateToolbeltSlot(3, event.shiftKey);
                        break;
                    case 53: // 5
                        game.activateToolbeltSlot(4, event.shiftKey);
                        break;
                    case 54: // 6
                        game.activateToolbeltSlot(5, event.shiftKey);
                        break;
                    case 55: // 7
                        game.activateToolbeltSlot(6, event.shiftKey);
                        break;
                    case 56: // 8
                        game.activateToolbeltSlot(7, event.shiftKey);
                        break;
                    case 57: // 9
                        game.activateToolbeltSlot(8, event.shiftKey);
                        break;
                    case 65: // A
                        game.moveSelected(event.shiftKey ? -16 : -32, 0);
                        break;
                    case 66: // B
                        game.blueprintSelected();
                        break;
                    case 68: // D
                        game.moveSelected(event.shiftKey ? 16 : 32, 0);
                        break;
                    case 69: // E
                        snapRotationDegrees = game.settings.keySnapRotationDegrees * (event.shiftKey ? 2 : 1);
                        if (game.settings.enableSnapRotation) {
                            angle = (snapRotationDegrees * Math.PI) / 180;
                        } else {
                            angle = Math.PI / (event.shiftKey ? 2 : 4);
                        }
                        game.rotateSelected(angle);
                        break;
                    case 70: // F
                        game.mirrorSelected(event.shiftKey);
                        break;
                    case 76: // L
                        game.lockSelected();
                        break;
                    case 77: // M
                        game.hubPopup?.toggleTab('map');
                        break;
                    case 80: // P
                        game.project.settings.showProductionIcons = !game.project.settings.showProductionIcons;
                        game.updateEntityOverlays();
                        break;
                    case 81: // Q
                        snapRotationDegrees = game.settings.keySnapRotationDegrees * (event.shiftKey ? 2 : 1);
                        if (game.settings.enableSnapRotation) {
                            angle = -(snapRotationDegrees * Math.PI) / 180;
                        } else {
                            angle = -Math.PI / (event.shiftKey ? 2 : 4);
                        }
                        game.rotateSelected(angle);
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

    game.isKeyDown = function(key) {
        return keys[key];
    }

    game.setMouseDown = function(button) {
        forceMouseDown[button] = true;
    }

    game.isMouseDown = function(button) {
        return mouseDown[button];
    }

    game.isMovingSelected = function() {
        return (pickupSelectedEntities && !ignoreMousePickup) || rotateSelectedEntities;
    }

    game.activateToolbeltSlot = function(index, swapBelt = false) {
        if (game.toolbeltComponent) {
            game.toolbeltComponent.activateToolbeltSlot(index, swapBelt);
        }
    }

    document.addEventListener('keyup', function (event) {
        event = event || window.event;
        let key = event.keyCode;

        if (game.toolbeltComponent) {
            game.toolbeltComponent.setToolbeltSwapping(event.shiftKey);
        }

        if (keys[key]) {
            keys[key] = false;
        }
    });

    function loadAssets() {
        PIXI.Loader.shared.add('Jost', 'assets/fonts/jost-webfont.ttf');

        for (let key in asset_list) {
            PIXI.Loader.shared.add(key, 'assets/' + asset_list[key]);
        }

        for (const icon of Object.values(MAP_ICONS)) {
            icon.icon = assetDir(`../UI/MapIcons/${icon.icon}.webp`);
            if (!PIXI.Loader.shared.resources[icon.icon]) {
                PIXI.Loader.shared.add(icon.icon, icon.icon);
            }
        }

        for (let key in game_asset_required) {
            PIXI.Loader.shared.add(key, game_asset_required[key]);
        }

        if (!game.settings.lazyLoadTextures) {
            for (let key in game_asset_list) {
                PIXI.Loader.shared.add(key, game_asset_list[key]);
            }
        }

        loadSounds();

        PIXI.Loader.shared.load();
    }

    let background = null;
    let mapLayer = null;
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
        
        game?.boardUIComponent?.refresh();
    }
    window.addEventListener('resize', onWindowResize);

    let ambientLight;
    let diffuseGroupLayer;
    let normalGroupLayer;
    let lightGroupLayer;
    PIXI.Loader.shared.onComplete.once(function (loader, res) {
        game.resources = res;
        console.info('Asset loading completed.');

        background = new PIXI.TilingSprite(game.resources[game.settings.enableDarkMode ? 'background_dark' : 'background'].texture);
        app.stage.addChild(background);

        app.cstage = new PIXI.Container();
        app.stage.addChild(app.cstage);
        app.stage.filterArea = app.renderer.screen;

        mapLayer = new PIXI.Container();
        mapLayer.width = REGION_WIDTH;
        mapLayer.height = REGION_HEIGHT;
        mapLayer.x = GRID_WIDTH/2;
        mapLayer.y = GRID_HEIGHT/2;
        mapLayer.getZIndex = () => {
            return 1;
        };
        app.cstage.addChild(mapLayer);

        mapLayer.icons = new PIXI.Container();
        mapLayer.icons.x = -REGION_WIDTH / 2;
        mapLayer.icons.y = -REGION_HEIGHT / 2;
        mapLayer.icons.zIndex = 110;
        mapLayer.addChild(mapLayer.icons);

        // TODO: Cropping apparently breaks this. Removed for now.
        // mapLayer.hoverLabel = new PIXI.Text('', Object.assign({}, game.defaultSettings.styles.label, DEFAULT_TEXT_STYLE, { fontSize: 30 }));
        // mapLayer.hoverLabel.visible = false;
        // mapLayer.hoverLabel.zIndex = 1000;
        // mapLayer.addChild(mapLayer.hoverLabel);

        const cellSize = 124.55 * METER_BOARD_PIXEL_SIZE;
        mapLayer.grid = new PIXI.Container();
        mapLayer.grid.x = -REGION_WIDTH / 2;
        mapLayer.grid.y = -REGION_HEIGHT / 2;
        mapLayer.grid.zIndex = 100;
        for (let i = 0; i <= 17; i++) {
            const line = new PIXI.Graphics();
            line.alpha = 0.1;
            line.lineStyle(64, 0x000000);
            line.moveTo(i * cellSize, 0).lineTo(i * cellSize, REGION_HEIGHT);
            mapLayer.grid.addChild(line);
            if (i > 0) {
                const letterLabel = new PIXI.Text(String.fromCharCode(64 + i), {
                    fill: 0xFFFFFF,
                    fontSize: 28,
                    fontFamily: 'Jost'
                });
                letterLabel.anchor.set(0.5, 1);
                letterLabel.position.set(i * cellSize - cellSize / 2, -500);
                mapLayer.grid.addChild(letterLabel);
            }
        }
        for (let i = 0; i <= 15; i++) {
            const line = new PIXI.Graphics();
            line.alpha = 0.1;
            line.lineStyle(64, 0x000000);
            line.moveTo(0, i * cellSize).lineTo(REGION_WIDTH, i * cellSize);
            mapLayer.grid.addChild(line);
            if (i < 15) {
                const numberLabel = new PIXI.Text(i + 1, {
                    fill: 0xFFFFFF,
                    fontSize: 28,
                    fontFamily: 'Jost'
                });
                numberLabel.anchor.set(1, 0.5);
                numberLabel.position.set(-700, i * cellSize + cellSize / 2);
                mapLayer.grid.addChild(numberLabel);
            }
        }
        mapLayer.addChild(mapLayer.grid);

        mapLayer.subRegions = new PIXI.Container();
        mapLayer.subRegions.alpha = 0.15;
        mapLayer.subRegions.x = -REGION_WIDTH / 2;
        mapLayer.subRegions.y = -REGION_HEIGHT / 2;
        mapLayer.subRegions.zIndex = 80;
        mapLayer.addChild(mapLayer.subRegions);

        mapLayer.subRegionNames = new PIXI.Container();
        mapLayer.subRegionNames.x = -REGION_WIDTH / 2;
        mapLayer.subRegionNames.y = -REGION_HEIGHT / 2;
        mapLayer.subRegionNames.zIndex = 120;
        mapLayer.addChild(mapLayer.subRegionNames);

        mapLayer.gridbg = new PIXI.Graphics();
        mapLayer.gridbg.alpha = 0.075;
        mapLayer.gridbg.beginFill(0xFFFFFF);
        mapLayer.gridbg.drawRect(-REGION_WIDTH / 2, -REGION_HEIGHT / 2, REGION_WIDTH, REGION_HEIGHT);
        mapLayer.gridbg.endFill();
        mapLayer.gridbg.zIndex = -1;
        mapLayer.addChild(mapLayer.gridbg);

        mapLayer.cropMask = new PIXI.Graphics();
        mapLayer.addChild(mapLayer.cropMask);

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
        updateBuildingDB();
        
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

    function getListenerPos() {
        let zoomRatio = WIDTH/(WIDTH*camera.zoom);
        return {
            x: (camera.x + WIDTH/2) * zoomRatio,
            y: (camera.y + HEIGHT/2) * zoomRatio,
            z: camera.z
        };
    }
    
    game.soundUpdate = function(so) {
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
            game.soundStop(so);
            return null;
        }
        /*
        if (dist >= 1200 || so.entity.z !== listener_pos.z) {
            game.soundStop(so);
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
                //game.soundStop(so);
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

    game.soundStop = function(so) {
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
            version: SAVE_VERSION,
            name: (game.project.name !== 'Unnamed Project' && game.project.name) || undefined,
            description: game.project.description || undefined,
            authors: game.project.authors || undefined,
            faction: game.settings.selectedFaction || undefined,
            projectSettings: game.project.settings,
            entities: []
        };
        let saveEntities = isSelection ? selectedEntities : entities;
        for (let i = 0; i < saveEntities.length; i++) {
            let entity = saveEntities[i];
            if (entity.valid) {
                let objData = {
                    id: entity.id,
                    x: parseFloat(entity.x).round(3),
                    y: parseFloat(entity.y).round(3),
                    z: parseFloat(entity.z).round(3) || undefined,
                    rotation: parseFloat(entity.rotation).round(3) || undefined,
                    locked: entity.locked || undefined,
                    type: entity.type,
                    subtype: entity.subtype
                };
                entity.onSave(objData, isSelection);
                saveObject.entities.push(objData);
            }
        }
        saveObject.entities.sort((a, b) => a.id - b.id);
        return saveObject;
    }

    game.downloadSave = function(isSelection) {
        let saveData = game.getSaveData(isSelection);
        let saveString = JSON.stringify(saveData, function(key, value) {
            if (typeof value === 'number') {
                if (key === 'x' || key === 'y' || key === 'z' || key === 'rotation') {
                    return value.round(3);
                }
            }
            return value;
        });
        let fileName = game.project.name.toLowerCase().trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '_')
            .replace(/^-+|-+$/g, '');
        if (isSelection) {
            fileName += '_selection';
        }
        download(saveString, fileName, 'application/json');
    };

    game.loadSave = function(saveObject, isSelection, ignoreConfirmation, isAutoLoad) {
        if (!saveObject.version) {
            // Socket ID's for bunker corners were incorrectly set during experimental. This will update those socket IDs.
            for (const entity of saveObject.entities) {
                if (entity.connections && (entity.subtype === 'fortcornert1' || entity.subtype === 'fortcornert2' || entity.subtype === 'fortcornert3')) {
                    const remapSocketIdTo = function(prevSocketId, newSocketId) {
                        if (entity.connections[prevSocketId]) {
                            entity.connections[newSocketId] = entity.connections[prevSocketId];
                            delete entity.connections[prevSocketId];
                            for (const e2 of saveObject.entities) {
                                for (const [entityId, socketId] of Object.entries(entity.connections[newSocketId])) {
                                    if (e2.id == entityId && e2.connections && e2.connections[socketId]) {
                                        e2.connections[socketId][entity.id] = newSocketId;
                                    }
                                }
                            }
                        }
                    }
                    remapSocketIdTo(1, 6);
                    remapSocketIdTo(2, 3);
                }
            }
            saveObject.version = '1.0.0';
        }
        if (saveObject.version === '1.0.0') {
            console.info('Upgrading save from v1.0.0 => v1.0.1');
            const scalePositionData = function(obj) {
                for (const key in obj) {
                    const value = obj[key];
                    if (typeof value === 'object' && value !== null) {
                        scalePositionData(value);
                    } else if (key === 'x' || key === 'y') {
                        obj[key] /= 1.056;
                    }
                }
            }
            for (const entity of saveObject.entities) {
                scalePositionData(entity);
            }
            saveObject.version = '1.0.1';
        }
        if (saveObject.version === '1.0.1') {
            console.info('Upgrading save from v1.0.1 => v1.0.2');
            for (const entity of saveObject.entities) {
                if (entity.type === 'building' && entity.subtype === 'crane') {
                    const position = Math.extendPoint(entity, 215 / METER_TEXTURE_PIXEL_SCALE, Math.angleNormalized(entity.rotation + Math.PI));
                    entity.x = position.x;
                    entity.y = position.y;
                }
            }
            saveObject.version = '1.0.2';
        }
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
            game.project.name = saveObject.name || 'Unnamed Project';
            game.project.description = saveObject.description || '';
            game.project.authors = saveObject.authors || '';
            game.setFaction(saveObject.faction, true);
            if (saveObject.projectSettings) {
                Object.assign(game.project.settings, saveObject.projectSettings);
            }
        }
        setTimeout(() => {
            let entityIdMap = {};
            for (let i = 0; i < saveObject.entities.length; i++) {
                let objData = saveObject.entities[i];
                let entity = game.createObject(objData, parseFloat(objData.x || 0), parseFloat(objData.y || 0), parseInt(objData.z || 0), objData.rotation, undefined, false);
                if (entity) {
                    objData.createdEntity = entity;
                    if (entity.id !== objData.id) {
                        entityIdMap[objData.id] = entity.id;
                    }
                    entity.locked = objData.locked;
                    entity.onLoad(objData);
                    if (isSelection) {
                        game.addSelectedEntity(entity, true);
                    }
                }
            }

            for (let i = 0; i < saveObject.entities.length; i++) {
                let objData = saveObject.entities[i];
                objData.createdEntity?.afterLoad(objData, entityIdMap);
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
                game.resetSelectionData();
                game.refreshStats();
            } else if (!ignoreConfirmation) {
                game.zoomToEntitiesCenter();
            }
            
            game.updateEntityOverlays();
        }, 1);
    };

    game.refreshStats = function() {
        if (game.statisticsMenuComponent) {
            setTimeout(() => {
                game.statisticsMenuComponent.refresh();
            }, 1);
        }
    };

    game.setMapRegion = function(regionKey) {
        if (game.project.settings.regionKey === regionKey) {
            regionKey = null;
        }
        game.project.settings.regionKey = regionKey;
        if (game.project.settings.regionKey && !entities.length) {
            camera.zoom = 0.018;
            camera.x = (GRID_WIDTH/2 * camera.zoom) - WIDTH/2;
            camera.y = (GRID_HEIGHT/2 * camera.zoom) - HEIGHT/2;
        }
        game.updateEntityOverlays();
        game.updateSave();
        game.appComponent?.refresh();
    };

    game.updateRegionCrop = function() {
        const regionCrop = game.project.settings.regionCrop;
        if (regionCrop) {
            mapLayer.cropMask.clear();
            mapLayer.cropMask.drawRect(regionCrop.x - (GRID_WIDTH / 2), regionCrop.y - (GRID_HEIGHT / 2), regionCrop.width, regionCrop.height);
            mapLayer.mask = mapLayer.cropMask;
        } else {
            mapLayer.mask = null;
        }
        game.updateSave();
        game.appComponent?.refresh();
    };

    game.resetRegionCrop = function(switchMode = true) {
        game.project.settings.regionCrop = undefined;
        if (switchMode) {
            game.setConstructionMode('crop-region');
        }
        game.updateRegionCrop();
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

    // TODO: Save result so we're not recalculating for selectionData.
    game.getSelectedEntitiesCenter = function(isSelection) {
        return game.getEntitiesCenter(selectedEntities, isSelection);
    };

    game.zoomToEntitiesCenter = function() {
        if (followEntity) {
            game.followEntity(null);
        }
        if (entities?.length) {
            const centerPos = game.getEntitiesCenter(entities);

            let x1, y1, x2, y2;
            for (const entity of entities) {
                const max = Math.max(entity.width, entity.height) / 2;
                const eX1 = entity.mid.x - max, eX2 = entity.mid.x + max;
                const eY1 = entity.mid.y - max, eY2 = entity.mid.y + max;
                if (x1 === undefined || eX1 < x1) {
                    x1 = eX1;
                }
                if (y1 === undefined || eY1 < y1) {
                    y1 = eY1;
                }
                if (x2 === undefined || eX2 > x2) {
                    x2 = eX2;
                }
                if (y2 === undefined || eY2 > y2) {
                    y2 = eY2;
                }
            }

            const padding = 100;
            const width = (x2 - x1) + (padding * 2), height = (y2 - y1) + (padding * 2);
            const ratio = Math.min(app.view.width, app.view.height) / Math.max(width, height);
            camera.zoom = Math.max(0.01, Math.min(1.6, ratio));
            camera.x = (centerPos.x * camera.zoom) - (app.view.width / 2);
            camera.y = (centerPos.y * camera.zoom) - (app.view.height / 2);
        } else {
            if (game.project.settings.regionKey) {
                camera.zoom = 0.018;
            } else {
                game.resetZoom();
            }
            camera.x = (GRID_WIDTH/2 * camera.zoom) - WIDTH/2;
            camera.y = (GRID_HEIGHT/2 * camera.zoom) - HEIGHT/2;
        }
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
        if (entity.selectable && entity?.selected === false) {
            selectedEntities.push(entity);
            entity.onSelect();
            if (!noMenuUpdate) {
                game.resetSelectionData();
                game.refreshStats();
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
                game.resetSelectionData();
                game.refreshStats();
            }
            return true;
        }
        return false;
    }

    game.deselectHandle = function() {
        if (game.selectedHandlePoint) {
            game.selectedHandlePoint = null;
            const selectedEntity = game.getSelectedEntity();
            if (selectedEntity?.subtype === 'image' && (selectedEntity.sprite.width < selectedEntity.sprite.texture.width || selectedEntity.sprite.height < selectedEntity.sprite.texture.height)) {
                // Resize texture image?
            }
        }
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
                game.resetSelectionData();
                game.refreshStats();
            }
            return true;
        }
        return false;
    }

    game.updateSelectedBuildingMenu = function(noForce) {
        let buildingMenuSelected = game.sidebarMenuComponent?.currentMenu?.key === 'building-selected';
        if (selectedEntities.length) {
            if (!buildingMenuSelected) {
                game.sidebarMenuComponent.changeMenu({
                    key: 'building-selected',
                    name: 'Properties',
                    icon: 'fa-wrench'
                });
            } else {
                game.buildingSelectedMenuComponent?.refresh(noForce);
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
        e.preventDefault();

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
        } else {
            for (const selectedEntity of selectedEntities) {
                if (selectedEntity.building?.maxExtLength) {
                    selectedEntity.postExtension = Math.max(Math.min((selectedEntity.postExtension ?? 1) - (e.deltaY / 200), selectedEntity.building.maxExtLength), selectedEntity.building.minExtLength);
                    selectedEntity.regenerate();
                }
            }
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

        if (game.toolbeltComponent) {
            game.toolbeltComponent.showList(false);
        }

        mouseDown[mouseButton] = true;
        if (mouseButton === 0) {
            if (!game.selectedHandlePoint) {
                if (pickupSelectedEntities) {
                    let selectedEntity = game.getSelectedEntity();
                    if (selectedEntity?.hasHandle && selectedEntity.shouldSelectLastHandlePoint) {
                        selectedEntity.grabHandlePoint();
                    }
                } else if (game.constructionMode.eType) {
                    let gmxGrid = gmx;
                    let gmyGrid = gmy;
                    if (game.settings.enableGrid || keys[16]) {
                        let gridSize = game.settings.gridSize ? game.settings.gridSize : 16;
                        gmxGrid = Math.round(gmxGrid / gridSize) * gridSize;
                        gmyGrid = Math.round(gmyGrid / gridSize) * gridSize;
                    }
                    const entity = game.createObject({
                        type: game.constructionMode.eType,
                        subtype: game.constructionMode.eSubType
                    }, gmxGrid, gmyGrid);
                    if (entity.hasHandle) {
                        entity.grabHandlePoint();
                    }
                } else {
                    if (game.constructionMode.key === 'select') {
                        entities.sort(function (a, b) {
                            return a.getZIndex() - b.getZIndex();
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
    mouseEventListenerObject.addEventListener('dragover', (e) => {
        e.preventDefault();
    });
    function importImageData(data, x, y) {
        if (game.settings.enableExperimental) {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.result) {
                    let pos = (isNaN(x) && isNaN(y)) ? game.getMousePosition() : {
                        x: (camera.x + x) / camera.zoom,
                        y: (camera.y + y) / camera.zoom
                    };
                    let objData = {
                        type: 'shape',
                        subtype: 'image',
                        textureData: reader.result,
                        imported: true
                    }
                    let entity = game.createObject(objData, pos.x, pos.y, 0, 0, undefined, false);
                    if (entity) {
                        entity.onLoad(objData);
                        game.selectEntity(entity);
                    }
                }
            };
            reader.readAsDataURL(data);
        }
    }
    mouseEventListenerObject.addEventListener('drop', (e) => {
        e.preventDefault();
        importImageData(e.dataTransfer.files[0], e.offsetX, e.offsetY);
    });
    document.addEventListener('paste', (e) => {
        if (!(document.activeElement && (document.activeElement.type === 'text' || document.activeElement.type === 'number' || document.activeElement.type === 'textarea'))) {
            e.preventDefault();
            const items = (e.clipboardData || e.originalEvent.clipboardData).items;
            if (items.length > 0) {
                const item = items[0];
                if (item.type.indexOf('image') !== -1) {
                    importImageData(item.getAsFile());
                }
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

        if (selectionArea && selectionArea.origin) {
            selectionArea.clear();
            selectionArea.x = selectionArea.origin.x > gmx ? gmx : selectionArea.origin.x;
            selectionArea.y = selectionArea.origin.y > gmy ? gmy : selectionArea.origin.y;
            selectionArea.beginFill(COLOR_SELECTION);
            selectionArea.lineStyle(4, COLOR_SELECTION_BORDER);

            const selection_width = Math.abs(gmx - selectionArea.origin.x);
            const selection_height = Math.abs(gmy - selectionArea.origin.y);
            selectionArea.drawRect(0, 0, selection_width, selection_height);
            selectionArea.endFill();

            if (!selectionArea.visible) {
                selectionArea.visible = true;
                if (game.toolbeltComponent) {
                    const el = document.getElementById('toolbelt-panel');
                    if (el) {
                        el.style.pointerEvents = 'none';
                    }
                }
            }

            if (game.constructionMode.key === 'select') {
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
                    game.resetSelectionData();
                    game.refreshStats();
                }
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
                if (selectionArea.visible && game.constructionMode.key === 'crop-region') {
                    game.project.settings.regionCrop = {
                        x: selectionArea.x,
                        y: selectionArea.y,
                        width: selectionArea.width,
                        height: selectionArea.height
                    }
                    game.updateRegionCrop();
                    game.resetConstructionMode();
                }
                selectionArea.origin = null;
                selectionArea.visible = false;
                if (game.toolbeltComponent) {
                    const el = document.getElementById('toolbelt-panel');
                    if (el) {
                        el.style.pointerEvents = 'auto';
                    }
                }
            }
            if (pickupSelectedEntities) {
                game.setPickupEntities(false);
            }
            if (game.constructionMode.key !== 'select' && game.selectedHandlePoint) {
                game.deselectHandle();
                game.resetConstructionMode();
            }
        } else if (mouseButton === 1 || mouseButton === 4) {
            dragCamera = false;
        }
    });

    let fetchedPresetImages = [];
    game.downloadPresetImages = function() {
        for (const [key, preset] of Object.entries(gameData.presets)) {
            if (!fetchedPresetImages.includes(key)) {
                fetchedPresetImages.push(key);
                game.removeEntities();
                game.createObject(preset, 0, 0, 0, 0, undefined, false, false);
                setTimeout(() => {
                    game.downloadImage(key, true, false);
                }, 750);
                break;
            }
        }
    }

    game.downloadImage = function(fileName = 'fullres', centerObjects = true, showBackground = true) {
        if (!showBackground) {
            background.visible = false;
        }

        if (centerObjects) {
            game.zoomToEntitiesCenter();
        }

        setTimeout(() => {
            var renderTexture = PIXI.RenderTexture.create(app.renderer.width, app.renderer.height);
            app.renderer.render(background, mapLayer, renderTexture);

            const addObjectToRender = (obj) => {
                app.renderer.render(obj, {
                    renderTexture: renderTexture,
                    clear: false,
                    skipUpdateTransform: true
                });
            }

            if (mapLayer.visible) {
                addObjectToRender(mapLayer);
            }

            const renderEntities = [...entities];
            renderEntities.sort(function (a, b) {
                return b.getZIndex() - a.getZIndex();
            });

            for (const entity of renderEntities) {
                addObjectToRender(entity);
            }
        
            var sprite = new PIXI.Sprite(renderTexture);
            sprite.setTransform(0, 0, 1, 1, 0, 0, 0, 0, 0);
            app.renderer.render(sprite);
            var dataURI = app.renderer.extract.canvas(sprite).toDataURL('image/png');

            if (!showBackground) {
                background.visible = true;
            }
        
            var link = document.createElement('a');
            link.download = fileName + '.png';
            link.href = dataURI;
            link.click();
        }, 150);
    };

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
    game.loadSpritesheet = function(texture, width, height) {
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

    game.createLight = function(entity, color, minBrightness, maxBrightness, duration) {
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
    game.createEffect = function(type, x, y, z, width, height, data) {
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
            return game.createLight(effect, color, minBrightness, maxBrightness, duration);
        };

        let zOffset = 100;
        let spritesheet = null;
        let effectSound = null;
        let disableLighting = false;
        if (type === 'smoke') {
            spritesheet = game.loadSpritesheet(game.resources['smoke_particles'].texture, 64, 64);
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
                game.soundUpdate(effectSound);
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
            return effect.z === camera.z && game.isOnScreen(effect);
        };

        effect.onRemove = function () {
            if (effectSound) {
                game.soundStop(effectSound);
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
    game.isOnScreen = function(pos, bufferOverride) {
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

    game.fetchTexture = function(sprite, src, callback) {
        const texture = game.resources[src]?.texture ?? PIXI.utils.TextureCache[src] ?? PIXI.Texture.from(src);
        const onTextureLoad = () => {
            sprite.texture = texture;
            if (callback) {
                callback(sprite, texture);
            }
        };
        if (!texture.valid) {
            texture.baseTexture.on('loaded', () => {
                onTextureLoad();
            });
            return;
        }
        onTextureLoad();
    };

    game.createSprite = function(src, callback) {
        const sprite = new PIXI.Sprite();
        game.fetchTexture(sprite, src, callback);
        return sprite;
    };

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
                    let offsetX = 0, offsetY = 0;
                    if (ignoreOffset) {
                        if (entity.building?.hasHandle) {
                            offsetX = entity.building.minLength > 1 ? (entity.building.minLength * METER_BOARD_PIXEL_SIZE) / 2 : 100;
                        } else if (entity.subtype === 'rectangle' || entity.subtype === 'image' || entity.subtype === 'line') {
                            offsetX = entity.mid.x;
                            offsetY = entity.mid.y;
                        }
                    }
                    entity.pickupOffset = {
                        x: ignoreOffset ? offsetX : ((position?.x ?? gmx) - entity.x),
                        y: ignoreOffset ? offsetY : ((position?.y ?? gmy) - entity.y)
                    };
                }
            });
            if (!locked) {
                if (pickup) {
                    pickupTime = !ignoreOffset ? Date.now() : null;
                    pickupPosition = {x: position?.x ?? gmx, y: position?.y ?? gmy};
                    ignoreMousePickup = true;
                } else {
                    game.refreshStats();
                }
                pickupSelectedEntities = pickup;
            }
        }
    };

    game.createObject = function(dataKey, x = 0, y = 0, z = 0, rotation = 0, id, pickup = true, isSelection = true) {
        if (typeof dataKey === 'string') {
            dataKey = gameData.buildings[dataKey];
        }
        if (dataKey) {
            if (dataKey.preset) {
                fetch(dataKey.dataFile).then(response => {
                    return response.json();
                }).then(saveObject => {
                    try {
                        game.loadSave(saveObject, isSelection);
                    } catch (e) {
                        console.error('Failed to load preset:', e);
                    }
                }).catch(e => {
                    console.info('Failed to load preset. This will typically occur if one doesn\'t exist.');
                });
                return true;
            } else {
                let type = dataKey.className ?? dataKey.type ?? 'building', subtype = dataKey.subtype ?? dataKey.key;
                if (typeof id === 'number' && id >= _entityIds) {
                    _entityIds = id + 1;
                }
                id = id ?? _entityIds++;

                let entity = new (draggableTypes[type] ?? draggableTypes.default)(id, type, subtype, x, y, z, rotation);
                app.cstage.addChild(entity);
                entities.push(entity);
                entityMap[entity.id] = entity;

                if (pickup) {
                    game.updateConstructionMode(type, subtype);
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
                }
                return entity;
            }
        }
        return null;
    };

    game.createBuildingAtCenter = function(dataKey) {
        let zoomRatio = WIDTH/(WIDTH*camera.zoom);
        game.resetConstructionMode();
        return game.createObject(dataKey, (camera.x + WIDTH/2) * zoomRatio, (camera.y + HEIGHT/2) * zoomRatio, 0, 0, undefined, false);
    };

    game.cloneSelected = function() {
        game.loadSave(game.getSaveData(true), true);
    };

    game.exchangeSelected = function(dataKey) {
        for (const selectedEntity of selectedEntities) {
            let bData = selectedEntity?.building;
            if (bData) {
                let upgradeKey = dataKey?.key;
                if (upgradeKey && bData.parent?.key && upgradeKey === selectedEntity.building.key) {
                    upgradeKey = bData.parent.key;
                }
                let clone = game.createObject(upgradeKey ?? dataKey ?? selectedEntity.building.key, selectedEntity.x, selectedEntity.y, selectedEntity.z, selectedEntity.rotation, selectedEntity.id, false);
                if (upgradeKey) {
                    let position = { x: clone.x, y: clone.y };
                    if (selectedEntity.building?.positionOffset) {
                        position.x -= ((selectedEntity.building.positionOffset.x ?? 0) * TEXTURE_SCALE) / METER_TEXTURE_PIXEL_SCALE;
                        position.y -= ((selectedEntity.building.positionOffset.y ?? 0) * TEXTURE_SCALE) / METER_TEXTURE_PIXEL_SCALE;
                    }
                    if (clone.building?.positionOffset) {
                        position.x += ((clone.building.positionOffset.x ?? 0) * TEXTURE_SCALE) / METER_TEXTURE_PIXEL_SCALE;
                        position.y += ((clone.building.positionOffset.y ?? 0) * TEXTURE_SCALE) / METER_TEXTURE_PIXEL_SCALE;
                    }
                    position = Math.rotateAround(clone, position);
                    clone.position.set(position.x, position.y);
                }
                clone.locked = selectedEntity.locked;
                clone.selectionArea.tint = clone.locked ? COLOR_RED : COLOR_WHITE;
                let objData = {
                    upgrading: true
                };
                selectedEntity.onSave(objData);
                clone.onLoad(objData);
                clone.afterLoad(objData);
                game.selectEntity(clone);
                if (upgradeKey && selectedEntity.sockets) {
                    for (const entitySocket of selectedEntity.sockets) {
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
                    selectedEntity.sockets = null;
                }
                selectedEntity.remove();
                if (typeof dataKey === 'string') {
                    clone.attemptReconnections(true, false);
                }
            }
        }
    };

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
    };

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
    };

    // Returns null = No buildings blueprinted, 0 = Some buildings blueprinted, 1 = All buildings blueprinted.
    game.getSelectedBlueprintState = function() {
        let blueprinted = null; // Assume no buildings are blueprinted.
        selectedEntities.every((selectedEntity, i) => {
            if (selectedEntity.building?.canBlueprint) {
                if (selectedEntity.blueprint) {
                    if (blueprinted === null) {
                        blueprinted = 1;
                    }
                } else if (blueprinted) {
                    blueprinted = 0; // Some selected aren't blueprinted.
                }
            }
            return blueprinted !== 0;
        });
        return blueprinted;
    };

    game.blueprintSelected = function() {
        const blueprinted = !game.getSelectedBlueprintState() ? true : false;
        for (const selectedEntity of selectedEntities) {
            if (selectedEntity.building) {
                selectedEntity.setBlueprint(blueprinted);
            }
        }
        game.buildingSelectedMenuComponent?.refresh();
    };

    game.moveSelected = function(x, y, snapped) {
        if (selectedEntities.length && game.getSelectedLockState() === null) {
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
            } else {
                for (const selectedEntity of selectedEntities) {
                    selectedEntity.x += x;
                    selectedEntity.y += y;
                }
            }
            for (const selectedEntity of selectedEntities) {
                if (selectedEntity.sockets) {
                    selectedEntity.attemptReconnections();
                }
                if (pickupSelectedEntities) {
                    selectedEntity.pickupOffset = {
                        x: gmx - selectedEntity.x,
                        y: gmy - selectedEntity.y
                    };
                }
            }
            game.saveStateChanged = true;
            game.buildingSelectedMenuComponent?.refresh(true);
        }
    };

    game.rotateSelected = function(rotationOffset) {
        if (game.selectionData && game.getSelectedLockState() === null) {
            game.resetSelectionData(false, true);
            game.updateSelected(game.selectionData.rotation + rotationOffset, true);
        }
    };

    game.flipSelected = function(vertical = false) {
        for (const selectedEntity of selectedEntities) {
            if (selectedEntity.type === 'shape' && selectedEntity.subtype === 'image') {
                selectedEntity.flipPoints(vertical);
            }
        }
        game.saveStateChanged = true;
    };

    game.mirrorSelected = function(vertical = false) {
        if (game.settings.enableExperimental && selectedEntities.length) {
            const selectionCenter = game.getEntitiesCenter(selectedEntities);
            for (const selectedEntity of selectedEntities) {
                if (!vertical) {
                    selectedEntity.x = selectionCenter.x - (selectedEntity.x - selectionCenter.x);
                    selectedEntity.rotation = (2 * Math.PI - Math.angleNormalized(selectedEntity.rotation)) % (2 * Math.PI);
                } else {
                    selectedEntity.y = selectionCenter.y - (selectedEntity.y - selectionCenter.y);
                    selectedEntity.rotation = (Math.PI - Math.angleNormalized(selectedEntity.rotation) + 2 * Math.PI) % (2 * Math.PI);
                }
                if (selectedEntity.subtype?.includes('corner')) {
                    selectedEntity.rotation = Math.angleNormalized(selectedEntity.rotation + Math.PI / 2);
                } else if (selectedEntity.building?.hasHandle) {
                    selectedEntity.rotation = Math.angleNormalized(selectedEntity.rotation + Math.PI);

                    const handlePoint = selectedEntity.getHandlePoint();
                    const globalHandlePos = app.cstage.toLocal(handlePoint, selectedEntity, undefined, true);
                    if (!vertical) {
                        globalHandlePos.x = selectionCenter.x - (globalHandlePos.x - selectionCenter.x);
                        globalHandlePos.rotation = (2 * Math.PI - Math.angleNormalized(handlePoint.rotation)) % (2 * Math.PI);
                    } else {
                        globalHandlePos.y = selectionCenter.y - (globalHandlePos.y - selectionCenter.y);
                        globalHandlePos.rotation = (Math.PI - Math.angleNormalized(handlePoint.rotation) + 2 * Math.PI) % (2 * Math.PI);
                    }

                    const newHandlePos = selectedEntity.toLocal(globalHandlePos, app.cstage);
                    handlePoint.x = newHandlePos.x;
                    handlePoint.y = newHandlePos.y;
                    handlePoint.rotation = Math.angleNormalized(globalHandlePos.rotation + (vertical ? Math.PI : 0));

                    selectedEntity.updateHandlePos();
                    if (selectedEntity.subtype !== 'power_line') {
                        selectedEntity.regenerate();
                    }
                }
            }
            for (const selectedEntity of selectedEntities) {
                if (selectedEntity.subtype === 'power_line') {
                    selectedEntity.forceReposition();
                }
            }
            for (const selectedEntity of selectedEntities) {
                if (selectedEntity.sockets) {
                    selectedEntity.attemptReconnections(true, false, true);
                }
                if (pickupSelectedEntities) {
                    selectedEntity.pickupOffset = {
                        x: gmx - selectedEntity.x,
                        y: gmy - selectedEntity.y
                    };
                }
            }
            game.saveStateChanged = true;
        }
    };

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
            game.refreshStats();
        }
    };

    game.confirmDeletion = function(callback, loading) {
        game.confirmationPopup.showPopup(loading ? 'save-work' : 'delete', confirmed => {
            if (confirmed) {
                game.removeEntities();
            }
            if (typeof callback === 'function') {
                callback(confirmed);
            }
        });
    };

    game.confirmNewProject = function(callback) {
        game.confirmationPopup.showPopup('new-project', confirmed => {
            if (confirmed) {
                game.removeEntities();
                game.project = JSON.parse(JSON.stringify(game.defaultProject));
                game.updateEntityOverlays();
                game.saveStateChanged = true;
                game.appComponent?.refresh();
                game.loadSaveMenuComponent?.refresh();
            }
            if (typeof callback === 'function') {
                callback(confirmed);
            }
        });
    };

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
        } catch (e) {
            console.error('Failed to update save:', e);
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
    
    let fuse;
    function updateBuildingDB() {
        if (window.objectData?.categories) {
            let searchBuildings = Object.values(window.objectData.categories).reduce((acc, category) => {
                if (game.canShowListCategory(category, true)) {
                    acc.push(...category.buildings);
                }
                return acc;
            }, []);
            fuse = new Fuse(searchBuildings, {
                keys: [
                    { name: 'name', weight: 0.8 },
                    { name: 'aliases', weight: 0.7 },
                    { name: 'upgradeName', weight: 0.6 },
                    { name: 'key', weight: 0.4 },
                    { name: 'category', weight: 0.3 },
                    { name: 'description', weight: 0.2 },
                    { name: 'author', weight: 0.2 },
                    { name: 'codeName', weight: 0.1 }
                ],
                includeMatches: true,
                threshold: 0.225,
                distance: 100
            });
        }
    }

    game.getSearchResults = function(query, presets = true) {
        return fuse ? fuse.search(query).map(result => result.item).filter(building => (presets || !building.preset) && game.canShowListItem(building, true)) : [];
    };

    game.canShowListItem = function(building, search = false, filters = game.settings) {
        if (building && (!building.hideInList || game.settings.enableDebug) &&
            (!building.experimental || game.settings.enableExperimental) &&
            (search || ((!building.parent || building.parentKey || filters.showUpgradesAsBuildings) &&
            (!building.filters || building.filters.some(filter => { return game.settings.buildingListFilters[filter]; })) &&
            ((!building.tier || (!filters.showSelectedTierOnly && (building.tier <= filters.selectedTier))) || building.tier === filters.selectedTier) &&
            ((!building.techId || !window.objectData.tech[building.techId]) || ((building.techId === 'unlockfacilitytier2' && filters.selectedTier >= 2) || (building.techId === 'unlockfacilitytier3' && filters.selectedTier >= 3))) &&
            (!game.settings.selectedFaction || (!building.faction || building.faction === game.settings.selectedFaction))))) {
            return true;
        }
        return false;
    }

    game.canShowListCategory = function(category, ignoreFilters = false) {
        return !category.hideInList && (game.settings.enableExperimental || !category.experimental) &&
        ignoreFilters || (!category.filters || category.filters.some(filter => {
            return game.settings.buildingListFilters[filter];
        }));
    };

    game.cameraTo = function(entity) {
        if (entity) {
            camera.x = ((entity.mid?.x ?? entity.x) * camera.zoom) - WIDTH/2;
            camera.y = ((entity.mid?.y ?? entity.y) * camera.zoom) - HEIGHT/2;
        }
    };

    const FPSMIN = 30;
    let fpsCheck = null;
    let menuInit = false;
    let lastTick = Date.now();
    let lastCameraZoom;
    let g_TICK = 10;
    let g_Time = 0;
    let snappedMX;
    let snappedMY;
    function update() {
        if (game.project.settings.regionKey && !game.project.settings.regionCrop && game.settings.lockCameraToHex) {
            const zoomRatio = 1 / camera.zoom;
            const centerPos = {
                x: (camera.x + app.view.width / 2) * zoomRatio,
                y: (camera.y + app.view.height / 2) * zoomRatio
            };
            centerPos.x = Math.max(Math.min(centerPos.x, 39832), -29832);
            centerPos.y = Math.max(Math.min(centerPos.y, 35208), -25208);
            camera.x = (centerPos.x * camera.zoom) - app.view.width / 2;
            camera.y = (centerPos.y * camera.zoom) - app.view.height / 2;
        }

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

        if (lastCameraZoom !== game.camera.zoom) {
            lastCameraZoom = game.camera.zoom;
            game.boardUIComponent?.refresh();
        }

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

        if (!mouseDown[0]) {
            game.deselectHandle();
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

                                let disableMaxCarDist = false;
                                let carDistOffset = 0;
                                if (entity.car_linkage && entity2.car_linkage && entity.car_linkage === entity2.car_linkage) {
                                    disableMaxCarDist = true;
                                    carDistOffset = 358;
                                }

                                if (entity.hasConnectionToEntity(entity2) && (disableMaxCarDist || dist > entity.sprite.width/2+entity2.sprite.width/2+5+carDistOffset)) {
                                    if (!disableMaxCarDist && dist > entity.sprite.width/2+entity2.sprite.width/2+30+carDistOffset) {
                                        entity.removeConnectionsToEntity(entity2);
                                        continue;
                                    }
                                    let pPos = app.cstage.toLocal(entity.currentTrack.bezier.get(entity.currentTrackT + (0.05 * entity.trackDirection)), entity.currentTrack, undefined, true);
                                    let pNeg = app.cstage.toLocal(entity.currentTrack.bezier.get(entity.currentTrackT - (0.05 * entity.trackDirection)), entity.currentTrack, undefined, true);

                                    let distDiff = dist-(entity.sprite.width/2+entity2.sprite.width/2+10+carDistOffset);
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

        let mouseRotationOffset;
        if (!selectionArea.visible && mouseDown[2] && !game.selectedHandlePoint && selectedEntities.length) {
            const mouseAngle = Math.angleBetween(game.selectionData, { x: gmx, y: gmy });
            if (!rotateSelectedEntities && game.getSelectedLockState() === null) {
                selectedEntities.forEach(selectedEntity => {
                    if (selectedEntity.sockets && !selectedEntity.building?.emplaced) {
                        selectedEntity.removeConnections(undefined, true);
                    }
                });
                game.resetSelectionData(false, true);
                rotateSelectedEntities = true;
                game.selectionData.prevRotation = game.selectionData.rotation;
                game.selectionData.mouseAngle = mouseAngle; // Angle of mouse from the center of selection.
            }
            if (rotateSelectedEntities) {
                mouseRotationOffset = mouseAngle - game.selectionData.mouseAngle; // Get the angle of the mouse from the center and subtract the angle of the selection from it.
                if (game.settings.enableSnapRotation) {
                    let snapRotationDegrees = Math.deg2rad(game.settings.snapRotationDegrees ?? 15);
                    mouseRotationOffset = Math.round(mouseRotationOffset / snapRotationDegrees) * snapRotationDegrees; // Snap the angle of the selection.
                    if (typeof game.selectionData.prevRotation === 'number') {
                        mouseRotationOffset += (Math.round(game.selectionData.prevRotation / snapRotationDegrees) * snapRotationDegrees) - game.selectionData.prevRotation; // Subtract the difference to snap entities with the same rotation to grid.
                    }
                }
            }
        } else if (rotateSelectedEntities) {
            rotateSelectedEntities = false;
            selectedEntities.forEach(selectedEntity => {
                if (selectedEntity.sockets) {
                    selectedEntity.attemptReconnections();
                }
            });
        }

        // TODO: Check for mouse pickup but for right click instead.
        if (pickupSelectedEntities || rotateSelectedEntities) {
            game.buildingSelectedMenuComponent?.refresh(true);
            if (!game.selectedHandlePoint && (!ignoreMousePickup || (Date.now()-pickupTime > 250 || Math.distanceBetween(pickupPosition, {x: gmx, y: gmy}) > 20))) {
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
                            if (pickupEntity.building && !pickupEntity.building.emplaced) {
                                pickupEntity.removeConnections(undefined, true);
                            }
                        }
                    }
                }
                ignoreMousePickup = false;
                snappedMX = gmx;
                snappedMY = gmy;
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

                if (rotateSelectedEntities) {
                    game.updateSelected(game.selectionData.prevRotation + mouseRotationOffset);
                } else {
                    let pickupEntity = game.getSelectedEntity();
                    if (pickupEntity?.isTrain) {
                        pickupEntity.currentTrack = null;
                        pickupEntity.currentTrackT = null;
                        pickupEntity.trackVelocity = 0;
                    }
                    
                    let connectionEstablished = false;
                    if (selectedEntities.length) {
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
                                    if (!entity.valid || !entity.visible || entity === selectedEntity || entity.type !== 'building' || entity.selected || !((selectedEntity.sockets && entity.sockets) || selectedEntity.isTrain || pickupEntity?.building?.canSnapAlongBezier) || (selectedEntity.building?.emplaced && entity.building?.emplaced) || Math.distanceBetween(selectedEntity, entity.mid) > 1000) {
                                        continue;
                                    }
                                    if (selectedEntity.subtype === entity.subtype || (selectedEntity.sockets && entity.sockets) || selectedEntity.isTrain || (pickupEntity && entity.subtype && pickupEntity.building?.canSnapAlongBezier === entity.subtype)) {
                                        const mousePos = entity.toLocal({x: gmx, y: gmy}, app.cstage, undefined, true);
                                        if ((selectedEntity.building?.canSnap || selectedEntity.isTrain) && (selectedEntity.building?.canSnapStructureType !== false || selectedEntity.subtype !== entity.subtype)) {
                                            if (selectedEntity.sockets && entity.sockets) {
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
                                                        if (!selectedEntity.building?.emplaced) {
                                                            selectedEntity.rotation = selectedEntityRotation;
                                                        }
        
                                                        connectionEstablished = selectedEntity;
                                                        return true;
                                                    }
                                                }
                                                for (let k = 0; k < entity.sockets.length; k++) {
                                                    let entitySocket = entity.sockets[k];
                                                    if (!entitySocket.socketData.temp) {
                                                        let socketDistance = Math.distanceBetween(mousePos, entitySocket);
                                                        // Checks socket distance is close, closer than previous socket distance, or hovering a building with a power socket.
                                                        if (selectedEntity.building?.snapNearest || ((socketDistance < 35 && (nearestSocketDist === null || socketDistance < nearestSocketDist)) || selectedEntity.building?.snapGrab && entity.canGrab())) {
                                                            for (let l = 0; l < selectedEntity.sockets.length; l++) {
                                                                let selectedSocket = selectedEntity.sockets[l];
                                                                if (selectedSocket.socketData.ignoreSnap || (selectedEntities.length === 1 && selectedEntity.building?.hasHandle && selectedSocket.socketData.id !== 0)) {
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
                                            if (!connectionEstablished && pickupEntity && entity.building?.isBezier && entity.bezier && ((pickupEntity.building?.isBezier && pickupEntity.building?.canSnapAlongBezier && entity.subtype === pickupEntity.subtype) || pickupEntity.isTrain || pickupEntity.building?.canSnapAlongBezier === entity.subtype)) {
                                                const projection = entity.bezier?.project(mousePos);
                                                if (projection.d <= Math.max(entity.building?.lineWidth ?? 0, 25)) {
                                                    if (pickupEntity && projection && ((!connectionEstablished && entity.bezier && entity.building.isBezier && entity.building.canSnapAlongBezier && selectedEntity.subtype === entity.subtype) ||
                                                    (selectedEntity.isTrain && entity.subtype === selectedEntity.building.vehicle.track) ||
                                                    (!pickupEntity.building?.isBezier && pickupEntity.building?.canSnapAlongBezier))) {
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
            game.cameraTo(followEntity);
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

        game.updateMapIcons();

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

        if (game.saveStateChanged || pickupSelectedEntities || rotateSelectedEntities) {
            for (const entity of entities) {
                if (entity.valid) {
                    if (game.settings.enableExperimental && game.settings.showLineOfSightRanges && entity.rangeSprite) {
                        entity.updateRangeMask();
                    }
                    if (entity.type === 'shape' && entity.subtype === 'line' && entity.shapeStyle?.showDist) {
                        entity.regenerate();
                    }
                }
            }
            game.resetSelectionData(true);
        }

        if (game.saveStateChanged && game.settings.enableHistory && !pickupSelectedEntities && !game.selectedHandlePoint && !rotateSelectedEntities) {
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
    Math.pointBetween = function (p1, p2) {
        return {
            x: (p1.x + p2.x) / 2,
            y: (p1.y + p2.y) / 2
        };
    };
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
    Math.distanceToLine = function(point, lineStart, lineEnd) {
        const { x: x1, y: y1 } = lineStart;
        const { x: x2, y: y2 } = lineEnd;
        return Math.abs((y2 - y1) * point.x - (x2 - x1) * point.y + x2 * y1 - y2 * x1) / Math.sqrt(Math.pow(y2 - y1, 2) + Math.pow(x2 - x1, 2));
    };
    Math.getLineIntersection = function(p1, p2, p3, p4) {
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
    };
    Math.rayCast = function(polygons, rayStart, rayEnd) {
        let closestIntersection = null;
        for (let polygon of polygons) {
            for (let i = 0; i < polygon.length; i++) {
                let p1 = polygon[i];
                let p2 = polygon[(i + 1) % polygon.length];
                let intersection = Math.getLineIntersection(p1, p2, rayStart, rayEnd);
                if (!intersection) continue;
                if (!closestIntersection || Math.distanceBetween(rayStart, intersection) < Math.distanceBetween(rayStart, closestIntersection)) {
                    closestIntersection = intersection;
                }
            }
        }
        return closestIntersection;
    };
    Number.prototype.round = function(n) {
        const d = Math.pow(10, n);
        return Math.round((this + Number.EPSILON) * d) / d;
    };
})();
