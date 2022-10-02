const buildingCategories = {
    foundations: {
        name: 'Foundations',
        order: 0,
        color: 0x505050 // Dark Grey
    },
    factories: {
        name: 'Factories',
        order: 1,
        color: 0x8566bd // Indigo / Purple
    },
    harvesters: {
        name: 'Harvesters',
        order: 2,
        color: 0x289665 // Forest Green
    },
    power: {
        name: 'Power',
        order: 3,
        color: 0xf2ec7a // Yellow
    },
    misc: {
        name: 'Miscellaneous',
        order: 4,
        color: 0x7ce1ea // Blue
    }
};

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
                name: 'Assembly Materials I',
                icon: 'resources/AssemblyMaterials1Icon.webp',
                type: 'solid'
            },
            assembly_materials2: {
                name: 'Assembly Materials II',
                icon: 'resources/AssemblyMaterials2Icon.webp',
                type: 'solid'
            },
            assembly_materials3: {
                name: 'Assembly Materials III',
                icon: 'resources/AssemblyMaterials3Icon.webp',
                type: 'solid'
            },
            assembly_materials4: {
                name: 'Assembly Materials IV',
                icon: 'resources/AssemblyMaterials4Icon.webp',
                type: 'solid'
            },
            assembly_materials5: {
                name: 'Assembly Materials V',
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
            steel_construction_material: {
                name: 'Steel Construction Material',
                icon: 'resources/SteelIcon.webp',
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
            },
            concrete_materials: {
                name: 'Concrete Materials',
                icon: 'resources/ConcreteMaterialsIcon.webp',
                type: 'solid'
            },
            explosive_material: {
                name: 'Explosive Material',
                icon: 'resources/ExplosiveMaterialIcon.webp',
                type: 'solid'
            },
            heavy_explosive_material: {
                name: 'Heavy Explosive Material',
                icon: 'resources/HeavyExplosiveMaterialIcon.webp',
                type: 'solid'
            },
            damaged_component: {
                name: 'Damaged Component',
                icon: 'resources/ComponentsDamagedIcon.webp',
                type: 'solid'
            },
            metal_beam: {
                name: 'Metal Beam',
                icon: 'resources/MetalBeamIcon.webp',
                type: 'solid'
            },
            ammo_flame: {
                name: 'Flame Ammo',
                icon: 'ammo/FlameAmmoIcon.png',
                type: 'solid'
            },
            ammo_250mm: {
                name: '250mm',
                icon: 'ammo/250mm.webp',
                type: 'solid'
            },
            ammo_75mm: {
                name: '75mm',
                icon: 'ammo/75mm.webp',
                type: 'solid'
            },
            ammo_94_5mm: {
                name: '94.5mm',
                icon: 'ammo/94_5mm.webp',
                type: 'solid'
            },
            ammo_300mm: {
                name: '300mm',
                icon: 'ammo/300mm.webp',
                type: 'solid'
            },
            ammo_120mm: {
                name: '120mm',
                icon: 'ammo/120mm.webp',
                type: 'solid'
            },
            ammo_150mm: {
                name: '150mm',
                icon: 'ammo/150mm.webp',
                type: 'solid'
            },
            ammo_3c_high_explosive_rocket: {
                name: '3C High Explosive Rocket',
                icon: 'ammo/3C-High_Explosive_Rocket_Icon.webp',
                type: 'solid'
            },
            ammo_4c_fire_rocket: {
                name: '4C Fire Rocket',
                icon: 'ammo/4C-Fire_Rocket_Icon.webp',
                type: 'solid'
            },
            vehicle_obrien_v113: {
                name: 'O\'Brien V.113 Gravekeeper',
                icon: 'vehicles/OBrien_v.113_Gravekeeper_Vehicle_Icon.webp',
                type: 'vehicle' // Warden
            },
            vehicle_obrien_v121: {
                name: 'O\'Brien V.121 Highlander',
                icon: 'vehicles/OBrien_v.121_Highlander_Vehicle_Icon.webp',
                type: 'vehicle' // Warden
            },
            vehicle_obrien_v130_wild_jack: {
                name: 'O\'Brien V.130 Wild Jack',
                icon: 'vehicles/OBrien_v130_Vehicle_Icon.webp',
                type: 'vehicle' // Warden
            },
            vehicle_obrien_v101_freeman: {
                name: 'O\'Brien V.101 Freeman',
                icon: 'vehicles/OBrien_v.101_Freeman_Vehicle_Icon.webp',
                type: 'vehicle' // Warden
            },
            vehicle_obrien_v110: {
                name: 'O\'Brien V.110',
                icon: 'vehicles/OBrien_v110_Vehicle_Icon.webp',
                type: 'vehicle' // Warden
            },
            vehicle_drummond_spitfire_100d: {
                name: 'Drummond Spitfire 100d',
                icon: 'vehicles/Drummond_Spitfire_100d_Vehicle_Icon.webp',
                type: 'vehicle' // Warden
            },
            vehicle_drummond_loscann_55c: {
                name: 'Drummond Loscann 55c',
                icon: 'vehicles/Drummond_Loscann_55c_Vehicle_Icon.webp',
                type: 'vehicle' // Warden
            },
            vehicle_noble_firebrand_mk_xvii: {
                name: 'Noble Firebrand Mk. XVII',
                icon: 'vehicles/Noble_Firebrand_Mk._XVII_Vehicle_Icon.webp',
                type: 'vehicle' // Warden
            },
            vehicle_noble_widow_mk_xiv: {
                name: 'Noble Widow Mk. XIV',
                icon: 'vehicles/Noble_Widow_MK._XIV_Vehicle_Icon.webp',
                type: 'vehicle' // Warden
            },
            vehicle_devitt_ironhide_mk_iv: {
                name: 'Devitt Ironhide Mk. IV',
                icon: 'vehicles/Devitt_Ironhide_Mk._IV_Vehicle_Icon.webp',
                type: 'vehicle' // Warden
            },
            vehicle_devitt_caine_mk_iv_mmr: {
                name: 'Devitt-Caine Mk. IV MMR',
                icon: 'vehicles/Devitte-Caine_Mk-IV_MMR_Icon.webp',
                type: 'vehicle' // Warden
            },
            vehicle_silverhand_chieftain_mk_vi: {
                name: 'Silverhand Chieftain - Mk. VI',
                icon: 'vehicles/Silverhand_Chieftan_-_Mk._VI_Vehicle_Icon.webp',
                type: 'vehicle' // Warden
            },
            vehicle_gallagher_highwayman_mk_iii: {
                name: 'Gallagher Highwayman Mk. III',
                icon: 'vehicles/Gallagher_Highwayman_Mk._III_Vehicle_Icon.webp',
                type: 'vehicle' // Warden
            },
            vehicle_balfour_rampart_68mm: {
                name: 'Balfour Rampart 68mm',
                icon: 'vehicles/Balfour_Rampart_68mm_Vehicle_Icon.webp',
                type: 'vehicle' // Warden
            },
            vehicle_collins_cannon_68mm: {
                name: 'Collins Cannon 68mm',
                icon: 'vehicles/Collins_Cannon_68mm_Vehicle_Icon.webp',
                type: 'vehicle' // Warden
            },
            vehicle_balfour_wolfhound_40mm: {
                name: 'Balfour Wolfhound 40mm',
                icon: 'vehicles/Balfour_Wolfhound_40mm_Vehicle_Icon.webp',
                type: 'vehicle' // Warden
            },
            vehicle_balfour_falconer_250mm: {
                name: 'Balfour Falconer 250mm',
                icon: 'vehicles/Balfour_Falconer_250mm_Vehicle_Icon.webp',
                type: 'vehicle' // Warden
            },
            vehicle_niska_mk_ii_blinder: {
                name: 'Niska Mk. II Blinder',
                icon: 'vehicles/Niska_Mk._2_Blinder_Vehicle_Icon.webp',
                type: 'vehicle' // Warden
            },
            vehicle_niska_mk_i_gun_motor_carraige: {
                name: 'Niska Mk. I Gun Motor Carraige',
                icon: 'vehicles/Niska_Mk._1_Gun_Motor_Carriage_Vehicle_Icon.webp',
                type: 'vehicle' // Warden
            },
            vehicle_mulloy_lpc: {
                name: 'Mulloy LPC',
                icon: 'vehicles/Mulloy_LPC_Vehicle_Icon.webp',
                type: 'vehicle' // Warden
            },
            vehicle_devitt_mk_iii: {
                name: 'Devitt Mk. III',
                icon: 'vehicles/Devitt_Mark_III_Vehicle_Icon.webp',
                type: 'vehicle' // Warden
            },
            vehicle_gallagher_outlaw_mk_ii: {
                name: 'Gallagher Outlaw Mk. II',
                icon: 'vehicles/Gallagher_Outlaw_Mk._II_Vehicle_Icon.webp',
                type: 'vehicle' // Warden
            },
            vehicle_silverhand_mk_iv: {
                name: 'Silverhand - Mk. IV',
                icon: 'vehicles/Silverhand_-_Mk._IV_Vehicle_Icon.webp',
                type: 'vehicle' // Warden
            },
            vehicle_kivela_power_wheel_80_1: {
                name: 'Kivela Power Wheel 80-1',
                icon: 'vehicles/Kivela_Power_Wheel_80-1_Vehicle_Icon.webp',
                type: 'vehicle' // Warden
            },
            vehicle_dunne_fuelrunner_2d: {
                name: 'Dunne Fuelrunner 2d',
                icon: 'vehicles/Dunne_Fuelrunner_2d_Vehicle_Icon.webp',
                type: 'vehicle' // Warden
            },
            vehicle_king_gallant_mk_ii: {
                name: 'King Gallant Mk. II',
                icon: 'vehicles/King_Gallant_MK-II_Icon.webp',
                type: 'vehicle' // Warden
            },
            vehicle_king_spire_mk_i: {
                name: 'King Spire Mk. I',
                icon: 'vehicles/King_Spire_MK-I_Icon.webp',
                type: 'vehicle' // Warden
            },
            vehicle_drummond_100a: {
                name: 'Drummond 100a',
                icon: 'vehicles/Drummond_100a_Vehicle_Icon.webp',
                type: 'vehicle' // Warden
            },
            vehicle_dunne_leatherback_2a: {
                name: 'Dunne Leatherback 2a',
                icon: 'vehicles/Dunne_Leatherback_2a_Vehicle_Icon.webp',
                type: 'vehicle' // Warden
            },
            vehicle_dunne_loadlugger_3c: {
                name: 'Dunne Loadlugger 3c',
                icon: 'vehicles/Dunne_Loadlugger_3c_Vehicle_Icon.webp',
                type: 'vehicle' // Warden
            },
            vehicle_dunne_landrunner_12c: {
                name: 'Dunne Landrunner 12c',
                icon: 'vehicles/Dunne_Landrunner_12c_Vehicle_Icon.webp',
                type: 'vehicle' // Warden
            },
            vehicle_dunne_transport: {
                name: 'Dunne Transport',
                icon: 'vehicles/Dunne_Transport_Vehicle_Icon.webp',
                type: 'vehicle' // Warden
            },
            vehicle_huber_starbreaker_94_5m: {
                name: 'Huber Starbreaker 94.5mm',
                icon: 'vehicles/Huber_Starbreaker_945mm_Structure_Icon.webp',
                type: 'vehicle' // Warden
            },
            vehicle_balfour_stockade_75mm: {
                name: 'Balfour Stockade 75mm',
                icon: 'vehicles/FieldCannonHeavyWIcon.webp',
                type: 'vehicle' // Warden
            },
            vehicle_swallowtail_988_127_2: {
                name: 'Swallowtail 988/127-2',
                icon: 'vehicles/Swallowtail_988-145-2_Vehicle_Icon.webp',
                type: 'vehicle' // Warden
            },
            vehicle_rycker_4_3_f_wasp_nest: {
                name: 'Rycker 4/3-F Wasp Nest',
                icon: 'vehicles/FieldMultiWItemIcon.webp',
                type: 'vehicle' // Warden
            },
            vehicle_niska_rycker_mk_ix_skycaller: {
                name: 'Niska-Rycker Mk. IX Skycaller',
                icon: 'vehicles/Niska-Rycker_Vehicle_Icon.webp',
                type: 'vehicle' // Warden
            },
            vehicle_gallagher_thornfall_mk_vi: {
                name: 'Gallagher Thornfall Mk. VI',
                icon: 'vehicles/MediumTank2IndirectWIcon.webp',
                type: 'vehicle' // Warden
            },
            vehicle_material_pallet: {
                name: 'Material Pallet',
                icon: 'vehicles/Material_Pallet_Structure_Icon.webp',
                type: 'vehicle'
            },
            vehicle_bms_mineseeker: {
                name: 'BMS Mineseeker',
                icon: 'vehicles/SmallTrainLocomotiveIcon.webp',
                type: 'vehicle'
            },
            vehicle_bms_railtruck: {
                name: 'BMS Railtruck',
                icon: 'vehicles/SmallContainerCarIcon.webp',
                type: 'vehicle'
            },
            vehicle_bms_linerunner: {
                name: 'BMS Linerunner',
                icon: 'vehicles/SmallFlatbedCarIcon.webp',
                type: 'vehicle'
            },
            vehicle_bms_black_bolt: {
                name: 'BMS Black Bolt',
                icon: 'vehicles/TrainEngineVehicleIcon.webp',
                type: 'vehicle'
            },
            vehicle_bms_rockhold: {
                name: 'BMS Rockhold',
                icon: 'vehicles/TrainCoalCarVehicleIcon.webp',
                type: 'vehicle'
            },
            vehicle_bms_holdout: {
                name: 'BMS Holdout',
                icon: 'vehicles/InfantryCarVehicleIcon.webp',
                type: 'vehicle'
            },
            vehicle_bms_longrider: {
                name: 'BMS Longrider',
                icon: 'vehicles/TrainCarVehicleIcon.webp',
                type: 'vehicle'
            },
            vehicle_aegis_steelbreaker_k5a: {
                name: 'Aegis Steelbreaker K5a',
                icon: 'vehicles/CombatCarCVehicleIcon.webp',
                type: 'vehicle' // Colonial
            },
            vehicle_obrien_warsmith_v215: {
                name: 'O\'Brien Warsmith v.215',
                icon: 'vehicles/CombatCarWVehicleIcon.webp',
                type: 'vehicle' // Warden
            },
            vehicle_tempest_cannon_ra_2: {
                name: 'Tempest Cannon RA-2',
                icon: 'vehicles/TrainLRArtilleryVehicleIcon.webp',
                type: 'vehicle'
            },
            vehicle_03mm_caster: {
                name: '03MM "Caster"',
                icon: 'vehicles/03MM_Caster_Vehicle_Icon.webp',
                type: 'vehicle' // Colonial
            },
            vehicle_00ms_stinger: {
                name: '00MS "Stinger"',
                icon: 'vehicles/00MS_Stinger_Motorcycle_Vehicle_Icon.webp',
                type: 'vehicle' // Colonial
            },
            vehicle_r_1_hauler: {
                name: 'R-1 Hauler',
                icon: 'vehicles/R-1_Hauler_Vehicle_Icon.webp',
                type: 'vehicle' // Colonial
            },
            vehicle_r_5_atlas_hauler: {
                name: 'R-5 "Atlas" Hauler',
                icon: 'vehicles/R-5_Atlas_Hauler_Vehicle_Icon.webp',
                type: 'vehicle' // Colonial
            },
            vehicle_r_5b_sisyphus_hauler: {
                name: 'R-5b "Sisyphus" Hauler',
                icon: 'vehicles/R-5b_Sisyphus_Hauler_Vehicle_Icon.webp',
                type: 'vehicle' // Colonial
            },
            vehicle_r_9_speartip_escort: {
                name: 'R-9 "Speartip" Escort',
                icon: 'vehicles/R-9_Speartip_Escort_Vehicle_Icon.webp',
                type: 'vehicle' // Colonial
            },
            vehicle_t3_xiphos: {
                name: 'T3 "Xiphos"',
                icon: 'vehicles/T3_Xiphos_Vehicle_Icon.webp',
                type: 'vehicle' // Colonial
            },
            vehicle_t5_percutio: {
                name: 'T5 "Percutio"',
                icon: 'vehicles/T5_Percutio_Vehicle_Icon.webp',
                type: 'vehicle' // Colonial
            },
            vehicle_t8_gemini: {
                name: 'T8 "Gemini"',
                icon: 'vehicles/T8_Gemini_Vehicle_Icon.webp',
                type: 'vehicle' // Colonial
            },
            vehicle_t12_actaeon_tankette: {
                name: 'T12 "Actaeon" Tankette',
                icon: 'vehicles/T12_Actaeon_Tankette_Vehicle_Icon.webp',
                type: 'vehicle' // Colonial
            },
            vehicle_t20_ixion_tankette: {
                name: 'T20 "Ixion" Tankette',
                icon: 'vehicles/T20_Ixion_Tankette_Vehicle_Icon.webp',
                type: 'vehicle' // Colonial
            },
            vehicle_uv_05a_argonaut: {
                name: 'UV-05a "Argonaut"',
                icon: 'vehicles/UV-05a_Argonaut_Vehicle_Icon.webp',
                type: 'vehicle' // Colonial
            },
            vehicle_uv_5c_odyssey: {
                name: 'UV-5c "Odyssey"',
                icon: 'vehicles/UV-5c_Odyssey_Vehicle_Icon.webp',
                type: 'vehicle' // Colonial
            },
            vehicle_uv_24_icarus: {
                name: 'UV-24 "Icarus"',
                icon: 'vehicles/UV-24_Icarus_Vehicle_Icon.webp',
                type: 'vehicle' // Colonial
            },
            vehicle_hc_7_ballista: {
                name: 'HC-7 "Ballista"',
                icon: 'vehicles/HC-7_Ballista_Vehicle_Icon.webp',
                type: 'vehicle' // Colonial
            },
            vehicle_hs_2_scorpion: {
                name: 'HC-2 "Scorpion"',
                icon: 'vehicles/HC-2_Scorpion_Vehicle_Icon.webp',
                type: 'vehicle' // Colonial
            },
            vehicle_aa_2_battering_ram: {
                name: 'AA-2 "Battering Ram"',
                icon: 'vehicles/AA-2_Battering_Ram_Vehicle_Icon.webp',
                type: 'vehicle' // Colonial
            },
            vehicle_40_45_smelter: {
                name: '40-45 "Smelter"',
                icon: 'vehicles/40-45_Smelter_Heavy_Field_Gun_Vehicle_Icon.webp',
                type: 'vehicle' // Colonial
            },
            vehicle_h_5_hatchet: {
                name: 'H-5 "Hatchet"',
                icon: 'vehicles/H5_Hatchet_Vehicle_Icon.webp',
                type: 'vehicle' // Colonial
            },
            vehicle_h_19_vulcan: {
                name: 'H-19 "Vulcan"',
                icon: 'vehicles/H-19_Vulcan_Vehicle_Icon.webp',
                type: 'vehicle' // Colonial
            },
            vehicle_h_10_pelekys: {
                name: 'H-10 "Pelekys"',
                icon: 'vehicles/H-10_Pelekys_Vehicle_Icon.webp',
                type: 'vehicle' // Colonial
            },
            vehicle_h_8_kranesca: {
                name: 'H-8 "Kranesca"',
                icon: 'vehicles/H-8_Kranesca_Vehicle_Icon.webp',
                type: 'vehicle' // Colonial
            },
            vehicle_85k_b_falchion: {
                name: '85K-b "Falchion"',
                icon: 'vehicles/85K-b_Falchion_Vehicle_Icon.webp',
                type: 'vehicle' // Colonial
            },
            vehicle_85k_a_spatha: {
                name: '85K-a "Spatha"',
                icon: 'vehicles/85K-a_Spatha_Vehicle_Icon.webp',
                type: 'vehicle' // Colonial
            },
            vehicle_86k_a_bardiche: {
                name: '86K-a "Bardiche"',
                icon: 'vehicles/86K-a_Bardiche_Vehicle_Icon.webp',
                type: 'vehicle' // Colonial
            },
            vehicle_86k_c_ranseur: {
                name: '86K-c "Ranseur"',
                icon: 'vehicles/86K-c_Ranseur_Vehicle_Icon.webp',
                type: 'vehicle' // Colonial
            },
            vehicle_dae_2a_1_ruptura: {
                name: 'DAE 2a-1 "Ruptura"',
                icon: 'vehicles/DAE_2a-1_Ruptura_Structure_Icon.webp',
                type: 'vehicle' // Colonial
            },
            vehicle_ab_8_acheron: {
                name: 'AB-8 "Acheron"',
                icon: 'vehicles/AB-8_Acheron_Vehicle_Icon.webp',
                type: 'vehicle' // Colonial
            },
            vehicle_ab_11_doru: {
                name: 'AB-11 "Doru"',
                icon: 'vehicles/AB-11_Doru_Vehicle_Icon.webp',
                type: 'vehicle' // Colonial
            },
            vehicle_bms_scrap_hauler: {
                name: 'BMS - Scrap Hauler',
                icon: 'vehicles/Harvester.webp',
                type: 'vehicle' // Colonial
            },
            vehicle_t14_vesta_tankette: {
                name: 'T14 "Vesta" Tankette',
                icon: 'vehicles/T14_Vesta_Tankette_Vehicle_Icon.webp',
                type: 'vehicle' // Colonial
            },
            vehicle_r_17_retiarius_skirmisher: {
                name: 'R-17 "Retiarius" Skirmisher', // (Truck)
                icon: 'vehicles/R-17_Retiarius_Skirmisher_Vehicle_Icon.webp',
                type: 'vehicle' // Colonial
            },
            vehicle_hh_a_javelin: {
                name: 'HH-a "Javelin"', // (Half-Track)
                icon: 'vehicles/HH-a_Javelin_Vehicle_Icon.webp',
                type: 'vehicle' // Colonial
            },
            vehicle_hh_b_hoplite: {
                name: 'HH-b "Hoplite"', // (Half-Track)
                icon: 'vehicles/HH-b_Hoplite_Vehicle_Icon.webp',
                type: 'vehicle' // Colonial
            },
            vehicle_hh_d_peltast: {
                name: 'HH-d "Peltast"', // (Half-Track)
                icon: 'vehicles/HH-d_Peltast_Vehicle_Icon.webp',
                type: 'vehicle' // Colonial
            },
            vehicle_945g_stygian_bolt: {
                name: '945g "Stygian" Bolt', // (Field Gun)
                icon: 'vehicles/FieldATHeavyCIcon.webp',
                type: 'vehicle' // Colonial
            },
            vehicle_85v_g_talos: {
                name: '85V-g "Talos"', // (Assault Tank)
                icon: 'vehicles/MediumTankLargeCIcon.webp',
                type: 'vehicle' // Colonial
            },
            vehicle_dae_3b_2_hades_net: {
                name: 'DAE 3b-2 "Hades\' Net"',
                icon: 'vehicles/EmplacedMultiCStructureIcon.webp',
                type: 'vehicle' // Colonial
            },
            vehicle_lance_36_battle_tank: {
                name: 'Lance-36',
                icon: 'vehicles/Lance-36_Vehicle_Icon.webp',
                type: 'vehicle' // Colonial
            },
            vehicle_flood_mk_i: {
                name: 'Flood Mk. I',
                icon: 'vehicles/Flood_Mk-1_Vehicle_Icon.webp',
                type: 'vehicle' // Warden
            },
            vehicle_0_75b_ares_super_tank: {
                name: 'O-75b “Ares”',
                icon: 'vehicles/SuperTankCtemIcon.webp',
                type: 'vehicle' // Colonial
            },
            vehicle_cullen_predator_mk_iii: {
                name: 'Cullen Predator Mk. III',
                icon: 'vehicles/SuperTankWVehicleIcon.webp',
                type: 'vehicle' // Warden
            }
        },
        buildings: {
            foundation_corner: {
                name: 'Foundation Corner',
                description: 'A foundation for building out areas suitable for Facilities construction.', // Requires Construction Vehicle
                category: 'foundations',
                power: 0,
                width: 5,
                length: 5,
                icon: 'buildings/ConcreteFoundation02Icon.png',
                texture: 'buildings/textures/concrete_corner_meter.png',
                textureIcon: {
                    disabled: true
                },
                sortOffset: -1000,
                garrisonSupplyMultiplier: 2,
                cost: {
                    gravel: 75
                }
            },
            foundation_1x1: {
                name: 'Foundation 1x1',
                description: 'A foundation for building out areas suitable for Facilities construction.', // Requires Construction Vehicle
                category: 'foundations',
                power: 0,
                width: 5,
                length: 5,
                icon: 'buildings/ConcreteFoundation01Icon.png',
                texture: 'buildings/textures/concrete_meter.png',
                textureIcon: {
                    disabled: true
                },
                sortOffset: -1000,
                garrisonSupplyMultiplier: 2,
                cost: {
                    gravel: 75
                }
            },
            foundation_1x2: {
                name: 'Foundation 1x2',
                description: 'A foundation for building out areas suitable for Facilities construction.', // Requires Construction Vehicle
                category: 'foundations',
                power: 0,
                width: 5,
                length: 10,
                icon: 'buildings/ConcreteFoundation03Icon.png',
                texture: 'buildings/textures/concrete_meter.png',
                textureIcon: {
                    disabled: true
                },
                sortOffset: -1000,
                garrisonSupplyMultiplier: 2,
                cost: {
                    gravel: 115
                }
            },
            foundation_2x2: {
                name: 'Foundation 2x2',
                description: 'A foundation for building out areas suitable for Facilities construction.', // Requires Construction Vehicle
                category: 'foundations',
                power: 0,
                width: 10,
                length: 10,
                icon: 'buildings/ConcreteFoundation04Icon.png',
                texture: 'buildings/textures/concrete_meter.png',
                textureIcon: {
                    disabled: true
                },
                sortOffset: -1000,
                garrisonSupplyMultiplier: 2,
                cost: {
                    gravel: 150
                }
            },
            provisional_road: {
                name: 'Provisional Road',
                description: 'A temporary road used to enable vehicle access between main roads and remote bases.', // Requires Construction Vehicle
                category: 'foundations',
                power: 0,
                width: 5,
                length: 2,
                maxLength: 26,
                icon: 'buildings/ProvisionalRoadIcon.webp',
                texture: 'buildings/textures/provisional_road.png',
                textureIcon: {
                    disabled: true
                },
                garrisonSupplyMultiplier: 3,
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
                texture: 'buildings/textures/track_small_gauge.png',
                textureIcon: {
                    disabled: true
                },
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
                texture: 'buildings/textures/track_large_gauge.png',
                textureIcon: {
                    disabled: true
                },
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
                    steel_construction_material: 3
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
                production: [{
                    time: 25,
                    input: {
                        salvage: 10
                    },
                    output: {
                        construction_material: 1
                    }
                }],
                upgrades: {
                    forge: {
                        name: 'Forge',
                        power: -2,
                        icon: 'buildings/upgrades/MF_ForgeIcon.webp',
                        cost: {
                            construction_material: 200
                        },
                        production: [
                            {
                                time: 60,
                                input: {
                                    salvage: 15,
                                    coke: 75
                                },
                                output: {
                                    assembly_materials1: 1
                                }
                            },
                            {
                                time: 60,
                                input: {
                                    salvage: 15,
                                    petrol: 50
                                },
                                output: {
                                    assembly_materials2: 1
                                }
                            }
                        ]
                    },
                    metal_press: {
                        name: 'Metal Press',
                        power: -4,
                        icon: 'buildings/upgrades/MF_MetalPressIcon.webp',
                        cost: {
                            construction_material: 25
                        },
                        production: [{
                            time: 25,
                            input: {
                                salvage: 15,
                                petrol: 25
                            },
                            output: {
                                construction_material: 3
                            }
                        }]
                    },
                    smelter: {
                        name: 'Smelter',
                        power: -4,
                        icon: 'buildings/upgrades/MF_SmelterIcon.webp',
                        cost: {
                            construction_material: 25
                        },
                        production: [{
                            time: 25,
                            input: {
                                salvage: 15,
                                coke: 25
                            },
                            output: {
                                construction_material: 3
                            }
                        }]
                    },
                    recycler: {
                        name: 'Recycler',
                        power: -2,
                        icon: 'buildings/upgrades/MF_RecyclerIcon.webp',
                        cost: {
                            basic_material: 50
                        },
                        production: [
                            {
                                time: 25,
                                input: {
                                    salvage: 25
                                },
                                output: {
                                    construction_material: 1,
                                    sandbag: 5
                                }
                            },
                            {
                                time: 25,
                                input: {
                                    salvage: 25
                                },
                                output: {
                                    construction_material: 1,
                                    barbed_wire: 5
                                }
                            }
                        ]
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
                color: 0x404040, // Darker Grey
                cost: {
                    construction_material: 50
                },
                production: [{
                    time: 120,
                    input: {
                        coal: 200
                    },
                    output: {
                        coke: 180
                    }
                }],
				upgrades: {
                    coke_furnace: {
                        name: 'Coke Furnace',
                        power: -3,
                        part: 'buildings/upgrades/parts/CR_CokeFurnaceIcon.webp',
                        production: [{
                            time: 120,
                            input: {
                                coal: 200
                            },
                            output: {
                                coke: 165,
								sulfur: 15
                            }
                        }]
                    },
                    liquifier: {
                        name: 'Coal Liquifier',
                        power: -4,
                        part: 'buildings/upgrades/parts/CR_CoalLiquefierIcon.webp',
                        production: [{
                            time: 120,
                            input: {
                                coal: 300,
								water: 50
                            },
                            output: {
                                oil: 50,
								concrete_materials: 1
                            }
                        }]
                    },
                    adv_liquifier: {
                        name: 'Advanced Coal Liquifier',
                        power: -4,
                        part: 'buildings/upgrades/parts/CR_AdvancedCoalLiquefierIcon.webp',
                        production: [{
                            time: 180,
                            input: {
                                coal: 300,
								water: 100
                            },
                            output: {
                                heavy_oil: 60,
								coke: 260
                            }
                        }]
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
                color: 0x242424, // Black
                cost: {
                    construction_material: 50
                },
                production: [{
                    time: 150,
                    input: {
                        oil: 150
                    },
                    output: {
                        petrol: 150
                    }
                }],
				upgrades: {
                    reformer: {
                        name: 'Reformer',
                        power: -1,
                        part: 'buildings/upgrades/parts/OR_ReformerIcon.webp',
                        cost: {
                            construction_material: 200
                        },
                        production: [{
                            time: 150,
                            input: {
                                oil: 120,
								water: 30,
                            },
                            output: {
                                petrol: 150
                            }
                        }]
                    },
                    cracking_unit: {
                        name: 'Cracking Unit',
                        power: -1.5,
                        part: 'buildings/upgrades/parts/OR_CrackingUnitIcon.webp',
                        cost: {
                            processed_construction_material: 20
                        },
                        production: [{
                            time: 160,
                            input: {
                                oil: 150
                            },
                            output: {
                                heavy_oil: 90
                            }
                        }]
                    },
                    petro_plant: {
                        name: 'Petrochemical Plant',
                        power: -6,
                        part: 'buildings/upgrades/parts/OR_PetrochemicalPlantIcon.webp',
                        cost: {
                            steel_construction_material: 25
                        },
                        production: [{
                            time: 200,
                            input: {
                                sulfur: 60,
								heavy_oil: 30
                            },
                            output: {
                                enriched_oil: 90
                            }
                        }]
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
                overlapDist: 65,
                icon: 'buildings/MaintenanceTunnelIcon.webp',
                textureIcon: {
                    width: 96,
                    height: 96
                },
                color: 0x101010, // Black
                cost: {
                    construction_material: 200
                },
                production: [{
                    time: 450,
                    input: {
                        construction_material: 1
                    },
                    output: {
                        garrison_supplies: 20
                    }
                }]
            },
            bms_foreman_stacker: {
                name: 'BMS Foreman Stacker',
                description: 'The Foreman is an all-purpose, no-frills, easy to assemble crane. Perfect for hauling heavy loads in facilities where loading and offloading is commonplace.', // Requires Construction Vehicle + Requires Tech
                category: 'misc',
                power: -0.5,
                width: 3,
                length: 3,
                range: 24,
                icon: 'buildings/CraneIcon.webp',
                textureIcon: {
                    width: 96,
                    height: 96
                },
                color: 0x101010, // Black
                cost: {
                    processed_construction_material: 10
                }
            },
            power_pole: {
                name: 'Power Pole',
                description: 'Used to connect Power Lines together. Up to 4 Power Lines can be attached to a single pole.',
                category: 'power',
                width: 1,
                length: 1,
                icon: 'buildings/PowerPoleIcon.webp',
                textureIcon: {
                    disabled: true
                },
                cost: {
                    basic_material: 20
                },
                upgrades: {
                    lamp: {
                        name: 'Lamp',
                        part: 'buildings/upgrades/parts/PP_LampIcon.webp',
                        cost: {
                            construction_material: 5
                        }
                    }
                }
            },
            /*
            power_line: {
                name: 'Power Line',
                description: 'Conducts power between two Power Poles.',
                category: 'power',
                icon: 'buildings/PowerLineIcon.webp',
                cost: {
                    basic_material: 1
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
                production: [{
                    time: 45,
                    input: {
                        diesel: 25
                    }
                }],
                upgrades: {
                    petrol_power: {
                        name: 'Petrol Power Plant',
                        description: 'Generates a large amount of power using Petrol as input.',
                        power: 12,
                        part: 'buildings/upgrades/parts/DPP_PetrolPowerPlantIcon.webp',
                        cost: {
                            construction_material: 100
                        },
                        production: [{
                            time: 90,
                            input: {
                                petrol: 50
                            }
                        }]
                    }
                }
            },
            power_station: {
                name: 'Power Station',
                description: 'This Facility generates a large amount of power using Oil or Coal as inputs.', // Requires Construction Vehicle + Requires Tech
                category: 'power',
                power: 10,
                width: 14,
                length: 13,
                icon: 'buildings/PowerStationIcon.webp',
                textureIcon: {
                    width: 256,
                    height: 224
                },
                cost: {
                    processed_construction_material: 25
                },
                production: [
                    {
                        time: 20,
                        input: {
                            oil: 50
                        }
                    },
                    {
                        time: 90,
                        input: {
                            coal: 60,
                            water: 25
                        }
                    }
                ],
                upgrades: {
                    sulfuric_reactor: {
                        name: 'Sulfuric Reactor',
                        power: 16,
                        icon: 'buildings/upgrades/PS_SulfuricReactorIcon.webp',
                        cost: {
                            steel_construction_material: 25
                        },
                        production: [
                            {
                                time: 120,
                                input: {
                                    heavy_oil: 50
                                },
                                output: {
                                    sulfur: 5
                                }
                            },
                            {
                                time: 120,
                                input: {
                                    coal: 60,
                                    water: 25
                                },
                                output: {
                                    sulfur: 5
                                }
                            }
                        ],
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
                icon: 'buildings/StationaryHarvesterScrapIcon.webp',
                cost: {
                    construction_material: 150
                },
                production: [{
                    time: 12,
                    input: {
                        petrol: 4
                    },
                    output: {
                        salvage: 50
                    }
                }]
            },
            stationary_harvester_components: {
                name: 'Stationary Harvester (Components)',
                description: 'A stationary harvester that automatically gathers Components using Petrol as fuel.', // Requires Construction Vehicle
                category: 'harvesters',
                power: 0,
                width: 5,
                length: 7,
                icon: 'buildings/StationaryHarvesterComponentsIcon.webp',
                cost: {
                    construction_material: 175
                },
                production: [{
                    time: 12,
                    input: {
                        petrol: 4
                    },
                    output: {
                        component: 6
                    }
                }],
				upgrades: {
                    excavator: {
                        name: 'Excavator',
                        icon: 'buildings/upgrades/SHC_ExcavatorIcon.webp',
                        cost: {
                            processed_construction_material: 75
                        },
                        production: [
                            {
                                time: 12,
								input: {
									petrol: 6
								},
                                output: {
                                    damaged_component: 9
                                }
                            }
                        ]
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
                icon: 'buildings/StationaryHarvesterCoalIcon.webp',
                cost: {
                    processed_construction_material: 25
                },
                production: [{
                    time: 12,
                    input: {
                        petrol: 4
                    },
                    output: {
                        coal: 50
                    }
                }]
            },
            stationary_harvester_sulfur: {
                name: 'Stationary Harvester (Sulfur)',
                description: 'A stationary harvester that automatically gathers Sulfur using Heavy Oil as fuel.', // Requires Construction Vehicle + Requires Tech
                category: 'harvesters',
                power: 0,
                width: 5,
                length: 7,
                icon: 'buildings/StationaryHarvesterSulfurIcon.webp',
                cost: {
                    steel_construction_material: 20
                },
                production: [{
                    time: 12,
                    input: {
                        heavy_oil: 4
                    },
                    output: {
                        sulfur: 6
                    }
                }]
            },
            water_pump: {
                name: 'Water Pump',
                description: 'Pumps Water to the surface. Must be built over bodies of water.',
                category: 'harvesters',
                width: 5,
                length: 6,
                icon: 'buildings/WaterPumpIcon.webp',
                color: 0x278CE0, // Blue
                cost: {
                    construction_material: 35
                },
                production: [{
                    time: 50,
                    output: {
                        water: 50
                    }
                }],
				upgrades: {
                    electric_water: {
                        name: 'Electric Water',
						power: 0,
                        icon: 'buildings/upgrades/WP_ElectricWaterPumpIcon.webp',
                        cost: {
                            construction_material: 150
                        },
                        production: [
                            {
                                time: 50,
								power: -0.5,
                                output: {
                                    water: 60
                                }
                            },
							{
                                time: 40,
                                output: {
                                    water: 50
                                }
                            }
                        ]
                    }
                }
            },
            oil_well: {
                name: 'Oil Well',
                description: 'Extracts Oil from an underground source. Must be built near a Crude Oil field.', // Requires Construction Vehicle
                category: 'harvesters',
                width: 4,
                length: 7,
                icon: 'buildings/OilWellIcon.webp',
                color: 0x242424, // Black
                cost: {
                    construction_material: 35
                },
                production: [{
                    time: 50,
                    output: {
                        oil: 50
                    }
                }],
				upgrades: {
                    electric_oil: {
                        name: 'Electric Oil Well',
                        power: -2,
                        icon: 'buildings/upgrades/OW_ElectricOilWellIcon.webp',
                        cost: {
                            processed_construction_material: 25
                        },
                        production: [
                            {
                                time: 26,
                                output: {
                                    oil: 50
                                }
                            },
                            {
                                time: 40,
                                output: {
                                    oil: 75
                                }
                            }
                        ]
                    },
					fracking_oil: {
                        name: 'Fracking Oil Well',
                        power: -3,
                        icon: 'buildings/upgrades/OW_FrackerIcon.webp',
                        cost: {
                            steel_construction_material: 25
                        },
                        production: [
                            {
                                time: 40,
								input: {
									water: 25
								},
                                output: {
                                    oil: 100
                                }
                            },
                            {
                                time: 30,
								input: {
									water: 25
								},
                                output: {
                                    oil: 75
                                }
                            }
                        ]
                    }
                }
            },
            fuel_silo: {
                name: 'Fuel Silo',
                description: 'Stores various types of fuel, including Heavy Oil, Petrol, and Crude Oil.', // Requires Construction Vehicle + Requires Tech
                category: 'factories',
                width: 2,
                length: 3,
                icon: 'buildings/FuelSiloIcon.webp',
                textureIcon: {
                    width: 64,
                    height: 96
                },
                color: 0x101010, // Black
                cost: {
                    construction_material: 30
                },
                capacity: 500
            },
            /*
            pipeline: {
                name: 'Pipeline',
                description: 'Transports various types of liquid automatically. Can connect to other types of pipes to form networks.', // Requires Tech
                category: 'factories',
                icon: 'buildings/PipelineIcon.webp',
                cost: {
                    pipe: 1
                },
                capacity: 100
            },
            pipeline_overhead: {
                name: 'Pipeline (Overhead)',
                description: 'Transports various types of liquid automatically. Can connect to other types of pipes to form networks. This variant of pipe can be raised high above the ground but must be built on Foundations.', // Requires Tech
                category: 'factories',
                icon: 'buildings/PipelineOverheadIcon.webp',
                cost: {
                    pipe: 2
                },
                capacity: 100
            },
            pipeline_underground: {
                name: 'Pipeline (Underground)',
                description: 'Transports various types of liquid automatically. Can connect to other types of pipes to form networks. This variant of pipe can be built underground.', // Requires Tech
                category: 'factories',
                icon: 'buildings/PipelineUndergroundIcon.webp',
                garrisonSupplyMultiplier: 4,
                cost: {
                    pipe: 6
                },
                capacity: 100
            },
            pipeline_valve: {
                name: 'Pipeline Valve',
                description: 'Controls the rate of flow through a pipeline. Requires a Wrench for adjustment.', // Requires Tech
                category: 'factories',
                icon: 'buildings/PipelineValveIcon.webp',
                cost: {
                    pipe: 2
                }
            },
            */
            light_vehicle_assembly_station: {
                name: 'Light Vehicle Assembly Station',
                description: 'Allows production of a wide variety of vehicles and equipment. Production takes time and can be halted if resources are depleted. Some variants require a base vehicle to be present on the Assembly Station before production can begin. Essential vehicles and equipment are produced here.', // Requires Construction Vehicle
                category: 'factories',
                power: -2,
                width: 8,
                length: 14,
                icon: 'buildings/LightVehicleAssemblyStationIcon.webp',
                textureIcon: {
                    width: 160,
                    height: 160
                },
                color: 0x7ce1ea, // Blue
                cost: {
                    construction_material: 75
                },
                production: [
                    {
                        time: 5,
                        input: {
                            basic_material: 25
                        },
                        output: {
                            vehicle_material_pallet: 1
                        }
                    },
                    {
                        faction: 'c',
                        time: 180,
                        input: {
                            vehicle_03mm_caster: 1,
                            construction_material: 5
                        },
                        output: {
                            vehicle_00ms_stinger: 1
                        }
                    },
                    {
                        faction: 'c',
                        time: 300,
                        input: {
                            vehicle_r_1_hauler: 1,
                            construction_material: 10
                        },
                        output: {
                            vehicle_r_5_atlas_hauler: 1
                        }
                    },
                    {
                        faction: 'c',
                        time: 300,
                        input: {
                            vehicle_r_1_hauler: 1,
                            construction_material: 10
                        },
                        output: {
                            vehicle_r_5b_sisyphus_hauler: 1
                        }
                    },
                    {
                        faction: 'c',
                        time: 300,
                        input: {
                            vehicle_r_1_hauler: 1,
                            construction_material: 10
                        },
                        output: {
                            vehicle_r_9_speartip_escort: 1
                        }
                    },
                    {
                        faction: 'w',
                        time: 300,
                        input: {
                            vehicle_dunne_transport: 1,
                            construction_material: 10
                        },
                        output: {
                            vehicle_dunne_leatherback_2a: 1
                        }
                    },
                    {
                        faction: 'w',
                        time: 300,
                        input: {
                            vehicle_dunne_transport: 1,
                            construction_material: 10
                        },
                        output: {
                            vehicle_dunne_landrunner_12c: 1
                        }
                    },
                    {
                        time: 900,
                        input: {
                            construction_material: 125,
                            assembly_materials1: 10,
                            assembly_materials2: 20
                        },
                        output: {
                            vehicle_bms_mineseeker: 1
                        }
                    },
                    {
                        time: 300,
                        input: {
                            construction_material: 35,
                            assembly_materials1: 15,
                            assembly_materials2: 5
                        },
                        output: {
                            vehicle_bms_railtruck: 1
                        }
                    },
                    {
                        time: 300,
                        input: {
                            construction_material: 35,
                            assembly_materials1: 15,
                            assembly_materials2: 5
                        },
                        output: {
                            vehicle_bms_linerunner: 1
                        }
                    }
                ],
				upgrades: {
                    motor_pool: {
                        name: 'Motor Pool',
                        power: -2,
                        part: 'buildings/upgrades/parts/LVAS_MotorPoolIcon.webp',
                        cost: {
                            construction_material: 200
                        },
                        production: [
                            {
                                faction: 'c',
                                time: 300,
                                input: {
                                    vehicle_t3_xiphos: 1,
                                    processed_construction_material: 10,
                                    assembly_materials1: 10
                                },
                                output: {
                                    vehicle_t5_percutio: 1
                                }
                            },
                            {
                                faction: 'c',
                                time: 300,
                                input: {
                                    vehicle_t3_xiphos: 1,
                                    construction_material: 20,
                                    assembly_materials1: 10
                                },
                                output: {
                                    vehicle_t8_gemini: 1
                                }
                            },
                            {
                                faction: 'c',
                                time: 300,
                                input: {
                                    vehicle_t12_actaeon_tankette: 1,
                                    construction_material: 20,
                                    assembly_materials1: 15
                                },
                                output: {
                                    vehicle_t20_ixion_tankette: 1
                                }
                            },
                            {
                                faction: 'c',
                                time: 600,
                                input: {
                                    vehicle_t12_actaeon_tankette: 1,
                                    processed_construction_material: 10,
                                    assembly_materials1: 15
                                },
                                output: {
                                    vehicle_t14_vesta_tankette: 1
                                }
                            },
                            {
                                faction: 'c',
                                time: 180,
                                input: {
                                    vehicle_uv_05a_argonaut: 1,
                                    construction_material: 5
                                },
                                output: {
                                    vehicle_uv_5c_odyssey: 1
                                }
                            },
                            {
                                faction: 'c',
                                time: 180,
                                input: {
                                    vehicle_uv_05a_argonaut: 1,
                                    construction_material: 5,
                                    assembly_materials2: 10
                                },
                                output: {
                                    vehicle_uv_24_icarus: 1
                                }
                            },
                            {
                                faction: 'w',
                                time: 300,
                                input: {
                                    vehicle_obrien_v110: 1,
                                    processed_construction_material: 10,
                                    assembly_materials1: 10
                                },
                                output: {
                                    vehicle_obrien_v113: 1
                                }
                            },
                            {
                                faction: 'w',
                                time: 300,
                                input: {
                                    vehicle_obrien_v110: 1,
                                    construction_material: 5,
                                    assembly_materials1: 5
                                },
                                output: {
                                    vehicle_obrien_v121: 1
                                }
                            },
                            {
                                faction: 'w',
                                time: 300,
                                input: {
                                    vehicle_obrien_v110: 1,
                                    processed_construction_material: 10,
                                    assembly_materials1: 10
                                },
                                output: {
                                    vehicle_obrien_v130_wild_jack: 1
                                }
                            },
                            {
                                faction: 'w',
                                time: 300,
                                input: {
                                    vehicle_obrien_v110: 1,
                                    construction_material: 15,
                                    assembly_materials1: 15
                                },
                                output: {
                                    vehicle_obrien_v101_freeman: 1
                                }
                            },
                            {
                                faction: 'w',
                                time: 180,
                                input: {
                                    vehicle_drummond_100a: 1,
                                    construction_material: 3,
                                    assembly_materials2: 10
                                },
                                output: {
                                    vehicle_drummond_spitfire_100d: 1
                                }
                            },
                            {
                                faction: 'w',
                                time: 180,
                                input: {
                                    vehicle_drummond_100a: 1,
                                    construction_material: 3,
                                    assembly_materials2: 5,
                                },
                                output: {
                                    vehicle_drummond_loscann_55c: 1
                                }
                            }
                        ]
                    },
                    rocket_factory: {
                        name: 'Rocket Factory',
                        power: -2,
                        part: 'buildings/upgrades/parts/LVAS_ArtilleryFactoryIcon.webp',
                        cost: {
                            processed_construction_material: 65
                        },
                        production: [
                            {
                                faction: 'c',
                                time: 300,
                                input: {
                                    vehicle_r_1_hauler: 1,
                                    processed_construction_material: 70,
                                    assembly_materials1: 10,
                                    assembly_materials2: 8
                                },
                                output: {
                                    vehicle_r_17_retiarius_skirmisher: 1
                                }
                            },
                            {
                                faction: 'c',
                                time: 600,
                                input: {
                                    processed_construction_material: 20,
                                    assembly_materials2: 15,
                                    assembly_materials4: 3
                                },
                                output: {
                                    vehicle_dae_3b_2_hades_net: 1
                                }
                            },
                            {
                                faction: 'c',
                                time: 300,
                                input: {
                                    vehicle_hh_a_javelin: 1,
                                    processed_construction_material: 3,
                                    assembly_materials4: 3
                                },
                                output: {
                                    vehicle_hh_b_hoplite: 1
                                }
                            },
                            {
                                faction: 'c',
                                time: 300,
                                input: {
                                    vehicle_hh_a_javelin: 1,
                                    processed_construction_material: 5,
                                    assembly_materials2: 5,
                                    assembly_materials4: 3
                                },
                                output: {
                                    vehicle_hh_d_peltast: 1
                                }
                            },
                            {
                                faction: 'w',
                                time: 300,
                                input: {
                                    vehicle_niska_mk_i_gun_motor_carraige: 1,
                                    processed_construction_material: 10,
                                    assembly_materials1: 10,
                                    assembly_materials3: 8
                                },
                                output: {
                                    vehicle_niska_rycker_mk_ix_skycaller: 1
                                }
                            },
                            {
                                faction: 'w',
                                time: 600,
                                input: {
                                    processed_construction_material: 20,
                                    assembly_materials2: 15,
                                    assembly_materials4: 3
                                },
                                output: {
                                    vehicle_rycker_4_3_f_wasp_nest: 1
                                }
                            },
                            {
                                faction: 'w',
                                time: 300,
                                input: {
                                    vehicle_niska_mk_i_gun_motor_carraige: 1,
                                    processed_construction_material: 5,
                                    assembly_materials2: 10,
                                    assembly_materials4: 3
                                },
                                output: {
                                    vehicle_niska_mk_ii_blinder: 1
                                }
                            }
                        ]
                    },
                    field_station: {
                        name: 'Field Station',
                        power: -2,
                        part: 'buildings/upgrades/parts/LVAS_FieldStationIcon.webp',
                        cost: {
                            processed_construction_material: 25
                        },
                        production: [
                            {
                                time: 900,
                                input: {
                                    processed_construction_material: 90,
                                    assembly_materials4: 25,
                                },
                                output: {
                                    vehicle_bms_scrap_hauler: 1
                                }
                            },
                            {
                                faction: 'c',
                                time: 180,
                                input: {
                                    vehicle_hc_7_ballista: 1,
                                    construction_material: 15
                                },
                                output: {
                                    vehicle_hs_2_scorpion: 1
                                }
                            },
                            {
                                faction: 'c',
                                time: 300,
                                input: {
                                    vehicle_ab_8_acheron: 1,
                                    processed_construction_material: 10,
                                    assembly_materials3: 5
                                },
                                output: {
                                    vehicle_ab_11_doru: 1
                                }
                            },
                            {
                                faction: 'c',
                                time: 300,
                                input: {
                                    vehicle_aa_2_battering_ram: 1,
                                    processed_construction_material: 10,
                                    assembly_materials4: 10
                                },
                                output: {
                                    vehicle_40_45_smelter: 1
                                }
                            },
                            {
                                faction: 'w',
                                time: 300,
                                input: {
                                    vehicle_king_spire_mk_i: 1,
                                    processed_construction_material: 5,
                                    assembly_materials3: 5,
                                },
                                output: {
                                    vehicle_king_gallant_mk_ii: 1
                                }
                            },
                            {
                                faction: 'w',
                                time: 300,
                                input: {
                                    vehicle_collins_cannon_68mm: 1,
                                    processed_construction_material: 5,
                                    assembly_materials4: 5,
                                },
                                output: {
                                    vehicle_balfour_rampart_68mm: 1
                                }
                            }
                        ]
                    },
                    tank_factory: {
                        name: 'Tank Factory',
                        power: -2,
                        part: 'buildings/upgrades/parts/LVAS_TankAssemblyIcon.webp',
                        cost: {
                            processed_construction_material: 200
                        },
                        production: [
                            {
                                faction: 'c',
                                time: 300,
                                input: {
                                    vehicle_h_5_hatchet: 1,
                                    processed_construction_material: 35,
                                    assembly_materials2: 20,
                                    assembly_materials3: 10
                                },
                                output: {
                                    vehicle_h_19_vulcan: 1
                                }
                            },
                            {
                                faction: 'c',
                                time: 300,
                                input: {
                                    vehicle_h_5_hatchet: 1,
                                    processed_construction_material: 15,
                                    assembly_materials2: 20,
                                    assembly_materials3: 10
                                },
                                output: {
                                    vehicle_h_10_pelekys: 1
                                }
                            },
                            {
                                faction: 'c',
                                time: 300,
                                input: {
                                    vehicle_h_5_hatchet: 1,
                                    processed_construction_material: 10,
                                    assembly_materials1: 20,
                                    assembly_materials4: 10
                                },
                                output: {
                                    vehicle_h_8_kranesca: 1
                                }
                            },
                            {
                                faction: 'c',
                                time: 420,
                                input: {
                                    vehicle_85k_b_falchion: 1,
                                    processed_construction_material: 15,
                                    assembly_materials1: 10,
                                    assembly_materials4: 15
                                },
                                output: {
                                    vehicle_85k_a_spatha: 1
                                }
                            },
                            {
                                faction: 'c',
                                time: 420,
                                input: {
                                    vehicle_86k_a_bardiche: 1,
                                    processed_construction_material: 20,
                                    assembly_materials2: 10,
                                    assembly_materials3: 20
                                },
                                output: {
                                    vehicle_86k_c_ranseur: 1
                                }
                            },
                            {
                                faction: 'c',
                                time: 600,
                                input: {
                                    processed_construction_material: 155,
                                    assembly_materials3: 10,
                                    assembly_materials4: 25
                                },
                                output: {
                                    vehicle_dae_2a_1_ruptura: 1
                                }
                            },
                            {
                                faction: 'w',
                                time: 420,
                                input: {
                                    vehicle_noble_widow_mk_xiv: 1,
                                    processed_construction_material: 10,
                                    assembly_materials1: 10,
                                    assembly_materials3: 15
                                },
                                output: {
                                    vehicle_noble_firebrand_mk_xvii: 1
                                }
                            },
                            {
                                faction: 'w',
                                time: 300,
                                input: {
                                    vehicle_devitt_mk_iii: 1,
                                    processed_construction_material: 8,
                                    assembly_materials2: 20,
                                    assembly_materials3: 5
                                },
                                output: {
                                    vehicle_devitt_ironhide_mk_iv: 1
                                }
                            },
                            {
                                faction: 'w',
                                time: 300,
                                input: {
                                    vehicle_devitt_mk_iii: 1,
                                    processed_construction_material: 3,
                                    assembly_materials1: 20,
                                    assembly_materials4: 3
                                },
                                output: {
                                    vehicle_devitt_caine_mk_iv_mmr: 1
                                }
                            },
                            {
                                faction: 'w',
                                time: 420,
                                input: {
                                    vehicle_silverhand_mk_iv: 1,
                                    processed_construction_material: 5,
                                    assembly_materials1: 10,
                                    assembly_materials4: 8
                                },
                                output: {
                                    vehicle_silverhand_chieftain_mk_vi: 1
                                }
                            },
                            {
                                faction: 'w',
                                time: 420,
                                input: {
                                    vehicle_gallagher_outlaw_mk_ii: 1,
                                    processed_construction_material: 5,
                                    assembly_materials2: 10,
                                    assembly_materials3: 5
                                },
                                output: {
                                    vehicle_gallagher_highwayman_mk_iii: 1
                                }
                            },
                            {
                                faction: 'w',
                                time: 600,
                                input: {
                                    processed_construction_material: 135,
                                    assembly_materials1: 10,
                                    assembly_materials4: 15
                                },
                                output: {
                                    vehicle_huber_starbreaker_94_5m: 1
                                }
                            }
                        ]
                    },
                    weapons_platform: {
                        name: 'Weapons Platform',
                        power: -2,
                        part: 'buildings/upgrades/parts/LVAS_WeaponsPlatformAssemblyIcon.webp',
                        cost: {
                            steel_construction_material: 20
                        },
                        production: [
                            {
                                faction: 'c',
                                time: 420,
                                input: {
                                    vehicle_aa_2_battering_ram: 1,
                                    steel_construction_material: 15,
                                    assembly_materials2: 20,
                                    assembly_materials3: 15
                                },
                                output: {
                                    vehicle_945g_stygian_bolt: 1
                                }
                            },
                            {
                                faction: 'c',
                                time: 600,
                                input: {
                                    vehicle_85k_b_falchion: 1,
                                    assembly_materials1: 10,
                                    assembly_materials4: 15
                                },
                                output: {
                                    vehicle_85v_g_talos: 1
                                }
                            },
                            {
                                faction: 'w',
                                time: 420,
                                input: {
                                    vehicle_balfour_wolfhound_40mm: 1,
                                    steel_construction_material: 15,
                                    assembly_materials2: 20,
                                    assembly_materials3: 15
                                },
                                output: {
                                    vehicle_balfour_stockade_75mm: 1
                                }
                            },
                            {
                                faction: 'w',
                                time: 600,
                                input: {
                                    vehicle_gallagher_outlaw_mk_ii: 1,
                                    steel_construction_material: 10,
                                    assembly_materials1: 10,
                                    assembly_materials4: 15
                                },
                                output: {
                                    vehicle_gallagher_thornfall_mk_vi: 1
                                }
                            }
                        ]
                    }
                }
            },
            large_assembly_factory: {
                name: 'Large Assembly Factory',
                description: 'Allows production of a wide variety of vehicles and equipment. Production takes time and can be halted if resources are depleted. Some variants require a base vehicle to be present on the Assembly Station before production can begin. Advanced vehicles like heavy tank classes and trains are produced here.', // Requires Tech
                category: 'factories',
                width: 9,
                length: 20,
                icon: 'buildings/LargeAssemblyFactoryIcon.webp',
                textureIcon: {
                    width: 160,
                    height: 160
                },
                color: 0x7ce1ea, // Blue
                cost: {
                    processed_construction_material: 250
                },
                production: [
                    {
                        time: 21600,
                        input: {
                            processed_construction_material: 200,
                            assembly_materials1: 60,
                            assembly_materials4: 50
                        },
                        output: {
                            vehicle_bms_black_bolt: 1
                        }
                    },
                    {
                        time: 1800,
                        input: {
                            processed_construction_material: 20,
                            assembly_materials2: 15,
                            assembly_materials3: 5
                        },
                        output: {
                            vehicle_bms_rockhold: 1
                        }
                    },
                    {
                        time: 1800,
                        input: {
                            processed_construction_material: 20,
                            assembly_materials2: 15,
                            assembly_materials3: 5
                        },
                        output: {
                            vehicle_bms_holdout: 1
                        }
                    },
                    {
                        time: 1800,
                        input: {
                            processed_construction_material: 20,
                            assembly_materials2: 15,
                            assembly_materials3: 10
                        },
                        output: {
                            vehicle_bms_longrider: 1
                        }
                    }
                ],
                upgrades: {
                    train_assembly: {
                        name: 'Train Assembly',
                        part: 'buildings/upgrades/parts/LAF_TrainAssemblyIcon.webp',
                        cost: {
                            steel_construction_material: 150
                        },
                        production: [
                            {
                                faction: 'c',
                                time: 1800,
                                input: {
                                    steel_construction_material: 30,
                                    assembly_materials1: 30,
                                    assembly_materials4: 30
                                },
                                output: {
                                    vehicle_aegis_steelbreaker_k5a: 1
                                }
                            },
                            {
                                faction: 'w',
                                time: 0, // Need time for this.
                                input: {
                                    steel_construction_material: 30,
                                    assembly_materials1: 30,
                                    assembly_materials4: 30
                                },
                                output: {
                                    vehicle_obrien_warsmith_v215: 1
                                }
                            },
                            {
                                time: 259200,
                                input: {
                                    steel_construction_material: 285,
                                    assembly_materials3: 95,
                                    assembly_materials4: 105,
                                    assembly_materials4: 175
                                },
                                output: {
                                    vehicle_tempest_cannon_ra_2: 1
                                }
                            }
                        ]
                    },
                    heavy_tank_assembly: {
                        name: 'Heavy Tank Assembly',
                        part: 'buildings/upgrades/parts/LAF_HeavyTankAssemblyIcon.webp',
                        cost: {
                            steel_construction_material: 150
                        },
                        production: [
                            {
                                faction: 'c',
                                time: 64800,
                                input: {
                                    steel_construction_material: 50,
                                    assembly_materials3: 30,
                                    assembly_materials4: 60,
                                    assembly_materials5: 35
                                },
                                output: {
                                    vehicle_lance_36_battle_tank: 1
                                }
                            },
                            {
                                faction: 'w',
                                time: 0, // Need time this.
                                input: {
                                    steel_construction_material: 50,
                                    assembly_materials3: 30,
                                    assembly_materials4: 60,
                                    assembly_materials5: 35
                                },
                                output: {
                                    vehicle_flood_mk_i: 1
                                }
                            },
                            {
                                faction: 'c',
                                time: 172800,
                                input: {
                                    steel_construction_material: 275,
                                    assembly_materials3 : 105,
                                    assembly_materials4: 95,
                                    assembly_materials5: 175
                                },
                                output: {
                                    vehicle_0_75b_ares_super_tank: 1
                                }
                            },
                            {
                                faction: 'w',
                                time: 0, // Need time for this.
                                input: {
                                    steel_construction_material: 275,
                                    assembly_materials3: 105,
                                    assembly_materials4: 95,
                                    assembly_materials5: 175
                                },
                                output: {
                                    vehicle_cullen_predator_mk_iii: 1
                                }
                            }
                        ]
                    }
                }
            },
            ammunition_factory: {
                name: 'Ammunition Factory',
                description: 'A factory that produces various types of heavy and advanced ammunition.', // Requires Construction Vehicle + Requires Tech
                category: 'factories',
                width: 7,
                length: 14,
                power: -4,
                icon: 'buildings/AmmunitionFactoryIcon.webp',
                cost: {
                    processed_construction_material: 25
                },
                production: [
                    {
                        time: 25,
                        input: {
                            heavy_explosive_material: 1,
                            construction_material: 1
                        },
                        output: {
                            ammo_flame: 1
                        }
                    },
                    {
                        time: 30,
                        input: {
                            heavy_explosive_material: 6,
                            construction_material: 1
                        },
                        output: {
                            ammo_250mm: 1
                        }
                    }
                ],
                upgrades: {
                    rocket_factory: {
                        name: 'Rocket Factory',
                        power: -4,
                        icon: 'buildings/upgrades/AF_RocketFactoryIcon.webp',
                        cost: {
                            processed_construction_material: 35
                        },
                        production: [
                            {
                                time: 25,
                                input: {
                                    heavy_explosive_material: 1,
                                    construction_material: 2
                                },
                                output: {
                                    ammo_3c_high_explosive_rocket: 1
                                }
                            },
                            {
                                time: 25,
                                input: {
                                    heavy_explosive_material: 1,
                                    construction_material: 2
                                },
                                output: {
                                    ammo_4c_fire_rocket: 1
                                }
                            }
                        ]
                    },
                    large_shell_factory: {
                        name: 'Large Shell Factory',
                        power: -4,
                        icon: 'buildings/upgrades/AF_LargeShellFactoryIcon.webp',
                        cost: {
                            processed_construction_material: 175
                        },
                        production: [
                            {
                                time: 25,
                                input: {
                                    heavy_explosive_material: 2,
                                    construction_material: 2
                                },
                                output: {
                                    ammo_75mm: 1
                                }
                            },
                            {
                                time: 25,
                                input: {
                                    heavy_explosive_material: 2,
                                    construction_material: 2
                                },
                                output: {
                                    ammo_94_5mm: 1
                                }
                            },
                            {
                                time: 25,
                                input: {
                                    heavy_explosive_material: 6,
                                    construction_material: 4
                                },
                                output: {
                                    ammo_300mm: 1
                                }
                            },
                            {
                                time: 15,
                                input: {
                                    explosive_material: 3,
                                    construction_material: 2
                                },
                                output: {
                                    ammo_120mm: 1
                                }
                            },
                            {
                                time: 20,
                                input: {
                                    heavy_explosive_material: 2,
                                    construction_material: 3
                                },
                                output: {
                                    ammo_150mm: 1
                                }
                            }
                        ]
                    }
                }
            },
            metalworks_factory: {
                name: 'Metalworks Factory',
                description: 'It takes an input of Construction Materials and outputs small amount of a Processed Construction Materials used in Tier 2 Facilities construction.', // Requires Construction Vehicle + Requires Tech
                category: 'factories',
                power: -5,
                width: 9,
                length: 12,
                icon: 'buildings/MetalworksFactoryIcon.webp',
                textureIcon: {
                    width: 160,
                    height: 160
                },
                cost: {
                    construction_material: 125
                },
                production: [
                    {
                        time: 60,
                        input: {
                            construction_material: 3,
                            component: 20
                        },
                        output: {
                            processed_construction_material: 1
                        }
                    },
                    {
                        time: 120,
                        input: {
                            processed_construction_material: 3,
                        },
                        output: {
                            pipe: 1
                        }
                    }
                ],
                upgrades: {
                    blast_furnace: {
                        name: 'Blast Furnace',
                        power: -5,
                        icon: 'buildings/upgrades/MWF_BlastFurnaceIcon.webp',
                        cost: {
                            processed_construction_material: 200
                        },
                        production: [
                            {
                                time: 120,
                                input: {
                                    processed_construction_material: 1,
                                    heavy_oil: 66
                                },
                                output: {
                                    assembly_materials4: 1
                                }
                            },
                            {
                                time: 120,
                                input: {
                                    construction_material: 3,
                                    sulfur: 20
                                },
                                output: {
                                    assembly_materials3: 1
                                }
                            },
                            {
                                time: 60,
                                power: -8,
                                input: {
                                    construction_material: 3,
                                    component: 55,
                                    heavy_oil: 6
                                },
                                output: {
                                    processed_construction_material: 3
                                }
                            }
                        ]
                    },
                    recycler: {
                        name: 'Recycler',
                        power: -5,
                        icon: 'buildings/upgrades/MWF_RecyclerIcon.webp',
                        cost: {
                            construction_material: 25
                        },
                        production: [
                            {
                                time: 60,
                                input: {
                                    construction_material: 3,
                                    component: 20
                                },
                                output: {
                                    processed_construction_material: 1,
                                    metal_beam: 1
                                }
                            },
                            {
                                power: -4,
                                time: 90,
                                input: {
                                    damaged_component: 30,
                                },
                                output: {
                                    component: 20
                                }
                            }
                        ]
                    },
                    engineering_station: {
                        name: 'Engineering Station',
                        power: -9,
                        icon: 'buildings/upgrades/MWF_EngineeringStationIcon.webp',
                        cost: {
                            processed_construction_material: 150
                        },
                        production: [
                            {
                                time: 90,
                                input: {
                                    processed_construction_material: 3,
                                    coke: 200,
                                    sulfur: 65,
                                    heavy_oil: 35
                                },
                                output: {
                                    steel_construction_material: 1
                                }
                            },
                            {
                                power: -12,
                                time: 90,
                                input: {
                                    processed_construction_material: 9,
                                    coke: 375,
                                    enriched_oil: 90,
                                    water: 100
                                },
                                output: {
                                    steel_construction_material: 3
                                }
                            },
                            {
                                power: -8,
                                time: 120,
                                input: {
                                    steel_construction_material: 3,
                                    coke: 245,
                                    assembly_materials1: 15,
                                    assembly_materials2: 15
                                },
                                output: {
                                    assembly_materials5: 1
                                }
                            }
                        ]
                    }
                }
            },
            field_modification_center: {
                name: 'Field Modification Center',
                description: 'Vehicles can be further upgraded into higher tiers using this Facility. Higher tier vehicles have improved durability.', // Requires Construction Vehicle + Requires Tech
                category: 'factories',
                power: -8,
                width: 10,
                length: 16,
                icon: 'buildings/FieldModificationCenterIcon.webp',
                textureIcon: {
                    width: 160,
                    height: 160
                },
                color: 0x7ce1ea, // Blue
                cost: {
                    processed_construction_material: 250
                }
            },
            resource_transfer_station: {
                name: 'Resource Transfer Station',
                description: 'Used for storing raw resources for transfer into and out of Facilities. The stockpile for this structure can be reserved.', // Requires Construction Vehicle
                category: 'factories',
                icon: 'buildings/ResourceTransferStationIcon.webp',
                texture: 'buildings/textures/ResourceTransferStationTexture.jpg',
                textureIcon: {
                    y: -52
                },
                width: 6,
                length: 9.5,
                color: 0x7cea92, // Green
                cost: {
                    construction_material: 35
                }
            },
            material_transfer_station: {
                name: 'Material Transfer Station',
                description: 'Used for storing materials for transfer into and out of Facilities. The stockpile for this structure can be reserved.', // Requires Construction Vehicle
                category: 'factories',
                icon: 'buildings/MaterialTransferStationIcon.webp',
                texture: 'buildings/textures/MaterialTransferStationTexture.jpg',
                textureIcon: {
                    y: -52
                },
                width: 6,
                length: 12,
                color: 0x7cea92, // Green
                cost: {
                    construction_material: 35
                }
            },
            liquid_transfer_station: {
                name: 'Liquid Transfer Station',
                description: 'Used for storing materials for transfer into and out of Facilities. The stockpile for this structure can be reserved.', // Requires Construction Vehicle
                category: 'factories',
                icon: 'buildings/LiquidTransferStationIcon.webp',
                texture: 'buildings/textures/LiquidTransferStationTexture.jpg',
                textureIcon: {
                    y: -52
                },
                width: 6,
                length: 8.5,
                color: 0x7cea92, // Green
                cost: {
                    construction_material: 35
                }
            },
            /*
            large_crane: {
                name: 'Large Crane',
                description: 'TBD', // Requires Tech
                category: 'factories',
                cost: {
                    steel_construction_material: 35
                }
            },
            */
            sound_test: {
                name: 'Sus',
                category: 'misc',
                hideInList: true,
                power: 0,
                width: 2,
                length: 2,
                texture: {
                    sheet: 'buildings/textures/sus.png',
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

            if (objectDataKey == 'buildings' && data.production) {
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

        objectList.sort((a, b) => {
            return a.name.localeCompare(b.name);
        });
        
        if (objectDataKey === 'buildings') {
            objectList.sort((a, b) => buildingCategories[a.category].order - buildingCategories[b.category].order);
        }
    }
})();