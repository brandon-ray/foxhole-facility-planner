//https://foxhole.fandom.com/wiki/Category:Icons
(function() {
    window.objectData = {
        resources: {
            salvage: {
                name: 'Salvage',
                icon: 'resources/SalvageIcon.webp',
                type: 'solid',
            },
            gravel: {
                name: 'Gravel',
                icon: 'resources/GravelIcon.webp',
                type: 'solid'
            },
            basic_material: {
                name: 'Basic Material',
                icon: 'resources/BasicMaterialsIcon.webp',
                type: 'solid'
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
            sulfur: {
                name: 'Sulfur',
                icon: 'resources/SulfurIcon.webp',
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
            heavy_oil: {
                name: 'Heavy Oil',
                icon: 'resources/HeavyOilIcon.webp',
                type: 'liquid'
            },
            enriched_oil: {
                name: 'Enriched Oil',
                icon: 'resources/EnrichedOilIcon.webp',
                type: 'liquid'
            },
            petrol: {
                name: 'Petrol',
                icon: 'resources/PetrolIcon.webp',
                type: 'liquid'
            },
            assembly_materials1: {
                name: 'Assembly Materials I (Cams)',
                icon: 'resources/AssemblyMaterials1Icon.webp',
                type: 'solid'
            },
            assembly_materials2: {
                name: 'Assembly Materials II (Pams)',
                icon: 'resources/AssemblyMaterials2Icon.webp',
                type: 'solid'
            },
            assembly_materials3: {
                name: 'Assembly Materials III (Sams)',
                icon: 'resources/AssemblyMaterials3Icon.webp',
                type: 'solid'
            },
            assembly_materials4: {
                name: 'Assembly Materials IV (Hams)',
                icon: 'resources/AssemblyMaterials4Icon.webp',
                type: 'solid'
            },
            assembly_materials5: {
                name: 'Assembly Materials V (Nams)',
                icon: 'resources/AssemblyMaterials5Icon.webp',
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
            },
            garrison_supplies: {
                name: 'Garrison Supplies',
                icon: 'resources/GarrisonSupplyIcon.webp',
                type: 'solid'
            },
            water: {
                name: 'Water',
                icon: 'resources/WaterIcon.webp',
                type: 'liquid'
            }
        },
        buildings: {
            /*
            foundation_corner: {
                name: 'Foundation Corner',
                description: 'A foundation for building out areas suitable for Facilities construction.', // Requires Construction Vehicle + Consumes 2x more Garrison Supplies
                category: 'foundations',
                power: 0,
                icon: 'buildings/ConcreteFoundation02Icon.png',
                texture: 'concrete.png',
                sortOffset: -1000,
                cost: {
                    gravel: 75
                }
            },
            */
            foundation_1x1: {
                name: 'Foundation 1x1',
                description: 'A foundation for building out areas suitable for Facilities construction.', // Requires Construction Vehicle + Consumes 2x more Garrison Supplies
                category: 'foundations',
                power: 0,
                width: 5,
                length: 5,
                icon: 'buildings/ConcreteFoundation01Icon.png',
                texture: 'concrete.png',
                sortOffset: -1000,
                cost: {
                    gravel: 75
                }
            },
            foundation_1x2: {
                name: 'Foundation 1x2',
                description: 'A foundation for building out areas suitable for Facilities construction.', // Requires Construction Vehicle + Consumes 2x more Garrison Supplies
                category: 'foundations',
                power: 0,
                width: 5,
                length: 10,
                icon: 'buildings/ConcreteFoundation03Icon.png',
                texture: 'concrete.png',
                sortOffset: -1000,
                cost: {
                    gravel: 115
                }
            },
            foundation_2x2: {
                name: 'Foundation 2x2',
                description: 'A foundation for building out areas suitable for Facilities construction.', // Requires Construction Vehicle + Consumes 2x more Garrison Supplies
                category: 'foundations',
                power: 0,
                width: 10,
                length: 10,
                icon: 'buildings/ConcreteFoundation04Icon.png',
                texture: 'concrete.png',
                sortOffset: -1000,
                cost: {
                    gravel: 150
                }
            },
            rail_small_gauge: {
                name: 'Small Gauge Railway Track',
                description: 'A segment of railway for small gauge train cars. Tracks can attach to or fork from existing railways to form complex networks.',
                category: 'foundations',
                power: 0,
                width: 2,
                length: 2,
                maxLength: 30,
                icon: 'buildings/RailSmallIcon.png',
                sortOffset: 100000,
                texture: 'track_small_gauge.png',
                cost: {
                    construction_material: 25
                }
            },
            rail_large_gauge: {
                name: 'Railway Track',
                description: 'A segment of railway for train cars. Tracks can attach to or fork from existing railways to form complex networks.', // Requires Tech
                category: 'foundations',
                power: 0,
                width: 2,
                length: 2,
                maxLength: 30,
                icon: 'buildings/RailLargeIcon.png',
                sortOffset: 100000,
                texture: 'track_large_gauge.png',
                cost: {
                    processed_construction_material: 5
                }
            },
            /*
            crane_railway_track: {
                name: 'Crane Railway Track',
                description: 'A segment of railway for heavy cranes. This type of railway can only be built on Foundations.', // Requires Tech
                category: 'foundations',
                cost: {
                    steel: 3
                }
            },
            */
            materials_factory: {
                name: 'Materials Factory',
                description: 'Used to create Construction Materials. Can be modified to produce additional materials.', // Requires Construction Vehicle
                category: 'factories',
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
                        salvage: 10
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
                description: 'This Facility refines Coal into other useful materials for the purposes of production and power generation.', // Requires Construction Vehicle
                category: 'factories',
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
                },
				upgrades: {
                    coke_furnace: {
                        name: 'Coke Furnace',
                        power: -3,
                        icon: 'buildings/CoalRefineryIcon.webp',
                        production: {
                            time: 120,
                            input: {
                                coal: 200
                            },
                            output: {
                                coke: 165,
								sulfur: 15
                            }
                        }
                    },
                    liquifier: {
                        name: 'Coal Liquifier',
                        power: -4,
                        icon: 'buildings/CoalRefineryIcon.webp',
                        production: {
                            time: 120,
                            input: {
                                coal: 300,
								water: 50
                            },
                            output: {
                                oil: 50,
								concrete: 1
                            }
                        }
                    },
                    adv_liquifier: {
                        name: 'Advanced Coal Liquifier',
                        power: -4,
                        icon: 'buildings/CoalRefineryIcon.webp',
                        production: {
                            time: 180,
                            input: {
                                coal: 300,
								water: 100
                            },
                            output: {
                                heavy_oil: 60,
								coke: 260
                            }
                        }
                    },
				}
            },
            oil_refinery: {
                name: 'Oil Refinery',
                description: 'This Facility refines Oil into other useful materials for the purposes of production and power generation.', // Requires Construction Vehicle
                category: 'factories',
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
                },
				upgrades: {
                    reformer: {
                        name: 'Reformer',
                        power: -1,
                        icon: 'buildings/OilRefineryIcon.webp',
                        production: {
                            time: 120,
                            input: {
                                oil: 120,
								water: 30,
                            },
                            output: {
                                petrol: 150
                            }
                        }
                    },
                    cracking_unit: {
                        name: 'Cracking Unit',
                        power: -1.5,
                        icon: 'buildings/OilRefineryIcon.webp',
                        production: {
                            time: 160,
                            input: {
                                oil: 150
                            },
                            output: {
                                heavy_oil: 90
                            }
                        }
                    },
                    petro_plant: {
                        name: 'Petrochemical Plant',
                        power: -6,
                        icon: 'buildings/OilRefineryIcon.webp',
                        production: {
                            time: 200,
                            input: {
                                sulfur: 60,
								heavy_oil: 30
                            },
                            output: {
                                enriched_oil: 90
                            }
                        }
                    },
				}
            },
            maintenance_tunnel: {
                name: 'Maintenance Tunnel',
                description: 'Prevents decay for Facilities and Railway Tracks by providing Garrison Supplies to nearby structures. Garrison Supplies can also be produced on site using Construction Materials. The rate of Garrison Supplies consumption is 2 per hour per structure once decay has begun. Some structures have additional consumption requirements.', // Requires Construction Vehicle + Cannot be close to other Maintenance Tunnels
                category: 'misc',
                power: -2,
                width: 3,
                length: 3,
                range: 40,
                icon: 'buildings/SupplyStationIcon.webp',
                cost: {
                    construction_material: 200
                },
                production: {
                    time: 450,
                    input: {
                        construction_material: 1
                    },
                    output: {
                        garrison_supplies: 20
                    }
                }
            },
            bms_foreman_stacker: {
                name: 'BMS Foreman Stacker',
                description: 'The Foreman is an all-purpose, no-frills, easy to assemble crane. Perfect for hauling heavy loads in facilities where loading and offloading is commonplace.', // Requires Construction Vehicle + Requires Tech
                category: 'misc',
                power: -0.5,
                width: 3,
                length: 3,
                range: 24,
                icon: 'buildings/CraneIcon.png',
                cost: {
                    processed_construction_material: 10
                }
            },
            /*
            power_pole: {
                name: 'Power Pole',
                description: 'Used to connect Power Lines together. Up to 4 Power Lines can be attached to a single pole.',
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
                description: 'Generates a small amount of power using Diesel as input.', // Requires Construction Vehicle
                category: 'power',
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
                category: 'power',
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
            
            power_station: {
                name: 'Power Station (Oil)',
                description: 'This Facility generates a large amount of power using Oil or Coal as inputs.', // Requires Construction Vehicle + Requires Tech
                category: 'power',
				power: 10,
				width: 14,
                length: 14,
				icon: 'buildings/FacilityPowerOilIcon.webp',
                cost: {
                    processed_construction_material: 25
                },
                production: {
                    time: 90,
                    input: {
                        oil: 50
                    }
                },
				upgrades: {
                    reactor_heavy_oil: {
                        name: 'Sulfuric Reactor (Heavy Oil)',
                        power: 16,
                        icon: 'buildings/SulfuricReactorIcon.webp',
                        production: {
                            time: 120,
                            input: {
                                heavy_oil: 50
                            },
                            output: {
                                sulfur: 5
                            }
                        }
                    },
                    reactor_coke: {
                        name: 'Sulfuric Reactor (Coke)',
                        power: 16,
                        icon: 'buildings/SulfuricReactorIcon.webp',
                        production: {
                            time: 120,
                            input: {
                                coke: 60,
								water: 25
                            },
                            output: {
                                sulfur: 5
                            }
                        }
                    },
				}
            },
            power_station_coal: {
                name: 'Power Station (Coal)',
                description: 'This Facility generates a large amount of power using Coal.', // Requires Tech
                category: 'power',
				power: 10,
				width: 14,
                length: 14,
				icon: 'buildings/FacilityPowerOilIcon.webp',
                cost: {
                    processed_construction_material: 25
                },
                production: {
                    time: 90,
                    input: {
                        coal: 60,
                        water: 25
                    }
                }
            },
            
            stationary_harvester_scrap: {
                name: 'Stationary Harvester (Scrap)',
                description: 'A stationary harvester that automatically gathers Salvage using Petrol as fuel.', // Requires Construction Vehicle
                category: 'harvesters',
                power: 0,
                width: 5,
                length: 7,
                icon: 'buildings/ScrapStationaryHarvesterIcon.webp',
                cost: {
                    construction_material: 150
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
            stationary_harvester_components: {
                name: 'Stationary Harvester (Components)',
                description: 'A stationary harvester that automatically gathers Components using Heavy Oil as fuel.', // Requires Construction Vehicle
                category: 'harvesters',
                power: 0,
                width: 5,
                length: 7,
                icon: 'buildings/ComponentsStationaryHarvesterIcon.webp',
                cost: {
                    steel: 20
                },
                production: {
                    time: 12,
                    input: {
                        petrol: 4 // (The icon shown is clearly Petrol but the description states Heavy Oil in-game...)
                    },
                    output: {
                        component: 6
                    }
                }
            },
            stationary_harvester_coal: {
                name: 'Stationary Harvester (Coal)',
                description: 'A stationary harvester that automatically gathers Coal using Petrol as fuel.', // Requires Construction Vehicle + Requires Tech
                category: 'harvesters',
                power: 0,
                width: 5,
                length: 7,
                icon: 'buildings/CoalStationaryHarvesterIcon.webp',
                cost: {
                    processed_construction_material: 25
                },
                production: {
                    time: 12,
                    input: {
                        petrol: 4
                    },
                    output: {
                        coal: 50
                    }
                }
            },
            stationary_harvester_sulfur: {
                name: 'Stationary Harvester (Sulfur)',
                description: 'A stationary harvester that automatically gathers Sulfur using Heavy Oil as fuel.', // Requires Construction Vehicle + Requires Tech
                category: 'harvesters',
                power: 0,
                width: 5,
                length: 7,
                icon: 'buildings/SulfurStationaryHarvesterIcon.webp',
                cost: {
                    steel: 20
                },
                production: {
                    time: 12,
                    input: {
                        heavy_oil: 4
                    },
                    output: {
                        sulfur: 6
                    }
                }
            },
            /*
            water_pump: {
                name: 'Water Pump',
                description: 'Pumps Water to the surface. Must be built over bodies of water.',
                category: 'harvesters',
                icon: 'buildings/WaterPumpIcon.webp',
                cost: {
                    construction_material: 35
                },
                category: 'harvesters',
                production: {
                    time: 50,
                    output: {
                        water: 1
                    }
                }
            },
            oil_well: {
                name: 'Oil Well',
                description: 'Extracts Oil from an underground source. Must be built near a Crude Oil field.', // Requires Construction Vehicle
                category: 'harvesters',
                icon: 'buildings/OilWellFrackerIcon.webp',
                cost: {
                    construction_material: 35
                },
                production: {
                    time: 50,
                    output: {
                        oil: 1
                    }
                }
            },
            */
            fuel_silo: {
                name: 'Fuel Silo',
                description: 'Stores various types of fuel, including Heavy Oil, Petrol, and Crude Oil.', // Requires Construction Vehicle + Requires Tech
                category: 'factories',
                cost: {
                    construction_material: 30
                },
                capacity: 500
            },
            pipeline_valve: {
                name: 'Pipeline Valve',
                description: 'Controls the rate of flow through a pipeline. Requires a Wrench for adjustment.', // Requires Tech
                category: 'factories',
                cost: {
                    pipe: 2
                }
            },
            light_vehicle_assembly_station: {
                name: 'Light Vehicle Assembly Station',
                description: 'Allows production of a wide variety of vehicles and equipment. Production takes time and can be halted if resources are depleted. Some variants require a base vehicle to be present on the Assembly Station before production can begin. Essential vehicles and equipment are produced here.', // Requires Construction Vehicle
                category: 'factories',
                cost: {
                    construction_material: 75
                }
                /*
                Colonial-Vehicles

                Material Pallet
                00MS "Stinger" (Motorcycle)
                R-5b "Sisyphus" Hauler (Truck)
                R-9 "Speartip" Escort (Truck)
                BMS Mineseeker (Small Train Locomotive)
                BMS Railtruck (Small Container Car)
                BMS Linerunner (Small Flatbed Car)
                */
            },
            /*
            ammunition_factory: {
                name: 'Ammunition Factory',
                description: 'A factory that produces various types of heavy and advanced ammunition.', // Requires Construction Vehicle + Requires Tech
                category: 'factories',
                power: -4,
                cost: {
                    processed_construction_material: 25
                },
                production: {
                    time: 25,
                    input: {
                        heavy_explosive_material: 1,
                        construction_material: 1
                    },
                    output: {
                        flame_fuel: 1
                    }
                }
            },
            ammunition_factory: {
                name: 'Ammunition Factory',
                description: 'A factory that produces various types of heavy and advanced ammunition.', // Requires Construction Vehicle + Requires Tech
                category: 'factories',
                power: -4,
                cost: {
                    processed_construction_material: 25
                },
                production: {
                    time: 30,
                    input: {
                        heavy_explosive_material: 6,
                        construction_material: 1
                    },
                    output: {
                        ammo_250mm: 1
                    }
                }
            },
            */
            metalworks_factory: {
                name: 'Metalworks Factory (Processed Construction Materials)',
                description: 'It takes an input of Construction Materials and outputs small amount of a Processed Construction Materials used in Tier 2 Facilities construction.', // Requires Construction Vehicle + Requires Tech
                category: 'factories',
                power: -5,
                width: 9,
                length: 12,
                icon: 'buildings/MetalworksFactoryIcon.webp',
                cost: {
                    construction_material: 125
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
                },
				upgrades: {
					blast_furnace_hams: {
                        name: 'Blast Furnace (Hams)',
                        power: -5,
                        icon: 'buildings/MetalworksFactoryIcon.webp',
                        production: {
                            time: 120,
                            input: {
                                processed_construction_material: 1,
                                heavy_oil: 66
                            },
                            output: {
                                assembly_materials4: 1
                            }
                        }
                    },
					blast_furnace_sams: {
                        name: 'Blast Furnace (Sams)',
                        power: -5,
                        icon: 'buildings/MetalworksFactoryIcon.webp',
                        production: {
                            time: 120,
                            input: {
                                construction_material: 3,
                                sulfur: 3
                            },
                            output: {
                                assembly_materials3: 1
                            }
                        }
                    },
					blast_furnace_pcons: {
                        name: 'Blast Furnace (pCons)',
                        power: -5,
                        icon: 'buildings/MetalworksFactoryIcon.webp',
                        production: {
                            time: 120,
                            input: {
                                construction_material: 3,
                                component: 55,
								heavy_oil: 6
                            },
                            output: {
                                processed_construction_material: 3
                            }
                        }
                    },
				}
            },
            metalworks_factory_pipes: {
                name: 'Metalworks Factory (Pipes)',
                category: 'factories',
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
            field_modification_center: {
                name: 'Field Modification Center',
                description: 'Vehicles can be further upgraded into higher tiers using this Facility. Higher tier vehicles have improved durability.', // Requires Construction Vehicle + Requires Tech
                cost: {
                    processed_construction_material: 250
                }
            },
            liquid_transfer_station: {
                name: 'Liquid Transfer Station',
                description: 'Used for storing materials for transfer into and out of Facilities. The stockpile for this structure can be reserved.', // Requires Construction Vehicle
                cost: {
                    construction_material: 35
                }
            },
            sound_test: {
                name: 'Sus',
                hideInList: true,
                power: 0,
                width: 2,
                length: 2,
                icon: 'buildings/FirePitIcon.webp',
                texture: {
                    sheet: 'sus.png',
                    speed: 0.132,
                    width: 220,
                    height: 184
                }
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