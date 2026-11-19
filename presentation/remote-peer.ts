import type { RemoteMessage } from './remote-protocol';

/** Role negotiation and liveness belong to the app, independently of relay health. */
export function createRemotePeer(remote: boolean, now = Date.now) {
  const candidates = new Set<string>();
  let peer: string | null = null;
  let seenAt = now();
  const alive = () => peer !== null && now() - seenAt < 10000;
  function acceptHello(role: 'host' | 'remote', id: string) {
    if (role !== (remote ? 'host' : 'remote')) return false;
    peer = id;
    seenAt = now();
    return true;
  }
  return {
    alive,
    paired: () => peer !== null,
    retryDue: (delay: number) => now() - seenAt >= delay,
    targets: () => (peer ? [peer] : [...candidates]),
    joined: (id: string) => candidates.add(id),
    left(id: string) {
      candidates.delete(id);
      if (peer === id) peer = null;
    },
    accept(message: RemoteMessage, id: string) {
      if (peer !== null && peer !== id) return false;
      if (message.kind === 'hello') return acceptHello(message.role, id);
      if (peer !== id || !alive()) return false;
      if (message.kind === 'state' && remote) seenAt = now();
      return true;
    },
  };
}
