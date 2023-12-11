import { getInventoryItemDef } from "@d2api/manifest";
import { getSocketCollections } from "./sockets";
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
export function bundleItemComponents(itemComponents, itemInstanceIdOrVendorItemIndex) {
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
export function bundleInventoryItems(items, itemComponents) {
    return items.map((item) => bundleInventoryItem(item, itemComponents));
}
/** asd */
export function bundleInventoryItem(item, itemComponents) {
    const def = getInventoryItemDef(item.itemHash);
    const components = bundleItemComponents(itemComponents, item.itemInstanceId ?? "");
    const socketInfo = getSocketCollections(def, components);
    return {
        def,
        props: item,
        components,
        socketInfo,
    };
}
