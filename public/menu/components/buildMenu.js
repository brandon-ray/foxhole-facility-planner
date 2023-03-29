Vue.component('app-game-sidebar', {
    data: function() {
        return {
            currentMenu: null,
            currentMenuData: null,
            hoverData: null,
            menuList: [
                {
                    key: 'statistics',
                    name: 'Statistics',
                    icon: 'fa-bar-chart'
                },
                {
                    key: 'save-load',
                    name: 'Save/Load',
                    icon: 'fa-save'
                },
                {
                    key: 'settings',
                    name: 'Settings',
                    icon: 'fa-gear'
                },
                {
                    key: 'about',
                    name: 'About',
                    icon: 'fa-info-circle'
                }
            ]
        };
    },
    mounted: function () {
        game.sidebarMenuComponent = this;
        this.changeMenu(null);
    },
    methods: {
        changeMenu: function(newMenu, menuData) {
            if (typeof newMenu === 'string' || newMenu instanceof String) {
                for (let i=0; i<this.menuList.length; i++) {
                    let menu = this.menuList[i];
                    if (menu.key === newMenu) {
                        newMenu = menu;
                        break;
                    }
                }
            }

            this.bmc();
            if (newMenu) {
                this.currentMenu = newMenu;
            } else {
                this.currentMenu = null;
            }
            this.currentMenuData = menuData;

            if (game.getSelectedEntities().length && (!this.currentMenu || this.currentMenu.key !== 'building-selected')) {
                game.deselectEntities();
            }
        },
        selectFaction: function(faction) {
            this.bmc();
            game.setFaction(game.settings.selectedFaction !== faction ? faction : null);
        },
        showHoverMenu: function(data = null) {
            this.hoverData = data;
        }
    },
    template: html`
    <div id="sidebar">
        <div id="sidebar-header">
            <button class="colonial-button" :class="{ selected: game.settings.selectedFaction == 'c' }" title="Colonial Faction" @click="selectFaction('c')" @mouseenter="bme()"></button>
            <img class="sidebar-logo" src="/assets/logo_transparent.webp">
            <button class="warden-button" :class="{ selected: game.settings.selectedFaction == 'w' }" title="Warden Faction" @click="selectFaction('w')" @mouseenter="bme()"></button>
        </div>
        <div id="sidebar-body" :class="currentMenu ? currentMenu.key + '-page' : 'construction-page'" @mouseenter="game.sidebarMenuComponent?.showHoverMenu()" @mouseleave="game.sidebarMenuComponent?.showHoverMenu()">
            <div v-if="!currentMenu" class="menu-body">
                <app-menu-construction-list></app-menu-construction-list>
            </div>
            <div v-if="currentMenu" class="menu-body">
                <div class="menu-page-title"><i :class="'fa ' + currentMenu.icon"></i> {{currentMenu.name}}</div>
                <button type="button" class="title-button return-button" v-on:click="changeMenu(null)" title="Back" @mouseenter="bme()">
                    <div class="inner-button"><i class="fa fa-arrow-left"></i></div>
                </button>
                <div class="menu-page">
                    <component v-bind:is="'app-menu-' + currentMenu.key" :menuData="currentMenuData"></component>
                </div>
            </div>
            <div class="menu-footer-buttons">
                <button v-if="!currentMenu" type="button" class="app-btn app-btn-primary" v-on:click="changeMenu('save-load')" @mouseenter="bme()">
                    <i class="fa fa-save"></i> Save/Load
                </button>
                <button v-if="currentMenu"  type="button" class="app-btn app-btn-primary" v-on:click="changeMenu(null)" @mouseenter="bme()">
                    <i class="fa fa-arrow-left"></i> Return
                </button>
            </div>
        </div>
        <div id="sidebar-footer">
            <a class="btn-small float-left github-button" href="https://github.com/brandon-ray/foxhole-facility-planner" target="_blank" @click="bmc()" @mouseenter="bme()">
                <i class="fa fa-github"></i>
            </a>
            <a class="btn-small float-left discord-button" href="https://discord.gg/2hgaMQN26s" target="_blank" @click="bmc()" @mouseenter="bme()">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 127.14 96.36">
                    <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"/>
                </svg>
            </a>
            <button v-on:click="event.preventDefault(); changeMenu('settings')" class="btn-small float-right" @mouseenter="bme()">
                <i class="fa fa-gear"></i>
            </button>
            <button v-on:click="event.preventDefault(); changeMenu('about')" class="btn-small float-right" @mouseenter="bme()">
                <i class="fa fa-question-circle"></i>
            </button>
        </div>
        <div id="hover-building-info" v-if="hoverData">
            <div class="building-info-name">
                <img v-bind:src="hoverData.baseIcon || hoverData.icon || '/assets/default_icon.webp'" />
                <h4>{{!hoverData.parentKey && hoverData.parent?.name || hoverData.name}}</h4>
            </div>
            <div v-if="hoverData.parent?.name" class="building-info-upgrade">
                <i class="fa fa-check-circle" aria-hidden="true"></i> {{hoverData.upgradeName}} Upgrade
            </div>
            <div class="building-info-body">
                <p class="building-info-description" v-if="hoverData.description">{{hoverData.description}}</p>
                <p class="building-tech-description" v-if="hoverData.author">
                    <span>Author:</span> {{hoverData.author}}
                </p>
                <p class="building-tech-description" v-if="hoverData.techId">
                    <span>Requires Tech<template v-if="window.objectData.tech[hoverData.techId]">:</template></span> {{window.objectData.tech[hoverData.techId]?.name}}
                </p>
                <p class="building-tech-description" v-if="hoverData.author">
                    <span>Want your design featured in the planner?</span> Submit it on our Discord!
                </p>
                <div class="building-info-production" v-if="hoverData.production && hoverData.production.length && hoverData.production.hasOutput">
                    <template v-for="(recipe, index) in hoverData.production">
                        <app-game-recipe v-if="!recipe.faction || !game.settings.selectedFaction || recipe.faction == game.settings.selectedFaction" :building="hoverData" :recipe="recipe"></app-game-recipe>
                    </template>
                </div>
                <div class="building-cost">
                    <app-game-resource-icon v-for="(value, key) in (hoverData.upgradeCost ?? hoverData.cost)" :resource="key" :amount="value"/>
                </div>
                <div class="power-cost" v-if="hoverData.power < 0">
                    <i class="fa fa-bolt"></i> {{hoverData.power}} MW
                </div>
                <div class="power-produced" v-else-if="hoverData.power > 0">
                    <i class="fa fa-bolt"></i> {{hoverData.production && hoverData.production.power ? hoverData.production.power : hoverData.power}} MW
                </div>
                <img v-if="hoverData.preset" class="building-preview" :src="hoverData.texture">
            </div>
        </div>
    </div>
    `
});

