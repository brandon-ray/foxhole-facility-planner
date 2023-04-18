if (isMobile && !isPhoneApp) {
    console.info('Mobile is disabled for now.');
    document.getElementById('loading').remove();
    document.getElementById('mobile-disabled-message').style.display = 'inline-block';
} else {
    game.loadVueApp = function() {
        let vueApp = new Vue({
            el: '#app',
            mounted: function () {
                game.appComponent = this;

                this.updateIsPlayScreen();
            },
            data: function () {
                return {
                    isPlayScreen: game.isPlayScreen,
                    isInMenu: game.isInMenu,
                    settings: game.settings,
                    sidebarVisible: true,
                    layerSelectionVisible: false,
                    regionSelectionVisible: false
                };
            },
            methods: {
                refresh: function() {
                    this.$forceUpdate();
                    game.boardUIComponent?.$forceUpdate();
                },
                updateIsPlayScreen: function (disableFullLoad) {
                    this.isPlayScreen = game.isPlayScreen;
                    this.isInMenu = game.isInMenu;
                    this.$forceUpdate();
                },
                reloadMenu: function () {
                    if (game.isPlayScreen) {
                        return;
                    }

                    game.reloadSettings();
                },
                gameLoaded: function () {
                    if (!game.isGameLoaded) {
                        game.isGameLoaded = true;
                        this.reloadMenu();
                    }
                },
                updateEntityOverlays: function() {
                    game.updateEntityOverlays();
                    game.updateSettings();
                },
                toggleProjectSetting: function(type, subtype) {
                    if (subtype) {
                        game.project.settings[type][subtype] = !game.project.settings[type][subtype];
                    } else {
                        game.project.settings[type] = !game.project.settings[type];
                    }
                    game.updateEntityOverlays();
                    game.updateSave();
                    this.refresh();
                },
                selectMapRegion: function(key) {
                    game.setMapRegion(key);
                    if (game.project.settings.regionKey) {
                        this.regionSelectionVisible = false;
                    }
                    this.refresh();
                }
            },
            template: html`
            <div ref="app" :class="{'colonial-faction': game.settings.displayFactionTheme && game.settings.selectedFaction === 'c', 'warden-faction': game.settings.displayFactionTheme && game.settings.selectedFaction === 'w', 'no-sidebar': !sidebarVisible }">
                <app-game-sidebar v-if="sidebarVisible"></app-game-sidebar>
                
                <div v-if="game.settings.showFacilityName && game.project.name && game.project.name !== 'Unnamed Facility' && game.project.name !== 'Unnamed Project'" class="project-banner">
                    <i class="fa fa-wrench" aria-hidden="true"></i> {{game.project.name}}
                </div>

                <div v-if="layerSelectionVisible" class="board-panel layer-selection">
                    <div class="board-panel-header">
                        <h4 class="float-left m-0" style="color: #eee"><i class="fa fa-cogs"></i> Toggle Layers</h4>
                        <button class="btn-small m-0 mr-1 float-right" title="Minimize Layers" @click="layerSelectionVisible = false"><i class="fa fa-window-minimize" aria-hidden="true"></i></button>
                    </div>
                    <div class="board-panel-body row p-1">
                        <div class="col">
                            <label class="btn-checkbox-wrapper d-block">
                                <button class="btn-small btn-float-left btn-checkbox" :class="{ 'btn-active': game.project.settings.showProductionIcons }" @click="toggleProjectSetting('showProductionIcons')"></button>
                                Production Icons
                            </label>
                            <label class="btn-checkbox-wrapper d-block">
                                <button class="btn-small btn-float-left btn-checkbox" :class="{ 'btn-active': game.project.settings.showRangeWhenSelected }" @click="toggleProjectSetting('showRangeWhenSelected')"></button>
                                Selection Ranges
                            </label>
                            <label class="btn-checkbox-wrapper d-block">
                                <button class="btn-small btn-float-left btn-checkbox" :class="{ 'btn-active': game.project.settings.ranges.resourceField }" @click="toggleProjectSetting('ranges', 'resourceField')"></button>
                                Resource Field Ranges
                            </label>
                            <label class="btn-checkbox-wrapper d-block">
                                <button class="btn-small btn-float-left btn-checkbox" :class="{ 'btn-active': game.project.settings.ranges.preventDecay }" @click="toggleProjectSetting('ranges', 'preventDecay')"></button>
                                Maintenance Ranges
                            </label>
                            <label class="btn-checkbox-wrapper d-block">
                                <button class="btn-small btn-float-left btn-checkbox" :class="{ 'btn-active': game.project.settings.ranges.crane }" @click="toggleProjectSetting('ranges', 'crane')"></button>
                                Crane Ranges
                            </label>
                            <label class="btn-checkbox-wrapper d-block">
                                <button class="btn-small btn-float-left btn-checkbox" :class="{ 'btn-active': game.project.settings.showWorldRegion }" @click="toggleProjectSetting('showWorldRegion')"></button>
                                World Region
                            </label>
                            <label v-for="(info, key) in REGION_LAYERS" class="btn-checkbox-wrapper d-block">
                                <button class="btn-small btn-float-left btn-checkbox" :class="{ 'btn-active': game.project.settings.region[key] }" @click="toggleProjectSetting('region', key)"></button>
                                {{info.name}}
                            </label>
                        </div>
                        <div class="col">
                            <label class="btn-checkbox-wrapper d-block">
                                <button class="btn-small btn-float-left btn-checkbox" :class="{ 'btn-active': game.project.settings.ranges.killbox }" @click="toggleProjectSetting('ranges', 'killbox')"></button>
                                Rifle Ranges
                            </label>
                            <label class="btn-checkbox-wrapper d-block">
                                <button class="btn-small btn-float-left btn-checkbox" :class="{ 'btn-active': game.project.settings.ranges.killboxMG }" @click="toggleProjectSetting('ranges', 'killboxMG')"></button>
                                Machine Gun Ranges
                            </label>
                            <label class="btn-checkbox-wrapper d-block">
                                <button class="btn-small btn-float-left btn-checkbox" :class="{ 'btn-active': game.project.settings.ranges.killboxAT }" @click="toggleProjectSetting('ranges', 'killboxAT')"></button>
                                Anti Tank Ranges
                            </label>
                            <label class="btn-checkbox-wrapper d-block">
                                <button class="btn-small btn-float-left btn-checkbox" :class="{ 'btn-active': game.project.settings.ranges.killboxRocket }" @click="toggleProjectSetting('ranges', 'killboxRocket')"></button>
                                Rocket Ranges
                            </label>
                            <label class="btn-checkbox-wrapper d-block">
                                <button class="btn-small btn-float-left btn-checkbox" :class="{ 'btn-active': game.project.settings.ranges.killboxArty }" @click="toggleProjectSetting('ranges', 'killboxArty')"></button>
                                Artillery Ranges
                            </label>
                            <label class="btn-checkbox-wrapper d-block">
                                <button class="btn-small btn-float-left btn-checkbox" :class="{ 'btn-active': game.project.settings.ranges.radio }" @click="toggleProjectSetting('ranges', 'radio')"></button>
                                Radio Ranges
                            </label>
                        </div>
                    </div>
                </div>

                <app-menu-statistics></app-menu-statistics>

                <div v-if="regionSelectionVisible" class="board-panel world-region-selection" style="transform: scale(0.95)">
                    <div class="board-panel-header">
                        <h4 class="float-left m-0" style="color: #eee"><i class="fa fa-map-o"></i> Select Map Region (Preview)</h4>
                        <button class="btn-small m-0 mr-1 float-right" title="Minimize Map" @click="regionSelectionVisible = false"><i class="fa fa-window-minimize" aria-hidden="true"></i></button>
                    </div>
                    <div class="board-panel-body">
                        <div class="region-selection-info info-tooltip top-left">Select a region and it will become the backdrop for your project.</div>
                        <div class="region-selection-info info-tooltip top-left-2">Select a region again to deselect it.</div>
                        <div class="region-selection-info info-tooltip top-right">Regions will have a white border around them when they are selected.</div>
                        <template v-for="(map, key) in gameData.maps">
                            <div class="region-map-hex" :style="{
                                    marginTop: ((-55 + (map.gridCoord.y * 110)) + (map.gridCoord.x * 55)) + 'px',
                                    marginLeft: (-64 + (map.gridCoord.x * 96)) + 'px'
                                }" :title="'Select ' + map.name" :class="{'hex-selected': key === game.project.settings.regionKey }" @click="selectMapRegion(key)">
                                <div class="d-flex justify-content-center align-items-center text-center" :style="{backgroundImage: 'url(' + map.icon + ')'}">
                                    <div>{{map.name}}</div>
                                </div>
                            </div>
                        </template>
                        <div class="region-selection-info bottom-right">Early Preview</div>
                    </div>
                </div>

                <app-game-toolbelt></app-game-toolbelt>
                
                <app-game-hub-popup></app-game-hub-popup>

                <app-game-confirmation-popup></app-game-confirmation-popup>

                <div class="footer">
                    <app-board-ui></app-board-ui>
                    <button class="btn-small btn-float-left" :class="{ 'btn-active': !sidebarVisible }" title="Toggle Sidebar Menu" @click="sidebarVisible = !sidebarVisible">
                        <i class="fa" :class="{'fa-chevron-left': sidebarVisible, 'fa-chevron-right': !sidebarVisible}" aria-hidden="true"></i>
                    </button>
                    <label class="btn-checkbox-wrapper float-left">
                        <button class="btn-small btn-float-left btn-checkbox" :class="{ 'btn-active': settings.enableGrid }" @click="settings.enableGrid = !settings.enableGrid; game.updateSettings()"></button>
                        Snap to Grid
                    </label>
                    <label class="btn-checkbox-wrapper float-left">
                        <button class="btn-small btn-float-left btn-checkbox" :class="{ 'btn-active': settings.enableSnapRotation }" @click="settings.enableSnapRotation = !settings.enableSnapRotation; game.updateSettings()"></button>
                        Snap Rotation
                    </label>
                    <div class="panel-toolbar">
                        <label class="btn-checkbox-wrapper">
                            <button class="btn-small btn-float-left" :class="{ 'btn-active': game.hubPopup?.visible }" @click="game.hubPopup.showPopup()"><i class="fa fa-home" aria-hidden="true"></i></button>
                            Hub
                        </label>
                        <label class="btn-checkbox-wrapper">
                            <button class="btn-small btn-float-left" :class="{ 'btn-active': layerSelectionVisible }" title="Toggle Visual Layers" @click="layerSelectionVisible = !layerSelectionVisible"><i class="fa fa-cogs" aria-hidden="true"></i></button>
                            Layers
                        </label>
                        <label class="btn-checkbox-wrapper">
                            <button class="btn-small btn-float-left" :class="{ 'btn-active': settings.showToolbelt }" @click="settings.showToolbelt = !settings.showToolbelt; game.updateSettings()"><i class="fa fa-wrench" aria-hidden="true"></i></button>
                            Toolbelt
                        </label>
                        <label class="btn-checkbox-wrapper">
                            <button class="btn-small btn-float-left" :class="{ 'btn-active': regionSelectionVisible }" title="Toggle Region Selection" @click="regionSelectionVisible = !regionSelectionVisible"><i class="fa fa-map-o" aria-hidden="true"></i></button>
                            Map
                        </label>
                        <label class="btn-checkbox-wrapper">
                            <button class="btn-small btn-float-left" :class="{ 'btn-active': settings.enableStats }" @click="settings.enableStats = !settings.enableStats; game.updateSettings()"><i class="fa fa-bar-chart" aria-hidden="true"></i></button>
                            Stats
                        </label>
                    </div>
                    <button class="btn-small" title="Toggle Fullscreen" @click="game.tryFullscreen()">
                        <i class="fa fa-arrows-alt" aria-hidden="true"></i>
                    </button>
                    <button class="btn-small" :class="{'btn-active': game.settings.enableDarkMode}" title="Toggle Dark Mode" @click="game.setDarkMode(!game.settings.enableDarkMode)">
                        <i class="fa fa-moon-o" aria-hidden="true"></i>
                    </button>
                    <button class="btn-small" title="Clear Board" @click="game.confirmDeletion()">
                        <i class="fa fa-trash" aria-hidden="true"></i>
                    </button>
                    <button class="btn-small" title="Center Board" @click="game.zoomToEntitiesCenter()">
                        <i class="fa fa-crosshairs" aria-hidden="true"></i>
                    </button>
                    <button class="btn-small" :class="{'btn-active': game.settings.showFooterInfo}" title="Toggle Board Info" @click="game.settings.showFooterInfo = !game.settings.showFooterInfo; game.updateSettings()">
                        <i class="fa fa-info" aria-hidden="true"></i>
                    </button>
                    <button v-if="game.settings.enableHistory" class="btn-small" title="Redo" @click="game.redo()">
                        <i class="fa fa-repeat" aria-hidden="true"></i>
                    </button>
                    <button v-if="game.settings.enableHistory" class="btn-small" title="Undo" @click="game.undo()">
                        <i class="fa fa-undo" aria-hidden="true"></i>
                    </button>
                    <button class="btn-small" :class="{ 'btn-active': game.playMode }" :title="game.playMode ? 'Pause' : 'Resume'" @click="game.setPlaying(!game.playMode)">
                        <i class="fa" :class="{ 'fa-pause': game.playMode, 'fa-play': !game.playMode }" aria-hidden="true"></i>
                    </button>
                </div>
            </div>
            `
        });
    }
}

