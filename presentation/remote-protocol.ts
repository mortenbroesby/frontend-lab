import { isDemoStatus, type DemoStatus } from './demo-readiness.ts';
import { isWalkthroughState, type WalkthroughState } from '@lab/demo-kit/walkthrough';
import {
  isFocusAction,
  isFocusScope,
  type FocusAction,
  type FocusScope,
} from '@lab/demo-kit/focus';
export type RemoteAction = FocusAction | 'next-slide' | 'demo-play' | 'demo-stop' | 'demo-retry';
function isRemoteAction(value: unknown): value is RemoteAction {
  return (
    isFocusAction(value) ||
    ['next-slide', 'demo-play', 'demo-stop', 'demo-retry'].includes(value as string)
  );
}
export type RemoteState = {
  kind: 'state';
  focus: FocusScope;
  demoStatus: DemoStatus | null;
  walkthrough: WalkthroughState | null;
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
  | { kind: 'input'; action: RemoteAction; request: string; slide: number };

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
  if (v.kind === 'input')
    return (
      isRemoteAction(v.action) &&
      Number.isInteger(v.slide) &&
      Number(v.slide) >= 0 &&
      Number(v.slide) < 200 &&
      text(v.request, 64) &&
      v.request.length > 0
    );
  return isRemoteState(v);
}
function isRemoteState(v: Record<string, unknown>): boolean {
  return (
    v.kind === 'state' &&
    isFocusScope(v.focus) &&
    validDemoState(v) &&
    validPosition(v) &&
    text(v.title, 300) &&
    text(v.notes, 12000) &&
    text(v.next, 300) &&
    text(v.elapsed, 20)
  );
}

function validDemoState(v: Record<string, unknown>) {
  return (
    (v.demoStatus === null || isDemoStatus(v.demoStatus)) &&
    (v.walkthrough === null || isWalkthroughState(v.walkthrough))
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
