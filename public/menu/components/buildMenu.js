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
        game.buildMenuComponent = this;
        this.changeMenu(null);
    },
    methods: {
        changeMenu: function(newMenu, menuData) {
            if (game.selectedEntity && (!newMenu || newMenu.key !== 'building-selected')) {
                game.setCurrentBuilding(null);
                game.selectEntity(null, true);
            }

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
        },
        selectFaction: function(faction) {
            game.setFaction(game.settings.selectedFaction !== faction ? faction : null);
        },
        showHoverMenu: function(data) {
            this.hoverData = data;
        }
    },
    template: html`
    <div id="sidebar">
        <div id="sidebar-header">
            <button class="colonial-button" :class="{ selected: game.settings.selectedFaction == 'c' }" @click="selectFaction('c')"></button>
            <img class="sidebar-logo" src="/assets/logo_transparent.webp">
            <button class="warden-button" :class="{ selected: game.settings.selectedFaction == 'w' }" @click="selectFaction('w')"></button>
        </div>
        <div id="sidebar-body">
            <div v-if="!currentMenu" class="menu-body">
                <app-menu-construction-list></app-menu-construction-list>
            </div>
            <div v-if="currentMenu" class="menu-body">
                <div class="menu-page-title"><i :class="'fa ' + currentMenu.icon"></i> {{currentMenu.name}}</div>
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
            <a href="https://github.com/brandon-ray/foxhole-facility-planner" target="_blank">
                <i class="fa fa-github"></i>
            </a>
            <button v-on:click="event.preventDefault(); changeMenu('settings')" class="float-right">
                <i class="fa fa-gear"></i>
            </button>
            <button v-on:click="event.preventDefault(); changeMenu('about')" class="float-right">
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
                <div class="building-info-production" v-if="hoverData.production && hoverData.production.length && hoverData.production.hasOutput">
                    <app-game-recipe v-for="(recipe, index) in hoverData.production" v-if="!recipe.faction || !game.settings.selectedFaction || recipe.faction == game.settings.selectedFaction" :building="hoverData" :recipe="recipe"></app-game-recipe>
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
            entityRotation: 0,
            hoverUpgradeName: null
        };
    },
    mounted: function() {
        game.buildingSelectedMenuComponent = this;
        this.refresh();
    },
    methods: {
        refresh: function() {
            if (game.selectedEntity) {
                this.entityRotation = Math.rad2deg(game.selectedEntity.rotation);
            }
            this.$forceUpdate();
        },
        updateRotation: function() {
            if (game.selectedEntity) {
                game.selectedEntity.rotation = Math.deg2rad(parseInt(this.entityRotation));
            }
        },
        addRail: function() {
            this.bmc();
            if (game.selectedEntity) {
                game.selectedEntity.addPoint(100, 0);
            }
        },
        changeProduction: function(index) {
            game.selectedEntity.selectedProduction = index;
            if (game.statisticsMenuComponent) {
                game.statisticsMenuComponent.refresh();
            }
            this.$forceUpdate();
        },
        changeUpgrade: function(upgrade) {
            this.bmc();
            if (game.selectedEntity && game.selectedEntity.building) {
                game.upgradeBuilding(game.selectedEntity, upgrade);
            }
        },
        lockBuilding: function() {
            this.bmc();
            game.lockBuilding(game.selectedEntity);
            this.$forceUpdate();
        },
        destroyBuilding: function() {
            this.bmc();
            if (game.selectedEntity) {
                game.selectedEntity.remove();
                game.selectEntity(null);
            }
        },
        showUpgradeHover: function(key, upgrade) {
            this.hoverUpgradeName = upgrade ? upgrade.name : null;
            let buildingUpgrade = null;
            if (key && upgrade && game.selectedEntity) {
                this.bme();
                const building = game.selectedEntity.building;
                if (building) {
                    buildingUpgrade = window.objectData.buildings[(building.parentKey ? building.parentKey : building.key) + '_' + key];
                }
            }
            game.buildMenuComponent.showHoverMenu(buildingUpgrade);
        }
    },
    template: html`
    <div style="text-align:left;" v-if="game.selectedEntity">
        <button type="button" class="trash-button" v-on:click="destroyBuilding" @mouseenter="bme"><i class="fa fa-trash"></i></button>
        <button type="button" class="lock-button" v-on:click="lockBuilding" @mouseenter="bme">
            <span v-if="game.selectedEntity.locked" class="locked"><i class="fa fa-lock"></i></span>
            <span v-else><i class="fa fa-unlock"></i></span>
        </button>
        <!--<button type="button" class="return-button" v-on:click="game.buildMenuComponent.changeMenu(null)" @mouseenter="bme"><i class="fa fa-arrow-left"></i></button>-->
        <div class="settings-option-wrapper">
            <div v-if="game.selectedEntity.type === 'building'" class="settings-title">
                {{game.selectedEntity.building.parentName ? game.selectedEntity.building.parentName : game.selectedEntity.building.name}}
            </div>
            <label class="app-input-label">
                <i class="fa fa-arrows" aria-hidden="true"></i> Position X:
                <input class="app-input" type="number" v-model="game.selectedEntity.position.x">
            </label>
            <label class="app-input-label">
                <i class="fa fa-arrows" aria-hidden="true"></i> Position Y:
                <input class="app-input" type="number" v-model="game.selectedEntity.position.y">
            </label>
            <label class="app-input-label">
                <i class="fa fa-repeat" aria-hidden="true"></i> Rotation:
                <input class="app-input" type="number" v-model="entityRotation" @change="updateRotation">
            </label>
        </div>
        <div v-if="game.selectedEntity.type === 'building' && game.selectedEntity.building && game.selectedEntity.building.upgrades" class="settings-option-wrapper upgrade-list">
            <div class="settings-title">{{hoverUpgradeName ?? (game.selectedEntity.building.upgradeName ? game.selectedEntity.building.upgradeName : 'No Upgrade Selected')}}</div>
            <button class="upgrade-button" v-for="(upgrade, key) in game.selectedEntity.building.upgrades" :class="{'selected-upgrade': game.selectedEntity.building.parentKey && game.selectedEntity.building.key === game.selectedEntity.building.parentKey + '_' + key}"
                @mouseenter="showUpgradeHover(key, upgrade)" @mouseleave="showUpgradeHover" @click="changeUpgrade(key)">
                <div class="resource-icon" :title="upgrade.name" :style="{backgroundImage:'url(/assets/' + (upgrade.part ? upgrade.part : (upgrade.icon ? upgrade.icon : game.selectedEntity.building.icon)) + ')'}"></div>
            </button>
        </div>
        <div v-if="game.selectedEntity.type === 'building' && game.selectedEntity.building && game.selectedEntity.building.production && game.selectedEntity.building.production.length" class="settings-option-wrapper">
            <div class="settings-title">Select Production</div>
            <div class="production-list">
                <div class="select-production" v-for="(production, index) in game.selectedEntity.building.production"
                    v-if="!production.faction || !game.settings.selectedFaction || production.faction == game.settings.selectedFaction" :class="{'selected-production': game.selectedEntity.selectedProduction === index}" @click="changeProduction(index)">
                    <app-game-recipe :building="game.selectedEntity.building" :recipe="production"></app-game-recipe>
                    <h6 class="production-requirements">
                        <span v-if="game.selectedEntity.building.power"><i class="fa fa-bolt"></i> {{production.power ? production.power : game.selectedEntity.building.power}} MW</span>
                        &nbsp;&nbsp;&nbsp;
                        <i class="fa fa-clock-o"></i> {{production.time}}s
                    </h6>
                </div>
            </div>
        </div>
        <!--
        <button type="button" class="app-btn app-btn-secondary delete-button" v-on:click="destroyBuilding" @mouseenter="bme">
            <i class="fa fa-trash"></i> Destroy
        </button>
        -->
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
        buildBuilding: function(building) {
            this.bmc();
            game.startBuild(building);
            game.buildMenuComponent.showHoverMenu(null);
        },
        buildingHover: function(building) {
            game.buildMenuComponent.showHoverMenu(building);
        }
    },
    template: html`
    <div id="construction-page">
        <select class="app-input construction-category" v-model="game.selectedBuildingCategory" @change="refresh">
            <option value="all">All Buildings</option>
            <option v-for="(category, key) in buildingCategories" v-bind:value="key">{{category.name}}</option>
        </select>
        <div class="construction-items" class="menu-page">
            <div v-for="building in buildings" v-if="!building.hideInList && (game.selectedBuildingCategory === 'all' || building.category === game.selectedBuildingCategory) && (!building.parentName || game.settings.showUpgradesAsBuildings)" class="build-icon" :style="{backgroundImage:'url(/assets/' + building.icon + ')'}"
                @mouseenter="bme(); buildingHover(building)" @mouseleave="buildingHover(null)" v-on:click="buildBuilding(building)">
            </div>
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
                    garrisonSupplies += 2 * garrisonConsumptionRate;
                }
            }

            for (let i=0; i<game.getEntities().length; i++) {
                let entity = game.getEntities()[i];
                if (entity.type === 'building') {
                    let buildingData = window.objectData.buildings[entity.subtype];
                    if (!buildingData) {
                        continue;
                    }

                    let power = buildingData.power ? buildingData.power : 0;
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

                    if (buildingData.production && buildingData.production.length) {
                        let productionList = buildingData.production;
                        let production = productionList[entity.selectedProduction];
                        if (production.power) {
                            power = production.power;
                        }

                        let productionTime = Math.floor(this.time / production.time);
                        if (production.input) {
                            let inputKeys = Object.keys(production.input);
                            for (let j = 0; j < inputKeys.length; j++) {
                                let key = inputKeys[j];
                                let value = production.input[key];
                                if (!input[key]) {
                                    input[key] = 0;
                                }
                                input[key] += productionTime * value;
                            }
                        }

                        if (production.output) {
                            let outputKeys = Object.keys(production.output);
                            for (let j = 0; j < outputKeys.length; j++) {
                                let key = outputKeys[j];
                                let value = production.output[key];
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
            <app-game-resource-icon :resource="'garrison_supplies'" :amount="garrisonSupplies"/>
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
        </div>
        <div class="settings-option-wrapper">
            <div class="settings-title">Board Settings</div>
            <!--
            <label class="app-input-label">
                <i class="fa fa-header" aria-hidden="true"></i> Display Facility Name
                <input class="app-input" type="checkbox" v-model="game.settings.showFacilityName" @change="game.updateSettings">
            </label>
            -->
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
                <i class="fa fa-filter" aria-hidden="true"></i> Show Upgrades in Building List
                <input class="app-input" type="checkbox" v-model="game.settings.showUpgradesAsBuildings" @change="game.updateSettings">
            </label>
        </div>
    </div>
    `
});

Vue.component('app-menu-save-load', {
    props: ['menuData'],
    methods: {
        openFileBrowser: function() {
            document.getElementById('fileUpload').click()
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
                    if (saveObject.name) {
                        game.facilityName = saveObject.name;
                    }
                    game.loadSave(saveObject);
                    component.$forceUpdate();
                } catch (e) {
                    console.error('Failed to load save:', e);
                    game.showGrowl('Failed to load save.');
                }
            };
            reader.readAsArrayBuffer(file);
        }
    },
    template: html`
    <div id="save-load-page">
        <label class="app-input-label" style="width:100%;">
            Facility Name:
            <input class="app-input" type="text" v-model="game.facilityName">
        </label>
        <button type="button" class="app-btn app-btn-primary" v-on:click="game.downloadSave()" @mouseenter="bme">
            <i class="fa fa-save"></i> Save
        </button>
        <br><br>
        <input id="fileUpload" @change="loadSave" type="file" ref="file" hidden>
        <button type="button" class="app-btn app-btn-primary" v-on:click="openFileBrowser()" @mouseenter="bme">
            <i class="fa fa-upload"></i> Load
        </button>
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