Vue.component('app-board-ui', {
    mounted: function () {
        game.boardUIComponent = this;
    },
    data: function () {
        return {
            scaleUnits: 1,
            boardScale: 1
        };
    },
    methods: {
        refresh: function() {
            this.scaleUnits = 1;
            this.boardScale = METER_BOARD_PIXEL_SIZE * game.camera.zoom;
            while (this.boardScale < (METER_BOARD_PIXEL_SIZE / this.scaleUnits)) {
                this.scaleUnits += 1;
            }
            this.$forceUpdate();
        }
    },
    template: html`
    <div v-if="game.settings.showFooterInfo" class="board-scale-ui">
        <div class="mr-2">{{game.constructionMode.title}}</div>
        <div v-if="game.project.settings.regionKey" class="mr-2">{{gameData.maps[game.project.settings.regionKey].name}}</div>
        {{scaleUnits}}m
        <div class="board-scale-tile" :style="{ width: ((scaleUnits * boardScale) / WINDOW_SCALE) + 'px' }"></div>
    </div>
    `
});

Vue.component('app-game-hub-popup', {
    mounted: function() {
        game.hubPopup = this;
        this.selectedTab = this.tabContent[0];
    },
    data: function() {
        return {
            visible: false,
            scrollTopButton: false,
            maximized: false,
            hoverData: null,
            selectedTab: null,
            tabContent: [
                {
                    key: 'home',
                    title: 'Home',
                    icon: 'fa-home'
                },
                {
                    key: 'updates',
                    title: 'Updates',
                    icon: 'fa-bullhorn' // fa-newspaper-o
                },
                /*
                {
                    key: 'saves',
                    title: 'Load/Save',
                    icon: 'fa-upload'
                },
                {
                    key: 'presets',
                    title: 'Presets',
                    icon: 'fa-th' // fa-cubes
                },
                */
                {
                    key: 'settings',
                    title: 'Settings',
                    icon: 'fa-cog'
                },
                {
                    key: 'about',
                    title: 'About',
                    icon: 'fa-question-circle'
                },
            ]
        };
    },
    methods: {
        refresh: function() {
            this.$forceUpdate();
        },
        showTab: function(key) {
            this.showPopup(true, key);
        },
        showPopup: function(visible = !this.visible, key = 'home') {
            for (const tab in this.tabContent) {
                if (this.tabContent[tab].key === key) {
                    this.selectedTab = this.tabContent[tab];
                    break;
                }
            }
            this.visible = visible;
            this.refresh();
            this.$nextTick(() => {
                this.scrollToTop(true);
            });
        },
        handleBodyScroll: function() {
            if (this.$refs.hubBody) {
                if (this.$refs.hubBody.scrollTop > 100) {
                    this.scrollTopButton = true;
                } else {
                    this.scrollTopButton = false;
                }
            }
        },
        scrollToTop: function(instant = false) {
            this.scrollTopButton = false;
            if (this.$refs.hubBody) {
                this.$refs.hubBody.scrollTo({
                    top: 0,
                    behavior: instant ? 'instant' : 'smooth'
                });
            }
        }
    },
    template: html`
    <div v-if="visible" class="board-panel hub-dialog" :class="{ 'maximized': maximized, 'sidebar-names': game.settings.showExpandedHubSidebar }">
        <div class="board-panel-header">
            <h4 class="float-left m-0" style="color: #eee"><img src="/favicon_white.ico" height="28px" style="vertical-align: top; opacity: 0.25"> Planner Hub <span class="text-muted">/</span> {{selectedTab.title}}</h4>
            <button class="btn-small m-0 mr-1 float-right" title="Close Hub" @click="showPopup(false)"><i class="fa fa-times" aria-hidden="true"></i></button>
            <button class="btn-small m-0 mr-2 float-right" :class="{'btn-active': maximized}" :title="maximized ? 'Minimize Hub' : 'Maximize Hub'" @click="maximized = !maximized; refresh()"><i class="fa fa-window-maximize" aria-hidden="true"></i></button>
        </div>
        <div class="d-flex board-panel-body">
            <div class="hub-sidebar h-100 text-center p-0 position-relative justify-content-center align-items-center">
                <div v-for="tab in tabContent" class="hub-sidebar-tab" :class="{ 'selected': selectedTab.key === tab.key }" :title="tab.title" @click="showTab(tab.key)">
                    <i class="fa fa-2x" :class="tab.icon"></i><br>
                    <span v-if="game.settings.showExpandedHubSidebar">{{tab.title}}</span>
                </div>
                <div class="hub-sidebar-tab position-absolute w-100 p-1" style="bottom: 0" :title="game.settings.showExpandedHubSidebar ? 'Retract Sidebar' : 'Extend Sidebar'" @click="game.settings.showExpandedHubSidebar = !game.settings.showExpandedHubSidebar; game.updateSettings()">
                    <i class="fa fa-2x" :class="{'fa-angle-right': !game.settings.showExpandedHubSidebar, 'fa-angle-left': game.settings.showExpandedHubSidebar}" aria-hidden="true"></i>
                </div>
            </div>
            <div v-if="selectedTab" class="hub-body w-100" @scroll="handleBodyScroll" ref="hubBody">
                <transition name="fall-in" mode="out-in">
                    <component :is="'app-hub-' + selectedTab.key" :key="selectedTab.key"></component>
                </transition>
            </div>
            <button class="scroll-top-button" :class="{ 'visible': scrollTopButton }" @click="scrollToTop()">
                <i class="fa fa-2x fa-angle-up"></i>
            </button>
        </div>
    </div>
    `
});

