if (isMobile && !isPhoneApp) {
    console.info('Mobile is disabled for now.');
    document.getElementById('loading').remove();
    document.getElementById('mobile-disabled-message').display = 'inline-block';
} else {
    game.loadVueApp = function() {
        let vueApp = new Vue({
            el: '#app',
            mounted: function () {
                game.appComponent = this;

                this.updateIsPlayScreen();
            },
            data: function () {
                return {
                    isPlayScreen: game.isPlayScreen,
                    isInMenu: game.isInMenu,
                    settings: game.settings
                };
            },
            methods: {
                updateIsPlayScreen: function (disableFullLoad) {
                    this.isPlayScreen = game.isPlayScreen;
                    this.isInMenu = game.isInMenu;
                    this.$forceUpdate();
                },
                updateSettings: function() {
                    game.updateSettings();
                },
                reloadMenu: function () {
                    if (game.isPlayScreen) {
                        return;
                    }

                    game.reloadSettings();
                },
                gameLoaded: function () {
                    if (!game.isGameLoaded) {
                        game.isGameLoaded = true;
                        this.reloadMenu();
                    }
                }
            },
            template: html`
    <div ref="app">
        <app-game-game-menu></app-game-game-menu>
        <app-game-build-menu></app-game-build-menu>
        
        <button class="fullscreen-button">
            <i class="fa fa-arrows-alt" aria-hidden="true"></i>
        </button>

        <div class="footer">
            <label class="checkbox-button align-middle">
                <input type="checkbox" name="snap-to-grid-toggle" v-model="settings.enableGrid" @change="updateSettings" />
                Snap to Grid
            </label>
            <label class="checkbox-button align-middle">
                <input type="checkbox" name="stats-info-toggle" checked />
                Show Stats
            </label>
        </div>
    </div>
    `
        });
    }
}