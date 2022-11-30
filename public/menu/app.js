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
                },
                updateRangeSprites: function() {
                    game.updateRangeSprites();
                    game.updateSettings();
                },
                updateProductionIcons: function() {
                    game.updateProductionIcons();
                    game.updateSettings();
                }
            },
            template: html`
            <div ref="app" :class="{'colonial-faction': game.settings.displayFactionTheme && game.settings.selectedFaction === 'c', 'warden-faction': game.settings.displayFactionTheme && game.settings.selectedFaction === 'w' }">
                <app-game-game-menu></app-game-game-menu>
                <app-game-sidebar></app-game-sidebar>
                
                <div v-if="game.settings.showFacilityName && game.facilityName && game.facilityName !== 'Unnamed Facility'" class="facility-banner">
                    <i class="fa fa-wrench" aria-hidden="true"></i> {{game.facilityName}}
                </div>

                <div v-if="game.settings.enableStats" class="statistics-panel">
                    <app-menu-statistics></app-menu-statistics>
                </div>

                <app-game-confirmation-popup></app-game-confirmation-popup>

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
                    <label class="checkbox-button align-middle">
                        <input type="checkbox" name="ranges-visible-toggle" v-model="game.settings.showRanges" @change="updateRangeSprites" />
                        Show Structure Ranges
                    </label>
                    <label class="checkbox-button align-middle">
                        <input type="checkbox" name="production-visible-toggle" v-model="game.settings.showProductionIcons" @change="updateProductionIcons" />
                        Show Production Output
                    </label>
                    <button class="footer-button" @click="game.tryFullscreen">
                        <i class="fa fa-arrows-alt" aria-hidden="true"></i>
                    </button>
                    <button class="footer-button" @click="game.zoomToFacilityCenter">
                        <i class="fa fa-expand" aria-hidden="true"></i>
                    </button>
                    <button class="footer-button" @click="game.confirmDeletion">
                        <i class="fa fa-trash" aria-hidden="true"></i>
                    </button>
                </div>
            </div>
            `
        });
    }
}

Vue.component('app-game-confirmation-popup', {
    mounted: function() {
        game.confirmationPopup = this;
    },
    data: function() {
        return {
            type: null,
            callback: null,
            confirmationVisible: false
        };
    },
    methods: {
        showPopup: function(type, callback) {
            this.type = type;
            this.callback = callback;
            this.confirmationVisible = true;
            this.$forceUpdate();
        },
        closePopup: function(confirmed) {
            this.confirmationVisible = false;
            if (typeof this.callback === 'function') {
                setTimeout(this.callback(confirmed), 1);
            }
            this.removePopup();
        },
        removePopup: function() {
            this.confirmationVisible = false;
            this.type = null;
            this.callback = null;
        }
    },
    template: html`
    <div v-if="confirmationVisible" id="confirmation-dialog">
        <template v-if="type === 'delete'">
            <div class="confirmation-header">
                <h3><i class="fa fa-trash" aria-hidden="true"></i> Confirm Deletion</h3><button class="footer-button" @click="closePopup(false)"><i class="fa fa-times" aria-hidden="true"></i></button>
            </div>
            <p class="confirmation-body">
                This will delete all objects you have placed.<br>
                Note: This <u>cannot</u> be undone.
                <button @click="closePopup(true)">Erase Board</button>
            </p>
        </template>
        <template v-else-if="type === 'save-work'">
            <div class="confirmation-header">
                <h3><i class="fa fa-upload" aria-hidden="true"></i> Confirm Load</h3><button class="footer-button" @click="closePopup(false)"><i class="fa fa-times" aria-hidden="true"></i></button>
            </div>
            <p class="confirmation-body">
                Your current work will be lost if you don't save.<br>
                Note: This <u>cannot</u> be undone.
                <button @click="closePopup(true)">Erase Board</button>
            </p>
        </template>
    </div>
    `
});