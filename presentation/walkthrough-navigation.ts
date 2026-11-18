import { isFocusAction, slideDelta } from '@lab/demo-kit/focus';
import type { RemoteAction } from './remote-protocol';
import type { WalkthroughState } from '@lab/demo-kit/walkthrough';

export function walkthroughAction(action: RemoteAction, state: WalkthroughState) {
  if (action === 'demo-play') return 'play';
  if (action === 'demo-stop') return 'stop';
  if (action === 'back' || action === 'left') return state.index > 0 ? 'back' : null;
  if (action === 'right' || action === 'select')
    return state.index < state.total - 1 ? 'next' : null;
  return null;
}

export function remoteSlideDelta(action: RemoteAction, allowPrevious: boolean) {
  return isFocusAction(action) && allowPrevious ? slideDelta(action) : 0;
}
