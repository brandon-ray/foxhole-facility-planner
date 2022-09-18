Vue.component('app-game-resource-icon', {
    props: ['resource', 'amount'],
    data: function() {
        let resourceData = window.objectData.resources[this.resource];
        return {
            style: {
                backgroundImage: 'url(/assets/' + resourceData.icon + ')'
            },
            resourceData: resourceData
        };
    },
    methods: {
        bme: function() {
            game.playSound('button_hover');
        },
        bmc: function() {
            game.playSound('button_click');
        }
    },
    template: html`
    <div class="resource-icon" :title="resourceData.name" :style="style">
        <div style="position:relative; top:55%; left:2px; float:right; margin:5px;">
            {{amount.toLocaleString('en-US')}}<span v-if="resourceData.type === 'liquid'">L</span>
        </div>
    </div>
    `
});