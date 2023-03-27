class DraggableContainer extends PIXI.Container {
    constructor(id, type, subtype, x, y, z, rotation) {
        super();
        
        this.id = id;
        this.type = type;
        this.subtype = subtype;
        this.valid = true;

        this.x = x;
        this.y = y;
        this.z = z;
        
        this.rotation = rotation ?? 0;

        this.mid = {
            x: this.x,
            y: this.y
        }

        this.lastX = x;
        this.lastY = y;
        this.lastRotation = rotation;
        
        this.dx = 0;
        this.dy = 0;
        this.drotation = 0;

        this.filterArea = game.app.screen;

        this.lights = [];

        this.selected = false;
        this.selectable = true;

        this.selectionArea = new PIXI.Graphics();
        this.selectionArea.visible = false;
        this.selectionArea.zIndex = 100;
        this.addChild(this.selectionArea);
        
        this.setSortLayer(this.type);

        this.points = [];
        this.handle = false;
    }

    tick(delta) {
        /*
        for (let i = 0; i < this.lights.length; i++) {
            let light = this.lights[i];
            light.tick();
        }

        this.dx = this.x - this.lastX;
        this.dy = this.y - this.lastY;
        this.drotation = this.rotation - this.lastRotation;
        */

        if (this.sprite) {
            this.visible = this.isVisible();
        }

        if (this.handleTick || this.visible) {
            if (this.sprite?.outline && this.sprite.outline.visible !== this.selected) {
                this.sprite.outline.visible = this.selected;
            }

            if (game.selectedHandlePoint && this.selected && !this.locked && this.hasHandle && game.isMouseDown(0)) {
                let gridSize = game.settings.gridSize ? game.settings.gridSize : 16;
                let gmpGrid = game.getGlobalMousePosition();
                if (!this.building?.ignoreSnapSettings && (game.settings.enableGrid || game.isKeyDown(16))) {
                    gmpGrid.x = Math.round(gmpGrid.x / gridSize) * gridSize;
                    gmpGrid.y = Math.round(gmpGrid.y / gridSize) * gridSize;
                }
                let mousePos = this.toLocal(gmpGrid, game.app.cstage, undefined, true);
                game.setPickupEntities(false);
                if (game.selectedHandlePoint.index === 0) {
                    this.x = gmpGrid.x;
                    this.y = gmpGrid.y;

                    if (!this.building?.ignoreSnapSettings && (game.settings.enableGrid || game.isKeyDown(16))) {
                        this.x = Math.round(this.x / gridSize) * gridSize;
                        this.y = Math.round(this.y / gridSize) * gridSize;
                    }
                } else if (this.type === 'shape' || this.building) {
                    if (game.isMouseDown(2) && this.building?.isBezier) {
                        let angle = Math.angleBetween(game.selectedHandlePoint, mousePos);
                        if (!this.building?.ignoreSnapSettings && game.settings.enableSnapRotation) {
                            let snapRotationDegrees = Math.deg2rad(game.settings.snapRotationDegrees ? game.settings.snapRotationDegrees : 15);
                            angle = Math.floor(angle / snapRotationDegrees) * snapRotationDegrees;
                        }
                        game.selectedHandlePoint.rotation = angle + Math.PI;
                    } else {
                        game.selectedHandlePoint.x = mousePos.x;
                        game.selectedHandlePoint.y = mousePos.y;
                    }

                    if (this.type === 'shape') {
                        if (this.subtype === 'line' || this.subtype === 'circle') {
                            let angle = Math.angleBetween(this, gmpGrid);
                            if (game.settings.enableSnapRotation) {
                                let snapRotationDegrees = Math.deg2rad(game.settings.snapRotationDegrees ? game.settings.snapRotationDegrees : 15);
                                angle = Math.round(angle / snapRotationDegrees) * snapRotationDegrees;
                            }
                            this.rotation = angle;
                            game.selectedHandlePoint.y = 0;
                        } else if (this.subtype === 'image' && this.shapeStyle?.maintainAspectRatio) {
                            const textureAspectRatio = this.sprite.texture.width / this.sprite.texture.height;
                            const pX = Math.abs(game.selectedHandlePoint.x), pY = Math.abs(game.selectedHandlePoint.y);
                            const pointsAspectRatio = pX / pY;
                            if (pointsAspectRatio > textureAspectRatio) {
                                game.selectedHandlePoint.x = Math.sign(game.selectedHandlePoint.x) * pY * textureAspectRatio;
                            } else {
                                game.selectedHandlePoint.y = Math.sign(game.selectedHandlePoint.y) * pX / textureAspectRatio;
                            }
                        }
                    }

                    if (this.building) {
                        if (!this.building.isBezier || Math.abs(game.selectedHandlePoint.y) < 25) {
                            if (!this.building.isBezier && (this.building.canSnapRotate || !this.hasConnections())) {
                                let angle = Math.angleBetween(this, gmpGrid);
                                if (!this.building.ignoreSnapSettings && game.settings.enableSnapRotation) {
                                    let snapRotationDegrees = Math.deg2rad(game.settings.snapRotationDegrees ? game.settings.snapRotationDegrees : 15);
                                    angle = Math.round(angle / snapRotationDegrees) * snapRotationDegrees;
                                }
                                this.rotation = angle;
                            }
                            game.selectedHandlePoint.y = 0;
                        }

                        if (!this.building.isBezier && this.building.minLength) {
                            const minLength = this.building.minLength * METER_BOARD_PIXEL_SIZE;
                            if (game.selectedHandlePoint.x < minLength) {
                                game.selectedHandlePoint.x = minLength;
                            }
                        }
                    }
                }

                if (this.sockets && !game.isMouseDown(2)) {
                    let handleSocket;
                    let connectionEstablished = false;
                    if (this.sockets) {
                        // TODO: Store this somewhere in sockets.
                        for (let i = 0; i < this.sockets.length; i++) {
                            const entitySocket = this.sockets[i];
                            if (entitySocket.socketData?.cap === 'back') {
                                handleSocket = entitySocket;
                                break;
                            }
                        }
                        this.removeConnections(0, false, true);
                    }
                    for (const entity2 of game.getEntities()) {
                        if (!entity2.visible || entity2 === this || entity2.type !== 'building' || !(this.sockets && entity2.sockets) || Math.distanceBetween(gmpGrid, entity2.mid) > 1000) {
                            continue;
                        }

                        if (entity2.sockets) {
                            if (this.building?.canSnapStructureType !== false || this.subtype !== entity2.subtype) {
                                const mousePos2 = entity2.toLocal(gmpGrid, game.app.cstage, undefined, true);
                                let nearestSocket, nearestSocketPos, nearestSocketDist = null;
                                for (let i = 0; i < entity2.sockets.length; i++) {
                                    const entitySocket = entity2.sockets[i];
                                    if (handleSocket.canConnect(entitySocket) && !entitySocket.socketData.temp) {
                                        const socketDistance = Math.distanceBetween(mousePos2, entitySocket);
                                        if ((socketDistance < 35 && (nearestSocketDist === null || socketDistance < nearestSocketDist)) || this.building?.snapGrab && entity2.canGrab()) {
                                            const entityConnections = Object.keys(entitySocket.connections).length;
                                            if (entitySocket.connections[this.id] === handleSocket.socketData.id || (!this.hasConnectionToEntity(entity2, handleSocket) && (entityConnections === 0 || (entitySocket.socketData.connectionLimit && entityConnections < entitySocket.socketData.connectionLimit)))) {
                                                nearestSocketPos = game.app.cstage.toLocal({x: entitySocket.x, y: entitySocket.y}, entity2, undefined, true);
                                                if (Math.floor(Math.distanceBetween(this, nearestSocketPos)) <= (this.building?.maxLength * METER_BOARD_PIXEL_SIZE)) {
                                                    nearestSocket = entitySocket;
                                                    nearestSocketDist = socketDistance;
                                                }
                                            }
                                        }
                                    }
                                }
                                if (nearestSocket) {
                                    if (this.building?.canSnapRotate) {
                                        this.rotation = Math.angleBetween(this, nearestSocketPos);
                                    }
                                    nearestSocketPos = this.toLocal(nearestSocketPos, game.app.cstage, undefined, true);
                                    const socketRotation = Math.angleNormalized(((entity2.rotation + nearestSocket.rotation) - this.rotation) - Math.deg2rad(handleSocket.socketData.rotation));
                                    // TODO: Only force rotate snap constraint whenever the first socket is connected, otherwise the entity should be able to rotate and attempt snapping.
                                    if (this.building?.canSnapRotate || Math.angleDifference(Math.angleNormalized(game.selectedHandlePoint.rotation), socketRotation) === 0 && Math.round(nearestSocketPos.y) === 0 || this.building?.isBezier || this.building?.trenchConnector) {
                                        handleSocket.setConnection(entity2.id, nearestSocket);
                                        game.selectedHandlePoint.x = nearestSocketPos.x;
                                        if (this.building?.isBezier) {
                                            game.selectedHandlePoint.y = nearestSocketPos.y;
                                            game.selectedHandlePoint.rotation = socketRotation;
                                        }
                                        connectionEstablished = true;
                                        break;
                                    }
                                }
                            }
                        }
                        
                        if (!connectionEstablished && !this.hasConnectionToEntity(entity2, handleSocket) && entity2.bezier && entity2.building?.isBezier && entity2.building?.canSnapAlongBezier && this.subtype === entity2.subtype) {
                            let selectedPointToEntity2Local = entity2.toLocal(game.selectedHandlePoint, this, undefined, true);
                            let projection = entity2.bezier.project(selectedPointToEntity2Local);
                            if (projection.d <= (entity2.building?.lineWidth ?? 25) && (!this.building?.maxLength || Math.distanceBetween(this, gmpGrid) <= this.building.maxLength * METER_BOARD_PIXEL_SIZE)) {
                                let local = this.toLocal({x: projection.x, y: projection.y}, entity2, undefined, true);
                                let normal = entity2.bezier.normal(projection.t);
                                let angle = Math.angleBetween({x: 0, y: 0}, normal);
                                game.selectedHandlePoint.x = local.x;
                                game.selectedHandlePoint.y = local.y;

                                let currentRot = this.rotation + game.selectedHandlePoint.rotation;
                                let angleRight = entity2.rotation + (angle - Math.PI/2) - Math.PI/2;
                                let angleLeft = entity2.rotation + (angle + Math.PI/2) - Math.PI/2;
                                let rightDiff = Math.angleNormalized(angleRight - currentRot);
                                let leftDiff = Math.angleNormalized(angleLeft - currentRot);

                                // TODO: Handle saving previous rotations of snapped handles as well.

                                if (rightDiff < leftDiff) {
                                    game.selectedHandlePoint.rotation = (angleRight + Math.PI/2) - this.rotation;
                                } else {
                                    game.selectedHandlePoint.rotation = (angleLeft + Math.PI/2) - this.rotation;
                                }

                                if (handleSocket && (this.subtype === 'rail_large_gauge' || this.subtype === 'rail_small_gauge')) {
                                    handleSocket.createConnection(entity2, projection.x, projection.y, angle + Math.PI);
                                }

                                connectionEstablished = true;
                                break;
                            }
                        }
                    }
                    if (handleSocket && !connectionEstablished) {
                        handleSocket.removeConnections();
                    }
                }

                const MIN_SEGMENT_DISTANCE = this.building?.minLength * METER_BOARD_PIXEL_SIZE;
                const MAX_SEGMENT_DISTANCE = this.building?.maxLength * METER_BOARD_PIXEL_SIZE;
                let dist = Math.distanceBetween({x: 0, y: 0}, game.selectedHandlePoint);
                if (game.selectedHandlePoint.index === 1) {
                    let angle = Math.angleBetween({x: 0, y: 0}, game.selectedHandlePoint);
                    if (dist > MAX_SEGMENT_DISTANCE) {
                        dist = MAX_SEGMENT_DISTANCE;
                    }
                    game.selectedHandlePoint.x = Math.cos(angle) * dist;
                    game.selectedHandlePoint.y = Math.sin(angle) * dist;
                }
                
                this.regenerate();
                if (this.building?.isBezier && this.sprite?.rope) {
                    if (this.building.simpleBezier) {
                        if (dist < 3*METER_BOARD_PIXEL_SIZE) {
                            this.sprite.rope.tint = COLOR_RED;
                        } else {
                            this.sprite.rope.tint = COLOR_WHITE;
                        }
                    } else {
                        let curve1 = this.bezier.curvature(0.25);
                        let curve2 = this.bezier.curvature(0.5);
                        let curve3 = this.bezier.curvature(0.75);
                        if (dist < MIN_SEGMENT_DISTANCE || (curve1.r !== 0 && (Math.abs(curve1.r) < 100 || Math.abs(curve2.r) < 200 || Math.abs(curve3.r) < 100)) || game.selectedHandlePoint.x < 0) {
                            this.sprite.rope.tint = COLOR_RED;
                        } else {
                            this.sprite.rope.tint = COLOR_WHITE;
                        }
                    }
                }

                if (game.selectedHandlePoint.handle) {
                    game.selectedHandlePoint.handle.position.x = game.selectedHandlePoint.x;
                    game.selectedHandlePoint.handle.position.y = game.selectedHandlePoint.y;
                }
            }

            if (this.handleTick || this.lastRotation !== this.rotation) {
                if (this.productionIcons) {
                    this.productionIcons.rotation = -this.rotation;
                }

                if (this.sockets) {
                    for (let i = 0; i < this.sockets.length; i++) {
                        let socket = this.sockets[i];
                        if (socket.socketData.name === 'power') {
                            socket.pointer.rotation = -(this.rotation + socket.rotation);
                        }
                    }
                }

                if (game.getSelectedEntities().length === 1) {
                    game.updateSelectedBuildingMenu();
                }
            }

            if (!game.isMovingSelected() && this.selected && !this.selectionArea.visible) {
                this.selectionArea.visible = true;
            }
        }

        if (this.handleTick || this.lastX !== this.x || this.lastY !== this.y || this.lastRotation !== this.rotation) {
            this.lastX = this.x;
            this.lastY = this.y;
            this.lastRotation = this.rotation;
            this.handleTick = false;

            let mid;
            if (this.bezier) {
                mid = this.bezier.mid;
            } else if (this.points && (this.building?.isBezier || this.building?.trenchConnector || (this.type === 'shape' && (this.subtype === 'rectangle' || this.subtype === 'image' || this.subtype === 'line')))) {
                mid = {
                    x: (this.points[0].x + this.points[this.points.length - 1].x) / 2,
                    y: (this.points[0].y + this.points[this.points.length - 1].y) / 2
                };
            }

            if (mid) {
                this.mid = Math.rotateAround(this, {
                    x: this.x + mid.x,
                    y: this.y + mid.y
                });
            } else {
                this.mid = {
                    x: this.x,
                    y: this.y
                };
            }
        }
    }
    
    qualityChanged() {}
    
    soundPlay(data) {
        if (data && data.sound && game.sounds[data.sound]) {
            game.soundPlay(game.sounds[data.sound], this, data.volume);
        }
    }
    
    getZIndex() {
        return -this.sortOffset - ((game.settings.bringSelectedToFront && this.selected && !this.following) ? game.constructionLayers.selected : 0);
    }
    
    changeZLevel(newZ) {
        this.z = newZ;
    }

    setSortLayer(layer) {
        this.sortLayer = layer;
        this.sortOffset = game.constructionLayers[layer];
    }

    bringToFront() {
        let maxOffset = 0;
        for (const e2 of game.getEntities()) {
            if (!e2.selected && e2 !== this && e2.sortLayer === this.sortLayer) {
                maxOffset = Math.max(maxOffset, e2.sortOffset);
            }
        }
        if (maxOffset) {
            this.sortOffset = maxOffset + 1;
        }
    }

    isVisible() {
        return this.z === game.camera.z && game.isOnScreen(this);
    }
    
    onSelect() {
        this.selected = true;
        this.selectionArea.tint = this.locked ? COLOR_RED : COLOR_WHITE;
        this.selectionArea.visible = true;

        this.updateOverlays();

        if (this.sprite?.outline) {
            this.sprite.outline.tint = this.locked ? COLOR_RED : COLOR_ORANGE;
        }

        if (this.hasHandle) {
            this.updateHandles();
        }

        if (game.isKeyDown(16) && this.union) {
            for (const unionEntity of this.getUnionEntities()) {
                game.addSelectedEntity(unionEntity);
            }
        }
    }

    onDeselect() {
        this.selected = false;
        this.selectionArea.visible = false;
        delete this.prevPosition;
        delete this.prevRotation;

        this.updateOverlays();

        if (this.building || this.type === 'shape') {
            if (this.building) {
                if (this.bezier && this.bezier.length() <= this.building.minLength) {
                    this.remove();
                } else if (this.building.requireConnection) {
                    // Requires all sockets have at least one connection. Mainly for power lines.
                    for (let i = 0; i < this.sockets.length; i++) {
                        const socket = this.sockets[i];
                        if (Object.keys(socket.connections).length === 0) {
                            this.remove();
                            break;
                        }
                    }
                }
            } else if (this.type === 'shape' && this.points && Math.distanceBetween(this.points[0], this.points[this.points.length - 1]) < (this.subtype === 'circle' ? 16 : 32)) {
                this.remove();
                return;
            }
            this.updateHandles();
        } else if (this.type === 'text' && this.label.text.length === 0) {
            this.remove();
        }

        if (game.isKeyDown(16) && this.union) {
            for (const unionEntity of this.getUnionEntities()) {
                game.removeSelectedEntity(unionEntity);
            }
        }
    }

    canGrab(ignoreMouse) {
        const gmp = game.getGlobalMousePosition();
        const boundsBuffer = 16, boundsPadding = boundsBuffer / 2;
        const immovable = game.settings.disableLockedMouseEvents && this.locked;
        if (ignoreMouse || immovable) {
            return !immovable;
        }
        if (this.building?.radius || (this.type === 'shape' && this.subtype === 'circle')) {
            const centerDist = Math.distanceBetween(this, gmp);
            if (this.building?.radius) {
                if (centerDist < (this.building.radius * METER_BOARD_PIXEL_SIZE)) {
                    return true;
                }
            } else if ((centerDist < ((this.sprite.width/2) + boundsPadding)) && (!this.shapeStyle?.border || (centerDist > (((this.sprite.width/2) - this.shapeStyle?.lineWidth) - boundsPadding)))) {
                return true;
            }
        } else {
            let bounds = this.getBounds(true);
            let boundsAdjustedPos = game.app.cstage.toLocal({x: bounds.x, y: bounds.y}, game.app.stage, undefined, true);
            bounds.x = boundsAdjustedPos.x - boundsBuffer;
            bounds.y = boundsAdjustedPos.y - boundsBuffer;
            bounds.width /= game.camera.zoom;
            bounds.height /= game.camera.zoom;
            bounds.bufferWidth = bounds.width + (boundsBuffer * 2);
            bounds.bufferHeight = bounds.height + (boundsBuffer * 2);

            if (gmp.x >= bounds.x && gmp.x <= bounds.x + bounds.bufferWidth && gmp.y >= bounds.y && gmp.y <= bounds.y + bounds.bufferHeight) {
                // TODO: Add padding around sprite so that it's easier to select.
                // Will need to check for entity.building?.isBezier and entity.bezier when that happens.
                const mousePos = this.toLocal(gmp, game.app.cstage, undefined, true);
                if (this.bezier) {
                    let projection = this.bezier.project(mousePos);
                    if (projection.d <= (this.building?.lineWidth ?? 25)) {
                        return true;
                    }
                } else {
                    if (this.sprite?.hitArea) {
                        return this.sprite.hitArea.contains(mousePos.x, mousePos.y);
                    }

                    // https://stackoverflow.com/a/67732811 <3
                    let w = this.selectionArea.width / 2;
                    let h = this.selectionArea.height / 2;
                    const r = this.rotation;

                    const lineThickness = this.shapeStyle?.lineWidth ? this.shapeStyle.lineWidth / 2 : 0;

                    const [ax, ay] = [Math.cos(r), Math.sin(r)];
                    const t = (x, y) => ({x: x * ax - y * ay + this.x, y: x * ay + y * ax + this.y});
                    let bBounds;
                    if ((this.type === 'shape' || this.building?.isBezier) && this.points) {
                        let p1, p2, m1, m2;
                        for (let i = 0; i < this.points.length; i++) {
                            let point = this.points[i];
                            if (point.index === 0) {
                                p1 = point;
                            } else if (point.index === 1) {
                                p2 = point;
                            }
                        }
                        if (this.building?.isBezier) {
                            const postExtension = (this.postExtension ?? 1) * METER_BOARD_PIXEL_SIZE;
                            const line = [p1, Math.extendPoint(p1, postExtension, 0), Math.extendPoint(p2, postExtension, p2.rotation), p2];
                            for (let i = 0; i < line.length - 1; i++) {
                                if (Math.distanceToLine(mousePos, line[i], line[i+1]) < 16) {
                                    return true;
                                }
                            }
                            return false;
                        } else if (this.subtype === 'line') {
                            m1 = {
                                x: p1.x - lineThickness - boundsPadding,
                                y: p1.y - lineThickness - boundsPadding
                            };
                            m2 = {
                                x: p2.x + lineThickness + boundsPadding,
                                y: p2.y + lineThickness + boundsPadding
                            };
                        } else {
                            const borderPadding = (this.shapeStyle.border ? lineThickness : 0) + boundsPadding;
                            m1 = {
                                x: p1.x + (p2.x < p1.x ? borderPadding : -borderPadding),
                                y: p1.y + (p2.y < p1.y ? borderPadding : -borderPadding)
                            };
                            m2 = {
                                x: p2.x + (p1.x < p2.x ? borderPadding : -borderPadding),
                                y: p2.y + (p1.y < p2.y ? borderPadding : -borderPadding)
                            };
                        }
                        bBounds = [t(m2.x, m2.y), t(m1.x, m2.y), t(m1.x, m1.y), t(m2.x, m1.y)];
                    } else {
                        bBounds = [t(w, h), t(-w, h), t(-w, -h), t(w, -h)];
                    }
                    return Math.isPointWithinBounds(gmp, bBounds, (this.subtype === 'rectangle' && this.shapeStyle.border ? (lineThickness + boundsPadding) * 2 : undefined));
                }
            }
        }
        return false;
    }

    onLoad(objData) {
        if (typeof objData.sortOffset === 'number') {
            this.sortOffset = game.constructionLayers[this.sortLayer] + objData.sortOffset;
        }

        if (objData.properties) {
            this.properties = Object.assign({}, this.properties, objData.properties);
        }

        if (this.hasHandle && (objData.handlePoint || objData.handlePoints || objData.railPoints)) {
            for (const point of this.points) {
                this.removeChild(point.handle);
            }
            this.points = [];
            if (objData.handlePoint) {
                this.addPoint(0, 0);
                this.addPoint(objData.handlePoint.x, objData.handlePoint.y, undefined, objData.handlePoint.rotation);
            } else {
                for (const point of (objData.handlePoints ?? objData.railPoints)) {
                    this.addPoint(point.x, point.y, undefined, point.rotation);
                }
            }
            this.regenerate();
        }
    }

    onSave(objData) {
        objData.sortOffset = this.sortOffset - game.constructionLayers[this.sortLayer];

        if (this.properties) {
            objData.properties = Object.assign({}, this.properties);
        }

        if (this.hasHandle) {
            if (this.points.length <= 2) {
                const lastPoint = this.points[this.points.length - 1];
                objData.handlePoint = {
                    x: lastPoint.x || undefined,
                    y: lastPoint.y || undefined,
                    rotation: lastPoint.rotation !== Math.PI ? lastPoint.rotation : undefined
                };
            } else {
                objData.handlePoints = [];
                for (const point of this.points) {
                    objData.handlePoints.push({
                        x: point.x || undefined,
                        y: point.y || undefined,
                        rotation: point.rotation !== Math.PI ? point.rotation : undefined
                    });
                }
            }
        }
    }

    afterLoad() {}

    onRemove() {
        if (this.selected) {
            game.removeSelectedEntity(this);
        }
        if (this.following) {
            game.followEntity(null);
        }
        if (this.sound) {
            game.soundStop(this.sound);
            this.sound = null;
        }
    }

    afterRemove() {}
    
    createLight(color, minBrightness, maxBrightness, duration) {
        return game.createLight(this, color, minBrightness, maxBrightness, duration);
    }
    
    remove() {
        this.valid = false;
        this.onRemove();
        game.app.cstage.removeChild(this);
    }
    
    regenerate() {}

    updateHandles() {
        for (let i = 0; i < this.points.length; i++) {
            let point = this.points[i];
            if (point.handle) {
                point.handle.visible = this.selected;
                if (point.handle.visible) {
                    point.handle.tint = this.locked ? COLOR_RED : (point.index === 0 ? COLOR_ORANGE : COLOR_WHITE);
                }
            }
        }
    }
    
    grabHandlePoint() {
        if (this.selected && this.hasHandle) {
            if (this.shouldSelectLastHandlePoint) {
                this.shouldSelectLastHandlePoint = false;
                game.setMouseDown(0);
                game.selectedHandlePoint = this.points[1];
                return true;
            } else {
                let mousePos = this.toLocal(game.getGlobalMousePosition(), game.app.cstage, undefined, true);
                for (let i = 1; i < this.points.length; i++) {
                    let point = this.points[i];
                    if (Math.distanceBetween(mousePos, point) < 20) {
                        game.selectEntity(this);
                        game.selectedHandlePoint = point;
                        return true;
                    }
                }
            }
        }
        return false;
    }

    addHandle(x, y) {
        if (!this.hasHandle) {
            this.hasHandle = true;
            this.addPoint(0, 0);
            this.addPoint(x, y);
            if (this.shapeStyle) {
                this.setShapeStyle(this.shapeStyle);
            }
        }
    }
    
    addPoint(x = 0, y = 0, index = this.points.length, rotation = Math.PI) {
        let newPoint = {
            index: index,
            points: 0,
            x: x,
            y: y,
            rotation: rotation
        };
        this.points.splice(index, 0, newPoint);

        let handle = new PIXI.Sprite(game.resources.white.texture);
        handle.anchor.set(0.5);
        handle.visible = this.selected;
        handle.zIndex = 50;
        handle.width = 16;
        handle.height = 16;
        handle.position.x = newPoint.x;
        handle.position.y = newPoint.y;
        this.addChild(handle);
        newPoint.handle = handle;

        if (index === 0) {
            handle.tint = COLOR_ORANGE;
        }

        this.regenerate();
        return newPoint;
    }
    
    flipPoints(vertical = false) {
        let backPoint = this.points[this.points.length - 1];
        let dist;
        if (!vertical) {
            dist = backPoint.x;
            backPoint.x = -dist;
            backPoint.handle.x = backPoint.x;
        } else {
            dist = backPoint.y;
            backPoint.y = -dist;
            backPoint.handle.y = backPoint.y;
        }
        let position = Math.extendPoint(this, dist, !vertical ? this.rotation : this.rotation + Math.PI/2);
        this.x = position.x;
        this.y = position.y;
        this.regenerate();
    }

    // TODO: Clean up / combine these two functions.
    setSelectionColor(color) {
        const width = this.building?.width ? this.building.width * METER_BOARD_PIXEL_SIZE : this.sprite?.width ?? 0;
        const height = this.building?.length ? this.building.length * METER_BOARD_PIXEL_SIZE : this.sprite?.height ?? 0;
        this.setSelectionSize(width, height, color);
    }
    
    setSelectionSize(width, height, color = COLOR_ORANGE) {
        const borderWidth = 6;
        this.selectionArea.clear();
        this.selectionArea.lineStyle(borderWidth, color);
        if (this.building?.radius) {
            this.selectionArea.drawCircle(0, 0, this.building.radius * METER_BOARD_PIXEL_SIZE);
        } else if (this.building?.hitArea && (game.settings.enableDebug || this.building.hitArea?.length === 1)) {
            if (game.settings.enableDebug) {
                for (const poly of this.building.hitArea) {
                    this.selectionArea.drawPolygon(new PIXI.Polygon(poly.shape));
                }
            } else {
                this.selectionArea.drawPolygon(new PIXI.Polygon(this.building.hitArea[0].shape));
            }
        } else {
            this.selectionArea.drawRect(-(width/2)-borderWidth, -(height/2)-borderWidth, width+(borderWidth*2), height+(borderWidth*2));
        }
    }
    
    updateOverlays() {
        if (this.productionIcons) {
            this.productionIcons.visible = game.projectSettings.showProductionIcons;
        }
        if (this.rangeSprite) {
            const showWhenSelected = game.projectSettings.showRangeWhenSelected && this.selected;
            const rangeType = this.building?.range?.type || (this.baseUpgrades?.base && this.building.baseUpgrades.base[this.baseUpgrades.base].range?.type) || (this.maintenanceFilters && 'preventDecay');
            this.rangeSprite.visible = showWhenSelected || (rangeType && game.projectSettings.ranges[rangeType]);
            this.updateRangeMask();
        }
    }
}

