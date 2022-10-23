Vue.component('app-game-sidebar', {
    data: function() {
        return {
            currentMenu: null,
            currentMenuData: null,
            hoverData: null,
            menuList: [
                {
                    key: 'statistics',
                    name: 'Statistics',
                    icon: 'fa-bar-chart'
                },
                {
                    key: 'save-load',
                    name: 'Save/Load',
                    icon: 'fa-save'
                },
                {
                    key: 'settings',
                    name: 'Settings',
                    icon: 'fa-gear'
                },
                {
                    key: 'about',
                    name: 'About',
                    icon: 'fa-info-circle'
                }
            ]
        };
    },
    mounted: function () {
        game.sidebarMenuComponent = this;
        this.changeMenu(null);
    },
    methods: {
        changeMenu: function(newMenu, menuData) {
            if (typeof newMenu === 'string' || newMenu instanceof String) {
                for (let i=0; i<this.menuList.length; i++) {
                    let menu = this.menuList[i];
                    if (menu.key === newMenu) {
                        newMenu = menu;
                        break;
                    }
                }
            }

            this.bmc();
            if (newMenu) {
                this.currentMenu = newMenu;
            } else {
                this.currentMenu = null;
            }
            this.currentMenuData = menuData;

            if (game.getSelectedEntities().length && (!this.currentMenu || this.currentMenu.key !== 'building-selected')) {
                game.deselectEntities();
            }
        },
        selectFaction: function(faction) {
            this.bmc();
            game.setFaction(game.settings.selectedFaction !== faction ? faction : null);
        },
        showHoverMenu: function(data) {
            this.hoverData = data;
        }
    },
    template: html`
    <div id="sidebar">
        <div id="sidebar-header">
            <button class="colonial-button" :class="{ selected: game.settings.selectedFaction == 'c' }" title="Colonial Faction" @click="selectFaction('c')" @mouseenter="bme"></button>
            <img class="sidebar-logo" src="/assets/logo_transparent.webp">
            <button class="warden-button" :class="{ selected: game.settings.selectedFaction == 'w' }" title="Warden Faction" @click="selectFaction('w')" @mouseenter="bme"></button>
        </div>
        <div id="sidebar-body" :class="currentMenu ? currentMenu.key + '-page' : 'construction-page'">
            <div v-if="!currentMenu" class="menu-body">
                <app-menu-construction-list></app-menu-construction-list>
            </div>
            <div v-if="currentMenu" class="menu-body">
                <div class="menu-page-title"><i :class="'fa ' + currentMenu.icon"></i> {{currentMenu.name}}</div>
                <button type="button" class="title-button return-button" v-on:click="changeMenu(null)" title="Back" @mouseenter="bme">
                    <div class="inner-button"><i class="fa fa-arrow-left"></i></div>
                </button>
                <div class="menu-page">
                    <component v-bind:is="'app-menu-' + currentMenu.key" :menuData="currentMenuData"></component>
                </div>
            </div>
            <div class="menu-footer-buttons">
                <button v-if="!currentMenu" type="button" class="app-btn app-btn-primary" v-on:click="changeMenu('save-load')" @mouseenter="bme">
                    <i class="fa fa-save"></i> Save/Load
                </button>
                <button v-if="currentMenu"  type="button" class="app-btn app-btn-primary" v-on:click="changeMenu(null)" @mouseenter="bme">
                    <i class="fa fa-arrow-left"></i> Return
                </button>
            </div>
        </div>
        <div id="sidebar-footer">
            <a class="float-left github-button" href="https://github.com/brandon-ray/foxhole-facility-planner" target="_blank" @click="bmc" @mouseenter="bme">
                <i class="fa fa-github"></i>
            </a>
            <a class="float-left discord-button" href="https://discord.gg/SnyEDQyAVr" target="_blank" @click="bmc" @mouseenter="bme">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 127.14 96.36">
                    <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"/>
                </svg>
            </a>
            <button v-on:click="event.preventDefault(); changeMenu('settings')" class="float-right" @mouseenter="bme">
                <i class="fa fa-gear"></i>
            </button>
            <button v-on:click="event.preventDefault(); changeMenu('about')" class="float-right" @mouseenter="bme">
                <i class="fa fa-question-circle"></i>
            </button>
        </div>
        <div id="hover-building-info" v-if="hoverData">
            <div class="building-info-name">
                <img v-bind:src="'/assets/' + hoverData.icon" />
                <h4>{{hoverData.parentName ? hoverData.parentName : hoverData.name}}</h4>
            </div>
            <div v-if="hoverData.parentName" class="building-info-upgrade">
                <i class="fa fa-check-circle" aria-hidden="true"></i> {{hoverData.upgradeName}} Upgrade
            </div>
            <div class="building-info-body">
                <p class="building-info-description">{{hoverData.description}}</p>
                <p class="building-tech-description" v-if="hoverData.techId">
                    <span>Requires Tech:</span> {{window.objectData.tech[hoverData.techId]?.name}}
                </p>
                <div class="building-info-production" v-if="hoverData.production && hoverData.production.length && hoverData.production.hasOutput">
                    <template v-for="(recipe, index) in hoverData.production">
                        <app-game-recipe v-if="!recipe.faction || !game.settings.selectedFaction || recipe.faction == game.settings.selectedFaction" :building="hoverData" :recipe="recipe"></app-game-recipe>
                    </template>
                </div>
                <div class="building-cost">
                    <app-game-resource-icon v-for="(value, key) in hoverData.cost" :resource="key" :amount="value"/>
                </div>
                <div class="power-cost" v-if="hoverData.power < 0">
                    <i class="fa fa-bolt"></i> {{hoverData.power}} MW
                </div>
                <div class="power-produced" v-else-if="hoverData.power > 0">
                    <i class="fa fa-bolt"></i> {{hoverData.production && hoverData.production.power ? hoverData.production.power : hoverData.power}} MW
                </div>
            </div>
        </div>
    </div>
    `
});

