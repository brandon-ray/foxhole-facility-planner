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
                    layerSelectionVisible: false
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
                updateEntityOverlays: function() {
                    game.updateEntityOverlays();
                    game.updateSettings();
                }
            },
            template: html`
            <div ref="app" :class="{'colonial-faction': game.settings.displayFactionTheme && game.settings.selectedFaction === 'c', 'warden-faction': game.settings.displayFactionTheme && game.settings.selectedFaction === 'w' }">
                <app-game-game-menu></app-game-game-menu>
                <app-game-sidebar></app-game-sidebar>
                
                <div v-if="game.settings.showFacilityName && game.projectName && game.projectName !== 'Unnamed Facility' && game.projectName !== 'Unnamed Project'" class="project-banner">
                    <i class="fa fa-wrench" aria-hidden="true"></i> {{game.projectName}}
                </div>

                <div v-if="layerSelectionVisible" class="board-panel layer-selection">
                    <div class="board-panel-header">
                        <h4 class="float-left m-0" style="color: #eee"><i class="fa fa-cogs"></i> Toggle Layers</h4>
                        <button class="btn-small m-0 mr-1 float-right" title="Minimize Layers" @click="layerSelectionVisible = false"><i class="fa fa-window-minimize" aria-hidden="true"></i></button>
                    </div>
                    <p class="board-panel-body">
                        <label class="btn-checkbox-wrapper d-block">
                            <button class="btn-small btn-float-left btn-checkbox" :class="{ 'btn-active': game.projectSettings.showProductionIcons }" @click="game.projectSettings.showProductionIcons = !game.projectSettings.showProductionIcons; updateEntityOverlays()"></button>
                            Production Icons
                        </label>
                        <label class="btn-checkbox-wrapper d-block">
                            <button class="btn-small btn-float-left btn-checkbox" :class="{ 'btn-active': game.projectSettings.showRangeWhenSelected }" @click="game.projectSettings.showRangeWhenSelected = !game.projectSettings.showRangeWhenSelected; updateEntityOverlays()"></button>
                            Selection Ranges
                        </label>
                        <label class="btn-checkbox-wrapper d-block">
                            <button class="btn-small btn-float-left btn-checkbox" :class="{ 'btn-active': game.projectSettings.ranges.crane }" @click="game.projectSettings.ranges.crane = !game.projectSettings.ranges.crane; updateEntityOverlays()"></button>
                            Crane Ranges
                        </label>
                        <label class="btn-checkbox-wrapper d-block">
                            <button class="btn-small btn-float-left btn-checkbox" :class="{ 'btn-active': game.projectSettings.ranges.killbox }" @click="game.projectSettings.ranges.killbox = !game.projectSettings.ranges.killbox; updateEntityOverlays()"></button>
                            Killbox Ranges
                        </label>
                        <label class="btn-checkbox-wrapper d-block">
                            <button class="btn-small btn-float-left btn-checkbox" :class="{ 'btn-active': game.projectSettings.ranges.radio }" @click="game.projectSettings.ranges.radio = !game.projectSettings.ranges.radio; updateEntityOverlays()"></button>
                            Radio Ranges
                        </label>
                    </p>
                </div>

                <app-menu-statistics v-if="game.settings.enableStats"></app-menu-statistics>

                <app-game-confirmation-popup></app-game-confirmation-popup>

                <div class="footer">
                    <label class="btn-checkbox-wrapper">
                        <button class="btn-small btn-float-left btn-checkbox" :class="{ 'btn-active': settings.enableGrid }" @click="settings.enableGrid = !settings.enableGrid; game.updateSettings()"></button>
                        Snap to Grid
                    </label>
                    <label class="btn-checkbox-wrapper">
                        <button class="btn-small btn-float-left btn-checkbox" :class="{ 'btn-active': settings.enableSnapRotation }" @click="settings.enableSnapRotation = !settings.enableSnapRotation; game.updateSettings()"></button>
                        Snap Rotation
                    </label>
                    <label class="btn-checkbox-wrapper">
                        <button class="btn-small btn-float-left" :class="{ 'btn-active': layerSelectionVisible }" title="Toggle Visual Layers" @click="layerSelectionVisible = !layerSelectionVisible"><i class="fa fa-cogs" aria-hidden="true"></i></button>
                        Show Layers
                    </label>
                    <label class="btn-checkbox-wrapper">
                        <button class="btn-small btn-float-left" :class="{ 'btn-active': settings.enableStats }" @click="settings.enableStats = !settings.enableStats; game.updateSettings()"><i class="fa fa-bar-chart" aria-hidden="true"></i></button>
                        Show Stats
                    </label>
                    <button class="btn-small" title="Toggle Fullscreen" @click="game.tryFullscreen()">
                        <i class="fa fa-arrows-alt" aria-hidden="true"></i>
                    </button>
                    <button class="btn-small" :class="{'btn-active': game.settings.enableDarkMode}" title="Toggle Dark Mode" @click="game.setDarkMode(!game.settings.enableDarkMode)">
                        <i class="fa fa-moon-o" aria-hidden="true"></i>
                    </button>
                    <button class="btn-small" title="Clear Board" @click="game.confirmDeletion()">
                        <i class="fa fa-trash" aria-hidden="true"></i>
                    </button>
                    <button class="btn-small" title="Center Board" @click="game.zoomToEntitiesCenter()">
                        <i class="fa fa-crosshairs" aria-hidden="true"></i>
                    </button>
                    <button v-if="game.settings.enableHistory" class="btn-small" title="Redo" @click="game.redo()">
                        <i class="fa fa-repeat" aria-hidden="true"></i>
                    </button>
                    <button v-if="game.settings.enableHistory" class="btn-small" title="Undo" @click="game.undo()">
                        <i class="fa fa-undo" aria-hidden="true"></i>
                    </button>
                    <button class="btn-small" :class="{ 'btn-active': game.playMode }" :title="game.playMode ? 'Pause' : 'Resume'" @click="game.setPlaying(!game.playMode)">
                        <i class="fa" :class="{ 'fa-pause': game.playMode, 'fa-play': !game.playMode }" aria-hidden="true"></i>
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
    <div v-if="confirmationVisible" class="board-panel confirmation-dialog">
        <template v-if="type === 'delete'">
            <div class="board-panel-header">
                <h4 class="float-left m-0" style="color: #eee"><i class="fa fa-trash"></i> Confirm Deletion</h4>
                <button class="btn-small m-0 mr-1 float-right" title="Close" @click="closePopup(false)"><i class="fa fa-times" aria-hidden="true"></i></button>
            </div>
            <p class="board-panel-body">
                This will delete all objects you have placed.<br>
                Note: This <u>cannot</u> be undone.
                <button @click="closePopup(true)">Erase Board</button>
            </p>
        </template>
        <template v-else-if="type === 'save-work'">
            <div class="board-panel-header">
                <h4 class="float-left m-0" style="color: #eee"><i class="fa fa-upload"></i> Confirm Load</h4>
                <button class="btn-small m-0 mr-1 float-right" title="Close" @click="closePopup(false)"><i class="fa fa-times" aria-hidden="true"></i></button>
            </div>
            <p class="board-panel-body">
                Your current work will be lost if you don't save.<br>
                Note: This <u>cannot</u> be undone.
                <button @click="closePopup(true)">Erase Board</button>
            </p>
        </template>
    </div>
    `
});