Vue.component('app-game-build-menu', {
    mounted: function() {
        game.gameBuildMenuComponent = this;
    },
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
    template: `
    <div class="build-menu">
        <div v-for="building in buildings" class="build-icon">
            {{building.name}}<br>
            <div class="row">
                <div class="col">
                <app-game-resource-icon v-for="(value, key) in building.production.input" :resource="key" :amount="value"/>
                </div>
                <div class="col-2">
                    <br>
                    <i class="fa fa-play fa-2x"></i>
                </div>
                <div class="col">
                    <app-game-resource-icon v-for="(value, key) in building.production.output" :resource="key" :amount="value"/>
                </div>
            </div>
            <div>
                {{building.power}} MW<br>
                {{building.production.time}}s
            </div>
            <button type="button" class="app-btn app-btn-primary" v-on:click="buildBuilding(building)" @mouseenter="bme">
                <i class="fa fa-plus"></i> Build
            </button>
        </div>
        <br>
        <button type="button" class="app-btn app-btn-primary" v-on:click="bmc(); state=null" @mouseenter="bme">
            <i class="fa fa-arrow-left"></i> Return
        </button>
    </div>
    `
})