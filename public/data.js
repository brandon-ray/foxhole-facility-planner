const buildingCategories = {
    foundations: {
        name: 'Foundations',
        order: 0,
        color: 0x505050 // Dark Grey
    },
    defenses: {
        name: 'Defenses',
        order: 1
    },
    factories: {
        name: 'Factories',
        order: 2,
        color: 0x8566bd // Indigo / Purple
    },
    harvesters: {
        name: 'Harvesters',
        order: 3,
        color: 0x289665 // Forest Green
    },
    power: {
        name: 'Power',
        order: 4,
        color: 0xf2ec7a // Yellow
    },
    vehicles: {
        name: 'Vehicles',
        order: 5
    },
    misc: {
        name: 'Miscellaneous',
        order: 6,
        color: 0x7ce1ea // Blue
    }
};

//https://foxhole.fandom.com/wiki/Category:Icons
(function() {
    window.objectData = {
        "tech": foxholeData.tech,
        "resources": foxholeData.resources,
        "buildings": foxholeData.buildings
    };

    let buildingKeys = Object.keys(window.objectData.buildings);
    for (let i=0; i<buildingKeys.length; i++) {
        let buildingKey = buildingKeys[i];
        let building = window.objectData.buildings[buildingKey];
        if (building.upgrades) {
            let upgradeKeys = Object.keys(building.upgrades);
            for (let j=0; j<upgradeKeys.length; j++) {
                let upgradeKey = upgradeKeys[j];
                let upgrade = building.upgrades[upgradeKey];
                let upgradeBuilding = Object.assign({}, building, upgrade);

                upgradeBuilding.parent = building;
                upgradeBuilding.parentKey = buildingKey;
                upgradeBuilding.parentName = building.name;
                upgradeBuilding.upgradeName = upgrade.name;
                upgradeBuilding.name = building.name + ' (' + upgrade.name + ')';

                let upgradeBuildingCost = Object.assign({}, building.cost);
                for (const [resource, amount] of Object.entries(upgradeBuilding.cost)) {
                    let resourceAmt = building.cost[resource];
                    if (resourceAmt) {
                        upgradeBuildingCost[resource] = resourceAmt + amount;
                    } else {
                        upgradeBuildingCost[resource] = amount;
                    }
                }
                upgradeBuilding.upgradeCost = upgradeBuilding.cost;
                upgradeBuilding.cost = upgradeBuildingCost;

                window.objectData.buildings[buildingKey + '_' + upgradeKey] = upgradeBuilding;
            }
        }
    }

    let objectDataKeys = Object.keys(window.objectData);
    for (let i = 0; i < objectDataKeys.length; i++) {
        let objectDataKey = objectDataKeys[i];
        let objectData = window.objectData[objectDataKey];

        let objectList = [];
        let keys = Object.keys(objectData);
        for (let j = 0; j < keys.length; j++) {
            let key = keys[j];
            let data = objectData[key];
            data.key = key;

            if (objectDataKey === 'buildings' && data.production) {
                if (data.power > 0) {
                    data.production.hasOutput = true;
                } else {
                    for (let i = 0; i < data.production.length; i++) {
                        let recipe = data.production[i];
                        if (recipe.output) {
                            data.production.hasOutput = true;
                            break;
                        }
                    }
                }
            }

            objectList.push(data);
        }

        window.objectData[objectDataKey + '_list'] = objectList;

        /*
        Not sure this is needed anymore...
        
        objectList.sort((a, b) => {
            return a.name.localeCompare(b.name);
        });
        */
        
        if (objectDataKey === 'buildings') {
            objectList.sort((a, b) => buildingCategories[a.category].order - buildingCategories[b.category].order);
        }
    }
})();