Vue.component('app-menu-building-selected', {
    props: ['menuData'],
    data: function() {
        return {
            entity: {
                x: 0,
                y: 0,
                rotation: 0,
                rotationDegrees: 0,
                selectedProduction: null
            },
            hoverUpgradeName: null,
            lockState: 0
        };
    },
    mounted: function() {
        game.buildingSelectedMenuComponent = this;
        this.refresh();
    },
    methods: {
        refresh: function(noForce) {
            this.lockState = game.getSelectedLockState();
            let selectedEntity = game.getSelectedEntity();
            if (selectedEntity) {
                if (noForce && this.entity.x === selectedEntity.x && this.entity.y === selectedEntity.y && this.entity.rotation === selectedEntity.rotation) {
                    return;
                }
                this.entity = {
                    x: selectedEntity.x,
                    y: selectedEntity.y,
                    rotation: selectedEntity.rotation,
                    rotationDegrees: Math.rad2deg(selectedEntity.rotation),
                    selectedProduction: selectedEntity.selectedProduction,
                    building: selectedEntity.building
                }
            } else if (this.entity) {
                this.entity = null;
            }
            this.$forceUpdate();
        },
        updateEntity: function() {
            if (this.entity) {
                let selectedEntity = game.getSelectedEntity();
                if (selectedEntity) {
                    selectedEntity.x = parseInt(this.entity.x);
                    selectedEntity.y = parseInt(this.entity.y);
                    selectedEntity.rotation = Math.deg2rad(parseInt(this.entity.rotationDegrees));
                    this.entity.rotation = selectedEntity.rotation;
                    selectedEntity.selectedProduction = this.entity.selectedProduction;
                    if (game.statisticsMenuComponent) {
                        game.statisticsMenuComponent.refresh();
                    }
                    this.$forceUpdate();
                } else {
                    this.refresh();
                }
            }
        },
        /*
        addRail: function() {
            this.bmc();
            if (this.entity) {
                this.entity.addPoint(100, 0);
            }
        },
        */
        changeProduction: function(id) {
            this.bmc();
            if (this.entity) {
                this.entity.selectedProduction = this.entity.selectedProduction !== id ? id : null;
                this.updateEntity();
            }
        },
        changeUpgrade: function(upgrade) {
            this.bmc();
            game.upgradeBuilding(game.getSelectedEntity(), upgrade);
        },
        cloneBuildings: function() {
            this.bmc();
            game.cloneSelected();
        },
        lockBuildings: function() {
            this.bmc();
            game.lockSelected();
            this.refresh();
        },
        destroyBuildings: function() {
            this.bmc();
            game.deselectEntities(true);
        },
        showUpgradeHover: function(key, upgrade) {
            this.hoverUpgradeName = upgrade ? upgrade.name : null;
            let buildingUpgrade = null;
            if (key && upgrade && this.entity) {
                this.bme();
                const building = this.entity.building;
                if (building) {
                    buildingUpgrade = window.objectData.buildings[(building.parentKey ? building.parentKey : building.key) + '_' + key];
                }
            }
            game.sidebarMenuComponent.showHoverMenu(buildingUpgrade);
        }
    },
    template: html`
    <div class="text-left">
        <button type="button" class="title-button trash-button" v-on:click="destroyBuildings" title="Delete" @mouseenter="bme">
            <div class="inner-button"><i class="fa fa-trash"></i></div>
        </button>
        <button type="button" class="title-button clone-button" v-on:click="cloneBuildings" title="Clone" @mouseenter="bme">
            <div class="inner-button"><i class="fa fa-clone"></i></div>
        </button>
        <button type="button" class="title-button lock-button" v-on:click="lockBuildings" title="Lock" @mouseenter="bme">
            <div class="inner-button">
                <span v-if="lockState === 1" class="locked"><i class="fa fa-lock"></i></span>
                <span v-else-if="lockState === 0" class="partially-locked"><i class="fa fa-unlock"></i></span>
                <span v-else><i class="fa fa-unlock"></i></span>
            </div>
        </button>
        <div v-if="game.getSelectedEntities().length === 1" class="settings-option-wrapper">
            <div v-if="entity.building" class="settings-title">
                {{entity.building.parentName ? entity.building.parentName : entity.building.name}}
            </div>
            <label class="app-input-label">
                <i class="fa fa-arrows" aria-hidden="true"></i> Position X:
                <input class="app-input" type="number" v-model="entity.x" @input="updateEntity">
            </label>
            <label class="app-input-label">
                <i class="fa fa-arrows" aria-hidden="true"></i> Position Y:
                <input class="app-input" type="number" v-model="entity.y" @input="updateEntity">
            </label>
            <label class="app-input-label">
                <i class="fa fa-repeat" aria-hidden="true"></i> Rotation:
                <input class="app-input" type="number" v-model="entity.rotationDegrees" @input="updateEntity">
            </label>
        </div>
        <div v-else class="settings-option-wrapper text-center">
            <div class="settings-title">
                ({{game.getSelectedEntities().length}}) Buildings Selected
            </div>
            <label class="app-input-label">
                <span style="color: red">Notice:</span> This is an experimental feature.<br>
                Report issues to our GitHub or Discord.
            </label>
            <div class="text-button-wrapper">
                <button class="text-button" type="button" v-on:click="game.downloadSave(true)" @mouseenter="bme">
                    <i class="fa fa-save"></i> Export Selection
                </button>
            </div>
        </div>
        <template v-if="game.getSelectedEntities().length === 1">
            <div v-if="entity.building && entity.building.upgrades" class="settings-option-wrapper upgrade-list">
                <div class="settings-title">{{hoverUpgradeName ?? (entity.building.upgradeName ? entity.building.upgradeName : 'No Upgrade Selected')}}</div>
                <button class="upgrade-button" v-for="(upgrade, key) in entity.building.upgrades" :class="{'selected-upgrade': entity.building.parentKey && entity.building.key === entity.building.parentKey + '_' + key}"
                    @mouseenter="showUpgradeHover(key, upgrade)" @mouseleave="showUpgradeHover" @click="changeUpgrade(key)">
                    <div class="resource-icon" :title="upgrade.name" :style="{backgroundImage:'url(/assets/' + (upgrade.icon ?? entity.building.icon) + ')'}"></div>
                </button>
            </div>
            <div v-if="entity.building && entity.building.production && entity.building.production.length" class="settings-option-wrapper">
                <div class="settings-title">Select Production</div>
                <div class="production-list">
                    <template v-for="production in entity.building.production">
                        <div class="select-production" v-if="!production.faction || !game.settings.selectedFaction || production.faction == game.settings.selectedFaction" :class="{'selected-production': entity.selectedProduction === production.id}" @click="changeProduction(production.id)">
                            <app-game-recipe :building="entity.building" :recipe="production"></app-game-recipe>
                            <h6 class="production-requirements">
                                <span v-if="production.power || entity.building.power" title="Power"><i class="fa fa-bolt"></i> {{production.power || entity.building.power}} MW</span>
                                &nbsp;&nbsp;&nbsp;
                                <span title="Time"><i class="fa fa-clock-o"></i> {{production.time}}s</span>
                            </h6>
                        </div>
                    </template>
                </div>
            </div>
        </template>
    </div>
    `
});

