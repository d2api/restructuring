import type { DestinyInventoryItemDefinition, DestinyItemSocketEntryDefinition, DestinyItemSocketState, DestinySocketCategoryDefinition, DestinySocketTypeDefinition } from "bungie-api-ts/destiny2";
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
export declare function getAllSockets(def: DestinyInventoryItemDefinition, components: Partial<ItemComponentBundle>): SocketInfoBundle[] | undefined;
export declare function getSocketCollections(def: DestinyInventoryItemDefinition, components: Partial<ItemComponentBundle>): {
    allSockets: SocketInfoBundle[];
    validSockets: ValidSocketInfoBundle[];
    socketCategories: {
        socketCategory: import("bungie-api-ts/destiny2").DestinyItemSocketCategoryDefinition;
        allSockets: SocketInfoBundle[];
        validSockets: ValidSocketInfoBundle[];
    }[];
} | undefined;
export declare type SocketCollection = ReturnType<typeof getSocketCollections>;
export declare type SocketPurpose = "armor_energy" | "armor_intrinsic" | "armor_masterwork" | "armor_mod" | "armor_ornament" | "kill_tracker" | "exotic_catalyst" | "exotic_catalyst_weapon_perk" | "random_stat" | "shader" | "weapon_intrinsic" | "weapon_mod" | "weapon_ornament" | "weapon_part" | "weapon_perk";
export declare function getSocketPurpose({ socketTypeHash, singleInitialItemHash, plugSources, defaultVisible, }: DestinyItemSocketEntryDefinition): SocketPurpose | undefined;
