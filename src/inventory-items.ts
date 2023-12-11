import type {
  DestinyInventoryItemDefinition,
  DestinyItemComponent,
  DestinyItemComponentSetOfint32,
  DestinyItemComponentSetOfint64,
  DestinyItemInstanceComponent,
  DestinyItemObjectivesComponent,
  DestinyItemPerksComponent,
  DestinyItemPlugComponent,
  DestinyItemPlugObjectivesComponent,
  DestinyItemRenderComponent,
  DestinyItemReusablePlugsComponent,
  DestinyItemSocketsComponent,
  DestinyItemStatsComponent,
  DestinyItemTalentGridComponent,
} from "bungie-api-ts/destiny2";
import { getInventoryItemDef } from "@d2api/manifest";
import { getSocketCollections, SocketCollection } from "./sockets";

export type InventoryItemInfoBundle = {
  /** basic properties like quantity, location, bucket, state, tooltips, etc */
  props: DestinyItemComponent;
  def: DestinyInventoryItemDefinition;
  components: Partial<ItemComponentBundle>;
  socketInfo: SocketCollection;
};

export type ItemComponentBundle = {
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
export function bundleItemComponents(
  itemComponents: DestinyItemComponentSetOfint64 | DestinyItemComponentSetOfint32,
  itemInstanceIdOrVendorItemIndex: string
): Partial<ItemComponentBundle> {
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

export function bundleInventoryItems(
  items: DestinyItemComponent[],
  itemComponents: DestinyItemComponentSetOfint64
): InventoryItemInfoBundle[] {
  return items.map((item) => bundleInventoryItem(item, itemComponents));
}

/** asd */
export function bundleInventoryItem(
  item: DestinyItemComponent,
  itemComponents: DestinyItemComponentSetOfint64
): InventoryItemInfoBundle {
  const def = getInventoryItemDef(item.itemHash)!;
  const components = bundleItemComponents(itemComponents, item.itemInstanceId ?? "");
  const socketInfo: SocketCollection = getSocketCollections(def, components);
  return {
    def,
    props: item,
    components,
    socketInfo,
  };
}
