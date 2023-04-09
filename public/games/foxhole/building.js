class FoxholeStructureSocket extends PIXI.Container {
    constructor(parent, socketData, x, y, rotation) {
        super();

        this.structure = parent;
        this.connections = {};
        this.socketData = socketData;
        this.socketData.x = x ?? (isNaN(this.socketData.x) ? 0 : (-parent.building.pxWidth/2) + (this.socketData.x * METER_BOARD_PIXEL_SIZE));
        this.socketData.y = y ?? (isNaN(this.socketData.y) ? 0 : (-parent.building.pxLength/2) + (this.socketData.y * METER_BOARD_PIXEL_SIZE));
        this.socketData.rotation = rotation ?? this.socketData.rotation;
        this.position.set(this.socketData.x, this.socketData.y);
        this.rotation = rotation ?? Math.deg2rad(this.socketData.rotation);

        const socketWidth = 32, socketThickness = 6, powerSocketSize = 8;
        if (!socketData.temp) {
            // Might want to add what kind of liquid it expects, water, oil, power, etc.
            if (this.socketData.flow === 'in') {
                this.pointer = new PIXI.Sprite(game.resources.pointer.texture);
                this.pointer.anchor.set(0.5, -0.5);
                this.pointer.rotation = Math.PI;
            } else if (this.socketData.flow === 'out') {
                this.pointer = new PIXI.Sprite(game.resources.pointer.texture);
                this.pointer.anchor.set(0.5, 1.5);
            } else if (this.socketData.flow === 'bi' && this.socketData.cap !== 'left' && this.socketData.cap !== 'right') {
                this.pointer = new PIXI.Sprite(game.resources.bipointer.texture);
                this.pointer.anchor.set(0.5, 1.5);
            } else if (this.socketData.name === 'power') {
                this.pointer = new PIXI.Sprite(game.resources.power.texture);
                this.pointer.anchor.set(0.5, 1.5);
                this.pointer.rotation = -(parent.rotation + this.rotation);
                parent.handleTick = true;
            } else if (parent.building?.textureBorder && !parent.building.trenchConnector) {
                this.pointer = game.createSprite(parent.building.textureBorder, (sprite, texture) => {
                    sprite.width = texture.width / METER_TEXTURE_PIXEL_SCALE;
                    sprite.height = texture.height / METER_TEXTURE_PIXEL_SCALE;
                });
                this.pointer.anchor.set(0.5, 1.0);
            } else if (this.socketData.texture) {
                this.pointer = game.createSprite(this.socketData.texture, (sprite, texture) => {
                    sprite.width = texture.width / METER_TEXTURE_PIXEL_SCALE;
                    sprite.height = texture.height / METER_TEXTURE_PIXEL_SCALE;
                });
                this.pointer.anchor.set(0.5, 0.5);
            }
            if (this.pointer) {
                this.addChild(this.pointer);
            }

            const createSocketIndicator = (color, width, length, center) => {
                this.indicator = new PIXI.Graphics();
                this.indicator.beginFill(color ?? COLOR_ORANGE);
                this.indicator.drawRect(-(width ?? socketWidth)/2, -(length ?? socketThickness) / (center ? 2 : 1), (width ?? socketWidth), (length ?? socketThickness));
                this.indicator.endFill();
                this.addChild(this.indicator);
            }

            if (this.socketData.flow === 'in') {
                createSocketIndicator(COLOR_RED);
            } else if (this.socketData.flow === 'out') {
                createSocketIndicator(COLOR_GREEN);
            } else if (this.socketData.flow === 'bi') {
                if (this.socketData.cap !== 'left' && this.socketData.cap !== 'right') {
                    createSocketIndicator(COLOR_BLUE);
                }
            } else if (this.socketData.name === 'power') {
                createSocketIndicator(COLOR_YELLOW, powerSocketSize, powerSocketSize, true);
            } else if (this.socketData.type === 'traincar' || this.socketData.type === 'smalltraincar' || parent.building?.hasHandle || game.settings.enableDebug) {
                createSocketIndicator(undefined, socketThickness, socketThickness, true);
            }
        }
    }
    
    setConnection(connectingEntityId, connectingSocket, connectingSocketId) {
        if (!isNaN(connectingEntityId) && (typeof connectingSocketId === 'number' || connectingSocket?.socketData) && (isNaN(this.connections[connectingEntityId]) || this.connections[connectingEntityId] !== (connectingSocketId ?? connectingSocket.socketData.id))) {
            if (connectingSocket) {
                this.removeConnections();
                connectingSocket.connections[this.structure.id] = this.socketData.id;
                connectingSocket.setVisible(false);
            } else if (typeof connectingSocketId === 'number') {
                const connectingEntity = game.getEntityById(connectingEntityId);
                if (connectingEntity?.sockets) {
                    for (let i = 0; i < connectingEntity.sockets.length; i++) {
                        const connectingEntitySocket = connectingEntity.sockets[i];
                        if (connectingEntitySocket.socketData.id === connectingSocketId) {
                            connectingSocket = connectingEntitySocket;
                            break;
                        }
                    }
                    if (!connectingSocket && (this.structure.subtype === 'rail_large_gauge' || this.structure.subtype === 'rail_small_gauge')) {
                        const socketPosition = connectingEntity.toLocal(this, this.structure);
                        connectingSocket = this.createConnection(connectingEntity, socketPosition.x, socketPosition.y, ((this.structure.rotation + this.rotation) - connectingEntity.rotation) + Math.PI, connectingSocketId);
                    }
                }
            }
            this.connections[connectingEntityId] = connectingSocketId ?? connectingSocket.socketData.id;
            this.setVisible(false);
            if (this.structure.building.canUnion) {
                this.structure.setUnion(game.getEntityById(connectingEntityId));
            }
            return connectingSocket;
        }
    }

    // This works for rails, unsure about anything else. Could just use the position of the socket, but we already have positional and rotation data from snapping.
    createConnection(connectingEntity, x, y, rotation, id) {
        if (connectingEntity?.sockets) {
            let connectingSocket = null;
            for (let i = 0; i < connectingEntity.sockets.length; i++) {
                const socket2 = connectingEntity.sockets[i];
                if (typeof socket2.connections[this.structure.id] === 'number') {
                    connectingSocket = socket2;
                    break;
                }
            }
            if (connectingSocket) {
                if (connectingSocket.socketData.cap) {
                    this.removeConnections();
                    connectingSocket = null;
                } else if (connectingSocket.socketData.temp) {
                    connectingSocket.position.set(x, y);
                    connectingSocket.rotation = rotation;
                }
            }

            if (!connectingSocket) {
                let socketData = {
                    'id': id ?? connectingEntity.sockets.length,
                    'type': this.socketData.type,
                    'temp': true,
                    'switch': 'rail'
                };
                connectingSocket = connectingEntity.createSocket(socketData, x, y, rotation);

                if (connectingSocket) {
                    connectingSocket.connections[this.structure.id] = this.socketData.id;
                    if (Object.keys(this.connections).length) {
                        this.removeConnections();
                    }
                    this.connections[connectingEntity.id] = connectingSocket.socketData.id;
                    this.setVisible(false);
                }
            }

            if (connectingSocket) {
                const projection = connectingEntity.bezier?.project({x: x, y: y});
                connectingSocket.switchT = projection.t;

                return connectingSocket;
            }
        }
        return false;
    }
    
    canConnect(connectingSocket) {
        if (connectingSocket?.socketData?.type) {
            const socketType = this.socketData.type, connectingSocketType = connectingSocket.socketData.type;
            if (typeof socketType === typeof connectingSocketType) {
                if (!this.socketData.flow || (this.socketData.flow === 'bi' || (this.socketData.flow !== connectingSocket.socketData.flow))) {
                    if (typeof connectingSocketType === 'object' && Array.isArray(connectingSocketType)) {
                        for (const socketTypeA of socketType) {
                            for (const socketTypeB of connectingSocketType) {
                                if ((socketTypeA.category & socketTypeB.mask) !== 0 && (socketTypeB.category & socketTypeA.mask) !== 0) {
                                    return true;
                                }
                            }
                        }
                    } else {
                        return socketType === connectingSocketType;
                    }
                }
            }
        }
        return false;
    }
    
    remove() {
        if (this.socketData.temp) {
            if (this.socketData.below) {
                this.structure.bottomSockets.removeChild(this);
            } else {
                this.structure.topSockets.removeChild(this);
            }
            this.structure.sockets = this.structure.sockets.filter(obj => obj !== this);
        }
    }
    
    removeConnections(entityId, ignoreSelected, ignoreChecks) {
        if (Object.keys(this.connections).length) {
            let connectionEstablished = false;
            for (const [connectedEntityId, connectedSocketId] of Object.entries(this.connections)) {
                if (typeof entityId === 'number' && connectedEntityId === entityId) {
                    connectionEstablished = true;
                    continue;
                }
                const connectedEntity = game.getEntityById(connectedEntityId);
                if (connectedEntity) {
                    if (ignoreSelected && connectedEntity.selected) {
                        connectionEstablished = true;
                        continue;
                    }
                    if (connectedEntity.sockets) {
                        for (let k = 0; k < connectedEntity.sockets.length; k++) {
                            const connectedSocket = connectedEntity.sockets[k];
                            if (connectedSocket.socketData.id === connectedSocketId) {
                                delete connectedSocket.connections[this.structure.id];
                                if (Object.keys(connectedSocket.connections).length === 0) {
                                    if (!ignoreChecks) {
                                        if (connectedEntity.building?.requireConnection) {
                                            connectedEntity.remove();
                                            break;
                                        } else if (connectedSocket.socketData.temp) {
                                            connectedSocket.remove();
                                            break;
                                        }
                                    }
                                    connectedSocket.setVisible(true);
                                }
                                break;
                            }
                        }
                    }
                }
                delete this.connections[connectedEntityId];
            }
            if (!connectionEstablished) {
                if (this.socketData.temp) {
                    this.remove();
                } else {
                    this.setVisible(true);
                }
                if (this.structure.building.canUnion) {
                    game.updateEntityUnions();
                }
            }
        }
    }
    
    setVisible(visible) {
        if (this.indicator && this.socketData.name !== 'power') {
            this.indicator.visible = visible;
        }
        if (this.pointer) {
            const connectedEntityIds = Object.keys(this.connections);
            visible = visible ?? connectedEntityIds.length === 0;
            if (this.socketData.textureAlt) {
                game.fetchTexture(this.pointer, visible ? this.socketData.texture : this.socketData.textureAlt, (sprite, texture) => {
                    sprite.width = texture.width / METER_TEXTURE_PIXEL_SCALE;
                    sprite.height = texture.height / METER_TEXTURE_PIXEL_SCALE;
                });
                visible = true;
            } else if (this.socketData.texture && !visible) {
                if (connectedEntityIds.length === 1) {
                    const e2 = game.getEntityById(connectedEntityIds[0]);
                    if (e2 && (game.constructionLayers[e2.sortLayer] < game.constructionLayers[this.structure.sortLayer])) {
                        visible = true;
                    }
                }
            }
            this.pointer.visible = visible;
        }
    }
}

