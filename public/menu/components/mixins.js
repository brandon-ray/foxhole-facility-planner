Vue.mixin({
    methods: {
        bme: function() {
            game.playSound('button_hover');
        },
        bmc: function() {
            game.playSound('button_click');
        }
    }
});