Vue.component('app-menu-construction-list', {
    props: ['menuData'],
    data: function() {
        return {
            buildings: window.objectData.buildings_list
        };
    },
    methods: {
        refresh: function() {
            this.$forceUpdate();
        },
        incrementTier: function() {
            this.bmc();
            game.settings.selectedTier++
            if (game.settings.selectedTier >= 4) {
                game.settings.selectedTier = 1;
            }
            game.updateSettings();
        },
        buildBuilding: function(building) {
            this.bmc();
            game.startBuild(building);
            game.sidebarMenuComponent.showHoverMenu(null);
        },
        buildingHover: function(building) {
            game.sidebarMenuComponent.showHoverMenu(building);
        }
    },
    template: html`
    <div id="construction-page">
        <div class="construction-filter-wrapper">
            <button class="construction-settings-button" @click="game.sidebarMenuComponent?.changeMenu('settings')" title="Filter Settings"><i class="fa fa-sliders" aria-hidden="true"></i></button>
            <button class="construction-tech-button" @click="incrementTier" title="Filter by Tier">{{'Tier ' + game.settings.selectedTier}}</button>
            <div class="construction-category-wrapper">
                <select class="app-input construction-category" @click="bmc" title="Filter by Category" v-model="game.selectedBuildingCategory" @change="refresh">
                    <option value="all">All Buildings</option>
                    <option v-for="(category, key) in buildingCategories" v-bind:value="key">{{category.name}}</option>
                </select>
            </div>
        </div>
        <div class="construction-items" class="menu-page">
            <template v-for="building in buildings">
                <div v-if="!building.hideInList && (game.selectedBuildingCategory === 'all' || building.category === game.selectedBuildingCategory) &&
                    (!building.parent || game.settings.showUpgradesAsBuildings) &&
                    (!building.techId || (game.settings.selectedTier === 2 && building.techId === 'unlockfacilitytier2') || game.settings.selectedTier === 3)"
                    class="build-icon" :style="{backgroundImage:'url(/assets/' + (building.parent?.icon ?? building.icon) + ')'}"
                    @mouseenter="bme(); buildingHover(building)" @mouseleave="buildingHover(null)" @click="buildBuilding(building)">
                </div>
            </template>
        </div>
    </div>
    `
});

