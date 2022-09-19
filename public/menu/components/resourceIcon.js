Vue.component('app-game-resource-icon', {
    props: ['resource', 'amount'],
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
    <div class="resource-icon" v-if="resourceData" :title="resourceData.name" :style="style">
        <div style="position:relative; top:55%; left:2px; float:right; margin:5px;">
            {{amount.toLocaleString('en-US')}}<span v-if="resourceData.type === 'liquid'">L</span>
        </div>
    </div>
    `
});