class DraggableText extends DraggableContainer {
    constructor(id, type, subtype, x, y, z, rotation) {
        super(id, type, subtype, x, y, z, rotation);

        this.labelStyle = Object.assign({}, game.settings.styles.label, DEFAULT_TEXT_STYLE);
        this.label = new PIXI.Text('', this.labelStyle);
        this.label.anchor.set(0.5);
        this.setSelectionSize(this.label.width, this.label.height);
        this.addChild(this.label);
    }
    
    isVisible() {
        return true;
    }
    
    setLabel(text) {
        if (this.label.text !== text) {
            this.label.text = text;
            this.setSelectionSize(this.label.width, this.label.height);
        }
    }
    
    setLabelStyle(style) {
        this.labelStyle = style;
        this.label.style = style;
        this.setSelectionSize(this.label.width, this.label.height);
    }
    
    onSave(objData) {
        super.onSave(objData);

        objData.sortOffset = this.sortOffset - game.constructionLayers[this.sortLayer];
        objData.label = this.label.text;
        for (const[key, value] of Object.entries(this.labelStyle)) {
            if (!(key in DEFAULT_TEXT_STYLE) && value !== game.defaultSettings.styles.label[key]) {
                if (!objData.labelStyle) {
                    objData.labelStyle = {};
                }
                objData.labelStyle[key] = value;
            }
        }
    }
    
