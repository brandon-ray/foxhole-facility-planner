Vue.component('app-game-build-menu', {
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
    <div class="build-menu">
        <div class="build-menu-header">
            <img class="build-menu-logo" src="/assets/logo_transparent.webp">
        </div>
        <div v-if="!currentMenu">
            <!--
            <button type="button" class="app-btn app-btn-primary" v-for="item in menuList" v-on:click="changeMenu(item)" @mouseenter="bme">
                <i :class="'fa ' + item.icon"></i> {{item.name}}
            </button>
            -->
            <app-menu-construction-list></app-menu-construction-list>
            <button type="button" class="app-btn app-btn-primary" v-on:click="changeMenu('save-load')" @mouseenter="bme">
                <i class="fa fa-save"></i> Save/Load
            </button>
        </div>
        <div v-if="currentMenu">
            <h2><i :class="'fa ' + currentMenu.icon"></i> {{currentMenu.name}}</h2>
            <div class="build-menu-page">
                <component v-bind:is="'app-menu-' + currentMenu.key" :menuData="currentMenuData"></component>
            </div>
            <br>
            <button type="button" class="app-btn app-btn-primary" v-on:click="changeMenu(null)" @mouseenter="bme">
                <i class="fa fa-arrow-left"></i> Return
            </button>
        </div>
        <div class="build-menu-footer">
            <a href="https://github.com/brandon-ray/foxhole-facility-planner" target="_blank">
                <i class="fa fa-github" aria-hidden="true"></i>
            </a>
            <button v-on:click="event.preventDefault(); changeMenu('settings')" class="float-right">
                <i class="fa fa-gear" aria-hidden="true"></i>
            </button>
            <button v-on:click="event.preventDefault(); changeMenu('about')" class="float-right">
                <i class="fa fa-question-circle" aria-hidden="true"></i>
            </button>
        </div>
        <div class="hover-menu" v-if="hoverData">
            <h3>{{hoverData.name}}</h3>
            <div style="text-align:center;" v-if="!hoverData.production">
                <div class="resource-icon" :title="hoverData.name" :style="{backgroundImage: 'url(/assets/' + hoverData.icon + ')'}"></div>
            </div>
            <div class="row" style="padding-bottom:5px; text-align:center;" v-if="hoverData.production">
                <div class="col" style="color:#d50101;" v-if="hoverData.production.input">
                    <app-game-resource-icon v-for="(value, key) in hoverData.production.input" :resource="key" :amount="value"/>
                </div>
                <div class="col-2">
                    <br>
                    <i class="fa fa-play fa-2x"></i>
                </div>
                <div class="col" style="color:#03b003;" v-if="hoverData.production.output">
                    <app-game-resource-icon v-for="(value, key) in hoverData.production.output" :resource="key" :amount="value"/>
                </div>
                <div class="col" v-if="hoverData.power > 0">
                    <i class="fa fa-bolt fa-4x"></i>
                    <div style="color:#03b003;">
                        {{hoverData.power}} MW
                    </div>
                </div>
            </div>
            <h4 style="color:#d0d004; padding-left:10px;" v-if="hoverData.production">
                <span v-if="hoverData.power"><i class="fa fa-bolt"></i> {{hoverData.power}} MW</span>
                &nbsp;&nbsp;&nbsp;
                <i class="fa fa-clock-o"></i> {{hoverData.production.time}}s
            </h4>
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
            <h4>{{selectedEntity.building.name}}</h4>
            <br>
        </div>
        <label class="app-input-label">
            Position X:
            <input class="app-input" type="number" v-model="selectedEntity.position.x">
        </label>
        <label class="app-input-label">
            Position Y:
            <input class="app-input" type="number" v-model="selectedEntity.position.y">
        </label>
        <label class="app-input-label">
            Rotation:
            <input class="app-input" type="number" v-model="entityRotation" @change="updateRotation">
        </label>
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
            category: 'buildings',
            buildings: window.objectData.buildings_list
        };
    },
    methods: {
        refresh: function() {

        },
        buildBuilding: function(building) {
            this.bmc();
            game.startBuild(building);
        },
        buildingHover: function(building) {
            game.buildMenuComponent.showHoverMenu(building);
        }
    },
    template: html`
    <div>
        <select class="app-input" v-model="category" @change="refresh">
            <option value="buildings">Buildings</option>
        </select>
        <div class="build-menu-page" style="text-align:left; margin-bottom:4px; height:732px;">
            <div v-for="building in buildings" class="build-icon" :style="{backgroundImage:'url(/assets/' + building.icon + ')'}"
                 @mouseenter="bme(); buildingHover(building)" @mouseleave="buildingHover(null)" v-on:click="buildBuilding(building)">
            </div>
            <!--
            <div v-for="building in buildings" class="build-icon">
                <h3>{{building.name}}</h3>
                <h4 style="color:#d0d004; padding-left:10px;" v-if="building.production">
                    <span v-if="building.power"><i class="fa fa-bolt"></i> {{building.power}} MW<br></span>
                    <i class="fa fa-clock-o"></i> {{building.production.time}}s
                </h4>
                <div style="text-align:center;" v-if="!building.production">
                    <div class="resource-icon" :title="building.name" :style="{backgroundImage: 'url(/assets/' + building.icon + ')'}"></div>
                </div>
                <div class="row" style="text-align:center;" v-if="building.production">
                    <div class="col" style="color:#d50101;" v-if="building.production.input">
                        <app-game-resource-icon v-for="(value, key) in building.production.input" :resource="key" :amount="value"/>
                    </div>
                    <div class="col-2">
                        <br>
                        <i class="fa fa-play fa-2x"></i>
                    </div>
                    <div class="col" style="color:#03b003;" v-if="building.production.output">
                        <app-game-resource-icon v-for="(value, key) in building.production.output" :resource="key" :amount="value"/>
                    </div>
                    <div class="col" v-if="building.power > 0">
                        <i class="fa fa-bolt fa-4x"></i>
                        <div style="color:#03b003;">
                            {{building.power}} MW
                        </div>
                    </div>
                </div>
                <br>
                <button type="button" class="app-btn app-btn-secondary" v-on:click="buildBuilding(building)" @mouseenter="bme">
                    <i class="fa fa-plus"></i> Build
                </button>
            </div>
            -->
        </div>
    </div>
    `
});