class FoxholeStructure extends DraggableContainer {
    constructor(id, type, subtype, x, y, z, rotation) {
        super(id, type, subtype, x, y, z, rotation);

        if (type === 'building' || type === 'locomotive' || type === 'locomotive_undercarriage') {
            this.building = window.objectData.buildings[subtype];
            if (!this.building) {
                console.error('Invalid building type:', subtype);
                this.remove();
                return;
            }
        }

        if (this.building.sortLayer) {
            this.setSortLayer(this.building.sortLayer);
        }

        if (this.building.hasHandle) {
            this.addHandle(this.building.minLength > 1 ? this.building.minLength * METER_BOARD_PIXEL_SIZE : 200);
        }

        if (this.building.texture && !this.hasHandle) {
            let sprite;
            if (this.building.texture.speed) {
                sprite = game.createSprite(this.building.texture.src, (sprite, texture) => {
                    this.sheet = game.loadSpritesheet(texture, this.building.texture.width, this.building.texture.height);
                    sprite.texture = this.sheet[0][0];
                    sprite.frameWidth = Math.floor(texture.width / this.building.texture.width);
                    sprite.frameHeight = Math.floor(texture.height / this.building.texture.height);
                });
                sprite.frameX = 0;
                sprite.frameY = 0;
                sprite.width = this.building.width * METER_BOARD_PIXEL_SIZE;
                sprite.height = this.building.length * METER_BOARD_PIXEL_SIZE;
            } else {
                sprite = game.createSprite(this.building.texture.src);
                sprite.frameWidth = this.building.texture.width;
                sprite.frameHeight = this.building.texture.height;
                sprite.width = sprite.frameWidth / METER_TEXTURE_PIXEL_SCALE;
                sprite.height = sprite.frameHeight / METER_TEXTURE_PIXEL_SCALE;
            }
            if (!this.building.texture.offset) {
                sprite.anchor.set(0.5);
            } else {
                // TODO: Add support for percentages. <= 1 could set anchor so we don't need exact pixels.
                sprite.x = (-this.building.texture.offset.x * TEXTURE_SCALE) / METER_TEXTURE_PIXEL_SCALE;
                sprite.y = (-this.building.texture.offset.y * TEXTURE_SCALE) / METER_TEXTURE_PIXEL_SCALE;
            }
            this.sprite = sprite;
        }

        if (!this.sprite) {
            this.sprite = new PIXI.Container();
        }

        if (this.building.hitArea) {
            this.sprite.hitArea = new HitAreaShapes({
                'polygon': this.building.hitArea
            });
        }

        this.addChild(this.sprite);

        if (this.building.textureFrontCap) {
            this.frontCap = game.createSprite(this.building.textureFrontCap);
            this.frontCap.anchor.set(0, 0.5);
            this.addChild(this.frontCap);
        }

        if (this.building.textureBackCap) {
            this.backCap = game.createSprite(this.building.textureBackCap);
            this.backCap.anchor.set(1, 0.5);
            this.addChild(this.backCap);
        }

        if (this.building.range) {
            this.assignRange(this.building.range);
        }

        if (!this.building.hasHandle) {
            this.building.pxWidth = this.building.width ? this.building.width * METER_BOARD_PIXEL_SIZE : this.sprite?.width ?? 0;
            this.building.pxLength = this.building.length ? this.building.length * METER_BOARD_PIXEL_SIZE : this.sprite?.height ?? 0;
            this.setSelectionSize(this.building.pxWidth, this.building.pxLength);
        } else {
            this.selectionArea.clear();
        }

        if (this.building.vehicle) {
            const vehicle = this.building.vehicle;
            this.isTrain = (vehicle.type === 'train' || vehicle.type === 'smalltrain') ?? false;
            this.mass = vehicle.mass ?? 25;

            if (this.isTrain) {
                this.trackVelocity = 0;
                this.trackDirection = 1;
                if (vehicle.engine) {
                    this.userThrottle = 0;
                }
            }
        }

        if (this.building.key === 'maintenance_tunnel') {
            this.setMaintenanceFilters();
        }

        if (this.building.sockets) {
            for (let i = 0; i < this.building.sockets.length; i++) {
                this.createSocket(Object.assign({}, this.building.sockets[i]));
            }
        }

        if (this.building.canUnion) {
            this.union = this;
            this.unionRank = 0;
        }

        if (this.building.baseUpgrades) {
            this.baseUpgrades = {};
        }

        /*
        let buildingIcon = building.parent?.icon ?? building.icon;
        if (sprite && buildingIcon && (!building.textureIcon || !building.textureIcon?.disabled)) {
            let iconPadding = 28;
            let iconWidth = sprite.width - iconPadding;
            iconWidth = iconWidth > 128 ? 128 : iconWidth;
            iconWidth = iconWidth > sprite.height ? sprite.height - iconPadding : iconWidth;
            let iconHeight = iconWidth;
            let iconYOffset = 0;
            let iconTexture = game.resources[buildingIcon].texture;

            if (building.textureIcon) {
                iconWidth = building.textureIcon.width ?? iconWidth;
                iconHeight = building.textureIcon.height ?? iconHeight;
                iconYOffset = building.textureIcon.y ?? iconYOffset;

                // Crop the icon if necessary. This icon / texture should be stored inside of resources and on building data in the future.
                if (iconWidth !== iconHeight) {
                    let meterWidth = iconTexture.width;
                    let meterHeight = iconTexture.height;
                    if (iconWidth > iconHeight) {
                        meterHeight = meterHeight * ((iconHeight / METER_PIXEL_SIZE) / (iconWidth / METER_PIXEL_SIZE));
                    } else {
                        meterWidth = meterWidth * ((iconWidth / METER_PIXEL_SIZE) / (iconHeight / METER_PIXEL_SIZE));
                    }
                    iconTexture = new PIXI.Texture(iconTexture, new PIXI.Rectangle(((iconTexture.width - meterWidth) / 2), ((iconTexture.height - meterHeight) / 2), meterWidth, meterHeight));
                }
            }

            if (iconWidth !== sprite.width && iconHeight !== sprite.height) {
                let iconBackground = new PIXI.Graphics();
                iconBackground.lineStyle(4, COLOR_WHITE);
                iconBackground.beginFill(COLOR_CHARCOAL);
                iconBackground.drawRect(-(iconWidth/2), -(iconHeight/2) + iconYOffset, iconWidth, iconHeight);
                iconBackground.endFill();
                this.addChild(iconBackground);
            }

            let icon = new PIXI.Sprite(iconTexture);
            icon.y = iconYOffset;
            icon.width = iconWidth - 10;
            icon.height = iconHeight - 10;
            icon.anchor.set(0.5, 0.5);
            this.addChild(icon);
        }
        */
        
        this.regenerate();
    }

