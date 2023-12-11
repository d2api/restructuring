import { getInventoryItemDef, getSocketCategoryDef, getSocketTypeDef } from "@d2api/manifest";
import type {
  DestinyInventoryItemDefinition,
  DestinyItemSocketEntryDefinition,
  DestinyItemSocketState,
  DestinySocketCategoryDefinition,
  DestinySocketTypeDefinition,
} from "bungie-api-ts/destiny2";
import { SocketCategoryHashes } from "../d2ai-module/generated-enums.js";
import { ItemComponentBundle } from "./inventory-items.js";

/**
 * information about a single, valid, non-blanked-out socket on an instanced item.
 */
export interface ValidSocketInfoBundle {
  /** unaltered defs and profile response information */
  rawData: {
    socketIndex: number;
    socketDef: DestinyItemSocketEntryDefinition;
    socketType: DestinySocketTypeDefinition;
    socketCategory: DestinySocketCategoryDefinition;

    socketState: DestinyItemSocketState;
    pluggedDef: DestinyInventoryItemDefinition;
  };

  /** opinionated/processed information about the socket */
  socketMeta: {
    socketPurpose: SocketPurpose | undefined;
    containsDefault: boolean;
  };
}

/**
 * information about a single socket on an instanced item.
 *
 * type/category/plug information might be missing for "invalid" or unused sockets.
 */
export interface SocketInfoBundle {
  /** unaltered defs and profile response information */
  rawData: {
    socketIndex: number;
    socketDef: DestinyItemSocketEntryDefinition;
    socketType: DestinySocketTypeDefinition | undefined;
    socketCategory: DestinySocketCategoryDefinition | undefined;

    socketState: DestinyItemSocketState;
    pluggedDef: DestinyInventoryItemDefinition | undefined;
  };

  /** opinionated/processed information about the socket */
  socketMeta: {
    socketPurpose: SocketPurpose | undefined;
    containsDefault: boolean;
  };
}

export function getAllSockets(
  def: DestinyInventoryItemDefinition,
  components: Partial<ItemComponentBundle>
): SocketInfoBundle[] | undefined {
  if (!def.sockets || !components.sockets) return;
  return def.sockets.socketEntries.map((socketDef, socketIndex) => {
    const socketState = components.sockets![socketIndex];
    const pluggedDef = getInventoryItemDef(socketState.plugHash);
    const socketType = getSocketTypeDef(socketDef.socketTypeHash);
    const socketCategory = getSocketCategoryDef(socketType?.socketCategoryHash);
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

export function getSocketCollections(
  def: DestinyInventoryItemDefinition,
  components: Partial<ItemComponentBundle>
) {
  const allSockets = getAllSockets(def, components);
  if (!allSockets) return;
  const validSockets = allSockets.filter(validateSocketBundle) as ValidSocketInfoBundle[];
  const socketCategories = def.sockets!.socketCategories.map((sc) => {
    const all = sc.socketIndexes.map((si) => allSockets[si]);
    const valid = all.filter(validateSocketBundle) as ValidSocketInfoBundle[];
  });
  return { allSockets, validSockets, socketCategories };
}
export type SocketCollection = ReturnType<typeof getSocketCollections>;

function validateSocketBundle(sockets: SocketInfoBundle) {
  return sockets.rawData.socketCategory && sockets.rawData.socketType && sockets.rawData.pluggedDef;
}
// prettier-ignore
export type SocketPurpose =
  | "armor_energy"     | "armor_intrinsic"
  | "armor_masterwork" | "armor_mod"
  | "armor_ornament"   | "kill_tracker"
  | "exotic_catalyst"  | "exotic_catalyst_weapon_perk"
  | "random_stat"      | "shader"
  | "weapon_intrinsic" | "weapon_mod"
  | "weapon_ornament"  | "weapon_part"
  | "weapon_perk";

export function getSocketPurpose({
  socketTypeHash,
  singleInitialItemHash,
  plugSources,
  defaultVisible,
}: DestinyItemSocketEntryDefinition): SocketPurpose | undefined {
  if (socketTypeHash === 1282012138) return "kill_tracker";
  if (singleInitialItemHash === 1210761952 || singleInitialItemHash === 1215804699)
    return "exotic_catalyst_weapon_perk";
  if (socketTypeHash === 1215804696 || socketTypeHash === 1215804697) return "weapon_perk";
  if (singleInitialItemHash === 1498917124) return "exotic_catalyst";
  if (socketTypeHash === SocketCategoryHashes.IntrinsicTraits) return "weapon_intrinsic";
  if (socketTypeHash === 965959289) return "armor_intrinsic";

  if (plugSources === 0 && defaultVisible === false) return "random_stat";

  const socketCategoryHash = getSocketTypeDef(socketTypeHash)?.socketCategoryHash;
  if (socketCategoryHash === SocketCategoryHashes.ArmorTier) return "armor_energy";
  if (socketCategoryHash === SocketCategoryHashes.WeaponPerks_Reusable) return "weapon_part";

  const defaultPci = getInventoryItemDef(singleInitialItemHash)?.plug?.plugCategoryIdentifier;
  if (defaultPci) {
    if (defaultPci === "shader") return "shader";
    if (defaultPci === "exotic_all_skins") return "weapon_ornament";
    if (defaultPci === "armor_skins_empty") return "armor_ornament";
    if (defaultPci?.endsWith("masterwork")) return "exotic_catalyst";
    if (defaultPci?.includes("masterwork")) return "armor_masterwork";
  }

  if (socketCategoryHash === SocketCategoryHashes.WeaponMods) return "weapon_mod";
  if (socketCategoryHash === SocketCategoryHashes.ArmorMods) return "armor_mod";
}