    onLoad(objData) {
        super.onLoad(objData);

        if (typeof objData.sortOffset === 'number') {
            this.sortOffset += objData.sortOffset;
        }
        this.label.text = objData.label;
        Object.assign(this.labelStyle, game.defaultSettings.styles.label, objData.labelStyle);
        this.setLabelStyle(this.labelStyle);
    }
}

class DraggableShape extends DraggableContainer {
    constructor(id, type, subtype, x, y, z, rotation) {
        super(id, type, subtype, x, y, z, rotation);

        if (gameData.buildings[subtype]) {
            this.metaData = Object.assign({}, gameData.buildings[subtype]);
            this.subtype = this.metaData.subtype;
        }

        if (this.subtype !== 'image') {
            this.sprite = new PIXI.Graphics();
            this.addChild(this.sprite);
        }
        this.shapeStyle = Object.assign({}, this.subtype === 'line' ? game.settings.styles.line : (this.subtype === 'circle' ? game.settings.styles.circle : game.settings.styles.rectangle));

        this.selectionArea.clear();

        super.addHandle();

        if (this.metaData?.texture) {
            this.loadImage(game.resources[this.metaData.texture].texture, true);
        }
    }
    
    isVisible() {
        return true;
    }

    onSave(objData) {
        super.onSave(objData);

        if (this.subtype === 'image') {
            objData.textureData = this.textureData;
        }
        const defaultSettings = game.defaultSettings.styles[this.subtype];
        for (const[key, value] of Object.entries(this.shapeStyle)) {
            if (!defaultSettings || value !== defaultSettings[key]) {
                if (!objData.shapeStyle) {
                    objData.shapeStyle = {};
                }
                objData.shapeStyle[key] = value;
            }
        }
    }

