const game_asset_dir = '/games/foxhole/assets/';
let texture_asset_path = game_asset_dir + 'game/Textures/';
let preset_asset_path = game_asset_dir + 'presets/';
function assetDir(str, dir = texture_asset_path) {
    const index = str.indexOf('../');
    if (index === -1) {
        return str;
    }
    return str.substring(0, index) + dir + str.substring(index + 3);
}

const game_asset_keys = ['baseIcon', 'icon', 'texture', 'textureBorder', 'textureFrontCap', 'textureBackCap', 'texturePost'];
const game_asset_required = {
    trackswitch_active: assetDir('../Structures/trackswitch_active.webp'),
    trackswitch_inactive: assetDir('../Structures/trackswitch_inactive.webp')
};
const game_asset_list = {};

(function() {
    window.objectData = {
        "categories": gameData.categories,
        "tech": gameData.tech,
        "resources": gameData.resources,
        "buildings": gameData.buildings
    };

    for (const building of Object.values(window.objectData.buildings)) {
        if (building.parentKey) {
            let currParent = window.objectData.buildings[building.parentKey];
            const parentData = [currParent];
            while (currParent?.parentKey) {
                currParent = window.objectData.buildings[currParent.parentKey];
                parentData.push(currParent);
            }
            
            let buildingCost;
            for (const parent of parentData) {
                if (parent.cost) {
                    if (!buildingCost) {
                        buildingCost = Object.assign({}, building.cost);
                    }
                    for (const [resource, amount] of Object.entries(parent.upgradeCost ?? parent.cost)) {
                        buildingCost[resource] = (buildingCost[resource] ?? 0) + amount;
                    }
                }
            }
            if (buildingCost) {
                building.upgradeCost = building.cost;
                building.cost = buildingCost;
            }

            parentData.push(Object.assign({
                tierUp: undefined,
                tierDown: undefined
            }, building));
            Object.assign(building, ...parentData);
            building.parent = window.objectData.buildings[building.parentKey];
        }
        if (building.baseGarrisonRadius) {
            const garrisonData = {
                baseUpgrades: {
                    'base': {
                        'provisional_garrison': {
                            name: 'Provisional Garrison',
                            description: 'A Provisional Garrison connects this base to nearby defensive structures. Defensive structures will deactivate if player activity is too low. This also allows Towns to be claimed towards the victory condition.',
                            icon: assetDir('../UI/Menus/IconFacilitiesProvisionalGarrison.webp'),
                            range: {
                                type: 'garrison',
                                max: building.baseGarrisonRadius
                            }
                        },
                        'small_garrison': {
                            name: 'Small Garrison',
                            description: 'A Small Garrison permanently connects this base to nearby defensive structures. A Small Garrison is required for upgrading the base to Tier 2.',
                            icon: assetDir('../UI/Menus/IconFacilitiesSmallGarrison.webp'),
                            range: {
                                type: 'garrison',
                                max: building.baseGarrisonRadius
                            }
                        },
                        'large_garrison': {
                            name: 'Large Garrison',
                            description: 'A Large Garrison permanently connects this base to nearby defensive structures. A Large Garrison required for upgrading the base to Tier 3.',
                            icon: assetDir('../UI/Menus/IconFacilitiesLargeGarrison.webp'),
                            range: {
                                type: 'garrison',
                                max: building.baseGarrisonRadius
                            }
                        }
                    }
                }
            };
            Object.assign(building, garrisonData);
        }
        if (building.preventOnLandscape && building.buildOnFoundation !== false) {
            building.requireFoundation = true;
        }
    }

    const appendGameAssets = function(data) {
        if (data.sockets) {
            for (const socket of data.sockets) {
                if (socket.texture) {
                    socket.texture = assetDir(socket.texture);
                    game_asset_list[socket.texture] = socket.texture;
                }
                if (socket.textureAlt) {
                    socket.textureAlt = assetDir(socket.textureAlt);
                    game_asset_list[socket.textureAlt] = socket.textureAlt;
                }
            }
        }
        for (const key of game_asset_keys) {
            let asset = data[key];
            if (asset) {
                if (typeof asset === 'object' && !Array.isArray(asset)) {
                    if (typeof asset.src === 'object') {
                        for (const [srcKey, srcValue] of Object.entries(asset.src)) {
                            asset.src[srcKey] = assetDir(srcValue);
                            game_asset_list[asset.src[srcKey]] = asset.src[srcKey];
                        }
                        return;
                    } else {
                        asset.src = assetDir(asset.src);
                        game_asset_list[asset.src] = asset.src;
                    }
                } else {
                    asset = assetDir(asset);
                    data[key] = asset;
                }
                game_asset_list[asset] = asset;
            }
        }
    };

    const appendBuildingData = function(key, building) {
        building.key = key;
        if (building.production) {
            if (building.power > 0) {
                building.production.hasOutput = true;
            } else {
                for (let i = 0; i < building.production.length; i++) {
                    let recipe = building.production[i];
                    if (recipe.output) {
                        building.production.hasOutput = true;
                        break;
                    }
                }
            }
        }
        if (building.category) {
            const buildingCategory = window.objectData.categories[building.category];
            if (buildingCategory) {
                if (!buildingCategory.buildings) {
                    buildingCategory.buildings = [];
                }
                buildingCategory.buildings.push(building);
            }
        }
    };

    for (const [buildingKey, building] of Object.entries(window.objectData.buildings)) {
        appendGameAssets(building);
        
        appendBuildingData(buildingKey, building);

        if (building.upgrades) {
            let upgradeKeys = Object.keys(building.upgrades);
            for (let j = 0; j < upgradeKeys.length; j++) {
                let upgradeKey = upgradeKeys[j];
                let upgrade = building.upgrades[upgradeKey];

                if (!upgrade.reference) {
                    appendGameAssets(upgrade);

                    let upgradeBuilding = Object.assign({}, building, {
                        hitArea: undefined,
                        tierUp: undefined,
                        tierDown: undefined
                    }, upgrade, {
                        parentKey: undefined
                    });
                    upgradeBuilding.parent = building;
                    upgradeBuilding.upgradeName = upgrade.name;
                    upgradeBuilding.name = building.name + ' (' + upgrade.name + ')';

                    let parentCost = upgradeBuilding.tierDown ? window.objectData.buildings[upgradeBuilding.tierDown]?.cost : building.cost;
                    let upgradeBuildingCost = Object.assign({}, parentCost);
                    if (upgradeBuilding.cost) {
                        for (const [resource, amount] of Object.entries(upgradeBuilding.cost)) {
                            if (!upgradeBuildingCost[resource]) {
                                upgradeBuildingCost[resource] = amount;
                            } else {
                                upgradeBuildingCost[resource] += amount;
                            }
                        }
                    }
                    upgradeBuilding.upgradeCost = upgradeBuilding.cost;
                    upgradeBuilding.cost = upgradeBuildingCost;

                    building.upgrades[upgradeKey] = upgradeBuilding;

                    upgradeKey = buildingKey + '_' + upgradeKey;
                    window.objectData.buildings[upgradeKey] = upgradeBuilding;

                    appendBuildingData(upgradeKey, upgradeBuilding);
                }
            }
        }
    }

    for (const building of Object.values(window.objectData.buildings)) {
        if (building.upgrades) {
            for (const [upgradeKey, upgradeData] of Object.entries(building.upgrades)) {
                if (upgradeData.reference) {
                    building.upgrades[upgradeKey] = window.objectData.buildings[upgradeData.reference];
                }
            }
        }
    }

    const vehicleCategories = ['shippables', 'weaponry', 'vehicles', 'armor', 'tank', 'trains', 'naval'];
    for (const [key, category] of Object.entries(window.objectData.categories)) {
        if (category.icon) {
            category.icon = assetDir(category.icon);
            game_asset_list[category.icon] = category.icon;
        }
        if (category.buildings && vehicleCategories.includes(key)) {
            for (const building of category.buildings) {
                if (!building.sortLayer) {
                    building.sortLayer = 'vehicle';
                }
            }
        }
    }

    for (const map of Object.values(gameData.maps)) {
        map.icon = assetDir(map.icon);
    }

    for (const resource of Object.values(window.objectData.resources)) {
        if (resource.icon) {
            resource.icon = assetDir(resource.icon);
            game_asset_list[resource.icon] = resource.icon;
        }
    }

    for (const weapon of Object.values(gameData.weapons)) {
        if (weapon.icon) {
            weapon.icon = assetDir(weapon.icon);
            game_asset_list[weapon.icon] = weapon.icon;
        }
    }

    window.objectData.categories.presets.buildings = [];
    window.objectData.categories.showcase.buildings = [];
    for (const [key, data] of Object.entries(gameData.presets)) {
        data.preset = true;
        data.category = (data.module && 'presets') || 'showcase';
        data.dataFile = assetDir(`../${key}/preset.json`, preset_asset_path);
        data.icon = assetDir(`../${key}/icon.webp`, preset_asset_path);
        data.texture = assetDir(`../${key}/preview.webp`, preset_asset_path);
        window.objectData.categories[data.category].buildings.push(data);
    }

    for (const category of Object.values(window.objectData.categories)) {
        if (category.buildings?.length) {
            category.buildings.sort((a, b) => {
                const aOrder = a.categoryOrder ?? 0, bOrder = b.categoryOrder ?? 0;
                return aOrder > bOrder ? 1 : (aOrder < bOrder ? -1 : 0);
            });
        }
    }
})();