    tick(delta) {
        super.tick(delta);

        if (this.sheet && this.visible && this.sprite.frameWidth && this.sprite.frameHeight) {
            this.sprite.frameX += this.building.texture.speed ? this.building.texture.speed : 0.1;
            if (this.sprite.frameX >= this.sprite.frameWidth) {
                this.sprite.frameX -= this.sprite.frameWidth;
            }
            if (this.sprite.frameY >= this.sprite.frameHeight) {
                this.sprite.frameY -= this.sprite.frameHeight;
            }
            this.sprite.texture = this.sheet[Math.floor(this.sprite.frameX)][Math.floor(this.sprite.frameY)];
        }

        if (this.building.sound) {
            if (!this.sound && this.building.sound && game.sounds[this.building.sound]) {
                this.sound = game.soundPlay(game.sounds[this.building.sound], this, 0.4);
            }

            if (this.sound) {
                game.soundUpdate(this.sound);
                if (this.sound.stopped) {
                    this.sound = null;
                }
            }
        } else if (this.isTrain) {
            let rate = Math.abs(this.trackVelocity)/6;
            if (rate < 0) {
                rate = 0;
            }
            if (rate > 1) {
                rate = 1;
            }

            if (game.playMode && this.subtype === 'trainengine' && this.currentTrack && Math.abs(this.userThrottle) > 0) {
                if (game.settings.quality === 'auto' || game.settings.quality === 'high') {
                    if (!this.smokeTime || this.smokeTime <= 0) {
                        this.smokeTime = 6 - Math.floor(Math.abs(this.trackVelocity)*0.5);
                        let angle = (Math.PI * 2) * Math.random();
                        let size = 70 + Math.round(Math.random() * 10);
                        let speed = 0.25 + (Math.random() * 0.2);
                        game.createEffect('smoke', this.x + Math.cos(this.rotation) * 90, this.y + Math.sin(this.rotation) * 90, this.z, size, size, {
                            dx: Math.cos(angle) * (speed * Math.random()),
                            dy: Math.sin(angle) * (speed * Math.random()),
                            tint: 0xCCCCCC
                        });
                    }
                    this.smokeTime--;
                }
            }

            if (game.playMode && rate > 0.15) {
                if (!this.sound) {
                    let soundKey = 'train_wheel_loop';
                    if (this.subtype === 'trainengine' && Math.abs(this.userThrottle) >= 0.05) {
                        soundKey = 'train_engine';
                    }
                    this.sound = game.soundPlay(game.sounds[soundKey], this, 0.4);
                }

                if (this.sound) {
                    game.soundUpdate(this.sound);

                    this.sound.sound.rate(rate, this.sound.id);
                    if (this.sound.stopped) {
                        this.sound = null;
                    }
                }
            } else {
                if (this.sound) {
                    game.soundStop(this.sound);
                    this.sound = null;
                }
            }
        }

        if (game.playMode && this.isTrain && this.currentTrack && this.currentTrack.bezier) {
            if (this.currentTrackT === null) {
                const projection = this.currentTrack.bezier?.project(this.currentTrack.toLocal({x: this.x, y: this.y}, game.app.cstage, undefined, true));
                this.currentTrackT = projection.t;

                if (Math.abs(this.lastTrackT - this.currentTrackT) <= 0.1) {
                    this.trackDirection *= -1;
                }
            }

            let normal = this.currentTrack.bezier.normal(this.currentTrackT);
            let angle = Math.angleBetween({x: 0, y: 0}, normal);
            if (this.trackDirection === -1) {
                angle += Math.PI;
            }
            this.rotation = Math.normalizeAngleRadians(this.currentTrack.rotation + (angle - Math.PI/2));

            if (this.building.vehicle.engine) {
                this.throttle = 0.01 * this.userThrottle;
            }

            this.trackVelocity *= 0.999;
            if (Math.abs(this.trackVelocity) <= 0.0001) {
                this.trackVelocity = 0;
            }

            let maxVelocity = this.building.vehicle.maxSpeed;
            if (this.trackVelocity > maxVelocity) {
                this.trackVelocity = maxVelocity;
            } else if (this.trackVelocity < -maxVelocity) {
                this.trackVelocity = -maxVelocity;
            }
            this.moveAlongBezier((this.trackVelocity/this.currentTrack.bezier.length()) * this.trackDirection);

            if (this.throttle) {
                this.trackVelocity += this.throttle;
            }
        }
    }

    isVisible() {
        if (this.building.isBezier) {
            return true;
        }
        return super.isVisible();
    }

    onSave(objData, isSelection) {
        super.onSave(objData);

        if (!objData.upgrading) {
            if (typeof this.productionScale === 'number') {
                objData.productionScale = this.productionScale;
            }
            if (this.baseProduction) {
                objData.baseProduction = this.baseProduction;
            }
            objData.selectedProduction = this.selectedProduction;
            if (this.baseUpgrades) {
                objData.baseUpgrades = Object.assign({}, this.baseUpgrades);
            }
        }

        if (this.maintenanceFilters) {
            objData.maintenanceFilters = Object.assign({}, this.maintenanceFilters);
        }

        if (this.postExtension) {
            objData.postExtension = this.postExtension;
        }

        if (this.sockets) {
            for (let i = 0; i < this.sockets.length; i++) {
                let socket = this.sockets[i];
                let socketConnections = isSelection ? {} : socket.connections;
                if (isSelection) {
                    for (const [connectedEntityId, connectedSocketId] of Object.entries(socket.connections)) {
                        const connectedEntity = game.getEntityById(connectedEntityId);
                        if (connectedEntity?.selected) {
                            socketConnections[connectedEntityId] = connectedSocketId;
                        }
                    }
                }
                if (Object.keys(socketConnections).length) {
                    if (!objData.connections) {
                        objData.connections = {};
                    }
                    objData.connections[socket.socketData.id] = socketConnections;
                }
            }
        }

        if (this.isTrain && this.currentTrack) {
            let trackFound = !isSelection;
            if (isSelection) {
                for (const selectedEntity of game.getSelectedEntities()) {
                    if (selectedEntity.id === this.currentTrack.id) {
                        trackFound = true;
                        break;
                    }
                }
            }
            if (trackFound) {
                objData.currentTrackId = this.currentTrack.id;
                objData.currentTrackT = this.currentTrackT;

                if (typeof this.trackDirection === 'number') {
                    objData.trackDirection = this.trackDirection;
                }
            }
        }
    }

    onLoad(objData) {
        super.onLoad(objData);

        if (typeof objData.selectedProduction === 'number') {
            if (typeof objData.productionScale === 'number') {
                this.productionScale = objData.productionScale;
            }
            this.setProductionId(objData.selectedProduction, objData.baseProduction);
        }

        if (objData.baseUpgrades) {
            for (const [tree, key] of Object.entries(objData.baseUpgrades)) {
                this.setBaseUpgrade(tree, key);
            }
        }

        if (objData.maintenanceFilters) {
            this.setMaintenanceFilters(objData.maintenanceFilters);
        }

        if (objData.postExtension) {
            this.postExtension = objData.postExtension;
            this.regenerate();
        }

        if (this.isTrain && typeof objData.trackDirection === 'number') {
            this.trackDirection = objData.trackDirection;
        }

        game.refreshStats();
    }
    
    afterLoad(objData, objIdMap) {
        if (this.sockets && objData.connections) {
            for (let i = 0; i < this.sockets.length; i++) {
                const socket = this.sockets[i];
                const socketConnectionData = objData.connections[socket.socketData.id];
                if (socketConnectionData) {
                    for (const [connectedEntityId, connectedSocketId] of Object.entries(socketConnectionData)) {
                        const remappedEntityId = (objIdMap && typeof objIdMap[connectedEntityId] === 'number') ? objIdMap[connectedEntityId] : connectedEntityId;
                        const connectedEntity = game.getEntityById(remappedEntityId);
                        if (connectedEntity.sockets) {
                            socket.setConnection(remappedEntityId, undefined, connectedSocketId);
                        } else if (this.building.requireConnection) {
                            this.remove();
                            break;
                        }
                    }
                }
            }
        }

        if (this.isTrain && typeof objData.currentTrackId === 'number') {
            if (objIdMap && typeof objIdMap[objData.currentTrackId] === 'number') {
                this.currentTrack = game.getEntityById(objIdMap[objData.currentTrackId]);
            } else {
                this.currentTrack = game.getEntityById(objData.currentTrackId);
            }
            this.currentTrackT = objData.currentTrackT;
        }

        if (this.rangeSprite) {
            this.updateRangeMask();
        }
    }

