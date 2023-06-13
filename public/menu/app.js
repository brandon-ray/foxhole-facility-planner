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
                    layerSelectionVisible: false
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
                    this.bmc();
                    if (subtype) {
                        if (PROJECT_LAYERS[type] && PROJECT_LAYERS[type][subtype]) {
                            const disableKey = PROJECT_LAYERS[type][subtype].disable;
                            if (disableKey) {
                                game.project.settings[type][disableKey] = false;
                            }
                        }
                        game.project.settings[type][subtype] = !game.project.settings[type][subtype];
                    } else {
                        game.project.settings[type] = !game.project.settings[type];
                    }
                    game.updateEntityOverlays();
                    game.updateSave();
                    this.refresh();
                },
                toggleCropMode: function() {
                    if (game.constructionMode.key === 'crop-region') {
                        game.resetConstructionMode();
                    } else {
                        game.resetRegionCrop(game.project.settings.regionCrop === undefined);
                    }
                }
            },
            template: html`
            <div ref="app" :class="{'colonial-faction': game.settings.displayFactionTheme && game.settings.selectedFaction === 'c', 'warden-faction': game.settings.displayFactionTheme && game.settings.selectedFaction === 'w', 'no-sidebar': !sidebarVisible }">
                <app-game-sidebar v-if="sidebarVisible"></app-game-sidebar>
                
                <div v-if="game.settings.showFacilityName && game.project.name && game.project.name !== 'Unnamed Facility' && game.project.name !== 'Unnamed Project'" class="project-banner">
                    <i class="fa fa-wrench" aria-hidden="true"></i> {{game.project.name}}
                </div>

                <div v-if="game.settings.enableLayers" class="layer-selection text-left">
                    <template v-for="(layers, group) in PROJECT_LAYERS">
                        <div v-if="group !== 'region' || game.project.settings.regionKey" class="layer-button-wrapper">
                            <div class="layer-button-heading">{{group}}</div>
                            <template v-if="group === 'region'">
                                <div class="layer-button" :class="{ 'btn-inactive': !game.project.settings.showWorldRegion }" title="Toggle Region" @mouseenter="bme()" @click="toggleProjectSetting('showWorldRegion')">
                                    <div class="layer-button-info">{{game.project.settings.showWorldRegion ? 'Visible' : 'Hidden'}}</div>
                                </div>
                                <div v-if="game.project.settings.showWorldRegion" class="layer-button" :class="{ 'btn-inactive': game.project.settings.regionCrop === undefined && game.constructionMode.key !== 'crop-region' }" title="Crop Region" @mouseenter="bme()" @click="toggleCropMode()">
                                    <div class="layer-button-info">{{game.project.settings.regionCrop ? 'Cropped' : 'Crop'}}</div>
                                </div>
                            </template>
                            <template v-if="group === 'ranges'">
                                <div class="layer-button" :class="{ 'btn-inactive': !game.project.settings.showRangeWhenSelected }" title="Selection Ranges" @mouseenter="bme()" @click="toggleProjectSetting('showRangeWhenSelected')">
                                    <div class="layer-button-info">MOUSE</div>
                                </div>
                            </template>
                            <template v-if="group !== 'region' || game.project.settings.showWorldRegion" v-for="(info, key) in layers">
                                <div class="layer-button" :class="{ 'btn-inactive': !game.project.settings[group][key] }" :title="info.description ?? info.name" @mouseenter="bme()" @click="toggleProjectSetting(group, key)">
                                    <div class="layer-button-info">{{info.alias ?? info.name}}</div>
                                </div>
                                <!--
                                <div class="layer-button" :class="{ 'btn-inactive': !game.project.settings[group][key], 'expanded': info.icon }" :title="info.description ?? info.name" @mouseenter="bme()" @click="toggleProjectSetting(group, key)">
                                    <div class="layer-button-info" :style="{backgroundImage: (info.icon && 'url(' + info.icon + ')') || ''}">{{(!info.icon && (info.alias ?? info.name)) || ''}}</div>
                                </div>
                                -->
                            </template>
                        </div>
                    </template>
                    <div class="layer-button-wrapper">
                        <div class="layer-button-heading">ICONS</div>
                        <div class="layer-button" :class="{ 'btn-inactive': !game.project.settings.showProductionIcons }" title="Production Icons" @mouseenter="bme()" @click="toggleProjectSetting('showProductionIcons')">
                            <div class="layer-button-info">OUTPUT</div>
                        </div>
                    </div>
                </div>

                <app-menu-statistics></app-menu-statistics>

                <app-game-toolbelt></app-game-toolbelt>
                
                <app-game-hub-popup></app-game-hub-popup>

                <app-game-confirmation-popup></app-game-confirmation-popup>

                <div class="footer">
                    <app-board-ui></app-board-ui>
                    <button class="btn-small float-left" :class="{ 'btn-active': !sidebarVisible }" title="Toggle Sidebar Menu" @click="sidebarVisible = !sidebarVisible">
                        <i class="fa" :class="{'fa-chevron-left': sidebarVisible, 'fa-chevron-right': !sidebarVisible}" aria-hidden="true"></i>
                    </button>
                    <label class="btn-checkbox-wrapper float-left">
                        <button class="btn-small float-left" :class="{ 'btn-active': game.shiftKeyModifier ? !settings.enableGrid : settings.enableGrid }" @click="settings.enableGrid = !settings.enableGrid; game.updateSettings()">
                            <i v-show="game.shiftKeyModifier || settings.enableGrid" class="fa fa-check" :class="{'fa-ban': settings.enableGrid && game.shiftKeyModifier }" aria-hidden="true"></i>
                        </button>
                        Snap to Grid
                    </label>
                    <label class="btn-checkbox-wrapper float-left">
                        <button class="btn-small float-left" :class="{ 'btn-active': game.shiftKeyModifier ? !settings.enableSnapRotation : settings.enableSnapRotation }" @click="settings.enableSnapRotation = !settings.enableSnapRotation; game.updateSettings()">
                            <i v-show="game.shiftKeyModifier || settings.enableSnapRotation" class="fa fa-check" :class="{'fa-ban': settings.enableSnapRotation && game.shiftKeyModifier }" aria-hidden="true"></i>
                        </button>
                        Snap Rotation
                    </label>
                    <div class="panel-toolbar">
                        <label class="btn-checkbox-wrapper">
                            <button class="btn-small float-left" :class="{ 'btn-active': game.hubPopup?.visible }" @click="game.hubPopup.showPopup()"><i class="fa fa-home" aria-hidden="true"></i></button>
                            Hub
                        </label>
                        <label class="btn-checkbox-wrapper">
                            <button class="btn-small float-left" :class="{ 'btn-active': settings.enableLayers }" @click="settings.enableLayers = !settings.enableLayers; game.updateSettings()"><i class="fa fa-clone" aria-hidden="true"></i></button>
                            Layers
                        </label>
                        <label class="btn-checkbox-wrapper">
                            <button class="btn-small float-left" :class="{ 'btn-active': settings.showToolbelt }" @click="settings.showToolbelt = !settings.showToolbelt; game.updateSettings()"><i class="fa fa-wrench" aria-hidden="true"></i></button>
                            Toolbelt
                        </label>
                        <label class="btn-checkbox-wrapper">
                            <button class="btn-small float-left" :class="{ 'btn-active': game.hubPopup?.selectedTab?.key === 'map' }" @click="game.hubPopup?.toggleTab('map')"><i class="fa fa-map-o" aria-hidden="true"></i></button>
                            Map
                        </label>
                        <label class="btn-checkbox-wrapper">
                            <button class="btn-small float-left" :class="{ 'btn-active': settings.enableStats }" @click="settings.enableStats = !settings.enableStats; game.updateSettings()"><i class="fa fa-bar-chart" aria-hidden="true"></i></button>
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
        <div v-if="game.project.settings.regionKey" class="mr-2">{{gameData.maps[game.project.settings.regionKey]?.name}}</div>
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
                    preventSlide: true
                },
                {
                    key: 'updates',
                    title: 'Updates',
                    icon: 'fa-bullhorn'
                },
                {
                    key: 'map',
                    title: 'Map',
                    icon: 'fa-map-o',
                    preventSlide: true
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
                    icon: 'fa-th',
                    preventSlide: true
                },
                */
                {
                    key: 'controls',
                    title: 'Controls',
                    icon: 'fa-keyboard-o'
                },
                {
                    key: 'settings',
                    title: 'Settings',
                    icon: 'fa-cog'
                },
                {
                    key: 'about',
                    title: 'About',
                    icon: 'fa-question-circle'
                }
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
        toggleTab: function(key) {
            if (this.selectedTab?.key === key) {
                this.showPopup(false);
            } else {
                this.showPopup(true, key);
            }
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
    <div v-if="visible" class="board-panel hub-dialog" :class="{ 'maximized': maximized, 'sidebar-names': game.settings.showExpandedHubSidebar, 'prevent-slide': selectedTab.preventSlide }">
        <div class="board-panel-header">
            <h4 class="float-left m-0" style="color: #eee"><img src="/favicon_white.ico" height="28px" style="vertical-align: top; opacity: 0.25"> Planner Hub <span class="text-muted">/</span> {{selectedTab.title}}</h4>
            <button class="btn-small m-0 mr-1 float-right" title="Close Hub" @click="showPopup(false)"><i class="fa fa-times" aria-hidden="true"></i></button>
            <button class="btn-small m-0 mr-2 float-right" :class="{'btn-active': maximized}" :title="maximized ? 'Minimize Hub' : 'Maximize Hub'" @click="maximized = !maximized; refresh()"><i class="fa fa-window-maximize" aria-hidden="true"></i></button>
        </div>
        <div class="d-flex board-panel-body">
            <div class="hub-sidebar h-100 text-center p-0 position-relative justify-content-center align-items-center">
                <div v-for="tab in tabContent" class="hub-sidebar-tab" :class="{ 'selected': selectedTab.key === tab.key }" :title="tab.title" @click="showTab(tab.key)">
                    <i class="fa" :class="tab.icon"></i>
                    <span v-if="game.settings.showExpandedHubSidebar">{{tab.title}}</span>
                </div>
                <div class="position-absolute" style="bottom: 0">
                    <div class="hub-sidebar-tab forced-size" :title="game.settings.showExpandedHubSidebar ? 'Retract Sidebar' : 'Extend Sidebar'" @click="game.settings.showExpandedHubSidebar = !game.settings.showExpandedHubSidebar; game.updateSettings()">
                        <i class="fa fa-2x" :class="{'fa-angle-right': !game.settings.showExpandedHubSidebar, 'fa-angle-left': game.settings.showExpandedHubSidebar}" aria-hidden="true"></i>
                    </div>
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
    methods: {
        loadProject: function() {
            game.openFileBrowser(saveObject => {
                saveObject = JSON.parse(saveObject);
                game.loadSave(saveObject);
                game.hubPopup?.showPopup(false);
            });
        }
    },
    template: html`
    <div class="tab-content hub-home">
        <img src="/assets/logo_icon.webp"><br>
        <div class="fall-in-item no-box text-center">
            <button class="btn-long" @click="bmc(); game.hubPopup?.showPopup(false); game.confirmNewProject();">
                <i class="fa fa-file" aria-hidden="true"></i>
                <span>New Project</span>
            </button>
            <br>
            <button class="btn-long" @click="bmc(); loadProject()">
                <i class="fa fa-upload" aria-hidden="true"></i>
                <span>Load Project</span>
            </button>
            <br>
            <button class="btn-long" @click="bmc(); game.hubPopup?.showTab('settings')">
                <i class="fa fa-gear" aria-hidden="true"></i>
                <span>Settings</span>
            </button>
        </div>
        <div class="social-icons">
            <a class="btn-social btn-color-github" href="https://github.com/brandon-ray/foxhole-facility-planner" title="GitHub" target="_blank" @click="bmc()">
                <i class="fa fa-4x fa-github" aria-hidden="true"></i>
            </a>
            <a class="btn-social discord-button btn-color-discord" href="https://discord.gg/2hgaMQN26s" title="Discord" target="_blank" @click="bmc()">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 127.14 96.36">
                    <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"/>
                </svg>
            </a>
        </div>
    </div>
    `
});

Vue.component('app-hub-updates', {
    template: html`
    <div class="tab-content">
        <div class="fall-in-item">
            <div class="tab-content-header">
                <i class="fa fa-bullhorn"></i> Map & Hub Improvements
                <small class="float-right">May 1st, 2023</small>
            </div>
            <div class="tab-content-body">
                <h4>Major Changes</h4>
                <ul>
                    <li>Added real-time icon and label layers from War API to the currently selected hex.
                        <ul>
                            <li>Note: Real-time stats can be disabled in settings.</li>
                        </ul>
                    </li>
                </ul>
                <h4>Other Changes</h4>
                <ul>
                    <li>Added Import, Export, and Reset Settings buttons to hub.</li>
                    <li>Added bunker destruction stats setting.</li>
                    <li>Added darkened background when confirmation dialogs are visible.</li>
                    <li>Added controls page to hub.</li>
                    <li>Updated hub home page and sidebar.</li>
                    <li>Updated sidebar footer to reduce load/save button footprint.</li>
                    <li>Moved GitHub and Discord buttons to hub home.</li>
                    <li>Moved Dragon's Teeth from experimental.</li>
                    <li>Fixed z-sorting of various vehicle-based items.</li>
                </ul>
            </div>
        </div>
        <!--
        <div class="fall-in-item">
            <div class="tab-content-header">
                <i class="fa fa-bullhorn"></i> Map / Regions Update
                <small class="float-right">April 24th, 2023</small>
            </div>
            <div class="tab-content-body">
                <div class="tab-content-body-img-wrapper">
                    <img src="/assets/updates/04242023_alt.jpg">
                </div>
                <h4>Major Changes</h4>
                <ul>
                    <li>Added Region Selection (Map):
                        <ul>
                            <li>Select a region to be your project background.</li>
                            <li>Switch between Foxhole and BMM styled maps.</li>
                            <li>Crop a selection of the map with the new "Region Crop Tool"</li>
                            <li>Enable Shading, Topology, Road, Road Tiers, Rail, and RDZ Layers provided by BMM.</li>
                            <li>Enable the Grid layer to match that of the in-game map.</li>
                        </ul>
                    </li>
                </ul>
                <h4>Other Changes</h4>
                <ul>
                    <li>Added blueprint & dig site variants of Bunker, Trench, and Emplacement pieces.</li>
                    <li>Added toggle for power / production stats per building.</li>
                    <li>Added foundation requirements to building hover info.</li>
                    <li>Added setting for toggling single selection stats.</li>
                    <li>Added new hotkeys for Map (M) and Blueprinting selections (B).</li>
                    <li>Added Observation Tower reference and Abisme AT-99 Tank Mine.</li>
                    <li>Added selected tool information to footer.</li>
                    <li>Added new "About" page to the Planner Hub.</li>
                    <li>Layers menu has been updated to accomodate the new map.</li>
                    <li>Gate T1 no longer blocks LOS.</li>
                    <li>Updated hitbox of AT Gun Garrison (Tier 3).</li>
                    <li>Fixed issue with loading the same project. (Chromium)</li>
                </ul>
                <h4>Special Thanks</h4>
                <ul>
                    <li>Thank you <a href="https://sentsu.itch.io/" target="_blank">Sentsu</a> for allowing us to include layers from your <a href="https://sentsu.itch.io/foxhole-better-map-mod" target="_blank">Better Map Mod</a>!</li>
                </ul>
            </div>
        </div>
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
        -->
    </div>
    `
});

Vue.component('app-hub-map', {
    methods: {
        selectMapRegion: function(key) {
            game.setMapRegion(key);
            if (game.project.settings.regionKey) {
                game.hubPopup?.showPopup(false);
            }
            this.$forceUpdate();
        }
    },
    template: html`
    <div class="tab-content region-selection">
        <div class="region-selection-hexes">
            <template v-for="(map, key) in gameData.maps">
                <div class="region-map-hex" :style="{
                        marginTop: ((-55 + (map.gridCoord.y * 110)) + (map.gridCoord.x * 55)) + 'px',
                        marginLeft: (-64 + (map.gridCoord.x * 96)) + 'px'
                    }" :title="(key === game.project.settings.regionKey ? 'Deselect ' : 'Select ') + map.name" :class="{'hex-selected': key === game.project.settings.regionKey }" @click="selectMapRegion(key)">
                    <div class="d-flex justify-content-center align-items-center text-center" :style="{backgroundImage: 'url(' + map.icon + ')'}">
                        <div>{{map.name}}</div>
                    </div>
                </div>
            </template>
        </div>
        <div class="info-tooltips tt-tl">
            <div>Select a region and it will become the backdrop for your project.</div>
            <div>Select a region again to deselect it.</div>
        </div>
        <div class="info-tooltips tt-tr">
            <div>Regions will have a white border around them when they are selected.</div>
        </div>
        <div class="info-tooltips tt-bl"></div>
        <div class="info-tooltips tt-br">
            <div class="text-center">Map layer assets provided by: <br><a href="https://sentsu.itch.io/foxhole-better-map-mod" target="_blank">Better Map Mod v3.2</a> by <a href="https://sentsu.itch.io/" target="_blank">Sentsu</a></div>
        </div>
    </div>
    `
                
});

Vue.component('app-hub-presets', {
    data: function() {
        return {
            presets: [],
            currentPage: 1,
            presetsPerPage: 6,
            selectedPreset: null,
            searchQuery: null
        }
    },
    mounted: function() {
        game.hubPresets = this;
        for (const [key, preset] of Object.entries(gameData.presets)) {
            preset.key = key;
            this.presets.push(preset);
        }
    },
    computed: {
        pagePresets: function() {
            return this.presets.slice((this.currentPage - 1) * this.presetsPerPage, this.currentPage * this.presetsPerPage);
        },
        totalPages: function() {
            return Math.ceil(this.presets.length / this.presetsPerPage);
        }
    },
    methods: {
        buildBuilding: function(building) {
            this.bmc();
            game.createObject(building);
            this.selectedPreset = null;
            this.showPopup(false);
        }
    },
    template: html`
    <div class="tab-content hub-presets d-flex">
        <div class="col-md-6 p-0 preset-gallery">
            <!-- Filters for modules, showcase, bunkers, facilities, etc. -->
            <div class="construction-options preset-gallery-filters d-flex">
                <label class="construction-search w-100" title="Search">
                    <i class="fa fa-search" aria-hidden="true"></i>
                    <div class="input-wrapper">
                        <input type="text" v-model="searchQuery" placeholder="Search" @input="refresh()">
                        <i class="fa fa-close" :class="{'active': searchQuery}" aria-hidden="true" @click="searchQuery = null"></i>
                    </div>
                </label>
            </div>
            <div class="preset-page">
                <div v-for="preset in pagePresets" :key="preset.key" :title="preset.name" class="preset-listing" @mouseenter="bme()" @click="bmc(); selectedPreset = preset">
                    <div class="build-icon ignore-transform" :style="{backgroundImage:'url(' + (preset.icon ?? '/assets/default_icon.webp') + ')'}"></div>
                    <div class="listing-info">
                        <h6>{{preset.name}}</h6>
                        <p v-if="preset.description" :title="preset.description">❝{{preset.description | truncate}}❞</p>
                        <i v-if="preset.module" class="fa fa-plug" aria-hidden="true" title="Modular"></i>
                        <div v-if="preset.author" title="Creator(s)">{{typeof preset.author === 'string' ? preset.author : preset.author.join(', ')}}</div>
                    </div>
                </div>
            </div>
            <div class="preset-page-switcher">
                <button type="button" class="btn-small float-left" @click="bmc(); currentPage = 1" title="First Page" :disabled="currentPage === 1">
                    <i class="fa fa-angle-double-left"></i>
                </button>
                <button type="button" class="btn-small float-left" @click="bmc(); currentPage--" title="Previous Page" :disabled="currentPage === 1">
                    <i class="fa fa-angle-left"></i>
                </button>
                <button type="button" class="btn-small float-right" @click="bmc(); currentPage = totalPages" title="Last Page" :disabled="currentPage === totalPages">
                    <i class="fa fa-angle-double-right" aria-hidden="true"></i>
                </button>
                <button type="button" class="btn-small float-right" @click="bmc(); currentPage++" title="Next Page" :disabled="currentPage === totalPages">
                    <i class="fa fa-angle-right"></i>
                </button>
            </div>
        </div>
        <div v-if="selectedPreset" class="col-md-6 preset-preview building-info text-left p-0">
            <div class="building-info-name">
                <button type="button" class="btn-small float-left" @click="bmc(); selectedPreset = null;" title="Return">
                    <i class="fa fa-arrow-left" aria-hidden="true"></i>
                </button>
                <!--<img :src="selectedPreset.baseIcon || selectedPreset.icon || '/assets/default_icon.webp'" />-->
                <h4>{{selectedPreset.name}}</h4>
                <button type="button" class="btn-small float-right" @click="bmc();" title="Report">
                    <i class="fa fa-flag" aria-hidden="true"></i>
                </button>
            </div>
            <div class="building-info-body">
                <p class="building-info-description" v-if="selectedPreset.description">{{selectedPreset.description}}</p>
                <p class="building-tech-description" v-if="selectedPreset.author">
                    <span>Creator{{typeof selectedPreset.author !== 'string' && 's' || ''}}:</span> {{typeof selectedPreset.author === 'string' ? selectedPreset.author : selectedPreset.author.join(', ')}}
                </p>
                <!--
                <p class="building-tech-description" v-if="selectedPreset.category === 'presets' || selectedPreset.category === 'showcase'">
                    <span>Want your design featured in the planner?</span> Submit it on our Discord!
                </p>
                -->
                <img v-if="selectedPreset.preset" class="building-preview" :src="selectedPreset.texture">
                <!-- Load Button -->
                <!-- Import/Clone Button -->
                <!-- Download Project File Button -->
            </div>
            <div class="building-info-footer-options"></div>
        </div>
    </div>
    `
});

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
        },
        loadSettings: function() {
            game.openFileBrowser(settingsObject => {
                settingsObject = JSON.parse(settingsObject);
                if (settingsObject && settingsObject.settings) {
                    Object.assign(game.settings, game.defaultSettings, settingsObject.settings);
                    game.updateSettings(true);
                    this.$forceUpdate();
                } else {
                    throw 'Invalid settings file.';
                }
            });
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
                        <i class="fa fa-search-plus" aria-hidden="true"></i> Mouse Zoom Speed
                        <input class="app-input" type="number" v-model.number="game.settings.zoomSpeed" min="1" max="5" @change="updateSettings()">
                    </label>
                </div>
                <div class="row">
                    <label class="col-md-6 app-input-label" title="Disabling this will allow the camera to be positioned outside of a region hex.">
                        <i class="fa fa-ban" aria-hidden="true"></i> Lock Camera View to Region
                        <button class="btn-small btn-tickbox" :class="{ 'btn-active': game.settings.lockCameraToHex }" @click="toggleSetting('lockCameraToHex')"></button>
                    </label>
                    <label class="col-md-6 app-input-label">
                        <i class="fa fa-map-o" aria-hidden="true"></i> Enable Real-Time Map Updates
                        <button class="btn-small btn-tickbox" :class="{ 'btn-active': game.settings.enableRealTimeMap }" @click="toggleSetting('enableRealTimeMap'); game.updateEntityOverlays()"></button>
                    </label>
                </div>
                <div class="row">
                    <label class="col-md-6 app-input-label" :class="{'disabled': !game.settings.enableExperimental}" title="Allows you to display LOS for certain structures: Pillboxes, Bunkers, etc. Requires Experimental Features to be enabled.">
                        <i class="fa fa-eye" aria-hidden="true"></i> Enable Line-of-Sight Ranges
                        <button class="btn-small btn-tickbox" :class="{ 'btn-active': game.settings.showLineOfSightRanges }" @click="toggleSetting('showLineOfSightRanges')" :disabled="!game.settings.enableExperimental"></button>
                    </label>
                    <label class="col-md-6 app-input-label" title="Changes behavior of the toolbelt hotkeys. By default, hotkeys will spawn a new object if nothing is selected.">
                        <i class="fa fa-wrench" aria-hidden="true"></i> Toolbelt Mode
                        <select class="app-input" v-model.number="game.settings.toolbeltMode" @change="game.updateSettings()">
                            <option :value="0">Create Only</option>
                            <option value="1">Modify Single</option>
                            <option value="2">Modify Selection</option>
                        </select>
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
                    <label class="col-md-6 app-input-label">
                        <i class="fa fa-shield" aria-hidden="true"></i> Show Bunker Destruction Stats
                        <button class="btn-small btn-tickbox" :class="{ 'btn-active': game.settings.showBuildingDestructionStats }" @click="toggleSetting('showBuildingDestructionStats')"></button>
                    </label>
                </div>
            </div>
        </div>
        <div class="fall-in-item no-box">
            <button class="btn-long" @click="loadSettings()">
                <i class="fa fa-upload" aria-hidden="true"></i> Import Settings
            </button>
            <button class="btn-long" @click="game.downloadSettings()">
                <i class="fa fa-save" aria-hidden="true"></i> Export Settings
            </button>
            <button class="btn-long btn-color-red" @click="game.confirmResetSettings()">
                <i class="fa fa-undo" aria-hidden="true"></i> Reset Settings
            </button>
        </div>
    </div>
    `
});

