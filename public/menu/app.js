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
        
        <div v-if="game.settings.enableStats" class="statistics-panel">
            <div style="max-height:700px; overflow-x:hidden; overflow-y:auto;">
                <app-menu-statistics></app-menu-statistics>
            </div>
        </div>
        
        <div class="footer">
            <label class="checkbox-button align-middle">
                <input type="checkbox" name="snap-to-grid-toggle" v-model="settings.enableGrid" @change="game.updateSettings" />
                Snap to Grid
            </label>
            <label class="checkbox-button align-middle">
                <input type="checkbox" name="snap-rotation-toggle" v-model="settings.enableSnapRotation" @change="game.updateSettings" />
                Snap Rotation
            </label>
            <label class="checkbox-button align-middle">
                <input type="checkbox" name="stats-info-toggle" v-model="game.settings.enableStats" @change="game.updateSettings" />
                Show Stats
            </label>
            <button class="fullscreen-button" v-on:click="game.tryFullscreen">
                <i class="fa fa-arrows-alt" aria-hidden="true"></i>
            </button>
        </div>
    </div>
    `
        });
    }
}