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
    template: `
    <div class="resource-icon" :title="resourceData.name" :style="style">
        <br><br>
        <div style="float:right; margin:5px;">
            {{amount}}
        </div>
    </div>
    `
})