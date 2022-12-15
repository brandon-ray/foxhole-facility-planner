Vue.component('app-game-game-menu', {
    mounted: function() {
        game.gameMenuComponent = this;
    },
    data: function() {
        return {
            shouldShowModal: false,
            state: null,
            showFullscreenButton: true
        };
    },
    methods: {
        showModal: function(val) {
            this.shouldShowModal = val;
            if (!this.shouldShowModal) {
                game.tryGameFocus();
            }
        },
        fullscreen: function() {
            this.bmc();
            game.tryFullscreen();
        }
    },
    template: html`
    <div class="game-modal" v-if="shouldShowModal">
        <div class="game-modal-content game-modal-content-sm">
            <div v-if="!state">
                <button type="button" v-on:click="bmc(); showModal(false)" @mouseenter="bme()" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
                <h2><i class="fa fa-bars"></i> Menu</h2>
                <button type="button" class="app-btn app-btn-secondary" v-on:click="fullscreen()" v-if="showFullscreenButton" @mouseenter="bme()">
                    <i class="fa fa-arrows-alt"></i> Fullscreen
                </button>
                <button type="button" class="app-btn app-btn-secondary" v-on:click="bmc(); state='settings'" @mouseenter="bme()">
                    <i class="fa fa-gear"></i> Settings
                </button>
            </div>
            <div v-if="state === 'settings'">
                <app-game-settings></app-game-settings>
                <button type="button" class="app-btn app-btn-danger" v-on:click="bmc(); state=null" @mouseenter="bme()">
                    <i class="fa fa-arrow-left"></i> Return
                </button>
            </div>
        </div>
    </div>
    `
});