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
                backgroundImage: 'url(/assets/' + (resourceData.icon ?? 'default_icon.webp') + ')'
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
            <div v-if="!recipe.input" class="resource-icon building-icon"><img v-bind:src="'/assets/' + (building.icon ?? 'default_icon.webp')" /></div>
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