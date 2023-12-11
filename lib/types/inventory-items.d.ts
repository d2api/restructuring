import type { DestinyInventoryItemDefinition, DestinyItemComponent, DestinyItemComponentSetOfint32, DestinyItemComponentSetOfint64, DestinyItemInstanceComponent, DestinyItemObjectivesComponent, DestinyItemPerksComponent, DestinyItemPlugComponent, DestinyItemPlugObjectivesComponent, DestinyItemRenderComponent, DestinyItemReusablePlugsComponent, DestinyItemSocketsComponent, DestinyItemStatsComponent, DestinyItemTalentGridComponent } from "bungie-api-ts/destiny2";
import { SocketCollection } from "./sockets";
export declare type InventoryItemInfoBundle = {
    /** basic properties like quantity, location, bucket, state, tooltips, etc */
    props: DestinyItemComponent;
    def: DestinyInventoryItemDefinition;
    components: Partial<ItemComponentBundle>;
    socketInfo: SocketCollection;
};
export declare type ItemComponentBundle = {
    instance: DestinyItemInstanceComponent;
    objectives: DestinyItemObjectivesComponent;
    perks: DestinyItemPerksComponent["perks"];
    plugObjectives: DestinyItemPlugObjectivesComponent;
    plugStates: DestinyItemPlugComponent;
    renderData: DestinyItemRenderComponent;
    reusablePlugs: DestinyItemReusablePlugsComponent["plugs"];
    sockets: DestinyItemSocketsComponent["sockets"];
    stats: DestinyItemStatsComponent["stats"];
    talentGrid: DestinyItemTalentGridComponent;
};
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
export declare function bundleItemComponents(itemComponents: DestinyItemComponentSetOfint64 | DestinyItemComponentSetOfint32, itemInstanceIdOrVendorItemIndex: string): Partial<ItemComponentBundle>;
export declare function bundleInventoryItems(items: DestinyItemComponent[], itemComponents: DestinyItemComponentSetOfint64): InventoryItemInfoBundle[];
/** asd */
export declare function bundleInventoryItem(item: DestinyItemComponent, itemComponents: DestinyItemComponentSetOfint64): InventoryItemInfoBundle;