Vue.component('app-menu-statistics', {
    props: ['menuData'],
    data() {
        return {
            cost: {},
            input: {},
            output: {},
            time: 3600,
            powerTotal: 0,
            powerProduced: 0,
            powerConsumed: 0,
            garrisonSupplies: 0,
        };
    },
    mounted() {
        this.refresh();
        game.statisticsMenuComponent = this;
    },
    methods: {
        refresh: function() {
            let cost = {};
            let input = {};
            let output = {};
            let powerTotal = 0;
            let powerProduced = 0;
            let powerConsumed = 0;
            let garrisonSupplies = 0;

            let garrisonConsumptionRate = Math.floor(this.time / 3600);
            for (let i=0; i<game.getEntities().length; i++) {
                let entity = game.getEntities()[i];
                if (entity.type === 'building') {
                    garrisonSupplies += (2 * (entity.building?.garrisonSupplyMultiplier ?? 1)) * garrisonConsumptionRate;
                }
            }

            for (let i=0; i<game.getEntities().length; i++) {
                let entity = game.getEntities()[i];
                if (entity.type === 'building') {
                    let buildingData = window.objectData.buildings[entity.subtype];
                    if (!buildingData) {
                        continue;
                    }

                    let productionSelected = typeof entity.selectedProduction === 'number';
                    // Always show power for buildings that have no production, but still should show in power for stats.
                    if (buildingData.key === 'field_modification_center' || buildingData.key === 'bms_foreman_stacker') {
                        productionSelected = true;
                    }

                    let power = productionSelected && buildingData.power ? buildingData.power : 0;
                    if (buildingData.cost) {
                        let costKeys = Object.keys(buildingData.cost);
                        for (let j = 0; j < costKeys.length; j++) {
                            let key = costKeys[j];
                            let value = buildingData.cost[key];
                            if (!cost[key]) {
                                cost[key] = 0;
                            }
                            cost[key] += value;
                        }
                    }

                    if (productionSelected && buildingData.production && buildingData.production.length) {
                        let selectedProduction;
                        buildingData.production.forEach(production => {
                            if (production.id === entity.selectedProduction) {
                                selectedProduction = production;
                            }
                        });
                        if (selectedProduction) {
                            if (selectedProduction.power) {
                                power = selectedProduction.power;
                            }

                            let productionTime = Math.floor(this.time / selectedProduction.time);
                            if (selectedProduction.input) {
                                let inputKeys = Object.keys(selectedProduction.input);
                                for (let j = 0; j < inputKeys.length; j++) {
                                    let key = inputKeys[j];
                                    let value = selectedProduction.input[key];
                                    if (!input[key]) {
                                        input[key] = 0;
                                    }
                                    input[key] += productionTime * value;
                                }
                            }

                            if (selectedProduction.output) {
                                let outputKeys = Object.keys(selectedProduction.output);
                                for (let j = 0; j < outputKeys.length; j++) {
                                    let key = outputKeys[j];
                                    let value = selectedProduction.output[key];
                                    if (!output[key]) {
                                        output[key] = 0;
                                    }
                                    output[key] += productionTime * value;
                                }
                            }

                            let inputKeys = Object.keys(input);
                            for (let j = 0; j < inputKeys.length; j++) {
                                let key = inputKeys[j];
                                if (output[key]) {
                                    let outputAmount = output[key];
                                    output[key] -= input[key];
                                    input[key] -= outputAmount;
                                    if (output[key] <= 0) {
                                        delete output[key];
                                    }
                                    if (input[key] <= 0) {
                                        delete input[key];
                                    }
                                }
                            }
                        }
                    }

                    powerTotal += power;
                    if (power > 0) {
                        powerProduced += power;
                    } else {
                        powerConsumed += power;
                    }
                }
            }

            this.cost = cost;
            this.input = input;
            this.output = output;
            this.powerTotal = powerTotal;
            this.powerProduced = powerProduced;
            this.powerConsumed = powerConsumed;
            this.garrisonSupplies = garrisonSupplies;

            this.$forceUpdate();
        },
    },
    template: html`
    <div style="text-align:left;">
        <div class="statistics-panel-header">
            <h3><i class="fa fa-bar-chart"></i> Statistics</h3><button class="close-statistics-button" @click="game.settings.enableStats = false; game.updateSettings()"><i class="fa fa-times"></i></button>
        </div>
        <div class="statistics-panel-body">
            <h4><i class="fa fa-wrench"></i> Construction Cost</h4>
            <div>
                <app-game-resource-icon v-for="(value, key) in cost" :resource="key" :amount="value"/>
            </div>
            <br>
            <h4><i class="fa fa-bolt"></i> Power</h4>
            <div style="color:#d0d004; width:250px; margin:auto;">
                <span style="color:#03b003;">Produced: {{powerProduced}} MW</span><br>
                <span style="color:#d50101;">Consumed: {{powerConsumed}} MW</span><br>
                Total: {{powerTotal}} MW
            </div>
            <br>
            <select class="app-input" v-model="time" @change="refresh">
                <option value="86400">Per 24 Hours</option>
                <option value="43200">Per 12 Hours</option>
                <option value="21600">Per 6 Hours</option>
                <option value="10800">Per 3 Hours</option>
                <option value="3600">Per 1 Hour</option>
                <option value="1800">Per 30 Minutes</option>
                <option value="900">Per 15 Minutes</option>
                <option value="60">Per 1 Minute</option>
            </select>
            <br><br>
            <app-game-resource-icon :resource="'garrisonsupplies'" :amount="garrisonSupplies"/>
            <br>
            <h4><i class="fa fa-sign-in"></i> Facility Input</h4>
            <div class="statistics-panel-fac-input">
                <app-game-resource-icon v-for="(value, key) in input" :resource="key" :amount="value"/>
            </div>
            <br>
            <h4><i class="fa fa-sign-out"></i> Facility Output</h4>
            <div class="statistics-panel-fac-output">
                <app-game-resource-icon v-for="(value, key) in output" :resource="key" :amount="value"/>
            </div>
        </div>
    </div>
    `
});