    onRemove() {
        super.onRemove();

        game.deselectHandle();

        if (this.sockets) {
            this.removeConnections();
        }

        if (this.subtype === 'rail_large_gauge' || this.subtype === 'rail_small_gauge') {
            for (const entity2 of game.getEntities()) {
                if (entity2.isTrain && entity2.currentTrack === this) {
                    entity2.currentTrack = null;
                    entity2.currentTrackT = null;
                    entity2.trackVelocity = 0;
                }
            }
        }
    }

    afterRemove() {
        game.refreshStats();
    }

    assignRange(rangeData) {
        this.removeChild(this.rangeSprite);
        if (rangeData) {
            const rangeColor = COLOR_RANGES[rangeData.type] ?? COLOR_RANGES.default;
            this.rangeSprite = new PIXI.Graphics();
            this.rangeSprite.alpha = 0.15;
            this.updateOverlays();
            if (!isNaN(rangeData.arc)) {
                this.rangeSprite.beginFill(rangeColor);
                this.rangeSprite.lineStyle(1, rangeColor);
                if(!isNaN(rangeData.min)) {
                    const rangeArc = Math.deg2rad(rangeData.arc);
                    this.rangeSprite.arc(0, 0, rangeData.min * METER_BOARD_PIXEL_SIZE, Math.PI/2 + rangeArc, Math.PI/2 - rangeArc, true);
                } else {
                    this.rangeSprite.moveTo(0, 0);
                }
                const rangeArc = Math.deg2rad(rangeData.arc);
                this.rangeSprite.arc(0, 0, rangeData.max * METER_BOARD_PIXEL_SIZE, Math.PI/2 - rangeArc, Math.PI/2 + rangeArc);
                if(isNaN(rangeData.min)) this.rangeSprite.lineTo(0, 0);
                this.rangeSprite.endFill();
            } else if (!isNaN(rangeData.min)) {
                this.rangeSprite.lineStyle((rangeData.max - rangeData.min) * METER_BOARD_PIXEL_SIZE, rangeColor, 1);
                this.rangeSprite.drawCircle(0, 0, ((rangeData.min + rangeData.max) / 2) * METER_BOARD_PIXEL_SIZE);
            } else {
                this.rangeSprite.beginFill(rangeColor);
                this.rangeSprite.drawCircle(0, 0, rangeData.max * METER_BOARD_PIXEL_SIZE);
                this.rangeSprite.endFill();
            }
            if (rangeData.overlap) {
                this.rangeSprite.lineStyle(10, COLOR_RANGE_BORDER, 1);
                this.rangeSprite.drawCircle(0, 0, rangeData.overlap * METER_BOARD_PIXEL_SIZE);
            }
            this.addChild(this.rangeSprite);
        }
    }
    
