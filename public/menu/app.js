if (isMobile && !isPhoneApp) {
    console.info('Mobile is disabled for now.');
    document.getElementById('loading').remove();
    document.getElementById('mobile-disabled-message').style.display = 'inline-block';
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
                    settings: game.settings,
                    showDeleteConfirmation: false
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
                },
                closeDeleteConfirmation: function (deleteEntities) {
                    if (deleteEntities === true) {
                        game.removeEntities();
                    }
                    this.showDeleteConfirmation = false;
                }
            },
            template: html`
            <div ref="app">
                <app-game-game-menu></app-game-game-menu>
                <app-game-sidebar></app-game-sidebar>
                
                <!--
                <div v-if="game.settings.showFacilityName && game.facilityName && game.facilityName !== 'Unnamed Facility'" class="facility-banner">
                    <i class="fa fa-wrench" aria-hidden="true"></i> {{game.facilityName}}
                </div>
                -->

                <div v-if="game.settings.enableStats" class="statistics-panel">
                    <app-menu-statistics></app-menu-statistics>
                </div>
                
                <div v-if="showDeleteConfirmation" id="delete-confirmation-dialog">
                    <div class="confirmation-header">
                        <h3><i class="fa fa-trash" aria-hidden="true"></i> Confirm Deletion</h3><button class="footer-button" @click="closeDeleteConfirmation"><i class="fa fa-times" aria-hidden="true"></i></button>
                    </div>
                    <p class="confirmation-body">
                        This will delete all objects you have placed.<br>
                        Note: This <u>cannot</u> be undone.
                        <button @click="closeDeleteConfirmation(true)">Delete All Buildings</button>
                    </p>
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
                    <button class="footer-button" @click="game.tryFullscreen">
                        <i class="fa fa-arrows-alt" aria-hidden="true"></i>
                    </button>
                    <button class="footer-button" @click="showDeleteConfirmation = true">
                        <i class="fa fa-trash" aria-hidden="true"></i>
                    </button>
                </div>
            </div>
            `
        });
    }
}