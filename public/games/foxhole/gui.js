const liquidResourceMap = {
    'diesel': 100,
    'petrol': 50,
    'water': 50,
    'oil': 50,
    'facilityoil1': 30,
    'facilityoil2': 30
};

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
                x{{amount.toLocaleString('en-US')}}<template v-if="resourceData.isLiquid">L <small v-if="liquidResourceMap[resource]">(x{{Math.ceil(amount / liquidResourceMap[resource])}} Cans)</small></template>
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
            displayTime: false,
            time: 3600,
            bunker: null,
            powerTotal: 0,
            powerProduced: 0,
            powerConsumed: 0,
            selection: false,
            maintenanceSupplies: 0
        };
    },
    mounted() {
        this.refresh();
        game.statisticsMenuComponent = this;
    },
    methods: {
        getSortedList: function(list) {
            const keys = Object.keys(list);
            if (keys.length) {
                return keys.sort().reduce((data, key) => {
                    data[key] = list[key];
                    return data;
                }, {});
            }
            return null;
        },
        refresh: function() {
            let cost = {};
            let input = {};
            let output = {};
            let bunker = {
                total: 0,
                maxHealth: 0,
                repairCost: 0,
                structuralIntegrity: 1.0,
                damageProfiles: {}
            };
            let displayTime = false;
            let powerTotal = 0;
            let powerProduced = 0;
            let powerConsumed = 0;
            let maintenanceSupplies = 0;
            let maintenanceConsumptionRate = Math.floor(this.time / 3600);
            let maintenanceTunnels = [];
            //let garrisonConsumptionReducers = [];

            this.selection = game.settings.enableSelectionStats && game.getSelectedEntities().length;

            const entities = game.getEntities();
            let selectedBunker = null;
            for (let i = 0; i < entities.length; i++) {
                let entity = entities[i];
                if (entity.building) {
                    if (entity.building.key === 'maintenance_tunnel') {
                        maintenanceTunnels.push(entity);
                        entity.maintainedConsumptionRate = 0;
                        entity.maintainedStructures = 0;
                    }
                    /*
                    if (entity.baseUpgrades?.base === 'large_garrison') {
                        garrisonConsumptionReducers.push(entity);
                    }
                    */
                    if (this.selection && selectedBunker !== false && entity.building.canUnion && entity.selected) {
                        if (selectedBunker === null) {
                            selectedBunker = entity;
                        }
                        if (selectedBunker && selectedBunker.getUnion() !== entity.getUnion()) {
                            selectedBunker = false;
                        }
                    }
                }
            }
            
            for (let i = 0; i < entities.length; i++) {
                let entity = entities[i];
                if (entity.type === 'building') {
                    let buildingData = window.objectData.buildings[entity.subtype];
                    if (!buildingData) {
                        continue;
                    }

                    if (selectedBunker && buildingData?.canUnion && buildingData.structuralIntegrity && entity.getUnion() === selectedBunker.getUnion()) {
                        bunker.total += 1;
                        bunker.maxHealth += buildingData.maxHealth;
                        bunker.repairCost += buildingData.repairCost;
                        bunker.structuralIntegrity *= buildingData.structuralIntegrity;
                    }

                    let consumptionRate = 2 * (buildingData.garrisonSupplyMultiplier ?? 1);
                    let totalConsumptionRate = consumptionRate * maintenanceConsumptionRate;
                    for (const maintenanceTunnel of maintenanceTunnels) {
                        if (totalConsumptionRate > 0 && (buildingData.category !== 'vehicles' && buildingData.category !== 'trains' && buildingData.category !== 'world') &&
                            (maintenanceTunnel === entity || (Math.distanceBetween(entity, maintenanceTunnel) < (maintenanceTunnel.maintenanceFilters.range * METER_BOARD_PIXEL_SIZE))) &&
                            !maintenanceTunnel.maintenanceFilters.exclusions.includes(buildingData.category)) {
                            maintenanceTunnel.maintainedConsumptionRate += consumptionRate;
                            maintenanceTunnel.maintainedStructures += 1;
                        }
                    }

                    if (entity.selected || !this.selection) {
                        // TODO: Need to actually get whether a structure decays or not from foxhole data.
                        if (buildingData.category !== 'vehicles' && buildingData.category !== 'trains' && buildingData.category !== 'world') {
                            displayTime = true;
                            /*
                            for (let j = 0; j < garrisonConsumptionReducers.length; j++) {
                                const garrison = garrisonConsumptionReducers[j];
                                if (Math.distanceBetween(entity.mid, garrison) < (garrison.building.baseUpgrades.base['large_garrison'].range.max * 32)) {
                                    consumptionRate /= 2;
                                    break;
                                }
                            }
                            */
                            maintenanceSupplies += totalConsumptionRate;
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
                            for (const production of ((entity.baseProduction && buildingData.parent) || buildingData).production) {
                                if (production.id === entity.selectedProduction) {
                                    selectedProduction = production;
                                    break;
                                }
                            }
                            if (selectedProduction) {
                                displayTime = true;

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

                        powerTotal += power;
                        if (power > 0) {
                            powerProduced += power;
                        } else {
                            powerConsumed += power;
                        }
                    }
                }
            }

            if (selectedBunker) {
                bunker.structuralIntegrity = bunker.total === 1 ? 1 : bunker.structuralIntegrity;
                bunker.maxHealth = Math.floor(bunker.maxHealth * bunker.structuralIntegrity);
                bunker.class = bunker.structuralIntegrity >= 0.75 ? 'high' : (bunker.structuralIntegrity >= 0.5 ? 'medium' : (bunker.structuralIntegrity >= 0.25 ? 'low' : 'critical'));
                for (const [weaponKey, weapon] of Object.entries(gameData.weapons)) {
                    if (weapon.damageType) {
                        let damageProfiles = {};
                        for (const [type, damage] of Object.entries(weapon.damageType.profiles)) {
                            let dryingMultiplier = 1, damageMultiplier = (weapon.damageType.multipliers && weapon.damageType.multipliers[type]) || 1;
                            if (game.settings.enableBunkerDryingStats && type === 't3' && this.time < 86400) {
                                dryingMultiplier = this.time < 8640 ? 10 : 86400 / this.time;
                            }
                            damageProfiles[type] = damage ? Math.ceil(bunker.maxHealth / (weapon.damage * damage * dryingMultiplier * damageMultiplier)) : 0;
                        }
                        bunker.damageProfiles[weaponKey] = damageProfiles;
                    }
                }
            }

            // TODO: Sort resources by actual display name. Probably not worth doing. This is fine
            this.cost = this.getSortedList(cost);
            this.input = this.getSortedList(input);
            this.output = this.getSortedList(output);

            this.bunker = (selectedBunker && bunker) || null;
            this.displayTime = displayTime;
            this.powerTotal = powerTotal;
            this.powerProduced = powerProduced;
            this.powerConsumed = powerConsumed;
            this.maintenanceSupplies = maintenanceSupplies;

            const selectedEntity = game.getSelectedEntity();
            if (game.buildingSelectedMenuComponent && selectedEntity?.building?.key === 'maintenance_tunnel') {
                game.buildingSelectedMenuComponent.refresh();
            }

            this.$forceUpdate();
        },
    },
    template: html`
    <div v-if="game.settings.enableStats" class="board-panel statistics-panel">
        <div class="board-panel-header">
            <h4 class="float-left m-0" style="color: #eee"><i class="fa fa-bar-chart"></i> {{selection ? 'Selection' : 'Global'}} Statistics</h4>
            <!--<button class="btn-small m-0 float-right" title="Maximize Stats"><i class="fa fa-window-maximize"></i></button>-->
            <button class="btn-small m-0 mr-1 float-right" title="Minimize Stats" @click="game.settings.enableStats = false; game.updateSettings()"><i class="fa fa-window-minimize"></i></button>
            <button class="btn-small m-0 mr-2 float-right" :class="{'btn-active': game.settings.enableSelectionStats}" title="Toggle Selection Stats" @click="game.settings.enableSelectionStats = !game.settings.enableSelectionStats; game.updateSettings(); game.refreshStats()"><i class="fa fa-mouse-pointer"></i></button>
        </div>
        <div class="board-panel-body">
            <div v-if="!(cost || bunker?.total || displayTime || powerProduced || powerConsumed || powerTotal || maintenanceSupplies || input || output)" class="text-center" style="color: #f0f0f0">{{game.settings.enableSelectionStats ? 'Select' : 'Place'}} buildings to see their stats here.</div>
            <div v-if="cost" class="construction-options-wrapper">
                <h5 class="construction-options-header"><i class="fa fa-wrench"></i> {{selection && 'Selection ' || ''}}Construction Cost</h5>
                <div>
                    <app-game-resource-icon v-for="(value, key) in cost" :resource="key" :amount="value"/>
                </div>
            </div>
            <div v-if="selection && bunker?.total" class="construction-options-wrapper">
                <h5 class="construction-options-header"><i class="fa fa-shield" aria-hidden="true"></i> Selected Bunker Stats</h5>
                <div class="construction-options row d-flex justify-content-center">
                    <div class="btn-small col" style="color: #00ca00;">
                        <span style="font-size: 18px;">{{bunker.maxHealth.toLocaleString()}}</span>
                        <span class="label">health</span>
                    </div>
                    <div class="btn-small col" style="color: #d0d004;">
                        <span style="font-size: 18px;">{{bunker.repairCost.toLocaleString()}}</span>
                        <span class="label">repair</span>
                    </div>
                    <div class="btn-small col" :class="bunker.class + '-structural-integrity'">
                        <span style="font-size: 18px;">{{Math.floor(bunker.structuralIntegrity * 100)}} <small>%</small></span>
                        <!--<span class="label">{{bunker.structuralIntegrity.toFixed(4)}}</span>-->
                        <span class="label">{{bunker.class}}</span>
                    </div>
                </div>
            </div>
            <div v-if="powerProduced || powerConsumed || powerTotal" class="construction-options-wrapper">
                <h5 class="construction-options-header"><i class="fa fa-bolt"></i> {{selection ? 'Selection' : 'Facility'}} Power</h5>
                <div class="construction-options row d-flex justify-content-center">
                    <div class="btn-small col" style="color: #00ca00;">
                        <span style="font-size: 18px;">{{powerProduced}} <small>MW</small></span>
                        <span class="label">produced</span>
                    </div>
                    <div class="btn-small col" style="color: #ff0d0d;">
                        <span style="font-size: 18px;">{{powerConsumed}} <small>MW</small></span>
                        <span class="label">consumed</span>
                    </div>
                    <div class="btn-small col" style="color: #d0d004;">
                        <span style="font-size: 18px;">{{powerTotal}} <small>MW</small></span>
                        <span class="label">total</span>
                    </div>
                </div>
            </div>
            <div v-if="displayTime" class="construction-options-wrapper statistics-time-dropdown">
                <i class="fa fa-clock-o" aria-hidden="true"></i>
                <div class="time-select-wrapper">
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
                </div>
            </div>
            <div v-if="game.settings.enableExperimental && maintenanceSupplies" class="construction-options-wrapper" title="Maintenance Supplies are required to prevent structures from decaying. The following information indicates how much structures will cost based on the performance of the sub-region's consumption modifier.">
                <h5 class="construction-options-header">
                    <i class="inline-resource-icon" style="width: 18px;" :style="{backgroundImage: 'url(games/foxhole/assets/game/Textures/UI/ItemIcons/MaintenanceSuppliesIcon.webp)'}"></i> {{selection ? 'Selection Maintenance' : 'Maintenance Supplies'}}
                </h5>
                <div class="construction-options row d-flex justify-content-center">
                    <div class="btn-small col" style="color: #00ca00;">
                        <span style="font-size: 17px;"><small>x</small>{{maintenanceSupplies * 0.25}}</span>
                        <span class="label">very good</span>
                    </div>
                    <div class="btn-small col" style="color: #74d004;">
                        <span style="font-size: 17px;"><small>x</small>{{maintenanceSupplies * 0.5}}</span>
                        <span class="label">good</span>
                    </div>
                    <div class="btn-small col" style="color: #ffa500;">
                        <span style="font-size: 17px;"><small>x</small>{{maintenanceSupplies}}</span>
                        <span class="label">poor</span>
                    </div>
                    <div class="btn-small col" style="color: #ff0d0d;">
                        <span style="font-size: 17px;"><small>x</small>{{maintenanceSupplies * 2}}</span>
                        <span class="label">very poor</span>
                    </div>
                </div>
            </div>
            <div v-if="game.settings.enableExperimental && selection && bunker?.total" class="construction-options-wrapper">
                <h5 class="construction-options-header">
                    <i class="fa fa-shield"></i> Bunker Destruction Stats
                    <button class="btn-small m-0 float-right header-icon" :class="{'btn-active': game.settings.enableBunkerDryingStats}" title="Toggle Wet Concrete Drying Time" @click="game.settings.enableBunkerDryingStats = !game.settings.enableBunkerDryingStats; game.updateSettings(); game.refreshStats()"><i class="fa fa-tint"></i></button>
                </h5>
                <div class="bunker-damage-profile-stats">
                    <div class="weapon-row d-flex table-heading">
                        <div class="weapon-name flex-grow-2 px-2">Weapon</div>
                        <div class="weapon-damage">T1/T2</div>
                        <div class="weapon-damage">T3 {{(!game.settings.enableBunkerDryingStats || time == 86400) ? 'DRY' : 'WET'}}</div>
                    </div>
                    <div class="weapon-row d-flex" v-for="(damageProfile, weapon) in bunker?.damageProfiles" :title="gameData.weapons[weapon].name">
                        <div class="weapon-name flex-grow-2">
                            <div class="resource-icon mr-2" :style="{backgroundImage: 'url(' + gameData.weapons[weapon].icon + ')'}"></div>
                            {{gameData.weapons[weapon].alias ?? gameData.weapons[weapon].name}}
                        </div>
                        <div class="weapon-damage">{{damageProfile.t2}}</div>
                        <div class="weapon-damage">{{damageProfile.t3}}</div>
                    </div>
                </div>
            </div>
            <div v-if="input" class="construction-options-wrapper">
                <h5 class="construction-options-header"><i class="fa fa-sign-in"></i> {{selection ? 'Selection' : 'Production'}} Input</h5>
                <div class="statistics-panel-fac-input">
                    <app-game-resource-icon v-for="(value, key) in input" :resource="key" :amount="value"/>
                </div>
            </div>
            <div v-if="output" class="construction-options-wrapper">
                <h5 class="construction-options-header"><i class="fa fa-sign-out"></i> {{selection ? 'Selection' : 'Production'}} Output</h5>
                <div class="statistics-panel-fac-output">
                    <app-game-resource-icon v-for="(value, key) in output" :resource="key" :amount="value"/>
                </div>
            </div>
        </div>
    </div>
    `
});