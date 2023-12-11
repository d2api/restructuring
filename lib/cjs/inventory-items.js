"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bundleInventoryItem = exports.bundleInventoryItems = exports.bundleItemComponents = void 0;
const manifest_1 = require("@d2api/manifest");
const sockets_1 = require("./sockets");
/**
 * uses itemComponents from a profile response (`DestinyProfileResponse.itemComponents`)
 *
 * or from a vendor response (`DestinyVendorResponse.itemComponents`)
 *
 * or from a vendors response (`DestinyVendorsResponse.itemComponents[number]`)
 *
 * extracts the components of a single instanced item, from the overall
 * itemComponents dict, and bundles them into a simplified structure
 */
function bundleItemComponents(itemComponents, itemInstanceIdOrVendorItemIndex) {
    return {
        instance: itemComponents?.instances?.data?.[itemInstanceIdOrVendorItemIndex],
        objectives: itemComponents?.objectives?.data?.[itemInstanceIdOrVendorItemIndex],
        plugObjectives: itemComponents?.plugObjectives?.data?.[itemInstanceIdOrVendorItemIndex],
        plugStates: itemComponents?.plugStates?.data?.[itemInstanceIdOrVendorItemIndex],
        renderData: itemComponents?.renderData?.data?.[itemInstanceIdOrVendorItemIndex],
        talentGrid: itemComponents?.talentGrids?.data?.[itemInstanceIdOrVendorItemIndex],
        perks: itemComponents?.perks?.data?.[itemInstanceIdOrVendorItemIndex]?.perks,
        reusablePlugs: itemComponents?.reusablePlugs?.data?.[itemInstanceIdOrVendorItemIndex]?.plugs,
        sockets: itemComponents?.sockets?.data?.[itemInstanceIdOrVendorItemIndex]?.sockets,
        stats: itemComponents?.stats?.data?.[itemInstanceIdOrVendorItemIndex]?.stats,
    };
}
exports.bundleItemComponents = bundleItemComponents;
function bundleInventoryItems(items, itemComponents) {
    return items.map((item) => bundleInventoryItem(item, itemComponents));
}
exports.bundleInventoryItems = bundleInventoryItems;
/** asd */
function bundleInventoryItem(item, itemComponents) {
    const def = (0, manifest_1.getInventoryItemDef)(item.itemHash);
    const components = bundleItemComponents(itemComponents, item.itemInstanceId ?? "");
    const socketInfo = (0, sockets_1.getSocketCollections)(def, components);
    return {
        def,
        props: item,
        components,
        socketInfo,
    };
}
exports.bundleInventoryItem = bundleInventoryItem;