Vue.component('app-menu-settings', {
    props: ['menuData'],
    template: html`
    <div id="settings" class="text-left">
        <div class="settings-option-wrapper">
            <div class="settings-title">General Settings</div>
            <label class="app-input-label">
                <i class="fa fa-picture-o" aria-hidden="true"></i> Graphics
                <select class="app-input" v-model="game.settings.quality" v-on:change="game.updateQuality">
                    <option value="auto">Auto</option>
                    <option value="high">High Quality</option>
                    <option value="low">Low Quality</option>
                </select>
            </label>
            <label class="app-input-label">
                <i class="fa fa-volume-up" aria-hidden="true"></i> Volume
                <input type="range" v-model="game.settings.volume" min="0" max="1" step="0.1" class="slider" @input="game.updateSettings">
            </label>
            <label class="app-input-label">
                <i class="fa fa-flag" aria-hidden="true"></i> Display Faction Colors
                <input class="app-input" type="checkbox" v-model="game.settings.displayFactionTheme" @change="game.updateSettings">
            </label>
        </div>
        <div class="settings-option-wrapper">
            <div class="settings-title">Board Settings</div>
            <label class="app-input-label">
                <i class="fa fa-header" aria-hidden="true"></i> Display Facility Name
                <input class="app-input" type="checkbox" v-model="game.settings.showFacilityName" @change="game.updateSettings">
            </label>
            <label class="app-input-label">
                <i class="fa fa-th-large" aria-hidden="true"></i> Snap Grid Size
                <input class="app-input" type="number" v-model="game.settings.gridSize" @input="game.updateSettings">
            </label>
            <label class="app-input-label">
                <i class="fa fa-repeat" aria-hidden="true"></i> Snap Rotation Degrees
                <input class="app-input" type="number" v-model="game.settings.snapRotationDegrees" @input="game.updateSettings">
            </label>
        </div>
        <div class="settings-option-wrapper">
            <div class="settings-title">Construction Settings</div>
            <label class="app-input-label">
                <i class="fa fa-folder-open" aria-hidden="true"></i> Default Category
                <select class="app-input construction-category" v-model="game.settings.defaultBuildingCategory" @change="game.updateSettings">
                    <option value="all">All Buildings</option>
                    <option v-for="(category, key) in buildingCategories" v-bind:value="key">{{category.name}}</option>
                </select>
            </label>
            <label class="app-input-label">
                <i class="fa fa-filter" aria-hidden="true"></i> Show Upgrades in Building List
                <input class="app-input" type="checkbox" v-model="game.settings.showUpgradesAsBuildings" @change="game.updateSettings">
            </label>
        </div>
    </div>
    `
});