Vue.component('app-menu-building-selected', {
    props: ['menuData'],
    data: function() {
        return {
            entity: {
                type: null,
                subtype: null,
                x: 0,
                y: 0,
                rotation: 0,
                rotationDegrees: 0,
                baseProduction: false,
                selectedProduction: null,
                productionScale: null,
                properties: {},
                following: false,
                label: null,
                style: null
            },
            debug: {
                textureOffset: null
            },
            productionData: null,
            hoverUpgradeName: null,
            propertyKey: null,
            propertyType: 'bool',
            defaultPropertyTypes: {
                bool: false,
                color: '#ffffff',
                float: 0.0,
                int: 0,
                string: ''
            },
            lockState: 0
        };
    },
    mounted: function() {
        game.buildingSelectedMenuComponent = this;
        this.refresh();
    },
    methods: {
        refresh: function(noForce = false) {
            this.lockState = game.getSelectedLockState();
            let selectedEntity = game.getSelectedEntity();
            if (selectedEntity) {
                if (selectedEntity.building?.textureOffset) {
                    this.debug.textureOffset = {
                        x: selectedEntity.building.textureOffset?.x,
                        y: selectedEntity.building.textureOffset?.y
                    }
                } else {
                    this.debug.textureOffset = null;
                }
                if (noForce && this.entity && this.entity.x === selectedEntity.x && this.entity.y === selectedEntity.y && this.entity.rotation === selectedEntity.rotation) {
                    return;
                }
                this.entity = {
                    type: selectedEntity.type,
                    subtype: selectedEntity.subtype,
                    x: selectedEntity.x,
                    y: selectedEntity.y,
                    rotation: selectedEntity.rotation,
                    rotationDegrees: Math.rad2deg(selectedEntity.rotation),
                    baseProduction: selectedEntity.baseProduction,
                    selectedProduction: selectedEntity.selectedProduction,
                    productionScale: selectedEntity.productionScale,
                    properties: selectedEntity.properties,
                    baseUpgrades: selectedEntity.baseUpgrades,
                    maintenanceFilters: selectedEntity.maintenanceFilters,
                    maintainedStructures: selectedEntity.maintainedStructures,
                    maintainedConsumptionRate: selectedEntity.maintainedConsumptionRate,
                    building: selectedEntity.building,
                    following: selectedEntity.following,
                    label: selectedEntity.label?.text,
                    style: Object.assign({}, selectedEntity.labelStyle ?? selectedEntity.shapeStyle),
                    userThrottle: selectedEntity.userThrottle,
                    trackVelocity: selectedEntity.trackVelocity
                };
                this.updateProduction();
                if (this.entity.type === 'shape') {
                    this.entity.style.opacity = Math.round(this.entity.style.alpha * 100);
                    if (typeof this.entity.style.fillColor === 'number') {
                        this.entity.style.fillColor = `#${this.entity.style.fillColor.toString(16)}`;
                    }
                    if (typeof this.entity.style.lineColor === 'number') {
                        this.entity.style.lineColor = `#${this.entity.style.lineColor.toString(16)}`;
                    }
                }
            } else if (this.entity || this.productionData) {
                this.entity = null;
                this.productionData = null;
            }
            game.saveStateChanged = true;
            this.$forceUpdate();
        },
        updateEntity: function(removeConnections) {
            if (this.entity) {
                this.entity.x = this.entity.x || 0;
                this.entity.y = this.entity.y || 0;
                this.entity.rotationDegrees = this.entity.rotationDegrees || 0;
                let selectedEntity = game.getSelectedEntity();
                if (selectedEntity) {
                    if (!selectedEntity.building?.vehicle) {
                        selectedEntity.x = this.entity.x;
                        selectedEntity.y = this.entity.y;
                        selectedEntity.rotation = Math.deg2rad(this.entity.rotationDegrees);
                    }
                    this.entity.rotation = selectedEntity.rotation;
                    if (selectedEntity.type === 'building') {
                        if (removeConnections) {
                            selectedEntity.removeConnections();
                        }
                        selectedEntity.setProductionId(this.entity.selectedProduction, this.entity.baseProduction);
                        if (typeof this.entity.userThrottle === 'number') {
                            selectedEntity.userThrottle = this.entity.userThrottle;
                        }
                    }
                    if (this.entity.maintenanceFilters) {
                        selectedEntity.setMaintenanceFilters(this.entity.maintenanceFilters);
                    }
                    this.updateProperties(selectedEntity, false);
                    game.refreshStats();
                    this.$forceUpdate();
                } else {
                    this.refresh();
                }
            }
            game.saveStateChanged = true;
        },
        updateStyleOptions: function(reset) {
            let selectedEntity = game.getSelectedEntity();
            if (selectedEntity) {
                if (selectedEntity.type === 'text') {
                    if (!reset) {
                        selectedEntity.setLabel(this.entity.label);
                    }
                    this.entity.style.fontSize = Math.min(Math.max(this.entity.style.fontSize, 12), 500);
                    selectedEntity.setLabelStyle(this.entity.style);
                } else if (selectedEntity.type === 'shape') {
                    let styleCopy;
                    if (!reset) {
                        this.entity.style.opacity = Math.min(Math.max(this.entity.style.opacity, 1), 100);
                        this.entity.style.lineWidth = Math.min(Math.max(this.entity.style.lineWidth, 6), 64);
                        styleCopy = Object.assign({}, this.entity.style);
                        styleCopy.alpha = styleCopy.opacity / 100;
                        delete styleCopy.opacity;
                        if (typeof styleCopy.fillColor === 'string') {
                            styleCopy.fillColor = parseInt(styleCopy.fillColor.slice(1), 16);
                        }
                        if (typeof styleCopy.lineColor === 'string') {
                            styleCopy.lineColor = parseInt(styleCopy.lineColor.slice(1), 16);
                        }
                    }
                    selectedEntity.setShapeStyle(styleCopy ?? this.entity.style);
                }
                this.refresh();
            }
        },
        resetStyleOptions: function() {
            this.entity.style = Object.assign({}, game.defaultSettings.styles[this.entity.type === 'text' ? 'label' : this.entity.subtype]);
            this.updateStyleOptions(true);
        },
        updateProperties: function(selectedEntity = game.getSelectedEntity(), forceRefresh = true) {
            if (selectedEntity) {
                selectedEntity.properties = this.entity.properties;
            }
            if (forceRefresh) {
                this.refresh();
            }
        },
        addProperty: function(key = this.propertyKey, type = this.propertyType, value = this.defaultPropertyTypes[type]) {
            if (this.entity && key) {
                if (!this.entity.properties) {
                    this.entity.properties = {};
                }
                if (!this.entity.properties.hasOwnProperty(key)) {
                    this.entity.properties[key] = {
                        key: key,
                        type: type,
                        value: value
                    };
                    this.updateProperties();
                    this.propertyKey = null;
                    return true;
                }
            }
            return false;
        },
        updateProperty: function(key) {
            if (this.entity?.properties && this.entity.properties.hasOwnProperty(key)) {
                let property = this.entity.properties[key];
                if (property.key !== key) {
                    if (property.key !== '' && !this.entity.properties[property.key]) {
                        this.entity.properties[property.key] = property;
                        delete this.entity.properties[key];
                    } else {
                        property.key = key;
                    }
                }
                if (property.type === 'int') {
                    property.value = Math.round(property.value);
                }
                this.updateProperties();
                return true;
            }
            return false;
        },
        removeProperty: function(key) {
            if (this.entity?.properties && this.entity.properties.hasOwnProperty(key)) {
                delete this.entity.properties[key];
                this.updateProperties();
                return true;
            }
            return false;
        },
        /*
        addRail: function() {
            this.bmc();
            if (this.entity) {
                this.entity.addPoint(100, 0);
            }
        },
        */
        changeProduction: function(id, useBaseProduction = false) {
            this.bmc();
            if (this.entity) {
                const isMatchingProduction = this.entity.baseProduction === useBaseProduction && this.entity.selectedProduction === id;
                this.entity.baseProduction = isMatchingProduction ? false : useBaseProduction;
                this.entity.selectedProduction = isMatchingProduction ? null : id;
                this.entity.productionScale = null;
                this.updateEntity();
            }
        },
        updateProduction: function() {
            let selectedEntity = game.getSelectedEntity();
            if (selectedEntity && selectedEntity.type === 'building') {
                if (typeof this.entity.selectedProduction !== 'number') {
                    this.productionData = null;
                    selectedEntity.productionScale = null;
                } else {
                    const productionList = ((this.entity.baseProduction && this.entity.building?.parent) || this.entity.building)?.production;
                    for (let i = 0; i < productionList.length; i++) {
                        let production = productionList[i];
                        if (production.id === this.entity.selectedProduction) {
                            this.productionData = production;
                            this.productionData.max = Math.floor((production.time > 3600 ? 86400 : 3600) / production.time);
                            if (this.productionData.max > 0) {
                                this.entity.productionScale = this.entity.productionScale ?? this.productionData.max;
                                if (selectedEntity.productionScale !== this.entity.productionScale) {
                                    selectedEntity.productionScale = this.entity.productionScale;
                                    game.refreshStats();
                                }
                            }
                            break;
                        }
                    }
                }
            }
        },
        changeUpgrade: function(upgrade) {
            this.bmc();
            game.upgradeSelected(upgrade);
        },
        changeBaseUpgrade: function(tree, key) {
            this.bmc();
            const selectedEntity = game.getSelectedEntity();
            if (selectedEntity && selectedEntity.type === 'building') {
                selectedEntity.setBaseUpgrade(tree, (selectedEntity.baseUpgrades[tree] !== key && key) || undefined);
                game.saveStateChanged = true;
            }
        },
        toggleMaintenanceExclusion: function(key) {
            this.bmc();
            const selectedEntity = game.getSelectedEntity();
            if (selectedEntity && selectedEntity.type === 'building') {
                const index = selectedEntity.maintenanceFilters.exclusions.indexOf(key);
                if (index >= 0) {
                    selectedEntity.maintenanceFilters.exclusions.splice(index, 1);
                } else {
                    selectedEntity.maintenanceFilters.exclusions.push(key);
                }
                this.updateEntity();
            }
        },
        cloneBuildings: function() {
            this.bmc();
            game.cloneSelected();
        },
        lockBuildings: function() {
            this.bmc();
            game.lockSelected();
            this.refresh();
        },
        destroyBuildings: function() {
            this.bmc();
            game.deselectEntities(true);
        },
        showUpgradeHover: function(upgrade, updateName = true) {
            if (updateName) {
                this.hoverUpgradeName = upgrade?.upgradeName ?? (upgrade?.name ?? null);
            }
            game.sidebarMenuComponent.showHoverMenu(upgrade);
        },
        focusText: function() {
            if (this.entity && this.entity.type === 'text') {
                this.$nextTick(() => this.$refs.label?.focus());
            }
        },
        toggleFollow: function() {
            const selectedEntity = game.getSelectedEntity();
            game.followEntity(!selectedEntity.following && selectedEntity ? selectedEntity : null);
        },
        setColor: function() {
            const selectedEntity = game.getSelectedEntity();
            if (selectedEntity && selectedEntity.type === 'building') {
                selectedEntity.sprite.rope.tint = parseInt(this.entity.color.slice(1), 16);
            }
        },
        detachConnections: function(socketId) {
            const selectedEntity = game.getSelectedEntity();
            if (selectedEntity && selectedEntity.sockets) {
                selectedEntity.removeConnections(socketId);
            }
        },
        flipTrain: function() {
            const selectedEntity = game.getSelectedEntity();
            if (selectedEntity && selectedEntity.isTrain) {
                selectedEntity.trackVelocity = 0;
                selectedEntity.trackDirection *= -1;
                if (selectedEntity.sockets) {
                    let entityConnections = {};
                    for (let i = 0; i < selectedEntity.sockets.length; i++) {
                        const entitySocket = selectedEntity.sockets[i];
                        if (entitySocket.socketData.id === 0 || entitySocket.socketData.id === 1) {
                            entityConnections[entitySocket.socketData.id] = Object.assign({}, entitySocket.connections);
                        }
                    }
                    for (let i = 0; i < selectedEntity.sockets.length; i++) {
                        const entitySocket = selectedEntity.sockets[i];
                        if (entitySocket.socketData.id === 0 || entitySocket.socketData.id === 1) {
                            const socketConnections = entityConnections[entitySocket.socketData.id ? 0 : 1];
                            for (const [connectedEntityId, connectedSocketId] of Object.entries(socketConnections)) {
                                const connectedEntity = game.getEntityById(connectedEntityId);
                                if (connectedEntity.sockets) {
                                    for (let j = 0; j < connectedEntity.sockets.length; j++) {
                                        const connectedSocket = connectedEntity.sockets[j];
                                        if (connectedSocket.socketData.id === connectedSocketId) {
                                            connectedSocket.setConnection(selectedEntity.id, entitySocket);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        updateDebugProps: function() {
            const selectedEntity = game.getSelectedEntity();
            if (selectedEntity && this.debug?.textureOffset) {
                selectedEntity.sprite.x = (-this.debug.textureOffset.x * TEXTURE_SCALE) / METER_TEXTURE_PIXEL_SCALE;
                selectedEntity.sprite.y = (-this.debug.textureOffset.y * TEXTURE_SCALE) / METER_TEXTURE_PIXEL_SCALE;
            }
        },
        recoverConnections: function() {
            const selectedEntity = game.getSelectedEntity();
            if (selectedEntity) {
                selectedEntity.recoverConnections();
            }
        },
    },
    template: html`
    <div class="text-left">
        <button type="button" class="title-button trash-button" v-on:click="destroyBuildings()" title="Delete" @mouseenter="bme()">
            <div class="inner-button"><i class="fa fa-trash"></i></div>
        </button>
        <button type="button" class="title-button clone-button" v-on:click="cloneBuildings()" title="Clone" @mouseenter="bme()">
            <div class="inner-button"><i class="fa fa-clone"></i></div>
        </button>
        <button type="button" class="title-button lock-button" v-on:click="lockBuildings()" title="Lock" @mouseenter="bme()">
            <div class="inner-button">
                <span v-if="lockState === 1" class="locked"><i class="fa fa-lock"></i></span>
                <span v-else-if="lockState === 0" class="partially-locked"><i class="fa fa-unlock"></i></span>
                <span v-else><i class="fa fa-unlock"></i></span>
            </div>
        </button>
        <template v-if="game.getSelectedEntities().length === 1">
            <div v-if="!entity.building" class="settings-option-wrapper">
                <div class="settings-title">{{(entity.subtype ?? entity.type) + ' Options'}}</div>
                <template v-if="entity.type === 'text'">
                    <app-game-text-options :container="this" :textOptions="entity.style"></app-game-text-options>
                    <textarea ref="label" v-model.trim="entity.label" @input="updateStyleOptions()" maxlength="500" placeholder="Text Required"></textarea>
                </template>
                <app-game-shape-options v-else-if="entity.type === 'shape'" :container="this" :shapeOptions="entity.style" :subtype="entity.subtype"></app-game-shape-options>
            </div>
            <div class="settings-option-wrapper">
                <div class="settings-title">
                    {{(entity.building && ((!entity.building.parentKey && entity.building.parent?.name) || entity.building.name)) ?? 'Other Options'}}
                </div>
                <label class="app-input-label">
                    <i class="fa fa-arrows" aria-hidden="true"></i> Position X:
                    <input class="app-input" type="number" v-model.number="entity.x" @input="updateEntity(true)" :disabled="entity.building?.vehicle">
                </label>
                <label class="app-input-label">
                    <i class="fa fa-arrows" aria-hidden="true"></i> Position Y:
                    <input class="app-input" type="number" v-model.number="entity.y" @input="updateEntity(true)" :disabled="entity.building?.vehicle">
                </label>
                <div class="app-input-label settings-option-row">
                    <i class="fa fa-repeat" aria-hidden="true"></i> Rotation:
                    <input class="app-input float-right" type="number" v-model.number="entity.rotationDegrees" @input="updateEntity(true)" :disabled="entity.building?.vehicle">
                    <template v-if="!entity.building?.vehicle">
                        <button class="btn-small m-0 mr-1 float-right" type="button" title="Rotate 45 degrees" @click="game.rotateSelected(Math.PI / 4)"><i class="fa fa-repeat" aria-hidden="true"></i></button>&nbsp;
                        <button class="btn-small m-0 mr-1 float-right" type="button" title="Rotate -45 degrees"@click="game.rotateSelected(-Math.PI / 4)"><i class="fa fa-undo" aria-hidden="true"></i></button>&nbsp;
                    </template>
                </div>
                <label v-if="game.settings.enableDebug && entity.subtype === 'power_line'" class="app-input-label">
                    <i class="fa fa-paint-brush" aria-hidden="true"></i> Color:
                    <input type="color" v-model="entity.color" style="padding: 1px;" @input="setColor()">
                </label>
                <div v-if="entity.building?.vehicle" class="settings-option-row">
                    <i class="fa fa-chain-broken" aria-hidden="true"></i> Detach
                    <button class="btn-small w-auto m-0 px-2" type="button" @click="detachConnections(1)">Back</button>&nbsp;
                    <button class="btn-small w-auto m-0 mr-1 px-2" type="button" @click="detachConnections(0)">Front</button>&nbsp;
                    <button class="btn-small w-auto m-0 mr-1 px-2" type="button" @click="detachConnections()">All</button>&nbsp;
                </div>
                <div v-if="entity.building?.vehicle" class="settings-option-row">
                    <i class="fa fa-exchange" aria-hidden="true"></i> Flip Train
                    <button class="btn-small m-0" type="button" @click="flipTrain()"><i class="fa fa-exchange" aria-hidden="true"></i></button>
                </div>
            </div>
            <div v-if="game.settings.enableDebug && debug?.textureOffset" class="settings-option-wrapper">
                <div class="settings-title">
                    Texture Offset
                </div>
                <label class="app-input-label">
                    <i class="fa fa-arrows" aria-hidden="true"></i> Texture Position X:
                    <input class="app-input" type="number" v-model.number="debug.textureOffset.x" @input="updateDebugProps()">
                </label>
                <label class="app-input-label">
                    <i class="fa fa-arrows" aria-hidden="true"></i> Texture Position Y:
                    <input class="app-input" type="number" v-model.number="debug.textureOffset.y" @input="updateDebugProps()">
                </label>
            </div>
            <div v-if="game.settings.enableAdvanced" class="settings-option-wrapper custom-properties-panel">
                <div class="settings-title">
                    Custom Properties
                </div>
                <div v-if="entity.properties && Object.keys(entity.properties).length" class="settings-option-row">
                    <div v-for="(property, key) in entity.properties" class="custom-property-row d-flex justify-content-center">
                        <input class="app-input" type="text" placeholder="Key" v-model="property.key" @change="updateProperty(key)">
                        <select v-if="property.type === 'bool'" class="app-input" v-model="property.value" @change="updateProperty(key)">
                            <option :value="true">true</option>
                            <option :value="false">false</option>
                        </select>
                        <input v-else-if="property.type === 'color'" type="color" v-model="property.value" @change="updateProperty(key)">
                        <input v-else-if="property.type === 'float' || property.type === 'int'" class="app-input" type="number" v-model="property.value" @change="updateProperty(key)">
                        <input v-else class="app-input" type="text" :placeholder="property.type" v-model="property.value" @change="updateProperty(key)">
                        <button class="btn-small" type="button" @click="removeProperty(key)"><i class="fa fa-trash" aria-hidden="true"></i></button>
                    </div>
                </div>
                <div class="settings-option-row">
                    <div class="custom-property-row d-flex justify-content-center">
                        <input class="app-input" type="text" v-model="propertyKey" placeholder="Key">
                        <select class="app-input" v-model="propertyType">
                            <!-- <option :value="null">Type</option> -->
                            <option v-for="(value, key) in defaultPropertyTypes" :value="key">{{key}}</option>
                        </select>
                        <button class="btn-small" type="button" @click="addProperty()"><i class="fa fa-plus" aria-hidden="true"></i></button>
                    </div>
                </div>
            </div>
            <div v-if="entity.building?.vehicle?.engine" class="settings-option-wrapper">
                <div class="settings-title">
                    Train Controls
                    <button class="btn-small m-0" :class="{ 'btn-active': entity.following }" style="font-size: 0.9em; position: absolute; right: 6px;" title="Follow" @click="toggleFollow()"><i class="fa fa-video-camera" aria-hidden="true"></i></button>
                </div>
                <label class="app-input-label">
                    <i class="fa fa-train" aria-hidden="true"></i> Speed
                    <input class="app-input" type="number" v-model.number="entity.trackVelocity" disabled>
                </label>
                <label class="app-input-label">
                    <i class="fa fa-train" aria-hidden="true"></i> Throttle ({{Math.round(entity.userThrottle*100)}}%)
                    <input type="range" class="slider w-50" v-model.number="entity.userThrottle" min="-1" max="1" step="0.1" @input="game.setPlaying(true); updateEntity()">
                </label>
            </div>
        </template>
        <div v-else class="settings-option-wrapper text-center">
            <div class="settings-title">
                ({{game.getSelectedEntities().length}}) Buildings Selected
            </div>
            <div class="text-button-wrapper">
                <button class="text-button" type="button" v-on:click="game.downloadSave(true)" @mouseenter="bme()">
                    <i class="fa fa-save"></i> Export Selection
                </button>
            </div>
        </div>
        <template v-if="game.getSelectedEntities().length === 1">
            <div v-if="entity.building && entity.building.upgrades" class="settings-option-wrapper upgrade-list">
                <div class="settings-title">
                    <button v-if="entity.building?.parentKey" type="button" class="title-button return-button" v-on:click="changeUpgrade(entity.building.parent)" title="Go to Previous Tier" @mouseenter="bme()" style="padding: 1px 2px;">
                        <div class="btn-small m-1"><i class="fa fa-arrow-left"></i></div>
                    </button>
                    {{hoverUpgradeName ?? (entity.building.upgradeName ?? (entity.building.upgrades[entity.building.key]?.name ?? 'No Upgrade Selected'))}}
                </div>
                <button class="upgrade-button" v-for="upgrade in entity.building.upgrades" :class="{'selected-upgrade': (entity.building.parent && entity.building.key === entity.building.parent.key + '_' + upgrade.key) || entity.building.key === upgrade.key}"
                    @mouseenter="showUpgradeHover(upgrade); bme()" @mouseleave="showUpgradeHover()" @click="changeUpgrade(upgrade)">
                    <div class="resource-icon" :title="upgrade.upgradeName ?? upgrade.name" :style="{backgroundImage:'url(' + (upgrade.icon ?? entity.building.icon) + ')'}"></div>
                </button>
            </div>
            <div v-if="entity.baseUpgrades && entity.building?.baseGarrisonRadius" class="settings-option-wrapper upgrade-list">
                <div class="settings-title">Base Upgrades</div>
                <button class="upgrade-button" v-for="(upgrade, key) in entity.building.baseUpgrades.base" :class="{'selected-upgrade': entity.baseUpgrades.base === key}"
                    @mouseenter="showUpgradeHover(upgrade, false); bme()" @mouseleave="showUpgradeHover()" @click="changeBaseUpgrade('base', key)">
                    <div class="resource-icon" :title="upgrade.name" :style="{backgroundImage:'url(' + (upgrade.icon ?? entity.building.icon) + ')'}"></div>
                </button>
            </div>
            <template v-if="entity.maintenanceFilters">
                <div class="settings-option-wrapper">
                    <div class="settings-title">Maintained Structures</div>
                    <div class="upgrade-buttons-small d-flex justify-content-center">
                        <template v-for="(category, key) in gameData.categories">
                            <button v-if="category.buildCategory" class="upgrade-button" :class="{'btn-inactive': entity.maintenanceFilters.exclusions.includes(key)}" @click="toggleMaintenanceExclusion(key)">
                                <div class="resource-icon" :title="category.name" :style="{backgroundImage:'url(' + (category.icon) + ')'}"></div>
                            </button>
                        </template>
                    </div>
                </div>
                <div class="settings-option-wrapper upgrade-list">
                    <div class="settings-title">Maintenance Range</div>
                    <div class="text-center">{{entity.maintenanceFilters.range}}m</div>
                    <div class="d-flex">
                        <div class="col-2 p-0">0m</div>
                        <div class="col-8 p-0">
                            <input type="range" class="slider w-100" style="height: 32px;" v-model.number="entity.maintenanceFilters.range" min="0" :max="entity.building.maxRange" step="1" @input="updateEntity()">
                        </div>
                        <div class="col-2 p-0">{{entity.building.maxRange}}m</div>
                    </div>
                    <span v-if="entity.maintainedStructures" style="font-size: 15px;">These settings apply to {{entity.maintainedStructures.toLocaleString()}}&nbsp;nearby&nbsp;structures.</span>
                </div>
                <div v-if="game.settings.enableExperimental && entity.maintainedConsumptionRate" class="settings-option-wrapper text-center">
                    <div class="settings-title">Maintenance Supply Upkeep<span style="color: #b5b5b5;">/hr</span></div>
                    <div class="construction-options row d-flex justify-content-center">
                        <div class="btn-small no-button col" style="color: #00ca00;">
                            <span style="font-size: 18px;"><small>x</small>{{entity.maintainedConsumptionRate * 0.25}}</span>
                            <span class="label">very good</span>
                        </div>
                        <div class="btn-small no-button col" style="color: #74d004;">
                            <span style="font-size: 18px;"><small>x</small>{{entity.maintainedConsumptionRate * 0.5}}</span>
                            <span class="label">good</span>
                        </div>
                        <div class="btn-small no-button col" style="color: #ffa500;">
                            <span style="font-size: 18px;"><small>x</small>{{entity.maintainedConsumptionRate}}</span>
                            <span class="label">poor</span>
                        </div>
                        <div class="btn-small no-button col" style="color: #ff0d0d;">
                            <span style="font-size: 18px;"><small>x</small>{{entity.maintainedConsumptionRate * 2}}</span>
                            <span class="label">very poor</span>
                        </div>
                    </div>
                    <small style="color: #d9d9d9;">Note: These values do not account for overlapping MTs.</small>
                </div>
            </template>
            <div v-if="productionData" class="settings-option-wrapper">
                <div class="settings-title">
                    <button type="button" class="title-button return-button" v-on:click="changeProduction(null)" title="Back" @mouseenter="bme()" style="padding: 1px 2px;">
                        <div class="btn-small m-1"><i class="fa fa-arrow-left"></i></div>
                    </button>
                    Production Stats
                </div>
                <div class="production-stats">
                    <div class="select-production m-2" v-if="!productionData.faction || !game.settings.selectedFaction || productionData.faction == game.settings.selectedFaction">
                        <app-game-recipe :building="entity.building" :recipe="productionData"></app-game-recipe>
                        <h6 class="production-requirements">
                            <template v-if="productionData.power || entity.building.power">
                                <span title="Power"><i class="fa fa-bolt"></i> {{productionData.power || entity.building.power}} MW</span>
                                &nbsp;&nbsp;&nbsp;
                            </template>
                            <span title="Time"><i class="fa fa-clock-o"></i> {{productionData.time}}s</span>
                        </h6>
                    </div>
                    <template v-if="productionData">
                        <template v-if="entity.building.productionScaling !== false && productionData.max > 0">
                            <div class="text-center p-2 mb-1">
                                <i class="fa fa-arrow-circle-down" aria-hidden="true"></i> Limiter: 
                                <span v-if="productionData.time <= 3600">x{{entity.productionScale}} cycles/hr</span>
                                <span v-else>x{{entity.productionScale}} cycles/day</span>
                                <input type="range" class="slider w-100" v-model.number="entity.productionScale" min="0" :max="productionData.max" step="1" @input="updateProduction()">
                            </div>
                        </template>
                        <template v-if="entity.productionScale > 0">
                            <div class="production-stats-resources">
                                <div v-if="productionData.input && Object.keys(productionData.input).length" class="mb-3">
                                    <h5><i class="fa fa-sign-in"></i> Building Input<span v-if="productionData.time <= 3600">/hr</span><span v-else>/day</span></h5>
                                    <div class="statistics-panel-fac-input">
                                        <app-game-resource-icon v-for="(value, key) in productionData.input" :resource="key" :amount="entity.productionScale * value"/>
                                    </div>
                                </div>
                                <div v-if="productionData.output && Object.keys(productionData.output).length">
                                    <h5><i class="fa fa-sign-out"></i> Building Output<span v-if="productionData.time <= 3600">/hr</span><span v-else>/day</span></h5>
                                    <div class="statistics-panel-fac-output">
                                        <app-game-resource-icon v-for="(value, key) in productionData.output" :resource="key" :amount="entity.productionScale * value"/>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </template>
                </div>
            </div>
            <template v-else-if="entity.building && entity.building.production && entity.building.production.length">
                <div v-if="game.settings.showParentProductionList && entity.building?.parent?.production" class="settings-option-wrapper">
                    <div class="settings-title">
                        {{entity.building.parent?.name ?? entity.building.name}} Production
                    </div>
                    <div class="production-list">
                        <app-menu-production-list-row v-for="production in entity.building.parent.production" :production="production" :isParent="true"></app-menu-production-list-row>
                    </div>
                </div>
                <div class="settings-option-wrapper">
                    <div class="settings-title">
                        {{entity.building.upgradeName ?? entity.building.name}} Production
                    </div>
                    <div class="production-list">
                        <app-menu-production-list-row v-for="production in entity.building.production" :production="production"></app-menu-production-list-row>
                    </div>
                </div>
            </template>
            <div v-if="game.settings.enableExperimental && entity.building?.category === 'entrenchments' && entity.building?.sockets" class="settings-option-wrapper">
                <div class="settings-title">Socket Options</div>
                <div class="text-button-wrapper">
                    <button class="text-button" type="button" @click="recoverConnections()" @mouseenter="bme()">
                        <i class="fa fa-wrench" aria-hidden="true"></i> Repair Connections
                    </button>
                </div>
            </div>
        </template>
    </div>
    `
});

Vue.component('app-menu-production-list-row', {
    props: ['production', 'isParent'],
    data: function() {
        return {
            container: game.buildingSelectedMenuComponent
        }
    },
    template: html`
    <div class="select-production" v-if="container.entity && (!production.faction || !game.settings.selectedFaction || production.faction == game.settings.selectedFaction)" @click="container.changeProduction(production.id, isParent)">
        <app-game-recipe :building="container.entity.building" :recipe="production"></app-game-recipe>
        <h6 class="production-requirements">
            <template v-if="production.power || container.entity.building.power">
                <span title="Power"><i class="fa fa-bolt"></i> {{production.power || container.entity.building.power}} MW</span>
                &nbsp;&nbsp;&nbsp;
            </template>
            <span title="Time"><i class="fa fa-clock-o"></i> {{production.time}}s</span>
        </h6>
        <div class="production-enabled"><i class="fa fa-power-off " aria-hidden="true"></i></div>
    </div>
    `
});

Vue.component('app-menu-construction-list', {
    props: ['menuData'],
    data: function() {
        return {
            buildings: window.objectData.buildings_list,
            modeOptions: null,
            searchQuery: null
        };
    },
    computed: {
        getSearchResults() {
            return game.getSearchResults(this.searchQuery);
        }
    },
    mounted: function() {
        game.constructionMenuComponent = this;
        this.refresh();
    },
    methods: {
        refresh: function() {
            const modeSettings = game.settings.styles[game.constructionMode.key];
            if (game.constructionMode.key !== 'select' && modeSettings) {
                this.modeOptions = Object.assign({}, modeSettings);
                if (game.constructionMode.key !== 'label') {
                    this.modeOptions.opacity = Math.round(this.modeOptions.alpha * 100);
                    if (typeof this.modeOptions.fillColor === 'number') {
                        this.modeOptions.fillColor = `#${this.modeOptions.fillColor.toString(16)}`;
                    }
                    if (typeof this.modeOptions.lineColor === 'number') {
                        this.modeOptions.lineColor = `#${this.modeOptions.lineColor.toString(16)}`;
                    }
                }
            } else {
                this.modeOptions = null;
            }
            this.$forceUpdate();
        },
        incrementTier: function() {
            this.bmc();
            game.settings.selectedTier++;
            if (game.settings.selectedTier >= 4) {
                game.settings.selectedTier = 1;
            }
            game.updateSettings();
        },
        setConstructionMode: function(mode) {
            this.bmc();
            game.setConstructionMode(mode);
        },
        toggleLockedLayer: function() {
            this.bmc();
            game.settings.disableLockedMouseEvents = !game.settings.disableLockedMouseEvents;
            game.updateSettings();
            this.refresh();
        },
        updateStyleOptions: function() {
            if (game.constructionMode.key !== 'select') {
                const modeSettings = game.settings.styles[game.constructionMode.key];
                if (modeSettings) {
                    let optionsCopy;
                    if (game.constructionMode.key === 'label') {
                        this.modeOptions.fontSize = Math.min(Math.max(this.modeOptions.fontSize, 12), 500);
                    } else {
                        this.modeOptions.opacity = Math.min(Math.max(this.modeOptions.opacity, 1), 100);
                        this.modeOptions.lineWidth = Math.min(Math.max(this.modeOptions.lineWidth, 6), 64);
                        optionsCopy = Object.assign({}, this.modeOptions);
                        optionsCopy.alpha = optionsCopy.opacity / 100;
                        delete optionsCopy.opacity;
                        if (typeof optionsCopy.fillColor === 'string') {
                            optionsCopy.fillColor = parseInt(optionsCopy.fillColor.slice(1), 16);
                        }
                        if (typeof optionsCopy.lineColor === 'string') {
                            optionsCopy.lineColor = parseInt(optionsCopy.lineColor.slice(1), 16);
                        }
                    }
                    game.settings.styles[game.constructionMode.key] = optionsCopy ?? this.modeOptions;
                    game.updateSettings();
                    this.refresh();
                }
            }
        },
        resetStyleOptions: function() {
            if (game.constructionMode.key !== 'select') {
                game.settings.styles[game.constructionMode.key] = Object.assign({}, game.defaultSettings.styles[game.constructionMode.key]);
                game.updateSettings();
                this.refresh();
            }
        }
    },
    template: html`
    <div id="construction-page">
        <div class="construction-modes-wrapper">
            <div class="construction-mode-switcher row">
                <button v-for="mode in game.constructionModes" class="construction-mode-button col base-font" :class="[{ 'mode-selected': game.constructionMode.key === mode.key }, mode.key + '-mode-button']" :title="mode.title" @mouseenter="bme()" @click="setConstructionMode(mode)">
                    <i v-if="mode.icon" :class="'fa ' + mode.icon" aria-hidden="true"></i>
                    <span v-else-if="mode.text">{{mode.text}}</span>
                </button>
            </div>
            <template v-if="modeOptions">
                <app-game-text-options v-if="game.constructionMode.key === 'label'" :container="this" :textOptions="modeOptions"></app-game-text-options>
                <app-game-shape-options v-else-if="game.constructionMode.key === 'rectangle' || game.constructionMode.key === 'circle' || game.constructionMode.key === 'line'" :container="this" :shapeOptions="modeOptions" :subtype="game.constructionMode.key"></app-game-shape-options>
            </template>
            <div v-else class="construction-options row d-flex justify-content-center">
                <button class="btn-small construction-settings-button" @click="game.sidebarMenuComponent?.changeMenu('settings')" title="Filter Settings">
                    <i class="fa fa-sliders" aria-hidden="true"></i>
                </button>
                <button class="btn-small construction-tech-button" @click="incrementTier()" title="Filter by Tier">{{'Tier ' + game.settings.selectedTier}}</button>
                <div class="construction-category-wrapper">
                    <select class="btn-small app-input construction-category" @click="bmc()" title="Filter by Category" v-model="game.selectedBuildingCategory" @change="refresh()">
                        <option value="all">All Buildings</option>
                        <template v-for="(category, key) in window.objectData.categories">
                            <option v-if="!category.experimental || game.settings.enableExperimental" :value="key">{{category.name}}</option>
                        </template>
                    </select>
                </div>
                <button class="btn-small construction-mouse-lock-button" type="button" :class="{'layer-inactive': game.settings.disableLockedMouseEvents}" title="Toggle Locked Selection"  @click="toggleLockedLayer()">
                    <i class="fa fa-lock" aria-hidden="true"></i>
                    <!--<i v-if="game.settings.disableLockedMouseEvents" class="fa fa-ban sub-icon" aria-hidden="true"></i>-->
                    <span v-if="game.settings.disableLockedMouseEvents" class="slash-icon"></span>
                </button>
            </div>
        </div>
        <div class="menu-page">
            <label class="construction-search" title="Search">
                <i class="fa fa-search" aria-hidden="true"></i>
                <div class="input-wrapper">
                    <input type="text" v-model="searchQuery" placeholder="Search" @input="refresh()">
                    <i class="fa fa-close" :class="{'active': searchQuery}" aria-hidden="true" @click="searchQuery = null"></i>
                </div>
            </label>
            <div class="construction-list-wrapper">
                <template v-if="searchQuery">
                    <p v-if="!getSearchResults.length" class="px-2 py-1 text-center">Sorry, couldn't find anything with that name.</p>
                    <app-game-building-list-icon v-for="building in getSearchResults" :building="building" :search="searchQuery"/>
                </template>
                <template v-else-if="game.selectedBuildingCategory !== 'all'">
                    <app-game-building-list-icon v-for="building in window.objectData.categories[game.selectedBuildingCategory].buildings" :building="building"/>
                </template>
                <template v-else>
                    <template v-for="(category, key) in window.objectData.categories">
                        <template v-if="!category.hideInList && (game.settings.showCollapsibleBuildingList || !category.hideInBuildingList) && (game.settings.enableExperimental || !category.experimental)">
                            <div v-if="game.settings.showCollapsibleBuildingList" class="construction-item-category" @click="category.visible = !category.visible; refresh()">
                                <div class="construction-item-category-icon" :style="{backgroundImage: 'url(' + category.icon + ')'}"></div>{{category.name}}{{category.experimental && ' (Preview)'}}<i class="fa float-right" :class="{'fa-angle-down': category.visible, 'fa-angle-right': !category.visible}" style="margin-top: 2px;" aria-hidden="true"></i>
                            </div>
                            <div v-if="(!game.settings.showCollapsibleBuildingList || category.visible)">
                                <app-game-building-list-icon v-for="building in category.buildings" :building="building"/>
                            </div>
                        </template>
                    </template>
                </template>
            </div>
        </div>
    </div>
    `
});

Vue.component('app-game-text-options', {
    props: ['container', 'textOptions'],
    template: html`
    <div class="construction-options row d-flex justify-content-center">
        <div class="btn-small col" title="Bold" :class="{ 'btn-active': textOptions.fontWeight === 'bold' }" @click="textOptions.fontWeight = textOptions.fontWeight === 'bold' ? 'normal' : 'bold'; container.updateStyleOptions()">
            <i class="fa fa-bold" aria-hidden="true"></i>
            <span class="label">bold</span>
        </div>
        <div class="btn-small col" title="Italic" :class="{ 'btn-active': textOptions.fontStyle === 'italic' }" @click="textOptions.fontStyle = textOptions.fontStyle === 'italic' ? 'normal' : 'italic'; container.updateStyleOptions()">
            <i class="fa fa-italic" aria-hidden="true"></i>
            <span class="label">italic</span>
        </div>
        <div class="btn-small col" title="Align Left" :class="{ 'btn-active': textOptions.align === 'left' }" @click="textOptions.align = 'left'; container.updateStyleOptions()">
            <i class="fa fa-align-left" aria-hidden="true"></i>
            <span class="label">align</span>
        </div>
        <div class="btn-small col" title="Align Middle" :class="{ 'btn-active': textOptions.align === 'center' }" @click="textOptions.align = 'center'; container.updateStyleOptions()">
            <i class="fa fa-align-center" aria-hidden="true"></i>
            <span class="label">align</span>
        </div>
        <div class="btn-small col" title="Align Right" :class="{ 'btn-active': textOptions.align === 'right' }" @click="textOptions.align = 'right'; container.updateStyleOptions()">
            <i class="fa fa-align-right" aria-hidden="true"></i>
            <span class="label">align</span>
        </div>
        <div class="btn-small col">
            <input class="btn-small small-number-input" title="Font Size" type="number" v-model.number="textOptions.fontSize" min="12" max="500" @change="container.updateStyleOptions()">
            <span class="label">px</span>
        </div>
        <div class="btn-small col" title="Color">
            <input class="btn-small color-input" type="color" v-model="textOptions.fill" @input="container.updateStyleOptions()">
            <i class="fa fa-tint icon-shadow" :style="{color: textOptions.fill}" aria-hidden="true"></i>
            <span class="label">color</span>
        </div>
        <div class="btn-small col" title="Reset Defaults" @click="container.resetStyleOptions()">
            <i class="fa fa-undo" aria-hidden="true"></i>
            <span class="label">reset</span>
        </div>
    </div>
    `
});

Vue.component('app-game-shape-options', {
    props: ['container', 'shapeOptions', 'subtype'],
    template: html`
    <div class="construction-options row d-flex justify-content-center">
        <div class="btn-small col">
            <input class="btn-small small-number-input" title="Opacity" type="number" v-model.number="shapeOptions.opacity" min="1" max="100" @change="container.updateStyleOptions()">
            <span class="label">opacity</span>
        </div>
        <template v-if="subtype === 'line'">
            <div class="btn-small col" title="Front Arrow" :class="{ 'btn-active': shapeOptions.frontArrow }" @click="shapeOptions.frontArrow = !shapeOptions.frontArrow; container.updateStyleOptions()">
                <i class="fa fa-caret-left" aria-hidden="true"></i>
                <span class="label">arrow</span>
            </div>
            <div class="btn-small col" title="Distance" :class="{ 'btn-active': shapeOptions.showDist }" @click="shapeOptions.showDist = !shapeOptions.showDist; container.updateStyleOptions()">
                <i class="fa fa-sort-numeric-asc" aria-hidden="true"></i>
                <span class="label">meters</span>
            </div>
            <div class="btn-small col" title="Back Arrow" :class="{ 'btn-active': shapeOptions.backArrow }" @click="shapeOptions.backArrow = !shapeOptions.backArrow; container.updateStyleOptions()">
                <i class="fa fa-caret-right" aria-hidden="true"></i>
                <span class="label">arrow</span>
            </div>
        </template>
        <template v-if="subtype === 'image'">
            <div class="btn-small col" title="Flip Horizontally" @click="game.flipSelected()">
                <i class="fa fa-arrows-h" aria-hidden="true"></i>
                <span class="label">flip</span>
            </div>
            <div class="btn-small col" title="Flip Vertically" @click="game.flipSelected(true)">
                <i class="fa fa-arrows-v" aria-hidden="true"></i>
                <span class="label">flip</span>
            </div>
            <div class="btn-small col" title="Maintain Aspect Ratio" :class="{ 'btn-active': shapeOptions.maintainAspectRatio }" @click="shapeOptions.maintainAspectRatio = !shapeOptions.maintainAspectRatio; container.updateStyleOptions()">
                <i class="fa fa-expand fa-rotate-90" aria-hidden="true"></i>
                <span class="label">keep aspect</span>
            </div>
            <div class="btn-small col" title="Send to Back" :class="{ 'btn-active': shapeOptions.sendToBackground }" @click="shapeOptions.sendToBackground = !shapeOptions.sendToBackground; container.updateStyleOptions()">
                <i class="fa fa-arrow-circle-down" aria-hidden="true"></i>
                <span class="label">background</span>
            </div>
        </template>
        <div v-if="subtype !== 'image' && subtype !== 'line'" title="Border" class="btn-small col" :class="{ 'btn-active': shapeOptions.border }" @click="shapeOptions.border = !shapeOptions.border; container.updateStyleOptions()">
            <i class="fa" :class="{ 'fa-square-o': subtype === 'rectangle', 'fa-circle-thin': subtype === 'circle' }" aria-hidden="true"></i>
            <span class="label">border</span>
        </div>
        <div v-if="subtype === 'line' || shapeOptions.border" class="btn-small col">
            <input class="btn-small small-number-input" title="Line Thickness" type="number" v-model.number="shapeOptions.lineWidth" min="6" max="64" @change="container.updateStyleOptions()">
            <span class="label">thickness</span>
        </div>
        <div v-if="subtype !== 'image'" class="btn-small col" title="Color">
            <input class="btn-small color-input" type="color" v-model="shapeOptions.fillColor" @input="container.updateStyleOptions()">
            <i class="fa fa-tint icon-shadow" :style="{color: shapeOptions.fillColor}" aria-hidden="true"></i>
            <span class="label">color</span>
        </div>
        <div class="btn-small col" title="Reset Defaults" @click="container.resetStyleOptions()">
            <i class="fa fa-undo" aria-hidden="true"></i>
            <span class="label">reset</span>
        </div>
    </div>
    `
});

Vue.component('app-game-building-list-icon', {
    props: ['building', 'search'],
    methods: {
        buildBuilding: function(building) {
            this.bmc();
            game.createObject(building);
            game.sidebarMenuComponent.showHoverMenu(null);
        },
        buildingHover: function(building) {
            game.sidebarMenuComponent.showHoverMenu(building);
        }
    },
    template: html`
    <div v-if="search || game.canShowListItem(building)" class="build-icon" :class="{'ignore-transform': building.preset}" :title="building.name"
        :style="{backgroundImage:'url(' + ((building.baseIcon || (building.category !== 'entrenchments' && building.parent && !building.parentKey && building.parent.icon) || building.icon) ?? '/assets/default_icon.webp') + ')'}"
        @mouseenter="bme(); buildingHover(building)" @mouseleave="buildingHover(null)" @click="buildBuilding(building)">
        <div v-if="!building.baseIcon && !building.parentKey && building.parent?.icon && building.parent.icon !== building.icon" class="build-subicon" :title="building.parent.name" :style="{backgroundImage: 'url(' + ((building.category === 'entrenchments' && building.parent.icon) || building.icon) + ')'}"></div>
    </div>
    `
});

Vue.component('app-menu-settings', {
    props: ['menuData'],
    methods: {
        updateSettings: function() {
            game.settings.gridSize = Math.max(game.settings.gridSize, 1);
            game.settings.snapRotationDegrees = Math.min(Math.max(game.settings.snapRotationDegrees, 1), 360);
            game.settings.keySnapRotationDegrees = Math.min(Math.max(game.settings.keySnapRotationDegrees, 1), 360);
            game.settings.zoomSpeed = Math.min(Math.max(game.settings.zoomSpeed, 1), 5);
            game.updateSettings();
        }
    },
    template: html`
    <div id="settings" class="text-left">
        <div class="settings-option-wrapper">
            <div class="settings-title">General Settings</div>
            <label class="app-input-label">
                <i class="fa fa-picture-o" aria-hidden="true"></i> Graphics
                <select class="app-input" v-model="game.settings.quality" @change="game.updateQuality()">
                    <option value="auto">Auto</option>
                    <option value="high">High Quality</option>
                    <option value="low">Low Quality</option>
                </select>
            </label>
            <label class="app-input-label">
                <i class="fa fa-volume-up" aria-hidden="true"></i> Volume
                <input type="range" v-model="game.settings.volume" min="0" max="1" step="0.1" class="slider" @input="game.updateSettings()">
            </label>
            <label class="app-input-label">
                <i class="fa fa-flag" aria-hidden="true"></i> Display Faction Colors
                <input class="app-input" type="checkbox" v-model="game.settings.displayFactionTheme" @change="game.updateSettings()">
            </label>
            <label class="app-input-label">
                <i class="fa fa-history" aria-hidden="true"></i> Save History (Undo / Redo)
                <input class="app-input" type="checkbox" v-model="game.settings.enableHistory" @change="game.updateSettings()">
            </label>
            <label v-if="game.settings.enableHistory" class="app-input-label" title="The total amount of saves / actions that can be stored to undo / redo.">
                <i class="fa fa-hdd-o" aria-hidden="true"></i> Stored History Size
                <input class="app-input" type="number" v-model.number="game.settings.historySize" @input="game.updateSettings()">
            </label>
            <label v-if="game.settings.enableHistory" class="app-input-label">
                <i class="fa fa-upload" aria-hidden="true"></i> Auto-Load Last Save
                <input class="app-input" type="checkbox" v-model="game.settings.enableAutoLoading" @change="game.updateSettings()">
            </label>
            <label class="app-input-label">
                <i class="fa fa-flask" aria-hidden="true"></i> Enable Experimental Features
                <input class="app-input" type="checkbox" v-model="game.settings.enableExperimental" @change="game.updateSettings()">
            </label>
        </div>
        <div class="settings-option-wrapper">
            <div class="settings-title">Board Settings</div>
            <label class="app-input-label">
                <i class="fa fa-header" aria-hidden="true"></i> Display Project Name
                <input class="app-input" type="checkbox" v-model="game.settings.showFacilityName" @change="game.updateSettings()">
            </label>
            <label class="app-input-label">
                <i class="fa fa-arrow-circle-up" aria-hidden="true"></i> Bring Selected to Front
                <input class="app-input" type="checkbox" v-model="game.settings.bringSelectedToFront" @change="game.updateSettings()">
            </label>
            <label class="app-input-label">
                <i class="fa fa-mouse-pointer" aria-hidden="true"></i> Disable Locked Selection
                <input class="app-input" type="checkbox" v-model="game.settings.disableLockedMouseEvents" @change="game.updateSettings()">
            </label>
            <label class="app-input-label">
                <i class="fa fa-th-large" aria-hidden="true"></i> Snap Grid Size
                <input class="app-input" type="number" v-model.number="game.settings.gridSize" min="1" @change="updateSettings()">
            </label>
            <label class="app-input-label">
                <i class="fa fa-repeat" aria-hidden="true"></i> Mouse Rotation Degrees
                <input class="app-input" type="number" v-model.number="game.settings.snapRotationDegrees" min="1" max="360" @change="updateSettings()">
            </label>
            <label class="app-input-label">
                <i class="fa fa-repeat" aria-hidden="true"></i> Hotkey Rotation Degrees
                <input class="app-input" type="number" v-model.number="game.settings.keySnapRotationDegrees" min="1" max="360" @change="updateSettings()">
            </label>
            <label class="app-input-label">
                <i class="fa fa-search-plus" aria-hidden="true"></i> Zoom Speed
                <input class="app-input" type="number" v-model.number="game.settings.zoomSpeed" min="1" max="5" @change="updateSettings()">
            </label>
        </div>
        <div class="settings-option-wrapper">
            <div class="settings-title">Construction Settings</div>
            <label class="app-input-label">
                <i class="fa fa-folder-open" aria-hidden="true"></i> Default Category
                <select class="app-input" v-model="game.settings.defaultBuildingCategory" @change="game.updateSettings()">
                    <option value="all">All Buildings</option>
                    <template v-for="(category, key) in window.objectData.categories">
                        <option v-if="!category.experimental || game.settings.enableExperimental" :value="key">{{category.name}}</option>
                    </template>
                </select>
            </label>
            <label class="app-input-label">
                <i class="fa fa-users" aria-hidden="true"></i> Selected Faction
                <select class="app-input" v-model="game.settings.selectedFaction" @change="game.setFaction(game.settings.selectedFaction)">
                    <option :value="null">Neutral</option>
                    <option value="c">Colonials</option>
                    <option value="w">Wardens</option>
                </select>
            </label>
            <label class="app-input-label">
                <i class="fa fa-sitemap" aria-hidden="true"></i> Selected Tech Tier
                <select class="app-input" v-model.number="game.settings.selectedTier" @change="game.updateSettings()">
                    <option value="1">Tier 1</option>
                    <option value="2">Tier 2</option>
                    <option value="3">Tier 3</option>
                </select>
            </label>
            <label class="app-input-label">
                <i class="fa fa-ban" aria-hidden="true"></i> Show Selected Tier Only
                <input class="app-input" type="checkbox" v-model="game.settings.showSelectedTierOnly" @change="game.updateSettings()">
            </label>
            <label class="app-input-label">
                <i class="fa fa-compress" aria-hidden="true"></i> Show Collapsible Building List
                <input class="app-input" type="checkbox" v-model="game.settings.showCollapsibleBuildingList" @change="game.updateSettings()">
            </label>
            <label class="app-input-label">
                <i class="fa fa-chevron-circle-up" aria-hidden="true"></i> Show All Upgrades in List
                <input class="app-input" type="checkbox" v-model="game.settings.showUpgradesAsBuildings" @change="game.updateSettings()">
            </label>
        </div>
        <div class="settings-option-wrapper">
            <div class="settings-title">Building Settings</div>
            <label class="app-input-label">
                <i class="fa fa-sitemap" aria-hidden="true"></i> Show Base Production Recipes
                <input class="app-input" type="checkbox" v-model="game.settings.showParentProductionList" @change="game.updateSettings()">
            </label>
        </div>
    </div>
    `
});

Vue.component('app-menu-save-load', {
    props: ['menuData'],
    data() {
        return {
            importAsSelection: false,
            showImageBackground: true,
            centerImageOnObjects: false
        };
    },
    methods: {
        openFileBrowser: function(importAsSelection = false) {
            this.importAsSelection = importAsSelection;
            document.getElementById('fileUpload').click();
        },
        loadSave: function(saveObject) {
            try {
                if (typeof saveObject === 'string') {
                    saveObject = JSON.parse(saveObject);
                }
                game.loadSave(saveObject, this.importAsSelection);
                this.$forceUpdate();
            } catch (e) {
                console.error('Failed to load save:', e);
                game.showGrowl('Failed to load save.');
            }
        },
        loadFile: function() {
            let file = this.$refs.file.files[0];
            let reader = new FileReader();
            let component = this;
            reader.onload = function() {
                let decoder = new TextDecoder("utf-8");
                component.loadSave(decoder.decode(new Uint8Array(this.result)));
            };
            reader.readAsArrayBuffer(file);
        },
        updateProjectProperties: function() {
            if (game.projectName === '') {
                game.projectName = 'Unnamed Project';
            }
            game.updateSave();
            this.$forceUpdate();
            game.appComponent?.refresh();
        }
    },
    template: html`
    <div id="save-load-page">
        <input id="fileUpload" @change="loadFile()" type="file" ref="file" hidden>
        <div class="settings-option-wrapper">
            <div class="settings-title">Project Properties</div>
            <label class="app-input-label project-name-input pt-0">
                <small class="mx-1">Name</small>
                <input class="app-input text-left" type="text" v-model="game.projectName" placeholder="Unnamed Project" @change="updateProjectProperties()">
            </label>
            <label class="app-input-label project-name-input pt-0">
                <small class="mx-1">Description</small>
                <textarea class="app-input text-left" maxlength="500" v-model="game.projectDescription" placeholder="No description provided." @change="updateProjectProperties()"></textarea>
            </label>
            <label class="app-input-label project-name-input pt-0">
                <small class="mx-1">Author(s)</small>
                <input class="app-input text-left" type="text" v-model="game.projectAuthors" placeholder="Anonymous" @change="updateProjectProperties()">
            </label>
            <div class="text-center">
                <button class="app-btn app-btn-primary load-button" type="button" @click="openFileBrowser()" @mouseenter="bme()">
                    <i class="fa fa-upload"></i> Load
                </button>
                <button class="app-btn app-btn-primary save-button" type="button" @click="game.downloadSave()" @mouseenter="bme()">
                    <i class="fa fa-save"></i> Save
                </button>
            </div>
        </div>
        <div class="settings-option-wrapper">
            <div class="settings-title">Selection Options</div>
            <div class="text-button-wrapper">
                <button class="text-button mb-0" type="button" @click="openFileBrowser(true)" @mouseenter="bme()">
                    <i class="fa fa-mouse-pointer"></i> Import Project <small>(Objects)</small>
                </button>
                <small style="color: #d9d9d9;">Note: Importing only loads objects from a project.</small>
            </div>
        </div>
        <div v-if="game.settings.enableExperimental" class="settings-option-wrapper">
            <div class="settings-title">Image Export Options</div>
            <label class="app-input-label">
                <i class="fa fa-th-large" aria-hidden="true"></i> Include Background Grid
                <input class="app-input" type="checkbox" v-model="showImageBackground">
            </label>
            <label class="app-input-label">
                <i class="fa fa-crosshairs" aria-hidden="true"></i> Center Image on Objects
                <input class="app-input" type="checkbox" v-model="centerImageOnObjects">
            </label>
            <div class="text-button-wrapper">
                <button class="text-button" type="button" @click="game.downloadImage('screenshot', centerImageOnObjects, showImageBackground)" @mouseenter="bme()">
                    <i class="fa fa-camera"></i> Export Screenshot
                </button>
                <small style="color: #d9d9d9;">Note: Exporting an image does not save your project.</small>
            </div>
        </div>
    </div>
    `
});

Vue.component('app-menu-about', {
    props: ['menuData'],
    methods: {
        buildBuilding: function(buildingKey) {
            this.bmc();
            game.createBuildingAtCenter(buildingKey);
        }
    },
    template: html`
    <div id="about-page">
        <div class="about-section">
            <div class="about-section-header"><i class="fa fa-question-circle"></i> What is Foxhole Planner?</div>
            <p>
                This is a fan-made tool that allows you to create plans for bunkers, facilities, and more from the game Foxhole.
            </p>
        </div>
        <div class="about-section">
            <div class="about-section-header"><i class="fa fa-keyboard-o" aria-hidden="true"></i> Controls + Hotkeys</div>
            <div class="controls-section-body">
                <div class="middle-mouse-button"></div> Move board position.<br>
                <div class="middle-mouse-button"></div> Scroll to zoom in/out board.
                <hr>
                <div class="left-mouse-button"></div> Select a single structure.<br>
                <div class="left-mouse-button"></div> Drag to select multiple structures.<br>
                <div class="right-mouse-button"></div> Rotate selected structures.
                <hr>
                <div class="keyboard-key">ctrl</div> + <div class="left-mouse-button"></div> Add structure to selection.<br>
                <div class="keyboard-key">ctrl</div> + <div class="middle-mouse-button"></div> Adjust selected spline length.<br>
                <div class="keyboard-key">ctrl</div> + <div class="keyboard-key">A</div> Select all structures.<br>
                <div class="keyboard-key">ctrl</div> + <div class="keyboard-key">C</div> Clone selection.
                <hr>
                <div class="keyboard-key">ctrl</div> + <div class="keyboard-key">Z</div> Undo previous action.<br>
                <div class="keyboard-key">ctrl</div> + <div class="keyboard-key">Y</div> Redo previous action.<br>
                <div class="keyboard-key">ctrl</div> + <div class="keyboard-key">shift</div> + <div class="keyboard-key">Z</div> Redo previous action.
                <hr>
                <div class="keyboard-key">shift</div> + <div class="left-mouse-button"></div> Add structure to selection.<br>
                <div class="keyboard-key">shift</div> + <div class="left-mouse-button"></div> Add bunker to selection.<br>
                <div class="keyboard-key">shift</div> + <div class="left-mouse-button"></div> Snap structure to grid.
                <hr>
                <div class="keyboard-key">number</div> Select toolbelt slot. (0-9)<br>
                <i class="fa fa-reply fa-rotate-180" aria-hidden="true"></i> <div class="keyboard-key">shift</div> Swap toolbelt. (0-9)
                <hr>
                <div class="keyboard-key"><i class="fa fa-angle-up" aria-hidden="true"></i></div> <div class="keyboard-key"><i class="fa fa-angle-down" aria-hidden="true"></i></div> Move selection up / down.<br>
                <div class="keyboard-key"><i class="fa fa-angle-left" aria-hidden="true"></i></div> <div class="keyboard-key"><i class="fa fa-angle-right" aria-hidden="true"></i></div> Move selection left / right.
                <hr>
                <div class="keyboard-key">W, A, S, D</div> Move selection along grid.<br>
                <i class="fa fa-reply fa-rotate-180" aria-hidden="true"></i> <div class="keyboard-key">shift</div> Halve selection movement.
                <hr>
                <div class="keyboard-key">Q, E</div> Rotate selection by degrees. ({{game.settings.keySnapRotationDegrees}}°)<br>
                <i class="fa fa-reply fa-rotate-180" aria-hidden="true"></i> <div class="keyboard-key">shift</div> Double selection rotation. ({{game.settings.keySnapRotationDegrees * 2}}°)
                <hr>
                <div class="keyboard-key">space</div> Pause / Resume physics.<br>
                <div class="keyboard-key">L</div> Toggle lock for selected structures.<br>
                <div class="keyboard-key">P</div> Toggle production output icons.<br>
                <div class="keyboard-key">del</div> Delete selected structures.<br>
                <div class="keyboard-key">esc</div> Clear selection.<br>
                <div class="keyboard-key">F2</div> Debug menu.
            </div>
        </div>
        <div class="about-section">
            <div class="about-section-header"><i class="fa fa-code" aria-hidden="true"></i> Project Credits</div>
            <div class="text-center">
                Made with ❤️ by <a href="https://bombsightgames.com/" target="_blank">Ray</a> and <a href="https://github.com/jimdcunningham" target="_blank">Jimbo</a>.<br>
                <hr>
                <p style="font-size:10px;">
                    <a href="https://www.foxholegame.com/" target="_blank">Foxhole</a> is a registered trademark of <a href="https://www.siegecamp.com/" target="_blank">Siege Camp</a>.<br>
                    We are not affiliated with Siege Camp, this is a fan project.
                </p>
            </div>
        </div>
        <span style="font-size:7px; cursor:pointer; " @click="buildBuilding('sound_test')">worden smely 🤮</span>
    </div>
    `
});