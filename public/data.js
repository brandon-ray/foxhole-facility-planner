//https://foxhole.fandom.com/wiki/Category:Icons
(function() {
    window.objectData = {
        resources: {
            salvage: {
                name: 'Salvage',
                icon: 'resources/SalvageIcon.webp',
                type: 'solid',
            },
            construction_material: {
                name: 'Construction Material',
                icon: 'resources/ConstructionMaterialsIcon.webp',
                type: 'solid'
            },
            coal: {
                name: 'Coal',
                icon: 'resources/CoalIcon.webp',
                type: 'solid',
            },
            coke: {
                name: 'Coke',
                icon: 'resources/CokeIcon.webp',
                type: 'solid'
            },
            diesel: {
                name: 'Diesel',
                icon: 'resources/DieselIcon.webp',
                type: 'liquid'
            },
            oil: {
                name: 'Oil',
                icon: 'resources/OilIcon.webp',
                type: 'liquid'
            },
            petrol: {
                name: 'Petrol',
                icon: 'resources/PetrolIcon.webp',
                type: 'liquid'
            }
        },
        buildings: {
            foundation_1x1: {
                name: 'Foundation 1x1',
                power: 0,
                width: 2,
                length: 2,
                icon: 'buildings/FoundationIcon.webp',
                texture: 'concrete'
            },
            foundation_2x2: {
                name: 'Foundation 2x2',
                power: 0,
                width: 4,
                length: 4,
                icon: 'buildings/FoundationIcon.webp',
                texture: 'concrete'
            },
            materials_factory: {
                name: 'Materials Factory',
                power: -2,
                width: 6,
                length: 3,
                icon: 'buildings/MaterialsFactoryIcon.webp',
                production: {
                    time: 25,
                    input: {
                        salvage: 20
                    },
                    output: {
                        construction_material: 1
                    }
                }
            },
            coal_refinery: {
                name: 'Coal Refinery',
                power: -3,
                width: 5,
                length: 2,
                icon: 'buildings/CoalRefineryIcon.webp',
                production: {
                    time: 120,
                    input: {
                        coal: 200
                    },
                    output: {
                        coke: 180
                    }
                }
            },
            oil_refinery: {
                name: 'Oil Refinery',
                power: -1,
                width: 4,
                length: 2,
                icon: 'buildings/OilRefineryIcon.webp',
                production: {
                    time: 150,
                    input: {
                        oil: 150
                    },
                    output: {
                        petrol: 150
                    }
                }
            },
            diesel_power_plant: {
                name: 'Diesel Power Plant',
                power: 5,
                width: 3,
                length: 3,
                icon: 'buildings/DieselPowerPlantIcon.webp',
                production: {
                    time: 45,
                    input: {
                        diesel: 25
                    }
                }
            },
            stationary_harvester_scrap: {
                name: 'Stationary Harvester (Scrap)',
                power: 0,
                width: 3,
                length: 3,
                icon: 'buildings/ScrapStationaryHarvesterIcon.webp',
                production: {
                    time: 12,
                    input: {
                        petrol: 4
                    },
                    output: {
                        salvage: 50
                    }
                }
            }
        }
    };

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
            objectList.push(data);
        }
        window.objectData[objectDataKey + '_list'] = objectList;
    }
})();