    onLoad(objData) {
        super.onLoad(objData);

        if (objData.textureData) {
            this.textureData = objData.textureData;
            const loader = new PIXI.Loader();
            loader.add(this.textureData);
            loader.load(() => {
                this.loadImage(loader.resources[this.textureData].texture, objData.imported);
            });
            loader.onError.add((error, resource) => {
                console.error('Failed to load image:', error.message);
                this.remove();
                return;
            });
        }
        Object.assign(this.shapeStyle, game.defaultSettings.styles[this.subtype], objData.shapeStyle);
        this.setShapeStyle(this.shapeStyle);
    }

    loadImage(texture, imported) {
        this.removeChild(this.sprite);
        this.sprite = new PIXI.Sprite();
        this.addChild(this.sprite);
        this.sprite.texture = texture;
        if (imported) {
            this.x -= texture.width / 2;
            this.y -= texture.height / 2;

            let handlePoint = this.points[this.points.length - 1];
            handlePoint.x = texture.width;
            handlePoint.y = texture.height;
            if (handlePoint.handle) {
                handlePoint.handle.position.x = handlePoint.x;
                handlePoint.handle.position.y = handlePoint.y;
            }
        }
        this.regenerate();
    }

    setShapeStyle(style) {
        if (this.subtype === 'image') {
            let sortLayer = style.sendToBackground ? 'background' : this.type;
            if (this.sortLayer !== sortLayer) {
                let sortOffset = this.sortOffset - game.constructionLayers[this.sortLayer];
                this.sortLayer = sortLayer;
                this.sortOffset = game.constructionLayers[this.sortLayer] + sortOffset;
            }
        }
        this.shapeStyle = style;
        if (this.subtype === 'line') {
            const updateArrow = (sprite, visible) => {
                if (visible) {
                    if (!sprite) {
                        sprite = new PIXI.Sprite(game.resources.point.texture);
                        sprite.anchor.set(0.5, 0);
                        this.sprite.addChild(sprite);
                    }
                    sprite.width = this.shapeStyle.lineWidth * 6;
                    sprite.height = this.shapeStyle.lineWidth * 6;
                    sprite.tint = this.shapeStyle.fillColor;
                    return sprite;
                } else {
                    this.sprite.removeChild(sprite);
                }
                return null;
            }

            this.frontCap = updateArrow(this.frontCap, this.shapeStyle.frontArrow);
            this.backCap = updateArrow(this.backCap, this.shapeStyle.backArrow);
            this.updateHandles();
        }
        this.regenerate();
    }