    updateRangeMask() {
        if (game.settings.enableExperimental && this.building.range?.lineOfSight && this.rangeSprite?.visible) {
            const rayCast = (polygons, rayStart, rayEnd) => {
                let closestIntersection = null;

                for (let polygon of polygons) {
                    for (let i = 0; i < polygon.length; i++) {
                        let p1 = polygon[i];
                        let p2 = polygon[(i + 1) % polygon.length];

                        let intersection = getLineIntersection(p1, p2, rayStart, rayEnd);
                        if (!intersection) continue;

                        if (!closestIntersection || Math.distanceBetween(rayStart, intersection) < Math.distanceBetween(rayStart, closestIntersection)) {
                            closestIntersection = intersection;
                        }
                    }
                }

                return closestIntersection;
            }

            const getLineIntersection = (p1, p2, p3, p4) => {
                let denominator = (p4.y - p3.y) * (p2.x - p1.x) - (p4.x - p3.x) * (p2.y - p1.y);
                if (denominator == 0) return null;

                let ua = ((p4.x - p3.x) * (p1.y - p3.y) - (p4.y - p3.y) * (p1.x - p3.x)) / denominator;
                let ub = ((p2.x - p1.x) * (p1.y - p3.y) - (p2.y - p1.y) * (p1.x - p3.x)) / denominator;

                if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
                    return {
                        x: p1.x + ua * (p2.x - p1.x),
                        y: p1.y + ua * (p2.y - p1.y)
                    };
                }

                return null;
            }
            
            const polygons = [], entitySortLayer = game.constructionLayers[this.sortLayer];
            for (const e2 of game.getEntities()) {
                if (!e2.valid || e2 === this || !e2.building || e2.bezier) {
                    continue;
                }
                if (game.constructionLayers[e2.sortLayer] >= entitySortLayer && Math.distanceBetween(this, e2) < 1200) {
                    if (e2.building?.hitArea) {
                        for (const poly of e2.building.hitArea) {
                            if (poly.shape) {
                                const shapePoints = [];
                                for (let i = 0; i < poly.shape.length; i += 2) {
                                    shapePoints.push(this.toLocal({
                                        x: poly.shape[i],
                                        y: poly.shape[i + 1]
                                    }, e2));
                                }
                                polygons.push(shapePoints);
                            }
                        }
                    } else {
                        const w = ((e2.building?.width * METER_BOARD_PIXEL_SIZE) || e2.sprite.width) / 2;
                        const h = ((e2.building?.length * METER_BOARD_PIXEL_SIZE) || e2.sprite.height) / 2;
                        polygons.push([
                            this.toLocal({ x: -w, y: -h }, e2),
                            this.toLocal({ x: w, y: -h }, e2),
                            this.toLocal({ x: w, y: h }, e2),
                            this.toLocal({ x: -w, y: h }, e2)
                        ]);
                    }
                }
            }
            
            const maxDist = (this.building.range.max * 2) * METER_BOARD_PIXEL_SIZE, hitPoints = [];

            hitPoints.push(rayCast(polygons, { x: 0, y: 0 }, { x: -maxDist, y: -maxDist }) || { x: -maxDist, y: -maxDist });
            hitPoints.push(rayCast(polygons, { x: 0, y: 0 }, { x: maxDist, y: -maxDist }) || { x: maxDist, y: -maxDist });
            hitPoints.push(rayCast(polygons, { x: 0, y: 0 }, { x: maxDist, y: maxDist }) || { x: maxDist, y: maxDist });
            hitPoints.push(rayCast(polygons, { x: 0, y: 0 }, { x: -maxDist, y: maxDist }) || { x: -maxDist, y: maxDist });

            for (const poly of polygons) {
                for (const p of poly) {
                    hitPoints.push(rayCast(polygons, { x: 0, y: 0 }, p));
                }
            }

            for (const poly of polygons) {
                for (const p of poly) {
                    let angle = Math.angleBetween({ x: 0, y: 0 }, p);
                    let p1 = Math.extendPoint({ x: 0, y: 0 }, maxDist, angle - 0.001);
                    let p2 = Math.extendPoint({ x: 0, y: 0 }, maxDist, angle + 0.001);
                    hitPoints.push(rayCast(polygons, { x: 0, y: 0 }, p1) || p1);
                    hitPoints.push(rayCast(polygons, { x: 0, y: 0 }, p2) || p2);
                }
            }

            hitPoints.sort((p1, p2) => {
                return Math.angleBetween({ x: 0, y: 0}, p1) - Math.angleBetween({ x: 0, y: 0}, p2);
            });

            this.removeChild(this.lineOfSightRange);
            if (game.settings.enableDebug) {
                this.lineOfSightRange = new PIXI.Container();
                for (const p of hitPoints) {
                    let line = new PIXI.Graphics();
                    line.lineStyle(2, COLOR_GREEN).moveTo(0, 0).lineTo(p.x, p.y);
                    this.lineOfSightRange.addChild(line);
                }
                this.addChild(this.lineOfSightRange);
            }

            if (!this.rangeSpriteMask) {
                this.rangeSpriteMask = new PIXI.Graphics();
                this.addChild(this.rangeSpriteMask);
                this.rangeSprite.mask = this.rangeSpriteMask;
            }

            this.rangeSpriteMask.clear();
            this.rangeSpriteMask.beginFill(0xFF3300);
            this.rangeSpriteMask.drawPolygon(new PIXI.Polygon(hitPoints));
            this.rangeSpriteMask.endFill();
        }
    }

    moveAlongBezier(amount) {
        let previousTrackT = this.currentTrackT;
        this.currentTrackT += amount;
        if (this.currentTrackT < 0 || this.currentTrackT > 1) {
            let closestSocket = null;
            let closestDist = 1000000;
            for (let j = 0; j < this.currentTrack.sockets.length; j++) {
                const socket = this.currentTrack.sockets[j];
                let worldSocketPos = game.app.cstage.toLocal({
                    x: socket.x,
                    y: socket.y
                }, this.currentTrack, undefined, true);
                let dist = Math.distanceBetween(this, worldSocketPos);
                if (dist <= closestDist) {
                    closestDist = dist;
                    closestSocket = socket;
                }
            }

            if (closestSocket && closestSocket.connections && Object.keys(closestSocket.connections).length) {
                for (const [connectedEntityId] of Object.entries(closestSocket.connections)) {
                    this.currentTrack = game.getEntityById(connectedEntityId);
                    this.lastTrackT = this.currentTrackT;
                    this.currentTrackT = null;
                    break;
                }
            } else {
                if (this.currentTrackT >= 1) {
                    this.currentTrackT = 1;
                } else if (this.currentTrackT <= 0) {
                    this.currentTrackT = 0;
                }
                this.userThrottle = 0;
                this.trackVelocity = 0;
            }
        } else {
            let closeSocket = null;
            for (let j = 0; j < this.currentTrack.sockets.length; j++) {
                const socket = this.currentTrack.sockets[j];
                if (socket.switchEnabled &&
                    ((previousTrackT <= socket.switchT && this.currentTrackT >= socket.switchT) ||
                    (previousTrackT >= socket.switchT && this.currentTrackT <= socket.switchT))
                ) {
                    closeSocket = socket;
                    break;
                }
            }

            if (closeSocket && closeSocket.socketData.switch === 'rail') {
                for (const [connectedEntityId] of Object.entries(closeSocket.connections)) {
                    let projection1 = this.currentTrack.bezier.get(this.currentTrackT);
                    let curTrackPos = game.app.cstage.toLocal({
                        x: projection1.x,
                        y: projection1.y
                    }, this.currentTrack, undefined, true);
                    let angle1 = Math.angleBetween(this, curTrackPos);

                    let newTrack = game.getEntityById(connectedEntityId);
                    let projection2 = newTrack.bezier?.project(newTrack.toLocal({x: this.x, y: this.y}, game.app.cstage, undefined, true));
                    let newTrackGet = newTrack.bezier.get(projection2.t + (projection2.t > 0.5 ? -0.1 : 0.1));
                    let newTrackPos = game.app.cstage.toLocal({
                        x: newTrackGet.x,
                        y: newTrackGet.y
                    }, newTrack, undefined, true);
                    let angle2 = Math.angleBetween(this, newTrackPos);
                    let angleDiff = Math.abs(Math.differenceBetweenAngles(angle1, angle2));
                    if (angleDiff <= Math.PI/4) {
                        this.currentTrack = newTrack;
                        this.lastTrackT = this.currentTrackT;
                        this.currentTrackT = null;
                    }
                    break;
                }
            }
        }

        if (this.currentTrackT === null) {
            const projection = this.currentTrack.bezier?.project(this.currentTrack.toLocal({x: this.x, y: this.y}, game.app.cstage, undefined, true));
            this.currentTrackT = projection.t;

            let normal = this.currentTrack.bezier.normal(this.currentTrackT);
            let newAngle = Math.angleBetween({x: 0, y: 0}, normal);
            if (this.trackDirection === -1) {
                newAngle += Math.PI;
            }
            newAngle = Math.normalizeAngleRadians(this.currentTrack.rotation + (newAngle - Math.PI / 2));
            let currentAngle = Math.normalizeAngleRadians(this.rotation);
            if (Math.abs(Math.differenceBetweenAngles(currentAngle, newAngle)) >= Math.PI / 2) {
                this.trackDirection *= -1;
            }
        }

        let projection = this.currentTrack.bezier.get(this.currentTrackT);
        let global = game.app.cstage.toLocal({
            x: projection.x,
            y: projection.y
        }, this.currentTrack, undefined, true);
        this.x = global.x;
        this.y = global.y;

        if (game.getSelectedEntity() === this) {
            game.buildingSelectedMenuComponent?.refresh(true);
        }
    }
    
    createSocket(socketData, x, y, rotation) {
        if (!this.sockets) {
            this.sockets = [];
            this.bottomSockets = new PIXI.Container();
            this.bottomSockets.zIndex = -1;
            this.addChild(this.bottomSockets);
            // TODO: Sort top sockets above selectionArea.
            this.topSockets = new PIXI.Container();
            this.topSockets.zIndex = 1;
            this.addChild(this.topSockets);
            this.sortChildren();
        }

        const socket = new FoxholeStructureSocket(this, socketData, x, y, rotation);

        if (socketData.switch === 'rail') {
            let railSwitch = new PIXI.Sprite(game.resources['trackswitch_inactive'].texture);
            railSwitch.anchor.set(0.5);
            railSwitch.width = 32;
            railSwitch.height = 32;
            railSwitch.position.x += (this.subtype === 'rail_large_gauge' ? 100 : 70);
            railSwitch.interactive = true;
            socket.switchEnabled = false;
            railSwitch.on('pointerdown', () => {
                socket.switchEnabled = !socket.switchEnabled;
                if (socket.switchEnabled) {
                    railSwitch.texture = game.resources['trackswitch_active'].texture;
                } else {
                    railSwitch.texture = game.resources['trackswitch_inactive'].texture;
                }
            });
            socket.addChild(railSwitch);
        }

        this.sockets.push(socket);
        if (socketData.below) {
            this.bottomSockets.addChild(socket);
        } else {
            this.topSockets.addChild(socket);
        }
        return socket;
    }
    
    getSocketById(id) {
        for (let i = 0; i < this.sockets.length; i++) {
            const socket = this.sockets[i];
            if (socket.socketData?.id === id) {
                return socket;
            }
        }
        return null;
    }

    hasConnections() {
        if (this.sockets) {
            for (let i = 0; i < this.sockets.length; i++) {
                const entitySocket = this.sockets[i];
                if (Object.keys(entitySocket.connections).length > 0) {
                    return true;
                }
            }
        }
        return false;
    }
    
    hasConnectionToEntityId(entityId, ignoredSocket) {
        if (this.sockets) {
            for (let i = 0; i < this.sockets.length; i++) {
                const entitySocket = this.sockets[i];
                if ((!ignoredSocket || entitySocket !== ignoredSocket) && typeof entitySocket.connections[entityId] === 'number') {
                    return true;
                }
            }
        }
        return false;
    }
    
    hasConnectionToEntity = (connectingEntity, ignoredSocket) => this.hasConnectionToEntityId(connectingEntity.id, ignoredSocket);
    
    attemptReconnections(removeConnections = true, ignoreSelected = true, ignoreChecks = false) {
        if (removeConnections) {
            this.removeConnections(undefined, ignoreSelected, undefined, undefined, ignoreChecks);
        }
        for (const e2 of game.getEntities()) {
            if (e2 === this || !e2.sockets || (ignoreSelected && e2.selected) || Math.distanceBetween(this.mid ?? this, e2.mid ?? e2) > 1000) {
                continue;
            }
            for (const eSocket of this.sockets) {
                const eSocketPosition = game.app.cstage.toLocal({x: eSocket.x, y: eSocket.y}, this);
                for (const e2Socket of e2.sockets) {
                    const e2SocketPosition = game.app.cstage.toLocal({x: e2Socket.x, y: e2Socket.y}, e2);
                    if (eSocket.canConnect(e2Socket) && (!e2Socket.socketData.connectionLimit || Object.keys(e2Socket.connections).length < e2Socket.socketData.connectionLimit) && (Math.distanceBetween(eSocketPosition, e2SocketPosition) < 3)) {
                        let eSocketRotation = Math.angleNormalized((this.rotation + eSocket.rotation) - Math.PI);
                        let e2SocketRotation = Math.angleNormalized(e2.rotation + e2Socket.rotation);
                        if (this.building?.canSnapRotate || Math.abs(Math.angleNormalized(Math.angleDifference(eSocketRotation, e2SocketRotation))) < 0.0025) {
                            eSocket.setConnection(e2.id, e2Socket);
                        }
                    }
                }
            }
        }
    }
    
    forceReposition() {
        for (const eSocket of this.sockets) {
            for (const [connectedEntityId, connectedSocketId] of Object.entries(eSocket.connections)) {
                const connectedEntity = game.getEntityById(connectedEntityId);
                if (connectedEntity && connectedEntity.sockets) {
                    const e2Socket = connectedEntity.getSocketById(connectedSocketId);
                    if (e2Socket) {
                        const e2SocketPosition = game.app.cstage.toLocal(e2Socket, connectedEntity);
                        if (eSocket.socketData.id === 0) {
                            this.position.set(e2SocketPosition.x, e2SocketPosition.y);
                        } else if (eSocket.socketData.id === 1) {
                            const dist = Math.distanceBetween(this, e2SocketPosition);
                            const handle = this.getHandlePoint();
                            handle.x = dist;
                            this.rotation = Math.angleBetween(this, e2SocketPosition);
                            this.updateHandlePos();
                        }
                    }
                }
            }
        }
        this.regenerate();
    }

    recoverConnections(recoveredEntities = [this]) {
        for (const eSocket of this.sockets) {
            for (const [connectedEntityId, connectedSocketId] of Object.entries(eSocket.connections)) {
                const connectedEntity = game.getEntityById(connectedEntityId);
                if (connectedEntity && connectedEntity.sockets && !recoveredEntities.includes(connectedEntity)) {
                    const e2Socket = connectedEntity.getSocketById(connectedSocketId);
                    if (e2Socket) {
                        recoveredEntities.push(connectedEntity);

                        let connectedEntityPosition = game.app.cstage.toLocal({x: eSocket.x, y: eSocket.y}, this);
                        const connectedEntityRotation = Math.angleNormalized(-Math.angleDifference(this.rotation + eSocket.rotation + Math.PI, e2Socket.rotation));
                        if (e2Socket.x !== 0 || e2Socket.y !== 0) {
                            const e2SocketDist = Math.distanceBetween({ x: 0, y: 0 }, e2Socket);
                            const socketAngleDiff = Math.angleBetween({ x: 0, y: 0 }, e2Socket) + Math.PI;
                            connectedEntityPosition = Math.extendPoint(connectedEntityPosition, e2SocketDist, connectedEntityRotation + socketAngleDiff);
                        }

                        connectedEntity.position.set(connectedEntityPosition.x, connectedEntityPosition.y);
                        connectedEntity.rotation = connectedEntityRotation;

                        connectedEntity.recoverConnections(recoveredEntities);
                    }
                }
            }
        }
    }
    
    removeConnections(socketId, ignoreSelected, ignoreSocket, entityId, ignoreChecks) {
        if (this.sockets) {
            // Iterate sockets to make sure we either remove the connections and update the socket or remove the entity altogether.
            for (let i = 0; i < this.sockets.length; i++) {
                const entitySocket = this.sockets[i];
                if (typeof socketId !== 'number' || (ignoreSocket ? entitySocket.socketData.id !== socketId : entitySocket.socketData.id === socketId)) {
                    entitySocket.removeConnections(entityId, ignoreSelected, ignoreChecks);
                }
            }
        }
    }
    
    removeConnectionsToEntityId = (connectingEntityId) => this.removeConnections(undefined, undefined, undefined, connectingEntityId);
    
    removeConnectionsToEntity = (connectingEntity) => this.removeConnectionsToEntityId(connectingEntity.id);

    setProductionId(id, useBaseProduction = false) {
        const createProductionIcon = (icon) => {
            let productionIcon = new PIXI.Graphics();
            productionIcon.beginFill(COLOR_CHARCOAL);
            productionIcon.lineStyle(3, COLOR_GREEN);
            productionIcon.drawRect(-47, -47, 94, 94);
            productionIcon.endFill();

            productionIcon.icon = game.createSprite(icon);
            productionIcon.icon.anchor.set(0.5);
            productionIcon.icon.width = 84;
            productionIcon.icon.height = 84;
            productionIcon.addChild(productionIcon.icon);
            this.productionIcons.addChild(productionIcon);
            return productionIcon;
        }

        if (this.building?.production && !(this.baseProduction === useBaseProduction && this.selectedProduction === id)) {
            this.baseProduction = useBaseProduction;
            this.selectedProduction = id;
            if (game.getSelectedEntity() === this) {
                game.buildingSelectedMenuComponent?.updateProduction();
            }
            this.removeChild(this.productionIcons);
            if (typeof id === 'number') {
                this.productionIcons = new PIXI.Container();
                this.productionIcons.visible = game.project.settings.showProductionIcons;
                this.productionIcons.rotation = -this.rotation;
                const productionList = (this.baseProduction ? this.building.parent : this.building).production;
                for (let i = 0; i < productionList.length; i++) {
                    const production = productionList[i];
                    if (production.id === id) {
                        if (production.output) {
                            for (const resource of Object.keys(production.output)) {
                                createProductionIcon(window.objectData.resources[resource].icon);
                            }
                        }
                        if (this.building.power > 0 || production.power > 0) {
                            createProductionIcon('power_x128');
                        }
                        const productionIcons = this.productionIcons.children;
                        if (productionIcons.length) {
                            const productionIcon = productionIcons[0];
                            if (productionIcons.length > 1) {
                                productionIcon.x = -55;
                                productionIcons[1].x = 55;
                            } else if (this.sprite.width < 125 && this.sprite.height < 125) { // Small
                                productionIcon.width = 64;
                                productionIcon.height = 64;
                            } else if (this.sprite.width < 200 && this.sprite.height < 200) { // Medium
                                productionIcon.width = 80;
                                productionIcon.height = 80;
                            } else if (this.sprite.width > 280 && this.sprite.height > 280) { // Extra Large
                                productionIcon.width = 192;
                                productionIcon.height = 192;
                            } else {
                                productionIcon.width = 128;
                                productionIcon.height = 128;
                            }
                        }
                        break;
                    }
                }
                this.addChild(this.productionIcons);
            }
        }
    }
    
    setBaseUpgrade(tree, key = undefined) {
        this.baseUpgrades[tree] = key;
        this.assignRange(key && this.building.baseUpgrades[tree][key].range ? this.building.baseUpgrades[tree][key].range : this.building.range);
        if (this.selected) {
            game.buildingSelectedMenuComponent?.refresh();
        }
        game.refreshStats();
    }

    setMaintenanceFilters(filters) {
        this.maintenanceFilters = {
            range: filters?.range ?? this.building.maxRange,
            exclusions: filters?.exclusions ?? []
        }
        this.assignRange({
            type: 'preventDecay',
            max: this.maintenanceFilters.range
        });
    }

    getUnion() {
        if (this.union !== this) {
            this.union = this.union.getUnion();
        }
        return this.union;
    }
    
    getUnionEntities() {
        let union = this.getUnion(), unionEntities = [];
        for (let unionEntity of game.getEntities()) {
            if (unionEntity?.building?.canUnion && unionEntity.getUnion() === union) {
                unionEntities.push(unionEntity);
            }
        }
        return unionEntities;
    }
    
    setUnion(unionEntity) {
        if (unionEntity?.building?.canUnion) {
            let unionEntityA = this.getUnion(), unionEntityB = unionEntity.getUnion();
            if (unionEntityA === unionEntityB) {
                return;
            }
            if (unionEntityA.unionRank < unionEntityB.unionRank) {
                unionEntityA.union = unionEntityB;
            } else if (unionEntityA.unionRank > unionEntityB.unionRank) {
                unionEntityB.union = unionEntityA;
            } else {
                unionEntityB.union = unionEntityA;
                unionEntityA.unionRank++;
            }
            this.setSelectionColor(COLOR_LIGHTBLUE);
            unionEntity.setSelectionColor(COLOR_LIGHTBLUE);
        }
    }
    
    removeUnion() {
        this.union = this;
        this.setSelectionColor();
    }

    regenerate() {
        if (this.sprite) {
            if (this.sprite.rope) {
                this.sprite.removeChild(this.sprite.rope);
            }
            if (this.points.length >= 2) {
                const frontPoint = this.points[0], backPoint = this.points[this.points.length - 1];
                const updateTextureCap = (sprite, point, rotationOffset) => {
                    if (sprite) {
                        sprite.position.set(point.x, point.y);
                        sprite.rotation = point.rotation + rotationOffset;
                    }
                }
                if (this.building.trenchConnector) {
                    this.sprite.removeChild(this.sprite.trapezoid);

                    const floorHalfHeight = 51.65, floorTexturePadding = 100;
                    const frontPoint = this.points[0], endPoint = this.points[this.points.length - 1];
                    const frontPoint1 = { x: 0, y: -floorHalfHeight };
                    const frontPoint2 = { x: 0, y: floorHalfHeight };
                    const endPoint1 = Math.extendPoint(endPoint, floorHalfHeight, endPoint.rotation - Math.PI/2);
                    const endPoint2 = Math.extendPoint(endPoint, floorHalfHeight, endPoint.rotation + Math.PI/2);

                    const angle = Math.angleBetween({x: 0, y: 0}, endPoint);
                    this.sprite.trapezoid = new PIXI.Container();

                    const trapezoid = new PIXI.Polygon([
                        frontPoint1.x, frontPoint1.y,
                        frontPoint2.x, frontPoint2.y,
                        endPoint1.x, endPoint1.y,
                        endPoint2.x, endPoint2.y
                    ]);

                    const floorMask = new PIXI.Graphics();
                    floorMask.beginFill(0xFF3300);
                    floorMask.drawPolygon(trapezoid);
                    floorMask.endFill();
                    this.sprite.trapezoid.addChild(floorMask);

                    this.sprite.hitArea = trapezoid;

                    this.sprite.trapezoid.floor = new PIXI.TilingSprite(undefined, Math.distanceBetween(frontPoint, endPoint) + floorTexturePadding);
                    game.fetchTexture(this.sprite.trapezoid.floor, this.building.texture.src, (sprite, texture) => {
                        sprite.anchor.set((floorTexturePadding / texture.width) / 2, 0.5);
                    });
                    this.sprite.trapezoid.floor.mask = floorMask;
                    this.sprite.trapezoid.floor.rotation = angle;
                    this.sprite.trapezoid.addChild(this.sprite.trapezoid.floor);

                    const connectorTopBorder = new PIXI.TilingSprite(undefined, Math.distanceBetween(frontPoint1, endPoint2));
                    game.fetchTexture(connectorTopBorder, this.building.textureBorder, (sprite, texture) => {
                        sprite.height = texture.height;
                    });
                    connectorTopBorder.y = -floorHalfHeight;
                    connectorTopBorder.anchor.set(0, 0.5);
                    connectorTopBorder.rotation = Math.angleBetween(frontPoint1, endPoint2);
                    this.sprite.trapezoid.addChild(connectorTopBorder);

                    const connectorBottomBorder = new PIXI.TilingSprite(undefined, Math.distanceBetween(frontPoint2, endPoint1));
                    game.fetchTexture(connectorBottomBorder, this.building.textureBorder, (sprite, texture) => {
                        sprite.height = texture.height;
                    });
                    connectorBottomBorder.y = floorHalfHeight;
                    connectorBottomBorder.scale.y = -1;
                    connectorBottomBorder.anchor.set(0, 0.5);
                    connectorBottomBorder.rotation = Math.angleBetween(frontPoint2, endPoint1);
                    this.sprite.trapezoid.addChild(connectorBottomBorder);

                    this.sprite.addChild(this.sprite.trapezoid);

                    // TODO: Get the max rotation for a socket from the data.
                    const maxAngle = Math.deg2rad((15 * 3) + 1), angleBetweenPoints = Math.angleBetween(frontPoint, endPoint);
                    const limitReached = (this.building?.minLength && (Math.distanceBetween(frontPoint, endPoint) < (this.building.minLength * METER_BOARD_PIXEL_SIZE))) || ((Math.abs(angleBetweenPoints) > maxAngle) || (Math.abs(Math.angleNormalized(-angleBetweenPoints + endPoint.rotation + Math.PI)) > maxAngle));
                    if (limitReached) {
                        this.sprite.trapezoid.floor.tint = COLOR_RED;
                        connectorTopBorder.tint = COLOR_RED;
                        connectorBottomBorder.tint = COLOR_RED;
                    }

                    if (this.sockets) {
                        for (let i = 0; i < this.sockets.length; i++) {
                            let socket = this.sockets[i];
                            if (socket.socketData.cap === 'back') {
                                socket.position.set(endPoint.x, endPoint.y);
                                socket.rotation = endPoint.rotation - Math.PI/2;
                            }
                            socket.pointer.tint = limitReached ? COLOR_RED : COLOR_WHITE;
                        }
                    }
                } else if (this.building.key === 'barbedwirewallspline') {
                    const postExtension = (this.postExtension ?? 1) * METER_BOARD_PIXEL_SIZE;
                    const frontExtPoint = { x: postExtension, y: 0, rotation: 0 };
                    const backExtPoint = Math.extendPoint(backPoint, postExtension, backPoint.rotation);
                    backExtPoint.rotation = backPoint.rotation;

                    const midPoints = [];
                    const dist = Math.distanceBetween(frontExtPoint, backExtPoint);
                    const childSpacing = this.building.texturePostDist * METER_BOARD_PIXEL_SIZE;
                    if (dist > childSpacing) {
                        const numChildren = Math.floor(dist / childSpacing) - 1;
                        const dx = (backExtPoint.x - frontExtPoint.x) / (numChildren + 1);
                        const dy = (backExtPoint.y - frontExtPoint.y) / (numChildren + 1);

                        for (let i = 0; i < numChildren; i++) {
                            const childPoint = {
                                x: frontExtPoint.x + dx * (i + 1),
                                y: frontExtPoint.y + dy * (i + 1),
                                rotation: Math.angleBetween(frontExtPoint, backExtPoint)
                            };
                            midPoints.push(childPoint);
                        }
                    }

                    if (!this.posts) {
                        this.posts = new PIXI.Container;
                        this.sprite.addChild(this.posts);
                    }

                    this.posts.removeChildren();

                    const postRotation = Math.angleBetween(frontExtPoint, backExtPoint);
                    const createPost = (point, rotation = postRotation) => {
                        const post = game.createSprite(this.building.texturePost);
                        post.anchor.set(0.5);
                        this.posts.addChild(post);
                        if (point.rotation === undefined) {
                            point.rotation = rotation;
                        }
                        updateTextureCap(post, point, Math.PI);
                        return post;
                    }

                    const endPoints = [frontPoint, frontExtPoint, backExtPoint, backPoint];
                    for (const point of endPoints.concat(midPoints)) {
                        createPost(point);
                    }

                    const generatePoints = (points = [], startPoint, endPoint, numPoints, rotation = 0) => {
                        points.push(startPoint);
                        const xStep = (endPoint.x - startPoint.x) / (numPoints - 1);
                        const yStep = (endPoint.y - startPoint.y) / (numPoints - 1);
                        for (let i = 0; i < numPoints; i++) {
                            const point = {
                                x: startPoint.x + (xStep * i),
                                y: startPoint.y + (yStep * i)
                            }
                            if (i === (Math.ceil(numPoints / 2) - 1)) {
                                const dist = Math.distanceBetween(startPoint, endPoint);
                                if (dist > childSpacing) {
                                    createPost(point, rotation);
                                }
                            }
                            points.push(point);
                        }
                        points.push(endPoint);
                        return points;
                    }

                    const ropePoints = [];
                    generatePoints(ropePoints, frontPoint, frontExtPoint, 3);
                    generatePoints(ropePoints, backExtPoint, backPoint, 3, backPoint.rotation);
                    this.sprite.rope = new PIXI.SimpleRope(game.resources.white.texture, ropePoints, METER_INVERSE_PIXEL_SCALE);
                    game.fetchTexture(this.sprite.rope, this.building.texture.src);
                    this.sprite.addChild(this.sprite.rope);

                    if (this.sockets) {
                        for (const socket of this.sockets) {
                            if (socket.socketData.cap === 'back') {
                                socket.position.set(backPoint.x, backPoint.y);
                                socket.rotation = backPoint.rotation - Math.PI / 2;
                                break;
                            }
                        }
                    }
                } else {
                    let bezierPoints = [];
                    for (let i = 0; i < this.points.length; i++) {
                        let point = this.points[i];
                        
                        if (this.building?.simpleBezier) {
                            if (i < this.points.length - 1) {
                                bezierPoints.push({
                                    x: point.x,
                                    y: point.y
                                });

                                let point2 = this.points[i + 1];
                                if (point2) {
                                    let dist = Math.distanceBetween(point, point2) * 0.1;
                                    if (dist < 35) {
                                        dist = 35;
                                    }
                                    if (dist > 50) {
                                        dist = 50;
                                    }
                                    bezierPoints.push({
                                        x: point.x + dist,
                                        y: point.y
                                    });
                                    bezierPoints.push({
                                        x: point.x + dist,
                                        y: point.y
                                    });
                                    bezierPoints.push({
                                        x: point.x + dist,
                                        y: point.y
                                    });
                                }
                            } else {
                                let point1 = this.points[i - 1];
                                if (point1) {
                                    let dist = Math.distanceBetween(point, point1) * 0.1;
                                    if (dist < 35) {
                                        dist = 35;
                                    }
                                    if (dist > 50) {
                                        dist = 50;
                                    }
                                    bezierPoints.push({
                                        x: point.x + (Math.cos(point.rotation) * dist),
                                        y: point.y + (Math.sin(point.rotation) * dist)
                                    });
                                    bezierPoints.push({
                                        x: point.x + (Math.cos(point.rotation) * dist),
                                        y: point.y + (Math.sin(point.rotation) * dist)
                                    });
                                    bezierPoints.push({
                                        x: point.x + (Math.cos(point.rotation) * dist),
                                        y: point.y + (Math.sin(point.rotation) * dist)
                                    });
                                }

                                bezierPoints.push({
                                    x: point.x,
                                    y: point.y
                                });
                            }
                        } else {
                            if (i < this.points.length - 1) {
                                bezierPoints.push({
                                    x: point.x,
                                    y: point.y
                                });

                                let point2 = this.points[i + 1];
                                if (point2) {
                                    let dist = Math.distanceBetween(point, point2) * 0.4;
                                    bezierPoints.push({
                                        x: point.x + dist,
                                        y: point.y
                                    });
                                }
                            } else {
                                let point1 = this.points[i - 1];
                                if (point1) {
                                    let dist = Math.distanceBetween(point, point1) * 0.4;
                                    bezierPoints.push({
                                        x: point.x + (Math.cos(point.rotation) * dist),
                                        y: point.y + (Math.sin(point.rotation) * dist)
                                    });
                                }

                                bezierPoints.push({
                                    x: point.x,
                                    y: point.y
                                });
                            }
                        }
                    }
                    this.bezier = new Bezier(bezierPoints);
                    const lut = this.bezier.getLUT(Math.round(this.bezier.length()/16));
                    if (this.building.texture) {
                        this.sprite.rope = new PIXI.SimpleRope(game.resources.white.texture, lut, METER_INVERSE_PIXEL_SCALE);
                        game.fetchTexture(this.sprite.rope, this.building.texture.src, (sprite, texture) => {
                            texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
                        });
                        if (typeof this.building.color === 'number') {
                            this.sprite.rope.tint = this.building.color;
                        }
                        this.sprite.addChild(this.sprite.rope);
                    }
                    updateTextureCap(this.frontCap, frontPoint, Math.PI);
                    updateTextureCap(this.backCap, backPoint, Math.PI);
                    this.bezier.mid = this.bezier.get(0.5);
                    if (this.sockets) {
                        let midNormal = this.bezier.normal(this.bezier.mid.t);
                        let midAngle = Math.angleBetween({x: 0, y: 0}, midNormal) - Math.PI/2;
                        for (let i = 0; i < this.sockets.length; i++) {
                            let socket = this.sockets[i];
                            let socketPosition, socketRotation;
                            if (socket.socketData.cap === 'left' || socket.socketData.cap === 'right') {
                                socketRotation = midAngle + Math.deg2rad(socket.socketData.rotation);
                                socketPosition = Math.extendPoint(this.bezier.mid, 8, socketRotation - Math.PI/2);
                            }
                            switch (socket.socketData.cap) {
                                case 'left':
                                case 'right':
                                    socket.position.set(socketPosition.x, socketPosition.y);
                                    socket.rotation = socketRotation;
                                    break;
                                case 'back':
                                    socket.position.set(backPoint.x, backPoint.y);
                                    socket.rotation = backPoint.rotation - Math.PI/2;
                                    break;
                            }
                        }
                    }
                    if (this.building.hasOutline !== false) {
                        this.sprite.removeChild(this.sprite.outline);
                        this.sprite.outline = new PIXI.SimpleRope(game.resources.white.texture, lut, 1);
                        this.sprite.outline.visible = this.selected;
                        this.sprite.outline.tint = this.locked ? COLOR_RED : COLOR_ORANGE;
                        this.sprite.addChild(this.sprite.outline);
                    }
                }
                this.handleTick = true;
            }
        }
    }
}