Vue.component('app-hub-controls', {
    template: html`
    <div class="tab-content">
        <div class="fall-in-item">
            <div class="tab-content-header"><i class="fa fa-keyboard-o" aria-hidden="true"></i> Controls + Hotkeys</div>
            <div class="tab-content-body controls-section-body">
                <div class="row">
                    <div class="col-md-6">
                        <div class="middle-mouse-button"></div> Move board position.<br>
                        <div class="middle-mouse-button"></div> Scroll to zoom in/out board.
                        <hr>
                        <div class="left-mouse-button"></div> Select a single structure.<br>
                        <div class="left-mouse-button"></div> Drag to select multiple structures.<br>
                        <div class="right-mouse-button"></div> Rotate selected structures.
                        <hr>
                        <div class="keyboard-key">ctrl</div> + <div class="left-mouse-button"></div> Add structure to selection.<br>
                        <div class="keyboard-key">ctrl</div> + <div class="middle-mouse-button"></div> Adjust selected spline length.<br>
                        <div class="keyboard-key">ctrl</div> + <div class="keyboard-key">A</div> Select all structures.<br>
                        <div class="keyboard-key">ctrl</div> + <div class="keyboard-key">C</div> Clone selection.
                        <hr>
                        <div class="keyboard-key">ctrl</div> + <div class="keyboard-key">Z</div> Undo previous action.<br>
                        <div class="keyboard-key">ctrl</div> + <div class="keyboard-key">Y</div> Redo previous action.<br>
                        <div class="keyboard-key">ctrl</div> + <div class="keyboard-key">shift</div> + <div class="keyboard-key">Z</div> Redo previous action.
                        <hr>
                        <div class="keyboard-key">shift</div> + <div class="left-mouse-button"></div> Add structure to selection.<br>
                        <div class="keyboard-key">shift</div> + <div class="left-mouse-button"></div> Add bunker to selection.<br>
                        <div class="keyboard-key">shift</div> + <div class="left-mouse-button"></div> Snap structure to grid.
                    </div>
                    <div class="col-md-6">
                        <div class="keyboard-key">number</div> Select toolbelt slot. (0-9)<br>
                        <i class="fa fa-reply fa-rotate-180" aria-hidden="true"></i> <div class="keyboard-key">shift</div> Swap toolbelt. (0-9)
                        <hr>
                        <div class="keyboard-key"><i class="fa fa-angle-up" aria-hidden="true"></i></div> <div class="keyboard-key"><i class="fa fa-angle-down" aria-hidden="true"></i></div> Move selection up / down.<br>
                        <div class="keyboard-key"><i class="fa fa-angle-left" aria-hidden="true"></i></div> <div class="keyboard-key"><i class="fa fa-angle-right" aria-hidden="true"></i></div> Move selection left / right.
                        <hr>
                        <div class="keyboard-key">W, A, S, D</div> Move selection along grid.<br>
                        <i class="fa fa-reply fa-rotate-180" aria-hidden="true"></i> <div class="keyboard-key">shift</div> Halve selection movement.
                        <hr>
                        <div class="keyboard-key">Q, E</div> Rotate selection by degrees. ({{game.settings.keySnapRotationDegrees}}°)<br>
                        <i class="fa fa-reply fa-rotate-180" aria-hidden="true"></i> <div class="keyboard-key">shift</div> Double selection rotation. ({{game.settings.keySnapRotationDegrees * 2}}°)
                        <hr>
                        <div class="keyboard-key">space</div> Pause / Resume physics.<br>
                        <div class="keyboard-key">B</div> Toggle blueprint for selection.<br>
                        <div class="keyboard-key">L</div> Toggle lock for selected structures.<br>
                        <div class="keyboard-key">M</div> Toggle region selection. (Map)<br>
                        <div class="keyboard-key">P</div> Toggle production output icons.<br>
                        <div class="keyboard-key">del</div> Delete selected structures.<br>
                        <div class="keyboard-key">esc</div> Clear selection.<br>
                        <div class="keyboard-key">F2</div> Debug menu.
                    </div>
                </div>
            </div>
        </div>
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
                <a href="https://discord.gg/2hgaMQN26s" target="_blank">Join Our Discord<i class="fa fa-arrow-right" aria-hidden="true"></i></a>
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
        <div class="dialog-overlay" @click="closePopup(false)"></div>
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
                This will revert all settings and toolbelts.<br>
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

Vue.filter('truncate', function(value) {
    if (value.length > 65) {
        const truncated = value.slice(0, 65);
        const lastSpace = truncated.lastIndexOf(' ');
        if (lastSpace !== -1) {
            return truncated.slice(0, lastSpace) + '...';
        }
        return truncated + '...';
    }
    return value;
});