Vue.component('app-hub-home', {
    template: html`
    <div class="tab-content">
        <div class="fall-in-item">
            <div class="tab-content-header">
                <i class="fa fa-home"></i> Welcome to the Planner Hub!
            </div>
            <p class="tab-content-body">
                The Planner Hub is a new feature being developed that will give you easy access to changelogs, presets, settings, and more in the future.
            </p>
        </div>
        <div class="fall-in-item">
            <div class="tab-content-header">
                <i class="fa fa-bullhorn"></i> Check "Updates" for the latest changes!
            </div>
            <div class="tab-content-body">
                <div class="tab-content-body-img-wrapper m-0">
                    <img src="/assets/updates/04112023.jpg">
                </div>
            </div>
        </div>
    </div>
    `
});

Vue.component('app-hub-updates', {
    template: html`
    <div class="tab-content">
        <div class="fall-in-item">
            <div class="tab-content-header">
                <i class="fa fa-bullhorn"></i> Settings & Performance Update
                <small class="float-right">April 11th, 2023</small>
            </div>
            <div class="tab-content-body">
                <div class="tab-content-body-img-wrapper">
                    <img src="/assets/updates/04112023.jpg">
                </div>
                <h4>Major Changes</h4>
                <ul>
                    <li>Added lazy loading of texture assets. Reduces load times, can be disabled in settings.</li>
                    <li>Moved settings page to hub and updated visuals.</li>
                </ul>
                <h4>Other Changes</h4>
                <ul>
                    <li>Added position / rotation to selections.</li>
                    <li>Added tier up / down buttons for various structures.</li>
                    <li>Updated costs of various tiered structures.</li>
                    <li>Added go-to buttons for aligning camera with a selected object.</li>
                    <li>Added delete project button to Load/Save menu.</li>
                    <li>Presets will now be sorted by name.</li>
                    <li>Updated Hub visuals, toggleable tab names, and maximize / minimize window.</li>
                    <li>Selections automatically snap to nearest structures when rotated.</li>
                    <li>Updated confirmation messaging when clearing the board, deleting project, etc.</li>
                </ul>
                <h4>Experimental Changes</h4>
                <ul>
                    <li>Added Tier 2-3 bunker base to upgrades for that tier.</li>
                    <li>Added Toolbelt Modes:
                        <ul>
                            <li><b>Create Only:</b> Create a new structure each time you activate a toolbelt slot.</li>
                            <li><b>Modify Single:</b> Modify the selected structure to the type of the activated toolbelt slot if only one structure is selected, otherwise create the structure.</li>
                            <li><b>Modify Selection:</b> Modify all of the selected structures to the type of the activated toolbelt slot, otherwise create a single structure.</li>
                        </ul>
                    </li>
                    <li>Added mirroring / flipping selections with F key and SHIFT + F.</i>
                        <ul>
                            <li>Bunkers are supported, but not much else. Use with caution. Still WIP.</li>
                        </ul>
                    </li>
                    <li>Added toggleable setting for Line-of-Sight ranges.</li>
                </ul>
                <h4>Bug Fixes</h4>
                <ul>
                    <li>Fixed issue with selections becoming unaligned when snapped.</li>
                </ul>
            </div>
        </div>
        <div class="fall-in-item">
            <div class="tab-content-header">
                <i class="fa fa-bullhorn"></i> Motorcycles Update? 🤔
                <small class="float-right">April 1st, 2023</small>
            </div>
            <div class="tab-content-body">
                <div class="tab-content-body-img-wrapper">
                    <img src="/assets/updates/04012023.jpg">
                </div>
                <h4>Major Changes</h4>
                <ul>
                    <li>Added 100+ new placeable objects including: <i><b>Tanks, Armored Vehicles, Field Weapons, Ships, Emplaced Weapons, and more!</b></i></li>
                    <li>Added Barbed Wire Fence, Shipping Crate, Storage Box, and Fire Pit.</li>
                    <li>Added references for Sulfur, Salvage, and Component Mines.</li>
                    <li>Updated scale of buildings to better reflect distances on the grid. One meter is now equal to one grid square.</li>
                    <li>Updated searching to use the Fuse.js library with the ability to search by name, category, descriptions, and even preset creators!</li>
                </ul>
                <h4>Other Changes</h4>
                <ul>
                    <li>Added toggleable distance to line tool, aka measuring / ruler tool.</li>
                    <li>Added toggleable board info such as region and scale.</li>
                    <li>Added costs for Construction Vehicle, Advanced Construction Vehicle, and Crane. Also moved to Utilities for game parity.</li>
                    <li>Added tabs to the construction menu for filtering bunkers, facilities, vehicles.</li>
                    <li>Added range to BMS - Class 2 Mobile Auto-Crane and fixed hitbox.</li>
                    <li>Updated texture for BMS Foreman Stacker.</li>
                    <li>Updated range for T1 Rifle Garrison.</li>
                    <li>Fixed trench connector visual issues. (Dev Branch)</li>
                    <li>Updated all presets to the latest save version.</li>
                </ul>
                <h4>Experimental Changes</h4>
                <ul>
                    <li>Added experimental map region selection / backdrop.</li>
                </ul>
            </div>
        </div>
        <div class="fall-in-item">
            <div class="tab-content-header">
                <i class="fa fa-bullhorn"></i> Bunker & Trenches Update
                <small class="float-right">March 1st, 2023</small>
            </div>
            <div class="tab-content-body">
                <div class="tab-content-body-img-wrapper">
                    <img src="/assets/updates/03012023.jpg">
                </div>
                <h4>Major Changes</h4>
                <ul>
                    <li>Added Bunkers, Trenches, and Trench Encampments with their tier upgrades.</li>
                    <li>Added Bunker Health / Repair / Structural Integrity Stats.</li>
                    <li>Added Community Modules & Presets! You can submit your plans / projects in our Discord so that you can be featured in the planner!</li>
                    <li>Added toolbelts. The ability to assign 0-9 as hotkeys for any placeable structure in the planner with up to 10 toolbelts to switch between.</li>
                </ul>

                <h4>Notable Recent Changes</h4>
                <ul>
                    <li>Added ability to toggle the sidebar menu.</li>
                    <li>Added ability to show stats for only selected buildings.</li>
                    <li>Added Tier 1-3 Walls and Gates.</li>
                    <li>Added Barge and Freighter.</li>
                    <li>Added save versioning so we can automatically upgrade saves with changes for the planner.</li>
                    <li>Updated controls information for newly added hotkeys: Q/E, WASD, etc.</li>
                    <li>Bunkers, Trenches, and Trench Encampments had their socket positions updated so that they should be more accurately positioned when snapped.</li>
                </ul>

                <h4>Experimental Changes</h4>
                <ul>
                    <li>Added experimental weapon damage stats for bunkers.</li>
                    <li>Added image importing with drag and drop or pasting the image into the planner.</li>
                </ul>

                <h4>Upcoming Experimental Changes</h4>
                <ul>
                    <li>Sorting Fixes: There's still some weird z-sorting for certain bunker upgrades that need to be dealt with for range occlusions to work properly.</li>
                </ul>
            </div>
        </div>
    </div>
    `
});

