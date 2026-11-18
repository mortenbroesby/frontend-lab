import {
  isWalkthroughCommand,
  isWalkthroughState,
  type WalkthroughCommand,
  type WalkthroughState,
} from './walkthrough.ts';
import { isFocusAction, isFocusScope, type FocusAction, type FocusScope } from './focus.ts';
/** Small, origin-checked contract between a presentation and an independent demo. */
export type EmbedMessage =
  | { type: 'lab:walkthrough-command'; action: WalkthroughCommand }
  | { type: 'lab:walkthrough-state'; state: WalkthroughState }
  | { type: 'lab:demo-input'; action: FocusAction }
  | { type: 'lab:demo-focus'; scope: FocusScope }
  | {
      type: 'lab:demo-ready' | 'lab:demo-enter' | 'lab:demo-exit' | 'lab:demo-return';
    };
export function isEmbedMessage(
  event: { source: unknown; origin: string; data: unknown },
  source: unknown,
  origin: string,
): event is { source: unknown; origin: string; data: EmbedMessage } {
  if (!source || event.source !== source || event.origin !== origin) return false;
  const data = event.data;
  if (!data || typeof data !== 'object' || !('type' in data)) return false;
  if (data.type === 'lab:walkthrough-command')
    return 'action' in data && isWalkthroughCommand(data.action);
  if (data.type === 'lab:walkthrough-state')
    return 'state' in data && isWalkthroughState(data.state);
  if (data.type === 'lab:demo-input') return 'action' in data && isFocusAction(data.action);
  if (data.type === 'lab:demo-focus') return 'scope' in data && isFocusScope(data.scope);
  return ['lab:demo-ready', 'lab:demo-enter', 'lab:demo-exit', 'lab:demo-return'].includes(
    data.type as string,
  );
}
