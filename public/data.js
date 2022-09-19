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
            },
            assembly_materials1: {
                name: 'Assembly Materials 1',
                icon: 'resources/AssemblyMaterialsIcon.webp',
                type: 'solid'
            },
            assembly_materials2: {
                name: 'Assembly Materials 2',
                icon: 'resources/AssemblyMaterialsIcon.webp',
                type: 'solid'
            },
            assembly_materials3: {
                name: 'Assembly Materials 3',
                icon: 'resources/AssemblyMaterialsIcon.webp',
                type: 'solid'
            },
            assembly_materials4: {
                name: 'Assembly Materials 4',
                icon: 'resources/AssemblyMaterialsIcon.webp',
                type: 'solid'
            },
            assembly_materials5: {
                name: 'Assembly Materials 5',
                icon: 'resources/AssemblyMaterialsIcon.webp',
                type: 'solid'
            },
            sandbag: {
                name: 'Sandbag',
                icon: 'resources/SandbagMaterialIcon.webp',
                type: 'solid'
            },
            barbed_wire: {
                name: 'Barbed Wire',
                icon: 'resources/BarbedWireMaterialIcon.webp',
                type: 'solid'
            },
            component: {
                name: 'Component',
                icon: 'resources/ComponentIcon.webp',
                type: 'solid'
            },
            processed_construction_material: {
                name: 'Processed Construction Material',
                icon: 'resources/ProcessedConstructionMaterialsIcon.webp',
                type: 'solid'
            },
            pipe: {
                name: 'Pipe',
                icon: 'resources/PipeIcon.webp',
                type: 'solid'
            }
        },
        buildings: {
            foundation_1x1: {
                name: 'Foundation 1x1',
                power: 0,
                width: 5,
                length: 5,
                icon: 'buildings/FoundationIcon.webp',
                texture: 'concrete.png',
                sortOffset: -1000,
                cost: {
                    gravel: 75
                }
            },
            foundation_1x2: {
                name: 'Foundation 1x2',
                power: 0,
                width: 5,
                length: 10,
                icon: 'buildings/FoundationIcon.webp',
                texture: 'concrete.png',
                sortOffset: -1000,
                cost: {
                    gravel: 115
                }
            },
            foundation_2x2: {
                name: 'Foundation 2x2',
                power: 0,
                width: 10,
                length: 10,
                icon: 'buildings/FoundationIcon.webp',
                texture: 'concrete.png',
                sortOffset: -1000,
                cost: {
                    gravel: 150
                }
            },
            materials_factory: {
                name: 'Materials Factory',
                power: -2,
                width: 6,
                length: 12,
                icon: 'buildings/MaterialsFactoryIcon.webp',
                cost: {
                    basic_material: 200
                },
                production: {
                    time: 25,
                    input: {
                        salvage: 20
                    },
                    output: {
                        construction_material: 1
                    }
                },
                upgrades: {
                    forge_mat1: {
                        name: 'Forge',
                        power: -2,
                        icon: 'buildings/MaterialsFactoryForgeIcon.webp',
                        production: {
                            time: 60,
                            input: {
                                salvage: 20,
                                coke: 180
                            },
                            output: {
                                assembly_materials1: 1
                            }
                        }
                    },
                    forge_mat2: {
                        name: 'Forge',
                        power: -2,
                        icon: 'buildings/MaterialsFactoryForgeIcon.webp',
                        production: {
                            time: 60,
                            input: {
                                salvage: 20,
                                petrol: 150
                            },
                            output: {
                                assembly_materials2: 1
                            }
                        }
                    },
                    metal_press: {
                        name: 'Metal Press',
                        power: -4,
                        icon: 'buildings/MaterialsFactoryMetalPressIcon.webp',
                        production: {
                            time: 25,
                            input: {
                                salvage: 20,
                                petrol: 25
                            },
                            output: {
                                construction_material: 3
                            }
                        }
                    },
                    smelter: {
                        name: 'Smelter',
                        power: -4,
                        icon: 'buildings/MaterialsFactorySmelterIcon.webp',
                        production: {
                            time: 25,
                            input: {
                                salvage: 20,
                                coke: 25
                            },
                            output: {
                                construction_material: 3
                            }
                        }
                    },
                    recycler_sandbags: {
                        name: 'Recycler',
                        power: -2,
                        icon: 'buildings/MaterialsFactoryRecyclerIcon.webp',
                        production: {
                            time: 25,
                            input: {
                                salvage: 20,
                                petrol: 25
                            },
                            output: {
                                construction_material: 1,
                                sandbag: 5
                            }
                        }
                    },
                    recycler_barbed_wire: {
                        name: 'Recycler',
                        power: -2,
                        icon: 'buildings/MaterialsFactoryRecyclerIcon.webp',
                        production: {
                            time: 25,
                            input: {
                                salvage: 25,
                            },
                            output: {
                                construction_material: 1,
                                barbed_wire: 5
                            }
                        }
                    },
                }
            },
            coal_refinery: {
                name: 'Coal Refinery',
                power: -3,
                width: 6,
                length: 10,
                icon: 'buildings/CoalRefineryIcon.webp',
                cost: {
                    construction_material: 50
                },
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
                length: 11,
                icon: 'buildings/OilRefineryIcon.webp',
                cost: {
                    construction_material: 50
                },
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
            bms_foreman_stacker: {
                name: 'BMS Foreman Stacker',
                power: -0.5,
                width: 3,
                length: 3,
                icon: 'buildings/FortStructureIcon.webp',
                cost: {
                    processed_construction_material: 200
                }
            },
            /*
            power_pole: {
                name: 'Power Pole',
                power: 0,
                width: 1,
                length: 1,
                icon: 'buildings/PowerPoleIcon.webp',
                texture: 'concrete.png',
                cost: {
                    basic_material: 20
                }
            },
            */
            diesel_power_plant: {
                name: 'Diesel Power Plant',
                power: 5,
                width: 7,
                length: 7,
                icon: 'buildings/DieselPowerPlantIcon.webp',
                cost: {
                    basic_material: 150
                },
                production: {
                    time: 45,
                    input: {
                        diesel: 25
                    }
                }
            },
            petrol_power_plant: {
                name: 'Petrol Power Plant',
                power: 12,
                width: 7,
                length: 7,
                icon: 'buildings/PetrolPowerPlantIcon.webp',
                cost: {
                    basic_material: 150,
                    processed_construction_material: 50
                },
                production: {
                    time: 90,
                    input: {
                        petrol: 50
                    }
                }
            },
            stationary_harvester_scrap: {
                name: 'Stationary Harvester (Scrap)',
                power: 0,
                width: 5,
                length: 7,
                icon: 'buildings/ScrapStationaryHarvesterIcon.webp',
                cost: {
                    processed_construction_material: 150
                },
                production: {
                    time: 12,
                    input: {
                        petrol: 4
                    },
                    output: {
                        salvage: 50
                    }
                }
            },
            metalworks_factory: {
                name: 'Metalworks Factory (Procesed Construction Materials)',
                power: -5,
                width: 9,
                length: 12,
                icon: 'buildings/MetalworksFactoryIcon.webp',
                cost: {
                    processed_construction_material: 125
                },
                production: {
                    time: 60,
                    input: {
                        construction_material: 3,
                        component: 20
                    },
                    output: {
                        processed_construction_material: 1
                    }
                }
            },
            metalworks_factory_pipes: {
                name: 'Metalworks Factory (Pipes)',
                power: -5,
                width: 9,
                length: 12,
                icon: 'buildings/MetalworksFactoryIcon.webp',
                production: {
                    time: 120,
                    input: {
                        processed_construction_material: 3
                    },
                    output: {
                        pipe: 1
                    }
                }
            },
            sound_test: {
                name: 'Sound Test',
                power: 0,
                width: 2,
                length: 2,
                icon: 'buildings/FirePitIcon.webp',
                texture: {
                    sheet: 'sus.png',
                    speed: 0.132,
                    width: 220,
                    height: 184
                },
                sound: 'speaker'
            },
        }
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
                upgradeBuilding.name = building.name + ' (' + upgrade.name + ')';
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
            objectList.push(data);
        }
        window.objectData[objectDataKey + '_list'] = objectList;
    }
})();