Vue.component('app-game-build-menu', {
    data: function() {
        return {
            currentMenu: null,
            menuList: [
                {
                    name: 'Construction',
                    key: 'construction-list',
                    icon: 'fa-wrench'
                },
                {
                    name: 'Statistics',
                    key: 'statistics',
                    icon: 'fa-bar-chart'
                },
                {
                    name: 'Save/Load',
                    key: 'save-load',
                    icon: 'fa-save'
                },
                {
                    name: 'Settings',
                    key: 'settings',
                    icon: 'fa-gear'
                },
                {
                    name: 'About',
                    key: 'about',
                    icon: 'fa-info-circle'
                }
            ]
        };
    },
    methods: {
        changeMenu: function(newMenu) {
            this.bmc();
            if (newMenu) {
                this.currentMenu = newMenu;
            } else {
                this.currentMenu = null;
            }
        },
        bme: function() {
            game.playSound('button_hover');
        },
        bmc: function() {
            game.playSound('button_click');
        }
    },
    template: html`
    <div class="build-menu">
        <div class="build-menu-header">
            <img class="build-menu-logo" src="/assets/logo_transparent.webp">
        </div>
        <div v-if="!currentMenu">
            <button type="button" class="app-btn app-btn-primary" v-for="item in menuList" v-on:click="changeMenu(item)" @mouseenter="bme">
                <i :class="'fa ' + item.icon"></i> {{item.name}}
            </button>
        </div>
        <div v-if="currentMenu">
            <h2><i :class="'fa ' + currentMenu.icon"></i> {{currentMenu.name}}</h2>
            <div style="height:695px; overflow-x:hidden; overflow-y:auto;">
                <component v-bind:is="'app-menu-' + currentMenu.key"></component>
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
            <a href="https://www.reddit.com/r/foxholegame/comments/xgx0bf/i_started_making_a_facility_planner_webtool_what/" target="_blank">
                <i class="fa fa-reddit" aria-hidden="true"></i>
            </a>
        </div>
    </div>
    `
});

Vue.component('app-menu-construction-list', {
    data: function() {
        return {
            buildings: window.objectData.buildings_list
        };
    },
    methods: {
        buildBuilding: function(building) {
            this.bmc();
            game.startBuild(building);
        },
        bme: function() {
            game.playSound('button_hover');
        },
        bmc: function() {
            game.playSound('button_click');
        }
    },
    template: html`
    <div>
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
    </div>
    `
});

Vue.component('app-menu-statistics', {
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

Vue.component('app-menu-about', {
    template: html`
    <div>
        TODO
    </div>
    `
});