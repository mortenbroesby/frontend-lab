import { capacity, validBatch } from './reactions.ts';
import type { HostMessage } from './room-protocol.ts';

/** The creator routes events; guests never connect to each other. */
export function createHostRoom(
  receive: (batch: string[], sender: string) => void,
  peers: (count: number) => void,
) {
  const guests = new Map<
    string,
    {
      send: (message: HostMessage) => void;
      tokens: number;
      last: number;
    }
  >();
  function broadcast(message: HostMessage, except?: string) {
    for (const [id, guest] of guests) if (id !== except) guest.send(message);
  }
  function presence() {
    peers(guests.size);
    broadcast({ type: 'presence', count: guests.size + 1 });
  }
  return {
    join(id: string, send: (message: HostMessage) => void) {
      if (guests.has(id)) {
        send({ type: 'welcome', count: guests.size + 1 });
        return true;
      }
      if (guests.size >= capacity - 1) {
        send({
          type: 'error',
          message: 'Room full. Ask someone to leave, or create another room.',
        });
        return false;
      }
      guests.set(id, { send, tokens: 20, last: Date.now() });
      send({ type: 'welcome', count: guests.size + 1 });
      presence();
      return true;
    },
    leave(id: string) {
      if (guests.delete(id)) presence();
    },
    receive(id: string, value: unknown) {
      const guest = guests.get(id);
      if (!guest || !validBatch(value)) return;
      const now = Date.now();
      guest.tokens = Math.min(20, guest.tokens + (now - guest.last) / 100);
      guest.last = now;
      if (guest.tokens < value.length) return;
      guest.tokens -= value.length;
      receive(value, id);
      broadcast({ type: 'reactions', sender: id, emojis: value }, id);
    },
    publish(emojis: string[]) {
      if (validBatch(emojis)) broadcast({ type: 'reactions', sender: 'host', emojis });
    },
  };
}
