import { kv } from "@vercel/kv";
import { Event, isRegularEvent } from "./nostr";

const eventKeyPrefix = "event:";

export const getCachedEvent = (eventId: string): Promise<Event | null> =>
  kv.get(`${eventKeyPrefix}${eventId}`);

export const cacheEvent = (eventId: string, event: Event) => {
  const expirationTime = 7 * 24 * 60 * 60; // 1 week in seconds

  if (!isRegularEvent(event)) {
    return;
  }

  return kv.set(`${eventKeyPrefix}${eventId}`, event, { ex: expirationTime });
};