/*
Vue.component('app-hub-presets', {
    methods: {
        buildBuilding: function(building) {
            this.bmc();
            game.createObject(building);
            game.sidebarMenuComponent.showHoverMenu(null);
            this.showPopup(false);
        },
        buildingHover: function(building) {
            game.sidebarMenuComponent.showHoverMenu(building);
        }
    },
    template: html`
    <div class="tab-content">
        <div class="preset-gallery">
            <app-game-building-list-icon-v2 v-for="preset in window.objectData.categories.showcase.buildings" :container="game.hubPopup" :building="preset" />
        </div>
    </div>
    `
});
*/

Vue.component('app-hub-settings', {
    methods: {
        toggleSetting: function(setting) {
            game.settings[setting] = !game.settings[setting];
            game.updateSettings();
        },
        updateSettings: function() {
            game.settings.gridSize = Math.max(game.settings.gridSize, 1);
            game.settings.snapRotationDegrees = Math.min(Math.max(game.settings.snapRotationDegrees, 1), 360);
            game.settings.keySnapRotationDegrees = Math.min(Math.max(game.settings.keySnapRotationDegrees, 1), 360);
            game.settings.zoomSpeed = Math.min(Math.max(game.settings.zoomSpeed, 1), 5);
            game.updateSettings();
        }
    },
    template: html`
    <div class="tab-content">
        <div class="fall-in-item settings-option-wrapper">
            <div class="tab-content-header">
                <i class="fa fa-gear"></i> General Settings
            </div>
            <div class="tab-content-body container">
                <div class="row">
                    <label class="col-md-6 app-input-label" title="Disabling this will load all textures when you load the page.">
                        <i class="fa fa-picture-o" aria-hidden="true"></i> Lazy Load Images
                        <button class="btn-small btn-tickbox" :class="{ 'btn-active': game.settings.lazyLoadTextures }" @click="toggleSetting('lazyLoadTextures')"></button>
                    </label>
                    <label class="col-md-6 app-input-label">
                        <i class="fa fa-volume-up" aria-hidden="true"></i> Volume ({{game.settings.volume * 100}}%)
                        <input type="range" v-model="game.settings.volume" min="0" max="1" step="0.1" class="slider" @input="game.updateSettings()">
                    </label>
                </div>
                <div class="row">
                    <label class="col-md-6 app-input-label">
                        <i class="fa fa-flag" aria-hidden="true"></i> Display Faction Colors
                        <button class="btn-small btn-tickbox" :class="{ 'btn-active': game.settings.displayFactionTheme }" @click="toggleSetting('displayFactionTheme')"></button>
                    </label>
                    <label class="col-md-6 app-input-label">
                        <i class="fa fa-users" aria-hidden="true"></i> Selected Faction
                        <select class="app-input" v-model="game.settings.selectedFaction" @change="game.setFaction(game.settings.selectedFaction)">
                            <option :value="null">Neutral</option>
                            <option value="c">Colonials</option>
                            <option value="w">Wardens</option>
                        </select>
                    </label>
                </div>
                <div class="row">
                    <label class="col-md-6 app-input-label">
                        <i class="fa fa-history" aria-hidden="true"></i> Save History (Undo / Redo)
                        <button class="btn-small btn-tickbox" :class="{ 'btn-active': game.settings.enableHistory }" @click="toggleSetting('enableHistory')"></button>
                    </label>
                    <label class="col-md-6 app-input-label" :class="{'disabled': !game.settings.enableHistory}" title="The total amount of saves / actions that can be stored to undo / redo. Requires Save History to be enabled.">
                        <i class="fa fa-hdd-o" aria-hidden="true"></i> Stored History Size
                        <input class="app-input" type="number" v-model.number="game.settings.historySize" @input="game.updateSettings()" :disabled="!game.settings.enableHistory">
                    </label>
                </div>
                <div class="row">
                    <label class="col-md-6 app-input-label" :class="{'disabled': !game.settings.enableHistory}" title="Load the last save found in the browser. Requires Save History to be enabled.">
                        <i class="fa fa-upload" aria-hidden="true"></i> Auto-Load Last Save
                        <button class="btn-small btn-tickbox" :class="{ 'btn-active': game.settings.enableAutoLoading }" @click="toggleSetting('enableAutoLoading')" :disabled="!game.settings.enableHistory"></button>
                    </label>
                    <label class="col-md-6 app-input-label">
                        <i class="fa fa-flask" aria-hidden="true"></i> Enable Experimental Features
                        <button class="btn-small btn-tickbox" :class="{ 'btn-active': game.settings.enableExperimental }" @click="toggleSetting('enableExperimental')"></button>
                    </label>
                </div>
            </div>
        </div>
        <div class="fall-in-item settings-option-wrapper">
            <div class="tab-content-header">
                <i class="fa fa-cogs"></i> Board Configuration
            </div>
            <div class="tab-content-body container">
                <div class="row">
                    <label class="col-md-6 app-input-label">
                        <i class="fa fa-header" aria-hidden="true"></i> Display Project Name
                        <button class="btn-small btn-tickbox" :class="{ 'btn-active': game.settings.showFacilityName }" @click="toggleSetting('showFacilityName')"></button>
                    </label>
                    <label class="col-md-6 app-input-label">
                        <i class="fa fa-moon-o" aria-hidden="true"></i> Enable Dark Mode
                        <button class="btn-small btn-tickbox" :class="{ 'btn-active': game.settings.enableDarkMode }" @click="game.setDarkMode(!game.settings.enableDarkMode)"></button>
                    </label>
                </div>
                <div class="row">
                    <label class="col-md-6 app-input-label">
                        <i class="fa fa-arrow-circle-up" aria-hidden="true"></i> Bring Selected to Front
                        <button class="btn-small btn-tickbox" :class="{ 'btn-active': game.settings.bringSelectedToFront }" @click="toggleSetting('bringSelectedToFront')"></button>
                    </label>
                    <label class="col-md-6 app-input-label">
                        <i class="fa fa-mouse-pointer" aria-hidden="true"></i> Disable Locked Selection
                        <button class="btn-small btn-tickbox" :class="{ 'btn-active': game.settings.disableLockedMouseEvents }" @click="toggleSetting('disableLockedMouseEvents')"></button>
                    </label>
                </div>
                <div class="row">
                    <label class="col-md-6 app-input-label">
                        <i class="fa fa-cube" aria-hidden="true"></i> Show Selection Stats
                        <button class="btn-small btn-tickbox" :class="{ 'btn-active': game.settings.enableSelectionStats }" @click="toggleSetting('enableSelectionStats'); game.refreshStats()"></button>
                    </label>
                    <label class="col-md-6 app-input-label" :class="{'disabled': !game.settings.enableSelectionStats}" title="Enabling this will require multiple objects to be selected for their stats to be displayed. Requires Selection Stats to be enabled.">
                        <i class="fa fa-cubes" aria-hidden="true"></i> Require Multi-Selection for Stats
                        <button class="btn-small btn-tickbox" :class="{ 'btn-active': game.settings.statsRequireMultiSelection }" @click="toggleSetting('statsRequireMultiSelection'); game.refreshStats()" :disabled="!game.settings.enableSelectionStats"></button>
                    </label>
                </div>
                <div class="row">
                    <label class="col-md-6 app-input-label">
                        <i class="fa fa-arrows" aria-hidden="true"></i> Enable Snap to Grid
                        <button class="btn-small btn-tickbox" :class="{ 'btn-active': game.settings.enableGrid }" @click="toggleSetting('enableGrid')"></button>
                    </label>
                    <label class="col-md-6 app-input-label">
                        <i class="fa fa-repeat" aria-hidden="true"></i> Enable Snap Rotation
                        <button class="btn-small btn-tickbox" :class="{ 'btn-active': game.settings.enableSnapRotation }" @click="toggleSetting('enableSnapRotation')"></button>
                    </label>
                </div>
                <div class="row">
                    <label class="col-md-6 app-input-label">
                        <i class="fa fa-th-large" aria-hidden="true"></i> Grid Snap Size
                        <input class="app-input" type="number" v-model.number="game.settings.gridSize" min="1" @change="updateSettings()">
                    </label>
                    <label class="col-md-6 app-input-label" :class="{'disabled': !game.settings.enableSnapRotation}" title="Requires Snap Rotation to be enabled.">
                        <i class="fa fa-repeat" aria-hidden="true"></i> Mouse Snap Degrees
                        <input class="app-input" type="number" v-model.number="game.settings.snapRotationDegrees" min="1" max="360" @change="updateSettings()" :disabled="!game.settings.enableSnapRotation">
                    </label>
                </div>
                <div class="row">
                    <label class="col-md-6 app-input-label">
                        <i class="fa fa-repeat" aria-hidden="true"></i> Hotkey Rotation Degrees
                        <input class="app-input" type="number" v-model.number="game.settings.keySnapRotationDegrees" min="1" max="360" @change="updateSettings()">
                    </label>
                    <label class="col-md-6 app-input-label">
                        <i class="fa fa-search-plus" aria-hidden="true"></i> Zoom Speed
                        <input class="app-input" type="number" v-model.number="game.settings.zoomSpeed" min="1" max="5" @change="updateSettings()">
                    </label>
                </div>
                <div class="row">
                    <label class="col-md-6 app-input-label" :class="{'disabled': !game.settings.enableExperimental}" title="Changes behavior of the toolbelt hotkeys. By default, hotkeys will spawn a new object if nothing is selected. Requires Experimental Features to be enabled.">
                        <i class="fa fa-wrench" aria-hidden="true"></i> Toolbelt Mode
                        <select class="app-input" v-model.number="game.settings.toolbeltMode" @change="game.updateSettings()" :disabled="!game.settings.enableExperimental">
                            <option :value="0">Create Only</option>
                            <option value="1">Modify Single</option>
                            <option value="2">Modify Selection</option>
                        </select>
                    </label>
                    <label class="col-md-6 app-input-label" :class="{'disabled': !game.settings.enableExperimental}" title="Allows you to display LOS for certain structures: Pillboxes, Bunkers, etc. Requires Experimental Features to be enabled.">
                        <i class="fa fa-eye" aria-hidden="true"></i> Enable Line-of-Sight Ranges
                        <button class="btn-small btn-tickbox" :class="{ 'btn-active': game.settings.showLineOfSightRanges }" @click="toggleSetting('showLineOfSightRanges')" :disabled="!game.settings.enableExperimental"></button>
                    </label>
                </div>
            </div>
        </div>
        <div class="fall-in-item settings-option-wrapper">
            <div class="tab-content-header">
                <i class="fa fa-sliders"></i> Construction Filters
            </div>
            <div class="tab-content-body container">
                <div class="row">
                    <label class="col-md-6 app-input-label">
                        <i class="fa fa-folder-open" aria-hidden="true"></i> Default Category
                        <select class="app-input" v-model="game.settings.defaultBuildingCategory" @change="game.updateSettings()">
                            <option value="all">All Buildings</option>
                            <template v-for="(category, key) in window.objectData.categories">
                                <option v-if="game.canShowListCategory(category, true)" :value="key">{{category.name}}</option>
                            </template>
                        </select>
                    </label>
                    <label class="col-md-6 app-input-label">
                        <i class="fa fa-users" aria-hidden="true"></i> Selected Faction
                        <select class="app-input" v-model="game.settings.selectedFaction" @change="game.setFaction(game.settings.selectedFaction)">
                            <option :value="null">Neutral</option>
                            <option value="c">Colonials</option>
                            <option value="w">Wardens</option>
                        </select>
                    </label>
                </div>
                <div class="row">
                    <label class="col-md-6 app-input-label">
                        <i class="fa fa-sitemap" aria-hidden="true"></i> Selected Tech Tier
                        <select class="app-input" v-model.number="game.settings.selectedTier" @change="game.updateSettings()">
                            <option value="1">Tier 1</option>
                            <option value="2">Tier 2</option>
                            <option value="3">Tier 3</option>
                        </select>
                    </label>
                    <label class="col-md-6 app-input-label">
                        <i class="fa fa-ban" aria-hidden="true"></i> Show Selected Tier Only
                        <button class="btn-small btn-tickbox" :class="{ 'btn-active': game.settings.showSelectedTierOnly }" @click="toggleSetting('showSelectedTierOnly')"></button>
                    </label>
                </div>
                <div class="row">
                    <label class="col-md-6 app-input-label">
                        <i class="fa fa-compress" aria-hidden="true"></i> Show Collapsible Building List
                        <button class="btn-small btn-tickbox" :class="{ 'btn-active': game.settings.showCollapsibleBuildingList }" @click="toggleSetting('showCollapsibleBuildingList')"></button>
                    </label>
                    <label class="col-md-6 app-input-label">
                        <i class="fa fa-chevron-circle-up" aria-hidden="true"></i> Show All Upgrades in List
                        <button class="btn-small btn-tickbox" :class="{ 'btn-active': game.settings.showUpgradesAsBuildings }" @click="toggleSetting('showUpgradesAsBuildings')"></button>
                    </label>
                </div>
                <div class="row">
                    <label class="col-md-6 app-input-label">
                        <i class="fa fa-sitemap" aria-hidden="true"></i> Show Base Production Recipes
                        <button class="btn-small btn-tickbox" :class="{ 'btn-active': game.settings.showParentProductionList }" @click="toggleSetting('showParentProductionList')"></button>
                    </label>
                </div>
            </div>
        </div>
        <!-- <div class="fall-in-item">
            <button class="btn-small" @click="game.confirmResetSettings()">
                <i class="fa fa-undo" aria-hidden="true"></i>
            </button>
        </div> -->
    </div>
    `
});

