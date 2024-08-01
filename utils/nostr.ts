import { SimplePool } from "nostr-tools/pool";
import * as nip19 from "nostr-tools/nip19";

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

export const is32ByteHex = (str) => /^[0-9a-fA-F]{64}$/.test(str);

const normalizeUserId = (userId: string) => {
  if (is32ByteHex(userId)) {
    return userId;
  }

  const { type, data } = nip19.decode(userId);

  switch (type) {
    case "npub":
      return data;
    case "nprofile":
      // @ts-ignore
      return data.pubkey;
    default:
      throw new Error("invalid nip-19 entity");
  }
};

export const findOneFromRelays = async (relays: string[], filter: Filter) => {
  let pool;

  try {
    pool = new SimplePool();

    return await pool.get([...relays, ...DEFAULT_RELAYS], filter);
  } catch (error) {
    return error instanceof Error ? error.message : "Something went wrong :(";
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

export const getUserProfile = (
  pubkey: string,
  relays: string[] = DEFAULT_RELAYS,
) =>
  findOneFromRelays(
    Array.from(new Set([...DEFAULT_RELAYS, ...relays, "wss://purplepag.es"])),
    {
      authors: [pubkey],
      kinds: [0],
    },
  );

export const findEvent = (relays: string[], id: string) => {
  if (is32ByteHex(id)) {
    return findOneFromRelays(relays, {
      ids: [id],
    });
  }

  const { type, data } = nip19.decode(id);
  console.log({ type, data });

  switch (type) {
    case "npub":
      return getUserProfile(data as string, relays);
    case "nprofile":
      return getUserProfile((data as nip19.ProfilePointer).pubkey, [
        ...relays,
        ...(data as nip19.ProfilePointer).relays,
      ]);
    case "note":
      return findOneFromRelays(relays, {
        ids: [data as string],
      });
    case "nevent":
      return findOneFromRelays(
        [...relays, ...(data as nip19.EventPointer).relays],
        {
          ids: [(data as nip19.EventPointer).id],
        },
      );
    case "naddr":
      return findOneFromRelays(
        [...relays, ...(data as nip19.AddressPointer).relays],
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
