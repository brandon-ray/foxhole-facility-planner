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
                <app-game-game-menu></app-game-game-menu>
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
                            <label v-if="game.settings.enableExperimental" class="btn-checkbox-wrapper d-block">
                                <button class="btn-small btn-float-left btn-checkbox" :class="{ 'btn-active': game.project.settings.showWorldRegion }" @click="toggleProjectSetting('showWorldRegion')"></button>
                                World Region
                            </label>
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
                            <button class="btn-small btn-float-left" :class="{ 'btn-active': settings.enableStats }" @click="settings.enableStats = !settings.enableStats; game.updateSettings()"><i class="fa fa-bar-chart" aria-hidden="true"></i></button>
                            Stats
                        </label>
                        <label v-if="game.settings.enableExperimental" class="btn-checkbox-wrapper">
                            <button class="btn-small btn-float-left" :class="{ 'btn-active': regionSelectionVisible }" title="Toggle Region Selection" @click="regionSelectionVisible = !regionSelectionVisible"><i class="fa fa-map-o" aria-hidden="true"></i></button>
                            Map
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
                    icon: 'fa-home',
                    content: html`
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
                                <img src="/assets/updates/04012023.jpg">
                            </div>
                        </div>
                    </div>
                    `
                },
                {
                    key: 'updates',
                    title: 'Updates',
                    icon: 'fa-bullhorn', // fa-newspaper-o
                    content: html`
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
                    `
                },
                /*
                {
                    key: 'saves',
                    title: 'Load/Save',
                    icon: 'fa-upload',
                    content: html``
                },
                {
                    key: 'presets',
                    title: 'Presets',
                    icon: 'fa-th' // fa-cubes
                },
                {
                    key: 'settings',
                    title: 'Settings',
                    icon: 'fa-cog',
                    content: html``
                }
                */
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
            if (this.$refs.hubBody.scrollTop > 100) {
                this.scrollTopButton = true;
            } else {
                this.scrollTopButton = false;
            }
        },
        scrollToTop: function(instant = false) {
            this.$refs.hubBody.scrollTo({
                top: 0,
                behavior: instant ? 'instant' : 'smooth'
            });
        },
        /*
        buildBuilding: function(building) {
            this.bmc();
            game.createObject(building);
            game.sidebarMenuComponent.showHoverMenu(null);
            this.showPopup(false);
        },
        buildingHover: function(building) {
            game.sidebarMenuComponent.showHoverMenu(building);
        }
        */
    },
    template: html`
    <div v-if="visible" class="board-panel hub-dialog" :class="{ 'maximized': maximized, 'sidebar-names': game.settings.showExpandedHubSidebar }">
        <div class="board-panel-header">
            <h4 class="float-left m-0" style="color: #eee"><img src="/favicon_white.ico" height="28px" style="vertical-align: top; opacity: 0.25"> Planner Hub <span class="text-muted">/</span> {{selectedTab.title}}</h4>
            <button class="btn-small m-0 mr-1 float-right" title="Close Hub" @click="showPopup(false)"><i class="fa fa-times" aria-hidden="true"></i></button>
            <button class="btn-small m-0 mr-2 float-right" :title="maximized ? 'Minimize Hub' : 'Maximize Hub'" @click="maximized = !maximized; refresh()"><i class="fa fa-window-maximize" aria-hidden="true"></i></button>
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
                    <!-- <div v-if="selectedTab.key === 'presets'" class="tab-content" :key="selectedTab.key">
                        <div class="preset-gallery">
                            <app-game-building-list-icon-v2 v-for="preset in window.objectData.categories.showcase.buildings" :container="game.hubPopup" :building="preset" />
                        </div>
                    </div> -->
                    <div class="tab-content" :key="selectedTab.key" v-html="selectedTab.content"></div>
                </transition>
            </div>
            <button class="scroll-top-button" :class="{ 'visible': scrollTopButton }" @click="scrollToTop()">
                <i class="fa fa-2x fa-angle-up"></i>
            </button>
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
                Note: This <u>cannot</u> be undone.
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
                Note: This <u>cannot</u> be undone.
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
                Note: This <u>cannot</u> be undone.
                <button @click="closePopup(true)">Erase Project & Board</button>
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
                        game.createObject(item.subtype);
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