Vue.component('app-hub-about', {
    template: html`
    <div class="tab-content">
        <div class="fall-in-item">
            <div class="tab-content-header"><i class="fa fa-question-circle"></i> What is Foxhole Planner?</div>
            <div class="tab-content-body">
                <p>
                    <b>Foxhole Planner</b> is a third-party web tool that enables players of <b>Foxhole</b> to plan and design their own custom bunkers, facilities, and structures from the game.
                </p>
                <p>
                    <b>Foxhole</b> is a massively multiplayer online game that simulates warfare in a persistent, player-driven world. It is set in a fictional universe where two factions, the <span @click="game.createBuildingAtCenter('sound_test'); game.hubPopup.showPopup(false)" style="cursor: pointer;">Wardens</span> and the Colonials, battle for control of territories and resources. <b><a href="https://store.steampowered.com/app/505460/Foxhole/" target="_blank">Purchase Foxhole on Steam</a></b>
                </p>
                <p>
                    With <b>Foxhole Planner</b>, players can experiment with different layouts and configurations for their structures, and then use the resulting plan as a blueprint to guide their in-game construction efforts.
                </p>
            </div>
        </div>
        <div class="fall-in-item discord-cta">
            <div class="tab-content-header"><i class="fa fa-comments-o" aria-hidden="true"></i> Don't forget to join our Discord!</div>
            <div class="tab-content-body">
                <p class="text-right" style="font-size: 1.28em">
                    Join our community to share designs, get support,<br>
                    and follow the development of Foxhole Planner!
                </p>
                <div class="text-center" style="position: absolute; bottom: 20px; right: 235px;">
                    Need developer help?<br>
                    <a href="https://discord.gg/SnyEDQyAVr" target="_blank">Join with this link instead.</a>
                </div>
                <a href="https://discord.gg/2hgaMQN26s" target="_blank">Join Our Discord <i class="fa fa-arrow-right" aria-hidden="true"></i></a>
            </div>
        </div>
        <div class="fall-in-item container mt-2">
            <div class="row" style="line-height: 22px;">
                <div class="col-md-6" style="font-size: 17px;">Made with ❤️ by <a href="https://bombsightgames.com/" target="_blank">Ray</a> and <a href="https://github.com/jimdcunningham" target="_blank">Jimbo</a>.</div>
                <div class="col-md-6" style="font-size: 14px;"><a href="https://www.foxholegame.com/" target="_blank">Foxhole</a> is a registered trademark of <a href="https://www.siegecamp.com/" target="_blank">Siege Camp</a>.</div>
            </div>
            <div class="row">
                <div class="col-md-6" style="font-size: 13px;">Map Assets from <a href="https://sentsu.itch.io/foxhole-better-map-mod" target="_blank">Better Map Mod</a> by <a href="https://sentsu.itch.io/" target="_blank">Sentsu</a>.</div>
                <div class="col-md-6" style="font-size: 11px;">We are not affiliated with Siege Camp, this is a fan project.</div>
            </div>
        </div>
    </div>
    `
});

