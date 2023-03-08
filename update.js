const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const METER_UNREAL_UNITS = 100;
const foxholeDataDirectory = 'dev/';
const foxholeDataVariable = 'const gameData = ';
let foxholeData = JSON.parse(fs.readFileSync('./public/games/foxhole/data.js').toString().substring(foxholeDataVariable.length));

const stStructures = JSON.parse(fs.readFileSync(`${foxholeDataDirectory}War/Content/Blueprints/StringTables/STStructures.json`))[0].StringTable.KeysToMetaData;
const structurePolygons = JSON.parse(fs.readFileSync(`${foxholeDataDirectory}polygons.json`));

let structureList = foxholeData.buildings;
let upgradeList = {};
let techList = {};
let itemList = {
    "facilitymaterials4": {
        "icon": "game/Textures/UI/ItemIcons/AssemblyMaterials1Icon.webp"
    },
    "facilitymaterials5": {
        "icon": "game/Textures/UI/ItemIcons/AssemblyMaterials2Icon.webp"
    },
    "facilitymaterials6": {
        "icon": "game/Textures/UI/ItemIcons/AssemblyMaterials3Icon.webp"
    },
    "facilitymaterials7": {
        "icon": "game/Textures/UI/ItemIcons/AssemblyMaterials4Icon.webp"
    },
    "facilitymaterials8": {
        "icon": "game/Textures/UI/ItemIcons/AssemblyMaterials5Icon.webp"
    },
    "oilcan": {
        "name": "Oil (Canned)",
        "description": "A raw viscous liquid that must be refined into fuel at Facilities.",
        "icon": "game/Textures/UI/ItemIcons/Facilities/OilIcon.webp"
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
};

// TODO: Add weapon damage variants. HV, HVFC, Spatha, etc. If there's a lot of entries, adding a search function might be nice.
let weaponList = {
    hegrenade: { // Mammon
        alias: 'HE Grenade',
        damageType: {
            multipliers: {
                't2': 0.95,
                't3': 0.95
            }
        }
    },
    helaunchedgrenade: { // Tremola Launched Grenade
        alias: 'HE Launcher',
        damageType: {
            multipliers: {
                't2': 0.95,
                't3': 0.95
            }
        }
    },
    minitankammo: { // 30mm
        damageType: {
            multipliers: {
                't2': 0.99,
                't3': 0.99
            }
        }
    },
    rpgammo: { // RPG
        damageType: {
            multipliers: {
                't3': 0.99
            }
        }
    },
    lighttankammo: {}, // 40mm
    battletankammo: {}, // 75mm
    atammo: {}, // 68mm
    atlargeammo: {}, // 94.5mm
    mortarammo: { // Mortar
        alias: 'Mortar'
    },
    lightartilleryammo: {}, // 120mm
    heavyartilleryammo: {}, // 150mm
    herocketammo: { // Rocket / 3C-High Explosive Rocket
        alias: 'Rocket'
    },
    firerocketammo: { // Flame Rocket / 4C-Fire Rocket
        alias: 'Fire Rocket'
    },
    explosivelightc: { // Hydras
        alias: 'Hydras'
    },
    mortartankammo: {}, // 250mm
    lrartilleryammo: {}, // 300mm
    satchelcharge: { // Satchels / Alligator Charge
        alias: 'Satchel'
    }
};

const conversionEntriesMap = {
    'Input': 'input',
    'FuelInput': 'input',
    'Output': 'output',
    'FuelOutput': 'output'
};

function getLocalIcon(component) {
    let iconPath = component?.Icon?.ObjectPath ?? component?.Icon?.ResourceObject?.ObjectPath ?? component?.BrushOverride?.ResourceObject?.ObjectPath;
    if (iconPath) {
        return `game/${iconPath.slice(12, -1)}webp`;
    }
}

function getTableString(entry) {
    if (entry.TableId === '/Game/Blueprints/StringTables/STStructures.STStructures') {
        return stStructures[entry.Key];
    }
}

function createItemEntry(codeName) {
    if (!itemList[codeName]) {
        itemList[codeName] = {};
    }
}

function iterateItemList(resourceList) {
    if (resourceList) {
        resourceList.forEach(resource => {
            createItemEntry(resource.CodeName.toLowerCase());
        });
    }
}

// This ensures we're only getting items for structures we have in the planner since there are a lot we don't use.
function initializeStructureItems(component) {
    if (component.AssemblyItems) {
        for (const [id, recipe] of Object.entries(component.AssemblyItems)) {
            createItemEntry(recipe.CodeName.toLowerCase());
            if (recipe.RequiredCodeName !== 'None') {
                createItemEntry(recipe.RequiredCodeName.toLowerCase());
            }
        }
    }
    if (component.ConversionEntries) {
        for (const [id, recipe] of Object.entries(component.ConversionEntries)) {
            for (const [from, to] of Object.entries(conversionEntriesMap)) {
                iterateItemList(recipe[from]);
            }
        }
    }
}

function iterateBaseStructures(uProperty, baseData) {
    let basePath = `${foxholeDataDirectory}${uProperty.SuperStruct.ObjectPath.slice(0, -1)}json`;
    let baseAsset = fs.readFileSync(basePath);
    baseAsset = JSON.parse(baseAsset);
    let className = null;
    let structure = null;
    baseAsset.forEach(uProperty => {
        switch(uProperty.Type) {
            case 'BlueprintGeneratedClass':
                className = uProperty.Name ?? className;
                if (uProperty.Super) {
                    iterateBaseStructures(uProperty, baseData);
                }
                break;
            case className:
                if (uProperty.Properties) {
                    structure = uProperty.Properties;
                    baseData.name = structure.DisplayName?.SourceString ?? baseData.name;
                    baseData.description = structure.Description?.SourceString ?? baseData.description;
                    baseData.BuildCategory = structure.BuildCategory ?? baseData.BuildCategory;
                    baseData.BuildOrder = structure.BuildOrder ?? baseData.BuildOrder;
                    baseData.minLength = structure.ConnectorMinLength ? structure.ConnectorMinLength / METER_UNREAL_UNITS : undefined ?? baseData.minLength;
                    baseData.maxLength = structure.ConnectorMaxLength ? structure.ConnectorMaxLength / METER_UNREAL_UNITS : undefined ?? baseData.maxLength;
                    baseData.icon = getLocalIcon(structure) ?? baseData.icon;
                    baseData.garrisonSupplyMultiplier = structure.DecaySupplyDrain ?? baseData.garrisonSupplyMultiplier;
                    baseData.power = structure.PowerGridInfo?.PowerDelta ?? baseData.power;
                }
                break;
        }
    });
}

//let buildCategories = ['EBuildCategory::Foundation', 'EBuildCategory::Facility', 'EBuildCategory::Power', 'EBuildCategory::Mining'];

function iterateUpgradeCodeNames(dirPath) {
    dirPath = dirPath ?? `${foxholeDataDirectory}War/Content/Blueprints/`;
    let files = fs.readdirSync(dirPath);
    files.forEach(file => {
        const filePath = path.join(dirPath, file);
        const fileStats = fs.statSync(filePath);
        if (fileStats.isFile() && path.extname(filePath) === '.json') {
            const uAsset = JSON.parse(fs.readFileSync(filePath));
            let className = null;
            let baseData = {};
            uAsset.forEach(uProperty => {
                switch(uProperty.Type) {
                    case 'BlueprintGeneratedClass':
                        className = uProperty.Name ?? className;
                        if (uProperty.Super) {
                            iterateBaseStructures(uProperty, baseData);
                        }
                        break;
                    case className:
                        if (uProperty.Properties && uProperty.Properties.CodeName) {
                            if (uProperty.Properties.ConversionCodeNames) {
                                let upgradeCodeName = uProperty.Properties.CodeName.toLowerCase();
                                if (structureList[upgradeCodeName]) {
                                    let conversionList = [];
                                    for (let i = 0; i < uProperty.Properties.ConversionCodeNames.length; i++) {
                                        let string = uProperty.Properties.ConversionCodeNames[i];
                                        if (!string.toLowerCase().endsWith('fill')) {
                                            conversionList.push(string);
                                        }
                                    }
                                    if (conversionList.length) {
                                        upgradeList[upgradeCodeName] = conversionList;
                                    }
                                }
                            }
                            /*
                            if (uProperty.Properties.UpgradeStructureCodeName) {
                                let upgradeCodeName = uProperty.Properties.CodeName.toLowerCase();
                                let codeNameUpgrades = [];
                                for (const [codeName, upgrades] of Object.entries(upgradeList)) {
                                    if (upgrades.includes(upgradeCodeName)) {
                                        upgradeCodeName = codeName;
                                        codeNameUpgrades = upgrades;
                                        break;
                                    }
                                }
                                if (structureList[upgradeCodeName] && uProperty.Properties.UpgradeStructureCodeName !== 'None') {
                                    codeNameUpgrades.push(uProperty.Properties.UpgradeStructureCodeName.toLowerCase());
                                    upgradeList[upgradeCodeName] = codeNameUpgrades;
                                }
                            }
                            */
                        }
                        break;
                }
            });
        } else if (fileStats.isDirectory()) {
            iterateUpgradeCodeNames(filePath);
        }
    });
}

const socketDataKeys = ['id', 'name', 'type', 'texture', 'textureAlt', 'below', 'flow', 'cap', 'x', 'y', 'rotation', 'connectionLimit'];

// TODO: sortUpdateData(keys, data, base)
function iterateSocketData(data) {
    if (data.sockets) {
        const socketsCopy = [];
        for (const socket of data.sockets) {
            const socketCopy = {};
            for (const key of socketDataKeys) {
                if (socket[key] !== undefined) {
                    socketCopy[key] = socket[key];
                }
            }
            socketsCopy.push(socketCopy);
        }
        data.sockets = socketsCopy;
    }
}

async function iterateStructures(dirPath) {
    dirPath = dirPath ?? `${foxholeDataDirectory}War/Content/Blueprints/`;
    let files = fs.readdirSync(dirPath);
    for await (const file of files) {
        const filePath = path.join(dirPath, file);
        const fileStats = fs.statSync(filePath);
        if (fileStats.isFile() && path.extname(filePath) === '.json') {
            const uAsset = JSON.parse(fs.readFileSync(filePath));
            let className = null;
            let structureCodeName = null;
            let structure = null;
            let structureData;
            let baseData = {};
            let modificationsData = [];
            for await (const uProperty of uAsset) {
                switch(uProperty.Type) {
                    case 'BlueprintGeneratedClass':
                        className = uProperty.Name ?? className;
                        if (uProperty.Super) {
                            iterateBaseStructures(uProperty, baseData);
                        }
                        break;
                    case className:
                        if (uProperty.Properties && uProperty.Properties.CodeName) {
                            structure = uProperty.Properties;
                            let parentCodeName;
                            structureCodeName = structure.CodeName.toLowerCase();
                            structureData = structureList[structureCodeName];
                            for (const [upgradingCodeName, upgradeCodeNames] of Object.entries(upgradeList)) {
                                if (upgradingCodeName === structureCodeName) {
                                    break;
                                }
                                if (upgradeCodeNames.includes(structure.CodeName)) {
                                    if (!structureList[upgradingCodeName].upgrades) {
                                        structureList[upgradingCodeName].upgrades = {};
                                    }
                                    if (!structureList[upgradingCodeName].upgrades[structureCodeName].reference) {
                                        parentCodeName = upgradingCodeName;
                                        structureData = structureList[parentCodeName].upgrades[structureCodeName] ?? { 'id': structureCodeName };
                                    }
                                    break;
                                }
                            }
                            if (structureData && !structureData.reference) {
                                structureData = {
                                    'id': structureData.id,
                                    'name': structure.DisplayName?.SourceString ?? (baseData.name ?? structure.CodeName),
                                    'codeName': structure.CodeName,
                                    'parentKey': structureData.parentKey,
                                    'prevUpgradeKey': structureData.prevUpgradeKey,
                                    'description': structure.Description?.SourceString ?? baseData.description ?? structureData.description,
                                    'category': structureData.category,
                                    'categoryOrder': structureData.categoryOrder ?? structure.BuildOrder ?? baseData.BuildOrder,
                                    'faction': structureData.faction,
                                    'color': structureData.color,
                                    'experimental': structureData.experimental,
                                    'hideInList': structureData.hideInList,
                                    'baseGarrisonRadius': structureData.baseGarrisonRadius,
                                    'tier': structureData.tier,
                                    'width': structureData.width,
                                    'length': structureData.length,
                                    'radius': structureData.radius,
                                    'range': structureData.range,
                                    //'overlapDist': structure.MinDistanceToSameStructure ? structure.MinDistanceToSameStructure / METER_UNREAL_UNITS : undefined,
                                    'overlapDist': structureData.overlapDist,
                                    'sortLayer': structureData.sortLayer,
                                    'sortOffset': structureData.sortOffset,
                                    'hitArea': undefined,
                                    'hasHandle': structureData.hasHandle,
                                    'hasOutline': structureData.hasOutline,
                                    'isBezier': structureData.isBezier,
                                    'simpleBezier': structureData.simpleBezier,
                                    'trenchConnector': structureData.trenchConnector,
                                    'lineWidth': structureData.lineWidth,
                                    'minLength': structure.ConnectorMinLength ? structure.ConnectorMinLength / METER_UNREAL_UNITS : structureData.minLength ?? baseData.minLength,
                                    'maxLength': structure.ConnectorMaxLength ? structure.ConnectorMaxLength / METER_UNREAL_UNITS : structureData.maxLength ?? baseData.maxLength,
                                    'icon': structureData.icon ?? getLocalIcon(structure) ?? baseData.icon,
                                    'texture': (typeof structureData.texture === 'string' || structureData.texture === null) ? structureData.texture : `game/Textures/Structures/${structureData.id}.webp`,
                                    'textureBorder': structureData.textureBorder,
                                    'textureFrontCap': structureData.textureFrontCap,
                                    'textureBackCap': structureData.textureBackCap,
                                    'textureIcon': structureData.textureIcon,
                                    'textureOffset': structureData.textureOffset,
                                    'garrisonSupplyMultiplier': structure.DecaySupplyDrain ?? baseData.garrisonSupplyMultiplier ?? structureData.garrisonSupplyMultiplier,
                                    'power': (structure.PowerGridInfo?.PowerDelta ?? baseData.power) / 1000 || undefined,
                                    'canSnap': structureData.canSnap,
			                        'canSnapRotate': structureData.canSnapRotate,
                                    'canSnapStructureType': structureData.canSnapStructureType,
                                    'canSnapAlongBezier': structureData.canSnapAlongBezier,
                                    'canUnion': structureData.canUnion,
                                    'ignoreSnapSettings': structureData.ignoreSnapSettings,
                                    'snapNearest': structureData.snapNearest,
                                    'requireConnection': structureData.requireConnection,
                                    'sockets': structureData.sockets,
                                    'vehicle': structureData.vehicle,
                                    'techId': structureData.techId ?? (structure.TechID && (structure.TechID !== 'ETechID::None') ? structure.TechID.substring(9).toLowerCase() : undefined),
                                    'liquidCapacity': structure.LiquidTank?.MaxAmount ?? structureData.liquidCapacity,
                                    'maxHealth': structureData.maxHealth ?? baseData.maxHealth,
                                    'structuralIntegrity': structureData.structuralIntegrity ?? baseData.structuralIntegrity,
                                    'cost': structureData.cost ?? baseData.cost,
                                    'repairCost': structureData.repairCost ?? baseData.repairCost,
                                    '_productionLength': structureData._productionLength,
                                    'production': structureData.production,
                                    'productionScaling': structureData.productionScaling,
                                    'AssemblyItems': structure.AssemblyItems,
                                    'ConversionEntries': structure.ConversionEntries,
                                    'upgrades': structureData.upgrades
                                }
                                if (structureData.texture) {
                                    structureData.hitArea = await getStructureHitArea(structureData);
                                }
                                iterateSocketData(structureData);
                                initializeStructureItems(structure);
                                if (structureData.techId) {
                                    techList[structureData.techId] = {};
                                }
                                if (structure.Modifications) {
                                    for (const [id, modification] of Object.entries(structure.Modifications)) {
                                        initializeStructureItems(modification);
                                    }
                                    modificationsData = structure.Modifications;
                                }
                                if (parentCodeName) {
                                    structureList[parentCodeName].upgrades[structureCodeName] = structureData;
                                } else {
                                    structureList[structureCodeName] = structureData;
                                }
                            }
                        }
                        break;
                    case 'ModificationSlotComponent':
                        if (structure) {
                            let modifications;
                            for (const [codeName, modification] of Object.entries(uProperty.Properties.Modifications)) {
                                let modificationData = modificationsData[codeName];
                                if (codeName !== 'EFortModificationType::Default') {
                                    const displayName = codeName.substring(23);
                                    const modificationCodeName = displayName.toLowerCase();
                                    let storedModData;
                                    if (structureData?.upgrades) {
                                        storedModData = structureData.upgrades[modificationCodeName];
                                    }
                                    if (!storedModData.reference) {
                                        modifications = modifications ?? {};
                                        modificationData = {
                                            'id': storedModData?.id,
                                            'name': modification.DisplayName?.SourceString ?? getTableString(modification.DisplayName) ?? displayName,
                                            'codeName': displayName,
                                            'prevUpgradeKey': storedModData?.prevUpgradeKey,
                                            'description': modification.Description?.SourceString ?? getTableString(modification.Description) ?? 'No Description Provided.',
                                            'range': storedModData?.range,
                                            'hitArea': undefined,
                                            'baseIcon': storedModData?.baseIcon,
                                            'icon': getLocalIcon(modification),
                                            'texture': typeof storedModData?.texture === 'string' || storedModData?.texture === null ? storedModData.texture : `game/Textures/Structures/${structureData.id}_${storedModData?.id}.webp`,
                                            'textureBorder': storedModData?.textureBorder,
                                            'textureFrontCap': storedModData?.textureFrontCap,
                                            'textureBackCap': storedModData?.textureBackCap,
                                            'positionOffset': storedModData?.positionOffset,
                                            'sockets': storedModData?.sockets,
                                            'techId': modification.TechID && (modification.TechID !== 'ETechID::None') ? modification.TechID.substring(9).toLowerCase() : undefined,
                                            'maxHealth': storedModData?.maxHealth,
                                            'structuralIntegrity': storedModData?.structuralIntegrity,
                                            'cost': storedModData?.cost,
                                            'repairCost': storedModData?.repairCost,
                                            '_productionLength': storedModData?._productionLength,
                                            'production': storedModData?.production,
                                            'productionScaling': storedModData?.productionScaling,
                                            'AssemblyItems': modificationData?.AssemblyItems,
                                            'ConversionEntries': modificationData?.ConversionEntries
                                            // There is a FuelCost variable which is never used here.
                                        }
                                        iterateSocketData(modificationData);
                                        if (modificationData.texture) {
                                            modificationData.hitArea = await getStructureHitArea(modificationData);
                                        }
                                        if (modificationData.techId) {
                                            techList[modificationData.techId] = {};
                                        }
                                        if (modificationData.cost !== false && modification.Tiers) {
                                            const tierData = modification.Tiers['EFortTier::T1'];
                                            if (tierData) {
                                                modificationData.cost = getResourceCosts(tierData.ResourceAmounts);
                                            }
                                        }
                                        modifications[modificationCodeName] = modificationData;
                                    } else {
                                        modifications[modificationCodeName] = storedModData;
                                    }
                                }
                            }
                            structureList[structureCodeName].upgrades = modifications;
                        }
                        break;
                    case 'CraneComponent':
                        if (structure && structureData && uProperty.Properties?.Config) {
                            structureList[structureCodeName]['range'] = {
                                "type": "crane",
                                "min": uProperty.Properties.Config.MinHorizontalDistanceToTarget / METER_UNREAL_UNITS,
                                "max": uProperty.Properties.Config.MaxHorizontalDistanceToTarget / METER_UNREAL_UNITS
                            };
                        }
                        break;
                }
            }
        } else if (fileStats.isDirectory()) {
            await iterateStructures(filePath);
        }
    }
}

function iterateBaseAssets(uProperty, baseData) {
    let basePath = `${foxholeDataDirectory}${uProperty.SuperStruct.ObjectPath.slice(0, -1)}json`;
    let baseAsset = fs.readFileSync(basePath);
    baseAsset = JSON.parse(baseAsset);
    let className = null;
    baseAsset.forEach(uProperty => {
        if (uProperty.Type === 'BlueprintGeneratedClass') {
            className = uProperty.Name ?? className;
            if (uProperty.Super) {
                iterateBaseAssets(uProperty, baseData);
            }
        } else if (uProperty.Type === className && uProperty.Properties) {
            const item = uProperty.Properties;
            baseData.name = item.DisplayName?.SourceString ?? baseData.name;
            baseData.description = item.Description?.SourceString ?? baseData.description;
            baseData.icon = getLocalIcon(item) ?? baseData.icon;
            baseData.faction = item.FactionVariant === 'EFactionId::Wardens' ? 'w' : item.FactionVariant === 'EFactionId::Colonials' ? 'c' : baseData.faction;
            baseData.isLiquid = item.bIsLiquid ?? baseData.isLiquid;
        }
    });
}

function getResourceCosts(resources) {
    if (resources && resources.Resource.CodeName !== 'None' && resources.Resource.CodeName !== 'Excavation') {
        let resourceCost = {};
        let resourceCodeName = resources.Resource.CodeName.toLowerCase();
        createItemEntry(resourceCodeName);
        resourceCost[resourceCodeName] = resources.Resource.Quantity;
        if (resources.OtherResources) {
            resources.OtherResources.forEach(resource => {
                resourceCodeName = resource.CodeName.toLowerCase();
                createItemEntry(resourceCodeName);
                resourceCost[resourceCodeName] = resource.Quantity;
            });
        }
        return resourceCost;
    }
}

function iterateData(filePath, list, type) {
    let rawdata = fs.readFileSync(filePath);
    let uAsset = JSON.parse(rawdata)[0];
    if (uAsset.Rows) {
        for (let [codeName, data] of Object.entries(uAsset.Rows)) {
            codeName = codeName.toLowerCase();
            const listItem = list[codeName];
            if (listItem && type === 'weapon') {
                if (data.Damage) {
                    let weapon = Object.assign({
                        codeName: codeName
                    }, weaponList[codeName], {
                        damage: data.Damage
                    });
                    if (data.DamageType.ObjectName.startsWith('BlueprintGeneratedClass')) {
                        let rawDamageData = fs.readFileSync(foxholeDataDirectory + data.DamageType.ObjectPath.split('.')[0] + '.json');
                        let damageTypeProperties = JSON.parse(rawDamageData)[1].Properties;
                        weapon.damageType = Object.assign({
                            name: damageTypeProperties.DisplayName.SourceString,
                            type: damageTypeProperties.Type.replace('EDamageType::', '').toLowerCase(),
                            description: damageTypeProperties.DescriptionDetails?.Text?.SourceString
                        }, weaponList[codeName]?.damageType);
                    }
                    weaponList[codeName] = weapon;
                }
            } else if (type === 'damageType') {
                for (const [key, weapon] of Object.entries(weaponList)) {
                    if (weapon.damageType?.type === codeName) {
                        delete weapon.damageType.type;
                        if (data.Tier1Structure !== 1 || data.Tier2Structure !== 1 || data.Tier3Structure !== 1) {
                            weapon.damageType.profiles = {
                                't1': 1 - data.Tier1Structure,
                                't2': 1 - data.Tier2Structure,
                                't3': 1 - data.Tier3Structure
                            };
                        } else {
                            delete weaponList[key];
                        }
                    }
                }
            } else if (listItem && listItem.cost !== false && !listItem.reference) {
                /*
                This seems to be where Field Modification Center pulls its data from.
                if (data.bHasTierUpgrades) {
                    if (data.UpgradeResourceAmounts && data.UpgradeResourceAmounts.Resource.CodeName !== 'None') {
                        list[codeName].UpgradeResourceAmounts = data.UpgradeResourceAmounts;
                    }
                }
                */
                if (type === 'item') {
                    if (data.AltResourceAmounts && data.AltResourceAmounts.Resource.CodeName !== 'None') {
                        listItem.cost = getResourceCosts(data.AltResourceAmounts);
                    }
                } else {
                    if (data.MaxHealth !== 0) {
                        listItem.maxHealth = data.MaxHealth;
                    }
                    if (data.StructuralIntegrity !== 1) {
                        listItem.structuralIntegrity = data.StructuralIntegrity;
                    }
                    if (data.RepairCost !== 0) {
                        listItem.repairCost = data.RepairCost;
                    }
                    if (data.ResourceAmounts && data.ResourceAmounts.Resource.CodeName !== 'None') {
                        listItem.cost = getResourceCosts(data.ResourceAmounts);
                    }
                }
            }
        }
    }
}

function iterateAssets(dirPath) {
    let files = fs.readdirSync(dirPath);
    files.forEach(file => {
        let filePath = path.join(dirPath, file);
        let fileStats = fs.statSync(filePath);
        if (fileStats.isFile() && path.extname(filePath) === '.json') {
            let rawdata = fs.readFileSync(filePath);
            let uAsset = JSON.parse(rawdata);
            let className = null;
            let baseData = {
                'name': null,
                'description': 'No Description Provided.',
                'icon': undefined,
                'faction': undefined,
                'isLiquid': undefined
            };
            uAsset.forEach(uProperty => {
                if (uProperty.Type === 'BlueprintGeneratedClass') {
                    className = uProperty.Name ?? className;
                    if (uProperty.Super) {
                        iterateBaseAssets(uProperty, baseData);
                    }
                } else if (uProperty.Type === className && uProperty.Properties) {
                    const item = uProperty.Properties;
                    if (item.CodeName) {
                        let codeName = item.CodeName.toLowerCase();
                        if (itemList[codeName]) {
                            itemList[codeName] = {
                                'name': item.DisplayName?.SourceString ?? (baseData.name ?? item.CodeName),
                                'description': item.Description?.SourceString ?? baseData.description,
                                'icon': itemList[codeName]?.icon ?? getLocalIcon(item) ?? baseData.icon,
                                'faction': item.FactionVariant === 'EFactionId::Wardens' ? 'w' : item.FactionVariant === 'EFactionId::Colonials' ? 'c' : baseData.faction,
                                'isLiquid': item.bIsLiquid ?? baseData.isLiquid,
                                'cost': itemList[codeName]?.cost
                            };
                        }
                        if (weaponList[codeName]) {
                            weaponList[codeName] = Object.assign({
                                name: item.DisplayName?.SourceString,
                                description: item.DisplayName?.SourceString,
                                icon: getLocalIcon(item)
                            }, weaponList[codeName]);
                        }
                    } else if (item.ItemInfo) {
                        for (const [codeName, techInfo] of Object.entries(item.ItemInfo)) {
                            let techCodeName = codeName.substring(9).toLowerCase();
                            if (techList[techCodeName]) {
                                techList[techCodeName] = {
                                    'name': techInfo.DisplayNameOverride?.SourceString,
                                    'description': techInfo.DescriptionOverride?.SourceString,
                                    'icon': getLocalIcon(techInfo)
                                }
                            }
                        }
                    }
                }
            });
        } else if (fileStats.isDirectory()) {
            iterateAssets(filePath);
        }
    });
}

function compareItems(oldItems, newItems) {
    if (!oldItems || !newItems) {
        return oldItems === newItems;
    }

    const oldItemCodeNames = Object.keys(oldItems);
    const newItemCodeNames = Object.keys(newItems);

    if (oldItemCodeNames.length !== newItemCodeNames.length) {
        return false;
    }

    for (const itemCodeName of oldItemCodeNames) {
        if (oldItems[itemCodeName] !== newItems[itemCodeName]) {
            return false;
        }
    }

    return true;
}

function compareRecipe(oldRecipe, newRecipe) {
    return compareItems(oldRecipe?.input, newRecipe?.input) && compareItems(oldRecipe?.output, newRecipe?.output) && (oldRecipe?.faction === newRecipe?.faction) && (oldRecipe?.time === newRecipe?.time) && (oldRecipe?.power === newRecipe?.power);
}

const liquidResourceMap = {
    'Oil': 'oilcan',
    'Water': 'watercan'
};

function updateProductionRecipes(component) {
    let id = component._productionLength ?? 0;
    let constructionRecipes = [];
    if (component.ConversionEntries?.length) {
        component.ConversionEntries.forEach(entry => {
            let constructionRecipe = {
                'id': undefined,
                'input': undefined,
                'output': undefined,
                'faction': undefined,
                'time': entry.Duration,
                'power': entry.PowerDelta ? entry.PowerDelta / 1000 : undefined
            }
            for (const [from, to] of Object.entries(conversionEntriesMap)) {
                if (entry[from]?.length) {
                    constructionRecipe[to] = constructionRecipe[to] ?? {};
                    entry[from].forEach(resource => {
                        let resourceCodeName = resource.CodeName.toLowerCase();
                        let resourceQuantity = resource.Quantity;
                        if ((from === 'Input' || from === 'Output') && itemList[resource.CodeName.toLowerCase()].isLiquid) {
                            if (liquidResourceMap[resource.CodeName]) {
                                resourceCodeName = liquidResourceMap[resource.CodeName];
                            } else {
                                console.error('Unknown liquid type. Update script for:', resource.CodeName);
                            }
                        }
                        constructionRecipe[to][resourceCodeName] = resourceQuantity;
                    });
                }
            }
            // Ensures we keep the Faction stored for an item. There shouldn't be any conflicts here.
            if (constructionRecipe.output) {
                for (let [codeName, item] of Object.entries(constructionRecipe.output)) {
                    codeName = codeName.toLowerCase();
                    if (itemList[codeName]?.faction) {
                        constructionRecipe.faction = itemList[codeName].faction;
                    }
                }
            }
            constructionRecipes.push(constructionRecipe);
        });
        delete component.ConversionEntries;
    }
    if (component.AssemblyItems?.length) {
        component.AssemblyItems.forEach(assembly => {
            let constructionRecipe = {
                'id': undefined,
                'input': {},
                'output': {},
                'faction': undefined,
                'time': assembly.Duration,
            }
            if (assembly.RequiredCodeName !== 'None') {
                constructionRecipe.input[assembly.RequiredCodeName.toLowerCase()] = 1;
            }
            let itemCodeName = assembly.CodeName.toLowerCase();
            let item = itemList[itemCodeName];
            Object.assign(constructionRecipe.input, item?.cost);
            constructionRecipe.output[itemCodeName] = 1;
            constructionRecipe.faction = item?.faction;
            constructionRecipes.push(constructionRecipe);
        });
        delete component.AssemblyItems;
    }
    if (constructionRecipes.length) {
        constructionRecipes.forEach(newRecipe => {
            let oldId = undefined;
            component.production?.every(oldRecipe => {
                if (compareRecipe(oldRecipe, newRecipe)) {
                    oldId = oldRecipe.id;
                    return false;
                }
                return true;
            });
            newRecipe.id = oldId ?? id++;
        });
        component._productionLength = id;
        component.production = constructionRecipes;
    } else if ((typeof component._productionLength !== 'undefined') || component.production) {
        delete component._productionLength;
        delete component.production;
    }
}

function sortList(list) {
    return Object.keys(list).sort().reduce((data, codeName) => {
        data[codeName] = list[codeName];
        return data;
    }, {});
}

function findFile(directory, fileName) {
    const files = fs.readdirSync(directory);
    for (const file of files) {
        const fullPath = path.join(directory, file);
        if (fs.statSync(fullPath).isDirectory()) {
            const fileInSubdir = findFile(fullPath, fileName);
            if (fileInSubdir) {
                return fileInSubdir;
            }
        }
        if (file === fileName) {
            return `.\\${fullPath}`;
        }
    }
    return null;
}

const METER_PIXEL_SCALE = 1.5625; // 50 / 32
async function getStructureHitArea(structureData) {
    const shapes = structurePolygons[path.basename(structureData.texture, '.webp')];
    if (shapes) {
        const texture = await sharp('./public/games/foxhole/assets/' + structureData.texture).metadata();
        if (texture) {
            let hitAreaPolygons = [];
            for (let i = 0; i < shapes.length; i++) {
                const shape = shapes[i].shape;
                let adjustedShape = [];
                for (let i = 0; i < shape.length; i += 2) {
                    adjustedShape.push((shape[i] - ((structureData.textureOffset?.x ?? texture.width) / 2)) / METER_PIXEL_SCALE);
                    adjustedShape.push((shape[i + 1] - ((structureData.textureOffset?.y ?? texture.height) / 2)) / METER_PIXEL_SCALE);
                }
                hitAreaPolygons.push({ 'shape': `[ ${adjustedShape.join()} ]` });
            }
            return hitAreaPolygons;
        }
    }
    return undefined;
}

async function updateData() {
    // Switch IDs for CodeNames so the parser has an easier time identifying entries as their Foxhole counterpart.
    structureList = Object.keys(structureList).reduce((structures, id) => {
        let structure = structureList[id];
        if (structure.upgrades) {
            structure.upgrades = Object.keys(structure.upgrades).reduce((upgrades, id) => {
                let upgrade = structure.upgrades[id];
                upgrades[upgrade.codeName?.toLowerCase() ?? id] = structure.upgrades[id];
                upgrade.id = id;
                return upgrades;
            }, {});
        }
        structures[structure.codeName?.toLowerCase() ?? id] = structureList[id];
        structure.id = id;
        return structures;
    }, {});

    iterateUpgradeCodeNames(`${foxholeDataDirectory}War/Content/Blueprints/`);

    await iterateStructures(`${foxholeDataDirectory}War/Content/Blueprints/`);

    iterateData(`${foxholeDataDirectory}War/Content/Blueprints/Data/BPVehicleDynamicData.json`, itemList, 'item');
    iterateData(`${foxholeDataDirectory}War/Content/Blueprints/Data/BPStructureDynamicData.json`, itemList, 'item'); // Check for items in the structure data... Yes, Material Pallet is stored here.
    iterateData(`${foxholeDataDirectory}War/Content/Blueprints/Data/BPAmmoDynamicData.json`, weaponList, 'weapon');
    iterateData(`${foxholeDataDirectory}War/Content/Blueprints/Data/DTDamageProfiles.json`, weaponList, 'damageType');
    iterateData(`${foxholeDataDirectory}War/Content/Blueprints/Data/BPStructureDynamicData.json`, structureList);

    for (const [codeName, structureData] of Object.entries(structureList)) {
        if (upgradeList[codeName] && structureData.upgrades) {
            iterateData(`${foxholeDataDirectory}War/Content/Blueprints/Data/BPStructureDynamicData.json`, structureData.upgrades, undefined, true);
        }
    }

    iterateAssets(`${foxholeDataDirectory}War/Content/Blueprints/`);

    for (let [codeName, structure] of Object.entries(structureList)) {
        updateProductionRecipes(structure);
        if (structure.upgrades) {
            for (let [id, upgrade] of Object.entries(structure.upgrades)) {
                updateProductionRecipes(upgrade);
            }
        }
    }

    for (const [codeName, item] of Object.entries(itemList)) {
        delete item.cost;
        delete item.faction;
    }

    for (const [codeName, techInfo] of Object.entries(techList)) {
        if (!Object.keys(techInfo).length) {
            delete techList[codeName];
        }
    }

    structureList = Object.keys(structureList).reduce((structures, codeName) => {
        let structure = structureList[codeName];
        if (structure.upgrades) {
            structure.upgrades = Object.keys(structure.upgrades).reduce((upgrades, codeName) => {
                let upgrade = structure.upgrades[codeName];
                upgrades[upgrade.id ?? codeName] = structure.upgrades[codeName];
                delete upgrade.id;
                return upgrades;
            }, {});
        }
        structures[structure.id ?? codeName] = structureList[codeName];
        delete structure.id;
        return structures;
    }, {});

    let foxholeDataStr = JSON.stringify({
        'categories': foxholeData.categories,
        'presets': foxholeData.presets,
        'tech': sortList(techList),
        'resources': sortList(itemList),
        'weapons': weaponList,
        'buildings': sortList(structureList)
    }, null, '\t');
    foxholeDataStr = foxholeDataStr.replaceAll('"[ ', '[ ').replaceAll(' ]"', ' ]');
    fs.writeFile('public/games/foxhole/data.js', foxholeDataVariable + foxholeDataStr, err => {
        if (err) {
            throw err;
        }
    });
}
updateData();