class FoxholeLocomotive extends FoxholeStructure {
    constructor(id, type, subtype, x, y, z, rotation) {
        super(id, type, subtype, x, y, z, rotation);

        this.front_undercarriage = game.createObject('trainlrartillery_undercarriage', x + 284, y, undefined, 0, undefined, false);
        this.back_undercarriage = game.createObject('trainlrartillery_undercarriage', x - 284, y, undefined, Math.PI, undefined, false);
        
        this.front_undercarriage.car_linkage = this;
        this.back_undercarriage.car_linkage = this;

        const frontSocket = this.front_undercarriage.getSocketById(1);
        frontSocket.removeConnections = () => {};

        const backSocket = this.back_undercarriage.getSocketById(1);
        backSocket.removeConnections = () => {};

        frontSocket.setConnection(this.back_undercarriage.id, undefined, 1);
        backSocket.setConnection(this.front_undercarriage.id, undefined, 1);
        
        this.back_undercarriage.trackDirection *= -1;
    }

    tick() {
        super.tick();

        if (game.isMovingSelected() && this.selected) {
            let frontTrack, frontProj, backTrack, backProj;
            for (const entity of game.getEntities()) {
                if (entity.building?.key === 'rail_large_gauge' && Math.distanceBetween(entity.mid, this) < 1500) {
                    let pos = entity.toLocal({x: 284, y: 0}, this, undefined, true);
                    let projection = entity.bezier.project(pos);
                    if (projection.d <= 60) {
                        frontTrack = entity;
                        frontProj = projection;
                    }
                    pos = entity.toLocal({x: -284, y: 0}, this, undefined, true);
                    projection = entity.bezier.project(pos);
                    if (projection.d <= 60) {
                        backTrack = entity;
                        backProj = projection;
                    }
                }
                if (frontTrack && backTrack) {
                    let rotation = Math.angleNormalized(this.rotation), maxAngleDiff = Math.PI / 2;
                    this.front_undercarriage.currentTrack = frontTrack;
                    this.front_undercarriage.currentTrackT = frontProj.t;
                    if (!Math.anglesWithinRange(rotation, Math.angleNormalized(this.front_undercarriage.rotation), maxAngleDiff)) {
                        this.front_undercarriage.trackDirection *= -1;
                    }

                    this.back_undercarriage.currentTrack = backTrack;
                    this.back_undercarriage.currentTrackT = backProj.t;
                    if (!Math.anglesWithinRange(rotation, Math.angleNormalized(this.back_undercarriage.rotation - Math.PI), maxAngleDiff)) {
                        this.back_undercarriage.trackDirection *= -1;
                    }

                    if (!game.playMode) {
                        this.front_undercarriage.updatePosition();
                        this.back_undercarriage.updatePosition();
                    }
                    break;
                }
            }

            if (!frontTrack || !backTrack) {
                const frontPos = game.app.cstage.toLocal({x: 284, y: 0}, this, undefined, true);
                this.front_undercarriage.position.set(frontPos.x, frontPos.y);
                this.front_undercarriage.rotation = this.rotation;
                this.front_undercarriage.currentTrack = null;
                this.front_undercarriage.currentTrackT = null;
                this.front_undercarriage.removeConnections();

                const backPos = game.app.cstage.toLocal({x: -284, y: 0}, this, undefined, true);
                this.back_undercarriage.position.set(backPos.x, backPos.y);
                this.back_undercarriage.rotation = Math.angleNormalized(this.rotation + Math.PI);
                this.back_undercarriage.currentTrack = null;
                this.back_undercarriage.currentTrackT = null;
                this.back_undercarriage.removeConnections();
            }

            this.front_undercarriage.trackVelocity = 0;
            this.back_undercarriage.trackVelocity = 0;
        } else {
            let midPoint = Math.pointBetween(this.front_undercarriage, this.back_undercarriage);
            this.position.set(midPoint.x, midPoint.y);
            this.rotation = Math.angleNormalized(Math.angleBetween(midPoint, this.front_undercarriage));
        }
    }