Vue.component('app-game-confirmation-popup', {
    mounted: function() {
        game.confirmationPopup = this;
    },
    data: function() {
        return {
            type: null,
            callback: null,
            confirmationVisible: false
        };
    },
    methods: {
        showPopup: function(type, callback) {
            this.type = type;
            this.callback = callback;
            this.confirmationVisible = true;
            this.$forceUpdate();
        },
        closePopup: function(confirmed) {
            this.confirmationVisible = false;
            if (typeof this.callback === 'function') {
                setTimeout(this.callback(confirmed), 1);
            }
            this.removePopup();
        },
        removePopup: function() {
            this.confirmationVisible = false;
            this.type = null;
            this.callback = null;
        }
    },
    template: html`
    <div v-if="confirmationVisible" class="board-panel confirmation-dialog">
        <template v-if="type === 'delete'">
            <div class="board-panel-header">
                <h4 class="float-left m-0" style="color: #eee"><i class="fa fa-trash"></i> Confirm Deletion</h4>
                <button class="btn-small m-0 mr-1 float-right" title="Close" @click="closePopup(false)"><i class="fa fa-times" aria-hidden="true"></i></button>
            </div>
            <p class="board-panel-body">
                This will delete all objects you have placed.<br>
                <template v-if="!(game.settings.enableHistory && game.constructionHistory.length)">Note: This <u>cannot</u> be undone.</template>
                <template v-else>Note: Objects can be recovered with undo.</template>
                <button @click="closePopup(true)">Erase Board</button>
            </p>
        </template>
        <template v-else-if="type === 'save-work'">
            <div class="board-panel-header">
                <h4 class="float-left m-0" style="color: #eee"><i class="fa fa-upload"></i> Confirm Load</h4>
                <button class="btn-small m-0 mr-1 float-right" title="Close" @click="closePopup(false)"><i class="fa fa-times" aria-hidden="true"></i></button>
            </div>
            <p class="board-panel-body">
                Your current work will be lost if you don't save.<br>
                <template v-if="!(game.settings.enableHistory && game.constructionHistory.length)">Note: This <u>cannot</u> be undone.</template>
                <template v-else>Note: Projects can be recovered with undo.</template>
                <button @click="closePopup(true)">Erase Board</button>
            </p>
        </template>
        <template v-else-if="type === 'new-project'">
            <div class="board-panel-header">
                <h4 class="float-left m-0" style="color: #eee"><i class="fa fa-trash"></i> Delete Project</h4>
                <button class="btn-small m-0 mr-1 float-right" title="Close" @click="closePopup(false)"><i class="fa fa-times" aria-hidden="true"></i></button>
            </div>
            <p class="board-panel-body">
                This will delete project settings, layers, and objects.<br>
                <template v-if="!(game.settings.enableHistory && game.constructionHistory.length)">Note: This <u>cannot</u> be undone.</template>
                <template v-else>Note: Projects can be recovered with undo.</template>
                <button @click="closePopup(true)">Erase Project & Board</button>
            </p>
        </template>
        <template v-else-if="type === 'reset-settings'">
            <div class="board-panel-header">
                <h4 class="float-left m-0" style="color: #eee"><i class="fa fa-undo"></i> Confirm Reset</h4>
                <button class="btn-small m-0 mr-1 float-right" title="Close" @click="closePopup(false)"><i class="fa fa-times" aria-hidden="true"></i></button>
            </div>
            <p class="board-panel-body">
                This will revert any changes you've made in settings.<br>
                Note: This <u>cannot</u> be undone.
                <button @click="closePopup(true)">Reset Settings</button>
            </p>
        </template>
    </div>
    `
});

