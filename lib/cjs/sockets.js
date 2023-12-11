"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSocketPurpose = exports.getSocketCollections = exports.getAllSockets = void 0;
const manifest_1 = require("@d2api/manifest");
function getAllSockets(def, components) {
    if (!def.sockets || !components.sockets)
        return;
    return def.sockets.socketEntries.map((socketDef, socketIndex) => {
        const socketState = components.sockets[socketIndex];
        const pluggedDef = (0, manifest_1.getInventoryItemDef)(socketState.plugHash);
        const socketType = (0, manifest_1.getSocketTypeDef)(socketDef.socketTypeHash);
        const socketCategory = (0, manifest_1.getSocketCategoryDef)(socketType?.socketCategoryHash);
        const rawData = { socketIndex, socketDef, socketType, socketCategory, pluggedDef, socketState };
        const socketPurpose = getSocketPurpose(socketDef);
        const containsDefault = socketState.plugHash === socketDef.singleInitialItemHash;
        const socketMeta = { socketPurpose, containsDefault };
        return {
            rawData,
            socketMeta,
        };
    });
}
exports.getAllSockets = getAllSockets;
function getSocketCollections(def, components) {
    const allSockets = getAllSockets(def, components);
    if (!allSockets)
        return;
    const validSockets = allSockets.filter(validateSocketBundle);
    const socketCategories = def.sockets.socketCategories.map((sc) => {
        const all = sc.socketIndexes.map((si) => allSockets[si]);
        const valid = all.filter(validateSocketBundle);
    });
    return { allSockets, validSockets, socketCategories };
}
exports.getSocketCollections = getSocketCollections;
function validateSocketBundle(sockets) {
    return sockets.rawData.socketCategory && sockets.rawData.socketType && sockets.rawData.pluggedDef;
}
function getSocketPurpose({ socketTypeHash, singleInitialItemHash, plugSources, defaultVisible, }) {
    if (socketTypeHash === 1282012138)
        return "kill_tracker";
    if (singleInitialItemHash === 1210761952 || singleInitialItemHash === 1215804699)
        return "exotic_catalyst_weapon_perk";
    if (socketTypeHash === 1215804696 || socketTypeHash === 1215804697)
        return "weapon_perk";
    if (singleInitialItemHash === 1498917124)
        return "exotic_catalyst";
    if (socketTypeHash === 3956125808 /* SocketCategoryHashes.IntrinsicTraits */)
        return "weapon_intrinsic";
    if (socketTypeHash === 965959289)
        return "armor_intrinsic";
    if (plugSources === 0 && defaultVisible === false)
        return "random_stat";
    const socketCategoryHash = (0, manifest_1.getSocketTypeDef)(socketTypeHash)?.socketCategoryHash;
    if (socketCategoryHash === 760375309 /* SocketCategoryHashes.ArmorTier */)
        return "armor_energy";
    if (socketCategoryHash === 4241085061 /* SocketCategoryHashes.WeaponPerks_Reusable */)
        return "weapon_part";
    const defaultPci = (0, manifest_1.getInventoryItemDef)(singleInitialItemHash)?.plug?.plugCategoryIdentifier;
    if (defaultPci) {
        if (defaultPci === "shader")
            return "shader";
        if (defaultPci === "exotic_all_skins")
            return "weapon_ornament";
        if (defaultPci === "armor_skins_empty")
            return "armor_ornament";
        if (defaultPci?.endsWith("masterwork"))
            return "exotic_catalyst";
        if (defaultPci?.includes("masterwork"))
            return "armor_masterwork";
    }
    if (socketCategoryHash === 2685412949 /* SocketCategoryHashes.WeaponMods */)
        return "weapon_mod";
    if (socketCategoryHash === 590099826 /* SocketCategoryHashes.ArmorMods */)
        return "armor_mod";
}
exports.getSocketPurpose = getSocketPurpose;
