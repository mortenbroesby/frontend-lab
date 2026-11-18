export type RemoteState = {
  kind: 'state';
  demoActive: boolean;
  index: number;
  total: number;
  title: string;
  notes: string;
  next: string;
  elapsed: string;
};
export type RemoteMessage =
  | RemoteState
  | { kind: 'hello'; role: 'host' | 'remote' }
  | { kind: 'return'; request: string }
  | { kind: 'move'; delta: -1 | 1; request: string };

export function remoteRoom(hash: string): string | null {
  return /^#remote=([a-f0-9]{32})$/.exec(hash)?.[1] ?? null;
}
function text(value: unknown, max: number): value is string {
  return typeof value === 'string' && value.length <= max;
}
export function isRemoteMessage(value: unknown): value is RemoteMessage {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  if (v.kind === 'hello') return v.role === 'host' || v.role === 'remote';
  if (v.kind === 'return') return text(v.request, 64) && v.request.length > 0;
  if (v.kind === 'move')
    return (v.delta === -1 || v.delta === 1) && text(v.request, 64) && v.request.length > 0;
  return isRemoteState(v);
}
function isRemoteState(v: Record<string, unknown>): boolean {
  return (
    v.kind === 'state' &&
    typeof v.demoActive === 'boolean' &&
    validPosition(v) &&
    text(v.title, 300) &&
    text(v.notes, 12000) &&
    text(v.next, 300) &&
    text(v.elapsed, 20)
  );
}

function validPosition(v: Record<string, unknown>) {
  return (
    Number.isInteger(v.index) &&
    Number.isInteger(v.total) &&
    Number(v.total) > 0 &&
    Number(v.total) <= 200 &&
    Number(v.index) >= 0 &&
    Number(v.index) < Number(v.total)
  );
}