Vue.component('app-game-toolbelt', {
    computed: {
        getSearchResults() {
            return game.getSearchResults(this.searchQuery, false);
        }
    },
    mounted: function() {
        game.toolbeltComponent = this;
        this.refresh();
    },
    data: function() {
        return {
            hoverData: null,
            confirmReset: false,
            activeItemIndex: null,
            activeItemTimeoutId: null,
            lastSlotClicked: null,
            toolbeltSelection: false,
            toolbeltItems: null,
            toolbeltSwap: false,
            searchQuery: null
        };
    },
    methods: {
        refresh: function(updateItems = true) {
            if (updateItems) {
                let toolbelt = game.settings.toolbelts[game.settings.selectedToolbelt], items = [];
                for (let i = 0; i < 10; i++) {
                    items.push((toolbelt && toolbelt[i]) ?? {});
                }
                this.toolbeltItems = items;
            }
            this.$forceUpdate();
        },
        showList: function(visible = true) {
            this.confirmReset = false;
            if (this.toolbeltSelection !== visible) {
                if (!visible) {
                    this.lastSlotClicked = null;
                }
                this.toolbeltSelection = visible;
                this.refresh(false);
            }
        },
        selectToolbelt: function(index) {
            if (game.settings.selectedToolbelt !== index) {
                game.settings.selectedToolbelt = index;
                game.updateSettings();
                this.refresh();
            }
        },
        activateToolbeltSlot: function(index, swapBelt) {
            if (swapBelt) {
                this.selectToolbelt(index);
            } else if (this.toolbeltItems) {
                let item = this.toolbeltItems[index];
                if (item?.type || item?.subtype) {
                    if (this.toolbeltSelection || this.toolbeltSwap) {
                        this.lastSlotClicked = null;
                        if (game.settings.toolbelts[game.settings.selectedToolbelt]) {
                            delete game.settings.toolbelts[game.settings.selectedToolbelt][index];
                        }
                        game.updateSettings();
                        this.refresh();
                    } else {
                        const selectedEntities = game.getSelectedEntities().length;
                        if (!selectedEntities || !game.settings.toolbeltMode || (game.settings.toolbeltMode === 1 && selectedEntities > 1)) {
                            game.createObject(item.subtype);
                        } else if (game.settings.toolbeltMode) {
                            game.exchangeSelected(item.subtype);
                        }
                        clearTimeout(this.activeItemTimeoutId);
                        this.activeItemIndex = index;
                        this.activeItemTimeoutId = setTimeout(() => {
                            this.activeItemIndex = null;
                        }, 200);
                    }
                } else if (this.lastSlotClicked === index) {
                    this.showList(false);
                } else {
                    this.lastSlotClicked = index;
                    this.showList();
                }
            }
        },
        resetToolbeltSlots: function() {
            if (!this.confirmReset) {
                this.confirmReset = true;
                this.refresh();
                return;
            }
            this.confirmReset = false;
            delete game.settings.toolbelts[game.settings.selectedToolbelt];
            game.updateSettings();
            this.refresh();
        },
        setToolbeltSwapping: function(swapping = false) {
            if (this.toolbeltSwap !== swapping) {
                this.toolbeltSwap = swapping;
                this.refresh(false);
            }
        },
        buildBuilding: function(building) {
            this.bmc();
            if (this.lastSlotClicked !== null) {
                if (!game.settings.toolbelts[game.settings.selectedToolbelt]) {
                    game.settings.toolbelts[game.settings.selectedToolbelt] = {};
                }
                game.settings.toolbelts[game.settings.selectedToolbelt][this.lastSlotClicked] = {
                    type: 'building',
                    subtype: building.key,
                    icon: building.icon
                };
                game.updateSettings();
                this.lastSlotClicked = null;
                this.refresh();
            }
        },
        buildingHover: function(building) {
            this.hoverData = building;
        },
        incrementTier: function() {
            this.bmc();
            game.settings.toolbeltFilters.selectedTier++;
            if (game.settings.toolbeltFilters.selectedTier >= 4) {
                game.settings.toolbeltFilters.selectedTier = 1;
            }
            game.updateSettings();
        }
    },
    template: html`
    <div v-if="game.settings.showToolbelt" id="toolbelt-panel" class="board-panel" :class="{'toolbelt-swapping': toolbeltSwap}">
        <div class="toolbelt-tabs d-flex">
            <div v-for="n in 10" class="toolbelt-tab" :class="{'active': (n - 1) === game.settings.selectedToolbelt}" @click="selectToolbelt(n - 1)"></div>
        </div>
        <div class="toolbelt-header d-flex">
            <div class="toolbelt-buttons d-flex w-100">
                <div v-for="(toolbeltItem, i) in toolbeltItems" :class="{'anim-active': activeItemIndex === i, 'item-selected': lastSlotClicked === i, 'deletion': toolbeltItem?.type && toolbeltSelection}" :style="{backgroundImage: toolbeltItem?.icon && ('url(' + toolbeltItem.icon + ')')}" @mouseenter="bme()" @click="bmc(); activateToolbeltSlot(i)">
                    <i v-if="!toolbeltItem?.icon || toolbeltSelection || confirmReset" class="fa fa-plus" :class="{'fa-trash': toolbeltItem?.type && (confirmReset || toolbeltSelection)}" aria-hidden="true"></i>
                    <small>{{i + 1 < 10 ? i + 1 : 0}}</small>
                </div>
            </div>
            <div class="toolbelt-end-buttons">
                <div class="btn-small" @click="resetToolbeltSlots()"><i class="fa" :class="{'fa-trash': !confirmReset, 'fa-check text-danger': confirmReset}" aria-hidden="true"></i></div>
                <div class="btn-small" :class="{'btn-active': toolbeltSelection}" @click="showList(!toolbeltSelection)"><i class="fa fa-gear" aria-hidden="true"></i></div>
            </div>
        </div>
        <template v-if="toolbeltSelection">
            <div class="toolbelt-selection-wrapper" :class="{'no-slot-selected': lastSlotClicked === null}">
                <div class="construction-options toolbelt-selection-filters d-flex">
                    <label class="construction-search w-100" title="Search">
                        <i class="fa fa-search" aria-hidden="true"></i>
                        <div class="input-wrapper">
                            <input type="text" v-model="searchQuery" placeholder="Search" @input="refresh()">
                            <i class="fa fa-close" :class="{'active': searchQuery}" aria-hidden="true" @click="searchQuery = null"></i>
                        </div>
                    </label>
                    <button class="btn-small construction-tech-button" @click="incrementTier()" title="Filter by Tier">
                        {{'Tier ' + game.settings.toolbeltFilters.selectedTier}}
                        <span class="label">tech</span>
                    </button>
                    <button class="btn-small construction-tech-button" @click="game.settings.toolbeltFilters.showSelectedTierOnly = !game.settings.toolbeltFilters.showSelectedTierOnly; game.updateSettings();" title="Exclude Previous Tiers">
                        {{game.settings.toolbeltFilters.showSelectedTierOnly ? 'Exclude' : 'All'}}
                        <span class="label">tier mode</span>
                    </button>
                </div>
                <div class="toolbelt-selection">
                    <template v-if="searchQuery">
                        <p v-if="!getSearchResults.length" class="px-2 py-1 text-center">Sorry, couldn't find anything with that name.</p>
                        <app-game-building-list-icon-v2 v-for="building in getSearchResults" :container="game.toolbeltComponent" :building="building" :search="searchQuery" :filters="game.settings.toolbeltFilters"/>
                    </template>
                    <template v-else>
                        <template v-for="(category, key) in window.objectData.categories">
                            <template v-if="game.canShowListCategory(category, true)">
                                <template v-for="building in category.buildings">
                                    <app-game-building-list-icon-v2 v-if="!building.preset" :container="game.toolbeltComponent" :building="building" :filters="game.settings.toolbeltFilters"/>
                                </template>
                            </template>
                        </template>
                    </template>
                </div>
            </div>
            <div class="hover-building-info">{{hoverData?.name || (lastSlotClicked !== null ? 'Select a structure to assign it to the selected slot.' : 'Select a slot in your toolbelt to assign a structure to it.')}}</div>
        </template>
    </div>
    `
});

Vue.component('app-game-building-list-icon-v2', {
    props: ['container', 'building', 'search', 'filters'],
    template: html`
    <div v-if="search || game.canShowListItem(building, search, filters)" class="build-icon" :class="{'ignore-transform': building.preset}" :title="building.name"
        :style="{backgroundImage:'url(' + ((building.baseIcon || (building.category !== 'entrenchments' && building.parent && !building.parentKey && building.parent.icon) || building.icon) ?? '/assets/default_icon.webp') + ')'}"
        @mouseenter="bme(); container.buildingHover(building)" @mouseleave="container.buildingHover(null)" @click="container.buildBuilding(building)">
        <div v-if="!building.baseIcon && !building.parentKey && building.parent?.icon && building.parent.icon !== building.icon" class="build-subicon" :title="building.parent.name" :style="{backgroundImage: 'url(' + ((building.category === 'entrenchments' && building.parent.icon) || building.icon) + ')'}"></div>
    </div>
    `
});