    regenerate() {
        if (this.sprite) {
            const frontPoint = this.points[0], backPoint = this.points[this.points.length - 1];
            const updateTextureCap = (sprite, point, rotationOffset) => {
                if (sprite) {
                    sprite.position.set(point.x, point.y);
                    sprite.rotation = point.rotation + rotationOffset;
                }
            }
            this.sprite.alpha = this.shapeStyle.alpha;
            if (this.subtype === 'image') {
                this.sprite.scale.set(backPoint.x / this.sprite.texture.width, backPoint.y / this.sprite.texture.height);
            } else {
                this.sprite.clear();
                if (this.subtype === 'line') {
                    // TODO: The offset for arrows will have to be calculated based on rotation / angle here.
                    // TODO: Update selecting lines with multiple points. It's completely borked for more than 2 points.
                    const line = this.sprite.lineStyle(this.shapeStyle.lineWidth, this.shapeStyle.fillColor).moveTo((this.shapeStyle.frontArrow ? this.shapeStyle.lineWidth * 1.875 : 0), 0);
                    let lastPoint = this.points[0];
                    for (let i = 1; i < this.points.length; i++) {
                        let point = this.points[i];
                        lastPoint = this.points[i - 1];
                        line.lineTo(point.x - ((this.shapeStyle.backArrow && i === this.points.length - 1) ? this.shapeStyle.lineWidth * 1.875 : 0), point.y);
                    }
                    updateTextureCap(this.frontCap, frontPoint, Math.PI/2);
                    updateTextureCap(this.backCap, backPoint, Math.angleBetween(lastPoint, backPoint) - Math.PI/2);
                } else if (this.shapeStyle.border) {
                    this.sprite.lineStyle(this.shapeStyle.lineWidth, this.shapeStyle.fillColor, 1);
                } else {
                    this.sprite.beginFill(this.shapeStyle.fillColor);
                }
                if (this.subtype === 'rectangle') {
                    const p1 = { x: backPoint.x < 0 ? backPoint.x : 0, y: backPoint.y < 0 ? backPoint.y : 0 };
                    const w = backPoint.x > 0 ? backPoint.x : -backPoint.x;
                    const h = backPoint.y > 0 ? backPoint.y : -backPoint.y;
                    this.sprite.drawRect(p1.x, p1.y, w, h);
                } else if (this.subtype === 'circle') {
                    this.sprite.drawCircle(0, 0, backPoint.x);
                }
                this.sprite.endFill();
            }
            this.handleTick = true;
        }
    }
}