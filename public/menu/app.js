if (isMobile && !isPhoneApp) {
    console.info('Mobile is disabled for now.');
    $('#loading').hide();
    $('#mobile-disabled-message').show();
} else {
    let currentStateData = null;
    game.loadVueApp = function() {
        let vueApp = new Vue({
            el: '#app',
            mounted: function () {
                game.appComponent = this;

                this.updateIsPlayScreen();
                this.$root.$on('changeState', (newState) => {
                    if (newState && typeof newState === 'object' && !Array.isArray(newState)) {
                        this.changeState(newState.state, newState);
                    } else {
                        this.changeState(newState);
                    }
                });
            },
            data: function () {
                return {
                    isPlayScreen: game.isPlayScreen,
                    isInMenu: game.isInMenu,
                    currentState: null,
                };
            },
            methods: {
                changeState: function (newState, stateData) {
                    if (this.currentState === newState && !stateData) {
                        return;
                    }

                    currentStateData = stateData;
                    this.currentState = newState;
                    this.$refs.app.scrollTop = 0;

                    game.playSound('button_click');

                    this.$root.$emit('stateChanged', this.currentState);

                    this.playNextReplay();
                },
                getCurrentStateData: function() {
                    return currentStateData ? currentStateData : {};
                },
                updateIsPlayScreen: function (disableFullLoad) {
                    this.isPlayScreen = game.isPlayScreen;
                    this.isInMenu = game.isInMenu;
                    this.$forceUpdate();
                },
                loadInitialState: function () {

                },
                reloadMenu: function () {
                    if (game.isPlayScreen && !this.currentState) {
                        return;
                    }

                    game.reloadSettings();
                },
                gameLoaded: function () {
                    if (!game.isGameLoaded) {
                        game.isGameLoaded = true;
                        this.reloadMenu();
                    }
                },
                gameReady: function () {

                },
                bme: function () {
                    game.playSound('button_hover');
                },
                bmc: function() {
                    game.playSound('button_click');
                }
            },
            template: `
    <div ref="app">
        <app-game-game-menu></app-game-game-menu>
        <app-game-build-menu></app-game-build-menu>
    </div>
    `
        });
    }
}