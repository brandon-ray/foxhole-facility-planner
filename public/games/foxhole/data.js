const gameData = {
	"categories": {
		"presets": {
			"name": "Modules",
			"hideInBuildingList": true,
			"icon": "game/Textures/UI/Menus/IconFilterModules.webp"
		},
		"defenses": {
			"name": "Defenses",
			"buildCategory": "Defense",
			"icon": "game/Textures/UI/Menus/IconFilterDefense.webp"
		},
		"entrenchments": {
			"name": "Entrenchments",
			"buildCategory": "Bunker",
			"icon": "game/Textures/UI/Menus/IconFilterBunker.webp"
		},
		"misc": {
			"name": "Utilities",
			"buildCategory": true,
			"icon": "game/Textures/UI/Menus/IconFilterGeneral.webp"
		},
		"factories": {
			"name": "Facilities",
			"buildCategory": "Facility",
			"icon": "game/Textures/UI/Menus/IconFilterFacility.webp"
		},
		"harvesters": {
			"name": "Harvesters",
			"buildCategory": "Mining",
			"icon": "game/Textures/UI/Menus/IconFilterMining.webp"
		},
		"power": {
			"name": "Power",
			"buildCategory": "Power",
			"icon": "game/Textures/UI/Menus/IconFilterPower.webp"
		},
		"foundations": {
			"name": "Foundations",
			"buildCategory": "Foundation",
			"icon": "game/Textures/UI/Menus/IconFilterFoundation.webp"
		},
		"shippables": {
			"name": "Shippables",
			"buildCategory": "Shippables",
			"icon": "game/Textures/UI/Menus/IconFilterShippingContainer.webp"
		},
		"vehicles": {
			"name": "Vehicles",
			"hideInBuildingList": true,
			"icon": "game/Textures/UI/Menus/IconFilterVehicle.webp"
		},
		"trains": {
			"name": "Locomotives",
			"hideInBuildingList": true,
			"icon": "game/Textures/UI/VehicleIcons/SmallGaugeEngineVehicleIcon.webp"
		},
		"world": {
			"name": "References",
			"icon": "game/Textures/UI/Menus/IconFilterGarrisonHouse.webp"
		},
		"showcase": {
			"name": "Showcase",
			"hideInBuildingList": true,
			"icon": "game/Textures/UI/Menus/IconFilterShowcase.webp"
		}
	},
	"presets": {
		"classic_storm_cannon": {
			"name": "Classic Storm Cannon",
			"description": "Storm Cannon setup with corner howitzers.",
			"author": "Stonefox",
			"module": true
		},
		"classic_intel_center": {
			"name": "Classic Intelligence Center",
			"description": "Intelligence Center setup with corner howitzers.",
			"author": "Stonefox",
			"module": true
		},
		"360_zero": {
			"name": "360 ZERO",
			"description": "Cheap, Effective, Practical.",
			"author": "Unknown",
			"module": true
		},
		"360_one": {
			"name": "360 ONE",
			"description": "The older brother of the zero, more expensive, but more aggressive.",
			"author": "Unknown",
			"module": true
		},
		"360_dual": {
			"name": "360 DUAL",
			"description": "Retains compactness while significantly augmenting resistance to artillery.",
			"author": "AllShallKneel",
			"module": true
		},
		"long_shall": {
			"name": "LongShall",
			"description": "Did somebody say compact? While this bunker sacrifices some coverage for extreme density, it does so marvelously.",
			"author": "AllShallKneel",
			"module": true
		},
		"inique": {
			"name": "Inique",
			"description": "Hard hitting, compact, great coverage, this bunker proves that absolute efficiency is indifferent to symmetry.",
			"author": "AllShallKneel",
			"module": true
		},
		"mini_obs": {
			"name": "miniObs",
			"description": "Extremely lightweight, but provides RG coverage at the bare minimum cost.",
			"author": "AllShallKneel",
			"module": true
		},
		"halberd_bunker": {
			"name": "\"Halberd\" Bunker",
			"description": "A common reliable defensive bunker pattern.",
			"author": "Unknown",
			"module": true
		},
		"xi_observation_bunker1": {
			"name": "XI Observation Bunker",
			"description": "Simple observation bunker split into two pieces to help with integrity (especially if left T2). Only 2 RGs can be lit, but that should be enough to prevent anyone from slipping into the bunker without suppression.",
			"author": "nondidjos",
			"module": true
		},
		"m_bunker_t3": {
			"name": "\"M\" Bunker T3",
			"description": "Wide concrete bunker. This bunker has a lower garrison density but is better for wide fronts.",
			"author": "Stonefox",
			"module": true
		},
		"squid_bunker_t2_1": {
			"name": "\"Squid\" Bunker T2",
			"description": "Fragile but hard hitting T2 bunker.",
			"author": "Stonefox",
			"module": true
		},
		"squid_bunker_t3": {
			"name": "\"Squid\" Bunker T3",
			"description": "Conversion for T2 version but not purpose built concrete structure. This is more an upgrade for the T2 \"Squid\", not recommended if you plan for concrete.",
			"author": "Stonefox",
			"module": true
		},
		"bunker_w_module": {
			"name": "\"W\" Bunker",
			"description": "A meta bunker design that has lots of health with great structural integrity and defenses.",
			"author": "Unknown",
			"module": true
		},
		"compact_corner_bunker": {
			"name": "Compact Corner Bunker",
			"description": "This is a compact AT, MG and HG corner design that covers a 90 degree angle. This design is meant to be integrated into a straight line defence without wasting any space, or making any concessions on defence. Corner cutting is needed in the middle where 4 corner cuts are needed, but are easy to do. Do note that this design is only viable at the concrete tier.",
			"author": "Danetello",
			"module": true
		},
		"obs_bunker": {
			"name": "OBS Bunker",
			"description": "Standard observation bunker. Power only 2 rifle garrisons and the OBS bunker.",
			"author": "Unknown",
			"module": true
		},
		"locomotive_factory_by_eg0611": {
			"name": "Locomotive Factory",
			"description": "A facility that is capable to build Black Bolt, Longrider, Holdout, Rockhold and Roadhouse and their necessary manufacturing materials. 4 independent power systems allow facility to be functional 7/24.",
			"author": "EG0611"
		},
		"m_bunker_w_trenches": {
			"name": "\"M\" Bunker w/ Trenches",
			"description": "Wide concrete bunker with trench support.",
			"author": "Stonefox"
		},
		"t2_courtyard": {
			"name": "T2 Courtyard",
			"description": "A courtyard T2 bunker layout for early - mid war.",
			"author": "Stonefox"
		},
		"t2_or_t3_halberd_trench_designs": {
			"name": "T2 / T3 Halberd Trench Designs",
			"description": "Using the Halberd bunker design here are some trenches you can use to connect them, varying in amount of emplacements.",
			"author": "Stonefox"
		},
		"t2_oil_field": {
			"name": "T2 Oil Field",
			"description": "Supply the whole back line with petrol! Basic Oil field at tier 2 facilities with 6 oil reformer and 1 cracking unit, never waste a drop of oil anymore.",
			"author": "[5th] Menxs"
		},
		"small_munition_factory": {
			"name": "Small Munition Factory",
			"description": "Small one man Facility with Low Gsupps cost of 432 for 24h when the lvl 3 Encampment is reached.",
			"author": "Oberst_Den"
		},
		"frontline_sandbag_factory": {
			"name": "Frontline Sandbag Factory",
			"description": "Simple, easy to maintain frontline sandbag factory. Heavily based off of Small Munition Factory by Oberst_Den",
			"author": "runningpeanuts"
		},
		"compact_coal_liquefaction": {
			"name": "Compact Coal Liquefaction",
			"description": "Produce coal with the power of coal! You can easily power this setup with a coal power station and an extra water pump for \"automatic\" coal. The coal to coal conversion factor is of ≃2.6. Taking into account power the multiplier is of ≃2.286",
			"author": "[5th] Menxs"
		},
		"5mw_80h_drip_power": {
			"name": "5mw 80h Drip Power",
			"description": "Very useful to ease maintenance. This Design will be producing power ≃50% of the time, maintenance tunnels on its grid will be generating ≃80 Gsups/h and fuel will last twice as much (80h)",
			"author": "[5th] Menxs"
		},
		"coastal_storage_facility_by_eg0611": {
			"name": "Coastal Storage Facility",
			"description": "A small facility with only purpose of storing items. No power production and consumption. It depends nearby bunker base for GSUPS usage.",
			"author": "EG0611"
		},
		"simple_vehicle_factory": {
			"name": "Simple Vehicle Factory (Example)",
			"description": "A simple vehicle factory to output upgraded vehicles per hour. This is an example of a preset for the planner. Contribute your own saves to our Discord!",
			"author": "Jimbo"
		},
		"panzer_snares": {
			"name": "Panzer Snares",
			"author": "KitsunePanzer",
			"module": true
		},
		"small_artillery_facility": {
			"name": "Small Artillery Facility",
			"description": "A small and simple design that doesn't take up much space or Msupps.",
			"author": "Trooper"
		},
		"small_tripod_facility": {
			"name": "Small Tripod Facility",
			"description": "A variant to the Small Artillery Facility I made, this one allows you to mass produce tripod weapons",
			"author": "Trooper"
		}
	},
	"maps": {
		"acrithiahex": {
			"name": "Acrithia",
			"regionId": 30,
			"icon": "game/Textures/UI/HexMaps/Icons/MapAcrithiaHex.webp",
			"texture": "game/Textures/UI/HexMaps/Processed/MapAcrithiaHex.png",
			"gridCoord": {
				"x": 1,
				"y": 2
			}
		},
		"allodsbighthex": {
			"name": "Allod's Bight",
			"regionId": 21,
			"icon": "game/Textures/UI/HexMaps/Icons/MapAllodsBightHex.webp",
			"texture": "game/Textures/UI/HexMaps/Processed/MapAllodsBightHex.png",
			"gridCoord": {
				"x": 2,
				"y": 0
			}
		},
		"ashfieldshex": {
			"name": "Ash Fields",
			"regionId": 41,
			"icon": "game/Textures/UI/HexMaps/Icons/MapAshFieldsHex.webp",
			"texture": "game/Textures/UI/HexMaps/Processed/MapAshFieldsHex.png",
			"gridCoord": {
				"x": -2,
				"y": 3
			}
		},
		"basinsionnachhex": {
			"name": "Basin Sionnach",
			"regionId": 34,
			"icon": "game/Textures/UI/HexMaps/Icons/MapBasinSionnachHex.webp",
			"texture": "game/Textures/UI/HexMaps/Processed/MapBasinSionnachHex.png",
			"gridCoord": {
				"x": 0,
				"y": -3
			}
		},
		"callahanspassagehex": {
			"name": "Callahan's Passage",
			"regionId": 4,
			"icon": "game/Textures/UI/HexMaps/Icons/MapCallahansPassageHex.webp",
			"texture": "game/Textures/UI/HexMaps/Processed/MapCallahansPassageHex.png",
			"gridCoord": {
				"x": 0,
				"y": -1
			}
		},
		"callumscapehex": {
			"name": "Callum's Cape",
			"regionId": 32,
			"icon": "game/Textures/UI/HexMaps/Icons/MapCallumsCapeHex.webp",
			"texture": "game/Textures/UI/HexMaps/Processed/MapCallumsCapeHex.png",
			"gridCoord": {
				"x": -2,
				"y": -1
			}
		},
		"clansheadvalleyhex": {
			"name": "Clanshead Valley",
			"regionId": 36,
			"icon": "game/Textures/UI/HexMaps/Icons/MapClansheadValleyHex.webp",
			"texture": "game/Textures/UI/HexMaps/Processed/MapClansheadValleyHex.png",
			"gridCoord": {
				"x": 2,
				"y": -3
			}
		},
		"deadlandshex": {
			"name": "Deadlands",
			"regionId": 3,
			"icon": "game/Textures/UI/HexMaps/Icons/MapDeadlandsHex.webp",
			"texture": "game/Textures/UI/HexMaps/Processed/MapDeadlandsHex.png",
			"gridCoord": {
				"x": 0,
				"y": 0
			}
		},
		"drownedvalehex": {
			"name": "The Drowned Vale",
			"regionId": 23,
			"icon": "game/Textures/UI/HexMaps/Icons/MapDrownedValeHex.webp",
			"texture": "game/Textures/UI/HexMaps/Processed/MapDrownedValeHex.png",
			"gridCoord": {
				"x": 1,
				"y": 0
			}
		},
		"endlessshorehex": {
			"name": "Endless Shore",
			"regionId": 20,
			"icon": "game/Textures/UI/HexMaps/Icons/MapEndlessShoreHex.webp",
			"texture": "game/Textures/UI/HexMaps/Processed/MapEndlessShoreHex.png",
			"gridCoord": {
				"x": 2,
				"y": -1
			}
		},
		"farranaccoasthex": {
			"name": "Farranac Coast",
			"regionId": 13,
			"icon": "game/Textures/UI/HexMaps/Icons/MapFarranacCoastHex.webp",
			"texture": "game/Textures/UI/HexMaps/Processed/MapFarranacCoastHex.png",
			"gridCoord": {
				"x": -2,
				"y": 1
			}
		},
		"fishermansrowhex": {
			"name": "Fisherman's Row",
			"regionId": 15,
			"icon": "game/Textures/UI/HexMaps/Icons/MapFishermansRowHex.webp",
			"texture": "game/Textures/UI/HexMaps/Processed/MapFishermansRowHex.png",
			"gridCoord": {
				"x": -3,
				"y": 2
			}
		},
		"godcroftshex": {
			"name": "Godcrofts",
			"regionId": 19,
			"icon": "game/Textures/UI/HexMaps/Icons/MapGodcroftsHex.webp",
			"texture": "game/Textures/UI/HexMaps/Processed/MapGodcroftsHex.png",
			"gridCoord": {
				"x": 3,
				"y": -2
			}
		},
		"greatmarchhex": {
			"name": "Great March",
			"regionId": 17,
			"icon": "game/Textures/UI/HexMaps/Icons/MapGreatMarchHex.webp",
			"texture": "game/Textures/UI/HexMaps/Processed/MapGreatMarchHex.png",
			"gridCoord": {
				"x": 0,
				"y": 2
			}
		},
		"heartlandshex": {
			"name": "The Heartlands",
			"regionId": 8,
			"icon": "game/Textures/UI/HexMaps/Icons/MapHeartlandsHex.webp",
			"texture": "game/Textures/UI/HexMaps/Processed/MapHeartlandsHex.png",
			"gridCoord": {
				"x": -1,
				"y": 2
			}
		},
		"howlcountyhex": {
			"name": "Howl County",
			"regionId": 35,
			"icon": "game/Textures/UI/HexMaps/Icons/MapHowlCountyHex.webp",
			"texture": "game/Textures/UI/HexMaps/Processed/MapHowlCountyHex.png",
			"gridCoord": {
				"x": 1,
				"y": -3
			}
		},
		"kalokaihex": {
			"name": "Kalokai",
			"regionId": 40,
			"icon": "game/Textures/UI/HexMaps/Icons/MapKalokaiHex.webp",
			"texture": "game/Textures/UI/HexMaps/Processed/MapKalokaiHex.png",
			"gridCoord": {
				"x": 0,
				"y": 3
			}
		},
		"linnmercyhex": {
			"name": "The Linn of Mercy",
			"regionId": 10,
			"icon": "game/Textures/UI/HexMaps/Icons/MapLinnMercyHex.webp",
			"texture": "game/Textures/UI/HexMaps/Processed/MapLinnMercyHex.png",
			"gridCoord": {
				"x": -1,
				"y": 0
			}
		},
		"lochmorhex": {
			"name": "Loch Mór",
			"regionId": 9,
			"icon": "game/Textures/UI/HexMaps/Icons/MapLochMorHex.webp",
			"texture": "game/Textures/UI/HexMaps/Processed/MapLochMorHex.png",
			"gridCoord": {
				"x": -1,
				"y": 1
			}
		},
		"marbanhollow": {
			"name": "Marban Hollow",
			"regionId": 5,
			"icon": "game/Textures/UI/HexMaps/Icons/MapMarbanHollow.webp",
			"texture": "game/Textures/UI/HexMaps/Processed/MapMarbanHollow.png",
			"gridCoord": {
				"x": 1,
				"y": -1
			}
		},
		"mooringcountyhex": {
			"name": "The Moors",
			"regionId": 7,
			"icon": "game/Textures/UI/HexMaps/Icons/MapMooringCountyHex.webp",
			"texture": "game/Textures/UI/HexMaps/Processed/MapMooringCountyHex.png",
			"gridCoord": {
				"x": -1,
				"y": -1
			}
		},
		"morgenscrossinghex": {
			"name": "Morgen's Crossing",
			"regionId": 37,
			"icon": "game/Textures/UI/HexMaps/Icons/MapMorgensCrossingHex.webp",
			"texture": "game/Textures/UI/HexMaps/Processed/MapMorgensCrossingHex.png",
			"gridCoord": {
				"x": 3,
				"y": -3
			}
		},
		"nevishlinehex": {
			"name": "Nevish Line",
			"regionId": 29,
			"icon": "game/Textures/UI/HexMaps/Icons/MapNevishLineHex.webp",
			"texture": "game/Textures/UI/HexMaps/Processed/MapNevishLineHex.png",
			"gridCoord": {
				"x": -3,
				"y": 0
			}
		},
		"oarbreakerhex": {
			"name": "The Oarbreaker Isles",
			"regionId": 16,
			"icon": "game/Textures/UI/HexMaps/Icons/MapOarbreakerHex.webp",
			"texture": "game/Textures/UI/HexMaps/Processed/MapOarbreakerHex.png",
			"gridCoord": {
				"x": -3,
				"y": 1
			}
		},
		"originhex": {
			"name": "Origin",
			"regionId": 42,
			"icon": "game/Textures/UI/HexMaps/Icons/MapOriginHex.webp",
			"texture": "game/Textures/UI/HexMaps/Processed/MapOriginHex.png",
			"gridCoord": {
				"x": -3,
				"y": 3
			}
		},
		"reachingtrailhex": {
			"name": "Reaching Trail",
			"regionId": 11,
			"icon": "game/Textures/UI/HexMaps/Icons/MapReachingTrailHex.webp",
			"texture": "game/Textures/UI/HexMaps/Processed/MapReachingTrailHex.png",
			"gridCoord": {
				"x": 0,
				"y": -2
			}
		},
		"redriverhex": {
			"name": "Red River",
			"regionId": 31,
			"icon": "game/Textures/UI/HexMaps/Icons/MapRedRiverHex.webp",
			"texture": "game/Textures/UI/HexMaps/Processed/MapRedRiverHex.png",
			"gridCoord": {
				"x": -1,
				"y": 3
			}
		},
		"shackledchasmhex": {
			"name": "Shackled Chasm",
			"regionId": 24,
			"icon": "game/Textures/UI/HexMaps/Icons/MapShackledChasmHex.webp",
			"texture": "game/Textures/UI/HexMaps/Processed/MapShackledChasmHex.png",
			"gridCoord": {
				"x": 1,
				"y": 1
			}
		},
		"speakingwoodshex": {
			"name": "Speaking Woods",
			"regionId": 33,
			"icon": "game/Textures/UI/HexMaps/Icons/MapSpeakingWoodsHex.webp",
			"texture": "game/Textures/UI/HexMaps/Processed/MapSpeakingWoodsHex.png",
			"gridCoord": {
				"x": -1,
				"y": -2
			}
		},
		"stonecradlehex": {
			"name": "Stonecradle",
			"regionId": 12,
			"icon": "game/Textures/UI/HexMaps/Icons/MapStonecradleHex.webp",
			"texture": "game/Textures/UI/HexMaps/Processed/MapStonecradleHex.png",
			"gridCoord": {
				"x": -2,
				"y": 0
			}
		},
		"tempestislandhex": {
			"name": "Tempest Island",
			"regionId": 18,
			"icon": "game/Textures/UI/HexMaps/Icons/MapTempestIslandHex.webp",
			"texture": "game/Textures/UI/HexMaps/Processed/MapTempestIslandHex.png",
			"gridCoord": {
				"x": 3,
				"y": -1
			}
		},
		"terminushex": {
			"name": "Terminus",
			"regionId": 39,
			"icon": "game/Textures/UI/HexMaps/Icons/MapTerminusHex.webp",
			"texture": "game/Textures/UI/HexMaps/Processed/MapTerminusHex.png",
			"gridCoord": {
				"x": 2,
				"y": 1
			}
		},
		"thefingershex": {
			"name": "The Fingers",
			"regionId": 38,
			"icon": "game/Textures/UI/HexMaps/Icons/MapTheFingersHex.webp",
			"texture": "game/Textures/UI/HexMaps/Processed/MapTheFingersHex.png",
			"gridCoord": {
				"x": 3,
				"y": 0
			}
		},
		"umbralwildwoodhex": {
			"name": "Umbral Wildwood",
			"regionId": 6,
			"icon": "game/Textures/UI/HexMaps/Icons/MapUmbralWildwoodHex.webp",
			"texture": "game/Textures/UI/HexMaps/Processed/MapUmbralWildwoodHex.png",
			"gridCoord": {
				"x": 0,
				"y": 1
			}
		},
		"viperpithex": {
			"name": "Viper Pit",
			"regionId": 25,
			"icon": "game/Textures/UI/HexMaps/Icons/MapViperPitHex.webp",
			"texture": "game/Textures/UI/HexMaps/Processed/MapViperPitHex.png",
			"gridCoord": {
				"x": 1,
				"y": -2
			}
		},
		"weatheredexpansehex": {
			"name": "Weathered Expanse",
			"regionId": 22,
			"icon": "game/Textures/UI/HexMaps/Icons/MapWeatheredExpanseHex.webp",
			"texture": "game/Textures/UI/HexMaps/Processed/MapWeatheredExpanseHex.png",
			"gridCoord": {
				"x": 2,
				"y": -2
			}
		},
		"westgatehex": {
			"name": "Westgate",
			"regionId": 14,
			"icon": "game/Textures/UI/HexMaps/Icons/MapWestgateHex.webp",
			"texture": "game/Textures/UI/HexMaps/Processed/MapWestgateHex.png",
			"gridCoord": {
				"x": -2,
				"y": 2
			}
		}
	},
	"tech": {
		"unlockfacilitytier2": {
			"name": "Facilities (Tier 2)",
			"description": "Allows for the construction of advanced Facilities structures.",
			"icon": "game/Textures/UI/StructureIcons/FacilityRefinery2Icon.webp"
		},
		"unlockfacilitytier3": {
			"name": "Facilities (Tier 3)",
			"description": "Allows for the construction of specialized Facilities structures.",
			"icon": "game/Textures/UI/StructureIcons/FacilityRefinery2Icon.webp"
		}
	},
	"resources": {
		"ambulancec": {
			"name": "R-12 - “Salus” Ambulance",
			"description": "The “Salus” Ambulance is efficient at transporting Critically Wounded Soldiers and carrying medical supplies.",
			"icon": "game/Textures/UI/VehicleIcons/Ambulance.webp"
		},
		"ambulanceflamec": {
			"name": "R-12b - “Salva” Flame Truck",
			"description": "This simple variant of the “Salus” ambulance is fitted with a high-powered hose designed to quell wildfires.",
			"icon": "game/Textures/UI/VehicleIcons/AmbulanceFlameC.webp"
		},
		"ambulanceflamew": {
			"name": "Dunne Dousing Engine 3r",
			"description": "A simple variant of the Dunne Responder 3e that’s fitted with a high-powered hose designed to extinguish raging flames.",
			"icon": "game/Textures/UI/VehicleIcons/AmbulanceFlameW.webp"
		},
		"ambulancew": {
			"name": "Dunne Responder 3e",
			"description": "The Responder Ambulance is efficient at transporting Critically Wounded Soldiers and carrying medical supplies.",
			"icon": "game/Textures/UI/VehicleIcons/AmbulanceWar.webp"
		},
		"armoredcaratw": {
			"name": "O’Brien V.113 Gravekeeper",
			"description": "A slight variation of the V.110, the Gravekeeper comes fitted with an embedded Bonesaw launcher, transforming the humble armoured car into an effective indirect anti-armour vehicle.",
			"icon": "game/Textures/UI/VehicleIcons/ArmoredCarATWVehicleIcon.webp"
		},
		"armoredcarc": {
			"name": "T3 “Xiphos”",
			"description": "Colonial Armoured Cars are quick, well-rounded urban assault platforms. These anti-infantry vehicles are equipped with twin-barrelled machineguns.",
			"icon": "game/Textures/UI/VehicleIcons/ArmoredCarVehicleIcon.webp"
		},
		"armoredcarflamew": {
			"name": "O’Brien V.130 Wild Jack",
			"description": "While the Noble Firebrand Mk. XVII is a deadly flamethrower tank, a more efficient means of employing flame weapons was needed. Enter the Wild Jack. Named for the fiery idols made by children for Dead Harvest, the Wild Jack is a variation of the Highlander.",
			"icon": "game/Textures/UI/VehicleIcons/ArmoredCarFlameWarVehicleIcon.webp"
		},
		"armoredcarmobilityw": {
			"name": "O’Brien V.121 Highlander",
			"description": "Fitted with all-terrain treads, the Highlander brings significant all-terrain mobility and performs especially well in snowy and mountainous environments. ",
			"icon": "game/Textures/UI/VehicleIcons/ArmoredCarMobilityWarVehicleIcon.webp"
		},
		"armoredcaroffensivec": {
			"name": "T5 “Percutio”",
			"description": "This “Xiphos” variant is fitted with a high-powered anti-tank turret in place of the twin machine gun platform.",
			"icon": "game/Textures/UI/VehicleIcons/ArmoredCarOffensiveCVehicleIcon.webp"
		},
		"armoredcaroffensivew": {
			"name": "O’Brien V.101 Freeman",
			"description": "This early O’Brien variant, the V.101 Freeman is fitted with a 360 degree ballistics cannon turret at the expense of top speed.",
			"icon": "game/Textures/UI/VehicleIcons/ArmoredCarOffensiveWVehicleIcon.webp"
		},
		"armoredcartwinc": {
			"name": "T8 “Gemini”",
			"description": "Fitted with twin RPG launchers, the T8 employs hit-and-run assaults against enemy structures and emplacements.",
			"icon": "game/Textures/UI/VehicleIcons/ArmoredCarTwinCItemIcon.webp"
		},
		"armoredcartwinw": {
			"name": "O’Brien v.190 Knave",
			"description": "One of Conor O’Brien’s best traits was his ability to modernize and make use of older technology in his designs. The v.190 Knave is the perfect example of this philosophy. Fitted with a modified, outdated twin-grenade launcher turret, the Knave is a surprising combination of speed and subterfuge that quickly routs the enemy, leaving them befuddled.",
			"icon": "game/Textures/UI/VehicleIcons/ArmoredCarTwinWIcon.webp"
		},
		"armoredcarw": {
			"name": "O’Brien V.110",
			"description": "Warden Armoured Cars are quick, well-rounded urban assault platforms. These anti-infantry vehicles are equipped with twin-barrelled machineguns.",
			"icon": "game/Textures/UI/VehicleIcons/ArmoredCarWarVehicleIcon.webp"
		},
		"atlargeammo": {
			"name": "94.5mm",
			"description": "A heavy anti-tank shell.",
			"icon": "game/Textures/UI/ATLargeAmmoIcon.webp"
		},
		"atrifletc": {
			"name": "“Typhon” ra.XII",
			"description": "This mounted anti-tank rifle boasts improved accuracy over its free-standing counterparts. The Typhon was specifically designed with shock absorption in mind, allowing for faster, more consistent firing patterns.",
			"icon": "game/Textures/UI/ItemIcons/ATRifleTCIcon.webp"
		},
		"atrpgtw": {
			"name": "Mounted Bonesaw MK.3",
			"description": "This variant of the Bonesaw MK.3 is specially designed for use with tripod mounts. This affords it with increased stability and maximum potential range.",
			"icon": "game/Textures/UI/ItemIcons/ATMortarWTripodItemIcon.webp"
		},
		"barbedwirematerials": {
			"name": "Barbed Wire",
			"description": "Used to construct Barbed Wire defenses.",
			"icon": "game/Textures/UI/ItemIcons/BarbedWireMaterialItemIcon.webp"
		},
		"battletankammo": {
			"name": "75mm",
			"description": "Standard payload for battle tanks.",
			"icon": "game/Textures/UI/ItemIcons/BattleTankAmmoItemIcon.webp"
		},
		"battletankatc": {
			"name": "Lance-25 “Hasta”",
			"description": "A heavy Lance variation, the 25, or “Hasta”, was employed in the first siege on Brightwall, a city now colloquially referred to as, “The Blemish”. Bombarded by heavy, armoured resistance in northern Veli, Colonial tank regiments requested a heavy vehicle with more effective search and destroy capabilities. Fitted with a front-facing 94.5mm cannon, the “Hasta” is a more than capable tank destroyer.",
			"icon": "game/Textures/UI/VehicleIcons/BattleTankATCIcon.webp"
		},
		"battletankc": {
			"name": "Lance-36",
			"description": "A heavy-duty Battle Tank with thick armour plating and destructive firepower. The Lance is fitted with a 75mm turret and a front-facing 12.7mm anti-infantry machine gun. The heavy armour limits top speed, but in exchange it can take a lot of punishment.",
			"icon": "game/Textures/UI/VehicleIcons/BattleTank.webp"
		},
		"battletankdefensivew": {
			"name": "Flood Juggernaut Mk. VII",
			"description": "The Juggernaut is a heavily armoured Flood variant fitted with a heavy flamethrower turret that fires an advanced adhesive propellant. Its shovel-like treads may hinder top speeds, but this beast is quite capable in extreme weather conditions.",
			"icon": "game/Textures/UI/VehicleIcons/BattleTankWarDefensiveVehicleIcon.webp"
		},
		"battletankw": {
			"name": "Flood Mk. I",
			"description": "A heavy-duty Battle Tank with thick armour plating and destructive firepower. The Flood is fitted with a 75mm turret and a front-facing 12.7mm anti-infantry machine gun. The heavy armour limits top speed, but in exchange it can take a lot of punishment.",
			"icon": "game/Textures/UI/VehicleIcons/BattleTankWar.webp"
		},
		"cloth": {
			"name": "Basic Materials",
			"description": "Resource used for building basic structures and producing items.",
			"icon": "game/Textures/UI/ItemIcons/BasicMaterialsIcon.webp"
		},
		"coal": {
			"name": "Coal",
			"description": "Chunks of raw Coal that can be refined into materials needed for production and power generation at Facilities.",
			"icon": "game/Textures/UI/ItemIcons/CoalIcon.webp"
		},
		"components": {
			"name": "Components",
			"description": "Components that can be salvaged into Refined Materials at a Refinery",
			"icon": "game/Textures/UI/ItemIcons/ComponentsIcon.webp"
		},
		"concrete": {
			"name": "Concrete Materials",
			"description": "A concrete compound that is used to build heavily fortified structures.",
			"icon": "game/Textures/UI/ItemIcons/ConcreteBagIcon.webp"
		},
		"construction": {
			"name": "BMS - Universal Assembly Rig",
			"description": "A specialized vehicle designed by the Basset Motor Society used in the construction of large structures.",
			"icon": "game/Textures/UI/VehicleIcons/ConstructionVehicleIcon.webp"
		},
		"constructionutility": {
			"name": "BMS - Fabricator",
			"description": "An advanced variant of the Universal Assembly Rig, the BMS - Fabricator is fitted with a unique kit designed to handle advanced or specialized construction and excavation jobs.",
			"icon": "game/Textures/UI/VehicleIcons/AdvancedConstructionVehicleIcon.webp"
		},
		"destroyertankflamew": {
			"name": "Noble Firebrand Mk. XVII",
			"description": "In response to the Legion embarking on aggressive northern offensives, the Firebrand is designed to conflagrate and eradicate their garrisons with ease. Built using the aggressive frame of the Widow, the Firebrand is a pure force of nature when paired with a secondary armoured escort.",
			"icon": "game/Textures/UI/VehicleIcons/DestroyerTankFlameWIcon.webp"
		},
		"destroyertankw": {
			"name": "Noble Widow MK. XIV",
			"description": "This deadly tank turns predator into prey. A tank Destroyer, the Noble Widow specializes in ambush tactics, waiting for its quarry and striking with destructive high-velocity shells.",
			"icon": "game/Textures/UI/VehicleIcons/DestroyerTankWVehicleIcon.webp"
		},
		"diesel": {
			"name": "Diesel",
			"description": "Common fuel used to power all vehicles and resource mines.",
			"icon": "game/Slate/Images/ResourceFuelIcon.webp",
			"isLiquid": true
		},
		"emplacedatlargew": {
			"name": "Huber Starbreaker 94.5mm",
			"description": "Built to compliment other free-standing artillery pieces, the emplaced Huber Starbreaker launches 94.5mm shells over very long distances. A necessary tool for infantry to knock back armoured Colonial advances.",
			"icon": "game/Textures/UI/StructureIcons/EmplacedATLargeWIcon.webp"
		},
		"emplacedcannonlargec": {
			"name": "DAE 2a-1 “Ruptura”",
			"description": "Not to be outdone by its counterparts, the 2a-1 “Ruptura” is fitted with a 75mm cannon. Designed to aid in holding ground for longer durations, the “Ruptura” is a strong, efficient anti-armour tool.",
			"icon": "game/Textures/UI/StructureIcons/EmplacedCannonLargeC.webp"
		},
		"emplacedmultic": {
			"name": "DAE 3b-2 “Hades’ Net”",
			"description": "The DAE 3b-2 fires rockets over long distances from a safe, emplaced position. This unique weapon was given its name due to the screams heard across the battlefield during its first deployment, with some referring to the barrage as a “web of death.”",
			"icon": "game/Textures/UI/StructureIcons/EmplacedMultiCStructureIcon.webp"
		},
		"explosive": {
			"name": "Explosive Materials",
			"description": "Resource used for producing heavy explosive weapons.",
			"icon": "game/Textures/UI/ItemIcons/ExplosiveMaterialIcon.webp"
		},
		"facilitycoal1": {
			"name": "Coke",
			"description": "Refined Coal required for various Facility processes.",
			"icon": "game/Textures/UI/ItemIcons/CokeIcon.webp"
		},
		"facilitycomponents1": {
			"name": "Damaged Components",
			"description": "Damaged Components that can be salvaged into Components.",
			"icon": "game/Textures/UI/ItemIcons/ComponentsDamagedIcon.webp"
		},
		"facilitymaterials1": {
			"name": "Construction Materials",
			"description": "Metal beams needed to produce basic structures and vehicles at Facilities.",
			"icon": "game/Textures/UI/ItemIcons/Facilities/ConstructionMaterialsIcon.webp"
		},
		"facilitymaterials2": {
			"name": "Processed Construction Materials",
			"description": "Refined metal bars needed to produce advanced structures and vehicles at Facilities.",
			"icon": "game/Textures/UI/ItemIcons/Facilities/ProcessedConstructionMaterialsIcon.webp"
		},
		"facilitymaterials3": {
			"name": "Steel Construction Materials",
			"description": "Shaped, steel beams required for the most advanced processes at Facilities.",
			"icon": "game/Textures/UI/ItemIcons/Facilities/SteelConstructionMaterialsIcon.webp"
		},
		"facilitymaterials4": {
			"name": "Assembly Materials I",
			"description": "Specialized metal sheets forged using Coal that are required to assemble advanced vehicles and equipment.",
			"icon": "game/Textures/UI/ItemIcons/AssemblyMaterials1Icon.webp"
		},
		"facilitymaterials5": {
			"name": "Assembly Materials II",
			"description": "Specialized metallic bars fortified with Petrol that are required to assemble advanced vehicles and equipment.",
			"icon": "game/Textures/UI/ItemIcons/AssemblyMaterials2Icon.webp"
		},
		"facilitymaterials6": {
			"name": "Assembly Materials III",
			"description": "Sulfur-enriched metallic bars that are required to assemble advanced vehicles and equipment.",
			"icon": "game/Textures/UI/ItemIcons/AssemblyMaterials3Icon.webp"
		},
		"facilitymaterials7": {
			"name": "Assembly Materials IV",
			"description": "High-end steel bars, fortified with Heavy Oil that are required to assemble advanced vehicles and equipment.",
			"icon": "game/Textures/UI/ItemIcons/AssemblyMaterials4Icon.webp"
		},
		"facilitymaterials8": {
			"name": "Assembly Materials V",
			"description": "Meticulously engineered alloy beams that are required to assemble advanced vehicles and equipment.",
			"icon": "game/Textures/UI/ItemIcons/AssemblyMaterials5Icon.webp"
		},
		"facilityoil1": {
			"name": "Heavy Oil",
			"description": "A high grade fuel that's refined from Oil. Used in a variety of applications at Facilities.",
			"icon": "game/Textures/UI/ItemIcons/FacilityOil1Icon.webp",
			"isLiquid": true
		},
		"facilityoil2": {
			"name": "Enriched Oil",
			"description": "Oil that has been purified and enriched for advanced Facilities processes.",
			"icon": "game/Textures/UI/ItemIcons/FacilityOil2Icon.webp",
			"isLiquid": true
		},
		"fieldatc": {
			"name": "AA-2 \"Battering Ram\"",
			"description": "The \"Battering Ram\" is a mobile Anti-Tank field gun firing 68mm armour-piercing rounds.",
			"icon": "game/Textures/UI/VehicleIcons/FieldAntiTankColVehicleIcon.webp"
		},
		"fieldatdamagew": {
			"name": "Balfour Rampart 68mm",
			"description": "The Rampart is a powerful field cannon capable of dealing devastating damage to all but the heaviest of armoured vehicles while providing its crew with comprehensive ballistic shielding.",
			"icon": "game/Textures/UI/VehicleIcons/FieldCannonOffensiveWIcon.webp"
		},
		"fieldatlargec": {
			"name": "945g “Stygian Bolt”",
			"description": "The “Stygian Bolt” Heavy Field Gun is fitted with a monstrous 94.5mm cannon paired with heavy angled blast shielding. Inspired by the rows of narrow canyons in their homeland of the Lacrista province, Mesean engineers designed this field weapon to keep its crew as safe from ancillary fire as possible while maintaining forward momentum.",
			"icon": "game/Textures/UI/VehicleIcons/FieldATHeavyCIcon.webp"
		},
		"fieldatw": {
			"name": "Collins Cannon 68mm",
			"description": "The Collins Cannon is a mobile Anti-Tank field gun firing 68mm armour-piercing rounds.",
			"icon": "game/Textures/UI/VehicleIcons/FieldAntiTankWarVehicleIcon.webp"
		},
		"fieldcannondamagec": {
			"name": "40-45 “Smelter”",
			"description": "Armed with explosive 40mm rounds, the Smelter is perfect for engaging enemy armour. The frontal blast shielding provides operators with ample cover during heated skirmishes.",
			"icon": "game/Textures/UI/VehicleIcons/FieldATOffensiveCIcon.webp"
		},
		"fieldcannonlargew": {
			"name": "Balfour Stockade 75mm",
			"description": "This robust field cannon not only allows infantry to fire heavy 75mm shells with ease, but it provides state-of-the-art curved blast shielding for maximum protection from crossfire.",
			"icon": "game/Textures/UI/VehicleIcons/FieldCannonHeavyWIcon.webp"
		},
		"fieldcannonw": {
			"name": "Balfour Wolfhound 40mm",
			"description": "This destructive short-ranged cannon is designed for direct engagement with enemy fortifications. The Wolfhound is fitted with reinforced shielding and a 40mm barrel. ",
			"icon": "game/Textures/UI/VehicleIcons/FieldCannonWVehicleIcon.webp"
		},
		"fieldmultiw": {
			"name": "Rycker 4/3-F Wasp Nest",
			"description": "Lyle Rycker first built a prototype of the Wasp Nest as a test for his rack mounted rocket batteries that would eventually find their way onto armoured vehicles. Capable of firing twelve compact rockets in quick succession, the Wasp Nest became a quick favourite of the Warden infantry testing it, so an official design was requisitioned.",
			"icon": "game/Textures/UI/VehicleIcons/FieldMultiWItemIcon.webp"
		},
		"firerocketammo": {
			"name": "4C-Fire Rocket",
			"description": "Standard calibre rocket with an incendiary explosion. Will ignite objects near impact.",
			"icon": "game/Textures/UI/ItemIcons/FlameRocketAmmoIcon.webp"
		},
		"flameammo": {
			"name": "Flame Ammo",
			"description": "A drum containing fuel for use with flame weapons.",
			"icon": "game/Textures/UI/ItemIcons/FlameAmmoIcon.webp"
		},
		"grenadelaunchertc": {
			"name": "Mounted Fissura gd.I",
			"description": "Capable of firing different grenades, quickly and at long range, the Fissura gd.I is mobile enough for easy transport, while increasing the effectiveness of infantry ordinance. ",
			"icon": "game/Textures/UI/ItemIcons/GrenadeLauncherTCIcon.webp"
		},
		"groundmaterials": {
			"name": "Gravel",
			"description": "Resource used for building Roads and Foundations.",
			"icon": "game/Textures/UI/ItemIcons/GroundMaterialsIcon.webp"
		},
		"halftrackartilleryc": {
			"name": "HH-d “Peltast”",
			"description": "This “Javelin” variant is fitted with a 360 degree mortar platform, designed to support infantry in frontline operations.",
			"icon": "game/Textures/UI/VehicleIcons/HalfTrackArtilleryCIcon.webp"
		},
		"halftrackc": {
			"name": "HH-a “Javelin”",
			"description": "Designed for escort missions and to support infantry operations, the HH-a class “Javelin” Half-Track is an armoured, versatile all-terrain vehicle that can be equipped with a variety of mounted weapons.",
			"icon": "game/Textures/UI/VehicleIcons/HalfTrackColVehicleIcon.webp"
		},
		"halftrackdefensivec": {
			"name": "HH-b “Hoplite”",
			"description": "With reinforced armour at the expense of speed, the \"Hoplite\" is a formidable force in the heat of combat.",
			"icon": "game/Textures/UI/VehicleIcons/HalfTrackColHeavyArmorVehicleIcon.webp"
		},
		"halftrackmultiw": {
			"name": "Niska-Rycker Mk. IX Skycaller",
			"description": "A first of its kind, the Skycaller is a variation of the Niska Motor Carriage with a Rycker designed rocket battery fitted in the rear bed. This unique armoured vehicle quickly fires rockets over long distances with ease, and can be rearmed and relocated at the drop of a hat. The Skycaller is the deadly result of combined Nevish and Caoivish engineering.",
			"icon": "game/Textures/UI/VehicleIcons/HalftrackMultiWIcon.webp"
		},
		"halftrackoffensivew": {
			"name": "Niska Mk. II Blinder",
			"description": "Fitted with a heavy-duty anti-tank gun, the Blinder is capable of punching through all but the most tempered of alloys.",
			"icon": "game/Textures/UI/VehicleIcons/HalfTrackOffensiveWarVehicleIcon.webp"
		},
		"halftrackw": {
			"name": "Niska Mk. I Gun Motor Carriage",
			"description": "Designed for escort missions and to support infantry operations, the Niska Gun Motor Carriage Half-Track is an armoured, versatile all-terrain vehicle that can be equipped with a variety of mounted weapons.",
			"icon": "game/Textures/UI/VehicleIcons/HalfTrackWarVehicleIcon.webp"
		},
		"harvester": {
			"name": "BMS - Scrap Hauler",
			"description": "The Scrap Hauler, designed by the Bassett Motor Society is a heavy-duty piece of machinery designed to reduce scrap metal and other materials into usable, raw resources. Scrap Haulers are often used to extract battlefield resources following skirmishes.",
			"icon": "game/Textures/UI/VehicleIcons/Harvester.webp"
		},
		"heavyartilleryammo": {
			"name": "150mm",
			"description": "Payload for heavy artillery weapons.",
			"icon": "game/Textures/UI/ItemIcons/HeavyArtilleryAmmoItemIcon.webp"
		},
		"heavyexplosive": {
			"name": "Heavy Explosive Materials",
			"description": "Resource used for producing heavy explosive weapons.",
			"icon": "game/Textures/UI/ItemIcons/HeavyExplosiveMaterialIcon.webp"
		},
		"herocketammo": {
			"name": "3C-High Explosive Rocket",
			"description": "Standard calibre rocket with a heavy explosive payload. Chance to ignite objects near impact.",
			"icon": "game/Textures/UI/ItemIcons/HERocketAmmoIcon.webp"
		},
		"isgtc": {
			"name": "Daucus isg.III",
			"description": "This heavy infantry cannon requires a tripod for stability. The Daucus is designed to give infantry a foothold against enemy vehicles and light fortifications or established fortified garrisons.",
			"icon": "game/Textures/UI/ItemIcons/InfantrySupportGunItemIcon.webp"
		},
		"landingcraftc": {
			"name": "AB-8 “Acheron”",
			"description": "The \"Acheron\" is an armoured amphibious vehicle designed for carrying troops across large bodies of water to aid in coordinated beach landings and flanking assaults. ",
			"icon": "game/Textures/UI/VehicleIcons/LandingCraftVehicleIcon.webp"
		},
		"landingcraftoffensivec": {
			"name": "AB-11 “Doru”",
			"description": "With its mounted machinegun, the \"Doru\" is the perfect addition to any shoreline assault. ",
			"icon": "game/Textures/UI/VehicleIcons/LandingCraftOffensiveVehicleIcon.webp"
		},
		"lightartilleryammo": {
			"name": "120mm",
			"description": "Payload for light artillery weapons.",
			"icon": "game/Textures/UI/ItemIcons/LightArtilleryAmmoItemIcon.webp"
		},
		"lighttank2infantryc": {
			"name": "HC-2 “Scorpion”",
			"description": "The “Scorpion” HC-class tank is a moderately armoured infantry support vehicle with twin, high-powered heavy machine guns and short-range radios for improved intelligence support. In addition, exterior seating is available for infantry. ",
			"icon": "game/Textures/UI/VehicleIcons/LightTank2InfantryCVehicleIcon.webp"
		},
		"lighttankartilleryw": {
			"name": "Devitt-Caine Mk. IV MMR",
			"description": "A modified Devitt fitted with a specialized Caine mortar turret at the expense of top speed.",
			"icon": "game/Textures/UI/VehicleIcons/LightTankArtilleryWar.webp"
		},
		"lighttankc": {
			"name": "H-5 \"Hatchet\"",
			"description": "A highly maneuverable lightweight tank. Designed for urban environments, the “Hatchet” is fitted with a 40mm cannon.",
			"icon": "game/Textures/UI/VehicleIcons/LightTankColVehicleIcon.webp"
		},
		"lighttankdefensivew": {
			"name": "Devitt Ironhide Mk. IV ",
			"description": "The Ironhide Light Tank is similar to the Mk. III but reinforced with plates of heavy steel at the expense of speed and maneuverability.",
			"icon": "game/Textures/UI/VehicleIcons/LightTankWarDefensiveVehicleIcon.webp"
		},
		"lighttankflamec": {
			"name": "H-19 “Vulcan”",
			"description": "This modified “Hatchet” features a reinforced fuel cell fixed to its rear alongside a flamethrower turret. This light tank can launch litres of burning fuel a fair distance, while its crew remains protected behind light armour plating.",
			"icon": "game/Textures/UI/VehicleIcons/LightTankFlameCIcon.webp"
		},
		"lighttankmobilityc": {
			"name": "H-8 “Kranesca”",
			"description": "The “Kranesca” Light Tank is fitted with an overpowered engine and a reinforced chassis, capable of boosting its top speed at the expense of overall acceleration and maneuverability.",
			"icon": "game/Textures/UI/VehicleIcons/LightTankColMobilityVehicleIcon.webp"
		},
		"lighttankoffensivec": {
			"name": "H-10 “Pelekys”",
			"description": "The “Pelekys” H-class light tank is heavily modified with an open top chassis and equipped with a devastating long-range anti-tank cannon.",
			"icon": "game/Textures/UI/VehicleIcons/LightTankOffensiveCVehicleIcon.webp"
		},
		"lighttankw": {
			"name": "Devitt Mk. III",
			"description": "A highly maneuverable lightweight tank. Designed for urban environments, the Devitt is fitted with a 40mm cannon.",
			"icon": "game/Textures/UI/VehicleIcons/LightTankWarVehicleIcon.webp"
		},
		"lrartilleryammo": {
			"name": "300mm",
			"description": "Standard payload used with Storm Cannons.",
			"icon": "game/Textures/UI/ItemIcons/LRArtilleryAmmoItemIcon.webp"
		},
		"maintenancesupplies": {
			"name": "Maintenance Supplies",
			"description": "Supplies for maintaining structures. Store at Bases or Maintenance Tunnels to prevent decay on surrounding structures.",
			"icon": "game/Textures/UI/ItemIcons/MaintenanceSuppliesIcon.webp"
		},
		"materialplatform": {
			"name": "Material Pallet",
			"description": "A material pallet.",
			"icon": "game/Textures/UI/ItemIcons/MaterialPlatformItemIcon.webp"
		},
		"mediumtank2c": {
			"name": "86K-a “Bardiche”",
			"description": "Unlike the 85-series, the \"Bardiche\" sports a heavier, more durable build and is fitted with a coaxial heavy machinegun along with a powerful, short-barrelled 68mm turret. Modern Kraunian engineering allows for a fast reload, making it an ideal tool to combat enemy armour.",
			"icon": "game/Textures/UI/VehicleIcons/MediumTank2CIcon.webp"
		},
		"mediumtank2indirectw": {
			"name": "Gallagher Thornfall Mk. VI",
			"description": "Armed with a rack of Bonesaw mortar launchers, the Thornfall is designed to launch an indirect mechanized assault on enemy armour. This unique vehicle supports an allied assault and cannot withstand large amounts of punishment.",
			"icon": "game/Textures/UI/VehicleIcons/MediumTank2IndirectWIcon.webp"
		},
		"mediumtank2multiw": {
			"name": "Gallagher Highwayman Mk. III",
			"description": "Colm Gallagher’s engineers designed a variation of the Outlaw that features an independently rotating MG turret sitting atop the main armament of twin anti-tank cannons. What it lacks in raw firepower compared to its older sibling, the Highwayman more than makes up for it with versatility.",
			"icon": "game/Textures/UI/VehicleIcons/MediumTank2MultiWIcon.webp"
		},
		"mediumtank2rangew": {
			"name": "Gallagher Outlaw Mk. II",
			"description": "Originally designed in response to increasing swarms of Mesean armour, the Outlaw is an exceptionally capable medium tank armed with a long-range 40mm turret and includes a built-in storm rifle support position.",
			"icon": "game/Textures/UI/VehicleIcons/MediumTank2RangeWIcon.webp"
		},
		"mediumtank2twinc": {
			"name": "86K-c “Ranseur”",
			"description": "This evolution of the “Bardiche” is fitted quad-mounted RPG launchers paired with a high-velocity 12.7mm cannon. The “Ranseur” indicates progress in Kraunian design as they continue to leverage outdated equipment to create deadly, modern armour.",
			"icon": "game/Textures/UI/VehicleIcons/MediumTank2TwinCVehicleIcon.webp"
		},
		"mediumtankatw": {
			"name": "Silverhand Lordscar - Mk. X",
			"description": "A cut down variation of the Silverhand Assault Tank that sacrifices armour and protection in favour of a high-powered 94.5mm cannon. This open-top weapon platform is uniquely designed to intercept enemy armour before they’re given time to retaliate. Its moniker is a tribute to the maiming of the great king the Silverhand is named for; while his title was stripped, and his pride damaged, his rage was never quelled.",
			"icon": "game/Textures/UI/VehicleIcons/MediumTankATWIcon.webp"
		},
		"mediumtankc": {
			"name": "85K-b “Falchion”",
			"description": "Designed for mass-production in Kraunia, this assault tank features a modular turret system for maximum versatility. The “Falchion” class features a powerful if understated, 40mm cannon.",
			"icon": "game/Textures/UI/VehicleIcons/ColonialMediumTankIcon.webp"
		},
		"mediumtanklargec": {
			"name": "85V-g \"Talos\"",
			"description": "The \"Talos\" is a Velian modification to the 85-series, fitted with an oversized 75mm cannon. Knowing that such a heavy cannon would likely not be suitable, the engineers built it to disperse weight in such a manner that the 85-series chassis could bear it.",
			"icon": "game/Textures/UI/VehicleIcons/MediumTankLargeCIcon.webp"
		},
		"mediumtankoffensivec": {
			"name": "85K-a “Spatha”",
			"description": "The “Spatha” assault tank features a unique and destructive 40mm turret that fires high-velocity shells. This specialized turret is not as well suited to mass-production as its more refined counterpart, the “Falchion.”",
			"icon": "game/Textures/UI/VehicleIcons/ColonialMediumTankOffensive.webp"
		},
		"mediumtanksiegew": {
			"name": "Silverhand Chieftain - Mk. VI",
			"description": "The Chieftan assault tank is fitted with asymmetrical armaments, including a 250mm mortar cannon and a twin-barrelled 12.7mm turret.",
			"icon": "game/Textures/UI/VehicleIcons/MediumTankSiegeWVehicleIcon.webp"
		},
		"mediumtankw": {
			"name": "Silverhand - Mk. IV",
			"description": "The Silverhand assault tank is fitted with destructive dual-barrel armaments, and heavy frontal and rear armour. Its 68mm frontal cannon is paired with a lighter 40mm turret. ",
			"icon": "game/Textures/UI/VehicleIcons/WardenMediumTankIcon.webp"
		},
		"metal": {
			"name": "Salvage",
			"description": "Salvage that can be recycled into other resources at a Refinery",
			"icon": "game/Textures/UI/ItemIcons/SalvageIcon.webp"
		},
		"metalbeammaterials": {
			"name": "Metal Beam",
			"description": "Used to construct Metal Beam defenses.",
			"icon": "game/Textures/UI/ItemIcons/MetalBeamMaterialItemIcon.webp"
		},
		"mgtc": {
			"name": "Lamentum mm.IV",
			"description": "Built on the bones of the first automatic weapons introduced to the Legion, the “Lamentum” mm.IV is still quite an intimidating force to encounter on the battlefield. Boasting a large magazine and impressive active range, this mounted machinegun excels at laying down consistent suppressive fire.",
			"icon": "game/Textures/UI/ItemIcons/HeavyMachineGunIcon.webp"
		},
		"mgtw": {
			"name": "Malone Ratcatcher MK.1",
			"description": "Early iterations of this machinegun were built to be emplaced in bunkers and on the decks of lightly armed warships, the Ratcatcher is Harvey Malone’s first freely mountable infantry weapon designed for field use. Just like its predecessors, this heavy weapon suppresses enemy soldiers with unmatched efficiency. ",
			"icon": "game/Textures/UI/ItemIcons/MGHeavyTWItemIcon.webp"
		},
		"mortartankammo": {
			"name": "250mm",
			"description": "A shell that is launched over short distances by a spigot mortar.",
			"icon": "game/Textures/UI/ItemIcons/MortarTankIcon.webp"
		},
		"mortartankc": {
			"name": "HC-7 \"Ballista\"",
			"description": "The HC-Class “Ballista” is a heavy tank designed to obliterate opposition defenses with its 250mm Hades Mortar Cannon.",
			"icon": "game/Textures/UI/VehicleIcons/MortarTankVehicleIcon.webp"
		},
		"motorcyclec": {
			"name": "03MM “Caster”",
			"description": "A motorcycle and sidecar used to patrol large areas. Speed can be boosted at the cost of additional fuel.",
			"icon": "game/Textures/UI/VehicleIcons/MotorcycleVehicleIcon.webp"
		},
		"motorcycleoffensivec": {
			"name": "00MS “Stinger”",
			"description": "The cab of this Motorcycle is fitted with an LMG for fast-response hit and run assaults.",
			"icon": "game/Textures/UI/VehicleIcons/MotorcycleOffensiveVehicleIcon.webp"
		},
		"oil": {
			"name": "Oil",
			"description": "A raw viscous liquid that must be refined into fuel at Facilities.",
			"icon": "game/Textures/UI/ItemIcons/Facilities/OilIcon.webp",
			"isLiquid": true
		},
		"oilcan": {
			"name": "Oil (Canned)",
			"description": "A raw viscous liquid that must be refined into fuel at Facilities.",
			"icon": "game/Textures/UI/ItemIcons/Facilities/OilIcon.webp"
		},
		"petrol": {
			"name": "Petrol",
			"description": "A medium grade fuel that's refined from Oil. Used as a higher end fuel for vehicles and in various applications at Facilities.",
			"icon": "game/Textures/UI/ItemIcons/RefinedFuelIcon.webp",
			"isLiquid": true
		},
		"pipematerials": {
			"name": "Pipe",
			"description": "Used to construct various types of pipelines for transporting liquids.",
			"icon": "game/Textures/UI/StructureIcons/EngineRoomPipeIcon.webp"
		},
		"rpgtw": {
			"name": "Cutler Foebreaker",
			"description": "This unique dual-barrelled RPG launcher can fire two RPG shells in relatively quick succession. This increase in firepower makes it nearly impossible for a single soldier to operate without the support of a sturdy mount.",
			"icon": "game/Textures/UI/ItemIcons/ATRPGTWIcon.webp"
		},
		"sandbagmaterials": {
			"name": "Sandbag",
			"description": "Used to construct Sandbag defenses.",
			"icon": "game/Textures/UI/ItemIcons/SandbagMaterialItemIcon.webp"
		},
		"scouttankoffensivew": {
			"name": "King Gallant Mk. II",
			"description": "A heavily armoured variant of the King Spire, the Gallant Mk. II boasts a weighty 30mm cannon at the cost of top speed.",
			"icon": "game/Textures/UI/VehicleIcons/ScoutTankOffensiveWIcon.webp"
		},
		"scouttankw": {
			"name": "King Spire Mk. I",
			"description": "This small tank has been recently recommissioned to the Warden arsenal. It boasts high maneuverability and an antenna that allows for long-range communications during high-stakes recon operations.",
			"icon": "game/Textures/UI/VehicleIcons/ScoutTankWIcon.webp"
		},
		"scoutvehiclemobilityc": {
			"name": "UV-05a “Argonaut”",
			"description": "This stripped down Light Utility Vehicle provides extra seating for a small crew to engage in hit and run tactics.",
			"icon": "game/Textures/UI/VehicleIcons/ScoutVehicleMobilityVehicleIcon.webp"
		},
		"scoutvehicleoffensivec": {
			"name": "UV-24 “Icarus”",
			"description": "This RPG-mounted Light Utility Vehicle provides a heavy-duty weapons platform with superior speed. Perfectly suited for assaulting enemy structures and vehicles, or supporting an armoured assault.",
			"icon": "game/Textures/UI/VehicleIcons/ScoutVehicleOffensiveVehicleIcon.webp"
		},
		"scoutvehicleoffensivew": {
			"name": "Drummond Spitfire 100d",
			"description": "This LMG-mounted Light Utility Vehicle provides a heavy-duty weapons platform with superior speed. Perfectly suited for supporting flanking infantry or an armoured assault.",
			"icon": "game/Textures/UI/VehicleIcons/ScoutVehicleOffensiveWarVehicleIcon.webp"
		},
		"scoutvehicleutilityc": {
			"name": "UV-5c “Odyssey”",
			"description": "This simple, modified Utility Vehicle is fitted with a reinforced hatch to provide one crew member with increased visibility for intense recon operations.",
			"icon": "game/Textures/UI/VehicleIcons/ScoutVehicleUtilityCVehicleIcon.webp"
		},
		"scoutvehicleutilityw": {
			"name": "Drummond Loscann 55c",
			"description": "This amphibious Light Utility Vehicle has been heavily modified to cross rivers and lakes with ease. Venturing out into the open sea is ill-advised, however.",
			"icon": "game/Textures/UI/VehicleIcons/ScoutVehicleAmphibiousWarVehicleIcon.webp"
		},
		"scoutvehiclew": {
			"name": "Drummond 100a",
			"description": "A multipurpose off-road Warden vehicle that can scout nearby targets.",
			"icon": "game/Textures/UI/VehicleIcons/ScoutVehicleWarVehicleIcon.webp"
		},
		"smalltraindump": {
			"name": "BMS Railtruck",
			"description": "A small gauge container car for transporting raw materials. ",
			"icon": "game/Textures/UI/VehicleIcons/SmallGaugeResourceCarVehicleIcon.webp"
		},
		"smalltrainengine": {
			"name": "BMS Mineseeker",
			"description": "The Mineseeker is the Bassett Motor Society’s mechanized mule. This small 0-4-0 locomotive can haul tonnes of weight over short distances with little overhead. Ideal for a mining operation or short-range supply chains. ",
			"icon": "game/Textures/UI/VehicleIcons/SmallGaugeEngineVehicleIcon.webp"
		},
		"smalltrainfuelcontainer": {
			"name": "BMS Tinderbox",
			"description": "The Tinderbox is a simple car used for transporting liquids between facilities.",
			"icon": "game/Textures/UI/VehicleIcons/SmallTrainFuelContainerIcon.webp"
		},
		"smalltrainresourceplatform": {
			"name": "BMS Linerunner",
			"description": "A low profile flatbed car for transporting large resources and munitions over short distances on small gauge tracks.",
			"icon": "game/Textures/UI/VehicleIcons/SmallGaugeFlatbedCarVehicleIcon.webp"
		},
		"sulfur": {
			"name": "Sulfur",
			"description": "Sulfur that can be refined into Heavy Explosive Materials at a Refinery",
			"icon": "game/Textures/UI/ItemIcons/SulfurIcon.webp"
		},
		"supertankc": {
			"name": "O-75b \"Ares\"",
			"description": "Armed with a dual 75mm turret, what the “Ares” lacks in speed and versatility, it more than makes up for with raw destructive power. Development of the “Ares” was fraught with strife, and its history is intertwined with a period of several riots erupting on the streets of Dimiourg. Rebels commandeered the first “Ares” Prototype, the O-75a, and turned it against Colonial forces in the region, ultimately leading to its destruction—albeit not without great effort. This event wove the great behemoth into the tapestry of Colonial legend.",
			"icon": "game/Textures/UI/VehicleIcons/SuperTankCtemIcon.webp"
		},
		"supertankw": {
			"name": "Cullen Predator Mk. III",
			"description": "This gargantuan beast is the brainchild of Gray Cullen. Once thought impossible, the Predator was Cullen’s idea of how a great ship might operate on land. It boasts two sets of quad-barrelled grenade launches and a heavy-duty 94.5mm forward facing cannon. While limitations of ground-based travel posed certain restrictions on the scope of the project, Cullen wasn’t deterred and made necessary adjustments to meet his vision of the ideal land ship.",
			"icon": "game/Textures/UI/VehicleIcons/SuperTankWVehicleIcon.webp"
		},
		"tankettec": {
			"name": "T12 “Actaeon” Tankette",
			"description": "This complete overhaul of the T3 Armoured Car is reinforced with tank armour. While these extra defenses lower the T12’s overall speed and handling, the addition of treads provide increased performance in less than ideal terrain.",
			"icon": "game/Textures/UI/VehicleIcons/TanketteCVehicleIcon.webp"
		},
		"tanketteflamec": {
			"name": "T14 “Vesta” Tankette",
			"description": "The first T-class tankette to utilize this sturdier frame and versatile treads, the Vesta also represents the Velian’s first foray into fire weapons. The “Vesta” boasts a light flame turret and ample storage for the additional fuel supply required.",
			"icon": "game/Textures/UI/VehicleIcons/TanketteFlameCIcon.webp"
		},
		"tanketteoffensivec": {
			"name": "T20 “Ixion” Tankette",
			"description": "A bombastic variant of the T12 Tankette, the “Ixion” provides its crew with more support and a mounted Infantry Support Gun. Added weight from the armour results in reduced overall speed.",
			"icon": "game/Textures/UI/VehicleIcons/TanketteOffensiveCVehicleIcon.webp"
		},
		"traincaboose": {
			"name": "BMS Roadhouse",
			"description": "A simple caboose that allows rail crews to maintain tracks more efficiently.",
			"icon": "game/Textures/UI/VehicleIcons/TrainCabooseItemIcon.webp"
		},
		"traincoal": {
			"name": "BMS Rockhold",
			"description": "A container car for transporting coal to refuel trains over long-distance trips. ",
			"icon": "game/Textures/UI/VehicleIcons/TrainCoalCarVehicleIcon.webp"
		},
		"traincombatcarc": {
			"name": "Aegis Steelbreaker K5a",
			"description": "Known across the colonies as King of the Rails, this heavily armoured train car is designed to protect and exert dominance over contested rail lines, especially when transporting supplies into contested territory as well as safely transporting infantry. This armoured beast boasts a forward facing cannon, as well as heavy lateral guns.",
			"icon": "game/Textures/UI/VehicleIcons/CombatCarCVehicleIcon.webp"
		},
		"traincombatcarw": {
			"name": "O’Brien Warsmith v.215",
			"description": "In his later years, O’Brien nearly died in an attack on a military passenger train while travelling to Whedon’s Row. In response, he put his team to work designing not only an infantry car that offered powerful protection to any locomotive, but one that just the sight of it would run off all but the most committed of attackers—Namely its thick armour plating and powerful twin turrets. ",
			"icon": "game/Textures/UI/VehicleIcons/CombatCarWVehicleIcon.webp"
		},
		"trainengine": {
			"name": "BMS Black Bolt",
			"description": "One of the most storied mass-market 0-6-2 locomotives engineered by the Bassett Motor Society, this coal-powered industrial train engine is reliable, tested, and incredibly durable. The Black Bolt’s legacy is unmatched having aided the Bassett Motor Society in supplying countries across the globe.",
			"icon": "game/Textures/UI/VehicleIcons/TrainEngineVehicleIcon.webp"
		},
		"trainflatbed": {
			"name": "BMS Longrider",
			"description": "A flatbed car for transporting large resources and munitions by train over long-distances. ",
			"icon": "game/Textures/UI/VehicleIcons/TrainCarVehicleIcon.webp"
		},
		"traininfantry": {
			"name": "BMS Holdout",
			"description": "An armoured train car with a mounted machinegun position for transporting infantry safely over long distances.",
			"icon": "game/Textures/UI/VehicleIcons/InfantryCarVehicleIcon.webp"
		},
		"trainlrartillery": {
			"name": "Tempest Cannon RA-2",
			"description": "All the power of a stationary Storm Cannon, but easily relocated via rails. This devastating cannon is capable of leveling enemy fortifications at very large distances.",
			"icon": "game/Textures/UI/VehicleIcons/TrainLRArtilleryVehicleIcon.webp"
		},
		"tripod": {
			"name": "Tripod",
			"description": "A mount point for deployable infantry weapons and equipment.",
			"icon": "game/Textures/UI/ItemIcons/DeployableTripodItemIcon.webp"
		},
		"truckc": {
			"name": "R-1 Hauler",
			"description": "A heavy-duty Colonial truck used to mobilize troops and supplies.",
			"icon": "game/Textures/UI/VehicleIcons/TruckVehicleIcon.webp"
		},
		"truckdefensivew": {
			"name": "Dunne Leatherback 2a",
			"description": "A heavy, reinforced Dunne transport. Fitted with a heavier frame, the Leatherback is capable of enduring more punishment at the cost of initial acceleration. ",
			"icon": "game/Textures/UI/VehicleIcons/TruckDefensiveWIcon.webp"
		},
		"truckmobilityc": {
			"name": "R-5b “Sisyphus” Hauler",
			"description": "This variation of the standard R-5 Hauler is fitted with an improved suspension and axle system resulting in better overall handling. However, these improvements may not hold up under severe weather conditions.",
			"icon": "game/Textures/UI/VehicleIcons/TruckMobilityCVehicleIcon.webp"
		},
		"truckmobilityw": {
			"name": "Dunne Landrunner 12c",
			"description": "This standard Truck is fitted with rugged off-road treads, allowing for more efficient movement on rough terrain and conditions at the expense of maximum speed.",
			"icon": "game/Textures/UI/VehicleIcons/TruckMobilityWarVehicleIcon.webp"
		},
		"truckmultic": {
			"name": "R-17 “Retiarius” Skirmisher",
			"description": "A truck fitted with an advanced rocket propulsion rack, the “Retiarius” webs the sky with deadly, screeching rockets shot at a high frequency over long distances. Holds sixteen rockets.",
			"icon": "game/Textures/UI/VehicleIcons/TruckMultiCIcon.webp"
		},
		"truckoffensivec": {
			"name": "R-9 “Speartip” Escort",
			"description": "This standard Truck is fitted with Light Machinegun in place of the passenger seat. It’s well suited as an escort for convoys or lightly armoured operations.",
			"icon": "game/Textures/UI/VehicleIcons/TruckOffensiveVehicleIcon.webp"
		},
		"truckw": {
			"name": "Dunne Transport",
			"description": "A heavy-duty Warden truck used to mobilize troops and supplies.",
			"icon": "game/Textures/UI/VehicleIcons/TruckWarVehicleIcon.webp"
		},
		"water": {
			"name": "Water",
			"description": "Water... in a can!",
			"icon": "game/Textures/UI/ItemIcons/WaterIcon.webp",
			"isLiquid": true
		},
		"watercan": {
			"name": "Water (Canned)",
			"description": "Water... in a can!",
			"icon": "game/Textures/UI/ItemIcons/WaterIcon.webp"
		},
		"wood": {
			"name": "Refined Materials",
			"description": "Resource used for building advanced structures and producing special items.",
			"icon": "game/Textures/UI/ItemIcons/RefinedMaterialsIcon.webp"
		}
	},
	"weapons": {
		"hegrenade": {
			"name": "Mammon 91-b",
			"description": "Mammon 91-b",
			"icon": "game/Textures/UI/ItemIcons/HEGrenadeItemIcon.webp",
			"codeName": "hegrenade",
			"alias": "HE Grenade",
			"damageType": {
				"name": "Explosive",
				"multipliers": {
					"t2": 0.95,
					"t3": 0.95
				},
				"profiles": {
					"t1": 0.75,
					"t2": 0.75,
					"t3": 0.25
				}
			},
			"damage": 240
		},
		"helaunchedgrenade": {
			"name": "Tremola Grenade GPb-1",
			"description": "Tremola Grenade GPb-1",
			"icon": "game/Textures/UI/ItemIcons/HELaunchedGrenadeItemIcon.webp",
			"codeName": "helaunchedgrenade",
			"alias": "HE Launcher",
			"damageType": {
				"name": "Explosive",
				"multipliers": {
					"t2": 0.95,
					"t3": 0.95
				},
				"profiles": {
					"t1": 0.75,
					"t2": 0.75,
					"t3": 0.25
				}
			},
			"damage": 400
		},
		"minitankammo": {
			"name": "30mm",
			"description": "30mm",
			"icon": "game/Textures/UI/ItemIcons/MiniTankAmmoItemIcon.webp",
			"codeName": "minitankammo",
			"damageType": {
				"name": "Explosive",
				"multipliers": {
					"t2": 0.99,
					"t3": 0.99
				},
				"profiles": {
					"t1": 0.75,
					"t2": 0.75,
					"t3": 0.25
				}
			},
			"damage": 400
		},
		"rpgammo": {
			"name": "RPG",
			"description": "RPG",
			"icon": "game/Textures/UI/ItemIcons/RpgAmmoItemIcon.webp",
			"codeName": "rpgammo",
			"damageType": {
				"name": "Explosive",
				"multipliers": {
					"t3": 0.99
				},
				"profiles": {
					"t1": 0.75,
					"t2": 0.75,
					"t3": 0.25
				}
			},
			"damage": 550
		},
		"lighttankammo": {
			"name": "40mm",
			"description": "40mm",
			"icon": "game/Textures/UI/ItemIcons/LightTankAmmoItemIcon.webp",
			"codeName": "lighttankammo",
			"damage": 600,
			"damageType": {
				"name": "Explosive",
				"profiles": {
					"t1": 0.75,
					"t2": 0.75,
					"t3": 0.25
				}
			}
		},
		"battletankammo": {
			"name": "75mm",
			"description": "75mm",
			"icon": "game/Textures/UI/ItemIcons/BattleTankAmmoItemIcon.webp",
			"codeName": "battletankammo",
			"damage": 1750,
			"damageType": {
				"name": "Explosive",
				"profiles": {
					"t1": 0.75,
					"t2": 0.75,
					"t3": 0.25
				}
			}
		},
		"atammo": {
			"name": "68mm",
			"description": "68mm",
			"icon": "game/Textures/UI/ItemIcons/ATAmmoIcon.webp",
			"codeName": "atammo",
			"damage": 600,
			"damageType": {
				"name": "Armour Piercing",
				"profiles": {
					"t1": 0.25,
					"t2": 0.25,
					"t3": 0.06999999999999995
				}
			}
		},
		"atlargeammo": {
			"name": "94.5mm",
			"description": "94.5mm",
			"icon": "game/Textures/UI/ATLargeAmmoIcon.webp",
			"codeName": "atlargeammo",
			"damage": 1750,
			"damageType": {
				"name": "Armour Piercing",
				"profiles": {
					"t1": 0.25,
					"t2": 0.25,
					"t3": 0.06999999999999995
				}
			}
		},
		"mortarammo": {
			"name": "Mortar Shell",
			"description": "Mortar Shell",
			"icon": "game/Textures/UI/ItemIcons/MortarAmmoIcon.webp",
			"codeName": "mortarammo",
			"alias": "Mortar",
			"damage": 300,
			"damageType": {
				"name": "High Explosive",
				"profiles": {
					"t1": 0.75,
					"t2": 0.75,
					"t3": 0.25
				}
			}
		},
		"lightartilleryammo": {
			"name": "120mm",
			"description": "120mm",
			"icon": "game/Textures/UI/ItemIcons/LightArtilleryAmmoItemIcon.webp",
			"codeName": "lightartilleryammo",
			"damage": 400,
			"damageType": {
				"name": "High Explosive",
				"profiles": {
					"t1": 0.75,
					"t2": 0.75,
					"t3": 0.25
				}
			}
		},
		"heavyartilleryammo": {
			"name": "150mm",
			"description": "150mm",
			"icon": "game/Textures/UI/ItemIcons/HeavyArtilleryAmmoItemIcon.webp",
			"codeName": "heavyartilleryammo",
			"damage": 900,
			"damageType": {
				"name": "High Explosive",
				"profiles": {
					"t1": 0.75,
					"t2": 0.75,
					"t3": 0.25
				}
			}
		},
		"herocketammo": {
			"name": "3C-High Explosive Rocket",
			"description": "3C-High Explosive Rocket",
			"icon": "game/Textures/UI/ItemIcons/HERocketAmmoIcon.webp",
			"codeName": "herocketammo",
			"alias": "Rocket",
			"damage": 300,
			"damageType": {
				"name": "Incendiary",
				"profiles": {
					"t1": 0.75,
					"t2": 0.75,
					"t3": 0.25
				}
			}
		},
		"firerocketammo": {
			"name": "4C-Fire Rocket",
			"description": "4C-Fire Rocket",
			"icon": "game/Textures/UI/ItemIcons/FlameRocketAmmoIcon.webp",
			"codeName": "firerocketammo",
			"alias": "Fire Rocket",
			"damage": 145,
			"damageType": {
				"name": "Incendiary",
				"profiles": {
					"t1": 0.75,
					"t2": 0.75,
					"t3": 0.25
				}
			}
		},
		"explosivelightc": {
			"name": "Hydra’s Whisper",
			"description": "Hydra’s Whisper",
			"icon": "game/Textures/UI/Menus/BangaloreItemIcon.webp",
			"codeName": "explosivelightc",
			"alias": "Hydras",
			"damage": 350,
			"damageType": {
				"name": "Demolition",
				"profiles": {
					"t1": 1,
					"t2": 1,
					"t3": 1
				}
			}
		},
		"mortartankammo": {
			"name": "250mm",
			"description": "250mm",
			"icon": "game/Textures/UI/ItemIcons/MortarTankIcon.webp",
			"codeName": "mortartankammo",
			"damage": 1000,
			"damageType": {
				"name": "Demolition",
				"profiles": {
					"t1": 1,
					"t2": 1,
					"t3": 1
				}
			}
		},
		"lrartilleryammo": {
			"name": "300mm",
			"description": "300mm",
			"icon": "game/Textures/UI/ItemIcons/LRArtilleryAmmoItemIcon.webp",
			"codeName": "lrartilleryammo",
			"damage": 1500,
			"damageType": {
				"name": "High Explosive",
				"profiles": {
					"t1": 0.75,
					"t2": 0.75,
					"t3": 0.25
				}
			}
		},
		"satchelchargew": {
			"name": "Alligator Charge",
			"description": "Alligator Charge",
			"icon": "game/Textures/UI/StructureIcons/SatchelCharge.webp",
			"codeName": "satchelchargew",
			"alias": "Satchel",
			"damage": 300,
			"damageType": {
				"name": "Demolition",
				"profiles": {
					"t1": 1,
					"t2": 1,
					"t3": 1
				}
			}
		},
		"satchelcharget": {
			"name": "Havoc Charge Detonator",
			"description": "Havoc Charge Detonator",
			"icon": "game/Textures/UI/ItemIcons/SatchelChargeTIcon.webp",
			"codeName": "satchelcharget",
			"alias": "Havoc",
			"damage": 1850,
			"damageType": {
				"name": "Demolition",
				"profiles": {
					"t1": 1,
					"t2": 1,
					"t3": 1
				}
			}
		}
	},
	"buildings": {
		"ammunition_factory": {
			"name": "Ammunition Factory",
			"codeName": "FacilityFactoryAmmo",
			"description": "A factory for producing advanced ammo types such as large calibre shells, rockets, and flame ammo.",
			"category": "factories",
			"categoryOrder": 10,
			"hitArea": [
				{
					"shape": [ 79.7,-145.15,25.15,-143.94,25.76,-192.42,51.21,-198.48,79.09,-192.42 ]
				},
				{
					"shape": [ -103.33,170.61,-114.85,195.45,-114.85,170.61 ]
				},
				{
					"shape": [ -114.85,195.45,-103.33,170.61,80.3,143.33,80.3,195.45 ]
				},
				{
					"shape": [ -72.42,-128.18,-114.85,114.85,-114.85,-128.18 ]
				},
				{
					"shape": [ 25.15,-143.94,-72.42,-128.18,-71.82,-143.94 ]
				},
				{
					"shape": [ 25.15,-143.94,79.7,-145.15,105.15,-142.73,-103.33,114.85,-114.85,114.85,-72.42,-128.18 ]
				},
				{
					"shape": [ -103.33,114.85,105.15,-142.73,80.3,143.33,-103.33,170.61 ]
				},
				{
					"shape": [ 80.3,143.33,105.15,-142.73,106.36,142.73 ]
				}
			],
			"icon": "game/Textures/UI/ItemIcons/AmmoFactoryBaseIcon.webp",
			"texture": "game/Textures/Structures/ammunition_factory.webp",
			"power": -4,
			"sockets": [
				{
					"id": 0,
					"name": "power",
					"type": [
						{
							"mask": 131072,
							"category": 1048576
						}
					],
					"x": 0.57,
					"y": 9.22,
					"rotation": 270
				}
			],
			"techId": "unlockfacilitytier2",
			"maxHealth": 3000,
			"cost": {
				"facilitymaterials2": 25
			},
			"repairCost": 100,
			"_productionLength": 2,
			"production": [
				{
					"id": 0,
					"input": {
						"heavyexplosive": 1,
						"facilitymaterials1": 1
					},
					"output": {
						"flameammo": 1
					},
					"time": 25
				},
				{
					"id": 1,
					"input": {
						"heavyexplosive": 6,
						"facilitymaterials1": 5
					},
					"output": {
						"mortartankammo": 1
					},
					"time": 30
				}
			],
			"upgrades": {
				"tripod_factory": {
					"name": "Tripod Factory",
					"codeName": "TripodFactory",
					"description": "Produces various types of tripod weapons.",
					"hitArea": [
						{
							"shape": [ 79.7,-145.15,25.15,-143.94,25.76,-192.42,51.21,-198.48,79.09,-192.42 ]
						},
						{
							"shape": [ -103.33,170.61,-114.85,195.45,-114.85,170.61 ]
						},
						{
							"shape": [ -114.85,195.45,-103.33,170.61,80.3,143.33,80.3,195.45 ]
						},
						{
							"shape": [ -72.42,-128.18,-114.85,114.85,-114.85,-128.18 ]
						},
						{
							"shape": [ 25.15,-143.94,-72.42,-128.18,-71.82,-143.94 ]
						},
						{
							"shape": [ 25.15,-143.94,79.7,-145.15,105.15,-142.73,-103.33,114.85,-114.85,114.85,-72.42,-128.18 ]
						},
						{
							"shape": [ -103.33,114.85,105.15,-142.73,80.3,143.33,-103.33,170.61 ]
						},
						{
							"shape": [ 80.3,143.33,105.15,-142.73,106.36,142.73 ]
						}
					],
					"icon": "game/Textures/UI/ItemIcons/FacilityFactoryAmmoTripod.webp",
					"texture": "game/Textures/Structures/ammunition_factory_tripod_factory.webp",
					"techId": "unlockfacilitytier2",
					"cost": {
						"facilitymaterials1": 50
					},
					"_productionLength": 8,
					"production": [
						{
							"id": 4,
							"input": {
								"facilitymaterials1": 2
							},
							"output": {
								"tripod": 1
							},
							"time": 25
						},
						{
							"id": 0,
							"input": {
								"facilitymaterials1": 3
							},
							"output": {
								"isgtc": 1
							},
							"faction": "c",
							"time": 25
						},
						{
							"id": 2,
							"input": {
								"facilitymaterials1": 3
							},
							"output": {
								"atrifletc": 1
							},
							"faction": "c",
							"time": 25
						},
						{
							"id": 3,
							"input": {
								"facilitymaterials1": 3
							},
							"output": {
								"mgtc": 1
							},
							"faction": "c",
							"time": 25
						},
						{
							"id": 1,
							"input": {
								"facilitymaterials1": 3
							},
							"output": {
								"grenadelaunchertc": 1
							},
							"faction": "c",
							"time": 25
						},
						{
							"id": 6,
							"input": {
								"facilitymaterials1": 3
							},
							"output": {
								"rpgtw": 1
							},
							"faction": "w",
							"time": 25
						},
						{
							"id": 5,
							"input": {
								"facilitymaterials1": 3
							},
							"output": {
								"atrpgtw": 1
							},
							"faction": "w",
							"time": 25
						},
						{
							"id": 7,
							"input": {
								"facilitymaterials1": 3
							},
							"output": {
								"mgtw": 1
							},
							"faction": "w",
							"time": 25
						}
					]
				},
				"rocket_factory": {
					"name": "Rocket Factory",
					"codeName": "RocketFactory",
					"description": "Produces various types of Rockets.",
					"hitArea": [
						{
							"shape": [ 79.7,-145.15,25.15,-143.94,25.76,-192.42,51.21,-198.48,79.09,-192.42 ]
						},
						{
							"shape": [ -103.33,170.61,-114.85,195.45,-114.85,170.61 ]
						},
						{
							"shape": [ -114.85,195.45,-103.33,170.61,80.3,143.33,80.3,195.45 ]
						},
						{
							"shape": [ -72.42,-128.18,-114.85,114.85,-114.85,-128.18 ]
						},
						{
							"shape": [ 25.15,-143.94,-72.42,-128.18,-71.82,-143.94 ]
						},
						{
							"shape": [ 25.15,-143.94,79.7,-145.15,105.15,-142.73,-103.33,114.85,-114.85,114.85,-72.42,-128.18 ]
						},
						{
							"shape": [ -103.33,114.85,105.15,-142.73,80.3,143.33,-103.33,170.61 ]
						},
						{
							"shape": [ 80.3,143.33,105.15,-142.73,106.36,142.73 ]
						}
					],
					"icon": "game/Textures/UI/ItemIcons/AmmoFactoryRocketFacilityModIcon.webp",
					"texture": "game/Textures/Structures/ammunition_factory_rocket_factory.webp",
					"techId": "unlockfacilitytier2",
					"cost": {
						"facilitymaterials2": 35
					},
					"_productionLength": 2,
					"production": [
						{
							"id": 0,
							"input": {
								"heavyexplosive": 1,
								"facilitymaterials1": 2
							},
							"output": {
								"herocketammo": 1
							},
							"faction": "c",
							"time": 25
						},
						{
							"id": 1,
							"input": {
								"heavyexplosive": 1,
								"facilitymaterials1": 2
							},
							"output": {
								"firerocketammo": 1
							},
							"faction": "w",
							"time": 25
						}
					]
				},
				"large_shell_factory": {
					"name": "Large Shell Factory",
					"codeName": "LargeShellFactory",
					"description": "Produces large calibre ordnance for use with tanks and artillery.",
					"hitArea": [
						{
							"shape": [ 79.7,-145.15,25.15,-143.94,25.76,-192.42,51.21,-198.48,79.09,-192.42 ]
						},
						{
							"shape": [ -103.33,170.61,-114.85,195.45,-114.85,170.61 ]
						},
						{
							"shape": [ -114.85,195.45,-103.33,170.61,80.3,143.33,80.3,195.45 ]
						},
						{
							"shape": [ -72.42,-128.18,-114.85,114.85,-114.85,-128.18 ]
						},
						{
							"shape": [ 25.15,-143.94,-72.42,-128.18,-71.82,-143.94 ]
						},
						{
							"shape": [ 25.15,-143.94,79.7,-145.15,105.15,-142.73,-103.33,114.85,-114.85,114.85,-72.42,-128.18 ]
						},
						{
							"shape": [ -103.33,114.85,105.15,-142.73,80.3,143.33,-103.33,170.61 ]
						},
						{
							"shape": [ 80.3,143.33,105.15,-142.73,106.36,142.73 ]
						}
					],
					"icon": "game/Textures/UI/ItemIcons/AmmoFactoryLargeShellFactoryModIcon.webp",
					"texture": "game/Textures/Structures/ammunition_factory_large_shell_factory.webp",
					"techId": "unlockfacilitytier2",
					"cost": {
						"facilitymaterials2": 175
					},
					"_productionLength": 5,
					"production": [
						{
							"id": 0,
							"input": {
								"heavyexplosive": 2,
								"facilitymaterials1": 2
							},
							"output": {
								"battletankammo": 1
							},
							"time": 60
						},
						{
							"id": 1,
							"input": {
								"heavyexplosive": 2,
								"facilitymaterials1": 2
							},
							"output": {
								"atlargeammo": 1
							},
							"time": 60
						},
						{
							"id": 2,
							"input": {
								"heavyexplosive": 6,
								"facilitymaterials1": 4
							},
							"output": {
								"lrartilleryammo": 1
							},
							"time": 120,
							"power": -6
						},
						{
							"id": 3,
							"input": {
								"explosive": 3,
								"facilitymaterials1": 2
							},
							"output": {
								"lightartilleryammo": 1
							},
							"time": 25
						},
						{
							"id": 4,
							"input": {
								"heavyexplosive": 2,
								"facilitymaterials1": 3
							},
							"output": {
								"heavyartilleryammo": 1
							},
							"time": 40
						}
					]
				}
			}
		},
		"atpillbox": {
			"name": "Anti-Tank Pillbox",
			"codeName": "ATPillbox",
			"description": "This heavily reinforced pillbox allows the garrisoned infantry with anti-tank rifles to fire on approaching enemy armour from a safe position.",
			"category": "defenses",
			"categoryOrder": 8,
			"range": {
				"type": "killboxAT",
				"lineOfSight": true,
				"min": 3.5,
				"max": 28
			},
			"hitArea": [
				{
					"shape": [ -54.85,-85.45,49.39,-85.45,99.7,-3.03,51.82,85.45,-48.18,87.27,-102.73,3.64 ]
				}
			],
			"icon": "game/Textures/UI/StructureIcons/ATPillboxIcon.webp",
			"texture": "game/Textures/Structures/atpillbox.webp",
			"techId": "unlockatpillbox",
			"maxHealth": 950,
			"cost": {
				"cloth": 85
			},
			"repairCost": 85
		},
		"barbedwirespline": {
			"name": "Barbed Wire",
			"codeName": "BarbedWireSpline",
			"description": "Used to slow down enemy infantry movement. Can be dismantled with a Wrench.",
			"category": "defenses",
			"categoryOrder": 1,
			"hasHandle": true,
			"isBezier": true,
			"simpleBezier": true,
			"minLength": 3,
			"maxLength": 10,
			"icon": "game/Textures/UI/StructureIcons/BarbedWireCornerStructureIcon.webp",
			"texture": "game/Textures/Structures/barbedwirespline.webp",
			"textureFrontCap": "game/Textures/Structures/barbedwirespline_front.webp",
			"textureBackCap": "game/Textures/Structures/barbedwirespline_back.webp",
			"canSnap": true,
			"sockets": [
				{
					"id": 0,
					"type": [
						{
							"mask": 4608,
							"category": 4096
						},
						{
							"mask": 1,
							"category": 4096
						}
					],
					"cap": "front",
					"rotation": 270
				},
				{
					"id": 1,
					"type": [
						{
							"mask": 4608,
							"category": 4096
						},
						{
							"mask": 1,
							"category": 4096
						}
					],
					"cap": "back",
					"rotation": 90
				}
			],
			"maxHealth": 600,
			"cost": {
				"barbedwirematerials": 3
			},
			"repairCost": 20
		},
		"barbedwirewallspline": {
			"name": "Barbed Wire Fence",
			"codeName": "BarbedWireWallSpline",
			"description": "Used to prevent enemy infantry movement through an area. This structure is difficult to destroy with conventional weapons and must be dismantled with a Wrench.",
			"category": "defenses",
			"categoryOrder": 2,
			"hideInList": true,
			"simpleBezier": true,
			"minLength": 4,
			"maxLength": 10,
			"icon": "game/Textures/UI/ItemIcons/BarbedWireFenceStructureIcon.webp",
			"texture": null,
			"canSnap": true,
			"sockets": [
				{
					"id": 0,
					"type": [
						{
							"mask": 4609,
							"category": 4608
						}
					],
					"cap": "front",
					"rotation": 270
				},
				{
					"id": 1,
					"type": [
						{
							"mask": 4609,
							"category": 4608
						}
					],
					"cap": "back",
					"rotation": 90
				}
			],
			"maxHealth": 10000,
			"cost": {
				"barbedwirematerials": 3
			},
			"repairCost": 20
		},
		"barge": {
			"name": "BMS - Aquatipper",
			"codeName": "Barge",
			"description": "A large shipping vessel, the Aquatipper is used to transport vehicles, equipment, and personnel over large bodies of water.",
			"category": "vehicles",
			"categoryOrder": 20,
			"sortLayer": "vehicle",
			"hitArea": [
				{
					"shape": [ -181.21,98.18,-182.42,-97.58,186.06,-98.18,186.67,95.76 ]
				},
				{
					"shape": [ -182.42,-97.58,-182.42,-37.58,-191.52,-69.09 ]
				}
			],
			"icon": "game/Textures/UI/VehicleIcons/BargeVehicleIcon.webp",
			"texture": "game/Textures/Vehicles/barge.webp"
		},
		"bms_foreman_stacker": {
			"name": "BMS Foreman Stacker",
			"codeName": "FacilityCrane",
			"description": "The Foreman is an all-purpose, no-frills, easy to assemble crane. Perfect for hauling heavy loads in facilities where loading and offloading is commonplace.",
			"category": "factories",
			"categoryOrder": 100,
			"color": 1052688,
			"width": 3.5,
			"length": 3.5,
			"range": {
				"type": "crane",
				"min": 4.5,
				"max": 22.5
			},
			"sortLayer": "crane",
			"icon": "game/Textures/UI/FacilityCraneIcon.webp",
			"texture": "game/Textures/Structures/bms_foreman_stacker.webp",
			"textureOffset": {
				"x": 445,
				"y": 258
			},
			"power": -0.5,
			"sockets": [
				{
					"id": 0,
					"name": "power",
					"type": [
						{
							"mask": 131072,
							"category": 1048576
						}
					],
					"x": -0.21,
					"y": 3.13,
					"rotation": 270
				}
			],
			"techId": "unlockfacilitytier2",
			"maxHealth": 1000,
			"cost": {
				"facilitymaterials2": 10
			},
			"repairCost": 100
		},
		"bms_overseer_skyhauler": {
			"name": "BMS Overseer Sky-Hauler",
			"codeName": "LargeCrane",
			"description": "The star of the BMS arsenal of military-grade construction equipment, the Overseer Sky-Hauler makes several tonnes look like a feather, and enjoys a high level of mobility while deployed along heavy-duty rail lines.",
			"category": "factories",
			"categoryOrder": 105,
			"width": 6,
			"length": 10,
			"range": {
				"type": "crane",
				"min": 13.75,
				"max": 33.75
			},
			"sortLayer": "crane",
			"icon": "game/Textures/UI/LargeCraneItemIcon.webp",
			"texture": "game/Textures/Structures/large_crane.webp",
			"textureOffset": {
				"x": 382,
				"y": 578
			},
			"garrisonSupplyMultiplier": 0,
			"techId": "unlockfacilitytier3",
			"maxHealth": 1000,
			"cost": {
				"facilitymaterials3": 35
			},
			"repairCost": 100
		},
		"busc": {
			"name": "R-15 - “Chariot”",
			"codeName": "BusC",
			"description": "The “Chariot” is a transport vehicle used to shuttle personnel to the front line.",
			"category": "vehicles",
			"categoryOrder": 5,
			"faction": "c",
			"sortLayer": "vehicle",
			"icon": "game/Textures/UI/VehicleIcons/BusIcon.webp",
			"texture": "game/Textures/Vehicles/busc.webp",
			"techId": "unlockbus"
		},
		"busw": {
			"name": "Dunne Caravaner 2f",
			"codeName": "BusW",
			"description": "The Caravaner is a transport vehicle used to shuttle personnel to the front line.",
			"category": "vehicles",
			"categoryOrder": 6,
			"faction": "w",
			"sortLayer": "vehicle",
			"icon": "game/Textures/UI/VehicleIcons/BusWarIcon.webp",
			"texture": "game/Textures/Vehicles/busw.webp"
		},
		"catwalk_bridge": {
			"name": "Catwalk Bridge",
			"codeName": "FacilityCatwalkBridge",
			"description": "A raised walkway for creating paths above complex Facilities.",
			"category": "factories",
			"categoryOrder": 95,
			"sortLayer": "overhead",
			"hasHandle": true,
			"hasOutline": false,
			"minLength": 8,
			"maxLength": 20,
			"icon": "game/Textures/UI/ItemIcons/facilitieCatwalkPlatfromIcon.webp",
			"texture": "game/Textures/Structures/catwalk_bridge.webp",
			"canSnap": true,
			"sockets": [
				{
					"id": 0,
					"type": [
						{
							"mask": 33554432,
							"category": 33554432
						},
						{
							"mask": 33554432,
							"category": 67108864
						}
					],
					"cap": "front",
					"rotation": 270
				},
				{
					"id": 1,
					"type": [
						{
							"mask": 33554432,
							"category": 33554432
						},
						{
							"mask": 33554432,
							"category": 67108864
						}
					],
					"cap": "back",
					"rotation": 90
				}
			],
			"techId": "unlockfacilitytier2",
			"maxHealth": 150,
			"cost": {
				"facilitymaterials2": 10
			},
			"repairCost": 100
		},
		"catwalk_platform": {
			"name": "Catwalk Platform",
			"codeName": "FacilityCatwalkPlatform",
			"description": "A raised walkway for creating paths above complex Facilities.",
			"category": "factories",
			"categoryOrder": 90,
			"sortLayer": "overhead",
			"icon": "game/Textures/UI/ItemIcons/FacilityCatwalkRampConnectorIcon.webp",
			"texture": "game/Textures/Structures/catwalk_platform.webp",
			"canSnap": true,
			"snapNearest": true,
			"sockets": [
				{
					"id": 0,
					"type": [
						{
							"mask": 67108864,
							"category": 100663296
						}
					],
					"x": 0.03,
					"y": 1.31,
					"rotation": 270
				},
				{
					"id": 1,
					"type": [
						{
							"mask": 67108864,
							"category": 100663296
						}
					],
					"x": 1.32,
					"y": 0.02,
					"rotation": 0
				},
				{
					"id": 2,
					"type": [
						{
							"mask": 67108864,
							"category": 100663296
						}
					],
					"x": 2.61,
					"y": 1.31,
					"rotation": 90
				},
				{
					"id": 3,
					"type": [
						{
							"mask": 67108864,
							"category": 100663296
						}
					],
					"x": 1.32,
					"y": 2.6,
					"rotation": 180
				}
			],
			"techId": "unlockfacilitytier2",
			"maxHealth": 150,
			"cost": {
				"facilitymaterials2": 10
			},
			"repairCost": 100
		},
		"catwalk_stairs": {
			"name": "Catwalk Stairs",
			"codeName": "FacilityCatwalkStairs",
			"description": "Stairs that connect to raised Catwalks, which create paths above complex Facilities.",
			"category": "factories",
			"categoryOrder": 85,
			"sortLayer": "overhead",
			"icon": "game/Textures/UI/ItemIcons/FacilityCatwalkRampIcon.webp",
			"texture": "game/Textures/Structures/catwalk_stairs.webp",
			"canSnap": true,
			"sockets": [
				{
					"id": 0,
					"type": [
						{
							"mask": 67108864,
							"category": 100663296
						}
					],
					"x": 11.7,
					"y": 1.34,
					"rotation": 90
				}
			],
			"techId": "unlockfacilitytier2",
			"maxHealth": 150,
			"cost": {
				"facilitymaterials2": 10
			},
			"repairCost": 100
		},
		"coal_refinery": {
			"name": "Coal Refinery",
			"codeName": "FacilityRefineryCoal",
			"description": "A processing plant that refines Coal into useful materials used in facility production and power.",
			"category": "factories",
			"categoryOrder": 30,
			"color": 4210752,
			"hitArea": [
				{
					"shape": [ -69.39,184.55,-54.85,105.15,6.97,105.15,6.97,184.55 ]
				},
				{
					"shape": [ 18.48,20.3,65.76,-37.88,65.76,20.3 ]
				},
				{
					"shape": [ -7.58,40.3,-54.85,40.3,18.48,20.3,18.48,38.48 ]
				},
				{
					"shape": [ 83.94,-37.88,65.76,-37.88,18.48,-139.09,83.94,-138.48 ]
				},
				{
					"shape": [ -83.94,0.91,-83.94,-147.58,18.48,-139.09,65.76,-37.88,18.48,20.3,-54.85,40.3,-80.91,40.3 ]
				},
				{
					"shape": [ 18.48,-139.09,-83.94,-147.58,-80.91,-183.94,16.67,-185.76 ]
				},
				{
					"shape": [ -54.85,105.15,-69.39,184.55,-69.39,105.15 ]
				},
				{
					"shape": [ -7.58,105.15,-54.85,105.15,-54.85,40.3,-7.58,40.3 ]
				}
			],
			"icon": "game/Textures/UI/ItemIcons/FacilitiesCoolRefineryBaseIcon.webp",
			"texture": "game/Textures/Structures/coal_refinery.webp",
			"power": -3,
			"sockets": [
				{
					"id": 0,
					"name": "power",
					"type": [
						{
							"mask": 131072,
							"category": 1048576
						}
					],
					"x": 0,
					"y": 2.59,
					"rotation": 270
				}
			],
			"maxHealth": 3000,
			"cost": {
				"facilitymaterials1": 50
			},
			"repairCost": 150,
			"_productionLength": 1,
			"production": [
				{
					"id": 0,
					"input": {
						"coal": 200
					},
					"output": {
						"facilitycoal1": 180
					},
					"time": 270
				}
			],
			"upgrades": {
				"coke_furnace": {
					"name": "Coke Furnace",
					"codeName": "CokeFurnace",
					"description": "A high powered furnace that brings Coal to high temperatures to separate out non-volatile Coke.",
					"hitArea": [
						{
							"shape": [ -63.03,184.55,-63.03,105.15,13.33,105.15,13.33,184.55 ]
						},
						{
							"shape": [ 24.85,-159.7,-74.55,40.3,-74.55,-181.52,-25.45,-185.76,24.85,-181.52 ]
						},
						{
							"shape": [ 76.97,14.85,-74.55,40.3,24.85,-159.7,77.58,-151.82 ]
						},
						{
							"shape": [ 36.97,52.42,0,55.45,-48.48,40.3,45.45,20.3,45.45,41.52 ]
						},
						{
							"shape": [ -48.48,105.15,-48.48,40.3,0,55.45,-1.21,105.15 ]
						},
						{
							"shape": [ -74.55,40.3,45.45,20.3,-48.48,40.3 ]
						}
					],
					"icon": "game/Textures/UI/ItemIcons/FacilitiesCoolRefineryCokeFurnaceIcon.webp",
					"texture": "game/Textures/Structures/coal_refinery_coke_furnace.webp",
					"positionOffset": {
						"x": -21
					},
					"cost": {
						"facilitymaterials1": 200
					},
					"_productionLength": 1,
					"production": [
						{
							"id": 0,
							"input": {
								"coal": 200
							},
							"output": {
								"facilitycoal1": 165,
								"sulfur": 15
							},
							"time": 270
						}
					]
				},
				"liquifier": {
					"name": "Coal Liquefier",
					"codeName": "CoalLiquefier",
					"description": "Processing vats that refines Coal into Oil.",
					"hitArea": [
						{
							"shape": [ -85.76,184.55,-85.76,105.15,-8.79,105.15,-8.79,184.55 ]
						},
						{
							"shape": [ -23.33,41.52,65.76,-8.79,66.36,39.09 ]
						},
						{
							"shape": [ 2.73,-159.7,-97.27,40.3,-97.27,-181.52,-45.76,-186.36,2.73,-181.52 ]
						},
						{
							"shape": [ 73.64,-35.45,72.42,-139.09,85.76,-133.03,94.85,-118.48,99.09,-37.27 ]
						},
						{
							"shape": [ 72.42,-139.09,-97.27,40.3,2.73,-159.7,72.42,-159.7 ]
						},
						{
							"shape": [ 73.64,-35.45,-70.61,40.3,-97.27,40.3,72.42,-139.09 ]
						},
						{
							"shape": [ 65.76,-8.79,-23.33,41.52,-70.61,40.3,73.64,-35.45,72.42,-13.03 ]
						},
						{
							"shape": [ -23.33,41.52,-23.94,105.15,-70.61,105.15,-70.61,40.3 ]
						}
					],
					"icon": "game/Textures/UI/StructureIcons/FacilityCoalLiquefierIcon.webp",
					"texture": "game/Textures/Structures/coal_refinery_liquifier.webp",
					"positionOffset": {
						"x": 52
					},
					"sockets": [
						{
							"id": 0,
							"name": "power",
							"type": [
								{
									"mask": 131072,
									"category": 1048576
								}
							],
							"x": 0,
							"y": 2.59,
							"rotation": 270
						},
						{
							"id": 1,
							"name": "pipeout",
							"type": [
								{
									"mask": 16779264,
									"category": 16384
								}
							],
							"flow": "out",
							"x": 5.79,
							"y": 4.68,
							"rotation": 180
						},
						{
							"id": 2,
							"name": "pipein",
							"type": [
								{
									"mask": 16779264,
									"category": 16384
								}
							],
							"flow": "in",
							"x": 4.75,
							"y": 7.07,
							"rotation": 180
						}
					],
					"techId": "unlockfacilitytier2",
					"cost": {
						"facilitymaterials2": 20
					},
					"_productionLength": 1,
					"production": [
						{
							"id": 0,
							"input": {
								"coal": 300,
								"water": 50
							},
							"output": {
								"concrete": 1,
								"oil": 50
							},
							"time": 270,
							"power": -6
						}
					]
				},
				"adv_liquifier": {
					"name": "Advanced Coal Liquefier",
					"codeName": "AdvCoalLiquefier",
					"description": "Advanced processing vats that refine large amounts of coal into Heavy Oil.",
					"hitArea": [
						{
							"shape": [ -85.15,184.55,-85.15,105.15,-8.79,105.15,-8.79,184.55 ]
						},
						{
							"shape": [ 41.52,-13.03,73.64,-35.45,72.42,-13.03 ]
						},
						{
							"shape": [ 73.64,-35.45,2.73,-159.7,72.42,-139.09,93.03,-119.7,96.67,-87.58,98.48,-36.06 ]
						},
						{
							"shape": [ 37.27,92.42,61.52,11.82,65.76,103.94,36.67,104.55 ]
						},
						{
							"shape": [ 2.73,-159.7,-97.27,40.3,-96.67,-182.12,-46.97,-185.76,2.73,-181.52 ]
						},
						{
							"shape": [ -23.33,93.64,-70.61,40.3,41.52,-13.03,61.52,11.82,37.27,92.42 ]
						},
						{
							"shape": [ 93.03,-119.7,72.42,-139.09,85.76,-133.03 ]
						},
						{
							"shape": [ 72.42,-139.09,2.73,-159.7,72.42,-159.7 ]
						},
						{
							"shape": [ 73.64,-35.45,41.52,-13.03,-70.61,40.3,-97.27,40.3,2.73,-159.7 ]
						},
						{
							"shape": [ -70.61,40.3,-23.33,93.64,-23.33,105.15,-70.61,105.15 ]
						}
					],
					"icon": "game/Textures/UI/StructureIcons/FacilityAdvancedCoalLiquefierIcon.webp",
					"texture": "game/Textures/Structures/coal_refinery_adv_liquifier.webp",
					"positionOffset": {
						"x": 52
					},
					"sockets": [
						{
							"id": 0,
							"name": "power",
							"type": [
								{
									"mask": 131072,
									"category": 1048576
								}
							],
							"x": 0,
							"y": 2.59,
							"rotation": 270
						},
						{
							"id": 1,
							"name": "pipeout",
							"type": [
								{
									"mask": 16779264,
									"category": 16384
								}
							],
							"flow": "out",
							"x": 5.79,
							"y": 4.68,
							"rotation": 180
						},
						{
							"id": 3,
							"name": "pipein",
							"type": [
								{
									"mask": 16779264,
									"category": 16384
								}
							],
							"flow": "in",
							"x": 4.76,
							"y": 9.12,
							"rotation": 180
						}
					],
					"techId": "unlockfacilitytier3",
					"cost": {
						"facilitymaterials3": 65
					},
					"_productionLength": 1,
					"production": [
						{
							"id": 0,
							"input": {
								"coal": 300,
								"water": 100
							},
							"output": {
								"facilitycoal1": 260,
								"facilityoil1": 60
							},
							"time": 405,
							"power": -6
						}
					]
				}
			}
		},
		"componentmine": {
			"name": "Component Mine",
			"codeName": "ComponentMine",
			"description": "An old mine that automatically gathers Components using Fuel.",
			"category": "world",
			"icon": "game/Textures/UI/StructureIcons/ComponentMineIcon.webp",
			"texture": "game/Textures/Structures/componentmine.webp",
			"maxHealth": 1000,
			"cost": false,
			"repairCost": 200
		},
		"concretemixer": {
			"name": "Concrete Mixer",
			"codeName": "ConcreteMixer",
			"description": "A portable device that mixes various materials to form Concrete, which are used to build heavily fortified structures.",
			"category": "shippables",
			"categoryOrder": 5,
			"icon": "game/Textures/UI/StructureIcons/ConcreteMixerIcon.webp",
			"texture": "game/Textures/Structures/concretemixer.webp",
			"techId": "unlockconcretemixer",
			"maxHealth": 1200,
			"cost": {
				"wood": 75
			},
			"repairCost": 75,
			"_productionLength": 1,
			"production": [
				{
					"id": 0,
					"input": {
						"components": 20
					},
					"output": {
						"concrete": 1
					},
					"time": 20
				}
			]
		},
		"construction_vehicle": {
			"name": "BMS - Universal Assembly Rig",
			"codeName": "Construction",
			"description": "A specialized vehicle designed by the Basset Motor Society used in the construction of large structures.",
			"category": "vehicles",
			"categoryOrder": 9,
			"sortLayer": "vehicle",
			"hitArea": [
				{
					"shape": [ -100.91,18.48,-114.85,41.52,-114.85,19.09 ]
				},
				{
					"shape": [ 29.39,-18.48,42.12,-41.52,42.73,-18.48 ]
				},
				{
					"shape": [ 86.97,38.48,80.3,31.21,80.3,16.67,86.97,9.39,113.64,14.85,114.24,33.03 ]
				},
				{
					"shape": [ -114.85,-41.52,42.12,-41.52,-101.52,-17.88,-114.85,-18.48 ]
				},
				{
					"shape": [ 53.03,31.21,30,17.27,80.3,16.67,80.3,31.21 ]
				},
				{
					"shape": [ 42.73,41.52,-114.85,41.52,30,17.27,53.03,31.21 ]
				},
				{
					"shape": [ -114.85,41.52,-100.91,18.48,29.39,-18.48,30,17.27 ]
				},
				{
					"shape": [ 42.12,-41.52,29.39,-18.48,-100.91,18.48,-101.52,-17.88 ]
				}
			],
			"icon": "game/Textures/UI/VehicleIcons/ConstructionVehicleIcon.webp",
			"texture": "game/Textures/Vehicles/construction_vehicle.webp",
			"cost": false
		},
		"constructionutility": {
			"name": "BMS - Fabricator",
			"codeName": "ConstructionUtility",
			"description": "An advanced variant of the Universal Assembly Rig, the BMS - Fabricator is fitted with a unique kit designed to handle advanced or specialized construction and excavation jobs.",
			"category": "vehicles",
			"categoryOrder": 10,
			"hitArea": [
				{
					"shape": [ -103.94,18.48,-117.88,41.52,-117.88,19.09 ]
				},
				{
					"shape": [ 26.36,-18.48,39.09,-41.52,39.7,-18.48 ]
				},
				{
					"shape": [ 83.94,38.48,77.27,31.21,77.27,16.67,83.94,9.39,110.61,14.85,111.21,33.03 ]
				},
				{
					"shape": [ -117.88,-41.52,39.09,-41.52,-104.55,-17.88,-117.88,-18.48 ]
				},
				{
					"shape": [ 50,31.21,26.97,17.27,77.27,16.67,77.27,31.21 ]
				},
				{
					"shape": [ 39.7,41.52,-117.88,41.52,26.97,17.27,50,31.21 ]
				},
				{
					"shape": [ -117.88,41.52,-103.94,18.48,26.36,-18.48,26.97,17.27 ]
				},
				{
					"shape": [ 39.09,-41.52,26.36,-18.48,-103.94,18.48,-104.55,-17.88 ]
				}
			],
			"icon": "game/Textures/UI/VehicleIcons/AdvancedConstructionVehicleIcon.webp",
			"texture": "game/Textures/Vehicles/advanced_construction_vehicle.webp",
			"techId": "unlockconstructionutility"
		},
		"crane": {
			"name": "BMS - Class 2 Mobile Auto-Crane",
			"codeName": "Crane",
			"description": "The Basset Motor Society’s Class 2 Mobile Auto-Crane is used to lift and reposition vehicles and very heavy equipment.",
			"category": "vehicles",
			"categoryOrder": 11,
			"range": {
				"type": "crane",
				"min": null,
				"max": null
			},
			"sortLayer": "vehicle",
			"hitArea": [
				{
					"shape": [ -25.15,73.64,-58.48,42.12,-25.15,42.73 ]
				},
				{
					"shape": [ -59.09,-42.73,-25.15,-73.64,-25.15,-42.73 ]
				},
				{
					"shape": [ -236.67,-73.64,-25.15,-73.64,-59.09,-42.73,-221.52,-36.67,-236.67,-42.73 ]
				},
				{
					"shape": [ -220.91,34.85,-25.15,73.64,-236.67,73.64,-236.67,42.73 ]
				},
				{
					"shape": [ 235.45,9.39,192.42,19.7,-65.76,19.7,-65.76,-19.7,191.82,-19.7,236.67,-10 ]
				},
				{
					"shape": [ -221.52,-36.67,-58.48,42.12,-25.15,73.64,-220.91,34.85 ]
				},
				{
					"shape": [ -65.76,-19.7,-221.52,-36.67,-59.09,-42.73 ]
				},
				{
					"shape": [ -65.76,19.7,-221.52,-36.67,-65.76,-19.7 ]
				},
				{
					"shape": [ -58.48,42.12,-221.52,-36.67,-65.76,19.7 ]
				}
			],
			"icon": "game/Textures/UI/VehicleIcons/CraneVehicleIcon.webp",
			"texture": "game/Textures/Vehicles/crane.webp",
			"cost": false
		},
		"diesel_power_plant": {
			"name": "Diesel Power Plant",
			"codeName": "FacilityPowerDiesel",
			"description": "A structure that generates power by burning Diesel.",
			"category": "power",
			"categoryOrder": 3,
			"hitArea": [
				{
					"shape": [ -46.67,42.73,112.73,112.42,-46.67,110.61 ]
				},
				{
					"shape": [ 90.3,-101.52,112.73,16.67,112.73,112.42,-86.06,-73.03,-78.79,-91.21,49.09,-118.48,86.67,-113.03 ]
				},
				{
					"shape": [ 49.09,-118.48,-78.79,-91.21,-80,-120.91 ]
				},
				{
					"shape": [ -85.45,34.24,-46.67,42.73,-85.45,42.73 ]
				},
				{
					"shape": [ -126.06,29.39,-126.06,-70.61,-85.45,34.24,-116.97,37.27 ]
				},
				{
					"shape": [ -126.06,-70.61,-46.67,42.73,-85.45,34.24 ]
				},
				{
					"shape": [ -126.06,-70.61,-115.76,-76.06,-86.06,-73.03,112.73,112.42,-46.67,42.73 ]
				},
				{
					"shape": [ 127.27,93.64,112.73,93.64,112.73,16.67,127.27,16.67 ]
				},
				{
					"shape": [ 112.73,16.67,90.3,-101.52,112.12,-99.7 ]
				},
				{
					"shape": [ -78.79,-91.21,-86.06,-73.03,-85.45,-80.3 ]
				}
			],
			"icon": "game/Textures/UI/ItemIcons/DiesePowerPlanetBaseIcon.webp",
			"texture": "game/Textures/Structures/diesel_power_plant.webp",
			"power": 5,
			"sockets": [
				{
					"id": 0,
					"name": "pipein",
					"type": [
						{
							"mask": 2048,
							"category": 16384
						}
					],
					"flow": "in",
					"x": 1.44,
					"y": 0.54,
					"rotation": 270
				},
				{
					"id": 1,
					"name": "power",
					"type": [
						{
							"mask": 131072,
							"category": 1048576
						}
					],
					"x": 5.19,
					"y": 7.29,
					"rotation": 180
				}
			],
			"maxHealth": 1500,
			"cost": {
				"cloth": 150
			},
			"repairCost": 100,
			"_productionLength": 1,
			"production": [
				{
					"id": 0,
					"input": {
						"diesel": 25
					},
					"time": 45
				}
			],
			"productionScaling": false,
			"upgrades": {
				"petrol_power": {
					"name": "Petrol Power Plant",
					"codeName": "Petrol",
					"description": "A generator that burns petrol to generate more power.",
					"hitArea": [
						{
							"shape": [ -43.64,26.36,-38.18,-80.3,18.18,111.82,-44.24,110.61 ]
						},
						{
							"shape": [ -77.58,-120.3,50.91,-119.7,90.91,-113.03,92.12,-102.12,-38.79,-91.21,-77.58,-91.82 ]
						},
						{
							"shape": [ -123.03,-80.3,-38.18,-80.3,-107.88,-51.82,-123.03,-52.42 ]
						},
						{
							"shape": [ 78.18,112.42,-38.18,-80.3,-38.79,-91.21,115.15,93.64,114.55,111.21 ]
						},
						{
							"shape": [ -97.58,48.79,-129.09,13.03,-108.48,-31.82,-38.18,-80.3,-43.64,26.36,-67.27,48.79 ]
						},
						{
							"shape": [ -108.48,-31.82,-129.09,13.03,-127.88,-12.42 ]
						},
						{
							"shape": [ -129.09,13.03,-97.58,48.79,-121.21,34.24 ]
						},
						{
							"shape": [ -38.18,-80.3,-108.48,-31.82,-107.88,-51.82 ]
						},
						{
							"shape": [ 115.15,16.67,-38.79,-91.21,92.12,-102.12,115.15,-99.7 ]
						},
						{
							"shape": [ 129.7,93.64,115.15,16.67,129.7,16.67 ]
						},
						{
							"shape": [ 129.7,93.64,115.15,93.64,-38.79,-91.21,115.15,16.67 ]
						},
						{
							"shape": [ 18.18,111.82,78.18,120.91,18.79,120.91 ]
						},
						{
							"shape": [ -38.18,-80.3,78.18,112.42,78.18,120.91,18.18,111.82 ]
						}
					],
					"icon": "game/Textures/UI/ItemIcons/DiesePowerPlanetPetrolIcon.webp",
					"texture": "game/Textures/Structures/diesel_power_plant_petrol_power.webp",
					"positionOffset": {
						"x": -8
					},
					"sockets": [
						{
							"id": 0,
							"name": "pipein",
							"type": [
								{
									"mask": 2048,
									"category": 16384
								}
							],
							"flow": "in",
							"x": 1.58,
							"y": 0.54,
							"rotation": 270
						},
						{
							"id": 1,
							"name": "power",
							"type": [
								{
									"mask": 131072,
									"category": 1048576
								}
							],
							"x": 5.33,
							"y": 7.29,
							"rotation": 180
						}
					],
					"cost": {
						"facilitymaterials1": 100
					},
					"_productionLength": 1,
					"production": [
						{
							"id": 0,
							"input": {
								"petrol": 50
							},
							"time": 90,
							"power": 12
						}
					]
				},
				"coal": {
					"name": "Coal Power Plant",
					"codeName": "Coal",
					"description": "A generator that burns coal to generate power.",
					"hitArea": [
						{
							"shape": [ -103.03,-91.21,-78.79,-91.21,-116.36,60.3,-116.1,-76.93,-111.52,-86.36 ]
						},
						{
							"shape": [ -116.36,60.3,49.09,-118.48,86.67,-113.03,90.3,-101.52,-46.67,68.79,-55.76,73.64,-104.24,73.64,-112.12,68.79 ]
						},
						{
							"shape": [ -46.67,68.79,90.3,-101.52,112.12,-99.7,112.73,112.42,-46.67,110.61 ]
						},
						{
							"shape": [ 49.09,-118.48,-78.79,-91.21,-80,-120.91 ]
						},
						{
							"shape": [ 49.09,-118.48,-116.36,60.3,-78.79,-91.21 ]
						},
						{
							"shape": [ 127.27,93.64,112.73,93.64,112.73,16.67,127.27,16.67 ]
						}
					],
					"icon": "game/Textures/UI/ItemIcons/FacilityPowerDieselCoalIcon.webp",
					"texture": "game/Textures/Structures/diesel_power_plant_coal.webp",
					"cost": {
						"facilitymaterials1": 100
					},
					"_productionLength": 1,
					"production": [
						{
							"id": 0,
							"input": {
								"coal": 60
							},
							"time": 90,
							"power": 5
						}
					]
				}
			}
		},
		"emplacedatlargew": {
			"name": "Huber Starbreaker 94.5mm",
			"codeName": "EmplacedATLargeW",
			"description": "Built to compliment other free-standing artillery pieces, the emplaced Huber Starbreaker launches 94.5mm shells over very long distances. A necessary tool for infantry to knock back armoured Colonial advances.",
			"category": "shippables",
			"categoryOrder": 50,
			"faction": "w",
			"width": 4,
			"length": 4,
			"radius": 2,
			"range": {
				"type": "killboxAT",
				"lineOfSight": true,
				"min": 1.5,
				"max": 45
			},
			"icon": "game/Textures/UI/StructureIcons/EmplacedATLargeWIcon.webp",
			"texture": "game/Textures/Structures/emplacedatlargew.webp",
			"textureOffset": {
				"x": 203,
				"y": 248
			},
			"canSnap": true,
			"canSnapRotate": true,
			"snapGrab": true,
			"emplaced": true,
			"sockets": [
				{
					"id": 0,
					"type": "emplacement",
					"x": 2,
					"y": 2,
					"rotation": 0
				}
			],
			"techId": "unlockemplacedatlarge",
			"maxHealth": 2650,
			"cost": {
				"facilitymaterials2": 135,
				"facilitymaterials4": 10,
				"facilitymaterials7": 15
			},
			"repairCost": 300
		},
		"emplacedatw": {
			"name": "Leary Shellbore 68mm",
			"codeName": "EmplacedATW",
			"description": "A defensive emplacement with a 68mm Anti-tank cannon. This rudimentary weapon was once built to fit onto the hull of large naval vessels, but was eventually phased out and repurposed.",
			"category": "shippables",
			"categoryOrder": 50,
			"faction": "w",
			"width": 4,
			"length": 4,
			"radius": 2,
			"range": {
				"type": "killboxAT",
				"lineOfSight": true,
				"min": 1.5,
				"max": 45
			},
			"icon": "game/Textures/UI/StructureIcons/EmplacedATIcon.webp",
			"texture": "game/Textures/Structures/emplacedatw.webp",
			"textureOffset": {
				"x": 203,
				"y": 203
			},
			"canSnap": true,
			"canSnapRotate": true,
			"snapGrab": true,
			"emplaced": true,
			"sockets": [
				{
					"id": 0,
					"type": "emplacement",
					"x": 2,
					"y": 2,
					"rotation": 0
				}
			],
			"techId": "unlockemplacedatgun",
			"maxHealth": 1500,
			"cost": {
				"cloth": 150
			},
			"repairCost": 100
		},
		"emplacedcannonlargec": {
			"name": "DAE 2a-1 “Ruptura”",
			"codeName": "EmplacedCannonLargeC",
			"description": "Not to be outdone by its counterparts, the 2a-1 “Ruptura” is fitted with a 75mm cannon. Designed to aid in holding ground for longer durations, the “Ruptura” is a strong, efficient anti-armour tool.",
			"category": "shippables",
			"categoryOrder": 50,
			"faction": "c",
			"width": 4,
			"length": 4,
			"radius": 2,
			"range": {
				"type": "killboxAT",
				"lineOfSight": true,
				"min": 1.5,
				"max": 45
			},
			"icon": "game/Textures/UI/StructureIcons/EmplacedCannonLargeC.webp",
			"texture": "game/Textures/Structures/emplacedcannonlargec.webp",
			"textureOffset": {
				"x": 203,
				"y": 252
			},
			"canSnap": true,
			"canSnapRotate": true,
			"snapGrab": true,
			"emplaced": true,
			"sockets": [
				{
					"id": 0,
					"type": "emplacement",
					"x": 2,
					"y": 2,
					"rotation": 0
				}
			],
			"techId": "unlockemplacedcannonlarge",
			"maxHealth": 2650,
			"cost": {
				"facilitymaterials2": 135,
				"facilitymaterials4": 10,
				"facilitymaterials7": 15
			},
			"repairCost": 300
		},
		"emplacedheavyartilleryc": {
			"name": "50-500 “Thunderbolt” Cannon",
			"codeName": "EmplacedHeavyArtilleryC",
			"description": "This heavy artillery cannon is designed to cripple enemy fortifications from an entrenched position. Its long heavy barrel gives the \"Thunderbolt\" outstanding range.",
			"category": "shippables",
			"categoryOrder": 50,
			"faction": "c",
			"width": 4,
			"length": 4,
			"radius": 2,
			"range": {
				"type": "killboxArty",
				"min": 200,
				"max": 350
			},
			"icon": "game/Textures/UI/StructureIcons/HeavyArtilleryCIcon.webp",
			"texture": "game/Textures/Structures/emplacedheavyartilleryc.webp",
			"textureOffset": {
				"x": 203,
				"y": 303
			},
			"canSnap": true,
			"canSnapRotate": true,
			"snapGrab": true,
			"emplaced": true,
			"sockets": [
				{
					"id": 0,
					"type": "emplacement",
					"x": 2,
					"y": 2,
					"rotation": 0
				}
			],
			"techId": "unlockemplacedheavyartillery",
			"maxHealth": 1000,
			"cost": {
				"wood": 195
			},
			"repairCost": 100
		},
		"emplacedheavyartilleryw": {
			"name": "Huber Exalt 150mm",
			"codeName": "EmplacedHeavyArtilleryW",
			"description": "A heavy cannon designed to shatter the garrisons and fortifications of advancing forces. The Exalt is best utilized when emplaced into a defensive position to take advantage of its impressive range.",
			"category": "shippables",
			"categoryOrder": 50,
			"faction": "w",
			"width": 4,
			"length": 4,
			"radius": 2,
			"range": {
				"type": "killboxArty",
				"min": 100,
				"max": 300
			},
			"icon": "game/Textures/UI/StructureIcons/HeavyArtilleryW.webp",
			"texture": "game/Textures/Structures/emplacedheavyartilleryw.webp",
			"textureOffset": {
				"x": 203,
				"y": 220
			},
			"canSnap": true,
			"canSnapRotate": true,
			"snapGrab": true,
			"emplaced": true,
			"sockets": [
				{
					"id": 0,
					"type": "emplacement",
					"x": 2,
					"y": 2,
					"rotation": 0
				}
			],
			"techId": "unlockemplacedheavyartillery",
			"maxHealth": 1250,
			"cost": {
				"wood": 175
			},
			"repairCost": 100
		},
		"emplacedindirectc": {
			"name": "DAE 1o-3 “Polybolos”",
			"codeName": "EmplacedIndirectC",
			"description": "To combat Caoivish ingenuity, the Meseans developed their own indirect RPG propulsion system. Dual launchers are fitted on a large emplacement platform to maximize coverage in an established position, rather than being relegated to a guerrilla warfare tool.",
			"category": "shippables",
			"categoryOrder": 50,
			"faction": "c",
			"width": 4,
			"length": 4,
			"radius": 2,
			"range": {
				"type": "killboxRocket",
				"lineOfSight": true,
				"min": 3.5,
				"max": 45
			},
			"icon": "game/Textures/UI/VehicleIcons/EmplacedIndirectCIcon.webp",
			"texture": "game/Textures/Structures/emplacedindirectc.webp",
			"textureOffset": {
				"x": 203,
				"y": 224
			},
			"canSnap": true,
			"canSnapRotate": true,
			"snapGrab": true,
			"emplaced": true,
			"sockets": [
				{
					"id": 0,
					"type": "emplacement",
					"x": 2,
					"y": 2,
					"rotation": 0
				}
			],
			"techId": "unlockemplacedindirect",
			"maxHealth": 1500,
			"cost": {
				"cloth": 125
			},
			"repairCost": 115
		},
		"emplacedinfantryc": {
			"name": "DAE 1b-2 “Serra”",
			"codeName": "EmplacedInfantryC",
			"description": "Built like a saw blade, the DAE 1b-2 emplacement gun is fitted with three cascading machine gun turrets. What the \"Serra\" lacks in power, it makes up for in sheer rate of fire for a weapon of its size.",
			"category": "shippables",
			"categoryOrder": 50,
			"faction": "c",
			"width": 4,
			"length": 4,
			"radius": 2,
			"range": {
				"type": "killboxMG",
				"lineOfSight": true,
				"min": 1.5,
				"max": 35
			},
			"icon": "game/Textures/UI/VehicleIcons/EmplacedInfantryCIcon.webp",
			"texture": "game/Textures/Structures/emplacedinfantryc.webp",
			"textureOffset": {
				"x": 203,
				"y": 224
			},
			"canSnap": true,
			"canSnapRotate": true,
			"snapGrab": true,
			"emplaced": true,
			"sockets": [
				{
					"id": 0,
					"type": "emplacement",
					"x": 2,
					"y": 2,
					"rotation": 0
				}
			],
			"techId": "unlockfacilitytier2",
			"maxHealth": 1650,
			"cost": {
				"cloth": 100
			},
			"repairCost": 100
		},
		"emplacedinfantryw": {
			"name": "Leary Snare Trap 127",
			"codeName": "EmplacedInfantryW",
			"description": "The Snare Trap is a repurposed anti-aircraft flak cannon used to fortify emplaced positions with twin anti-infantry machine guns.",
			"category": "shippables",
			"categoryOrder": 50,
			"faction": "w",
			"width": 4,
			"length": 4,
			"radius": 2,
			"range": {
				"type": "killboxMG",
				"lineOfSight": true,
				"min": 1.5,
				"max": 35
			},
			"icon": "game/Textures/UI/StructureIcons/EmplacedMGIcon.webp",
			"texture": "game/Textures/Structures/emplacedinfantryw.webp",
			"textureOffset": {
				"x": 203,
				"y": 203
			},
			"canSnap": true,
			"canSnapRotate": true,
			"snapGrab": true,
			"emplaced": true,
			"sockets": [
				{
					"id": 0,
					"type": "emplacement",
					"x": 2,
					"y": 2,
					"rotation": 0
				}
			],
			"techId": "unlockemplacedfieldmg",
			"maxHealth": 1500,
			"cost": {
				"cloth": 75
			},
			"repairCost": 100
		},
		"emplacedlightartilleryw": {
			"name": "Huber Lariat 120mm",
			"codeName": "EmplacedLightArtilleryW",
			"description": "A light artillery cannon designed to be a fixture in defensive fortifications. The Lariat sports a formidable long-range 120mm cannon designed to put immense pressure on enemy infantry.",
			"category": "shippables",
			"categoryOrder": 50,
			"faction": "w",
			"width": 4,
			"length": 4,
			"radius": 2,
			"range": {
				"type": "killboxArty",
				"min": 100,
				"max": 300
			},
			"icon": "game/Textures/UI/StructureIcons/EmplacedHowitzerIcon.webp",
			"texture": "game/Textures/Structures/emplacedlightartilleryw.webp",
			"textureOffset": {
				"x": 203,
				"y": 203
			},
			"canSnap": true,
			"canSnapRotate": true,
			"snapGrab": true,
			"emplaced": true,
			"sockets": [
				{
					"id": 0,
					"type": "emplacement",
					"x": 2,
					"y": 2,
					"rotation": 0
				}
			],
			"techId": "unlockemplacedlightartillery",
			"maxHealth": 750,
			"cost": {
				"wood": 35
			},
			"repairCost": 100
		},
		"emplacedmultic": {
			"name": "DAE 3b-2 “Hades’ Net”",
			"codeName": "EmplacedMultiC",
			"description": "The DAE 3b-2 fires rockets over long distances from a safe, emplaced position. This unique weapon was given its name due to the screams heard across the battlefield during its first deployment, with some referring to the barrage as a “web of death.”",
			"category": "shippables",
			"categoryOrder": 50,
			"faction": "c",
			"width": 4,
			"length": 4,
			"radius": 2,
			"range": {
				"type": "killboxRocket",
				"min": 175,
				"max": 275
			},
			"icon": "game/Textures/UI/StructureIcons/EmplacedMultiCStructureIcon.webp",
			"texture": "game/Textures/Structures/emplacedmultic.webp",
			"textureOffset": {
				"x": 203,
				"y": 224
			},
			"canSnap": true,
			"canSnapRotate": true,
			"snapGrab": true,
			"emplaced": true,
			"sockets": [
				{
					"id": 0,
					"type": "emplacement",
					"x": 2,
					"y": 2,
					"rotation": 0
				}
			],
			"techId": "unlockfacilitytier2",
			"maxHealth": 750,
			"cost": {
				"wood": 35
			},
			"repairCost": 100
		},
		"field_modification_center": {
			"name": "Field Modification Center",
			"codeName": "FacilityModificationCenter",
			"description": "A garage that facilitates vehicle modifications and upgrades.",
			"category": "factories",
			"categoryOrder": 25,
			"color": 8184298,
			"hitArea": [
				{
					"shape": [ -109.7,234.85,-109.7,188.18,109.09,188.18,109.09,234.85 ]
				},
				{
					"shape": [ 109.09,-234.85,109.09,-188.79,-109.7,-188.79,-109.7,-234.85 ]
				},
				{
					"shape": [ -150.91,188.18,-150.91,-188.18,150.91,-188.18,150.91,188.18 ]
				}
			],
			"icon": "game/Textures/UI/StructureIcons/FacilityModificationCenterIcon.webp",
			"texture": "game/Textures/Structures/field_modification_center.webp",
			"power": -8,
			"sockets": [
				{
					"id": 0,
					"name": "power",
					"type": [
						{
							"mask": 131072,
							"category": 1048576
						}
					],
					"x": 0.98,
					"y": 1.34,
					"rotation": 0
				}
			],
			"techId": "unlockfacilitytier2",
			"maxHealth": 2000,
			"cost": {
				"facilitymaterials2": 250
			},
			"repairCost": 100
		},
		"fieldbridge": {
			"name": "Field Bridge",
			"codeName": "FieldBridge",
			"description": "A makeshift bridge for transporting light equipment over a short distance. Will take damage when vehicles drive across.",
			"category": "misc",
			"categoryOrder": 8,
			"hasHandle": true,
			"hasOutline": false,
			"minLength": 4,
			"maxLength": 25,
			"icon": "game/Textures/UI/StructureIcons/FieldBridgeItemIcon.webp",
			"texture": "game/Textures/Structures/fieldbridge.webp",
			"canSnap": true,
			"sockets": [
				{
					"id": 0,
					"type": [
						{
							"mask": 8192,
							"category": 8192
						},
						{
							"mask": 8192,
							"category": 8192
						}
					],
					"texture": "game/Textures/Structures/fieldbridge_end.webp",
					"textureAlt": "game/Textures/Structures/fieldbridge_connector.webp",
					"cap": "front",
					"rotation": 270
				},
				{
					"id": 1,
					"type": [
						{
							"mask": 8192,
							"category": 8192
						},
						{
							"mask": 8192,
							"category": 8192
						}
					],
					"texture": "game/Textures/Structures/fieldbridge_end.webp",
					"textureAlt": "game/Textures/Structures/fieldbridge_connector.webp",
					"cap": "back",
					"rotation": 90
				}
			],
			"techId": "unlockfieldbridge",
			"maxHealth": 1500,
			"cost": {
				"metalbeammaterials": 5
			},
			"repairCost": 100
		},
		"fieldhospital": {
			"name": "Field Hospital",
			"codeName": "FieldHospital",
			"description": "A field medical facility used to treat critically wounded soldiers at the front line. ",
			"category": "misc",
			"categoryOrder": 1,
			"hitArea": [
				{
					"shape": [ 37.27,-136.06,-36.67,-136.06,-33.03,-170,34.24,-170 ]
				},
				{
					"shape": [ -33.03,169.39,-36.67,135.45,37.27,135.45,34.24,169.39 ]
				},
				{
					"shape": [ 100.91,134.85,-36.67,135.45,-99.7,-134.85,100.91,-136.06 ]
				},
				{
					"shape": [ -99.7,-134.85,-36.67,135.45,-99.7,134.85 ]
				}
			],
			"icon": "game/Textures/UI/StructureIcons/FieldHospitalIcon.webp",
			"texture": "game/Textures/Structures/fieldhospital.webp",
			"maxHealth": 500,
			"cost": {
				"cloth": 200
			},
			"repairCost": 200
		},
		"flatbedtruck": {
			"name": "BMS - Packmule Flatbed",
			"codeName": "FlatbedTruck",
			"description": "A heavy duty shipping transport truck designed by Bassett Motor Society. It’s built for hauling the heaviest of equipment over long distances with ease. ",
			"category": "vehicles",
			"categoryOrder": 7,
			"sortLayer": "vehicle",
			"icon": "game/Textures/UI/VehicleIcons/FlatbedTruckVehicleIcon.webp",
			"texture": "game/Textures/Vehicles/flatbedtruck.webp"
		},
		"fortbaset1": {
			"name": "Bunker Base",
			"codeName": "FortBaseT1",
			"parentKey": "fortt1",
			"description": "A large forward operating base. Players can spawn and stockpile items here.",
			"category": "entrenchments",
			"baseGarrisonRadius": 80,
			"sortLayer": "upgrade2",
			"hitArea": [
				{
					"shape": [ 86.06,87.27,-80.61,86.67,-87.27,-83.64,84.24,-86.06 ]
				},
				{
					"shape": [ -79.39,246.67,-80.61,86.67,80,87.27,79.39,246.67 ]
				},
				{
					"shape": [ -87.27,-83.64,-80.61,86.67,-85.45,86.67 ]
				}
			],
			"icon": "game/Textures/UI/StructureIcons/FortT1BaseIcon.webp",
			"texture": "game/Textures/Structures/fortt1_base.webp",
			"textureOffset": {
				"x": 306,
				"y": 312
			},
			"canSnap": true,
			"snapNearest": true,
			"sockets": [
				{
					"id": 0,
					"type": [
						{
							"mask": 2,
							"category": 4
						},
						{
							"mask": 4,
							"category": 4
						}
					],
					"x": 2.5,
					"y": 0,
					"rotation": 0
				},
				{
					"id": 1,
					"type": [
						{
							"mask": 2,
							"category": 4
						},
						{
							"mask": 4,
							"category": 4
						}
					],
					"x": 5,
					"y": 2.5,
					"rotation": 90
				},
				{
					"id": 3,
					"type": [
						{
							"mask": 2,
							"category": 4
						},
						{
							"mask": 4,
							"category": 4
						}
					],
					"x": 0,
					"y": 2.5,
					"rotation": 270
				},
				{
					"id": 4,
					"type": [
						{
							"mask": 2,
							"category": 4
						},
						{
							"mask": 4,
							"category": 4
						}
					],
					"x": 5,
					"y": 7.5,
					"rotation": 90
				},
				{
					"id": 5,
					"type": [
						{
							"mask": 2,
							"category": 4
						},
						{
							"mask": 4,
							"category": 4
						}
					],
					"x": 0,
					"y": 7.5,
					"rotation": 270
				}
			],
			"maxHealth": 1750,
			"structuralIntegrity": 0.65,
			"cost": {
				"cloth": 300
			},
			"repairCost": 300,
			"upgrades": {
				"fortbaset1": {
					"reference": "fortbaset1"
				},
				"fortbaset2": {
					"reference": "fortbaset2"
				},
				"fortbaset3": {
					"reference": "fortbaset3"
				}
			}
		},
		"fortbaset2": {
			"name": "Bunker Base",
			"codeName": "FortBaseT2",
			"parentKey": "fortbaset1",
			"description": "A large forward operating base. Players can spawn and stockpile items here.",
			"tier": 2,
			"hitArea": [
				{
					"shape": [ -89.09,107.27,84.85,106.67,82.42,275.15,-88.48,275.15 ]
				},
				{
					"shape": [ 102.42,-107.27,102.42,106.67,-104.85,106.67,-104.85,-107.88 ]
				},
				{
					"shape": [ -104.85,106.67,84.85,106.67,-89.09,107.27 ]
				}
			],
			"icon": "game/Textures/UI/StructureIcons/FortT2BaseIcon.webp",
			"texture": "game/Textures/Structures/fortt2_base.webp",
			"textureOffset": {
				"x": 384,
				"y": 402
			},
			"sockets": [
				{
					"id": 0,
					"type": [
						{
							"mask": 2,
							"category": 4
						},
						{
							"mask": 4,
							"category": 4
						}
					],
					"x": 2.5,
					"y": 0,
					"rotation": 0
				},
				{
					"id": 1,
					"type": [
						{
							"mask": 2,
							"category": 4
						},
						{
							"mask": 4,
							"category": 4
						}
					],
					"x": 5,
					"y": 2.5,
					"rotation": 90
				},
				{
					"id": 3,
					"type": [
						{
							"mask": 2,
							"category": 4
						},
						{
							"mask": 4,
							"category": 4
						}
					],
					"x": 0,
					"y": 2.5,
					"rotation": 270
				},
				{
					"id": 4,
					"type": [
						{
							"mask": 2,
							"category": 4
						},
						{
							"mask": 4,
							"category": 4
						}
					],
					"x": 5,
					"y": 7.5,
					"rotation": 90
				},
				{
					"id": 5,
					"type": [
						{
							"mask": 2,
							"category": 4
						},
						{
							"mask": 4,
							"category": 4
						}
					],
					"x": 0,
					"y": 7.5,
					"rotation": 270
				}
			],
			"maxHealth": 2000,
			"structuralIntegrity": 0.7,
			"cost": {
				"cloth": 100
			},
			"repairCost": 100,
			"upgrades": {
				"fortbaset1": {
					"reference": "fortbaset1"
				},
				"fortbaset2": {
					"reference": "fortbaset2"
				},
				"fortbaset3": {
					"reference": "fortbaset3"
				}
			}
		},
		"fortbaset3": {
			"name": "Bunker Base",
			"codeName": "FortBaseT3",
			"parentKey": "fortbaset2",
			"description": "A large forward operating base. Players can spawn and stockpile items here.",
			"tier": 3,
			"hitArea": [
				{
					"shape": [ -83.64,105.45,83.03,105.45,79.39,270.3,-80.61,270.3 ]
				},
				{
					"shape": [ 83.03,105.45,-83.64,105.45,-106.67,90.3,-106.67,-93.94,-93.33,-107.27,105.45,-93.33,106.06,86.67,98.18,99.39 ]
				},
				{
					"shape": [ -106.67,90.3,-83.64,105.45,-96.36,102.42 ]
				},
				{
					"shape": [ 105.45,-93.33,-93.33,-107.27,92.73,-107.27 ]
				}
			],
			"icon": "game/Textures/UI/StructureIcons/FortT3BaseIcon.webp",
			"texture": "game/Textures/Structures/fortt3_base.webp",
			"textureOffset": {
				"x": 382,
				"y": 382
			},
			"sockets": [
				{
					"id": 0,
					"type": [
						{
							"mask": 2,
							"category": 4
						},
						{
							"mask": 4,
							"category": 4
						}
					],
					"x": 2.5,
					"y": 0,
					"rotation": 0
				},
				{
					"id": 1,
					"type": [
						{
							"mask": 2,
							"category": 4
						},
						{
							"mask": 4,
							"category": 4
						}
					],
					"x": 5,
					"y": 2.5,
					"rotation": 90
				},
				{
					"id": 3,
					"type": [
						{
							"mask": 2,
							"category": 4
						},
						{
							"mask": 4,
							"category": 4
						}
					],
					"x": 0,
					"y": 2.5,
					"rotation": 270
				},
				{
					"id": 4,
					"type": [
						{
							"mask": 2,
							"category": 4
						},
						{
							"mask": 4,
							"category": 4
						}
					],
					"x": 5,
					"y": 7.5,
					"rotation": 90
				},
				{
					"id": 5,
					"type": [
						{
							"mask": 2,
							"category": 4
						},
						{
							"mask": 4,
							"category": 4
						}
					],
					"x": 0,
					"y": 7.5,
					"rotation": 270
				}
			],
			"maxHealth": 3500,
			"structuralIntegrity": 0.75,
			"cost": {
				"concrete": 25
			},
			"repairCost": 200,
			"upgrades": {
				"fortbaset1": {
					"reference": "fortbaset1"
				},
				"fortbaset2": {
					"reference": "fortbaset2"
				},
				"fortbaset3": {
					"reference": "fortbaset3"
				}
			}
		},
		"fortcornert1": {
			"name": "Bunker Corner (Tier 1)",
			"codeName": "FortCornerT1",
			"parentKey": "fortt1",
			"description": "An underground shelter that serves as a foundation for permanent fortifications. Connects to other Bunkers and Trenches.",
			"category": "entrenchments",
			"categoryOrder": 4,
			"hitArea": [
				{
					"shape": [ 84.85,-80.61,84.85,-28.48,-29.7,87.88,-79.39,88.48,-80.61,-80 ]
				}
			],
			"icon": "game/Textures/UI/StructureIcons/FortT1CornerIcon.webp",
			"texture": "game/Textures/Structures/fortt1_corner.webp",
			"textureOffset": null,
			"sockets": [
				{
					"id": 0,
					"type": [
						{
							"mask": 2,
							"category": 4
						},
						{
							"mask": 4,
							"category": 4
						}
					],
					"texture": "game/Textures/Structures/fortt1_border.webp",
					"below": true,
					"x": 2.5,
					"y": 0,
					"rotation": 0
				},
				{
					"id": 6,
					"type": [
						{
							"mask": 2,
							"category": 4
						},
						{
							"mask": 4,
							"category": 4
						}
					],
					"texture": "game/Textures/Structures/fortt1_border.webp",
					"x": 3.39,
					"y": 3.39,
					"rotation": 135
				},
				{
					"id": 3,
					"type": [
						{
							"mask": 2,
							"category": 4
						},
						{
							"mask": 4,
							"category": 4
						}
					],
					"texture": "game/Textures/Structures/fortt1_border.webp",
					"below": true,
					"x": 0,
					"y": 2.5,
					"rotation": 270
				}
			],
			"maxHealth": 1500,
			"structuralIntegrity": 0.85,
			"repairCost": 75,
			"hasPipes": false,
			"currentGearPower" : 0,
			"upgrades": {
				"fortcornert1": {
					"reference": "fortcornert1"
				},
				"fortcornert2": {
					"reference": "fortcornert2"
				},
				"fortcornert3": {
					"reference": "fortcornert3"
				}
			}
		},
		"fortcornert2": {
			"name": "Bunker Corner (Tier 2)",
			"codeName": "FortCornerT2",
			"parentKey": "fortt1",
			"description": "An underground shelter that serves as a foundation for permanent fortifications. Connects to other Bunkers and Trenches.",
			"category": "entrenchments",
			"categoryOrder": 4,
			"tier": 2,
			"hitArea": [
				{
					"shape": [ 83.03,-84.24,83.03,-23.03,-27.88,86.67,-81.82,86.67,-81.82,-84.85 ]
				}
			],
			"icon": "game/Textures/UI/StructureIcons/FortT2CornerIcon.webp",
			"texture": "game/Textures/Structures/fortt2_corner.webp",
			"textureOffset": null,
			"sockets": [
				{
					"id": 0,
					"type": [
						{
							"mask": 2,
							"category": 4
						},
						{
							"mask": 4,
							"category": 4
						}
					],
					"texture": "game/Textures/Structures/fortt2_border.webp",
					"below": true,
					"x": 2.5,
					"y": 0,
					"rotation": 0
				},
				{
					"id": 6,
					"type": [
						{
							"mask": 2,
							"category": 4
						},
						{
							"mask": 4,
							"category": 4
						}
					],
					"texture": "game/Textures/Structures/fortt2_border.webp",
					"x": 3.39,
					"y": 3.39,
					"rotation": 135
				},
				{
					"id": 3,
					"type": [
						{
							"mask": 2,
							"category": 4
						},
						{
							"mask": 4,
							"category": 4
						}
					],
					"texture": "game/Textures/Structures/fortt2_border.webp",
					"below": true,
					"x": 0,
					"y": 2.5,
					"rotation": 270
				}
			],
			"maxHealth": 1850,
			"structuralIntegrity": 0.95,
			"cost": {
				"cloth": 75
			},
			"repairCost": 75,
			"hasPipes": false,
			"currentGearPower" : 0,
			"upgrades": {
				"fortcornert1": {
					"reference": "fortcornert1"
				},
				"fortcornert2": {
					"reference": "fortcornert2"
				},
				"fortcornert3": {
					"reference": "fortcornert3"
				}
			}
		},
		"fortcornert3": {
			"name": "Bunker Corner (Tier 3)",
			"codeName": "FortCornerT3",
			"parentKey": "fortt2",
			"description": "An underground shelter that serves as a foundation for permanent fortifications. Connects to other Bunkers and Trenches.",
			"categoryOrder": 5,
			"tier": 3,
			"hitArea": [
				{
					"shape": [ 97.58,-85.45,96.97,-31.52,-30.91,97.58,-86.06,97.58,-86.06,-85.45 ]
				}
			],
			"icon": "game/Textures/UI/StructureIcons/FortT3CornerIcon.webp",
			"texture": "game/Textures/Structures/fortt3_corner.webp",
			"textureOffset": null,
			"sockets": [
				{
					"id": 0,
					"type": [
						{
							"mask": 2,
							"category": 4
						},
						{
							"mask": 4,
							"category": 4
						}
					],
					"texture": "game/Textures/Structures/fortt3_border.webp",
					"below": true,
					"x": 2.5,
					"y": 0,
					"rotation": 0
				},
				{
					"id": 6,
					"type": [
						{
							"mask": 2,
							"category": 4
						},
						{
							"mask": 4,
							"category": 4
						}
					],
					"texture": "game/Textures/Structures/fortt3_border.webp",
					"x": 3.39,
					"y": 3.39,
					"rotation": 135
				},
				{
					"id": 3,
					"type": [
						{
							"mask": 2,
							"category": 4
						},
						{
							"mask": 4,
							"category": 4
						}
					],
					"texture": "game/Textures/Structures/fortt3_border.webp",
					"below": true,
					"x": 0,
					"y": 2.5,
					"rotation": 270
				}
			],
			"maxHealth": 2000,
			"structuralIntegrity": 0.99,
			"cost": {
				"concrete": 15
			},
			"repairCost": 120,
			"hasPipes": false,
			"currentGearPower" : 0,
			"upgrades": {
				"fortcornert1": {
					"reference": "fortcornert1"
				},
				"fortcornert2": {
					"reference": "fortcornert2"
				},
				"fortcornert3": {
					"reference": "fortcornert3"
				}
			}
		},
		"fortt1": {
			"name": "Bunker (Tier 1)",
			"codeName": "FortT1",
			"description": "An underground shelter that serves as a foundation for permanent fortifications. Connects to other Bunkers and Trenches.",
			"category": "entrenchments",
			"categoryOrder": 3,
			"tier": 1,
			"width": 5,
			"length": 5,
			"icon": "game/Textures/UI/StructureIcons/FortT1Icon.webp",
			"texture": "game/Textures/Structures/fortt1.webp",
			"canSnap": true,
			"canUnion": true,
			"snapNearest": true,
			"sockets": [
				{
					"id": 0,
					"type": [
						{
							"mask": 2,
							"category": 4
						},
						{
							"mask": 4,
							"category": 4
						}
					],
					"texture": "game/Textures/Structures/fortt1_border.webp",
					"below": true,
					"x": 2.5,
					"y": 0,
					"rotation": 0
				},
				{
					"id": 1,
					"type": [
						{
							"mask": 2,
							"category": 4
						},
						{
							"mask": 4,
							"category": 4
						}
					],
					"texture": "game/Textures/Structures/fortt1_border.webp",
					"below": true,
					"x": 5,
					"y": 2.5,
					"rotation": 90
				},
				{
					"id": 2,
					"type": [
						{
							"mask": 2,
							"category": 4
						},
						{
							"mask": 4,
							"category": 4
						}
					],
					"texture": "game/Textures/Structures/fortt1_border.webp",
					"below": true,
					"x": 2.5,
					"y": 5,
					"rotation": 180
				},
				{
					"id": 3,
					"type": [
						{
							"mask": 2,
							"category": 4
						},
						{
							"mask": 4,
							"category": 4
						}
					],
					"texture": "game/Textures/Structures/fortt1_border.webp",
					"below": true,
					"x": 0,
					"y": 2.5,
					"rotation": 270
				}
			],
			"maxHealth": 1500,
			"structuralIntegrity": 0.85,
			"repairCost": 75,
			"hasPipes": false,
			"currentGearPower" : 0,
			"upgrades": {
				"fortt2": {
					"reference": "fortt2"
				},
				"fortbaset1": {
					"reference": "fortbaset1"
				},
				"fortcornert2": {
					"reference": "fortcornert2"
				},
				"mgait1": {
					"name": "Machine Gun Garrison (Tier 1)",
					"codeName": "MGAIT1",
					"category" : "gearPower",
					"gearPowerCost" : 600,
					"description": "An entrenched machine gun manned by stationed troops.",
					"range": {
						"type": "killboxMG",
						"lineOfSight": true,
						"arc": 45,
						"max": 33.5
					},
					"sortLayer": "upgrade",
					"icon": "game/Textures/UI/StructureIcons/FortT1MGunAIIcon.webp",
					"texture": "game/Textures/Structures/fortt1_mgai.webp",
					"textureOffset": {
						"x": 323,
						"y": 312
					},
					"maxHealth": 1650,
					"structuralIntegrity": 0.65,
					"cost": {
						"cloth": 75
					},
					"repairCost": 75,
					"hasPipes": false,
					"currentGearPower" : 0
				},
				"fortrampt1": {
					"name": "Bunker Ramp (Tier 1)",
					"codeName": "FortRampT1",
					"description": "A ramp that enables access to underground Bunkers.",
					"icon": "game/Textures/UI/StructureIcons/FortT1RampIcon.webp",
					"texture": "game/Textures/Structures/fortt1_ramp.webp",
					"textureOffset": {
						"x": 300,
						"y": 324
					},
					"sockets": [
						{
							"id": 0,
							"type": [
								{
									"mask": 2,
									"category": 4
								},
								{
									"mask": 4,
									"category": 4
								}
							],
							"x": 2.5,
							"y": 0,
							"rotation": 0
						},
						{
							"id": 1,
							"type": [
								{
									"mask": 2,
									"category": 4
								},
								{
									"mask": 4,
									"category": 4
								}
							],
							"x": 5,
							"y": 2.5,
							"rotation": 90
						},
						{
							"id": 2,
							"type": [
								{
									"mask": 2,
									"category": 4
								},
								{
									"mask": 4,
									"category": 4
								}
							],
							"x": 2.5,
							"y": 5,
							"rotation": 180
						},
						{
							"id": 3,
							"type": [
								{
									"mask": 2,
									"category": 4
								},
								{
									"mask": 4,
									"category": 4
								}
							],
							"x": 0,
							"y": 2.5,
							"rotation": 270
						}
					],
					"maxHealth": 1500,
					"structuralIntegrity": 0.85,
					"cost": {
						"cloth": 50
					},
					"repairCost": 75,
					"hasPipes": false,
					"currentGearPower" : 0
				},
				"rifleait1": {
					"name": "Rifle Garrison (Tier 1)",
					"codeName": "RifleAIT1",
					"category" : "gearPower",
					"gearPowerCost" : 600,
					"description": "An entrenched bunker manned by stationed troops armed with Rifles.",
					"range": {
						"type": "killbox",
						"lineOfSight": true,
						"max": 29
					},
					"sortLayer": "upgrade",
					"icon": "game/Textures/UI/StructureIcons/FortT1GunAIIcon.webp",
					"texture": "game/Textures/Structures/fortt1_rifleai.webp",
					"textureOffset": {
						"x": 342,
						"y": 328
					},
					"maxHealth": 1500,
					"structuralIntegrity": 0.65,
					"cost": {
						"cloth": 50
					},
					"repairCost": 50,
					"hasPipes": false,
					"currentGearPower" : 0
				}
			}
		},
		"fortt2": {
			"name": "Bunker (Tier 2)",
			"codeName": "FortT2",
			"parentKey": "fortt1",
			"description": "An underground shelter that serves as a foundation for permanent fortifications. Connects to other Bunkers and Trenches.",
			"tier": 2,
			"icon": "game/Textures/UI/StructureIcons/FortT2Icon.webp",
			"texture": "game/Textures/Structures/fortt2.webp",
			"sockets": [
				{
					"id": 0,
					"type": [
						{
							"mask": 2,
							"category": 4
						},
						{
							"mask": 4,
							"category": 4
						}
					],
					"texture": "game/Textures/Structures/fortt2_border.webp",
					"below": true,
					"x": 2.5,
					"y": 0,
					"rotation": 0
				},
				{
					"id": 1,
					"type": [
						{
							"mask": 2,
							"category": 4
						},
						{
							"mask": 4,
							"category": 4
						}
					],
					"texture": "game/Textures/Structures/fortt2_border.webp",
					"below": true,
					"x": 5,
					"y": 2.5,
					"rotation": 90
				},
				{
					"id": 2,
					"type": [
						{
							"mask": 2,
							"category": 4
						},
						{
							"mask": 4,
							"category": 4
						}
					],
					"texture": "game/Textures/Structures/fortt2_border.webp",
					"below": true,
					"x": 2.5,
					"y": 5,
					"rotation": 180
				},
				{
					"id": 3,
					"type": [
						{
							"mask": 2,
							"category": 4
						},
						{
							"mask": 4,
							"category": 4
						}
					],
					"texture": "game/Textures/Structures/fortt2_border.webp",
					"below": true,
					"x": 0,
					"y": 2.5,
					"rotation": 270
				}
			],
			"maxHealth": 1850,
			"structuralIntegrity": 0.95,
			"cost": {
				"cloth": 75
			},
			"repairCost": 75,
			"hasPipes": false,
			"currentGearPower" : 0,
			"upgrades": {
				"fortt3": {
					"reference": "fortt3"
				},
				"atgunait2": {
					"name": "AT Gun Garrison (Tier 2)",
					"codeName": "ATGunAIT2",
					"category" : "gearPower",
					"gearPowerCost" : 600,
					"description": "An entrenched AT gun manned by stationed troops.",
					"range": {
						"type": "killboxAT",
						"lineOfSight": true,
						"arc": 90,
						"max": 30
					},
					"sortLayer": "upgrade",
					"hitArea": [
						{
							"shape": [ 75.76,-74.55,75.76,33.94,32.12,67.27,-32.12,67.27,-75.15,34.55,-75.15,-74.55 ]
						}
					],
					"icon": "game/Textures/UI/StructureIcons/FortT2ATGunAIIcon.webp",
					"texture": "game/Textures/Structures/fortt2_atgunai.webp",
					"maxHealth": 1650,
					"structuralIntegrity": 0.82,
					"cost": {
						"cloth": 150
					},
					"repairCost": 150,
					"hasPipes": false,
					"currentGearPower" : 0
				},
				"fortcornert3": {
					"reference": "fortcornert3"
				},
				"engineroomt2": {
					"name": "Engine Room (Tier 2)",
					"codeName": "EngineRoomT2",
					"category" : "gearPower",
					"gearPowerCost" : -3000,
					"description": "A engineering facility that provides power to Bunker structures using pipe connections.",
					"icon": "game/Textures/UI/StructureIcons/EngineRoomIcon.webp",
					"texture": "game/Textures/Structures/fortt2_engineroom.webp",
					"maxHealth": 1350,
					"structuralIntegrity": 0.75,
					"cost": {
						"cloth": 150
					},
					"repairCost": 120,
					"hasPipes": false,
					"currentGearPower" : 0
				},
				"mgait2": {
					"name": "Machine Gun Garrison (Tier 2)",
					"codeName": "MGAIT2",
					"category": "gearPower",
					"gearPowerCost" : 600,
					"description": "An entrenched machine gun manned by stationed troops.",
					"range": {
						"type": "killboxMG",
						"lineOfSight": true,
						"arc": 45,
						"max": 33.5
					},
					"sortLayer": "upgrade",
					"icon": "game/Textures/UI/StructureIcons/FortT2MGunAIIcon.webp",
					"texture": "game/Textures/Structures/fortt2_mgai.webp",
					"maxHealth": 2150,
					"structuralIntegrity": 0.85,
					"cost": {
						"cloth": 100
					},
					"repairCost": 100,
					"hasPipes": false,
					"currentGearPower" : 0
				},
				"observationbunkert2": {
					"name": "Observation Bunker (Tier 2)",
					"codeName": "ObservationBunkerT2",
					"category" : "gearPower",
					"gearPowerCost" : 1000,
					"description": "A radio bunker that provides intel to friendly units about the surrounding area. Reinforced with wood, it can withstand more punishment than a standard radio tower, and therefore is capable of increased effectiveness.",
					"range": {
						"type": "radio",
						"max": 130
					},
					"sortLayer": "upgrade",
					"hitArea": [
						{
							"shape": [ -30.3,-70.3,32.12,-69.7,70.3,-31.52,70.3,31.52,32.12,69.7,-30.91,70.3,-69.09,31.52,-69.7,-30.91 ]
						}
					],
					"icon": "game/Textures/UI/StructureIcons/ObservationBunkerT2ItemIcon.webp",
					"texture": "game/Textures/Structures/fortt2_observationbunker.webp",
					"maxHealth": 1650,
					"structuralIntegrity": 0.82,
					"cost": {
						"cloth": 125
					},
					"repairCost": 150,
					"hasPipes": false,
					"currentGearPower" : 0
				},
				"fortrampt2": {
					"name": "Bunker Ramp (Tier 2)",
					"codeName": "FortRampT2",
					"description": "A ramp that enables access to underground Bunkers.",
					"icon": "game/Textures/UI/StructureIcons/FortT2RampIcon.webp",
					"texture": "game/Textures/Structures/fortt2_ramp.webp",
					"textureOffset": {
						"x": 328,
						"y": 318
					},
					"sockets": [
						{
							"id": 0,
							"type": [
								{
									"mask": 2,
									"category": 4
								},
								{
									"mask": 4,
									"category": 4
								}
							],
							"x": 2.5,
							"y": 0,
							"rotation": 0
						},
						{
							"id": 1,
							"type": [
								{
									"mask": 2,
									"category": 4
								},
								{
									"mask": 4,
									"category": 4
								}
							],
							"x": 5,
							"y": 2.5,
							"rotation": 90
						},
						{
							"id": 2,
							"type": [
								{
									"mask": 2,
									"category": 4
								},
								{
									"mask": 4,
									"category": 4
								}
							],
							"x": 2.5,
							"y": 5,
							"rotation": 180
						},
						{
							"id": 3,
							"type": [
								{
									"mask": 2,
									"category": 4
								},
								{
									"mask": 4,
									"category": 4
								}
							],
							"x": 0,
							"y": 2.5,
							"rotation": 270
						}
					],
					"maxHealth": 1850,
					"structuralIntegrity": 0.95,
					"cost": {
						"cloth": 50
					},
					"repairCost": 75,
					"hasPipes": false,
					"currentGearPower" : 0
				},
				"rifleait2": {
					"name": "Rifle Garrison (Tier 2)",
					"codeName": "RifleAIT2",
					"category" : "gearPower",
					"gearPowerCost" : 600,
					"description": "An entrenched bunker manned by stationed troops armed with Rifles.",
					"range": {
						"type": "killbox",
						"lineOfSight": true,
						"max": 29
					},
					"sortLayer": "upgrade",
					"icon": "game/Textures/UI/StructureIcons/FortT2GunAIIcon.webp",
					"texture": "game/Textures/Structures/fortt2_rifleai.webp",
					"maxHealth": 1850,
					"structuralIntegrity": 0.85,
					"cost": {
						"cloth": 75
					},
					"repairCost": 75,
					"hasPipes": false,
					"currentGearPower" : 0
				},
				"ammoroomt2": {
					"name": "Storage Room (Tier 2)",
					"codeName": "AmmoRoomT2",
					"description": "A facility that stores equipment and ammunition for artillery. Retrieval is very quick for this structure.",
					"icon": "game/Textures/UI/StructureIcons/AmmoRoomIcon.webp",
					"texture": "game/Textures/Structures/fortt2_ammoroom.webp",
					"maxHealth": 1850,
					"structuralIntegrity": 0.85,
					"cost": {
						"cloth": 35
					},
					"repairCost": 120,
					"hasPipes": false,
					"currentGearPower" : 0
				}
			}
		},
		"fortt3": {
			"name": "Bunker (Tier 3)",
			"codeName": "FortT3",
			"parentKey": "fortt2",
			"description": "An underground shelter that serves as a foundation for permanent fortifications. Connects to other Bunkers and Trenches.",
			"tier": 3,
			"icon": "game/Textures/UI/StructureIcons/FortT3Icon.webp",
			"texture": "game/Textures/Structures/fortt3.webp",
			"sockets": [
				{
					"id": 0,
					"type": [
						{
							"mask": 2,
							"category": 4
						},
						{
							"mask": 4,
							"category": 4
						}
					],
					"texture": "game/Textures/Structures/fortt3_border.webp",
					"below": true,
					"x": 2.5,
					"y": 0,
					"rotation": 0
				},
				{
					"id": 1,
					"type": [
						{
							"mask": 2,
							"category": 4
						},
						{
							"mask": 4,
							"category": 4
						}
					],
					"texture": "game/Textures/Structures/fortt3_border.webp",
					"below": true,
					"x": 5,
					"y": 2.5,
					"rotation": 90
				},
				{
					"id": 2,
					"type": [
						{
							"mask": 2,
							"category": 4
						},
						{
							"mask": 4,
							"category": 4
						}
					],
					"texture": "game/Textures/Structures/fortt3_border.webp",
					"below": true,
					"x": 2.5,
					"y": 5,
					"rotation": 180
				},
				{
					"id": 3,
					"type": [
						{
							"mask": 2,
							"category": 4
						},
						{
							"mask": 4,
							"category": 4
						}
					],
					"texture": "game/Textures/Structures/fortt3_border.webp",
					"below": true,
					"x": 0,
					"y": 2.5,
					"rotation": 270
				}
			],
			"maxHealth": 2000,
			"structuralIntegrity": 0.99,
			"cost": {
				"concrete": 15
			},
			"repairCost": 120,
			"hasPipes": false,
			"currentGearPower" : 0,
			"upgrades": {
				"intelcenter": {
					"name": "Intelligence Center",
					"codeName": "IntelCenter",
					"category" : "gearPower",
					"gearPowerCost" : 35000,
					"description": "A high-tech listening post designed to intercept and decode enemy transmissions. The Intelligence Center can target distant locations and will continue to decipher sensitive transmissions over a sustained period.",
					"sortLayer": "upgrade",
					"icon": "game/Textures/UI/StructureIcons/IntelligenceCenterIcon.webp",
					"texture": "game/Textures/Structures/fortt3_intelcenter.webp",
					"textureOffset": null,
					"maxHealth": 2550,
					"structuralIntegrity": 0.65,
					"cost": {
						"concrete": 125
					},
					"repairCost": 1200,
					"hasPipes": false,
					"currentGearPower" : 0,
				},
				"lrartillery": {
					"name": "Storm Cannon",
					"codeName": "LRArtillery",
					"category" : "gearPower",
					"gearPowerCost" : 35000,
					"description": "A heavy fixed position artillery piece that can release devastating firepower on distant enemy targets.",
					"sortLayer": "upgrade",
					"icon": "game/Textures/UI/StructureIcons/LongRangedArtilleryIcon.webp",
					"texture": "game/Textures/Structures/fortt3_lrartillery.webp",
					"textureOffset": {
						"x": 770,
						"y": 792
					},
					"maxHealth": 2550,
					"structuralIntegrity": 0.65,
					"cost": {
						"concrete": 200
					},
					"repairCost": 500,
					"hasPipes": false,
					"currentGearPower" : 0,
				},
				"ammoroomt3": {
					"name": "Storage Room (Tier 3)",
					"codeName": "AmmoRoomT3",
					"prevUpgradeKey": "fortt2_ammoroomt2",
					"description": "A facility that stores equipment and ammunition for artillery. Retrieval is very quick for this structure.",
					"icon": "game/Textures/UI/StructureIcons/AmmoRoomIcon.webp",
					"texture": "game/Textures/Structures/fortt3_ammoroom.webp",
					"maxHealth": 2000,
					"structuralIntegrity": 0.95,
					"cost": {
						"concrete": 10
					},
					"repairCost": 160,
					"hasPipes": false,
					"currentGearPower" : 0
				},
				"artilleryait3": {
					"name": "Howitzer Garrison",
					"codeName": "ArtilleryAIT3",
					"description": "An entrenched Howitzer manned by stationed troops.",
					"range": {
						"type": "killboxArty",
						"min": 25,
						"max": 600,
						"arc": 60
					},
					"sortLayer": "upgrade",
					"hitArea": [
						{
							"shape": [ -29.83,70.67,29.7,70.3,29.2,77.52,25.45,85.45,-23.64,85.45,-29.83,78.31 ]
						},
						{
							"shape": [ 45.27,69.88,-29.83,70.67,-80.16,-72.94,-69.7,-81.21,73.73,-80.84,82.42,-72.73,81.21,38.18 ]
						},
						{
							"shape": [ -80.16,-72.94,-29.83,70.67,-46.67,69.7,-80,44.85 ]
						}
					],
					"icon": "game/Textures/UI/StructureIcons/FortT3HowitzerAIIcon.webp",
					"texture": "game/Textures/Structures/fortt3_artilleryai.webp",
					"textureOffset": {
						"x": 288,
						"y": 288
					},
					"maxHealth": 1750,
					"structuralIntegrity": 0.93,
					"cost": {
						"concrete": 20
					},
					"repairCost": 160,
					"hasPipes": false,
					"currentGearPower" : 0
				},
				"atgunait3": {
					"name": "AT Gun Garrison (Tier 3)",
					"codeName": "ATGunAIT3",
					"category" : "gearPower",
					"gearPowerCost" : 600,
					"prevUpgradeKey": "fortt2_atgunait2",
					"description": "An entrenched AT gun manned by stationed troops.",
					"range": {
						"type": "killboxAT",
						"lineOfSight": true,
						"arc": 90,
						"max": 30
					},
					"sortLayer": "upgrade",
					"hitArea": [
						{
							"shape": [ 87.27,-87.27,87.88,33.33,44.85,89.7,-22.42,98.79,-44.85,90.3,-63.64,76.97,-87.88,35.15,-87.27,-87.27 ]
						},
						{
							"shape": [ 44.85,89.7,87.88,33.33,78.18,56.97,64.24,75.76 ]
						},
						{
							"shape": [ -87.88,35.15,-63.64,76.97,-78.79,58.18 ]
						},
						{
							"shape": [ -22.42,98.79,44.85,89.7,24.24,98.79,0,102.42 ]
						}
					],
					"icon": "game/Textures/UI/StructureIcons/FortT3ATGunAIIcon.webp",
					"texture": "game/Textures/Structures/fortt3_atgunai.webp",
					"textureOffset": {
						"x": 288,
						"y": 288
					},
					"maxHealth": 1750,
					"structuralIntegrity": 0.93,
					"cost": {
						"concrete": 20
					},
					"repairCost": 160,
					"hasPipes": false,
					"currentGearPower" : 0
				},
				"engineroomt3": {
					"name": "Engine Room (Tier 3)",
					"codeName": "EngineRoomT3",
					"category" : "gearPower",
					"gearPowerCost" : -3000,
					"prevUpgradeKey": "fortt2_engineroomt2",
					"description": "A engineering facility that provides power to Bunker structures using pipe connections.",
					"icon": "game/Textures/UI/StructureIcons/EngineRoomIcon.webp",
					"texture": "game/Textures/Structures/fortt3_engineroom.webp",
					"maxHealth": 1500,
					"structuralIntegrity": 0.85,
					"cost": {
						"concrete": 25
					},
					"repairCost": 120,
					"hasPipes": false,
					"currentGearPower" : 0
				},
				"mgait3": {
					"name": "Machine Gun Garrison (Tier 3)",
					"codeName": "MGAIT3",
					"category" : "gearPower",
					"gearPowerCost" : 600,
					"prevUpgradeKey": "fortt2_mgait2",
					"description": "An entrenched machine gun manned by stationed troops.",
					"range": {
						"type": "killboxMG",
						"lineOfSight": true,
						"arc": 45,
						"max": 33.5
					},
					"sortLayer": "upgrade",
					"icon": "game/Textures/UI/StructureIcons/FortT3MGunAIIcon.webp",
					"texture": "game/Textures/Structures/fortt3_mgai.webp",
					"textureOffset": null,
					"maxHealth": 3000,
					"structuralIntegrity": 0.96,
					"cost": {
						"concrete": 15
					},
					"repairCost": 120,
					"hasPipes": false,
					"currentGearPower" : 0
				},
				"observationbunkert3": {
					"name": "Observation Bunker (Tier 3)",
					"codeName": "ObservationBunkerT3",
					"category" : "gearPower",
					"gearPowerCost" : 1000,
					"prevUpgradeKey": "fortt2_observationbunkert2",
					"description": "A radio bunker that provides intel to friendly units about the surrounding area. Built from solid concrete, this reliable structure can push its effective range beyond lesser fortified radio structures.",
					"range": {
						"type": "radio",
						"max": 180
					},
					"sortLayer": "upgrade",
					"hitArea": [
						{
							"shape": [ -72.12,-28.48,-29.7,-72.12,29.7,-72.12,72.73,29.7,30.91,72.12,-29.83,71.46,-72.12,30.91 ]
						},
						{
							"shape": [ 72.73,29.7,29.7,-72.12,72.41,-29.99 ]
						}
					],
					"icon": "game/Textures/UI/StructureIcons/ObservationBunkerT3ItemIcon.webp",
					"texture": "game/Textures/Structures/fortt3_observationbunker.webp",
					"maxHealth": 1750,
					"structuralIntegrity": 0.93,
					"cost": {
						"concrete": 10
					},
					"repairCost": 160,
					"hasPipes": false,
					"currentGearPower" : 0
				},
				"fortrampt3": {
					"name": "Bunker Ramp (Tier 3)",
					"codeName": "FortRampT3",
					"prevUpgradeKey": "fortt2_fortrampt2",
					"description": "A ramp that enables access to underground Bunkers.",
					"icon": "game/Textures/UI/StructureIcons/FortT3RampIcon.webp",
					"texture": "game/Textures/Structures/fortt3_ramp.webp",
					"textureOffset": {
						"x": 315,
						"y": 287
					},
					"sockets": [
						{
							"id": 0,
							"type": [
								{
									"mask": 2,
									"category": 4
								},
								{
									"mask": 4,
									"category": 4
								}
							],
							"x": 2.5,
							"y": 0,
							"rotation": 0
						},
						{
							"id": 1,
							"type": [
								{
									"mask": 2,
									"category": 4
								},
								{
									"mask": 4,
									"category": 4
								}
							],
							"x": 5,
							"y": 2.5,
							"rotation": 90
						},
						{
							"id": 2,
							"type": [
								{
									"mask": 2,
									"category": 4
								},
								{
									"mask": 4,
									"category": 4
								}
							],
							"x": 2.5,
							"y": 5,
							"rotation": 180
						},
						{
							"id": 3,
							"type": [
								{
									"mask": 2,
									"category": 4
								},
								{
									"mask": 4,
									"category": 4
								}
							],
							"x": 0,
							"y": 2.5,
							"rotation": 270
						}
					],
					"maxHealth": 2000,
					"structuralIntegrity": 0.99,
					"cost": {
						"concrete": 10
					},
					"repairCost": 120,
					"hasPipes": false,
					"currentGearPower" : 0
				},
				"rifleait3": {
					"name": "Rifle Garrison (Tier 3)",
					"codeName": "RifleAIT3",
					"category" : "gearPower",
					"gearPowerCost" : 600,
					"prevUpgradeKey": "fortt2_rifleait2",
					"description": "An entrenched bunker manned by stationed troops armed with Rifles.",
					"range": {
						"type": "killbox",
						"lineOfSight": true,
						"max": 29
					},
					"sortLayer": "upgrade",
					"icon": "game/Textures/UI/StructureIcons/FortT3GunAIIcon.webp",
					"texture": "game/Textures/Structures/fortt3_rifleai.webp",
					"textureOffset": null,
					"maxHealth": 2250,
					"structuralIntegrity": 0.96,
					"cost": {
						"concrete": 15
					},
					"repairCost": 120,
					"hasPipes": false,
					"currentGearPower" : 0
				}
			}
		},
		"forwardbase1": {
			"name": "Encampment",
			"codeName": "ForwardBase1",
			"description": "A temporary forward operating base. Players can spawn and stockpile items here.",
			"category": "misc",
			"baseGarrisonRadius": 80,
			"icon": "game/Textures/UI/StructureIcons/EncampmentIcon.webp",
			"texture": "game/Textures/Structures/forwardbase1.webp",
			"maxHealth": 1725,
			"cost": {
				"cloth": 300
			},
			"repairCost": 300
		},
		"foundation_1x1": {
			"name": "Foundation (1x1)",
			"codeName": "Foundation01T1",
			"description": "A foundation that provides a suitable surface for constructing Facilities.",
			"category": "foundations",
			"categoryOrder": 2,
			"sortLayer": "foundation",
			"icon": "game/Textures/UI/StructureIcons/ConcreteFoundation01Icon.webp",
			"texture": "game/Textures/Structures/foundation_1x1.webp",
			"textureBorder": "game/Textures/Structures/foundation_border.webp",
			"garrisonSupplyMultiplier": 2,
			"canSnap": true,
			"snapNearest": true,
			"sockets": [
				{
					"id": 0,
					"type": [
						{
							"mask": 65536,
							"category": 65536
						}
					],
					"x": 0,
					"y": 2.5,
					"rotation": 270
				},
				{
					"id": 1,
					"type": [
						{
							"mask": 65536,
							"category": 65536
						}
					],
					"x": 2.5,
					"y": 0,
					"rotation": 0
				},
				{
					"id": 2,
					"type": [
						{
							"mask": 65536,
							"category": 65536
						}
					],
					"x": 5,
					"y": 2.5,
					"rotation": 90
				},
				{
					"id": 3,
					"type": [
						{
							"mask": 65536,
							"category": 65536
						}
					],
					"x": 2.5,
					"y": 5,
					"rotation": 180
				}
			],
			"maxHealth": 2000,
			"cost": {
				"groundmaterials": 75
			},
			"repairCost": 100,
			"upgrades": {
				"foundation01t3": {
					"name": "Concrete Foundation (1x1)",
					"codeName": "Foundation01T3",
					"description": "A foundation that provides a suitable surface for constructing Facilities.",
					"icon": "game/Textures/UI/StructureIcons/ConcreteFoundation01Icon.webp",
					"texture": "game/Textures/Structures/concrete_foundation_1x1.webp",
					"textureBorder": "game/Textures/Structures/concrete_foundation_border.webp",
					"garrisonSupplyMultiplier": 2,
					"cost": {
						"concrete": 5
					},
					"maxHealth": 3850,
					"repairCost": 100
				}
			}
		},
		"foundation_1x2": {
			"name": "Foundation (1x2)",
			"codeName": "Foundation011x2T1",
			"description": "A foundation that provides a suitable surface for constructing Facilities.",
			"category": "foundations",
			"categoryOrder": 1,
			"sortLayer": "foundation",
			"icon": "game/Textures/UI/StructureIcons/ConcreteFoundation03Icon.webp",
			"texture": "game/Textures/Structures/foundation_1x2.webp",
			"textureBorder": "game/Textures/Structures/foundation_border.webp",
			"garrisonSupplyMultiplier": 2,
			"canSnap": true,
			"snapNearest": true,
			"sockets": [
				{
					"id": 0,
					"type": [
						{
							"mask": 65536,
							"category": 65536
						}
					],
					"x": 0,
					"y": 2.5,
					"rotation": 270
				},
				{
					"id": 1,
					"type": [
						{
							"mask": 65536,
							"category": 65536
						}
					],
					"x": 2.5,
					"y": 0,
					"rotation": 0
				},
				{
					"id": 2,
					"type": [
						{
							"mask": 65536,
							"category": 65536
						}
					],
					"x": 5,
					"y": 2.5,
					"rotation": 90
				},
				{
					"id": 3,
					"type": [
						{
							"mask": 65536,
							"category": 65536
						}
					],
					"x": 5,
					"y": 7.5,
					"rotation": 90
				},
				{
					"id": 4,
					"type": [
						{
							"mask": 65536,
							"category": 65536
						}
					],
					"x": 2.5,
					"y": 10,
					"rotation": 180
				},
				{
					"id": 5,
					"type": [
						{
							"mask": 65536,
							"category": 65536
						}
					],
					"x": 0,
					"y": 7.5,
					"rotation": 270
				}
			],
			"maxHealth": 2000,
			"cost": {
				"groundmaterials": 115
			},
			"repairCost": 100,
			"upgrades": {
				"foundation011x2t3": {
					"name": "Concrete Foundation (1x2)",
					"codeName": "Foundation011x2T3",
					"description": "A foundation that provides a suitable surface for constructing Facilities.",
					"icon": "game/Textures/UI/StructureIcons/ConcreteFoundation03Icon.webp",
					"texture": "game/Textures/Structures/concrete_foundation_1x2.webp",
					"textureBorder": "game/Textures/Structures/concrete_foundation_border.webp",
					"garrisonSupplyMultiplier": 2,
					"cost": {
						"concrete": 10
					},
					"maxHealth": 3850,
					"repairCost": 100
				}
			}
		},
		"foundation_2x2": {
			"name": "Foundation (2x2)",
			"codeName": "Foundation012x2T1",
			"description": "A foundation that provides a suitable surface for constructing Facilities.",
			"category": "foundations",
			"sortLayer": "foundation",
			"icon": "game/Textures/UI/StructureIcons/ConcreteFoundation04Icon.webp",
			"texture": "game/Textures/Structures/foundation_2x2.webp",
			"textureBorder": "game/Textures/Structures/foundation_border.webp",
			"garrisonSupplyMultiplier": 2,
			"canSnap": true,
			"snapNearest": true,
			"sockets": [
				{
					"id": 0,
					"type": [
						{
							"mask": 65536,
							"category": 65536
						}
					],
					"x": 0,
					"y": 2.5,
					"rotation": 270
				},
				{
					"id": 1,
					"type": [
						{
							"mask": 65536,
							"category": 65536
						}
					],
					"x": 2.5,
					"y": 0,
					"rotation": 0
				},
				{
					"id": 2,
					"type": [
						{
							"mask": 65536,
							"category": 65536
						}
					],
					"x": 7.5,
					"y": 0,
					"rotation": 0
				},
				{
					"id": 3,
					"type": [
						{
							"mask": 65536,
							"category": 65536
						}
					],
					"x": 10,
					"y": 2.5,
					"rotation": 90
				},
				{
					"id": 4,
					"type": [
						{
							"mask": 65536,
							"category": 65536
						}
					],
					"x": 10,
					"y": 7.5,
					"rotation": 90
				},
				{
					"id": 5,
					"type": [
						{
							"mask": 65536,
							"category": 65536
						}
					],
					"x": 7.5,
					"y": 10,
					"rotation": 180
				},
				{
					"id": 6,
					"type": [
						{
							"mask": 65536,
							"category": 65536
						}
					],
					"x": 2.5,
					"y": 10,
					"rotation": 180
				},
				{
					"id": 7,
					"type": [
						{
							"mask": 65536,
							"category": 65536
						}
					],
					"x": 0,
					"y": 7.5,
					"rotation": 270
				}
			],
			"maxHealth": 2000,
			"cost": {
				"groundmaterials": 150
			},
			"repairCost": 100,
			"upgrades": {
				"foundation012x2t3": {
					"name": "Concrete Foundation (2x2)",
					"codeName": "Foundation012x2T3",
					"description": "A foundation that provides a suitable surface for constructing Facilities.",
					"icon": "game/Textures/UI/StructureIcons/ConcreteFoundation04Icon.webp",
					"texture": "game/Textures/Structures/concrete_foundation_2x2.webp",
					"textureBorder": "game/Textures/Structures/concrete_foundation_border.webp",
					"garrisonSupplyMultiplier": 2,
					"cost": {
						"concrete": 15
					},
					"maxHealth": 3850,
					"repairCost": 100
				}
			}
		},
		"foundation_corner": {
			"name": "Foundation Corner (1x1)",
			"codeName": "Foundation02T1",
			"description": "A foundation that provides a suitable surface for constructing Facilities.",
			"category": "foundations",
			"categoryOrder": 3,
			"width": 5,
			"length": 5,
			"sortLayer": "foundation",
			"hitArea": [
				{
					"shape": [ -86.67,88.48,-87.27,36.97,36.97,-87.27,87.27,-87.27,87.88,87.88 ]
				}
			],
			"icon": "game/Textures/UI/StructureIcons/ConcreteFoundation02Icon.webp",
			"texture": "game/Textures/Structures/foundation_corner.webp",
			"textureBorder": "game/Textures/Structures/foundation_border.webp",
			"textureOffset": {
				"x": 288,
				"y": 288
			},
			"garrisonSupplyMultiplier": 2,
			"canSnap": true,
			"snapNearest": true,
			"sockets": [
				{
					"id": 0,
					"type": [
						{
							"mask": 65536,
							"category": 65536
						}
					],
					"x": 5,
					"y": 2.5,
					"rotation": 90
				},
				{
					"id": 1,
					"type": [
						{
							"mask": 65536,
							"category": 65536
						}
					],
					"x": 2.5,
					"y": 5,
					"rotation": 180
				}
			],
			"maxHealth": 2000,
			"cost": {
				"groundmaterials": 75
			},
			"repairCost": 100,
			"upgrades": {
				"foundation02t3": {
					"name": "Concrete Foundation Corner (1x1)",
					"codeName": "Foundation02T3",
					"description": "A foundation that provides a suitable surface for constructing Facilities.",
					"icon": "game/Textures/UI/StructureIcons/ConcreteFoundation02Icon.webp",
					"texture": "game/Textures/Structures/concrete_foundation_corner.webp",
					"textureBorder": "game/Textures/Structures/concrete_foundation_border.webp",
					"garrisonSupplyMultiplier": 2,
					"cost": {
						"concrete": 5
					},
					"maxHealth": 3850,
					"repairCost": 100
				}
			}
		},
		"freighter": {
			"name": "BMS - Ironship",
			"codeName": "Freighter",
			"description": "The Basset Motor Society’s Ironship-class shipping vessel is used to freight shippable goods and heavy vehicles.",
			"category": "vehicles",
			"categoryOrder": 21,
			"sortLayer": "vehicle",
			"hitArea": [
				{
					"shape": [ 302.42,46.67,277.58,69.09,282.42,-66.06,305.45,-42.42,337.58,0.61 ]
				},
				{
					"shape": [ -327.27,86.06,-338.18,-1.82,-293.33,-119.39,174.55,-120.61,241.21,94.55,175.76,120.61,-286.67,120,-309.09,113.33 ]
				},
				{
					"shape": [ -293.33,-119.39,-338.18,-1.82,-327.88,-84.24,-313.94,-109.7 ]
				},
				{
					"shape": [ 234.55,-98.18,282.42,-66.06,277.58,69.09,241.21,94.55,174.55,-120.61 ]
				}
			],
			"icon": "game/Textures/UI/VehicleIcons/FreighterVehicleIcon.webp",
			"texture": "game/Textures/Vehicles/freighter.webp"
		},
		"fuel_container": {
			"name": "Liquid Container",
			"codeName": "FuelContainer",
			"description": "A container for storing high volumes of liquids. Nearby structures and vehicles can refill directly from this container. ",
			"category": "shippables",
			"categoryOrder": 4,
			"sortLayer": "container",
			"icon": "game/Textures/UI/StructureIcons/FuelTankIcon.webp",
			"texture": "game/Textures/Structures/fuel_container.webp",
			"maxHealth": 1000,
			"cost": {
				"cloth": 100
			},
			"repairCost": 100
		},
		"fuel_silo": {
			"name": "Fuel Silo",
			"codeName": "FacilitySiloOil",
			"description": "An industrial silo for storing various types of Fuel.",
			"category": "factories",
			"categoryOrder": 80,
			"color": 1052688,
			"radius": 1.25,
			"icon": "game/Textures/UI/StructureIcons/OilSiloIcon.webp",
			"texture": "game/Textures/Structures/fuel_silo.webp",
			"canSnap": true,
			"snapNearest": true,
			"sockets": [
				{
					"id": 0,
					"name": "pipein",
					"type": [
						{
							"mask": 16779264,
							"category": 16384
						}
					],
					"flow": "in",
					"x": 0.93,
					"y": 2.5,
					"rotation": 180
				},
				{
					"id": 1,
					"name": "pipeout",
					"type": [
						{
							"mask": 16779264,
							"category": 16384
						}
					],
					"flow": "out",
					"x": 0.93,
					"y": 0,
					"rotation": 0
				}
			],
			"techId": "unlockfacilitytier2",
			"liquidCapacity": 500,
			"maxHealth": 900,
			"cost": {
				"facilitymaterials1": 15
			},
			"repairCost": 100
		},
		"gatet1": {
			"name": "Gate (Tier 1)",
			"codeName": "GateT1",
			"description": "A gate that provides access to a walled off area.",
			"category": "defenses",
			"categoryOrder": 4,
			"sortLayer": "wall",
			"icon": "game/Textures/UI/StructureIcons/Gate-T1Icon.webp",
			"texture": "game/Textures/Structures/gatet1.webp",
			"canSnap": true,
			"canSnapRotate": true,
			"sockets": [
				{
					"id": 0,
					"type": [
						{
							"mask": 512,
							"category": 512
						}
					],
					"texture": "game/Textures/Structures/wallsplinet1_post.webp",
					"textureAlt": "game/Textures/Structures/wallsplinet1_post.webp",
					"x": 0.17,
					"y": 0.38,
					"rotation": 270
				},
				{
					"id": 1,
					"type": [
						{
							"mask": 512,
							"category": 512
						}
					],
					"texture": "game/Textures/Structures/wallsplinet1_post.webp",
					"textureAlt": "game/Textures/Structures/wallsplinet1_post.webp",
					"x": 14.7,
					"y": 0.38,
					"rotation": 90
				}
			],
			"maxHealth": 500,
			"cost": {
				"cloth": 25
			},
			"repairCost": 25,
			"upgrades": {
				"gatet2": {
					"name": "Gate (Tier 2)",
					"codeName": "GateT2",
					"description": "A gate that provides access to a walled off area.",
					"icon": "game/Textures/UI/StructureIcons/Gate-T2Icon.webp",
					"texture": "game/Textures/Structures/gatet2.webp",
					"techId": "unlockgatetier2",
					"sockets": [
						{
							"id": 0,
							"type": [
								{
									"mask": 512,
									"category": 512
								}
							],
							"texture": "game/Textures/Structures/wallsplinet2_post.webp",
							"textureAlt": "game/Textures/Structures/wallsplinet2_post.webp",
							"x": 0.17,
							"y": 0.21,
							"rotation": 270
						},
						{
							"id": 1,
							"type": [
								{
									"mask": 512,
									"category": 512
								}
							],
							"texture": "game/Textures/Structures/wallsplinet2_post.webp",
							"textureAlt": "game/Textures/Structures/wallsplinet2_post.webp",
							"x": 14.7,
							"y": 0.21,
							"rotation": 90
						}
					],
					"cost": {
						"cloth": 50
					},
					"maxHealth": 1000,
					"repairCost": 50
				},
				"gatet3": {
					"name": "Gate (Tier 3)",
					"codeName": "GateT3",
					"description": "A gate that provides access to a walled off area.",
					"icon": "game/Textures/UI/StructureIcons/Gate-T3Icon.webp",
					"texture": "game/Textures/Structures/gatet3.webp",
					"techId": "unlockgatetier3",
					"sockets": [
						{
							"id": 0,
							"type": [
								{
									"mask": 512,
									"category": 512
								}
							],
							"texture": "game/Textures/Structures/wallsplinet3_post.webp",
							"textureAlt": "game/Textures/Structures/wallsplinet3_post.webp",
							"x": 0.17,
							"y": 0.36,
							"rotation": 270
						},
						{
							"id": 1,
							"type": [
								{
									"mask": 512,
									"category": 512
								}
							],
							"texture": "game/Textures/Structures/wallsplinet3_post.webp",
							"textureAlt": "game/Textures/Structures/wallsplinet3_post.webp",
							"x": 14.7,
							"y": 0.36,
							"rotation": 90
						}
					],
					"cost": {
						"concrete": 15
					},
					"maxHealth": 3000,
					"repairCost": 75
				}
			}
		},
		"harvester": {
			"name": "BMS - Scrap Hauler",
			"codeName": "Harvester",
			"description": "The Scrap Hauler, designed by the Bassett Motor Society is a heavy-duty piece of machinery designed to reduce scrap metal and other materials into usable, raw resources. Scrap Haulers are often used to extract battlefield resources following skirmishes.",
			"category": "vehicles",
			"categoryOrder": 8,
			"sortLayer": "vehicle",
			"icon": "game/Textures/UI/VehicleIcons/Harvester.webp",
			"texture": "game/Textures/Vehicles/harvester.webp",
			"techId": "unlockharvester"
		},
		"large_assembly_factory": {
			"name": "Large Assembly Station",
			"codeName": "FacilityVehicleFactory2",
			"description": "A large Assembly Station for production of advanced vehicles and equipment, such as tanks and trains. Construction will take time and may be halted if resources are depleted.",
			"category": "factories",
			"categoryOrder": 20,
			"color": 8184298,
			"icon": "game/Textures/UI/ItemIcons/LargeAssemblyStationIcon.webp",
			"texture": "game/Textures/Structures/large_assembly_factory.webp",
			"power": -8,
			"sockets": [
				{
					"id": 0,
					"name": "power",
					"type": [
						{
							"mask": 131072,
							"category": 1048576
						}
					],
					"x": 0.65,
					"y": 1.02,
					"rotation": 0
				}
			],
			"techId": "unlockfacilitytier2",
			"maxHealth": 2700,
			"cost": {
				"facilitymaterials2": 250
			},
			"repairCost": 150,
			"_productionLength": 5,
			"production": [
				{
					"id": 0,
					"input": {
						"facilitymaterials2": 200,
						"facilitymaterials4": 60,
						"facilitymaterials7": 50
					},
					"output": {
						"trainengine": 1
					},
					"time": 21600
				},
				{
					"id": 1,
					"input": {
						"facilitymaterials2": 20,
						"facilitymaterials5": 15,
						"facilitymaterials6": 5
					},
					"output": {
						"traincoal": 1
					},
					"time": 1800
				},
				{
					"id": 2,
					"input": {
						"facilitymaterials2": 20,
						"facilitymaterials5": 15,
						"facilitymaterials6": 5
					},
					"output": {
						"traininfantry": 1
					},
					"time": 1800
				},
				{
					"id": 3,
					"input": {
						"facilitymaterials2": 20,
						"facilitymaterials5": 15,
						"facilitymaterials6": 10
					},
					"output": {
						"trainflatbed": 1
					},
					"time": 1800
				},
				{
					"id": 4,
					"input": {
						"facilitymaterials2": 20,
						"facilitymaterials5": 15,
						"facilitymaterials6": 5
					},
					"output": {
						"traincaboose": 1
					},
					"time": 1800
				}
			],
			"upgrades": {
				"train_assembly": {
					"name": "Train Assembly",
					"codeName": "TrainAssembly",
					"description": "An assembly station for producing train cars.",
					"icon": "game/Textures/UI/ItemIcons/TrainAssemblyStation.webp",
					"texture": "game/Textures/Structures/large_assembly_factory_train_assembly.webp",
					"techId": "unlockfacilitytier3",
					"cost": {
						"facilitymaterials3": 150
					},
					"_productionLength": 3,
					"production": [
						{
							"id": 0,
							"input": {
								"facilitymaterials3": 30,
								"facilitymaterials4": 30,
								"facilitymaterials7": 30
							},
							"output": {
								"traincombatcarc": 1
							},
							"faction": "c",
							"time": 1800
						},
						{
							"id": 1,
							"input": {
								"facilitymaterials3": 30,
								"facilitymaterials4": 30,
								"facilitymaterials7": 30
							},
							"output": {
								"traincombatcarw": 1
							},
							"faction": "w",
							"time": 1800
						},
						{
							"id": 2,
							"input": {
								"facilitymaterials3": 285,
								"facilitymaterials6": 95,
								"facilitymaterials7": 105,
								"facilitymaterials8": 175
							},
							"output": {
								"trainlrartillery": 1
							},
							"time": 259200
						}
					]
				},
				"heavy_tank_assembly": {
					"name": "Heavy Tank Assembly",
					"codeName": "HeavyTankAssembly",
					"description": "An assembly station for producing heavy tank class vehicles.",
					"icon": "game/Textures/UI/ItemIcons/HeavyTankAssemblyStation.webp",
					"texture": "game/Textures/Structures/large_assembly_factory_heavy_tank_assembly.webp",
					"techId": "unlockfacilitytier3",
					"cost": {
						"facilitymaterials3": 150
					},
					"_productionLength": 6,
					"production": [
						{
							"id": 2,
							"input": {
								"facilitymaterials3": 275,
								"facilitymaterials8": 175,
								"facilitymaterials6": 105,
								"facilitymaterials7": 95
							},
							"output": {
								"supertankc": 1
							},
							"faction": "c",
							"time": 172800
						},
						{
							"id": 3,
							"input": {
								"facilitymaterials3": 275,
								"facilitymaterials8": 175,
								"facilitymaterials6": 105,
								"facilitymaterials7": 95
							},
							"output": {
								"supertankw": 1
							},
							"faction": "w",
							"time": 172800
						},
						{
							"id": 0,
							"input": {
								"facilitymaterials3": 50,
								"facilitymaterials6": 30,
								"facilitymaterials7": 60,
								"facilitymaterials8": 35
							},
							"output": {
								"battletankc": 1
							},
							"faction": "c",
							"time": 64800
						},
						{
							"id": 1,
							"input": {
								"facilitymaterials3": 50,
								"facilitymaterials6": 30,
								"facilitymaterials7": 60,
								"facilitymaterials8": 35
							},
							"output": {
								"battletankw": 1
							},
							"faction": "w",
							"time": 64800
						},
						{
							"id": 4,
							"input": {
								"facilitymaterials3": 60,
								"facilitymaterials6": 65,
								"facilitymaterials7": 45,
								"facilitymaterials8": 65
							},
							"output": {
								"battletankatc": 1
							},
							"faction": "c",
							"time": 86400
						},
						{
							"id": 5,
							"input": {
								"facilitymaterials3": 55,
								"facilitymaterials6": 65,
								"facilitymaterials7": 30,
								"facilitymaterials8": 45
							},
							"output": {
								"battletankdefensivew": 1
							},
							"faction": "w",
							"time": 79200
						}
					]
				}
			}
		},
		"light_vehicle_assembly_station": {
			"name": "Small Assembly Station",
			"codeName": "FacilityVehicleFactory1",
			"description": "A standard Assembly Station for production of essential vehicles and equipment. Construction will take time and may be halted if resources are depleted. Some projects require a base vehicle to be present on the Assembly Station before production can begin.",
			"category": "factories",
			"categoryOrder": 15,
			"color": 8184298,
			"icon": "game/Textures/UI/ItemIcons/AssemblyStationIcon.webp",
			"texture": "game/Textures/Structures/light_vehicle_assembly_station.webp",
			"power": -2,
			"sockets": [
				{
					"id": 0,
					"name": "power",
					"type": [
						{
							"mask": 131072,
							"category": 1048576
						}
					],
					"x": 1.02,
					"y": 0.39,
					"rotation": 0
				}
			],
			"maxHealth": 3600,
			"cost": {
				"facilitymaterials1": 75
			},
			"repairCost": 150,
			"_productionLength": 13,
			"production": [
				{
					"id": 0,
					"input": {
						"cloth": 25
					},
					"output": {
						"materialplatform": 1
					},
					"time": 5
				},
				{
					"id": 1,
					"input": {
						"motorcyclec": 1,
						"facilitymaterials1": 5
					},
					"output": {
						"motorcycleoffensivec": 1
					},
					"faction": "c",
					"time": 180
				},
				{
					"id": 3,
					"input": {
						"truckc": 1,
						"facilitymaterials1": 10
					},
					"output": {
						"truckmobilityc": 1
					},
					"faction": "c",
					"time": 300
				},
				{
					"id": 4,
					"input": {
						"truckc": 1,
						"facilitymaterials1": 10
					},
					"output": {
						"truckoffensivec": 1
					},
					"faction": "c",
					"time": 300
				},
				{
					"id": 5,
					"input": {
						"truckw": 1,
						"facilitymaterials1": 10
					},
					"output": {
						"truckdefensivew": 1
					},
					"faction": "w",
					"time": 300
				},
				{
					"id": 6,
					"input": {
						"truckw": 1,
						"facilitymaterials1": 10
					},
					"output": {
						"truckmobilityw": 1
					},
					"faction": "w",
					"time": 300
				},
				{
					"id": 7,
					"input": {
						"facilitymaterials1": 125,
						"facilitymaterials4": 10,
						"facilitymaterials5": 20
					},
					"output": {
						"smalltrainengine": 1
					},
					"time": 900
				},
				{
					"id": 8,
					"input": {
						"facilitymaterials1": 35,
						"facilitymaterials4": 15,
						"facilitymaterials5": 5
					},
					"output": {
						"smalltraindump": 1
					},
					"time": 300
				},
				{
					"id": 9,
					"input": {
						"facilitymaterials1": 35,
						"facilitymaterials4": 15,
						"facilitymaterials5": 5
					},
					"output": {
						"smalltrainresourceplatform": 1
					},
					"time": 300
				},
				{
					"id": 10,
					"input": {
						"ambulancec": 1,
						"facilitymaterials1": 15,
						"facilitymaterials5": 5
					},
					"output": {
						"ambulanceflamec": 1
					},
					"faction": "c",
					"time": 300
				},
				{
					"id": 11,
					"input": {
						"ambulancew": 1,
						"facilitymaterials1": 15,
						"facilitymaterials5": 5
					},
					"output": {
						"ambulanceflamew": 1
					},
					"faction": "w",
					"time": 300
				},
				{
					"id": 12,
					"input": {
						"facilitymaterials1": 35,
						"facilitymaterials4": 5,
						"facilitymaterials5": 15
					},
					"output": {
						"smalltrainfuelcontainer": 1
					},
					"time": 300
				}
			],
			"upgrades": {
				"motor_pool": {
					"name": "Motor Pool",
					"codeName": "MotorPool",
					"description": "An assembly station for producing light-duty logistics vehicles like trucks.",
					"icon": "game/Textures/UI/ItemIcons/MotorPoolAssemblyIcon.webp",
					"texture": "game/Textures/Structures/light_vehicle_assembly_station_motor_pool.webp",
					"cost": {
						"facilitymaterials1": 200
					},
					"_productionLength": 12,
					"production": [
						{
							"id": 0,
							"input": {
								"armoredcarc": 1,
								"facilitymaterials2": 5,
								"facilitymaterials4": 10
							},
							"output": {
								"armoredcaroffensivec": 1
							},
							"faction": "c",
							"time": 300
						},
						{
							"id": 1,
							"input": {
								"armoredcarc": 1,
								"facilitymaterials1": 10,
								"facilitymaterials4": 10
							},
							"output": {
								"armoredcartwinc": 1
							},
							"faction": "c",
							"time": 300
						},
						{
							"id": 2,
							"input": {
								"tankettec": 1,
								"facilitymaterials1": 10,
								"facilitymaterials4": 15
							},
							"output": {
								"tanketteoffensivec": 1
							},
							"faction": "c",
							"time": 300
						},
						{
							"id": 3,
							"input": {
								"tankettec": 1,
								"facilitymaterials2": 10,
								"facilitymaterials4": 15
							},
							"output": {
								"tanketteflamec": 1
							},
							"faction": "c",
							"time": 600
						},
						{
							"id": 4,
							"input": {
								"scoutvehiclemobilityc": 1,
								"facilitymaterials1": 3
							},
							"output": {
								"scoutvehicleutilityc": 1
							},
							"faction": "c",
							"time": 180
						},
						{
							"id": 5,
							"input": {
								"scoutvehiclemobilityc": 1,
								"facilitymaterials1": 3,
								"facilitymaterials5": 10
							},
							"output": {
								"scoutvehicleoffensivec": 1
							},
							"faction": "c",
							"time": 180
						},
						{
							"id": 6,
							"input": {
								"armoredcarw": 1,
								"facilitymaterials2": 10,
								"facilitymaterials4": 10
							},
							"output": {
								"armoredcaratw": 1
							},
							"faction": "w",
							"time": 300
						},
						{
							"id": 7,
							"input": {
								"armoredcarw": 1,
								"facilitymaterials1": 5,
								"facilitymaterials4": 5
							},
							"output": {
								"armoredcarmobilityw": 1
							},
							"faction": "w",
							"time": 300
						},
						{
							"id": 8,
							"input": {
								"armoredcarw": 1,
								"facilitymaterials2": 10,
								"facilitymaterials4": 10
							},
							"output": {
								"armoredcarflamew": 1
							},
							"faction": "w",
							"time": 300
						},
						{
							"id": 9,
							"input": {
								"armoredcartwinw": 1,
								"facilitymaterials1": 15,
								"facilitymaterials4": 15
							},
							"output": {
								"armoredcaroffensivew": 1
							},
							"faction": "w",
							"time": 300
						},
						{
							"id": 10,
							"input": {
								"scoutvehiclew": 1,
								"facilitymaterials1": 3,
								"facilitymaterials5": 10
							},
							"output": {
								"scoutvehicleoffensivew": 1
							},
							"faction": "w",
							"time": 180
						},
						{
							"id": 11,
							"input": {
								"scoutvehiclew": 1,
								"facilitymaterials1": 3,
								"facilitymaterials5": 5
							},
							"output": {
								"scoutvehicleutilityw": 1
							},
							"faction": "w",
							"time": 180
						}
					]
				},
				"rocket_factory": {
					"name": "Rocket Factory",
					"codeName": "ArtilleryFactory",
					"description": "An assembly station for producing half-tracks and rocket vehicles.",
					"icon": "game/Textures/UI/ItemIcons/ArtilleryFactoryIcon.webp",
					"texture": "game/Textures/Structures/light_vehicle_assembly_station_rocket_factory.webp",
					"techId": "unlockfacilitytier2",
					"cost": {
						"facilitymaterials2": 65
					},
					"_productionLength": 7,
					"production": [
						{
							"id": 0,
							"input": {
								"truckc": 1,
								"facilitymaterials2": 70,
								"facilitymaterials4": 10,
								"facilitymaterials6": 8
							},
							"output": {
								"truckmultic": 1
							},
							"faction": "c",
							"time": 300
						},
						{
							"id": 1,
							"input": {
								"facilitymaterials2": 20,
								"facilitymaterials5": 15,
								"facilitymaterials7": 3
							},
							"output": {
								"emplacedmultic": 1
							},
							"faction": "c",
							"time": 600
						},
						{
							"id": 4,
							"input": {
								"halftrackw": 1,
								"facilitymaterials2": 10,
								"facilitymaterials4": 10,
								"facilitymaterials6": 8
							},
							"output": {
								"halftrackmultiw": 1
							},
							"faction": "w",
							"time": 300
						},
						{
							"id": 5,
							"input": {
								"facilitymaterials2": 20,
								"facilitymaterials5": 15,
								"facilitymaterials7": 3
							},
							"output": {
								"fieldmultiw": 1
							},
							"faction": "w",
							"time": 600
						},
						{
							"id": 2,
							"input": {
								"halftrackc": 1,
								"facilitymaterials2": 3,
								"facilitymaterials7": 3
							},
							"output": {
								"halftrackdefensivec": 1
							},
							"faction": "c",
							"time": 300
						},
						{
							"id": 3,
							"input": {
								"halftrackc": 1,
								"facilitymaterials2": 5,
								"facilitymaterials5": 5,
								"facilitymaterials7": 3
							},
							"output": {
								"halftrackartilleryc": 1
							},
							"faction": "c",
							"time": 300
						},
						{
							"id": 6,
							"input": {
								"halftrackw": 1,
								"facilitymaterials2": 5,
								"facilitymaterials5": 10,
								"facilitymaterials7": 3
							},
							"output": {
								"halftrackoffensivew": 1
							},
							"faction": "w",
							"time": 300
						}
					]
				},
				"field_station": {
					"name": "Field Station",
					"codeName": "LightVehicleAssembly",
					"description": "An assembly station for producing field weapons and utility vehicles such as Harvesters.",
					"icon": "game/Textures/UI/ItemIcons/LightVehicleAssemblyIcon.webp",
					"texture": "game/Textures/Structures/light_vehicle_assembly_station_field_station.webp",
					"techId": "unlockfacilitytier2",
					"cost": {
						"facilitymaterials2": 25
					},
					"_productionLength": 7,
					"production": [
						{
							"id": 0,
							"input": {
								"facilitymaterials2": 90,
								"facilitymaterials7": 25
							},
							"output": {
								"harvester": 1
							},
							"time": 900
						},
						{
							"id": 6,
							"input": {
								"construction": 1,
								"facilitymaterials2": 10
							},
							"output": {
								"constructionutility": 1
							},
							"time": 900
						},
						{
							"id": 1,
							"input": {
								"mortartankc": 1,
								"facilitymaterials1": 5
							},
							"output": {
								"lighttank2infantryc": 1
							},
							"faction": "c",
							"time": 180
						},
						{
							"id": 2,
							"input": {
								"landingcraftc": 1,
								"facilitymaterials2": 5,
								"facilitymaterials6": 3
							},
							"output": {
								"landingcraftoffensivec": 1
							},
							"faction": "c",
							"time": 300
						},
						{
							"id": 3,
							"input": {
								"fieldatc": 1,
								"facilitymaterials2": 5,
								"facilitymaterials7": 5
							},
							"output": {
								"fieldcannondamagec": 1
							},
							"faction": "c",
							"time": 300
						},
						{
							"id": 4,
							"input": {
								"scouttankw": 1,
								"facilitymaterials2": 5,
								"facilitymaterials6": 5
							},
							"output": {
								"scouttankoffensivew": 1
							},
							"faction": "w",
							"time": 300
						},
						{
							"id": 5,
							"input": {
								"fieldatw": 1,
								"facilitymaterials2": 5,
								"facilitymaterials7": 5
							},
							"output": {
								"fieldatdamagew": 1
							},
							"faction": "w",
							"time": 300
						}
					]
				},
				"tank_factory": {
					"name": "Tank Factory",
					"codeName": "TankAssembly",
					"description": "An assembly station for producing tank class vehicles.",
					"icon": "game/Textures/UI/ItemIcons/TankAssemblyIcon.webp",
					"texture": "game/Textures/Structures/light_vehicle_assembly_station_tank_factory.webp",
					"techId": "unlockfacilitytier2",
					"cost": {
						"facilitymaterials2": 200
					},
					"_productionLength": 12,
					"production": [
						{
							"id": 6,
							"input": {
								"destroyertankw": 1,
								"facilitymaterials2": 10,
								"facilitymaterials5": 10,
								"facilitymaterials6": 15
							},
							"output": {
								"destroyertankflamew": 1
							},
							"faction": "w",
							"time": 420
						},
						{
							"id": 0,
							"input": {
								"lighttankc": 1,
								"facilitymaterials2": 35,
								"facilitymaterials5": 20,
								"facilitymaterials6": 5
							},
							"output": {
								"lighttankflamec": 1
							},
							"faction": "c",
							"time": 300
						},
						{
							"id": 1,
							"input": {
								"lighttankc": 1,
								"facilitymaterials2": 8,
								"facilitymaterials5": 20,
								"facilitymaterials6": 5
							},
							"output": {
								"lighttankoffensivec": 1
							},
							"faction": "c",
							"time": 300
						},
						{
							"id": 2,
							"input": {
								"lighttankc": 1,
								"facilitymaterials2": 5,
								"facilitymaterials4": 20,
								"facilitymaterials7": 5
							},
							"output": {
								"lighttankmobilityc": 1
							},
							"faction": "c",
							"time": 300
						},
						{
							"id": 3,
							"input": {
								"mediumtankc": 1,
								"facilitymaterials2": 8,
								"facilitymaterials4": 10,
								"facilitymaterials7": 8
							},
							"output": {
								"mediumtankoffensivec": 1
							},
							"faction": "c",
							"time": 420
						},
						{
							"id": 4,
							"input": {
								"mediumtank2c": 1,
								"facilitymaterials2": 10,
								"facilitymaterials5": 10,
								"facilitymaterials6": 10
							},
							"output": {
								"mediumtank2twinc": 1
							},
							"faction": "c",
							"time": 420
						},
						{
							"id": 5,
							"input": {
								"facilitymaterials2": 135,
								"facilitymaterials4": 10,
								"facilitymaterials7": 15
							},
							"output": {
								"emplacedcannonlargec": 1
							},
							"faction": "c",
							"time": 600
						},
						{
							"id": 7,
							"input": {
								"lighttankw": 1,
								"facilitymaterials2": 8,
								"facilitymaterials5": 20,
								"facilitymaterials6": 5
							},
							"output": {
								"lighttankdefensivew": 1
							},
							"faction": "w",
							"time": 300
						},
						{
							"id": 8,
							"input": {
								"lighttankw": 1,
								"facilitymaterials2": 3,
								"facilitymaterials4": 20,
								"facilitymaterials7": 3
							},
							"output": {
								"lighttankartilleryw": 1
							},
							"faction": "w",
							"time": 300
						},
						{
							"id": 9,
							"input": {
								"mediumtankw": 1,
								"facilitymaterials2": 5,
								"facilitymaterials4": 10,
								"facilitymaterials7": 8
							},
							"output": {
								"mediumtanksiegew": 1
							},
							"faction": "w",
							"time": 420
						},
						{
							"id": 10,
							"input": {
								"mediumtank2rangew": 1,
								"facilitymaterials2": 5,
								"facilitymaterials5": 10,
								"facilitymaterials6": 5
							},
							"output": {
								"mediumtank2multiw": 1
							},
							"faction": "w",
							"time": 420
						},
						{
							"id": 11,
							"input": {
								"facilitymaterials2": 135,
								"facilitymaterials4": 10,
								"facilitymaterials7": 15
							},
							"output": {
								"emplacedatlargew": 1
							},
							"faction": "w",
							"time": 600
						}
					]
				},
				"weapons_platform": {
					"name": "Weapons Platform",
					"codeName": "WeaponsPlatformAssembly",
					"description": "An assembly station for producing emplaced weapon platforms and specialized tanks.",
					"icon": "game/Textures/UI/ItemIcons/WeaponPlatfromAssemblyIcon.webp",
					"texture": "game/Textures/Structures/light_vehicle_assembly_station_weapons_platform.webp",
					"techId": "unlockfacilitytier3",
					"cost": {
						"facilitymaterials3": 20
					},
					"_productionLength": 5,
					"production": [
						{
							"id": 0,
							"input": {
								"fieldatc": 1,
								"facilitymaterials3": 15,
								"facilitymaterials5": 20,
								"facilitymaterials6": 15
							},
							"output": {
								"fieldatlargec": 1
							},
							"faction": "c",
							"time": 420
						},
						{
							"id": 2,
							"input": {
								"fieldcannonw": 1,
								"facilitymaterials3": 15,
								"facilitymaterials5": 20,
								"facilitymaterials6": 15
							},
							"output": {
								"fieldcannonlargew": 1
							},
							"faction": "w",
							"time": 420
						},
						{
							"id": 1,
							"input": {
								"mediumtankc": 1,
								"facilitymaterials3": 5,
								"facilitymaterials4": 10,
								"facilitymaterials7": 15
							},
							"output": {
								"mediumtanklargec": 1
							},
							"faction": "c",
							"time": 600
						},
						{
							"id": 3,
							"input": {
								"mediumtank2rangew": 1,
								"facilitymaterials3": 10,
								"facilitymaterials4": 10,
								"facilitymaterials7": 15
							},
							"output": {
								"mediumtank2indirectw": 1
							},
							"faction": "w",
							"time": 600
						},
						{
							"id": 4,
							"input": {
								"mediumtankw": 1,
								"facilitymaterials3": 35,
								"facilitymaterials5": 15,
								"facilitymaterials6": 25
							},
							"output": {
								"mediumtankatw": 1
							},
							"faction": "w",
							"time": 600
						}
					]
				}
			}
		},
		"liquid_transfer_station": {
			"name": "Liquid Transfer Station",
			"codeName": "FacilityResourceTransfer3",
			"description": "Metal drums for storing various fuels that can be transferred into and out of Facilities. Stockpiles may be public or reserved.",
			"category": "factories",
			"categoryOrder": 55,
			"color": 8186514,
			"icon": "game/Textures/UI/ItemIcons/MaterialTransferStationLiquidIcon.webp",
			"texture": "game/Textures/Structures/liquid_transfer_station.webp",
			"sockets": [
				{
					"id": 0,
					"name": "pipein",
					"type": [
						{
							"mask": 16779264,
							"category": 16384
						}
					],
					"flow": "in",
					"x": 0.12,
					"y": 4.08,
					"rotation": 270
				},
				{
					"id": 1,
					"name": "pipeout",
					"type": [
						{
							"mask": 16779264,
							"category": 16384
						}
					],
					"flow": "out",
					"x": 0.12,
					"y": 1.46,
					"rotation": 270
				}
			],
			"maxHealth": 2200,
			"cost": {
				"facilitymaterials1": 35
			},
			"repairCost": 100
		},
		"maintenance_tunnel": {
			"name": "Maintenance Tunnel",
			"codeName": "MaintenanceTunnel",
			"description": "Prevents the decay of nearby structures when supplied.",
			"category": "misc",
			"color": 1052688,
			"radius": 2,
			"sortLayer": "resource",
			"maxRange": 100,
			"icon": "game/Textures/UI/StructureIcons/TunnelNetworkStructureIcon.webp",
			"texture": "game/Textures/Structures/maintenance_tunnel.webp",
			"maxHealth": 3000,
			"cost": {
				"cloth": 50
			},
			"repairCost": 100
		},
		"material_transfer_station": {
			"name": "Material Transfer Station",
			"codeName": "FacilityResourceTransfer2",
			"description": "A space marked for storing refined materials that can be transferred into and out of Facilities. Stockpiles may be public or reserved.",
			"category": "factories",
			"categoryOrder": 50,
			"color": 8186514,
			"icon": "game/Textures/UI/ItemIcons/FacilityResourceTransfer3Icon.webp",
			"texture": "game/Textures/Structures/material_transfer_station.webp",
			"maxHealth": 2200,
			"cost": {
				"facilitymaterials1": 35
			},
			"repairCost": 100
		},
		"materialplatform": {
			"name": "Material Pallet",
			"codeName": "MaterialPlatform",
			"description": "A material pallet.",
			"category": "shippables",
			"categoryOrder": 1,
			"icon": "game/Textures/UI/ItemIcons/MaterialPlatformItemIcon.webp",
			"texture": "game/Textures/Structures/material_platform.webp",
			"maxHealth": 1000,
			"cost": {
				"cloth": 25
			},
			"repairCost": 50
		},
		"materials_factory": {
			"name": "Materials Factory",
			"codeName": "FacilityRefinery1",
			"description": "A factory that refines raw resources into Construction Materials for advanced facilities. Additional modifications allow for the development of a variety of different materials.",
			"category": "factories",
			"hitArea": [
				{
					"shape": [ 39.09,182.12,21.52,-177.27,88.79,-111.21,89.39,135.45,80.3,182.12 ]
				},
				{
					"shape": [ 116.06,-154.85,106.97,-126.97,88.79,-111.21,21.52,-177.27,42.12,-199.09,71.82,-204.55,105.76,-186.97 ]
				},
				{
					"shape": [ 11.82,-185.76,21.52,-177.27,-73.64,182.12,-114.85,182.12,-114.85,-184.55 ]
				},
				{
					"shape": [ -73.03,200.3,-73.64,182.12,21.52,-177.27,39.7,200.3 ]
				}
			],
			"icon": "game/Textures/UI/StructureIcons/MetalworksFactoryBase.webp",
			"texture": "game/Textures/Structures/materials_factory.webp",
			"power": -2,
			"sockets": [
				{
					"id": 0,
					"name": "power",
					"type": [
						{
							"mask": 131072,
							"category": 1048576
						}
					],
					"x": 3.07,
					"y": 12.19,
					"rotation": 180
				}
			],
			"maxHealth": 3000,
			"cost": {
				"cloth": 200
			},
			"repairCost": 150,
			"_productionLength": 2,
			"production": [
				{
					"id": 0,
					"input": {
						"metal": 10
					},
					"output": {
						"facilitymaterials1": 1
					},
					"time": 25
				},
				{
					"id": 1,
					"input": {
						"metal": 100
					},
					"output": {
						"maintenancesupplies": 20
					},
					"time": 25,
					"power": -3
				}
			],
			"upgrades": {
				"forge": {
					"name": "Forge",
					"codeName": "Forge",
					"description": "A unique factory for forging specialized machinery parts needed to construct vehicles. Requires Coke or Petrol.",
					"hitArea": [
						{
							"shape": [ -93.94,185.15,110.3,-114.85,110.3,138.48,101.21,185.15 ]
						},
						{
							"shape": [ 46.06,-203.94,110.3,-114.85,-10.3,-177.27,-9.7,-206.36 ]
						},
						{
							"shape": [ -120.61,-163.33,-112.12,-180.91,-93.94,-191.21,-73.33,-190,-54.55,-176.06,-93.94,-124.55,-114.55,-137.88 ]
						},
						{
							"shape": [ -10.3,-177.27,110.3,-114.85,-93.94,185.15,-93.94,-124.55,-54.55,-176.06 ]
						},
						{
							"shape": [ 110.3,-114.85,46.06,-203.94,68.48,-208.79,93.33,-202.73,109.09,-188.79,121.82,-160.3 ]
						},
						{
							"shape": [ -52.73,185.15,60,185.15,60,202.12,-52.12,203.33 ]
						}
					],
					"icon": "game/Textures/UI/StructureIcons/FacilityForgeIcon.webp",
					"texture": "game/Textures/Structures/materials_factory_forge.webp",
					"positionOffset": {
						"x": -69,
						"y": -10
					},
					"sockets": [
						{
							"id": 0,
							"name": "power",
							"type": [
								{
									"mask": 131072,
									"category": 1048576
								}
							],
							"x": 3.9,
							"y": 12.37,
							"rotation": 180
						},
						{
							"id": 1,
							"name": "pipein",
							"type": [
								{
									"mask": 16779264,
									"category": 16384
								}
							],
							"flow": "in",
							"x": 3.41,
							"y": 0.51,
							"rotation": 270
						}
					],
					"cost": {
						"facilitymaterials1": 200
					},
					"_productionLength": 2,
					"production": [
						{
							"id": 0,
							"input": {
								"metal": 15,
								"facilitycoal1": 75
							},
							"output": {
								"facilitymaterials4": 1
							},
							"time": 60
						},
						{
							"id": 1,
							"input": {
								"metal": 15,
								"petrol": 50
							},
							"output": {
								"facilitymaterials5": 1
							},
							"time": 60
						}
					]
				},
				"metal_press": {
					"name": "Metal Press",
					"codeName": "MetalPress",
					"description": "A heavy automatic press that refines materials into a denser form.",
					"hitArea": [
						{
							"shape": [ 115.76,-120.61,97.58,-121.82,42.42,-174.55,115.76,-175.76 ]
						},
						{
							"shape": [ 48.48,165.45,-105.45,-73.33,42.42,-174.55,97.58,-121.82,98.79,118.79,89.7,165.45 ]
						},
						{
							"shape": [ -88.48,-167.27,-112.12,-112.12,-117.58,-114.55,-116.97,-167.27 ]
						},
						{
							"shape": [ -55.76,-186.67,45.45,-186.67,39.39,-185.45,-61.21,-185.45 ]
						},
						{
							"shape": [ -105.45,-73.33,-64.24,165.45,-105.45,165.45 ]
						},
						{
							"shape": [ -64.24,165.45,48.48,182.42,-63.64,183.64 ]
						},
						{
							"shape": [ -105.45,-73.33,48.48,165.45,48.48,182.42,-64.24,165.45 ]
						},
						{
							"shape": [ -112.12,-112.12,-88.48,-167.27,-87.88,-158.18,-105.45,-73.33,-110.91,-88.48 ]
						},
						{
							"shape": [ -105.45,-73.33,-58.79,-158.18,39.39,-185.45,42.42,-174.55 ]
						},
						{
							"shape": [ -58.79,-158.18,-105.45,-73.33,-87.88,-158.18 ]
						},
						{
							"shape": [ -55.15,-185.45,39.39,-185.45,-58.79,-158.18 ]
						}
					],
					"icon": "game/Textures/UI/StructureIcons/FacilityMetalPressIcon.webp",
					"texture": "game/Textures/Structures/materials_factory_metal_press.webp",
					"positionOffset": {
						"x": -32,
						"y": 55
					},
					"sockets": [
						{
							"id": 0,
							"name": "power",
							"type": [
								{
									"mask": 131072,
									"category": 1048576
								}
							],
							"x": 3.44,
							"y": 11.15,
							"rotation": 180
						},
						{
							"id": 2,
							"name": "pipein",
							"type": [
								{
									"mask": 16779264,
									"category": 16384
								}
							],
							"flow": "in",
							"x": 0.48,
							"y": 0.63,
							"rotation": 0
						}
					],
					"cost": {
						"facilitymaterials1": 25
					},
					"_productionLength": 1,
					"production": [
						{
							"id": 0,
							"input": {
								"metal": 15,
								"petrol": 25
							},
							"output": {
								"facilitymaterials1": 3
							},
							"time": 25,
							"power": -4
						}
					]
				},
				"recycler": {
					"name": "Assembly Bay",
					"codeName": "Recycler",
					"description": "An assembly bay with specialized equipment for quickly building and packing materials needed on the frontline.",
					"hitArea": [
						{
							"shape": [ 15.45,-166.97,0.91,-154.85,1.52,-166.97 ]
						},
						{
							"shape": [ -61.52,176.06,0.91,-154.85,15.45,-166.97,102.12,-123.94,101.52,129.39,92.42,176.06 ]
						},
						{
							"shape": [ -15.45,-166.97,-11.21,-155.45,-61.52,176.06,-91.82,-146.97,-91.82,-166.97 ]
						},
						{
							"shape": [ 102.12,-123.94,15.45,-166.97,68.18,-166.97,96.06,-156.67 ]
						},
						{
							"shape": [ -30.61,-189.39,-25.15,-166.97,-77.88,-166.97,-71.82,-188.18,-53.03,-199.7 ]
						},
						{
							"shape": [ 60.91,-189.39,68.18,-166.97,15.45,-166.97,21.52,-189.39,40.91,-199.09 ]
						},
						{
							"shape": [ -61.52,176.06,51.21,176.06,51.21,193.64,-60.91,194.24 ]
						},
						{
							"shape": [ -102.73,-146.97,-91.82,-146.97,-61.52,176.06,-102.73,176.06 ]
						},
						{
							"shape": [ -61.52,176.06,-11.21,-155.45,0.91,-154.85 ]
						}
					],
					"icon": "game/Textures/UI/StructureIcons/FacilityRecyclerIcon.webp",
					"texture": "game/Textures/Structures/materials_factory_recycler.webp",
					"positionOffset": {
						"x": -41,
						"y": 21
					},
					"sockets": [
						{
							"id": 0,
							"name": "power",
							"type": [
								{
									"mask": 131072,
									"category": 1048576
								}
							],
							"x": 3.07,
							"y": 11.8,
							"rotation": 180
						}
					],
					"cost": {
						"cloth": 50
					},
					"_productionLength": 2,
					"production": [
						{
							"id": 0,
							"input": {
								"metal": 25
							},
							"output": {
								"facilitymaterials1": 1,
								"sandbagmaterials": 5
							},
							"time": 25
						},
						{
							"id": 1,
							"input": {
								"metal": 25
							},
							"output": {
								"facilitymaterials1": 1,
								"barbedwirematerials": 5
							},
							"time": 25
						}
					]
				},
				"smelter": {
					"name": "Smelter",
					"codeName": "Smelter",
					"description": "An industrial smelter for melting down Salvage to remove impurities. Requires Coke.",
					"hitArea": [
						{
							"shape": [ -102.73,176.06,87.58,-161.52,98.48,-153.03,102.12,-123.94,101.52,129.39,92.42,176.06 ]
						},
						{
							"shape": [ 85.76,-196.06,87.58,-161.52,-102.73,176.06,-100.91,-146.36,-93.03,-195.45 ]
						},
						{
							"shape": [ -61.52,176.06,51.21,176.06,51.21,193.64,-60.91,194.24 ]
						}
					],
					"icon": "game/Textures/UI/StructureIcons/FacilitySmelterIcon.webp",
					"texture": "game/Textures/Structures/materials_factory_smelter.webp",
					"positionOffset": {
						"x": -41,
						"y": 21
					},
					"sockets": [
						{
							"id": 0,
							"name": "power",
							"type": [
								{
									"mask": 131072,
									"category": 1048576
								}
							],
							"x": 3.07,
							"y": 11.8,
							"rotation": 180
						}
					],
					"cost": {
						"facilitymaterials1": 25
					},
					"_productionLength": 1,
					"production": [
						{
							"id": 0,
							"input": {
								"metal": 15,
								"facilitycoal1": 25
							},
							"output": {
								"facilitymaterials1": 3
							},
							"time": 25,
							"power": -4
						}
					]
				}
			}
		},
		"metalworks_factory": {
			"name": "Metalworks Factory",
			"codeName": "FacilityRefinery2",
			"description": "A factory for refining raw resources into Processed Construction Materials. Additional modifications can allow for additional refined materials needed for advanced facility operations.",
			"category": "factories",
			"categoryOrder": 5,
			"hitArea": [
				{
					"shape": [ 145.15,80.3,51.82,80.3,51.21,-25.76,145.15,-25.76 ]
				},
				{
					"shape": [ 50,-179.09,51.21,-151.82,51.21,-25.76,-137.88,-14.85,-135.45,-179.09 ]
				},
				{
					"shape": [ -160.91,-12.42,5.15,96.06,5.15,190.61,-157.88,190.61 ]
				},
				{
					"shape": [ 81.52,-94.24,51.21,-94.24,51.21,-151.82,82.73,-151.82 ]
				},
				{
					"shape": [ 5.15,96.06,-160.91,-12.42,-137.88,-14.85,51.21,-25.76,51.82,80.3,51.21,94.24 ]
				}
			],
			"icon": "game/Textures/UI/StructureIcons/FacilityRefinery2Icon.webp",
			"texture": "game/Textures/Structures/metalworks_factory.webp",
			"power": -5,
			"sockets": [
				{
					"id": 0,
					"name": "power",
					"type": [
						{
							"mask": 131072,
							"category": 1048576
						}
					],
					"x": 2.79,
					"y": 12.09,
					"rotation": 180
				}
			],
			"techId": "unlockfacilitytier2",
			"maxHealth": 3000,
			"cost": {
				"facilitymaterials1": 125
			},
			"repairCost": 150,
			"_productionLength": 2,
			"production": [
				{
					"id": 0,
					"input": {
						"facilitymaterials1": 3,
						"components": 20
					},
					"output": {
						"facilitymaterials2": 1
					},
					"time": 60
				},
				{
					"id": 1,
					"input": {
						"facilitymaterials2": 3
					},
					"output": {
						"pipematerials": 1
					},
					"time": 120
				}
			],
			"upgrades": {
				"recycler": {
					"name": "Recycler",
					"codeName": "Recycler",
					"description": "Advanced sorting machinery for sifting piles of scrap metal for useful materials.",
					"hitArea": [
						{
							"shape": [ 54.24,-179.09,54.85,-145.15,-133.64,7.58,-131.82,-179.09 ]
						},
						{
							"shape": [ -158.48,23.33,9.39,136.67,9.39,190.61,-153.64,190.61 ]
						},
						{
							"shape": [ -133.64,7.58,-158.48,23.33,-152.42,6.97 ]
						},
						{
							"shape": [ 115.45,-54.85,77.88,-139.7,101.52,-151.82,131.21,-147.58,153.64,-125.15,150.61,-79.09 ]
						},
						{
							"shape": [ 114.24,73.03,114.24,-28.18,140.91,-12.42,156.67,14.24,150.61,51.82 ]
						},
						{
							"shape": [ 91.82,131.82,9.39,136.67,-158.48,23.33,-133.64,7.58,114.24,-28.18,114.24,73.03,109.39,121.52 ]
						},
						{
							"shape": [ 115.45,-54.85,114.24,-28.18,-133.64,7.58,54.85,-145.15,77.88,-139.7 ]
						}
					],
					"icon": "game/Textures/UI/StructureIcons/FacilityRefinery2RecyclerIcon.webp",
					"texture": "game/Textures/Structures/metalworks_factory_recycler.webp",
					"positionOffset": {
						"x": -13
					},
					"sockets": [
						{
							"id": 0,
							"name": "power",
							"type": [
								{
									"mask": 131072,
									"category": 1048576
								}
							],
							"x": 2.8,
							"y": 12.09,
							"rotation": 180
						}
					],
					"cost": {
						"facilitymaterials1": 25
					},
					"_productionLength": 2,
					"production": [
						{
							"id": 0,
							"input": {
								"facilitymaterials1": 3,
								"components": 20
							},
							"output": {
								"facilitymaterials2": 1,
								"metalbeammaterials": 1
							},
							"time": 60
						},
						{
							"id": 1,
							"input": {
								"facilitycomponents1": 30
							},
							"output": {
								"components": 20
							},
							"time": 90,
							"power": -4
						}
					]
				},
				"blast_furnace": {
					"name": "Blast Furnace",
					"codeName": "BlastFurnace",
					"description": "A large industrial cauldron for liquefying metals to remove impurities from advanced materials.",
					"hitArea": [
						{
							"shape": [ -146.06,46.67,18.18,102.42,18.18,196.97,-144.85,196.97 ]
						},
						{
							"shape": [ -122.42,3.64,-146.06,46.67,-155.76,46.06,-157.58,4.24 ]
						},
						{
							"shape": [ 52.73,128.48,18.18,102.42,101.82,-29.7,149.7,6.67,164.85,55.76,147.27,101.82,106.06,132.12 ]
						},
						{
							"shape": [ 30.91,-172.73,-122.42,3.64,-123.03,-172.73,-75.15,-187.27,-23.03,-199.39,20.61,-190.91 ]
						},
						{
							"shape": [ -146.06,46.67,-122.42,3.64,80,-163.03,101.82,-163.03,101.82,-29.7,18.18,102.42 ]
						},
						{
							"shape": [ -23.03,-199.39,-75.15,-187.27,-73.33,-200 ]
						},
						{
							"shape": [ 80,-163.03,-122.42,3.64,30.91,-172.73,63.64,-171.52 ]
						}
					],
					"icon": "game/Textures/UI/StructureIcons/FacilityBlastFurnaceIcon.webp",
					"texture": "game/Textures/Structures/metalworks_factory_blast_furnace.webp",
					"positionOffset": {
						"x": -42,
						"y": -22
					},
					"sockets": [
						{
							"id": 0,
							"name": "power",
							"type": [
								{
									"mask": 131072,
									"category": 1048576
								}
							],
							"x": 3.18,
							"y": 12.5,
							"rotation": 180
						},
						{
							"id": 1,
							"name": "pipein",
							"type": [
								{
									"mask": 16779264,
									"category": 16384
								}
							],
							"flow": "in",
							"x": 2.77,
							"y": 0.49,
							"rotation": 270
						}
					],
					"cost": {
						"facilitymaterials2": 200
					},
					"_productionLength": 3,
					"production": [
						{
							"id": 0,
							"input": {
								"facilitymaterials2": 1,
								"facilityoil1": 66
							},
							"output": {
								"facilitymaterials7": 1
							},
							"time": 120
						},
						{
							"id": 1,
							"input": {
								"facilitymaterials1": 3,
								"sulfur": 20
							},
							"output": {
								"facilitymaterials6": 1
							},
							"time": 120
						},
						{
							"id": 2,
							"input": {
								"facilitymaterials1": 3,
								"components": 55,
								"facilityoil1": 6
							},
							"output": {
								"facilitymaterials2": 3
							},
							"time": 60,
							"power": -8
						}
					]
				},
				"engineering_station": {
					"name": "Engineering Station",
					"codeName": "EngineeringStation",
					"description": "An expanded workshop for manual process of delicate materials.",
					"hitArea": [
						{
							"shape": [ 63.03,-170.3,98.79,-139.39,-121.82,0,-114.55,-170.3 ]
						},
						{
							"shape": [ -136.36,50.3,28.48,143.64,26.67,199.39,-136.36,199.39 ]
						},
						{
							"shape": [ 90.91,-199.39,98.79,-139.39,63.03,-170.3,64.85,-198.18 ]
						},
						{
							"shape": [ 28.48,143.64,-136.36,50.3,84.24,99.39,84.24,143.64 ]
						},
						{
							"shape": [ 146.67,-181.82,144.24,-105.45,116.97,-138.79,116.97,-181.82 ]
						},
						{
							"shape": [ -121.82,0,-136.36,50.3,-153.33,43.64,-160.61,15.76,-145.45,-1.21 ]
						},
						{
							"shape": [ 84.24,99.39,-136.36,50.3,-121.82,0,144.24,-105.45,161.82,-104.24,161.82,99.39 ]
						},
						{
							"shape": [ 144.24,-105.45,-121.82,0,98.79,-139.39,116.97,-138.79 ]
						}
					],
					"icon": "game/Textures/UI/StructureIcons/FacilityEngineeringStationIcon.webp",
					"texture": "game/Textures/Structures/metalworks_factory_engineering_station.webp",
					"positionOffset": {
						"x": -70,
						"y": -29
					},
					"sockets": [
						{
							"id": 0,
							"name": "power",
							"type": [
								{
									"mask": 131072,
									"category": 1048576
								}
							],
							"x": 3.38,
							"y": 12.65,
							"rotation": 180
						},
						{
							"id": 2,
							"name": "pipein",
							"type": [
								{
									"mask": 16779264,
									"category": 16384
								}
							],
							"flow": "in",
							"x": 7.49,
							"y": 0.02,
							"rotation": 0
						},
						{
							"id": 3,
							"name": "pipein",
							"type": [
								{
									"mask": 16779264,
									"category": 16384
								}
							],
							"flow": "in",
							"x": 9.17,
							"y": 0.55,
							"rotation": 0
						}
					],
					"techId": "unlockfacilitytier3",
					"cost": {
						"facilitymaterials2": 150
					},
					"_productionLength": 3,
					"production": [
						{
							"id": 0,
							"input": {
								"facilitymaterials2": 3,
								"facilitycoal1": 200,
								"sulfur": 65,
								"facilityoil1": 35
							},
							"output": {
								"facilitymaterials3": 1
							},
							"time": 90,
							"power": -9
						},
						{
							"id": 1,
							"input": {
								"facilitymaterials2": 9,
								"facilitycoal1": 375,
								"facilityoil2": 90,
								"water": 100
							},
							"output": {
								"facilitymaterials3": 3
							},
							"time": 90,
							"power": -12
						},
						{
							"id": 2,
							"input": {
								"facilitymaterials3": 3,
								"facilitycoal1": 245,
								"facilitymaterials4": 10,
								"facilitymaterials5": 10
							},
							"output": {
								"facilitymaterials8": 1
							},
							"time": 120,
							"power": -8
						}
					]
				}
			}
		},
		"mgpillbox": {
			"name": "Machine Gun Pillbox",
			"codeName": "MGPillbox",
			"description": "A well-fortified bunker position fitted with a mounted machinegun. Garrisoned infantry will lay down heavy suppressive fire upon approaching enemies from a fixed angle.",
			"category": "defenses",
			"categoryOrder": 7,
			"range": {
				"type": "killboxMG",
				"lineOfSight": true,
				"arc": 45,
				"max": 30
			},
			"hitArea": [
				{
					"shape": [ 86.06,1.21,46.67,72.73,-46.67,72.73,-88.48,1.82,-44.24,-75.76,44.24,-75.76 ]
				}
			],
			"icon": "game/Textures/UI/StructureIcons/MGPillboxIcon.webp",
			"texture": "game/Textures/Structures/mgpillbox.webp",
			"techId": "unlockmgpillbox",
			"maxHealth": 650,
			"cost": {
				"cloth": 75
			},
			"repairCost": 75,
			"hasPipes": false,
			"currentGearPower" : 0
		},
		"oil_refinery": {
			"name": "Oil Refinery",
			"codeName": "FacilityRefineryOil",
			"description": "A refinery that processes Oil into other useful materials for the purposes of production and power generation.",
			"category": "factories",
			"categoryOrder": 35,
			"color": 2368548,
			"hitArea": [
				{
					"shape": [ 60.61,-122.73,66.06,73.03,55.15,97.88,-35.76,157.27,-39.39,-122.73 ]
				},
				{
					"shape": [ -43.03,-99.09,-39.39,-86.97,-35.76,157.27,-62.34,111.99,-59.39,-97.88,-50.91,-105.15 ]
				},
				{
					"shape": [ 24.85,-122.73,-4.24,-122.73,-4.24,-165.15,25.45,-165.15 ]
				},
				{
					"shape": [ -35.76,157.27,55.15,97.88,55.15,157.27 ]
				},
				{
					"shape": [ -65.63,113.38,-62.34,111.99,-35.76,157.27,-36.97,164.55,-65.45,164.55 ]
				},
				{
					"shape": [ 55.15,97.88,66.06,73.03,60.61,97.88 ]
				}
			],
			"icon": "game/Textures/UI/ItemIcons/OilRefineryBaseIcon.webp",
			"texture": "game/Textures/Structures/oil_refinery.webp",
			"power": -1,
			"sockets": [
				{
					"id": 0,
					"name": "power",
					"type": [
						{
							"mask": 131072,
							"category": 1048576
						}
					],
					"x": 2.41,
					"y": 1.41,
					"rotation": 0
				},
				{
					"id": 1,
					"name": "pipein",
					"type": [
						{
							"mask": 16779264,
							"category": 16384
						}
					],
					"flow": "in",
					"x": 0.5,
					"y": 10.45,
					"rotation": 180
				},
				{
					"id": 2,
					"name": "pipeout",
					"type": [
						{
							"mask": 16779264,
							"category": 16384
						}
					],
					"flow": "out",
					"x": 2.41,
					"y": 0.02,
					"rotation": 0
				}
			],
			"maxHealth": 3000,
			"cost": {
				"facilitymaterials1": 50
			},
			"repairCost": 150,
			"_productionLength": 1,
			"production": [
				{
					"id": 0,
					"input": {
						"oil": 150
					},
					"output": {
						"petrol": 150
					},
					"time": 150
				}
			],
			"upgrades": {
				"reformer": {
					"name": "Reformer",
					"codeName": "Reformer",
					"description": "A large processing drum that allows for the controlled introduction of hydrogen to yield a similar output of Petrol for less raw Oil. ",
					"hitArea": [
						{
							"shape": [ -5.45,-145.15,-39.39,-109.39,-39.39,-145.15 ]
						},
						{
							"shape": [ 24.85,-145.76,-5.45,-145.15,-4.24,-188.18,25.45,-188.18 ]
						},
						{
							"shape": [ -44.24,-123.33,-39.39,-109.39,-61.21,-109.39,-58.18,-122.73,-50.91,-128.18 ]
						},
						{
							"shape": [ 8.48,143.94,37.58,143.94,36.97,188.18,9.09,189.39 ]
						},
						{
							"shape": [ 37.58,143.94,64.24,96.06,60,144.55 ]
						},
						{
							"shape": [ -65.45,142.73,-61.21,-109.39,-39.39,-109.39,64.24,96.06,37.58,143.94 ]
						},
						{
							"shape": [ 24.85,-145.76,60,-145.15,64.24,96.06,-39.39,-109.39,-5.45,-145.15 ]
						}
					],
					"icon": "game/Textures/UI/StructureIcons/OilRefineryMod3Icon.webp",
					"texture": "game/Textures/Structures/oil_refinery_reformer.webp",
					"positionOffset": {
						"y": 75
					},
					"sockets": [
						{
							"id": 0,
							"name": "power",
							"type": [
								{
									"mask": 131072,
									"category": 1048576
								}
							],
							"x": 2.41,
							"y": 1.41,
							"rotation": 0
						},
						{
							"id": 1,
							"name": "pipein",
							"type": [
								{
									"mask": 16779264,
									"category": 16384
								}
							],
							"flow": "in",
							"x": 0.49,
							"y": 10.45,
							"rotation": 180
						},
						{
							"id": 2,
							"name": "pipeout",
							"type": [
								{
									"mask": 16779264,
									"category": 16384
								}
							],
							"flow": "out",
							"x": 2.41,
							"y": 0.02,
							"rotation": 0
						},
						{
							"id": 3,
							"name": "pipein",
							"type": [
								{
									"mask": 16779264,
									"category": 16384
								}
							],
							"flow": "in",
							"x": 2.82,
							"y": 11.88,
							"rotation": 180
						}
					],
					"cost": {
						"facilitymaterials1": 200
					},
					"_productionLength": 1,
					"production": [
						{
							"id": 0,
							"input": {
								"oil": 120,
								"water": 30
							},
							"output": {
								"petrol": 150
							},
							"time": 150
						}
					]
				},
				"cracking_unit": {
					"name": "Cracking Unit",
					"codeName": "CrackingUnit",
					"description": "A high-heat furnace that catalyses raw oil into refined Heavy Oil.",
					"hitArea": [
						{
							"shape": [ 60.61,-122.73,64.24,73.64,-35.76,148.79,-38.79,-122.73 ]
						},
						{
							"shape": [ -35.76,148.79,64.24,73.64,56.36,148.18 ]
						},
						{
							"shape": [ -43.03,-99.09,-44.24,-86.97,-58.79,-98.48,-50.91,-104.55 ]
						},
						{
							"shape": [ 25.45,-165.15,25.45,-122.73,-3.64,-122.73,-3.64,-165.76 ]
						},
						{
							"shape": [ -66.06,164.55,-44.24,-86.97,-38.79,-86.97,-35.76,148.79,-36.36,163.33 ]
						},
						{
							"shape": [ -44.24,-86.97,-66.06,164.55,-58.79,-98.48 ]
						}
					],
					"icon": "game/Textures/UI/StructureIcons/OilRefineryMod2Icon.webp",
					"texture": "game/Textures/Structures/oil_refinery_cracking_unit.webp",
					"positionOffset": {
						"x": -1
					},
					"sockets": [
						{
							"id": 0,
							"name": "power",
							"type": [
								{
									"mask": 131072,
									"category": 1048576
								}
							],
							"x": 2.41,
							"y": 1.41,
							"rotation": 0
						},
						{
							"id": 1,
							"name": "pipein",
							"type": [
								{
									"mask": 16779264,
									"category": 16384
								}
							],
							"flow": "in",
							"x": 0.5,
							"y": 10.45,
							"rotation": 180
						},
						{
							"id": 2,
							"name": "pipeout",
							"type": [
								{
									"mask": 16779264,
									"category": 16384
								}
							],
							"flow": "out",
							"x": 2.41,
							"y": 0.02,
							"rotation": 0
						}
					],
					"techId": "unlockfacilitytier2",
					"cost": {
						"facilitymaterials2": 20
					},
					"_productionLength": 1,
					"production": [
						{
							"id": 0,
							"input": {
								"oil": 150
							},
							"output": {
								"facilityoil1": 90
							},
							"time": 160,
							"power": -1.5
						}
					]
				},
				"petro_plant": {
					"name": "Petrochemical Plant",
					"codeName": "PetrochemicalPlant",
					"description": "A blast furnace that further refines Heavy Oil into an Enriched Oil needed for advanced processes.",
					"hitArea": [
						{
							"shape": [ 60.61,-122.73,64.85,74.24,56.36,146.97,27.14,147.55,-38.79,-86.97,-38.79,-122.73 ]
						},
						{
							"shape": [ 25.45,-122.73,-3.64,-122.73,-3.64,-165.15,26.06,-165.15 ]
						},
						{
							"shape": [ -66.06,164.55,-58.79,-100.3,-35.15,146.97,-36.36,163.33 ]
						},
						{
							"shape": [ -43.03,-100.3,-44.24,-86.97,-58.79,-100.3,-50.3,-104.55 ]
						},
						{
							"shape": [ -35.15,146.97,-58.79,-100.3,-44.24,-86.97,27.14,147.55,25.3,152.29,-27.88,153.03 ]
						},
						{
							"shape": [ 27.14,147.55,-44.24,-86.97,-38.79,-86.97 ]
						}
					],
					"icon": "game/Textures/UI/ItemIcons/OilRefineryPetrochemicalPlanetIcon.webp",
					"texture": "game/Textures/Structures/oil_refinery_petro_plant.webp",
					"positionOffset": {
						"x": -1
					},
					"sockets": [
						{
							"id": 0,
							"name": "power",
							"type": [
								{
									"mask": 131072,
									"category": 1048576
								}
							],
							"x": 2.41,
							"y": 1.41,
							"rotation": 0
						},
						{
							"id": 1,
							"name": "pipein",
							"type": [
								{
									"mask": 16779264,
									"category": 16384
								}
							],
							"flow": "in",
							"x": 0.5,
							"y": 10.45,
							"rotation": 180
						},
						{
							"id": 2,
							"name": "pipeout",
							"type": [
								{
									"mask": 16779264,
									"category": 16384
								}
							],
							"flow": "out",
							"x": 2.41,
							"y": 0.02,
							"rotation": 0
						}
					],
					"techId": "unlockfacilitytier3",
					"cost": {
						"facilitymaterials3": 25
					},
					"_productionLength": 1,
					"production": [
						{
							"id": 0,
							"input": {
								"sulfur": 60,
								"facilityoil1": 30
							},
							"output": {
								"facilityoil2": 30
							},
							"time": 200,
							"power": -6
						}
					]
				}
			}
		},
		"oil_well": {
			"name": "Oil Well",
			"codeName": "FacilityMineOil",
			"description": "Extracts fuel from Crude Oil Fields. Must be constructed nearby.",
			"category": "harvesters",
			"categoryOrder": 1,
			"color": 2368548,
			"icon": "game/Textures/UI/StructureIcons/OilWellMineIcon.webp",
			"texture": "game/Textures/Structures/oil_well.webp",
			"maxHealth": 1850,
			"cost": {
				"facilitymaterials1": 35
			},
			"repairCost": 100,
			"_productionLength": 1,
			"production": [
				{
					"id": 0,
					"output": {
						"oilcan": 1
					},
					"time": 50
				}
			],
			"productionScaling": false,
			"upgrades": {
				"electric_oil": {
					"name": "Electric Oil Well",
					"codeName": "Electric",
					"description": "A generator that leverages electricity to pump oil through attached pipes.",
					"hitArea": [
						{
							"shape": [ -50.91,-55.07,-49.09,-47.27,-44.85,57.58,-62.42,-47.27,-61.82,-54.55,-56.36,-58.79 ]
						},
						{
							"shape": [ 29.7,-72.73,0.61,-72.73,0.61,-117.58,30.3,-117.58 ]
						},
						{
							"shape": [ -44.85,120.61,-44.85,57.58,0.61,-72.73,74.55,-72.73,74.55,120.61 ]
						},
						{
							"shape": [ 0.61,-72.73,-44.85,57.58,-49.09,-47.27,-43.64,-72.73 ]
						},
						{
							"shape": [ -73.94,-47.27,-62.42,-47.27,-44.85,57.58,-73.94,57.58 ]
						}
					],
					"baseIcon": "game/Textures/UI/StructureIcons/FacilityElectricOilWellIcon.webp",
					"icon": "game/Textures/UI/StructureIcons/FacilityElectricOilWellIcon.webp",
					"texture": "game/Textures/Structures/oil_well_electric_oil.webp",
					"positionOffset": {
						"x": -50,
						"y": -79
					},
					"sockets": [
						{
							"id": 0,
							"name": "power",
							"type": [
								{
									"mask": 131072,
									"category": 1048576
								}
							],
							"x": 2.81,
							"y": 2.06,
							"rotation": 0
						},
						{
							"id": 1,
							"name": "pipeout",
							"type": [
								{
									"mask": 16779264,
									"category": 16384
								}
							],
							"flow": "out",
							"x": 2.81,
							"y": 0.02,
							"rotation": 0
						}
					],
					"techId": "unlockfacilitytier2",
					"cost": {
						"facilitymaterials2": 25
					},
					"_productionLength": 2,
					"production": [
						{
							"id": 0,
							"output": {
								"oilcan": 1
							},
							"time": 26,
							"power": -2
						},
						{
							"id": 1,
							"output": {
								"oil": 75
							},
							"time": 40,
							"power": -2
						}
					]
				},
				"fracking_oil": {
					"name": "Fracker",
					"codeName": "Fracker",
					"description": "A machine that opens up cracks in the earth by injecting water at a high pressure to increase the output of Crude Oil.",
					"hitArea": [
						{
							"shape": [ -58.79,120.61,-59.39,73.94,-13.94,-72.73,15.15,-72.73,60,-7.27,59.39,120 ]
						},
						{
							"shape": [ 15.15,-118.79,15.15,-72.73,-13.94,-72.73,-14.55,-118.79 ]
						},
						{
							"shape": [ 83.64,-118.18,81.21,-9.09,55.15,-72.73,55.15,-117.58 ]
						},
						{
							"shape": [ 60,-7.27,15.15,-72.73,55.15,-72.73,81.21,-9.09,70.91,-1.82 ]
						},
						{
							"shape": [ -77.81,70.09,-79.39,59.39,-70.91,47.88,-59.39,73.94,-69.7,76.36 ]
						},
						{
							"shape": [ -60,-56.36,-84.66,27.14,-83.64,-39.39,-72.12,-55.76 ]
						},
						{
							"shape": [ -13.94,-72.73,-60,-56.36,-58.18,-71.52 ]
						},
						{
							"shape": [ -84.66,27.14,-60,-56.36,-13.94,-72.73,-70.91,40,-79.13,36.36 ]
						},
						{
							"shape": [ -59.39,73.94,-70.91,47.88,-70.91,40,-13.94,-72.73 ]
						}
					],
					"baseIcon": "game/Textures/UI/StructureIcons/FacilityFrackerIcon.webp",
					"icon": "game/Textures/UI/StructureIcons/FacilityFrackerIcon.webp",
					"texture": "game/Textures/Structures/oil_well_fracking_oil.webp",
					"positionOffset": {
						"x": -2,
						"y": -79
					},
					"sockets": [
						{
							"id": 0,
							"name": "power",
							"type": [
								{
									"mask": 131072,
									"category": 1048576
								}
							],
							"x": 2.69,
							"y": 2.06,
							"rotation": 0
						},
						{
							"id": 1,
							"name": "pipeout",
							"type": [
								{
									"mask": 16779264,
									"category": 16384
								}
							],
							"flow": "out",
							"x": 2.68,
							"y": 0.02,
							"rotation": 0
						},
						{
							"id": 2,
							"name": "pipein",
							"type": [
								{
									"mask": 16779264,
									"category": 16384
								}
							],
							"flow": "in",
							"x": 4.85,
							"y": 0.03,
							"rotation": 0
						}
					],
					"techId": "unlockfacilitytier3",
					"cost": {
						"facilitymaterials3": 25
					},
					"_productionLength": 2,
					"production": [
						{
							"id": 0,
							"input": {
								"water": 25
							},
							"output": {
								"oilcan": 2
							},
							"time": 40,
							"power": -3
						},
						{
							"id": 1,
							"input": {
								"water": 25
							},
							"output": {
								"oil": 75
							},
							"time": 30,
							"power": -3
						}
					],
					"productionScaling": true
				}
			}
		},
		"oilfield": {
			"name": "Crude Oil Field",
			"codeName": "OilField",
			"description": "An Oil Field that can produce Oil for further refinement or for power production.",
			"category": "world",
			"categoryOrder": 21,
			"radius": 6,
			"icon": "game/Textures/UI/ItemIcons/Facilities/OilIcon.webp",
			"texture": "game/Textures/Structures/oilfield.webp",
			"maxHealth": 2147483647
		},
		"oiltankerc": {
			"name": "RR-3 “Stolon” Tanker.",
			"codeName": "OilTankerC",
			"description": "The “Stolon” Tanker is a heavier R-series rig designed to transport and distribute large quantities of Fuel.",
			"category": "vehicles",
			"categoryOrder": 3,
			"faction": "c",
			"sortLayer": "vehicle",
			"icon": "game/Textures/UI/VehicleIcons/OilTankerIcon.webp",
			"texture": "game/Textures/Vehicles/oiltankerc.webp"
		},
		"oiltankerw": {
			"name": "Dunne Fuelrunner 2d",
			"codeName": "OilTankerW",
			"description": "The Fuelrunner is a heavy Dunne rig designed to transport and distribute large quantities of Fuel.",
			"category": "vehicles",
			"categoryOrder": 4,
			"faction": "w",
			"sortLayer": "vehicle",
			"icon": "game/Textures/UI/VehicleIcons/OilTankerWarIcon.webp",
			"texture": "game/Textures/Vehicles/oiltankerw.webp"
		},
		"pipeline": {
			"name": "Pipeline",
			"codeName": "FacilityPipe",
			"description": "Industrial piping that allows for automatic transport of various liquids and fuels into a network of pipes that connect to various facility structures.",
			"category": "factories",
			"categoryOrder": 60,
			"sortLayer": "pipe",
			"hasHandle": true,
			"isBezier": true,
			"simpleBezier": true,
			"lineWidth": 10,
			"minLength": 3,
			"maxLength": 20,
			"icon": "game/Textures/UI/StructureIcons/PipelineSegmentIcon.webp",
			"texture": "game/Textures/Structures/pipeline.webp",
			"textureFrontCap": "game/Textures/Structures/pipeline_front.webp",
			"textureBackCap": "game/Textures/Structures/pipeline_back.webp",
			"canSnap": true,
			"sockets": [
				{
					"id": 0,
					"type": [
						{
							"mask": 16795648,
							"category": 2048
						}
					],
					"flow": "bi",
					"cap": "front",
					"rotation": 270
				},
				{
					"id": 1,
					"type": [
						{
							"mask": 16779264,
							"category": 16384
						}
					],
					"flow": "bi",
					"cap": "left",
					"rotation": 180
				},
				{
					"id": 2,
					"type": [
						{
							"mask": 16779264,
							"category": 16384
						}
					],
					"flow": "bi",
					"cap": "right",
					"rotation": 0
				},
				{
					"id": 3,
					"type": [
						{
							"mask": 16795648,
							"category": 2048
						}
					],
					"flow": "bi",
					"cap": "back",
					"rotation": 90
				}
			],
			"techId": "unlockfacilitytier2",
			"liquidCapacity": 100,
			"maxHealth": 350,
			"cost": {
				"pipematerials": 1
			},
			"repairCost": 15,
			"upgrades": {
				"insulation": {
					"name": "Insulated Pipe",
					"codeName": "Insulation",
					"description": "An insulating material to keep the pipe from freezing during harsh weather conditions.",
					"icon": "game/Textures/UI/StructureIcons/PipelineSegmentIcon.webp",
					"texture": "game/Textures/Structures/pipeline_insulated.webp",
					"cost": {
						"pipematerials": 1
					}
				}
			}
		},
		"pipeline_overhead": {
			"name": "Pipeline (Overhead)",
			"codeName": "FacilityPipeOverhead",
			"description": "Industrial piping that allows for automatic transport of various liquids and fuels. These specialized pipes can be built overhead to connect to pipe networks across areas with high traffic.",
			"category": "factories",
			"categoryOrder": 70,
			"sortLayer": "overhead",
			"hasHandle": true,
			"lineWidth": 10,
			"minLength": 8,
			"maxLength": 20,
			"icon": "game/Textures/UI/ItemIcons/OverheadPowelineIcon.webp",
			"texture": "game/Textures/Structures/pipeline_overhead.webp",
			"textureFrontCap": "game/Textures/Structures/pipeline_overhead_front.webp",
			"textureBackCap": "game/Textures/Structures/pipeline_overhead_back.webp",
			"canSnap": true,
			"sockets": [
				{
					"id": 0,
					"type": [
						{
							"mask": 268435456,
							"category": 268435456
						},
						{
							"mask": 16795648,
							"category": 2048
						}
					],
					"flow": "bi",
					"cap": "front",
					"rotation": 270
				},
				{
					"id": 1,
					"type": [
						{
							"mask": 268435456,
							"category": 268435456
						},
						{
							"mask": 16795648,
							"category": 2048
						}
					],
					"flow": "bi",
					"cap": "back",
					"rotation": 90
				}
			],
			"techId": "unlockfacilitytier2",
			"liquidCapacity": 100,
			"maxHealth": 350,
			"cost": {
				"pipematerials": 2
			},
			"repairCost": 15,
			"upgrades": {
				"insulation": {
					"name": "Insulated Pipe",
					"codeName": "Insulation",
					"description": "An insulating material to keep the pipe from freezing during harsh weather conditions.",
					"icon": "game/Textures/UI/ItemIcons/OverheadPowelineIcon.webp",
					"texture": "game/Textures/Structures/pipeline_overhead_insulated.webp",
					"cost": {
						"pipematerials": 1
					}
				}
			}
		},
		"pipeline_underground": {
			"name": "Pipeline (Underground)",
			"codeName": "FacilityPipeUnderground",
			"description": "Industrial piping that allows for automatic transport of various liquids and fuels. These specialized pipes can be built underground to connect to pipe networks across areas with high traffic.",
			"category": "factories",
			"categoryOrder": 65,
			"sortLayer": "pipe",
			"hasHandle": true,
			"isBezier": true,
			"lineWidth": 10,
			"minLength": 5,
			"maxLength": 20,
			"icon": "game/Textures/UI/StructureIcons/PipeIntersectionIcon.webp",
			"texture": null,
			"textureFrontCap": "game/Textures/Structures/pipeline_underground_front.webp",
			"textureBackCap": "game/Textures/Structures/pipeline_underground_back.webp",
			"garrisonSupplyMultiplier": 4,
			"canSnap": true,
			"sockets": [
				{
					"id": 0,
					"type": [
						{
							"mask": 16795648,
							"category": 2048
						}
					],
					"flow": "bi",
					"cap": "front",
					"rotation": 270
				},
				{
					"id": 1,
					"type": [
						{
							"mask": 16795648,
							"category": 2048
						}
					],
					"flow": "bi",
					"cap": "back",
					"rotation": 90
				}
			],
			"techId": "unlockfacilitytier2",
			"liquidCapacity": 100,
			"maxHealth": 350,
			"cost": {
				"pipematerials": 6
			},
			"repairCost": 15,
			"upgrades": {
				"insulation": {
					"name": "Insulated Pipe",
					"codeName": "Insulation",
					"description": "An insulating material to keep the pipe from freezing during harsh weather conditions.",
					"icon": "game/Textures/UI/StructureIcons/PipeIntersectionIcon.webp",
					"texture": null,
					"textureFrontCap": "game/Textures/Structures/pipeline_underground_front_insulated.webp",
					"textureBackCap": "game/Textures/Structures/pipeline_underground_back_insulated.webp",
					"cost": {
						"pipematerials": 1
					}
				}
			}
		},
		"pipeline_valve": {
			"name": "Pipeline Valve",
			"codeName": "FacilityPipeValve",
			"description": "A weighted valve that controls the rate of flow through a pipeline. Requires a Wrench.",
			"category": "factories",
			"categoryOrder": 75,
			"sortLayer": "pipe",
			"icon": "game/Textures/UI/ItemIcons/FacilityPipeValveIcon.webp",
			"texture": "game/Textures/Structures/pipeline_valve.webp",
			"canSnap": true,
			"sockets": [
				{
					"id": 0,
					"type": [
						{
							"mask": 18432,
							"category": 16777216
						}
					],
					"flow": "bi",
					"x": 0.02,
					"y": 0.48,
					"rotation": 270
				},
				{
					"id": 1,
					"type": [
						{
							"mask": 18432,
							"category": 16777216
						}
					],
					"flow": "bi",
					"x": 1.75,
					"y": 0.48,
					"rotation": 90
				}
			],
			"techId": "unlockfacilitytier2",
			"maxHealth": 350,
			"cost": {
				"pipematerials": 2
			},
			"repairCost": 15
		},
		"playerc": {
			"name": "Player (Colonial)",
			"description": "The Colonials are described as a faction of ingenuity and practicality. They are sometimes referred to as \"The Colonial Legion\" or \"Little Green Men\".",
			"category": "world",
			"categoryOrder": 50,
			"faction": "c",
			"sortLayer": "player",
			"icon": "game/Textures/UI/ItemIcons/Uniforms/SoldierUniformCIcon.webp",
			"texture": "game/Textures/playerc.webp"
		},
		"playerw": {
			"name": "Player (Warden)",
			"description": "The Wardens are described to be a nation of honor and tradition. They are the native inhabitants of the region where the game takes place.",
			"category": "world",
			"categoryOrder": 51,
			"faction": "w",
			"sortLayer": "player",
			"icon": "game/Textures/UI/ItemIcons/Uniforms/SoldierUniformWIcon.webp",
			"texture": "game/Textures/playerw.webp"
		},
		"power_box": {
			"name": "Power Switch",
			"codeName": "PowerBox",
			"description": "A power interface for manually disabling power in a circuit.",
			"category": "power",
			"categoryOrder": 1,
			"sortLayer": "power_pole",
			"icon": "game/Textures/UI/StructureIcons/FacilityPowerBoxIcon.webp",
			"texture": "game/Textures/Structures/power_box.webp",
			"sockets": [
				{
					"id": 0,
					"name": "power",
					"type": [
						{
							"mask": 131072,
							"category": 262144
						}
					],
					"x": 2.11,
					"y": 0.39,
					"rotation": 90,
					"connectionLimit": 4
				}
			],
			"maxHealth": 500,
			"cost": {
				"facilitymaterials1": 25
			},
			"repairCost": 5
		},
		"power_line": {
			"name": "Power Line",
			"codeName": "PowerLine",
			"description": "Conducts power between two Power Poles.",
			"category": "power",
			"categoryOrder": 2,
			"color": 0,
			"sortLayer": "power_line",
			"hasHandle": true,
			"hasOutline": false,
			"lineWidth": 5,
			"minLength": 0.1,
			"maxLength": 25,
			"icon": "game/Textures/UI/StructureIcons/PowelineIcon.webp",
			"texture": "game/Textures/Structures/power_line.webp",
			"garrisonSupplyMultiplier": 0,
			"canSnap": true,
			"canSnapRotate": true,
			"canSnapStructureType": false,
			"ignoreSnapSettings": true,
			"snapGrab": true,
			"requireConnection": true,
			"sockets": [
				{
					"id": 0,
					"name": "power",
					"type": [
						{
							"mask": 1441792,
							"category": 131072
						}
					],
					"cap": "front",
					"rotation": 270
				},
				{
					"id": 1,
					"name": "power",
					"type": [
						{
							"mask": 1441792,
							"category": 131072
						}
					],
					"cap": "back",
					"rotation": 270
				}
			],
			"cost": {
				"cloth": 1
			}
		},
		"power_pole": {
			"name": "Power Pole",
			"codeName": "PowerPole",
			"description": "Used to connect Power Lines. Up to 4 Power Lines can be attached to a single pole.",
			"category": "power",
			"sortLayer": "power_pole",
			"icon": "game/Textures/UI/StructureIcons/PowerLineB.webp",
			"texture": "game/Textures/Structures/power_pole.webp",
			"sockets": [
				{
					"id": 0,
					"name": "power",
					"type": [
						{
							"mask": 131072,
							"category": 262144
						}
					],
					"x": 0.13,
					"y": 0.13,
					"rotation": 270,
					"connectionLimit": 4
				}
			],
			"maxHealth": 250,
			"cost": {
				"cloth": 20
			},
			"repairCost": 5,
			"upgrades": {
				"lamp": {
					"name": "Lamp",
					"codeName": "Light",
					"description": "A light that illuminates the surrounding area. Requires at least a minimum amount of power to function.",
					"icon": "game/Textures/UI/StructureIcons/PowerPoleLightIcon.webp",
					"texture": "game/Textures/Structures/power_pole_lamp.webp",
					"positionOffset": {
						"x": 24
					},
					"sockets": [
						{
							"id": 0,
							"name": "power",
							"type": [
								{
									"mask": 131072,
									"category": 1048576
								}
							],
							"x": 0.13,
							"y": 0.2,
							"rotation": 270,
							"connectionLimit": 4
						}
					],
					"cost": {
						"facilitymaterials1": 5
					}
				}
			}
		},
		"power_station": {
			"name": "Power Station",
			"codeName": "FacilityPowerOil",
			"description": "A power plant that generates a large amount of electricity using Oil or Coal.",
			"category": "power",
			"categoryOrder": 4,
			"hitArea": [
				{
					"shape": [ 135.76,-92.42,5.45,-91.82,-44.85,-105.76,-44.85,-201.52,4.24,-217.88,136.36,-217.88,192.12,-201.52,192.12,-105.76 ]
				},
				{
					"shape": [ -76.97,156.06,-15.15,163.33,-15.76,210.61,-77.58,211.21 ]
				},
				{
					"shape": [ 136.97,211.21,135.76,163.33,198.79,156.06,198.79,210.61 ]
				},
				{
					"shape": [ -224.85,203.94,-226.06,-3.33,-209.09,-3.33,-102.42,10,-102.42,203.94 ]
				},
				{
					"shape": [ -102.42,10,-209.09,-3.33,-209.7,-45.76,-104.24,-45.15 ]
				},
				{
					"shape": [ -102.42,107.58,-102.42,10,-78.18,-38.48,200,-37.27,222.42,6.97,135.76,163.33,-15.15,163.33,-76.97,156.06 ]
				},
				{
					"shape": [ 135.76,163.33,222.42,6.97,223.03,108.18,198.79,156.06 ]
				}
			],
			"icon": "game/Textures/UI/StructureIcons/FacilityPowerOilIcon.webp",
			"texture": "game/Textures/Structures/power_station.webp",
			"power": 15,
			"sockets": [
				{
					"id": 0,
					"name": "pipein",
					"type": [
						{
							"mask": 2048,
							"category": 16384
						}
					],
					"flow": "in",
					"x": 8.84,
					"y": 12.4,
					"rotation": 180
				},
				{
					"id": 1,
					"name": "power",
					"type": [
						{
							"mask": 131072,
							"category": 1048576
						}
					],
					"x": 5.45,
					"y": 0.74,
					"rotation": 270
				}
			],
			"techId": "unlockfacilitytier2",
			"maxHealth": 2400,
			"cost": {
				"facilitymaterials2": 25
			},
			"repairCost": 100,
			"_productionLength": 2,
			"production": [
				{
					"id": 0,
					"input": {
						"oil": 50
					},
					"time": 90,
					"power": 10
				},
				{
					"id": 1,
					"input": {
						"coal": 30,
						"water": 1
					},
					"time": 90,
					"power": 10
				}
			],
			"productionScaling": false,
			"upgrades": {
				"sulfuric_reactor": {
					"name": "Sulfuric Reactor",
					"codeName": "SulfuricReactor",
					"description": "A reactor that combines Water with Heavy Oil or refined Coke, resulting in a more pure natural gas, which in turn is more efficient at generating power. Chunks of raw Sulfur are created as a byproduct.",
					"hitArea": [
						{
							"shape": [ 140,-102.42,11.52,-101.82,-38.79,-115.76,-38.79,-212.12,10.3,-227.88,141.82,-227.88,198.18,-212.12,197.58,-115.76 ]
						},
						{
							"shape": [ -220.61,-13.33,-203.64,-13.33,-96.36,193.33,-218.79,193.94 ]
						},
						{
							"shape": [ -96.36,193.33,-203.64,-13.33,-204.85,-55.76,-97.58,-55.15 ]
						},
						{
							"shape": [ 46.67,167.27,47.27,146.06,76.97,146.06,76.97,167.88 ]
						},
						{
							"shape": [ -70.3,199.39,-73.94,173.33,-71.52,120,9.7,146.06,20,164.24,12.73,209.09,-26.67,227.88,-53.33,220 ]
						},
						{
							"shape": [ 76.97,146.06,-84.24,107.27,-84.24,-13.33,-69.09,-52.73,183.03,-53.33,209.7,-13.33,210.3,107.27,184.85,146.67 ]
						},
						{
							"shape": [ 12.73,209.09,20,164.24,21.82,189.09 ]
						},
						{
							"shape": [ -26.67,227.88,12.73,209.09,-4.24,223.03 ]
						},
						{
							"shape": [ -71.52,120,-84.24,107.27,76.97,146.06,9.7,146.06 ]
						}
					],
					"icon": "game/Textures/UI/StructureIcons/FacilityPowerOilReactorIcon.webp",
					"texture": "game/Textures/Structures/power_station_sulfuric_reactor.webp",
					"positionOffset": {
						"x": -20,
						"y": 34
					},
					"sockets": [
						{
							"id": 0,
							"name": "pipein",
							"type": [
								{
									"mask": 16779264,
									"category": 16384
								}
							],
							"flow": "in",
							"x": 8.86,
							"y": 12.43,
							"rotation": 180
						},
						{
							"id": 1,
							"name": "power",
							"type": [
								{
									"mask": 131072,
									"category": 1048576
								}
							],
							"x": 5.45,
							"y": 0.74,
							"rotation": 270
						}
					],
					"techId": "unlockfacilitytier3",
					"cost": {
						"facilitymaterials3": 25
					},
					"_productionLength": 2,
					"production": [
						{
							"id": 0,
							"input": {
								"facilityoil1": 50
							},
							"output": {
								"sulfur": 5
							},
							"time": 120,
							"power": 16
						},
						{
							"id": 1,
							"input": {
								"facilitycoal1": 30,
								"water": 1
							},
							"output": {
								"sulfur": 5
							},
							"time": 120,
							"power": 16
						}
					]
				}
			}
		},
		"provisional_road": {
			"name": "Provisional Road",
			"codeName": "FacilityRoad",
			"description": "A temporary road used to enable vehicle access between main roads and remote bases.",
			"category": "foundations",
			"categoryOrder": 6,
			"sortLayer": "road",
			"hasHandle": true,
			"isBezier": true,
			"minLength": 9.01,
			"maxLength": 30,
			"icon": "game/Textures/UI/ItemIcons/FacilityRoadItemIcon.webp",
			"texture": "game/Textures/Structures/facilityroad.webp",
			"garrisonSupplyMultiplier": 3,
			"canSnap": true,
			"canSnapAlongBezier": true,
			"sockets": [
				{
					"id": 0,
					"type": [
						{
							"mask": 536870912,
							"category": 536870912
						},
						{
							"mask": 1073741824,
							"category": 536870912
						}
					],
					"cap": "front",
					"rotation": 270
				},
				{
					"id": 1,
					"type": [
						{
							"mask": 536870912,
							"category": 536870912
						},
						{
							"mask": 1073741824,
							"category": 536870912
						}
					],
					"cap": "back",
					"rotation": 90
				}
			],
			"maxHealth": 750,
			"cost": {
				"groundmaterials": 150
			},
			"repairCost": 50
		},
		"rail_large_crane": {
			"name": "Crane Railway Track",
			"codeName": "CraneRailTrackSpline",
			"description": "A segment of railway for heavy cranes. This type of railway can only be built on Foundations.",
			"category": "foundations",
			"categoryOrder": 11,
			"sortLayer": "rail",
			"hasHandle": true,
			"minLength": 5,
			"maxLength": 30,
			"icon": "game/Textures/UI/StructureIcons/CraneRailTrackIcon.webp",
			"texture": "game/Textures/Structures/rail_large_crane.webp",
			"canSnap": true,
			"sockets": [
				{
					"id": 0,
					"type": [
						{
							"mask": 8388608,
							"category": 8388608
						}
					],
					"cap": "front",
					"rotation": 270
				},
				{
					"id": 1,
					"type": [
						{
							"mask": 8388608,
							"category": 8388608
						}
					],
					"cap": "back",
					"rotation": 90
				}
			],
			"techId": "unlockfacilitytier3",
			"maxHealth": 750,
			"cost": {
				"facilitymaterials3": 3
			},
			"repairCost": 50
		},
		"rail_large_gauge": {
			"name": "Railway Track (Biarc)",
			"codeName": "RailTrackSplineBiarc",
			"description": "A segment of railway for train cars. Tracks can attach to or fork from existing railways to form complex networks.",
			"category": "foundations",
			"categoryOrder": 10,
			"sortLayer": "rail",
			"hasHandle": true,
			"isBezier": true,
			"minLength": 5,
			"maxLength": 30,
			"icon": "game/Textures/UI/StructureIcons/BiarcRailTrackIcon.webp",
			"texture": "game/Textures/Structures/rail_large_gauge.webp",
			"canSnap": true,
			"canSnapAlongBezier": true,
			"sockets": [
				{
					"id": 0,
					"name": "front",
					"type": [
						{
							"mask": 32768,
							"category": 32768
						},
						{
							"mask": 524288,
							"category": 32768
						}
					],
					"cap": "front",
					"rotation": 270
				},
				{
					"id": 1,
					"name": "back",
					"type": [
						{
							"mask": 32768,
							"category": 32768
						},
						{
							"mask": 524288,
							"category": 32768
						}
					],
					"cap": "back",
					"rotation": 90
				}
			],
			"maxHealth": 750,
			"cost": {
				"facilitymaterials2": 5
			},
			"repairCost": 50
		},
		"rail_small_gauge": {
			"name": "Small Gauge Railway Track (Biarc)",
			"codeName": "SmallRailTrackSplineBiarc",
			"description": "A segment of railway for small gauge train cars. Tracks can attach to or fork from existing railways to form complex networks.",
			"category": "foundations",
			"categoryOrder": 8,
			"sortLayer": "rail",
			"hasHandle": true,
			"isBezier": true,
			"minLength": 5,
			"maxLength": 30,
			"icon": "game/Textures/UI/StructureIcons/BiarcSmallRailTrackIcon.webp",
			"texture": "game/Textures/Structures/rail_small_gauge.webp",
			"canSnap": true,
			"canSnapAlongBezier": true,
			"sockets": [
				{
					"id": 0,
					"type": [
						{
							"mask": 2097152,
							"category": 2097152
						},
						{
							"mask": 4194304,
							"category": 2097152
						}
					],
					"cap": "front",
					"rotation": 270
				},
				{
					"id": 1,
					"type": [
						{
							"mask": 2097152,
							"category": 2097152
						},
						{
							"mask": 4194304,
							"category": 2097152
						}
					],
					"cap": "back",
					"rotation": 90
				}
			],
			"maxHealth": 750,
			"cost": {
				"facilitymaterials1": 25
			},
			"repairCost": 50
		},
		"relicbase1": {
			"name": "Relic Base",
			"codeName": "RelicBase1",
			"description": "An old fort. Players can spawn and stockpile items here.",
			"category": "world",
			"categoryOrder": 8,
			"baseGarrisonRadius": 150,
			"hitArea": [
				{
					"shape": [ -138.79,203.64,-98.18,236.36,-136.97,235.15 ]
				},
				{
					"shape": [ -98.18,-236.36,98.18,-236.97,135.76,-235.76,138.79,-207.27,138.79,203.64,-138.79,-203.64,-135.76,-234.55 ]
				},
				{
					"shape": [ 97.58,-297.58,98.18,-236.97,-98.18,-236.36,-97.58,-297.58 ]
				},
				{
					"shape": [ -98.18,236.36,98.18,244.24,98.18,296.97,-97.58,297.58 ]
				},
				{
					"shape": [ 130.3,235.76,109.09,239.39,138.79,203.64,138.79,229.09 ]
				},
				{
					"shape": [ -138.79,203.64,-144.24,-203.64,-138.79,-203.64,138.79,203.64,109.09,239.39,98.18,244.24,-98.18,236.36 ]
				},
				{
					"shape": [ -144.24,-203.64,-138.79,203.64,-144.24,203.64 ]
				},
				{
					"shape": [ 138.79,203.64,138.79,-207.27,144.24,-204.85,144.24,203.64 ]
				}
			],
			"icon": "game/Textures/UI/CustomIcons/RelicBase1Icon.webp",
			"texture": "game/Textures/Structures/relicbase1.webp",
			"cost": false
		},
		"resource_transfer_station": {
			"name": "Resource Transfer Station",
			"codeName": "FacilityResourceTransfer1",
			"description": "An open container marked for storing raw resources that can be transferred into and out of Facilities. Stockpiles may be public or reserved.",
			"category": "factories",
			"categoryOrder": 45,
			"color": 8186514,
			"icon": "game/Textures/UI/ItemIcons/MaterialTransferStationIcon.webp",
			"texture": "game/Textures/Structures/resource_transfer_station.webp",
			"maxHealth": 2200,
			"cost": {
				"facilitymaterials1": 35
			},
			"repairCost": 100
		},
		"resourcecontainer": {
			"name": "Resource Container",
			"codeName": "ResourceContainer",
			"description": "A container that can carry large quantities of resources and can be transported by certain vehicles.",
			"category": "shippables",
			"categoryOrder": 2,
			"sortLayer": "container",
			"icon": "game/Textures/UI/StructureIcons/ResourceContainerIcon.webp",
			"texture": "game/Textures/Structures/resourcecontainer.webp",
			"maxHealth": 600,
			"cost": {
				"cloth": 50
			},
			"repairCost": 50
		},
		"resourcefield": {
			"name": "Resource Field",
			"upgradeName": "Scrap Field",
			"description": "This is a resource field. This can be mined by a player or with a stationary harvester.",
			"category": "world",
			"categoryOrder": 20,
			"sortLayer": "resource",
			"radius": 15,
			"range": {
				"type": "resourceField",
				"min": 15,
				"max": 27
			},
			"icon": "game/Textures/UI/ItemIcons/SalvageIcon.webp",
			"texture": "game/Textures/Structures/scrap_field.webp",
			"maxHealth": 2147483647,
			"upgrades": {
				"resourcefield": {
					"name": "Scrap Field",
					"reference": "resourcefield"
				},
				"component": {
					"name": "Component Field",
					"baseIcon": "game/Textures/UI/ItemIcons/ComponentsIcon.webp",
					"icon": "game/Textures/UI/ItemIcons/ComponentsIcon.webp",
					"texture": "game/Textures/Structures/component_field.webp"
				},
				"coal": {
					"name": "Coal Field",
					"baseIcon": "game/Textures/UI/ItemIcons/CoalIcon.webp",
					"icon": "game/Textures/UI/ItemIcons/CoalIcon.webp",
					"texture": "game/Textures/Structures/coal_field.webp"
				},
				"sulfur": {
					"name": "Sulfur Field",
					"baseIcon": "game/Textures/UI/ItemIcons/SulfurIcon.webp",
					"icon": "game/Textures/UI/ItemIcons/SulfurIcon.webp",
					"texture": "game/Textures/Structures/sulfur_field.webp"
				}
			}
		},
		"riflepillbox": {
			"name": "Rifle Pillbox",
			"codeName": "RiflePillbox",
			"description": "A reinforced dugout that gives the garrisoned rifle infantry a fortified defensive position to fire on approaching enemies from relative safety.",
			"category": "defenses",
			"categoryOrder": 6,
			"range": {
				"type": "killbox",
				"lineOfSight": true,
				"min": 3.5,
				"max": 25
			},
			"hitArea": [
				{
					"shape": [ 43.03,-75.45,88.48,-5.15,41.82,74.85,-43.03,76.06,-89.09,5.76,-46.67,-73.64 ]
				}
			],
			"icon": "game/Textures/UI/StructureIcons/RiflePillboxIcon.webp",
			"texture": "game/Textures/Structures/riflepillbox.webp",
			"maxHealth": 400,
			"cost": {
				"cloth": 60
			},
			"repairCost": 60
		},
		"sandbaghalfspline": {
			"name": "Sandbag Cover",
			"codeName": "SandbagHalfSpline",
			"description": "A defensive wall that hinders enemy movement and provides cover during combat.",
			"category": "defenses",
			"hasHandle": true,
			"isBezier": true,
			"simpleBezier": true,
			"minLength": 4.2,
			"maxLength": 10,
			"icon": "game/Textures/UI/StructureIcons/SandbagsStructureIcon.webp",
			"texture": "game/Textures/Structures/sandbaghalfspline.webp",
			"canSnap": true,
			"sockets": [
				{
					"id": 0,
					"type": [
						{
							"mask": 4609,
							"category": 1
						}
					],
					"cap": "front",
					"rotation": 270
				},
				{
					"id": 1,
					"type": [
						{
							"mask": 4609,
							"category": 1
						}
					],
					"cap": "back",
					"rotation": 90
				}
			],
			"maxHealth": 700,
			"cost": {
				"sandbagmaterials": 3
			},
			"repairCost": 10,
			"upgrades": {
				"sandbagfullspline": {
					"name": "Sandbag Wall",
					"codeName": "SandbagFullSpline",
					"description": "A defensive wall that hinders enemy movement and provides cover during combat.",
					"minLength": 4.2,
					"maxLength": 10,
					"texture": "game/Textures/Structures/sandbagfullspline.webp",
					"cost": {
						"sandbagmaterials": 3
					},
					"maxHealth": 1600,
					"repairCost": 30
				}
			}
		},
		"scrapmine": {
			"name": "Salvage Mine",
			"codeName": "ScrapMine",
			"description": "An old mine that automatically gathers Salvage using Fuel.",
			"category": "world",
			"icon": "game/Textures/UI/StructureIcons/ScrapMineIcon.webp",
			"texture": "game/Textures/Structures/scrapmine.webp",
			"maxHealth": 1000,
			"cost": false,
			"repairCost": 200
		},
		"shippingcontainer": {
			"name": "Shipping Container",
			"codeName": "ShippingContainer",
			"description": "A container for shipping very large quantities of Crates using Crane loaded vehicles. This type of container can only be unloaded at Storage Depots and Seaports.",
			"category": "shippables",
			"categoryOrder": 3,
			"sortLayer": "container",
			"icon": "game/Textures/UI/StructureIcons/ShippingContainerStructureIcon.webp",
			"texture": "game/Textures/Structures/shippingcontainer.webp",
			"maxHealth": 1000,
			"cost": {
				"cloth": 100
			},
			"repairCost": 100
		},
		"smalltraindump": {
			"name": "BMS Railtruck",
			"codeName": "SmallTrainDump",
			"description": "A small gauge container car for transporting raw materials. ",
			"category": "trains",
			"categoryOrder": 3,
			"sortLayer": "vehicle",
			"icon": "game/Textures/UI/VehicleIcons/SmallGaugeResourceCarVehicleIcon.webp",
			"texture": "game/Textures/Vehicles/smalltraindump.webp",
			"sockets": [
				{
					"id": 0,
					"type": "smalltraincar",
					"x": 4.22,
					"y": 1.08,
					"rotation": 90
				},
				{
					"id": 1,
					"type": "smalltraincar",
					"x": 0,
					"y": 1.08,
					"rotation": 270
				}
			],
			"vehicle": {
				"type": "smalltrain",
				"track": "rail_small_gauge",
				"mass": 10
			}
		},
		"smalltrainengine": {
			"name": "BMS Mineseeker",
			"codeName": "SmallTrainEngine",
			"description": "The Mineseeker is the Bassett Motor Society’s mechanized mule. This small 0-4-0 locomotive can haul tonnes of weight over short distances with little overhead. Ideal for a mining operation or short-range supply chains. ",
			"category": "trains",
			"categoryOrder": 1,
			"sortLayer": "vehicle",
			"icon": "game/Textures/UI/VehicleIcons/SmallGaugeEngineVehicleIcon.webp",
			"texture": "game/Textures/Vehicles/smalltrainengine.webp",
			"sockets": [
				{
					"id": 0,
					"type": "smalltraincar",
					"x": 4.22,
					"y": 0.85,
					"rotation": 90
				},
				{
					"id": 1,
					"type": "smalltraincar",
					"x": 0,
					"y": 0.85,
					"rotation": 270
				}
			],
			"vehicle": {
				"type": "smalltrain",
				"track": "rail_small_gauge",
				"engine": true,
				"mass": 500,
				"maxSpeed": 2
			}
		},
		"smalltrainfuelcontainer": {
			"name": "BMS Tinderbox",
			"codeName": "SmallTrainFuelContainer",
			"description": "The Tinderbox is a simple car used for transporting liquids between facilities.",
			"category": "trains",
			"categoryOrder": 4,
			"sortLayer": "vehicle",
			"icon": "game/Textures/UI/VehicleIcons/SmallTrainFuelContainerIcon.webp",
			"texture": "game/Textures/Vehicles/smalltrainfuelcontainer.webp",
			"sockets": [
				{
					"id": 0,
					"type": "smalltraincar",
					"x": 4.43,
					"y": 1.07,
					"rotation": 90
				},
				{
					"id": 1,
					"type": "smalltraincar",
					"x": 0.3,
					"y": 1.07,
					"rotation": 270
				}
			],
			"vehicle": {
				"type": "smalltrain",
				"track": "rail_small_gauge",
				"mass": 10
			}
		},
		"smalltrainresourceplatform": {
			"name": "BMS Linerunner",
			"codeName": "SmallTrainResourcePlatform",
			"description": "A low profile flatbed car for transporting large resources and munitions over short distances on small gauge tracks.",
			"category": "trains",
			"categoryOrder": 2,
			"sortLayer": "vehicle",
			"icon": "game/Textures/UI/VehicleIcons/SmallGaugeFlatbedCarVehicleIcon.webp",
			"texture": "game/Textures/Vehicles/smalltrainresourceplatform.webp",
			"sockets": [
				{
					"id": 0,
					"type": "smalltraincar",
					"x": 4.07,
					"y": 1.09,
					"rotation": 90
				},
				{
					"id": 1,
					"type": "smalltraincar",
					"x": 0,
					"y": 1.09,
					"rotation": 270
				}
			],
			"vehicle": {
				"type": "smalltrain",
				"track": "rail_small_gauge",
				"mass": 10
			}
		},
		"sound_test": {
			"name": "Sus",
			"category": "world",
			"hideInList": true,
			"width": 2,
			"length": 2,
			"texture": {
				"sheet": "sus.png",
				"speed": 0.132,
				"width": 220,
				"height": 184,
				"border": false
			}
		},
		"stationary_harvester_coal": {
			"name": "Stationary Harvester (Coal)",
			"codeName": "FacilityMineResource4",
			"description": "A stationary harvester that automatically gathers Coal. Requires Petrol. ",
			"category": "harvesters",
			"categoryOrder": 4,
			"hitArea": [
				{
					"shape": [ 11.52,-124.85,15.76,-93.33,-18.79,-93.33,-14.55,-124.85 ]
				},
				{
					"shape": [ -15.57,116.5,-21.21,104.24,17.58,104.24,12.12,116.36,-1.82,124.85 ]
				},
				{
					"shape": [ -76.97,9.09,-49.09,9.09,17.58,104.24,-21.21,104.24,-76.97,101.21 ]
				},
				{
					"shape": [ 46.06,116.36,45.45,104.24,75.76,64.85,75.76,116.97 ]
				},
				{
					"shape": [ 45.45,-93.33,17.58,104.24,-49.09,9.09,-49.09,-93.33 ]
				},
				{
					"shape": [ 65.45,24.24,70.91,36.36,70.91,64.24,17.58,104.24,44.85,14.55,57.58,16.97 ]
				},
				{
					"shape": [ 17.58,104.24,70.91,64.24,75.76,64.85,45.45,104.24 ]
				},
				{
					"shape": [ 17.58,104.24,44.85,-88.48,44.85,14.55 ]
				}
			],
			"icon": "game/Textures/UI/StructureIcons/FacilityMineResource4Icon.webp",
			"texture": "game/Textures/Structures/stationary_harvester.webp",
			"sockets": [
				{
					"id": 0,
					"name": "pipein",
					"type": [
						{
							"mask": 2048,
							"category": 16384
						}
					],
					"flow": "in",
					"x": 4.33,
					"y": 7.62,
					"rotation": 180
				}
			],
			"techId": "unlockfacilitytier2",
			"maxHealth": 1850,
			"cost": {
				"facilitymaterials2": 25
			},
			"repairCost": 100,
			"_productionLength": 1,
			"production": [
				{
					"id": 0,
					"input": {
						"petrol": 1
					},
					"output": {
						"coal": 50
					},
					"time": 12
				}
			]
		},
		"stationary_harvester_components": {
			"name": "Stationary Harvester (Components)",
			"codeName": "FacilityMineResource2",
			"description": "A stationary harvester that automatically gathers Components. Requires Petrol.",
			"category": "harvesters",
			"categoryOrder": 3,
			"hitArea": [
				{
					"shape": [ 11.52,-124.85,15.76,-93.33,-18.79,-93.33,-14.55,-124.85 ]
				},
				{
					"shape": [ -15.57,116.5,-21.21,104.24,17.58,104.24,12.12,116.36,-1.82,124.85 ]
				},
				{
					"shape": [ -76.97,9.09,-49.09,9.09,17.58,104.24,-21.21,104.24,-76.97,101.21 ]
				},
				{
					"shape": [ 46.06,116.36,45.45,104.24,75.76,64.85,75.76,116.97 ]
				},
				{
					"shape": [ 45.45,-93.33,17.58,104.24,-49.09,9.09,-49.09,-93.33 ]
				},
				{
					"shape": [ 65.45,24.24,70.91,36.36,70.91,64.24,17.58,104.24,44.85,14.55,57.58,16.97 ]
				},
				{
					"shape": [ 17.58,104.24,70.91,64.24,75.76,64.85,45.45,104.24 ]
				},
				{
					"shape": [ 17.58,104.24,44.85,-88.48,44.85,14.55 ]
				}
			],
			"icon": "game/Textures/UI/StructureIcons/FacilityMineResource2Icon.webp",
			"texture": "game/Textures/Structures/stationary_harvester.webp",
			"sockets": [
				{
					"id": 0,
					"name": "pipein",
					"type": [
						{
							"mask": 2048,
							"category": 16384
						}
					],
					"flow": "in",
					"x": 4.33,
					"y": 7.62,
					"rotation": 180
				}
			],
			"maxHealth": 1850,
			"cost": {
				"facilitymaterials1": 175
			},
			"repairCost": 100,
			"_productionLength": 1,
			"production": [
				{
					"id": 0,
					"input": {
						"petrol": 4
					},
					"output": {
						"components": 6
					},
					"time": 12
				}
			],
			"upgrades": {
				"excavator": {
					"name": "Excavator",
					"codeName": "Excavator",
					"description": "An excavator that allows for the mining of Damaged Components when a Component Field is depleted",
					"hitArea": [
						{
							"shape": [ 14.55,-124.85,18.79,-93.33,-15.76,-93.33,-11.52,-124.85 ]
						},
						{
							"shape": [ -78.18,5.45,-46.06,4.85,-18.18,104.85,-78.18,104.85 ]
						},
						{
							"shape": [ 49.09,116.36,48.48,104.24,73.94,64.24,79.39,64.85,78.79,116.97 ]
						},
						{
							"shape": [ 1.21,123.03,-10.91,118.18,-18.18,104.85,-46.06,4.85,18.79,-93.33,47.88,14.55,20.61,104.24,14.55,117.58 ]
						},
						{
							"shape": [ 18.79,-93.33,-46.06,4.85,-46.06,-93.33 ]
						},
						{
							"shape": [ 73.1,36.39,73.94,64.24,48.48,104.24,20.61,104.24,47.88,14.55,60.61,16.97,70.91,26.06 ]
						},
						{
							"shape": [ 47.88,-88.48,18.79,-93.33,48.48,-93.33 ]
						},
						{
							"shape": [ 47.88,14.55,18.79,-93.33,47.88,-88.48 ]
						}
					],
					"baseIcon": "game/Textures/UI/CustomIcons/FacilityMineResource2ExcavatorIcon.webp",
					"icon": "game/Textures/UI/StructureIcons/FacilityExcavatorIcon.webp",
					"texture": "game/Textures/Structures/stationary_harvester_components_excavator.webp",
					"positionOffset": {
						"x": -10
					},
					"sockets": [
						{
							"id": 0,
							"name": "pipein",
							"type": [
								{
									"mask": 16779264,
									"category": 16384
								}
							],
							"flow": "in",
							"x": 4.51,
							"y": 7.62,
							"rotation": 180
						}
					],
					"techId": "unlockfacilitytier2",
					"cost": {
						"facilitymaterials2": 75
					},
					"_productionLength": 1,
					"production": [
						{
							"id": 0,
							"input": {
								"petrol": 6
							},
							"output": {
								"facilitycomponents1": 9
							},
							"time": 12
						}
					]
				}
			}
		},
		"stationary_harvester_scrap": {
			"name": "Stationary Harvester (Scrap)",
			"codeName": "FacilityMineResource1",
			"description": "A stationary harvester that automatically gathers Salvage. Requires Petrol. ",
			"category": "harvesters",
			"categoryOrder": 2,
			"hitArea": [
				{
					"shape": [ 11.52,-124.85,15.76,-93.33,-18.79,-93.33,-14.55,-124.85 ]
				},
				{
					"shape": [ -15.57,116.5,-21.21,104.24,17.58,104.24,12.12,116.36,-1.82,124.85 ]
				},
				{
					"shape": [ -76.97,9.09,-49.09,9.09,17.58,104.24,-21.21,104.24,-76.97,101.21 ]
				},
				{
					"shape": [ 46.06,116.36,45.45,104.24,75.76,64.85,75.76,116.97 ]
				},
				{
					"shape": [ 45.45,-93.33,17.58,104.24,-49.09,9.09,-49.09,-93.33 ]
				},
				{
					"shape": [ 65.45,24.24,70.91,36.36,70.91,64.24,17.58,104.24,44.85,14.55,57.58,16.97 ]
				},
				{
					"shape": [ 17.58,104.24,70.91,64.24,75.76,64.85,45.45,104.24 ]
				},
				{
					"shape": [ 17.58,104.24,44.85,-88.48,44.85,14.55 ]
				}
			],
			"icon": "game/Textures/UI/StructureIcons/FacilityMineResource1Icon.webp",
			"texture": "game/Textures/Structures/stationary_harvester.webp",
			"sockets": [
				{
					"id": 0,
					"name": "pipein",
					"type": [
						{
							"mask": 2048,
							"category": 16384
						}
					],
					"flow": "in",
					"x": 4.33,
					"y": 7.62,
					"rotation": 180
				}
			],
			"maxHealth": 1850,
			"cost": {
				"facilitymaterials1": 150
			},
			"repairCost": 100,
			"_productionLength": 1,
			"production": [
				{
					"id": 0,
					"input": {
						"petrol": 4
					},
					"output": {
						"metal": 50
					},
					"time": 12
				}
			]
		},
		"stationary_harvester_sulfur": {
			"name": "Stationary Harvester (Sulfur)",
			"codeName": "FacilityMineResource3",
			"description": "A stationary harvester that automatically gathers Sulfur using Heavy Oil as fuel.",
			"category": "harvesters",
			"categoryOrder": 5,
			"hitArea": [
				{
					"shape": [ 11.52,-124.85,15.76,-93.33,-18.79,-93.33,-14.55,-124.85 ]
				},
				{
					"shape": [ -15.57,116.5,-21.21,104.24,17.58,104.24,12.12,116.36,-1.82,124.85 ]
				},
				{
					"shape": [ -76.97,9.09,-49.09,9.09,17.58,104.24,-21.21,104.24,-76.97,101.21 ]
				},
				{
					"shape": [ 46.06,116.36,45.45,104.24,75.76,64.85,75.76,116.97 ]
				},
				{
					"shape": [ 45.45,-93.33,17.58,104.24,-49.09,9.09,-49.09,-93.33 ]
				},
				{
					"shape": [ 65.45,24.24,70.91,36.36,70.91,64.24,17.58,104.24,44.85,14.55,57.58,16.97 ]
				},
				{
					"shape": [ 17.58,104.24,70.91,64.24,75.76,64.85,45.45,104.24 ]
				},
				{
					"shape": [ 17.58,104.24,44.85,-88.48,44.85,14.55 ]
				}
			],
			"icon": "game/Textures/UI/StructureIcons/FacilityMineResource3Icon.webp",
			"texture": "game/Textures/Structures/stationary_harvester.webp",
			"sockets": [
				{
					"id": 0,
					"name": "pipein",
					"type": [
						{
							"mask": 2048,
							"category": 16384
						}
					],
					"flow": "in",
					"x": 4.33,
					"y": 7.62,
					"rotation": 180
				}
			],
			"techId": "unlockfacilitytier3",
			"maxHealth": 1850,
			"cost": {
				"facilitymaterials3": 20
			},
			"repairCost": 100,
			"_productionLength": 1,
			"production": [
				{
					"id": 0,
					"input": {
						"facilityoil1": 4
					},
					"output": {
						"sulfur": 6
					},
					"time": 12
				}
			]
		},
		"sulfurmine": {
			"name": "Sulfur Mine",
			"codeName": "SulfurMine",
			"description": "An old mine that automatically gathers Sulfur using Fuel.",
			"category": "world",
			"icon": "game/Textures/UI/StructureIcons/SulfurMineStructureIcon.webp",
			"texture": "game/Textures/Structures/sulfurmine.webp",
			"maxHealth": 1000,
			"cost": false,
			"repairCost": 200
		},
		"tankstop": {
			"name": "Tank Trap",
			"codeName": "TankStop",
			"description": "An anti-tank obstacle that prevents vehicle access to an area. Can be dismantled with a Wrench.",
			"category": "defenses",
			"categoryOrder": 9,
			"radius": 1.75,
			"hitArea": [
				{
					"shape": [ 18.25,1.44,11.88,-8.73,39.7,-10.3,39.7,-0.61 ]
				},
				{
					"shape": [ 13.64,10.3,-0.76,7.09,-5.15,4.85,8.18,-14.55,18.25,1.44 ]
				},
				{
					"shape": [ -2.12,-18.79,-9.39,-7.27,-23.94,-35.76,-14.24,-40.61 ]
				},
				{
					"shape": [ -28.79,19.39,-19.09,4.85,-9.39,-7.27,8.18,-14.55,-5.15,4.85,-19.7,23.64,-25.47,23.34 ]
				},
				{
					"shape": [ 8.18,-14.55,-9.39,-7.27,-2.12,-18.79,15.45,-41.82,24.55,-37.58 ]
				},
				{
					"shape": [ -38.48,-3.03,-9.39,-7.27,-19.09,4.85,-37.88,6.67,-39.92,1.68 ]
				},
				{
					"shape": [ 19.7,42.42,-0.76,7.09,13.64,10.3,28.18,37.58 ]
				}
			],
			"icon": "game/Textures/UI/StructureIcons/TankStopIcon.webp",
			"texture": "game/Textures/Structures/tankstop.webp",
			"techId": "unlocktankstop",
			"maxHealth": 2000,
			"cost": {
				"metalbeammaterials": 3
			},
			"repairCost": 25
		},
		"tankstopsplinet3": {
			"name": "Dragon's Teeth",
			"codeName": "TankStopSplineT3",
			"description": "An anti-tank obstacle that prevents vehicle access to an area, and is resistant to most types of damage.",
			"category": "defenses",
			"experimental": true,
			"hasHandle": true,
			"isBezier": true,
			"minLength": 3.75,
			"maxLength": 15.05,
			"icon": "game/Textures/UI/StructureIcons/TankStopT3Icon.webp",
			"texture": "game/Textures/Structures/tankstopsplinet3.webp",
			"techId": "unlocktankstopsplinetier3",
			"maxHealth": 3000,
			"cost": {
				"concrete": 10
			},
			"repairCost": 150
		},
		"townbase3": {
			"name": "Town Base",
			"codeName": "TownBase3",
			"description": "A garrisoned focal building vital for the defence of a town. Players can spawn and stockpile items here.",
			"category": "world",
			"categoryOrder": 9,
			"baseGarrisonRadius": 150,
			"hitArea": [
				{
					"shape": [ -178.79,-196.36,-234.55,-192.73,-235.76,-233.94,-232.12,-245.45,-178.18,-244.85 ]
				},
				{
					"shape": [ 191.52,63.03,249.09,61.82,247.27,111.52,190.91,111.52 ]
				},
				{
					"shape": [ -280.61,-192.12,-292.73,-106.67,-288.48,-204.24,-281.21,-204.85 ]
				},
				{
					"shape": [ -36.36,121.82,-286.06,-33.33,-300,-104.24,175.15,61.21,175.15,121.21 ]
				},
				{
					"shape": [ 191.52,63.03,286.06,-33.33,286.06,60.61 ]
				},
				{
					"shape": [ -141.82,213.33,-107.88,121.21,-107.88,213.33 ]
				},
				{
					"shape": [ 286.67,-106.06,35.15,-192.12,284.85,-195.76 ]
				},
				{
					"shape": [ -240,246.06,-259.39,213.33,-286.06,121.21,-286.06,-33.33,-107.88,121.21,-141.82,213.33,-158.79,246.06 ]
				},
				{
					"shape": [ -286.06,121.21,-259.39,213.33,-285.45,213.33 ]
				},
				{
					"shape": [ 35.15,-192.12,-36.36,-192.12,-36.97,-205.45,33.94,-207.88 ]
				},
				{
					"shape": [ 286.06,-33.33,300,-105.45,301.21,-35.15 ]
				},
				{
					"shape": [ 191.52,63.03,175.15,61.21,-300,-104.24,-292.73,-106.67,286.67,-106.06,300,-105.45,286.06,-33.33 ]
				},
				{
					"shape": [ -35.76,135.15,-36.36,121.82,35.15,121.82,35.15,135.15 ]
				},
				{
					"shape": [ -300,-104.24,-286.06,-33.33,-298.18,-32.73 ]
				},
				{
					"shape": [ -286.06,-33.33,-36.36,121.82,-107.88,121.21 ]
				},
				{
					"shape": [ -234.55,-192.73,-292.73,-106.67,-280.61,-192.12 ]
				},
				{
					"shape": [ -178.79,-196.36,-36.36,-192.12,286.67,-106.06,-292.73,-106.67,-234.55,-192.73 ]
				},
				{
					"shape": [ 286.67,-106.06,-36.36,-192.12,35.15,-192.12 ]
				}
			],
			"icon": "game/Textures/UI/CustomIcons/TownBase3Icon.webp",
			"texture": "game/Textures/Structures/townbase3.webp",
			"cost": false
		},
		"townclargegarrisongs1": {
			"name": "Safe House",
			"codeName": "TownCLargeGarrisonGS1",
			"description": "A world base that players can respawn and rearm at. It can be destroyed and rebuilt to be claimed by a faction. It has garrison upgrades to supply local structures with garrison supplies.",
			"category": "world",
			"categoryOrder": 10,
			"baseGarrisonRadius": 150,
			"hitArea": [
				{
					"shape": [ -233.64,13.94,-33.03,-253.94,79.7,109.09,79.09,266.67,-232.42,266.67 ]
				},
				{
					"shape": [ -33.03,-253.94,-233.64,13.94,-246.36,13.94,-245.76,-254.55 ]
				},
				{
					"shape": [ 237.88,109.7,156.67,109.09,79.7,-203.64,237.27,-203.64 ]
				},
				{
					"shape": [ 79.7,-203.64,-17.27,-266.06,54.74,-256.75,79.7,-242.42 ]
				},
				{
					"shape": [ 91.82,123.64,91.82,109.09,156.67,109.09,156.67,123.64 ]
				},
				{
					"shape": [ 79.7,109.09,-33.03,-253.94,-17.27,-266.06,79.7,-203.64,156.67,109.09 ]
				}
			],
			"icon": "game/Textures/UI/CustomIcons/SafeHouseIcon.webp",
			"texture": "game/Textures/Structures/townclargegarrisongs1.webp",
			"cost": false
		},
		"traincaboose": {
			"name": "BMS Roadhouse",
			"codeName": "TrainCaboose",
			"description": "A simple caboose that allows rail crews to maintain tracks more efficiently.",
			"category": "trains",
			"categoryOrder": 11,
			"sortLayer": "vehicle",
			"icon": "game/Textures/UI/VehicleIcons/TrainCabooseItemIcon.webp",
			"texture": "game/Textures/Vehicles/traincaboose.webp",
			"sockets": [
				{
					"id": 0,
					"type": "traincar",
					"x": 9.55,
					"y": 1.76,
					"rotation": 90
				},
				{
					"id": 1,
					"type": "traincar",
					"x": 0,
					"y": 1.76,
					"rotation": 270
				}
			],
			"vehicle": {
				"type": "train",
				"track": "rail_large_gauge",
				"mass": 25
			},
			"techId": "unlockfacilitytier2"
		},
		"traincoal": {
			"name": "BMS Rockhold",
			"codeName": "TrainCoal",
			"description": "A container car for transporting coal to refuel trains over long-distance trips. ",
			"category": "trains",
			"categoryOrder": 5,
			"sortLayer": "vehicle",
			"icon": "game/Textures/UI/VehicleIcons/TrainCoalCarVehicleIcon.webp",
			"texture": "game/Textures/Vehicles/traincoal.webp",
			"sockets": [
				{
					"id": 0,
					"type": "traincar",
					"x": 5.76,
					"y": 1.87,
					"rotation": 90
				},
				{
					"id": 1,
					"type": "traincar",
					"x": 0,
					"y": 1.87,
					"rotation": 270
				}
			],
			"vehicle": {
				"type": "train",
				"track": "rail_large_gauge",
				"mass": 25
			},
			"techId": "unlockfacilitytier2"
		},
		"traincombatcarc": {
			"name": "Aegis Steelbreaker K5a",
			"codeName": "TrainCombatCarC",
			"description": "Known across the colonies as King of the Rails, this heavily armoured train car is designed to protect and exert dominance over contested rail lines, especially when transporting supplies into contested territory as well as safely transporting infantry. This armoured beast boasts a forward facing cannon, as well as heavy lateral guns.",
			"category": "trains",
			"categoryOrder": 8,
			"faction": "c",
			"sortLayer": "vehicle",
			"hitArea": [
				{
					"shape": [ 140.61,33.03,109.7,63.33,-107.88,63.33,-140,33.64,-140.61,-33.03,-108.48,-62.73,107.88,-62.73,140.61,-33.64 ]
				}
			],
			"icon": "game/Textures/UI/VehicleIcons/CombatCarCVehicleIcon.webp",
			"texture": "game/Textures/Vehicles/traincombatcarc.webp",
			"sockets": [
				{
					"id": 0,
					"type": "traincar",
					"x": 9.66,
					"y": 2.83,
					"rotation": 90
				},
				{
					"id": 1,
					"type": "traincar",
					"x": 0,
					"y": 2.83,
					"rotation": 270
				}
			],
			"vehicle": {
				"type": "train",
				"track": "rail_large_gauge",
				"mass": 25
			},
			"techId": "unlockfacilitytier3"
		},
		"traincombatcarw": {
			"name": "O’Brien Warsmith v.215",
			"codeName": "TrainCombatCarW",
			"description": "In his later years, O’Brien nearly died in an attack on a military passenger train while travelling to Whedon’s Row. In response, he put his team to work designing not only an infantry car that offered powerful protection to any locomotive, but one that just the sight of it would run off all but the most committed of attackers—Namely its thick armour plating and powerful twin turrets. ",
			"category": "trains",
			"categoryOrder": 9,
			"faction": "w",
			"sortLayer": "vehicle",
			"icon": "game/Textures/UI/VehicleIcons/CombatCarWVehicleIcon.webp",
			"texture": "game/Textures/Vehicles/traincombatcarw.webp",
			"sockets": [
				{
					"id": 0,
					"type": "traincar",
					"x": 12.42,
					"y": 1.97,
					"rotation": 90
				},
				{
					"id": 1,
					"type": "traincar",
					"x": 0,
					"y": 1.97,
					"rotation": 270
				}
			],
			"vehicle": {
				"type": "train",
				"track": "rail_large_gauge",
				"mass": 25
			},
			"techId": "unlockfacilitytier3"
		},
		"trainengine": {
			"name": "BMS Black Bolt",
			"codeName": "TrainEngine",
			"description": "One of the most storied mass-market 0-6-2 locomotives engineered by the Bassett Motor Society, this coal-powered industrial train engine is reliable, tested, and incredibly durable. The Black Bolt’s legacy is unmatched having aided the Bassett Motor Society in supplying countries across the globe.",
			"category": "trains",
			"categoryOrder": 4,
			"sortLayer": "vehicle",
			"icon": "game/Textures/UI/VehicleIcons/TrainEngineVehicleIcon.webp",
			"texture": "game/Textures/Vehicles/trainengine.webp",
			"sockets": [
				{
					"id": 0,
					"type": "traincar",
					"x": 11.78,
					"y": 1.8,
					"rotation": 90
				},
				{
					"id": 1,
					"type": "traincar",
					"x": 0,
					"y": 1.8,
					"rotation": 270
				}
			],
			"vehicle": {
				"type": "train",
				"track": "rail_large_gauge",
				"engine": true,
				"mass": 1000,
				"maxSpeed": 15
			},
			"techId": "unlockfacilitytier2"
		},
		"trainflatbed": {
			"name": "BMS Longrider",
			"codeName": "TrainFlatbed",
			"description": "A flatbed car for transporting large resources and munitions by train over long-distances. ",
			"category": "trains",
			"categoryOrder": 6,
			"sortLayer": "vehicle",
			"icon": "game/Textures/UI/VehicleIcons/TrainCarVehicleIcon.webp",
			"texture": "game/Textures/Vehicles/trainflatbed.webp",
			"sockets": [
				{
					"id": 0,
					"type": "traincar",
					"x": 8.52,
					"y": 1.83,
					"rotation": 90
				},
				{
					"id": 1,
					"type": "traincar",
					"x": 0,
					"y": 1.83,
					"rotation": 270
				}
			],
			"vehicle": {
				"type": "train",
				"track": "rail_large_gauge",
				"mass": 25
			},
			"techId": "unlockfacilitytier2"
		},
		"traininfantry": {
			"name": "BMS Holdout",
			"codeName": "TrainInfantry",
			"description": "An armoured train car with a mounted machinegun position for transporting infantry safely over long distances.",
			"category": "trains",
			"categoryOrder": 7,
			"sortLayer": "vehicle",
			"icon": "game/Textures/UI/VehicleIcons/InfantryCarVehicleIcon.webp",
			"texture": "game/Textures/Vehicles/traininfantry.webp",
			"sockets": [
				{
					"id": 0,
					"type": "traincar",
					"x": 8.52,
					"y": 1.83,
					"rotation": 90
				},
				{
					"id": 1,
					"type": "traincar",
					"x": 0,
					"y": 1.83,
					"rotation": 270
				}
			],
			"vehicle": {
				"type": "train",
				"track": "rail_large_gauge",
				"mass": 25
			},
			"techId": "unlocktrainengine"
		},
		"trainlrartillery": {
			"name": "Tempest Cannon RA-2",
			"className": "locomotive",
			"codeName": "TrainLRArtillery",
			"description": "All the power of a stationary Storm Cannon, but easily relocated via rails. This devastating cannon is capable of leveling enemy fortifications at very large distances.",
			"category": "trains",
			"categoryOrder": 10,
			"length": 3.5,
			"sortLayer": "vehicle",
			"hitArea": [
				{
					"shape": [ 270,25.15,269.39,-25.15,278.48,14.24,279.09,25.15 ]
				},
				{
					"shape": [ 278.48,14.24,269.39,-25.15,278.48,-25.15 ]
				},
				{
					"shape": [ -285.15,-43.33,-237.88,-43.33,-237.88,43.94,-285.15,43.94 ]
				},
				{
					"shape": [ 356.67,12.42,278.48,14.24,278.48,-13.64,356.67,-12.42 ]
				},
				{
					"shape": [ -237.88,-43.33,-71.21,48.79,-71.21,65.76,-237.88,65.76 ]
				},
				{
					"shape": [ 45.15,43.94,-71.29,-47.73,45.15,-43.33,269.39,-25.15,270,43.94 ]
				},
				{
					"shape": [ 269.39,-25.15,45.15,-43.33,270,-43.33 ]
				},
				{
					"shape": [ -237.88,-43.33,-71.29,-47.73,45.15,43.94,44.55,48.18,-71.21,48.79 ]
				},
				{
					"shape": [ -71.55,-50.9,-71.29,-47.73,-237.88,-43.33,-237.88,-50.61 ]
				},
				{
					"shape": [ 45.15,-43.33,-71.29,-47.73,44.55,-48.18 ]
				}
			],
			"icon": "game/Textures/UI/VehicleIcons/TrainLRArtilleryVehicleIcon.webp",
			"texture": "game/Textures/Vehicles/trainlrartillery.webp",
			"textureOffset": {
				"x": 1197,
				"y": 187
			},
			"canSnap": true,
			"canSnapAlongBezier": "rail_large_gauge",
			"techId": "unlockfacilitytier3"
		},
		"trainlrartillery_undercarriage": {
			"className": "locomotive_undercarriage",
			"category": "trains",
			"sortLayer": "vehicle",
			"hideInList": true,
			"texture": "game/Textures/Vehicles/trainlrartillery_undercarriage.webp",
			"sockets": [
				{
					"id": 0,
					"type": "traincar",
					"x": 5.87,
					"y": 1.76,
					"rotation": 90
				},
				{
					"id": 1,
					"type": "traincar",
					"x": 0,
					"y": 1.76,
					"rotation": 270
				}
			],
			"vehicle": {
				"type": "train",
				"track": "rail_large_gauge",
				"mass": 250
			}
		},
		"tree": {
			"name": "Tree",
			"description": "A tree featured throughout the world of Foxhole.",
			"category": "world",
			"categoryOrder": 10,
			"sortLayer": "overhead",
			"radius": 2,
			"icon": "game/Textures/UI/CustomIcons/TreeIcon.webp",
			"texture": "game/Textures/Structures/tree.webp"
		},
		"trenchconnectort1": {
			"name": "Trench Connector (Tier 1)",
			"codeName": "TrenchConnectorT1",
			"description": "A dugout that's used for cover and as passageways between Bunkers. Connects to other Trenches and Bunkers. This is a special Trench variant that can resize dynamically and can be built underneath roads.",
			"category": "entrenchments",
			"categoryOrder": 2,
			"tier": 1,
			"sortLayer": "foundation",
			"hasHandle": true,
			"isBezier": true,
			"trenchConnector": true,
			"minLength": 2.5,
			"maxLength": 8,
			"icon": "game/Textures/UI/StructureIcons/TrenchT1ConnectorIcon.webp",
			"texture": "game/Textures/Structures/trencht1_connector.webp",
			"textureBorder": "game/Textures/Structures/trencht1_connector_side.webp",
			"canSnap": true,
			"sockets": [
				{
					"id": 0,
					"type": [
						{
							"mask": 1094,
							"category": 1026
						}
					],
					"texture": "game/Textures/Structures/trencht1_end.webp",
					"cap": "front",
					"rotation": 270
				},
				{
					"id": 1,
					"type": [
						{
							"mask": 1094,
							"category": 1026
						}
					],
					"texture": "game/Textures/Structures/trencht1_end.webp",
					"cap": "back",
					"rotation": 90
				}
			],
			"maxHealth": 1500,
			"repairCost": 90,
			"hasPipes": false,
			"currentGearPower" : 0,
			"upgrades": {
				"trenchconnectort1": {
					"reference": "trenchconnectort1"
				},
				"trenchconnectort2": {
					"reference": "trenchconnectort2"
				},
				"trenchconnectort3": {
					"reference": "trenchconnectort3"
				}
			}
		},
		"trenchconnectort2": {
			"name": "Trench Connector (Tier 2)",
			"codeName": "TrenchConnectorT2",
			"parentKey": "trenchconnectort1",
			"description": "A dugout that's used for cover and as passageways between Bunkers. Connects to other Trenches and Bunkers. This is a special Trench variant that can resize dynamically and can be built underneath roads.",
			"tier": 2,
			"icon": "game/Textures/UI/StructureIcons/TrenchT2ConnectorIcon.webp",
			"texture": "game/Textures/Structures/trencht2_connector.webp",
			"textureBorder": "game/Textures/Structures/trencht2_connector_side.webp",
			"sockets": [
				{
					"id": 0,
					"type": [
						{
							"mask": 1094,
							"category": 1026
						}
					],
					"texture": "game/Textures/Structures/trencht2_end.webp",
					"cap": "front",
					"rotation": 270
				},
				{
					"id": 1,
					"type": [
						{
							"mask": 1094,
							"category": 1026
						}
					],
					"texture": "game/Textures/Structures/trencht2_end.webp",
					"cap": "back",
					"rotation": 90
				}
			],
			"maxHealth": 1850,
			"cost": {
				"cloth": 60
			},
			"repairCost": 60,
			"hasPipes": false,
			"currentGearPower" : 0
		},
		"trenchconnectort3": {
			"name": "Trench Connector (Tier 3)",
			"codeName": "TrenchConnectorT3",
			"parentKey": "trenchconnectort2",
			"description": "A dugout that's used for cover and as passageways between Bunkers. Connects to other Trenches and Bunkers. This is a special Trench variant that can resize dynamically and can be built underneath roads.",
			"tier": 3,
			"icon": "game/Textures/UI/StructureIcons/TrenchT3ConnectorIcon.webp",
			"texture": "game/Textures/Structures/trencht3_connector.webp",
			"textureBorder": "game/Textures/Structures/trencht3_connector_side.webp",
			"sockets": [
				{
					"id": 0,
					"type": [
						{
							"mask": 1094,
							"category": 1026
						}
					],
					"texture": "game/Textures/Structures/trencht3_end.webp",
					"cap": "front",
					"rotation": 270
				},
				{
					"id": 1,
					"type": [
						{
							"mask": 1094,
							"category": 1026
						}
					],
					"texture": "game/Textures/Structures/trencht3_end.webp",
					"cap": "back",
					"rotation": 90
				}
			],
			"maxHealth": 3500,
			"cost": {
				"concrete": 15
			},
			"repairCost": 120,
			"hasPipes": false,
			"currentGearPower" : 0
		},
		"trenchempt1": {
			"name": "Trench Emplacement (Tier 1)",
			"codeName": "TrenchEmpT1",
			"description": "A dugout that's used for cover and as passageways between Bunkers. Connects to other Trenches. This variant can also serve as an emplacement for mannable defenses.",
			"category": "entrenchments",
			"categoryOrder": 5,
			"tier": 1,
			"width": 10,
			"length": 10,
			"sortLayer": "foundation",
			"hitArea": [
				{
					"shape": [ -54.55,-133.94,55.15,-133.94,133.94,-54.55,133.94,55.15,55.15,133.94,-54.55,133.94,-133.33,54.55,-133.33,-55.76 ]
				}
			],
			"icon": "game/Textures/UI/StructureIcons/TrenchT1EmplacementIcon.webp",
			"texture": "game/Textures/Structures/trenchempt1.webp",
			"canSnap": true,
			"snapNearest": true,
			"sockets": [
				{
					"id": 0,
					"type": [
						{
							"mask": 2,
							"category": 2
						}
					],
					"texture": "game/Textures/Structures/trenchempt1_side_closed.webp",
					"textureAlt": "game/Textures/Structures/trenchempt1_side_open.webp",
					"x": 5,
					"y": 0,
					"rotation": 0
				},
				{
					"id": 1,
					"type": [
						{
							"mask": 2,
							"category": 2
						}
					],
					"texture": "game/Textures/Structures/trenchempt1_side_closed.webp",
					"textureAlt": "game/Textures/Structures/trenchempt1_side_open.webp",
					"x": 8.53,
					"y": 1.47,
					"rotation": 45
				},
				{
					"id": 2,
					"type": [
						{
							"mask": 2,
							"category": 2
						}
					],
					"texture": "game/Textures/Structures/trenchempt1_side_closed.webp",
					"textureAlt": "game/Textures/Structures/trenchempt1_side_open.webp",
					"x": 10,
					"y": 5,
					"rotation": 90
				},
				{
					"id": 3,
					"type": [
						{
							"mask": 2,
							"category": 2
						}
					],
					"texture": "game/Textures/Structures/trenchempt1_side_closed.webp",
					"textureAlt": "game/Textures/Structures/trenchempt1_side_open.webp",
					"x": 8.53,
					"y": 8.53,
					"rotation": 135
				},
				{
					"id": 4,
					"type": [
						{
							"mask": 2,
							"category": 2
						}
					],
					"texture": "game/Textures/Structures/trenchempt1_side_closed.webp",
					"textureAlt": "game/Textures/Structures/trenchempt1_side_open.webp",
					"x": 5,
					"y": 10,
					"rotation": 180
				},
				{
					"id": 5,
					"type": [
						{
							"mask": 2,
							"category": 2
						}
					],
					"texture": "game/Textures/Structures/trenchempt1_side_closed.webp",
					"textureAlt": "game/Textures/Structures/trenchempt1_side_open.webp",
					"x": 1.47,
					"y": 8.53,
					"rotation": 225
				},
				{
					"id": 6,
					"type": [
						{
							"mask": 2,
							"category": 2
						}
					],
					"texture": "game/Textures/Structures/trenchempt1_side_closed.webp",
					"textureAlt": "game/Textures/Structures/trenchempt1_side_open.webp",
					"x": 0,
					"y": 5,
					"rotation": 270
				},
				{
					"id": 7,
					"type": [
						{
							"mask": 2,
							"category": 2
						}
					],
					"texture": "game/Textures/Structures/trenchempt1_side_closed.webp",
					"textureAlt": "game/Textures/Structures/trenchempt1_side_open.webp",
					"x": 1.47,
					"y": 1.47,
					"rotation": 315
				},
				{
					"id": 8,
					"type": "emplacement",
					"x": 5,
					"y": 5,
					"rotation": 180,
					"ignoreSnap": true
				}
			],
			"maxHealth": 1500,
			"repairCost": 75,
			"hasPipes": false,
			"currentGearPower" : 0,
			"upgrades": {
				"trenchempt1": {
					"reference": "trenchempt1"
				},
				"trenchempt2": {
					"reference": "trenchempt2"
				},
				"trenchempt3": {
					"reference": "trenchempt3"
				}
			}
		},
		"trenchempt2": {
			"name": "Trench Emplacement (Tier 2)",
			"codeName": "TrenchEmpT2",
			"parentKey": "trenchempt1",
			"description": "A dugout that's used for cover and as passageways between Bunkers. Connects to other Trenches. This variant can also serve as an emplacement for mannable defenses.",
			"tier": 2,
			"icon": "game/Textures/UI/StructureIcons/TrenchT2EmplacementIcon.webp",
			"texture": "game/Textures/Structures/trenchempt2.webp",
			"sockets": [
				{
					"id": 0,
					"type": [
						{
							"mask": 2,
							"category": 2
						}
					],
					"texture": "game/Textures/Structures/trenchempt2_side_closed.webp",
					"textureAlt": "game/Textures/Structures/trenchempt2_side_open.webp",
					"x": 5,
					"y": 0,
					"rotation": 0
				},
				{
					"id": 1,
					"type": [
						{
							"mask": 2,
							"category": 2
						}
					],
					"texture": "game/Textures/Structures/trenchempt2_side_closed.webp",
					"textureAlt": "game/Textures/Structures/trenchempt2_side_open.webp",
					"x": 8.53,
					"y": 1.47,
					"rotation": 45
				},
				{
					"id": 2,
					"type": [
						{
							"mask": 2,
							"category": 2
						}
					],
					"texture": "game/Textures/Structures/trenchempt2_side_closed.webp",
					"textureAlt": "game/Textures/Structures/trenchempt2_side_open.webp",
					"x": 10,
					"y": 5,
					"rotation": 90
				},
				{
					"id": 3,
					"type": [
						{
							"mask": 2,
							"category": 2
						}
					],
					"texture": "game/Textures/Structures/trenchempt2_side_closed.webp",
					"textureAlt": "game/Textures/Structures/trenchempt2_side_open.webp",
					"x": 8.53,
					"y": 8.53,
					"rotation": 135
				},
				{
					"id": 4,
					"type": [
						{
							"mask": 2,
							"category": 2
						}
					],
					"texture": "game/Textures/Structures/trenchempt2_side_closed.webp",
					"textureAlt": "game/Textures/Structures/trenchempt2_side_open.webp",
					"x": 5,
					"y": 10,
					"rotation": 180
				},
				{
					"id": 5,
					"type": [
						{
							"mask": 2,
							"category": 2
						}
					],
					"texture": "game/Textures/Structures/trenchempt2_side_closed.webp",
					"textureAlt": "game/Textures/Structures/trenchempt2_side_open.webp",
					"x": 1.47,
					"y": 8.53,
					"rotation": 225
				},
				{
					"id": 6,
					"type": [
						{
							"mask": 2,
							"category": 2
						}
					],
					"texture": "game/Textures/Structures/trenchempt2_side_closed.webp",
					"textureAlt": "game/Textures/Structures/trenchempt2_side_open.webp",
					"x": 0,
					"y": 5,
					"rotation": 270
				},
				{
					"id": 7,
					"type": [
						{
							"mask": 2,
							"category": 2
						}
					],
					"texture": "game/Textures/Structures/trenchempt2_side_closed.webp",
					"textureAlt": "game/Textures/Structures/trenchempt2_side_open.webp",
					"x": 1.47,
					"y": 1.47,
					"rotation": 315
				},
				{
					"id": 8,
					"type": "emplacement",
					"x": 5,
					"y": 5,
					"rotation": 180,
					"ignoreSnap": true
				}
			],
			"maxHealth": 1850,
			"cost": {
				"cloth": 50
			},
			"repairCost": 50,
			"hasPipes": false,
			"currentGearPower" : 0
		},
		"trenchempt3": {
			"name": "Trench Emplacement (Tier 3)",
			"codeName": "TrenchEmpT3",
			"parentKey": "trenchempt2",
			"description": "A dugout that's used for cover and as passageways between Bunkers. Connects to other Trenches. This variant can also serve as an emplacement for mannable defenses.",
			"tier": 3,
			"icon": "game/Textures/UI/StructureIcons/TrenchT3EmplacementIcon.webp",
			"texture": "game/Textures/Structures/trenchempt3.webp",
			"sockets": [
				{
					"id": 0,
					"type": [
						{
							"mask": 2,
							"category": 2
						}
					],
					"texture": "game/Textures/Structures/trenchempt3_side_closed.webp",
					"textureAlt": "game/Textures/Structures/trenchempt3_side_open.webp",
					"x": 5,
					"y": 0,
					"rotation": 0
				},
				{
					"id": 1,
					"type": [
						{
							"mask": 2,
							"category": 2
						}
					],
					"texture": "game/Textures/Structures/trenchempt3_side_closed.webp",
					"textureAlt": "game/Textures/Structures/trenchempt3_side_open.webp",
					"x": 8.53,
					"y": 1.47,
					"rotation": 45
				},
				{
					"id": 2,
					"type": [
						{
							"mask": 2,
							"category": 2
						}
					],
					"texture": "game/Textures/Structures/trenchempt3_side_closed.webp",
					"textureAlt": "game/Textures/Structures/trenchempt3_side_open.webp",
					"x": 10,
					"y": 5,
					"rotation": 90
				},
				{
					"id": 3,
					"type": [
						{
							"mask": 2,
							"category": 2
						}
					],
					"texture": "game/Textures/Structures/trenchempt3_side_closed.webp",
					"textureAlt": "game/Textures/Structures/trenchempt3_side_open.webp",
					"x": 8.53,
					"y": 8.53,
					"rotation": 135
				},
				{
					"id": 4,
					"type": [
						{
							"mask": 2,
							"category": 2
						}
					],
					"texture": "game/Textures/Structures/trenchempt3_side_closed.webp",
					"textureAlt": "game/Textures/Structures/trenchempt3_side_open.webp",
					"x": 5,
					"y": 10,
					"rotation": 180
				},
				{
					"id": 5,
					"type": [
						{
							"mask": 2,
							"category": 2
						}
					],
					"texture": "game/Textures/Structures/trenchempt3_side_closed.webp",
					"textureAlt": "game/Textures/Structures/trenchempt3_side_open.webp",
					"x": 1.47,
					"y": 8.53,
					"rotation": 225
				},
				{
					"id": 6,
					"type": [
						{
							"mask": 2,
							"category": 2
						}
					],
					"texture": "game/Textures/Structures/trenchempt3_side_closed.webp",
					"textureAlt": "game/Textures/Structures/trenchempt3_side_open.webp",
					"x": 0,
					"y": 5,
					"rotation": 270
				},
				{
					"id": 7,
					"type": [
						{
							"mask": 2,
							"category": 2
						}
					],
					"texture": "game/Textures/Structures/trenchempt3_side_closed.webp",
					"textureAlt": "game/Textures/Structures/trenchempt3_side_open.webp",
					"x": 1.47,
					"y": 1.47,
					"rotation": 315
				},
				{
					"id": 8,
					"type": "emplacement",
					"x": 5,
					"y": 5,
					"rotation": 180,
					"ignoreSnap": true
				}
			],
			"maxHealth": 3500,
			"cost": {
				"concrete": 10
			},
			"repairCost": 80,
			"hasPipes": false,
			"currentGearPower" : 0
		},
		"trencht1": {
			"name": "Trench (Tier 1)",
			"codeName": "TrenchT1",
			"description": "A dugout that's used for cover and as passageways between Bunkers. Connects to other Trenches and Bunkers.",
			"category": "entrenchments",
			"categoryOrder": 1,
			"tier": 1,
			"width": 10,
			"length": 3,
			"sortLayer": "trench",
			"icon": "game/Textures/UI/StructureIcons/TrenchT1Icon.webp",
			"texture": "game/Textures/Structures/trencht1.webp",
			"canSnap": true,
			"snapNearest": true,
			"sockets": [
				{
					"id": 0,
					"type": [
						{
							"mask": 70,
							"category": 2
						}
					],
					"texture": "game/Textures/Structures/trencht1_end.webp",
					"x": 0,
					"y": 1.47,
					"rotation": 270
				},
				{
					"id": 1,
					"type": [
						{
							"mask": 2,
							"category": 64
						}
					],
					"texture": "game/Textures/Structures/trencht1_side_closed.webp",
					"textureAlt": "game/Textures/Structures/trencht1_side_open.webp",
					"x": 5,
					"y": 0,
					"rotation": 0
				},
				{
					"id": 2,
					"type": [
						{
							"mask": 70,
							"category": 2
						}
					],
					"texture": "game/Textures/Structures/trencht1_end.webp",
					"x": 10,
					"y": 1.47,
					"rotation": 90
				},
				{
					"id": 3,
					"type": [
						{
							"mask": 2,
							"category": 64
						}
					],
					"texture": "game/Textures/Structures/trencht1_side_closed.webp",
					"textureAlt": "game/Textures/Structures/trencht1_side_open.webp",
					"x": 5,
					"y": 2.94,
					"rotation": 180
				}
			],
			"maxHealth": 1500,
			"repairCost": 75,
			"hasPipes": false,
			"currentGearPower" : 0,
			"upgrades": {
				"trencht1": {
					"reference": "trencht1"
				},
				"trencht2": {
					"reference": "trencht2"
				},
				"trencht3": {
					"reference": "trencht3"
				}
			}
		},
		"trencht2": {
			"name": "Trench (Tier 2)",
			"codeName": "TrenchT2",
			"parentKey": "trencht1",
			"description": "A dugout that's used for cover and as passageways between Bunkers. Connects to other Trenches and Bunkers.",
			"tier": 2,
			"icon": "game/Textures/UI/StructureIcons/TrenchT2Icon.webp",
			"texture": "game/Textures/Structures/trencht2.webp",
			"sockets": [
				{
					"id": 0,
					"type": [
						{
							"mask": 70,
							"category": 2
						}
					],
					"texture": "game/Textures/Structures/trencht2_end.webp",
					"x": 0,
					"y": 1.47,
					"rotation": 270
				},
				{
					"id": 1,
					"type": [
						{
							"mask": 2,
							"category": 64
						}
					],
					"texture": "game/Textures/Structures/trencht2_side_closed.webp",
					"textureAlt": "game/Textures/Structures/trencht2_side_open.webp",
					"x": 5,
					"y": 0,
					"rotation": 0
				},
				{
					"id": 2,
					"type": [
						{
							"mask": 70,
							"category": 2
						}
					],
					"texture": "game/Textures/Structures/trencht2_end.webp",
					"x": 10,
					"y": 1.47,
					"rotation": 90
				},
				{
					"id": 3,
					"type": [
						{
							"mask": 2,
							"category": 64
						}
					],
					"texture": "game/Textures/Structures/trencht2_side_closed.webp",
					"textureAlt": "game/Textures/Structures/trencht2_side_open.webp",
					"x": 5,
					"y": 2.94,
					"rotation": 180
				}
			],
			"maxHealth": 1850,
			"cost": {
				"cloth": 50
			},
			"repairCost": 50,
			"hasPipes": false,
			"currentGearPower" : 0,
			"upgrades": {
				"trencht1": {
					"reference": "trencht1"
				},
				"trencht2": {
					"reference": "trencht2"
				},
				"trencht3": {
					"reference": "trencht3"
				}
			}
		},
		"trencht3": {
			"name": "Trench (Tier 3)",
			"codeName": "TrenchT3",
			"parentKey": "trencht2",
			"description": "A dugout that's used for cover and as passageways between Bunkers. Connects to other Trenches and Bunkers.",
			"tier": 3,
			"icon": "game/Textures/UI/StructureIcons/TrenchT3Icon.webp",
			"texture": "game/Textures/Structures/trencht3.webp",
			"sockets": [
				{
					"id": 0,
					"type": [
						{
							"mask": 70,
							"category": 2
						}
					],
					"texture": "game/Textures/Structures/trencht3_end.webp",
					"x": 0,
					"y": 1.47,
					"rotation": 270
				},
				{
					"id": 1,
					"type": [
						{
							"mask": 2,
							"category": 64
						}
					],
					"texture": "game/Textures/Structures/trencht3_side_closed.webp",
					"textureAlt": "game/Textures/Structures/trencht3_side_open.webp",
					"x": 5,
					"y": 0,
					"rotation": 0
				},
				{
					"id": 2,
					"type": [
						{
							"mask": 70,
							"category": 2
						}
					],
					"texture": "game/Textures/Structures/trencht3_end.webp",
					"x": 10,
					"y": 1.47,
					"rotation": 90
				},
				{
					"id": 3,
					"type": [
						{
							"mask": 2,
							"category": 64
						}
					],
					"texture": "game/Textures/Structures/trencht3_side_closed.webp",
					"textureAlt": "game/Textures/Structures/trencht3_side_open.webp",
					"x": 5,
					"y": 2.94,
					"rotation": 180
				}
			],
			"maxHealth": 3500,
			"cost": {
				"concrete": 10
			},
			"repairCost": 80,
			"hasPipes": false,
			"currentGearPower" : 0,
			"upgrades": {
				"trencht1": {
					"reference": "trencht1"
				},
				"trencht2": {
					"reference": "trencht2"
				},
				"trencht3": {
					"reference": "trencht3"
				}
			}
		},
		"troopship": {
			"name": "BMS - White Whale",
			"codeName": "TroopShip",
			"description": "A heavily armoured vessel, the Basset Motor Society’s White Whale-class troop transports can deploy on faraway beaches to function as a permanent forward operating base.",
			"category": "vehicles",
			"categoryOrder": 22,
			"sortLayer": "vehicle",
			"hitArea": [
				{
					"shape": [ 310,-58.48,325.76,-30,325.76,29.39,16.06,87.58,-242.12,-85.15,260.91,-88.18,288.79,-78.48 ]
				},
				{
					"shape": [ 263.33,88.18,16.06,87.58,325.76,29.39,311.21,57.27,288.79,78.48 ]
				},
				{
					"shape": [ -320.3,61.52,-328.79,48.18,-328.79,-51.82,-242.73,85.15,-265.15,84.55,-293.03,79.09 ]
				},
				{
					"shape": [ 325.76,29.39,325.76,-30,330.61,0.3 ]
				},
				{
					"shape": [ -265.15,-84.55,-242.12,-85.15,16.06,87.58,8.79,111.82,-242.73,85.15,-328.79,-51.82,-316.67,-64.55,-289.39,-79.09 ]
				},
				{
					"shape": [ 8.18,-111.82,16.06,-87.58,-242.12,-85.15,-228.18,-111.82 ]
				},
				{
					"shape": [ -242.73,85.15,8.79,111.82,-228.79,111.82 ]
				}
			],
			"icon": "game/Textures/UI/VehicleIcons/TroopShipVehicleIcon.webp",
			"texture": "game/Textures/Vehicles/troopship.webp",
			"techId": "unlocktroopship"
		},
		"truckc": {
			"name": "R-1 Hauler",
			"codeName": "TruckC",
			"description": "A heavy-duty Colonial truck used to mobilize troops and supplies.",
			"category": "vehicles",
			"categoryOrder": 1,
			"faction": "c",
			"sortLayer": "vehicle",
			"icon": "game/Textures/UI/VehicleIcons/TruckVehicleIcon.webp",
			"texture": "game/Textures/Vehicles/truckc.webp"
		},
		"truckw": {
			"name": "Dunne Transport",
			"codeName": "TruckW",
			"description": "A heavy-duty Warden truck used to mobilize troops and supplies.",
			"category": "vehicles",
			"categoryOrder": 2,
			"faction": "w",
			"sortLayer": "vehicle",
			"icon": "game/Textures/UI/VehicleIcons/TruckWarVehicleIcon.webp",
			"texture": "game/Textures/Vehicles/truckw.webp"
		},
		"wallsplinet1": {
			"name": "Wall (Tier 1)",
			"codeName": "WallSplineT1",
			"description": "A basic barrier that is used to prevent passage through an area.",
			"category": "defenses",
			"categoryOrder": 3,
			"sortLayer": "wall",
			"hasHandle": true,
			"minLength": 3,
			"maxLength": 10,
			"icon": "game/Textures/UI/ItemIcons/Wall-T1Icon.webp",
			"texture": "game/Textures/Structures/wallsplinet1.webp",
			"canSnap": true,
			"canSnapRotate": true,
			"sockets": [
				{
					"id": 0,
					"type": [
						{
							"mask": 4608,
							"category": 512
						}
					],
					"texture": "game/Textures/Structures/wallsplinet1_post.webp",
					"textureAlt": "game/Textures/Structures/wallsplinet1_post.webp",
					"cap": "front",
					"rotation": 270
				},
				{
					"id": 1,
					"type": [
						{
							"mask": 4608,
							"category": 512
						}
					],
					"texture": "game/Textures/Structures/wallsplinet1_post.webp",
					"textureAlt": "game/Textures/Structures/wallsplinet1_post.webp",
					"cap": "back",
					"rotation": 90
				}
			],
			"maxHealth": 500,
			"cost": {
				"cloth": 15
			},
			"repairCost": 15,
			"upgrades": {
				"wallsplinet2": {
					"name": "Wall (Tier 2)",
					"codeName": "WallSplineT2",
					"description": "A barrier that is used to prevent passage through an area.",
					"minLength": 3,
					"maxLength": 10,
					"icon": "game/Textures/UI/ItemIcons/Wall-T2Icon.webp",
					"texture": "game/Textures/Structures/wallsplinet2.webp",
					"techId": "unlockwalltier2",
					"sockets": [
						{
							"id": 0,
							"type": [
								{
									"mask": 4608,
									"category": 512
								}
							],
							"texture": "game/Textures/Structures/wallsplinet2_post.webp",
							"textureAlt": "game/Textures/Structures/wallsplinet2_post.webp",
							"cap": "front",
							"rotation": 270
						},
						{
							"id": 1,
							"type": [
								{
									"mask": 4608,
									"category": 512
								}
							],
							"texture": "game/Textures/Structures/wallsplinet2_post.webp",
							"textureAlt": "game/Textures/Structures/wallsplinet2_post.webp",
							"cap": "back",
							"rotation": 90
						}
					],
					"cost": {
						"cloth": 30
					},
					"maxHealth": 1000,
					"repairCost": 30
				},
				"wallsplinet3": {
					"name": "Wall (Tier 3)",
					"codeName": "WallSplineT3",
					"description": "A barrier that is used to prevent passage through an area.",
					"minLength": 3,
					"maxLength": 10,
					"icon": "game/Textures/UI/ItemIcons/Wall-T3Icon.webp",
					"texture": "game/Textures/Structures/wallsplinet3.webp",
					"techId": "unlockwalltier3",
					"sockets": [
						{
							"id": 0,
							"type": [
								{
									"mask": 4608,
									"category": 512
								}
							],
							"texture": "game/Textures/Structures/wallsplinet3_post.webp",
							"textureAlt": "game/Textures/Structures/wallsplinet3_post.webp",
							"cap": "front",
							"rotation": 270
						},
						{
							"id": 1,
							"type": [
								{
									"mask": 4608,
									"category": 512
								}
							],
							"texture": "game/Textures/Structures/wallsplinet3_post.webp",
							"textureAlt": "game/Textures/Structures/wallsplinet3_post.webp",
							"cap": "back",
							"rotation": 90
						}
					],
					"cost": {
						"concrete": 15
					},
					"maxHealth": 3000,
					"repairCost": 75
				}
			}
		},
		"watchtower": {
			"name": "Watch Tower",
			"codeName": "WatchTower",
			"description": "Reports nearby enemy movements to players with Radios equipped",
			"category": "defenses",
			"categoryOrder": 5,
			"range": {
				"type": "radio",
				"max": 80
			},
			"icon": "game/Textures/UI/StructureIcons/WatchTowerStructureIcon.webp",
			"texture": "game/Textures/Structures/watchtower.webp",
			"maxHealth": 350,
			"cost": {
				"cloth": 60
			},
			"repairCost": 60
		},
		"water_pump": {
			"name": "Water Pump",
			"codeName": "FacilityMineWater",
			"description": "Pumps water through pipes. Must be built on bodies of water.",
			"category": "harvesters",
			"color": 2591968,
			"hitArea": [
				{
					"shape": [ 60.91,17.88,-51.82,65.15,-65.15,70,-51.82,-28.18,21.52,-31.21,55.45,-29.39 ]
				},
				{
					"shape": [ -65.15,70,-51.82,65.15,-52.42,70,-59.09,73.64 ]
				},
				{
					"shape": [ -51.82,-28.18,-65.15,70,-64.55,-34.85,-59.44,-37.45,-53.64,-34.85 ]
				},
				{
					"shape": [ -51.82,65.15,60.91,17.88,55.45,66.36 ]
				},
				{
					"shape": [ 27.32,-50.26,21.52,-31.21,-8.18,-30,-13.03,-50.61,-8.79,-65.76,0.82,-73.12,15.45,-72.42,25.15,-64.55 ]
				}
			],
			"icon": "game/Textures/UI/StructureIcons/FacilityMineWaterIcon.webp",
			"texture": "game/Textures/Structures/water_pump.webp",
			"maxHealth": 850,
			"cost": {
				"facilitymaterials1": 35
			},
			"repairCost": 100,
			"_productionLength": 1,
			"production": [
				{
					"id": 0,
					"output": {
						"watercan": 1
					},
					"time": 50
				}
			],
			"productionScaling": false,
			"upgrades": {
				"electric_water": {
					"name": "Electric Water Pump",
					"codeName": "Electric",
					"description": "A generator that pumps water more efficiently. Requires Power.",
					"hitArea": [
						{
							"shape": [ 34.85,-5.15,1.52,-37.88,34.85,-37.88 ]
						},
						{
							"shape": [ 35.45,24.55,34.85,-5.15,85.76,-4.55,85.76,24.55 ]
						},
						{
							"shape": [ -73.03,-36.06,-73.03,55.45,-79.52,65.06,-85.15,62.12,-85.76,-42.73,-79.52,-45.58,-73.64,-43.33 ]
						},
						{
							"shape": [ -79.52,65.06,-73.03,55.45,-73.64,62.73 ]
						},
						{
							"shape": [ -56.67,57.88,29.91,58.14,30,70.61,-51.65,70.61,-56.67,70 ]
						},
						{
							"shape": [ 35.45,24.55,34.85,57.88,29.91,58.14,-73.03,55.45,-73.03,-36.06,-27.58,-39.09,1.52,-37.88,34.85,-5.15 ]
						},
						{
							"shape": [ -10.61,-82.12,-0.56,-77.62,6.36,-66.97,6.54,-55.63,0.91,-45.76,-33.64,-58.74,-32.42,-69.39,-24.46,-78.83 ]
						},
						{
							"shape": [ 0.91,-45.76,1.52,-37.88,-27.58,-46.36,-33.64,-58.74 ]
						},
						{
							"shape": [ 1.52,-37.88,-27.58,-39.09,-27.58,-46.36 ]
						},
						{
							"shape": [ -51.65,70.61,25.15,70.61,21.52,82.12,-48.79,82.12 ]
						},
						{
							"shape": [ -73.03,55.45,29.91,58.14,-56.67,57.88 ]
						}
					],
					"baseIcon": "game/Textures/UI/StructureIcons/FacilityElectricWaterPumpIcon.webp",
					"icon": "game/Textures/UI/StructureIcons/FacilityElectricWaterPumpIcon.webp",
					"texture": "game/Textures/Structures/water_pump_electric_water.webp",
					"positionOffset": {
						"x": 68,
						"y": 28
					},
					"sockets": [
						{
							"id": 0,
							"name": "pipeout",
							"type": [
								{
									"mask": 16779264,
									"category": 16384
								}
							],
							"flow": "out",
							"x": 5.49,
							"y": 2.88,
							"rotation": 90
						},
						{
							"id": 1,
							"name": "power",
							"type": [
								{
									"mask": 131072,
									"category": 1048576
								}
							],
							"x": 3.74,
							"y": 2.88,
							"rotation": 90
						}
					],
					"cost": {
						"facilitymaterials1": 150
					},
					"_productionLength": 2,
					"production": [
						{
							"id": 0,
							"output": {
								"water": 60
							},
							"time": 50,
							"power": -0.5
						},
						{
							"id": 1,
							"output": {
								"watercan": 1
							},
							"time": 40
						}
					]
				}
			}
		},
		"world_road": {
			"name": "Public Road",
			"description": "A public road featured throughout the world of Foxhole.",
			"category": "world",
			"categoryOrder": 11,
			"sortLayer": "road",
			"hasHandle": true,
			"isBezier": true,
			"minLength": 12,
			"maxLength": 48,
			"icon": "game/Textures/UI/ItemIcons/FacilityRoadItemIcon.webp",
			"texture": "game/Textures/Structures/road_dirt.webp",
			"canSnap": true,
			"canSnapAlongBezier": true,
			"sockets": [
				{
					"id": 0,
					"type": "worldroad",
					"cap": "front",
					"rotation": 270
				},
				{
					"id": 1,
					"type": "worldroad",
					"cap": "back",
					"rotation": 90
				}
			],
			"upgrades": {
				"packed_dirt": {
					"name": "Packed Dirt",
					"icon": "game/Textures/UI/ItemIcons/FacilityRoadItemIcon.webp",
					"texture": "game/Textures/Structures/road_packed_dirt.webp"
				},
				"gravel": {
					"name": "Gravel",
					"icon": "game/Textures/UI/ItemIcons/FacilityRoadItemIcon.webp",
					"texture": "game/Textures/Structures/road_gravel.webp"
				},
				"great_march": {
					"name": "Great March",
					"icon": "game/Textures/UI/ItemIcons/FacilityRoadItemIcon.webp",
					"texture": "game/Textures/Structures/road_great_march.webp"
				}
			}
		}
	}
}