Vue.component('app-menu-save-load', {
    props: ['menuData'],
    data() {
        return {
            importAsSelection: false
        };
    },
    methods: {
        openFileBrowser: function(importAsSelection) {
            this.importAsSelection = importAsSelection;
            document.getElementById('fileUpload').click();
        },
        loadSave: function() {
            let file = this.$refs.file.files[0];
            let reader = new FileReader();
            let component = this;
            reader.onload = function() {
                let decoder = new TextDecoder("utf-8");
                let jsonString = decoder.decode(new Uint8Array(this.result));
                try {
                    let saveObject = JSON.parse(jsonString);
                    if (saveObject.name && !component.importAsSelection) {
                        game.facilityName = saveObject.name;
                        game.appComponent.$forceUpdate();
                    }
                    game.loadSave(saveObject, component.importAsSelection);
                    component.$forceUpdate();
                } catch (e) {
                    console.error('Failed to load save:', e);
                    game.showGrowl('Failed to load save.');
                }
            };
            reader.readAsArrayBuffer(file);
        },
        updateName: function() {
            if (game.facilityName === '') {
                game.facilityName = 'Unnamed Facility';
            }
            this.$forceUpdate();
            game.appComponent.$forceUpdate();
        }
    },
    template: html`
    <div id="save-load-page">
        <input id="fileUpload" @change="loadSave" type="file" ref="file" hidden>
        <div class="settings-option-wrapper">
            <div class="settings-title">Facility Properties</div>
            <label class="app-input-label facility-name-input">
                <i class="fa fa-pencil-square edit-icon" aria-hidden="true"></i>
                <input class="app-input" type="text" v-model="game.facilityName" @change="updateName">
            </label>
            <div class="text-center">
                <button class="app-btn app-btn-primary load-button" type="button" v-on:click="openFileBrowser()" @mouseenter="bme">
                    <i class="fa fa-upload"></i> Load
                </button>
                <button class="app-btn app-btn-primary save-button" type="button" v-on:click="game.downloadSave()" @mouseenter="bme">
                    <i class="fa fa-save"></i> Save
                </button>
            </div>
        </div>
        <div class="settings-option-wrapper">
            <div class="settings-title">Selection Options</div>
            <div class="text-button-wrapper">
                <button class="text-button" type="button" v-on:click="openFileBrowser(true)" @mouseenter="bme">
                    <i class="fa fa-upload"></i> Import Selection
                </button>
                <button v-if="game.getSelectedEntities().length > 1" class="text-button" type="button" v-on:click="game.downloadSave(true)" @mouseenter="bme">
                    <i class="fa fa-save"></i> Export Selection
                </button>
            </div>
        </div>
    </div>
    `
});

