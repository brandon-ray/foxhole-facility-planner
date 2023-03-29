const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const fetch = require('node-fetch');

const METER_UNREAL_UNITS = 100;
const foxholeDataDirectory = 'dev/tools/Output/Exports/';
const foxholeDataVariable = 'const gameData = ';
let foxholeData = JSON.parse(fs.readFileSync('./public/games/foxhole/data.js').toString().substring(foxholeDataVariable.length));

const stStructures = JSON.parse(fs.readFileSync(`${foxholeDataDirectory}War/Content/Blueprints/StringTables/STStructures.json`))[0].StringTable.KeysToMetaData;
const structurePolygons = JSON.parse(fs.readFileSync(`dev/polygons.json`));

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
    satchelchargew: { // Satchels / Alligator Charge
        alias: 'Satchel'
    },
    satchelcharget: {
        alias: 'Havoc'
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

const requiredMeshes = {};
const ignoredMeshes = ['Headlight', 'Sphere', 'Destroyed'];
function getValidMesh(meshes = {}, property) {
    if (property?.Properties) {
        const meshObj = property.Properties.StaticMesh ?? property.Properties.SkeletalMesh;
        if (meshObj?.ObjectPath) {
            const baseName = path.parse(meshObj.ObjectPath).name;
            for (const ignoredMesh of ignoredMeshes) {
                if (baseName.includes(ignoredMesh)) {
                    return meshes;
                }
            }
            meshes[property.Name] = baseName;
        }
    }
    return meshes;
}

function fetchTextureMeshes(objData, codeName, meshProperty, meshes) {
    if (objData && objData.texture && codeName && (meshProperty || meshes)) {
        try {
            fs.accessSync('public/games/foxhole/assets/' + objData.texture, fs.constants.F_OK);
        } catch (err) {
            requiredMeshes[codeName] = meshes ?? getValidMesh(requiredMeshes[codeName], meshProperty);
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
                    baseData.bIsBuiltOnFoundation = structure.bIsBuiltOnFoundation ?? baseData.bIsBuiltOnFoundation,
                    baseData.bIsBuiltOnLandscape = structure.bIsBuiltOnLandscape ?? baseData.bIsBuiltOnLandscape,
                    baseData.bBuildOnWater = structure.bBuildOnWater ?? baseData.bBuildOnWater,
                    baseData.minLength = structure.ConnectorMinLength ? structure.ConnectorMinLength / METER_UNREAL_UNITS : undefined ?? baseData.minLength;
                    baseData.maxLength = structure.ConnectorMaxLength ? structure.ConnectorMaxLength / METER_UNREAL_UNITS : undefined ?? baseData.maxLength;
                    baseData.icon = getLocalIcon(structure) ?? baseData.icon;
                    baseData.garrisonSupplyMultiplier = structure.DecaySupplyDrain ?? baseData.garrisonSupplyMultiplier;
                    baseData.power = structure.PowerGridInfo?.PowerDelta ?? baseData.power;
                }
                break;
            case 'SkeletalMeshComponent':
                baseData.meshes = getValidMesh(baseData.meshes, uProperty);
                break;
            case 'StaticMeshComponent':
                baseData.meshes = getValidMesh(baseData.meshes, uProperty);
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

const socketDataKeys = ['id', 'name', 'type', 'texture', 'textureAlt', 'below', 'flow', 'cap', 'x', 'y', 'rotation', 'ignoreSnap', 'connectionLimit'];

// TODO: sortUpdateData(keys, data, base)
function iterateSocketData(data) {
    if (data.sockets) {
        const socketsCopy = [];
        for (const socket of data.sockets) {
            const socketCopy = {};
            for (const key of socketDataKeys) {
                if (socket[key] !== undefined) {
                    /*
                    if (key === 'x' || key === 'y') {
                        socket[key] = ((socket[key] / 1.056) / 100).round(2);
                    }
                    */
                    socketCopy[key] = socket[key];
                }
            }
            socketsCopy.push(socketCopy);
        }
        data.sockets = socketsCopy;
    }
}

const buildCategoryMap = {};
for (const [key, category] of Object.entries(foxholeData.categories)) {
    if (category.buildCategory) {
        buildCategoryMap[category.buildCategory] = key;
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
            let modificationsData = {};
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
                                    if (!structureList[upgradingCodeName].upgrades[structureCodeName]?.reference) {
                                        parentCodeName = upgradingCodeName;
                                        structureData = structureList[parentCodeName].upgrades[structureCodeName] ?? { 'id': structureCodeName };
                                    }
                                    break;
                                }
                            }
                            /*
                            if (!structureData && dirPath.startsWith('dev\\tools\\Output\\Exports\\War\\Content\\Blueprints\\Vehicles')) {
                                let containsIgnoredStr = false;
                                const ignoredStrings = [
                                    'buildsite',
                                    'destroyed',
                                    'fill'
                                ];
                                for (const ignoredStr of ignoredStrings) {
                                    if (structureCodeName.includes(ignoredStr)) {
                                        containsIgnoredStr = true;
                                        break;
                                    }
                                }
                                if (!containsIgnoredStr) {
                                    console.info(`"${structureCodeName}": {},`);
                                }
                            }
                            */
                            if (structureData && !structureData.reference) {
                                structureData = {
                                    'id': structureData.id,
                                    'name': structure.DisplayName?.SourceString ?? (baseData.name ?? structure.CodeName),
                                    'aliases': structureData.aliases,
                                    'className': structureData.className,
                                    'codeName': structure.CodeName,
                                    'parentKey': structureData.parentKey,
                                    'prevUpgradeKey': structureData.prevUpgradeKey,
                                    'description': structure.Description?.SourceString ?? baseData.description ?? structureData.description,
                                    //'category': buildCategoryMap[(structure.BuildCategory ?? baseData.BuildCategory)?.substring(16)] ?? structureData.category ?? 'misc',
                                    'category': structureData.category,
                                    'categoryOrder': structureData.categoryOrder ?? structure.BuildOrder ?? baseData.BuildOrder,
                                    'faction': structure.FactionVariant === 'EFactionId::Colonials' ? 'c' : (structure.FactionVariant === 'EFactionId::Wardens' ? 'w' : structureData.faction),
                                    'color': structureData.color,
                                    'experimental': structureData.experimental,
                                    'hideInList': structureData.hideInList,
                                    'baseGarrisonRadius': structureData.baseGarrisonRadius,
                                    'tier': structureData.tier,
                                    'width': structureData.width,
                                    'length': structureData.length,
                                    'radius': structureData.radius,
                                    'range': structureData.range,
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
                                    'minExtLength': structureData.minExtLength,
                                    'maxExtLength': structureData.maxExtLength,
                                    'maxRange': structure.MaxRange ? structure.MaxRange / METER_UNREAL_UNITS : undefined,
                                    'icon': structureData.icon ?? getLocalIcon(structure) ?? baseData.icon,
                                    'texture': (typeof structureData.texture === 'string' || structureData.texture === null) ? structureData.texture : `game/Textures/Structures/${structureData.id}.webp`,
                                    'textureBorder': structureData.textureBorder,
                                    'textureFrontCap': structureData.textureFrontCap,
                                    'textureBackCap': structureData.textureBackCap,
                                    'texturePost': structureData.texturePost,
                                    'texturePostDist': structureData.texturePostDist,
                                    'textureOffset': structureData.textureOffset,
                                    'buildOnFoundation': (structure.bIsBuiltOnFoundation ?? baseData.bIsBuiltOnFoundation) === true || undefined,
                                    'buildOnWater': (structure.bBuildOnWater ?? baseData.bBuildOnWater),
                                    'preventOnLandscape': (structure.bIsBuiltOnLandscape ?? baseData.bIsBuiltOnLandscape) === false || undefined,
                                    'garrisonSupplyMultiplier': structure.DecaySupplyDrain ?? baseData.garrisonSupplyMultiplier ?? structureData.garrisonSupplyMultiplier,
                                    'power': (structure.PowerGridInfo?.PowerDelta ?? baseData.power) / 1000 || undefined,
                                    'canSnap': structureData.canSnap,
			                        'canSnapRotate': structureData.canSnapRotate,
                                    'canSnapStructureType': structureData.canSnapStructureType,
                                    'canSnapAlongBezier': structureData.canSnapAlongBezier,
                                    'canUnion': structureData.canUnion,
                                    'ignoreSnapSettings': structureData.ignoreSnapSettings,
                                    'snapGrab': structureData.snapGrab,
                                    'snapNearest': structureData.snapNearest,
                                    'emplaced': structureData.emplaced,
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
                                if (structure.MaximumRange) {
                                    structureData.range.max = structure.MaximumRange / METER_UNREAL_UNITS;
                                }
                                if (structureData.texture) {
                                    structureData.hitArea = await getStructureHitArea(structureData);
                                }
                                initializeStructureItems(structure);
                                if (structureData.techId) {
                                    techList[structureData.techId] = {};
                                }
                                if (structure.Modifications) {
                                    for (const [id, modification] of Object.entries(structure.Modifications)) {
                                        modificationsData[id] = modification;
                                        initializeStructureItems(modification);
                                    }
                                }
                                fetchTextureMeshes(structureData, structureCodeName, undefined, baseData.meshes);
                                if (parentCodeName) {
                                    structureList[parentCodeName].upgrades[structureCodeName] = structureData;
                                } else {
                                    structureList[structureCodeName] = structureData;
                                }
                            }
                        }
                        break;
                    case 'ModificationSlotComponent':
                        if (structure && structureList[structureCodeName]) {
                            let modifications;
                            for (const [codeName, modification] of Object.entries(uProperty.Properties.Modifications)) {
                                let modificationData = modificationsData[codeName];
                                if (codeName !== 'EFortModificationType::Default') {
                                    const displayName = codeName.substring(23);
                                    const modificationCodeName = displayName.toLowerCase();
                                    let storedModData = structureData?.upgrades[modificationCodeName] ?? {};
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
                                            'texturePost': structureData.texturePost,
                                            'texturePostDist': structureData.texturePostDist,
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
                    case 'SkeletalMeshComponent':
                        fetchTextureMeshes(structureData, structureCodeName, uProperty);
                        break;
                    case 'StaticMeshComponent':
                        fetchTextureMeshes(structureData, structureCodeName, uProperty);
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
    let uAsset = JSON.parse(rawdata);
    for (const uProperty of uAsset) {
        if (uProperty.Type === 'DataTable' && uProperty.Rows) {
            for (let [codeName, data] of Object.entries(uProperty.Rows)) {
                codeName = codeName.toLowerCase();
                let listItem = list[codeName];
                if (!listItem && !type) {
                    for (const v of Object.values(list)) {
                        if (v.upgrades && v.upgrades[codeName]) {
                            listItem = v.upgrades[codeName];
                            break;
                        }
                    }
                }
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
                } else if (type === 'gunner' && codeName.endsWith('gunner') && list[codeName.slice(0, -6)]) {
                    listItem = list[codeName.slice(0, -6)];
                    if (!listItem.range) {
                        listItem.range = {
                            type: '',
                            min: 0,
                            max: 0
                        };
                    }
                    listItem.range.min = data.MinDistance / 100; // ArtilleryAccuracyMinDist
                    listItem.range.max = data.MaxDistance / 100; // ArtilleryAccuracyMaxDist / MaxReachability
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
                        } else if (data.AltResourceAmounts && data.AltResourceAmounts.Resource.CodeName !== 'None') {
                            listItem.cost = getResourceCosts(data.AltResourceAmounts);
                        }
                    }
                }
            }
        } else if (type === 'map' && uProperty.Type === 'BPMapList_C' && uProperty?.Properties?.MapDatabase) {
            for (let [codeName, data] of Object.entries(uProperty.Properties.MapDatabase)) {
                codeName = codeName.toLowerCase();
                let listItem = list[codeName];
                if (listItem) {
                    if (!data.bIsInHexGrid) {
                        delete list[codeName];
                    } else {
                        list[codeName] = {
                            name: data.DisplayName?.SourceString,
                            regionId: listItem.regionId,
                            icon: `game/${data.Image.ObjectPath.replace('/Processed/', '/Icons/').slice(12, -1)}webp`,
                            texture: `game/${data.Image.ObjectPath.slice(12, -1)}png`,
                            gridCoord: {
                                x: data.GridCoord.X > 10 ? data.GridCoord.X - 4294967296 : data.GridCoord.X,
                                y: data.GridCoord.Y > 10 ? data.GridCoord.Y - 4294967296 : data.GridCoord.Y
                            },
                            //mapTextItems: listItem.mapTextItems
                        };
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

const METER_PIXEL_SCALE = 52.8 / 32; // Meter in pixels of a texture divided by the width of a meter on the grid / board.
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
                    adjustedShape.push(((shape[i] - ((structureData.textureOffset?.x ?? texture.width) / 2)) / METER_PIXEL_SCALE).round(2));
                    adjustedShape.push(((shape[i + 1] - ((structureData.textureOffset?.y ?? texture.height) / 2)) / METER_PIXEL_SCALE).round(2));
                }
                hitAreaPolygons.push({ 'shape': `[ ${adjustedShape.join()} ]` });
            }
            return hitAreaPolygons;
        }
    }
    return undefined;
}

Number.prototype.round = function(n) {
    const d = Math.pow(10, n);
    return Math.round((this + Number.EPSILON) * d) / d;
}

async function updateData() {
    const presetsDir = './public/games/foxhole/assets/presets/';
    fs.readdir(presetsDir, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            return;
        }
        files.forEach(file => {
            if (path.extname(file) === '.json') {
                const filePath = path.join(presetsDir, file);
                fs.readFile(filePath, 'utf8', (err, data) => {
                    if (err) {
                        console.error('Error reading file:', filePath, err);
                        return;
                    }
                    try {
                        const preset = JSON.parse(data);
                        let subDirName = path.basename(file, '.json');
                        let subDirPath = path.join(presetsDir, subDirName);
                        let subDirIndex = 0;
                        while (fs.existsSync(subDirPath)) {
                            subDirIndex++;
                            subDirName = path.basename(file, '.json') + subDirIndex;
                            subDirPath = path.join(presetsDir, subDirName);
                        }

                        fs.mkdirSync(subDirPath);
                        fs.renameSync(filePath, path.join(subDirPath, 'preset.json'));

                        foxholeData.presets[subDirName] = {
                            name: preset.name,
                            description: preset.description,
                            author: preset.authors
                        }
                    } catch (e) {
                        console.error('Error processing file:', filePath, e);
                    }
                });
            }
        });
    });

    Object.entries(foxholeData.presets).forEach(([key, preset]) => {
        const fullresPrePath = presetsDir + key + '.png';
        const directoryPath = presetsDir + key + '/';
        const fullresPath = directoryPath + 'fullres.png';
        const previewPath = directoryPath + 'preview.webp';
        const iconPath = directoryPath + 'icon.webp';

        if (fs.existsSync(fullresPrePath)) {
            fs.renameSync(fullresPrePath, fullresPath);

            /*
            if (preset.file) {
                const sourceFilePath = presetsDir + preset.file + '.json';
                const newFilePath = path.join(directoryPath, 'preset.json');

                if (fs.existsSync(directoryPath)) {
                    console.error(`Error: Subdirectory "${directoryPath}" already exists.`);
                    return;
                }

                fs.mkdirSync(directoryPath);
                fs.renameSync(sourceFilePath, newFilePath);

                delete preset.file;
            }
            */

            const padding = 50; // trim({ threshold: 50 })
            sharp(fullresPath).metadata().then(metadata => {
                const resizeWidth = Math.max(metadata.width + (padding * 2), metadata.height + (padding * 2));
                sharp(fullresPath)
                .extend({ top: resizeWidth - metadata.width / 2, bottom: resizeWidth - metadata.width / 2, left: resizeWidth - metadata.height / 2, right: resizeWidth - metadata.height / 2, background: { r: 0, g: 0, b: 0, alpha: 0 } })
                .toBuffer((err, resizedImage, resizeInfo) => {
                    if (err) {
                        console.error(err);
                        return;
                    }
                    sharp(resizedImage).trim().toBuffer((err, buffer, trimInfo) => {
                        if (err) {
                            console.error(err);
                            return;
                        }
                        let leftOffset = Math.max(-trimInfo.trimOffsetLeft - padding, 0);
                        let topOffset = Math.max(-trimInfo.trimOffsetTop - padding, 0);
        
                        let width = Math.min(trimInfo.width + (padding * 2), resizeInfo.width);
                        let height = Math.min(trimInfo.height + (padding * 2), resizeInfo.height);

                        sharp(resizedImage).extract({ left: leftOffset, top: topOffset, width: width, height: height }).resize({ width: 512 }).webp({ quality: 90 }).toFile(previewPath, (err, info) => {
                            if (err) {
                                console.error(err, fullresPath, metadata, resizeInfo, resizeWidth, leftOffset, topOffset, width, height);
                                return;
                            }
                        });
        
                        const maxSize = Math.max(width, height);
                        leftOffset += width / 2;
                        topOffset += height / 2;
                        leftOffset -= maxSize / 2;
                        topOffset -= maxSize / 2;
        
                        sharp(resizedImage).extract({ left: Math.round(leftOffset), top: Math.round(topOffset), width: maxSize, height: maxSize }).resize({ width: 256 }).webp({ quality: 90 }).toFile(iconPath, (err, info) => {
                            if (err) {
                                console.error(err);
                                return;
                            }
                        });
                    });
                });
            });
        }
    });

    const importDirectory = './public/games/foxhole/assets/game/Textures/Import';
    const exportDirectory = './public/games/foxhole/assets/game/Textures/Structures';

    fs.readdirSync(importDirectory).forEach(file => {
        if (file.endsWith('.png')) {
            sharp(`${importDirectory}/${file}`).metadata((err, metadata) => {
                if (err) {
                    throw err;
                }

                sharp(`${importDirectory}/${file}`).trim().toBuffer((err, data, info) => {
                    if (err) {
                        throw err;
                    }

                    /* Uncomment for structures that have predefined width/length/radius like bunkers, trenches, etc.
                    const origin = {
                        x: Math.round(metadata.width / 2) + info.trimOffsetLeft,
                        y: Math.round(metadata.height / 2) + info.trimOffsetTop
                    }

                    const trimOrigin = {
                        x: Math.round(info.width / 2),
                        y: Math.round(info.height / 2)
                    }
                    */

                    const structureName = file.split('.')[0].toLowerCase();
                    if (structureList[structureName]) {
                        sharp(data).resize(Math.round(info.width / 2), Math.round(info.height / 2)).webp({ quality: 90 }).toFile(`${exportDirectory}/${structureName}.webp`, (err) => {
                            if (err) {
                                throw err;
                            }
                        });
                        /* Uncomment for structures that have predefined width/length/radius like bunkers, trenches, etc.
                        structureList[structureName].textureOffset = {
                            x: trimOrigin.x - (trimOrigin.x - origin.x),
                            y: trimOrigin.y - (trimOrigin.y - origin.y)
                        };
                        */
                    } else {
                        console.info('Could not find structure for imported image in list: ', structureName);
                    }
                });
            });
        }
    });

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

    /*
    foxholeData.maps = {};
    await fetch('https://war-service-live.foxholeservices.com/api/worldconquest/maps')
    .then(response => response.json())
    .then(async data => {
        for await (const map of data) {
            await fetch('https://war-service-live.foxholeservices.com/api/worldconquest/maps/' + map + '/static')
            .then(response => response.json())
            .then(data => {
                foxholeData.maps[map.toLowerCase()] = data;
            }).catch(error => console.error(error));
        }
    })
    .catch(error => console.error(error));
    */

    iterateUpgradeCodeNames(`${foxholeDataDirectory}War/Content/Blueprints/`);

    await iterateStructures(`${foxholeDataDirectory}War/Content/Blueprints/`);

    for (const [codeName, meshes] of Object.entries(requiredMeshes)) {
        console.info(`"${codeName}":`, Object.values(meshes), ",");
    }

    iterateData(`${foxholeDataDirectory}War/Content/Blueprints/Data/BPVehicleDynamicData.json`, itemList, 'item');
    iterateData(`${foxholeDataDirectory}War/Content/Blueprints/Data/BPStructureDynamicData.json`, itemList, 'item'); // Check for items in the structure data... Yes, Material Pallet is stored here.
    iterateData(`${foxholeDataDirectory}War/Content/Blueprints/Data/BPAmmoDynamicData.json`, weaponList, 'weapon');
    iterateData(`${foxholeDataDirectory}War/Content/Blueprints/Data/DTDamageProfiles.json`, weaponList, 'damageType');
    iterateData(`${foxholeDataDirectory}War/Content/Blueprints/Data/BPMapList.json`, foxholeData.maps, 'map');
    //iterateData(`${foxholeDataDirectory}War/Content/Blueprints/Data/BPVehicleDynamicData.json`, structureList, 'item');
    iterateData(`${foxholeDataDirectory}War/Content/Blueprints/Data/BPMountDynamicData.json`, structureList, 'gunner');
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
        iterateSocketData(structure);
        if (structure.upgrades) {
            structure.upgrades = Object.keys(structure.upgrades).reduce((upgrades, codeName) => {
                let upgrade = structure.upgrades[codeName];
                iterateSocketData(upgrade);
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
        'maps': sortList(foxholeData.maps),
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