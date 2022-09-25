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
                backgroundImage: 'url(/assets/' + resourceData.icon + ')'
            };
        }
    },
    template: html`
    <template v-if="resourceData">
        <div class="resource-col" v-if="column">
            <div class="resource-icon" :title="resourceData.name" :style="style"></div>
            <div class="resource-amount">
                x{{amount.toLocaleString('en-US')}}<template v-if="resourceData.type === 'liquid'">L</template>
            </div>
        </div>
        <div class="resource-row" v-else>
            <div class="resource-icon" :title="resourceData.name" :style="style"></div>
            <div class="resource-name">{{resourceData.name}}</div>
            <div class="resource-amount">
                x{{amount.toLocaleString('en-US')}}<template v-if="resourceData.type === 'liquid'">L</template>
            </div>
        </div>
    </template>
    `
});