Vue.component('app-menu-about', {
    props: ['menuData'],
    methods: {
        buildBuilding: function(buildingKey) {
            this.bmc();
            game.createBuildingAtCenter(buildingKey);
        }
    },
    template: html`
    <div id="about-page">
        <div class="about-section">
            <div class="about-section-header"><i class="fa fa-question-circle"></i> What is this?</div>
            <p>
                Foxhole Facility Planner is a tool that allows you to draw up plans for facilities from Foxhole's new Inferno update.
            </p>
        </div>
        <div class="about-section">
            <div class="about-section-header"><i class="fa fa-wrench" aria-hidden="true"></i> Measurements</div>
            <p>
                Measurements for everything in the planner are not exact. We had to do some creative things to figure out ranges and the sizes of buildings, but the planner should work well enough as a guideline for building placement.
            </p>
        </div>
        <div class="about-section">
            <div class="about-section-header"><i class="fa fa-github" aria-hidden="true"></i> Contributors</div>
            <p class="contributors-list">
                <a href="https://bombsightgames.com/" target="_blank">[PEG] Rayboy</a>, <a href="https://github.com/jimdcunningham" target="_blank">[PEG] Jimbo</a>
            </p>
        </div>
        <div class="about-section">
            <p class="text-center">
                Made with ❤️ by the PEG Regiment.<br>
                <span style="font-size:10px;">
                    <a href="https://www.foxholegame.com/" target="_blank">Foxhole</a> is a registered trademark of <a href="https://www.siegecamp.com/" target="_blank">Siege Camp</a>.<br>
                    We are not affiliated with Siege Camp, this is a fan project.
                </span>
            </p>
        </div>
        <span style="font-size:7px; cursor:pointer; " @click="buildBuilding('sound_test')">worden smely 🤮</span>
    </div>
    `
});