Vue.component('app-game-resource-icon', {
    props: ['resource', 'amount', 'column'],
    data: function() {
        return {
            style: {},
            resourceData: null
        };
    },
    mounted: function() {
        this.refresh();
    },
    watch: {
        resource: function() {
            this.refresh();
        }
    },
    methods: {
        refresh: function() {
            let resourceData = window.objectData.resources[this.resource];
            if (!resourceData) {
                console.error('Undefined resource:', this.resource);
                return;
            }
            this.resourceData = resourceData;
            this.style = {
                backgroundImage: `url(${resourceData.icon ?? '/assets/default_icon.webp'})`
            };
        }
    },
    template: html`
    <template v-if="resourceData">
        <div class="resource-col" v-if="column" :title="resourceData.name">
            <div class="resource-icon" :style="style"></div>
            <div class="resource-amount">
                x{{amount.toLocaleString('en-US')}}<template v-if="resourceData.isLiquid">L</template>
            </div>
        </div>
        <div class="resource-row" v-else :title="resourceData.name">
            <div class="resource-icon" :style="style"></div>
            <div class="resource-name">{{resourceData.name}}</div>
            <div class="resource-amount">
                x{{amount.toLocaleString('en-US')}}<template v-if="resourceData.isLiquid">L</template>
            </div>
        </div>
    </template>
    `
});

Vue.component('app-game-recipe', {
    props: ['building', 'recipe'],
    template: html`
    <div class="produced-resource-row">
        <div class="produced-resource">
            <span v-for="(amount, resourceId) in recipe.output">{{objectData.resources[resourceId].name}}</span><span v-if="building.power > 0">Power</span>
        </div>
        <div class="production-recipe">
            <div v-if="!recipe.input" class="resource-icon building-icon"><img v-bind:src="building.icon ?? '/assets/default_icon.webp'" /></div>
            <app-game-resource-icon class="produced-resource-input" v-for="(value, key) in recipe.input" :resource="key" :amount="value" :column="true" />
            <div class="production-pointer">
                <i class="fa fa-play"></i>
            </div>
            <app-game-resource-icon class="produced-resource-output" v-for="(value, key) in recipe.output" :resource="key" :amount="value" :column="true" />
            <div class="resource-col building-icon power-production" title="Power" v-if="recipe.power > 0 || building.power > 0">
                <div class="resource-icon"><i class="fa fa-bolt"></i></div>
                <div class="resource-amount">x{{recipe.power || building.power}}</div>
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
        sortKeys: function(list) {
            return Object.keys(list).sort().reduce((data, key) => {
                data[key] = list[key];
                return data;
            }, {});
        },
        refresh: function() {
            let cost = {};
            let input = {};
            let output = {};
            let powerTotal = 0;
            let powerProduced = 0;
            let powerConsumed = 0;
            let garrisonSupplies = 0;
            let garrisonConsumptionRate = Math.floor(this.time / 3600);
            let garrisonConsumptionReducers = [];
            for (let i=0; i<game.getEntities().length; i++) {
                let entity = game.getEntities()[i];
                if (entity.building && entity.building.range?.type === 'garrisonReduceDecay') {
                    garrisonConsumptionReducers.push(entity);
                }
            }

            for (let i=0; i<game.getEntities().length; i++) {
                let entity = game.getEntities()[i];
                if (entity.type === 'building') {
                    let buildingData = window.objectData.buildings[entity.subtype];
                    if (!buildingData) {
                        continue;
                    }

                    // TODO: Need to actually get whether a structure decays or not from foxhole data.
                    if (buildingData.category !== 'vehicles' && buildingData.category !== 'misc') {
                        let consumptionRate = (2 * (buildingData.garrisonSupplyMultiplier ?? 1)) * garrisonConsumptionRate;
                        for (let j = 0; j < garrisonConsumptionReducers.length; j++) {
                            const garrison = garrisonConsumptionReducers[j];
                            if (Math.distanceBetween(entity.mid, garrison) < garrison.building.range.max * 32) {
                                consumptionRate /= 2;
                            }
                        }
                        garrisonSupplies += consumptionRate;
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

                            let productionCycles = ~~(this.time / selectedProduction.time);
                            if (typeof entity.productionScale === 'number') {
                                const productionTime = this.time / (selectedProduction.time > 3600 ? 86400 : 3600);
                                const productionLimit = productionTime < 1 ? entity.productionScale : ~~(entity.productionScale * productionTime);
                                productionCycles = Math.min(productionCycles, productionLimit);
                            }

                            if (productionCycles > 0) {
                                if (selectedProduction.input) {
                                    let inputKeys = Object.keys(selectedProduction.input);
                                    for (let j = 0; j < inputKeys.length; j++) {
                                        let key = inputKeys[j];
                                        let value = selectedProduction.input[key];
                                        if (!input[key]) {
                                            input[key] = 0;
                                        }
                                        input[key] += productionCycles * value;
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
                                        output[key] += productionCycles * value;
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

                    // TODO: Sort resources by actual display name. Probably not worth doing. This is fine
                    input = this.sortKeys(input);
                    output = this.sortKeys(output);

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
            <h4 class="float-left m-0" style="color: #eee"><i class="fa fa-bar-chart"></i> Statistics</h4>
            <!--<button class="btn-small m-0 float-right" title="Maximize Stats"><i class="fa fa-window-maximize"></i></button>-->
            <button class="btn-small m-0 mr-1 float-right" title="Minimize Stats" @click="game.settings.enableStats = false; game.updateSettings()"><i class="fa fa-window-minimize"></i></button>
        </div>
        <div class="statistics-panel-body">
            <h4><i class="fa fa-wrench"></i> Construction Cost</h4>
            <div>
                <app-game-resource-icon v-for="(value, key) in cost" :resource="key" :amount="value"/>
            </div>
            <br>
            <h4><i class="fa fa-bolt"></i> Facility Power</h4>
            <div style="color:#d0d004; width:250px; margin:auto;">
                <span style="color:#03b003;">Produced: {{powerProduced}} MW</span><br>
                <span style="color:#d50101;">Consumed: {{powerConsumed}} MW</span><br>
                Total: {{powerTotal}} MW
            </div>
            <br>
            <select class="app-input" v-model="time" @change="refresh()">
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