Vue.component('app-menu-statistics', {
    props: ['menuData'],
    data() {
        return {
            input: {},
            output: {},
            time: 3600,
            powerTotal: 0,
            powerProduced: 0,
            powerConsumed: 0
        };
    },
    mounted() {
        this.refresh();
        game.statisticsMenuComponent = this;
    },
    methods: {
        refresh: function() {
            let input = {};
            let output = {};
            let powerTotal = 0;
            let powerProduced = 0;
            let powerConsumed = 0;
            for (let i=0; i<game.getEntities().length; i++) {
                let entity = game.getEntities()[i];
                if (entity.type === 'building') {
                    let buildingData = window.objectData.buildings[entity.subtype];
                    powerTotal += buildingData.power;
                    if (buildingData.power > 0) {
                        powerProduced += buildingData.power;
                    } else {
                        powerConsumed += buildingData.power;
                    }

                    if (buildingData.production) {
                        let productionTime = Math.floor(this.time / buildingData.production.time);
                        if (buildingData.production.input) {
                            let inputKeys = Object.keys(buildingData.production.input);
                            for (let j = 0; j < inputKeys.length; j++) {
                                let key = inputKeys[j];
                                let value = buildingData.production.input[key];
                                if (!input[key]) {
                                    input[key] = 0;
                                }
                                input[key] += productionTime * value;
                            }
                        }

                        if (buildingData.production.output) {
                            let outputKeys = Object.keys(buildingData.production.output);
                            for (let j = 0; j < outputKeys.length; j++) {
                                let key = outputKeys[j];
                                let value = buildingData.production.output[key];
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
            }

            this.input = input;
            this.output = output;
            this.powerTotal = powerTotal;
            this.powerProduced = powerProduced;
            this.powerConsumed = powerConsumed;

            this.$forceUpdate();
        },
    },
    template: html`
    <div style="text-align:left;">
        <br>
        <h4><i class="fa fa-wrench"></i> Construction Cost</h4>
        TODO
        <br><br>
        <h4><i class="fa fa-bolt"></i> Power</h4>
        <div style="color:#d0d004; width:250px; margin:auto;">
            <span style="color:#03b003;">Produced: {{powerProduced}} MW</span><br>
            <span style="color:#d50101;">Consumed: {{powerConsumed}} MW</span><br>
            Total: {{powerTotal}} MW
        </div>
        <br><br>
        <select class="app-input" v-model="time" @change="refresh">
            <option value="86400">Per 24 Hours</option>
            <option value="10800">Per 3 Hours</option>
            <option value="3600">Per 1 Hour</option>
            <option value="1800">Per 30 Minutes</option>
            <option value="900">Per 15 Minutes</option>
            <option value="60">Per 1 Minute</option>
        </select>
        <br>
        <h4><i class="fa fa-sign-in"></i> Facility Input</h4>
        <div>
            <app-game-resource-icon style="color:#d50101; display:inline-block; margin:3px;" v-for="(value, key) in input" :resource="key" :amount="value"/>
        </div>
        <br>
        <h4><i class="fa fa-sign-out"></i> Facility Output</h4>
        <div>
            <app-game-resource-icon style="color:#03b003; display:inline-block; margin:3px;" v-for="(value, key) in output" :resource="key" :amount="value"/>
        </div>
        <br><br>
    </div>
    `
});

Vue.component('app-menu-settings', {
    props: ['menuData'],
    template: html`
    <div id="settings" class="text-left">
        <label>
            Graphics Quality
            <select class="app-input" v-model="game.settings.quality" v-on:change="game.updateQuality">
                <option value="auto">Auto</option>
                <option value="high">High Quality</option>
                <option value="low">Low Quality</option>
            </select>
        </label>
        <br>
        <label>
            Sound Volume<br>
            <input type="range" v-model="game.settings.volume" min="0" max="1" step="0.1" style="width:320px;" class="slider" @input="game.updateSettings">
        </label>
        <label class="app-input-label">
            Snap Grid Size:
            <input class="app-input" type="number" v-model="game.settings.gridSize">
        </label>
        <label class="app-input-label">
            Snap Rotation Degrees:
            <input class="app-input" type="number" v-model="game.settings.snapRotationDegrees">
        </label>
    </div>
    `
});

Vue.component('app-menu-about', {
    props: ['menuData'],
    template: html`
    <div id="about-page">
        <p>
            TODO
        </p>
        <br>
        <a href="https://github.com/brandon-ray/foxhole-facility-planner" target="_blank" class="text-right">
            <i class="fa fa-github" aria-hidden="true"></i> GitHub Repo
        </a>
    </div>
    `
});