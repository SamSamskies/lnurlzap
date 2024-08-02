import { SimplePool } from "nostr-tools/pool";
import * as nip19 from "nostr-tools/nip19";
import { LiveEvent } from "nostr-tools/kinds";

const verifiedSymbol = Symbol("verified");

export interface Event {
  kind: number;
  tags: string[][];
  content: string;
  created_at: number;
  pubkey: string;
  id: string;
  sig: string;
  [verifiedSymbol]?: boolean;
}

type Filter = {
  ids?: string[];
  kinds?: number[];
  authors?: string[];
  since?: number;
  until?: number;
  limit?: number;
  search?: string;
  [key: `#${string}`]: string[] | undefined;
};

export const DEFAULT_RELAYS = [
  "wss://relay.damus.io",
  "wss://nostr.wine",
  "wss://relay.nostr.band",
  "wss://nos.lol",
];

export const is32ByteHex = (str: string) => /^[0-9a-fA-F]{64}$/.test(str);

const findOneFromRelays = async (
  relays: string[],
  filter: Filter,
): Promise<Event | null> => {
  let pool;

  try {
    pool = new SimplePool();

    return await pool.get(
      Array.from(new Set([...relays, ...DEFAULT_RELAYS])),
      filter,
    );
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Something went wrong :(",
    );
  } finally {
    if (pool) {
      try {
        pool.close(relays);
      } catch {
        // fail silently for errors that happen when closing the pool
      }
    }
  }
};

const findFromRelays = async (
  relays: string[],
  filter: Filter,
): Promise<Event[]> => {
  let pool;

  try {
    pool = new SimplePool();

    return await pool.querySync(
      Array.from(new Set([...relays, ...DEFAULT_RELAYS])),
      filter,
    );
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Something went wrong :(",
    );
  } finally {
    if (pool) {
      try {
        pool.close(relays);
      } catch {
        // fail silently for errors that happen when closing the pool
      }
    }
  }
};

export const getUserProfile = (pubkey: string, relays = DEFAULT_RELAYS) =>
  findOneFromRelays([...relays, "wss://purplepag.es"], {
    authors: [pubkey],
    kinds: [0],
  });

export const getRelayListMetadata = (pubkey: string) =>
  findOneFromRelays(["wss://purplepag.es"], {
    authors: [pubkey],
    kinds: [10002],
  });

export const getUserProfileAndRelayListMetadata = (pubkey: string) =>
  findFromRelays(["wss://purplepag.es"], {
    authors: [pubkey],
    kinds: [0, 10002],
  });

export const findEvent = (id: string, relays = DEFAULT_RELAYS) => {
  if (is32ByteHex(id)) {
    return findOneFromRelays(relays, {
      ids: [id],
    });
  }

  const { type, data } = nip19.decode(id);

  switch (type) {
    case "npub":
      return getUserProfile(data as string, relays);
    case "nprofile":
      return getUserProfile((data as nip19.ProfilePointer).pubkey, [
        ...relays,
        ...((data as nip19.ProfilePointer).relays ?? []),
      ]);
    case "note":
      return findOneFromRelays(relays, {
        ids: [data as string],
      });
    case "nevent":
      return findOneFromRelays(
        [...relays, ...((data as nip19.EventPointer).relays ?? [])],
        {
          ids: [(data as nip19.EventPointer).id],
        },
      );
    case "naddr":
      return findOneFromRelays(
        [...relays, ...((data as nip19.AddressPointer).relays ?? [])],
        {
          authors: [(data as nip19.AddressPointer).pubkey],
          kinds: [(data as nip19.AddressPointer).kind],
          "#d": [(data as nip19.AddressPointer).identifier],
        },
      );
    default:
      throw new Error("invalid nip-19 entity");
  }
};

export const extractLnurlOrLightningAddress = (profileMetadataEvent: Event) => {
  const { lud06, lud16 } = JSON.parse(profileMetadataEvent.content);

  return lud16 || lud06;
};

export const validateNostrId = (id: string) => {
  if (is32ByteHex(id)) {
    return true;
  }

  try {
    const { type, data } = nip19.decode(id);

    switch (type) {
      case "npub":
      case "nprofile":
      case "note":
      case "nevent":
      case "naddr":
        return true;
      default:
        return false;
    }
  } catch {
    return false;
  }
};

export const getPubkeyToZap = (event: Event) => {
  if (event.kind === LiveEvent) {
    const hostPubkeyTag = (event.tags ?? []).find(
      (tag) => tag[0] === "p" && tag[3] === "host",
    );

    return hostPubkeyTag ? hostPubkeyTag[1] : event.pubkey;
  }

  return event.pubkey;
};
