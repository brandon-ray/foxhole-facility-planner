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
                        game.projectSettings[type][subtype] = !game.projectSettings[type][subtype];
                    } else {
                        game.projectSettings[type] = !game.projectSettings[type];
                    }
                    game.updateEntityOverlays();
                    game.updateSave();
                    game.appComponent.$forceUpdate();
                },
                selectMapRegion: function(key) {
                    game.setMapRegion(key);
                    this.regionSelectionVisible = false;
                    game.appComponent.$forceUpdate();
                }
            },
            template: html`
            <div ref="app" :class="{'colonial-faction': game.settings.displayFactionTheme && game.settings.selectedFaction === 'c', 'warden-faction': game.settings.displayFactionTheme && game.settings.selectedFaction === 'w', 'no-sidebar': !sidebarVisible }">
                <app-game-game-menu></app-game-game-menu>
                <app-game-sidebar v-if="sidebarVisible"></app-game-sidebar>
                
                <div v-if="game.settings.showFacilityName && game.projectName && game.projectName !== 'Unnamed Facility' && game.projectName !== 'Unnamed Project'" class="project-banner">
                    <i class="fa fa-wrench" aria-hidden="true"></i> {{game.projectName}}
                </div>

                <div v-if="layerSelectionVisible" class="board-panel layer-selection">
                    <div class="board-panel-header">
                        <h4 class="float-left m-0" style="color: #eee"><i class="fa fa-cogs"></i> Toggle Layers</h4>
                        <button class="btn-small m-0 mr-1 float-right" title="Minimize Layers" @click="layerSelectionVisible = false"><i class="fa fa-window-minimize" aria-hidden="true"></i></button>
                    </div>
                    <div class="board-panel-body row p-1">
                        <div class="col">
                            <label v-if="game.settings.enableExperimental" class="btn-checkbox-wrapper d-block">
                                <button class="btn-small btn-float-left btn-checkbox" :class="{ 'btn-active': game.projectSettings.showWorldRegion }" @click="toggleProjectSetting('showWorldRegion')"></button>
                                World Region
                            </label>
                            <label class="btn-checkbox-wrapper d-block">
                                <button class="btn-small btn-float-left btn-checkbox" :class="{ 'btn-active': game.projectSettings.showProductionIcons }" @click="toggleProjectSetting('showProductionIcons')"></button>
                                Production Icons
                            </label>
                            <label class="btn-checkbox-wrapper d-block">
                                <button class="btn-small btn-float-left btn-checkbox" :class="{ 'btn-active': game.projectSettings.showRangeWhenSelected }" @click="toggleProjectSetting('showRangeWhenSelected')"></button>
                                Selection Ranges
                            </label>
                            <label class="btn-checkbox-wrapper d-block">
                                <button class="btn-small btn-float-left btn-checkbox" :class="{ 'btn-active': game.projectSettings.ranges.resourceField }" @click="toggleProjectSetting('ranges', 'resourceField')"></button>
                                Resource Field Ranges
                            </label>
                            <label class="btn-checkbox-wrapper d-block">
                                <button class="btn-small btn-float-left btn-checkbox" :class="{ 'btn-active': game.projectSettings.ranges.preventDecay }" @click="toggleProjectSetting('ranges', 'preventDecay')"></button>
                                Maintenance Ranges
                            </label>
                            <label class="btn-checkbox-wrapper d-block">
                                <button class="btn-small btn-float-left btn-checkbox" :class="{ 'btn-active': game.projectSettings.ranges.crane }" @click="toggleProjectSetting('ranges', 'crane')"></button>
                                Crane Ranges
                            </label>
                        </div>
                        <div class="col">
                            <label class="btn-checkbox-wrapper d-block">
                                <button class="btn-small btn-float-left btn-checkbox" :class="{ 'btn-active': game.projectSettings.ranges.killbox }" @click="toggleProjectSetting('ranges', 'killbox')"></button>
                                Rifle Ranges
                            </label>
                            <label class="btn-checkbox-wrapper d-block">
                                <button class="btn-small btn-float-left btn-checkbox" :class="{ 'btn-active': game.projectSettings.ranges.killboxMG }" @click="toggleProjectSetting('ranges', 'killboxMG')"></button>
                                Machine Gun Ranges
                            </label>
                            <label class="btn-checkbox-wrapper d-block">
                                <button class="btn-small btn-float-left btn-checkbox" :class="{ 'btn-active': game.projectSettings.ranges.killboxAT }" @click="toggleProjectSetting('ranges', 'killboxAT')"></button>
                                Anti Tank Ranges
                            </label>
                            <label class="btn-checkbox-wrapper d-block">
                                <button class="btn-small btn-float-left btn-checkbox" :class="{ 'btn-active': game.projectSettings.ranges.killboxRocket }" @click="toggleProjectSetting('ranges', 'killboxRocket')"></button>
                                Rocket Ranges
                            </label>
                            <label class="btn-checkbox-wrapper d-block">
                                <button class="btn-small btn-float-left btn-checkbox" :class="{ 'btn-active': game.projectSettings.ranges.killboxArty }" @click="toggleProjectSetting('ranges', 'killboxArty')"></button>
                                Artillery Ranges
                            </label>
                            <label class="btn-checkbox-wrapper d-block">
                                <button class="btn-small btn-float-left btn-checkbox" :class="{ 'btn-active': game.projectSettings.ranges.radio }" @click="toggleProjectSetting('ranges', 'radio')"></button>
                                Radio Ranges
                            </label>
                        </div>
                    </div>
                </div>

                <app-menu-statistics></app-menu-statistics>

                <div v-if="regionSelectionVisible" class="board-panel world-region-selection" style="transform: scale(0.95)">
                    <div class="board-panel-header">
                        <h4 class="float-left m-0" style="color: #eee"><i class="fa fa-map-o"></i> Select Map Region</h4>
                        <button class="btn-small m-0 mr-1 float-right" title="Minimize Layers" @click="regionSelectionVisible = false"><i class="fa fa-window-minimize" aria-hidden="true"></i></button>
                    </div>
                    <div class="board-panel-body">
                        <template v-for="(map, key) in gameData.maps">
                            <div class="region-map-hex" :style="{
                                    marginTop: ((-55 + (map.gridCoord.y * 110)) + (map.gridCoord.x * 55)) + 'px',
                                    marginLeft: (-50 + (map.gridCoord.x * 96)) + 'px'
                                }" @click="selectMapRegion(key)">
                                <div class="d-flex justify-content-center align-items-center text-center" :style="{backgroundImage: 'url(' + map.icon + ')'}">
                                    <div>{{map.name}}</div>
                                </div>
                            </div>
                        </template>
                    </div>
                </div>

                <app-game-toolbelt></app-game-toolbelt>

                <app-game-confirmation-popup></app-game-confirmation-popup>

                <div class="footer">
                    <button class="btn-small btn-float-left" :class="{ 'btn-active': !sidebarVisible }" title="Toggle Sidebar Menu" @click="sidebarVisible = !sidebarVisible">
                        <i class="fa" :class="{'fa-chevron-left': sidebarVisible, 'fa-chevron-right': !sidebarVisible}" aria-hidden="true"></i>
                    </button>
                    <label class="btn-checkbox-wrapper">
                        <button class="btn-small btn-float-left btn-checkbox" :class="{ 'btn-active': settings.enableGrid }" @click="settings.enableGrid = !settings.enableGrid; game.updateSettings()"></button>
                        Snap to Grid
                    </label>
                    <label class="btn-checkbox-wrapper">
                        <button class="btn-small btn-float-left btn-checkbox" :class="{ 'btn-active': settings.enableSnapRotation }" @click="settings.enableSnapRotation = !settings.enableSnapRotation; game.updateSettings()"></button>
                        Snap Rotation
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
                        Map (Preview)
                    </label>
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
                            <template v-if="!category.hideInList && (game.settings.enableExperimental || !category.experimental)">
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