    onRemove() {
        super.onRemove();

        this.front_undercarriage.remove();
        this.back_undercarriage.remove();
    }

    setUndercarriage(type, entity) {
        if (type === 'front') {
            this.front_undercarriage.remove();
            this.front_undercarriage = entity;
        } else if (type === 'back') {
            this.back_undercarriage.remove();
            this.back_undercarriage = entity;
        }
        const insideSocket = entity.getSocketById(1);
        insideSocket.removeConnections = () => {};
        entity.car_linkage = this;
    }
}

class FoxholeLocomotiveUndercarriage extends FoxholeStructure {
    constructor(id, type, subtype, x, y, z, rotation) {
        super(id, type, subtype, x, y, z, rotation);

        this.selectable = false;
    }

    tick(delta) {
        super.tick(delta);

        if (!this.car_linkage) {
            console.error('Tick occurred with no car linkage. Removing undercarriage.');
            this.remove();
        }
    }

    afterLoad(objData, objIdMap) {
        super.afterLoad(objData, objIdMap);

        if (objData.trainCarId) {
            const remappedEntityId = (objIdMap && typeof objIdMap[objData.trainCarId] === 'number') ? objIdMap[objData.trainCarId] : objData.trainCarId;
            const trainCar = game.getEntityById(remappedEntityId);
            if (trainCar?.building?.className === 'locomotive') {
                trainCar.setUndercarriage(objData.carriageType, this);
            } else {
                console.error('Loading failed to find train car. Removing undercarriage.');
                this.remove();
            }
        }
    }

    onSave(objData, isSelection) {
        super.onSave(objData, isSelection);
        
        if (this.car_linkage?.valid) {
            objData.trainCarId = this.car_linkage.id;
            objData.carriageType = this.car_linkage.front_undercarriage === this ? 'front' : 'back';
        }
    }

    updatePosition() {
        let normal = this.currentTrack.bezier.normal(this.currentTrackT);
        let angle = Math.angleBetween({x: 0, y: 0}, normal);
        if (this.trackDirection === -1) {
            angle += Math.PI;
        }
        this.rotation = Math.normalizeAngleRadians(this.currentTrack.rotation + (angle - Math.PI/2));
        this.moveAlongBezier(0);
    }
}

game.addDraggableType('building', FoxholeStructure);
game.addDraggableType('locomotive', FoxholeLocomotive);
game.addDraggableType('locomotive_undercarriage', FoxholeLocomotiveUndercarriage);