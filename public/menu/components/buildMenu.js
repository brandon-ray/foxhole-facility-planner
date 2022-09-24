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
        showHoverMenu: function(data) {
            this.hoverData = data;
        }
    },
    template: html`
    <div id="sidebar">
        <div id="sidebar-header">
            <button class="colonial-button"></button>
            <img class="sidebar-logo" src="/assets/logo_transparent.webp">
            <button class="warden-button"></button>
        </div>
        <div id="sidebar-body">
            <div v-if="!currentMenu" class="menu-body">
                <app-menu-construction-list></app-menu-construction-list>
            </div>
            <div v-if="currentMenu" class="menu-body">
                <h3 class="menu-page-title"><i :class="'fa ' + currentMenu.icon"></i> {{currentMenu.name}}</h3>
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
        <div class="hover-menu" v-if="hoverData">
            <h3>{{hoverData.name}}</h3>
            <div style="text-align:center;" v-if="!hoverData.production">
                <div class="resource-icon" :title="hoverData.name" :style="{backgroundImage: 'url(/assets/' + hoverData.icon + ')'}"></div>
            </div>
            <div v-if="hoverData.production && hoverData.production.length">
                <div style="margin-bottom:20px; text-align:center;" v-for="production in hoverData.production">
                    <div class="row">
                        <div class="col" style="color:#d50101;" v-if="production.input">
                            <app-game-resource-icon v-for="(value, key) in production.input" :resource="key" :amount="value"/>
                        </div>
                        <div class="col-2">
                            <br>
                            <i class="fa fa-play fa-2x"></i>
                        </div>
                        <div class="col" style="color:#03b003;">
                            <div v-if="hoverData.power > 0">
                                <i class="fa fa-bolt fa-4x"></i>
                                <div style="color:#03b003;">
                                    {{hoverData.power}} MW
                                </div>
                            </div>
                            <app-game-resource-icon v-if="production.output" v-for="(value, key) in production.output" :resource="key" :amount="value"/>
                        </div>
                    </div>
                    <h4 style="color:#d0d004; padding-left:10px;">
                        <span v-if="hoverData.power"><i class="fa fa-bolt"></i> {{production.power ? production.power : hoverData.power}} MW</span>
                        &nbsp;&nbsp;&nbsp;
                        <i class="fa fa-clock-o"></i> {{production.time}}s
                    </h4>
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
            selectedEntity: null,
            entityRotation: 0,
        };
    },
    mounted: function() {
        game.buildingSelectedMenuComponent = this;
        this.refresh();
    },
    methods: {
        refresh: function() {
            this.selectedEntity = game.selectedEntity;
            if (this.selectedEntity) {
                this.entityRotation = Math.rad2deg(this.selectedEntity.rotation);
            }
        },
        updateRotation: function() {
            if (this.selectedEntity) {
                this.selectedEntity.rotation = Math.deg2rad(parseInt(this.entityRotation));
            }
        },
        addRail: function() {
            this.bmc();
            if (game.selectedEntity) {
                game.selectedEntity.addPoint(100, 0);
            }
        },
        changeProduction: function(index) {
            this.selectedEntity.selectedProduction = index;
            if (game.statisticsMenuComponent) {
                game.statisticsMenuComponent.refresh();
            }
            this.$forceUpdate();
        },
        destroyBuilding: function() {
            this.bmc();
            if (game.selectedEntity) {
                game.selectedEntity.remove();
                game.selectEntity(null);
            }
        }
    },
    template: html`
    <div style="text-align:left;" v-if="selectedEntity">
        <div v-if="selectedEntity.type === 'building'">
            <h5>{{selectedEntity.building.name}}</h5>
        </div>
        <div class="settings-option-wrapper">
            <label class="app-input-label">
                <i class="fa fa-arrows" aria-hidden="true"></i> Position X:
                <input class="app-input" type="number" v-model="selectedEntity.position.x">
            </label>
            <label class="app-input-label">
                <i class="fa fa-arrows" aria-hidden="true"></i> Position Y:
                <input class="app-input" type="number" v-model="selectedEntity.position.y">
            </label>
            <label class="app-input-label">
                <i class="fa fa-repeat" aria-hidden="true"></i> Rotation:
                <input class="app-input" type="number" v-model="entityRotation" @change="updateRotation">
            </label>
        </div>
        <div v-if="selectedEntity.type === 'building' && selectedEntity.building && selectedEntity.building.production && selectedEntity.building.production.length">
            <h5>Select Production</h5>
            <div style="margin-bottom:12px; text-align:center;" v-for="(production, index) in selectedEntity.building.production"
                 :class="{'selected-production': selectedEntity.selectedProduction === index}" @click="changeProduction(index)">
                <div class="row">
                    <div class="col" style="color:#d50101;" v-if="production.input">
                        <app-game-resource-icon v-for="(value, key) in production.input" :resource="key" :amount="value"/>
                    </div>
                    <div class="col-2">
                        <br>
                        <i class="fa fa-play fa-2x"></i>
                    </div>
                    <div class="col" style="color:#03b003;">
                        <div v-if="selectedEntity.building.power > 0">
                            <i class="fa fa-bolt fa-4x"></i>
                            <div style="color:#03b003;">
                                {{selectedEntity.building.power}} MW
                            </div>
                        </div>
                        <app-game-resource-icon v-if="production.output" v-for="(value, key) in production.output" :resource="key" :amount="value"/>
                    </div>
                </div>
                <h4 style="color:#d0d004; padding-left:10px;">
                    <span v-if="selectedEntity.building.power"><i class="fa fa-bolt"></i> {{production.power ? production.power : selectedEntity.building.power}} MW</span>
                    &nbsp;&nbsp;&nbsp;
                    <i class="fa fa-clock-o"></i> {{production.time}}s
                </h4>
            </div>
        </div>
        <button type="button" class="app-btn app-btn-secondary" v-on:click="destroyBuilding" @mouseenter="bme">
            <i class="fa fa-trash"></i> Destroy
        </button>
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
            <option value="foundations">Foundations</option>
            <option value="factories">Factories</option>
            <option value="harvesters">Harvesters</option>
            <option value="power">Power</option>
            <option value="misc">Miscellaneous</option>
        </select>
        <div class="construction-items" class="menu-page">
            <div v-for="building in buildings" v-if="!building.hideInList && building.category === game.selectedBuildingCategory" class="build-icon" :style="{backgroundImage:'url(/assets/' + building.icon + ')'}"
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
        <label class="settings-option-wrapper">
            <i class="fa fa-picture-o" aria-hidden="true"></i> Graphics
            <select class="app-input" v-model="game.settings.quality" v-on:change="game.updateQuality">
                <option value="auto">Auto</option>
                <option value="high">High Quality</option>
                <option value="low">Low Quality</option>
            </select>
        </label>
        <label class="settings-option-wrapper">
            <i class="fa fa-volume-up" aria-hidden="true"></i> Volume
            <input type="range" v-model="game.settings.volume" min="0" max="1" step="0.1" class="slider" @input="game.updateSettings">
        </label>
        <div class="settings-option-wrapper">
            <label class="app-input-label">
                <i class="fa fa-th-large" aria-hidden="true"></i> Snap Grid Size
                <input class="app-input" type="number" v-model="game.settings.gridSize" @input="game.updateSettings">
            </label>
            <label class="app-input-label">
                <i class="fa fa-repeat" aria-hidden="true"></i> Snap Rotation Degrees
                <input class="app-input" type="number" v-model="game.settings.snapRotationDegrees" @input="game.updateSettings">
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