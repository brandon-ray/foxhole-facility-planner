const game_asset_keys = ['icon', 'texture', 'textureBorder', 'textureFrontCap', 'textureBackCap'];
const game_asset_list = {};

function assetDir(str) {
    return str ? '/games/foxhole/assets/' + str : str;
}

(function() {
    window.objectData = {
        "categories": foxholeData.categories,
        "tech": foxholeData.tech,
        "resources": foxholeData.resources,
        "buildings": foxholeData.buildings
    };

    const appendGameAssets = function(data) {
        for (const key of game_asset_keys) {
            let asset = data[key];
            if (asset) {
                if (typeof asset === 'object' && !Array.isArray(asset)) {
                    asset = assetDir(asset.sheet);
                    data[key].sheet = asset;
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

    let buildingKeys = Object.keys(window.objectData.buildings);
    for (let i = 0; i < buildingKeys.length; i++) {
        let buildingKey = buildingKeys[i];
        let building = window.objectData.buildings[buildingKey];

        appendGameAssets(building);
        
        appendBuildingData(buildingKey, building);

        if (building.upgrades) {
            let upgradeKeys = Object.keys(building.upgrades);
            for (let j = 0; j < upgradeKeys.length; j++) {
                let upgradeKey = upgradeKeys[j];
                let upgrade = building.upgrades[upgradeKey];

                appendGameAssets(upgrade);

                let upgradeBuilding = Object.assign({}, building, upgrade);
                upgradeBuilding.parent = building;
                upgradeBuilding.parentKey = buildingKey;
                upgradeBuilding.upgradeName = upgrade.name;
                upgradeBuilding.name = building.name + ' (' + upgrade.name + ')';

                let upgradeBuildingCost = Object.assign({}, building.cost);
                if (upgradeBuilding.cost) {
                    for (const [resource, amount] of Object.entries(upgradeBuilding.cost)) {
                        if (building.cost) {
                            upgradeBuildingCost[resource] = (building.cost[resource] ?? 0) + amount;
                        } else {
                            upgradeBuildingCost[resource] = amount;
                        }
                    }
                }
                upgradeBuilding.upgradeCost = upgradeBuilding.cost;
                upgradeBuilding.cost = upgradeBuildingCost;

                upgradeKey = buildingKey + '_' + upgradeKey;
                window.objectData.buildings[upgradeKey] = upgradeBuilding;

                appendBuildingData(upgradeKey, upgradeBuilding);
            }
        }
    }

    for (const resource of Object.values(window.objectData.resources)) {
        if (resource.icon) {
            resource.icon = assetDir(resource.icon);
            game_asset_list[resource.icon] = resource.icon;
        }
    }

    for (const [category, data] of Object.entries(window.objectData.categories)) {
        if (data.buildings.length) {
            data.buildings.sort((a, b) => {
                const aOrder = a.categoryOrder ?? 0, bOrder = b.categoryOrder ?? 0;
                return aOrder > bOrder ? 1 : (aOrder < bOrder ? -1 : 0);
            });
        }
    }
})();