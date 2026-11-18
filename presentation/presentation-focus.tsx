import type { RemoteAction } from './remote-protocol';
import type { WalkthroughState } from '@lab/demo-kit/walkthrough';
import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';
import type { FocusScope } from '@lab/demo-kit/focus';

type Handler = (action: RemoteAction) => boolean;
const Handoff = createContext<{
  walkthrough: WalkthroughState | null;
  setWalkthrough: (state: WalkthroughState | null) => void;
  active: boolean;
  setActive: (active: boolean) => void;
  focus: FocusScope;
  setScope: (scope: FocusScope) => void;
  input: Handler;
  register: (handler: Handler) => () => void;
} | null>(null);
export function PresentationFocus({ children }: { children: ReactNode }) {
  const [walkthrough, setWalkthrough] = useState<WalkthroughState | null>(null);
  const [active, setActive] = useState(false);
  const [scope, setScope] = useState<FocusScope>('tv');
  const handler = useRef<Handler | null>(null);
  const register = useCallback((next: Handler) => {
    handler.current = next;
    return () => {
      if (handler.current === next) handler.current = null;
    };
  }, []);
  const input = useCallback((action: RemoteAction) => handler.current?.(action) ?? false, []);
  return (
    <Handoff
      value={{
        walkthrough,
        setWalkthrough,
        active,
        setActive,
        focus: active ? scope : 'slides',
        setScope,
        input,
        register,
      }}
    >
      {children}
    </Handoff>
  );
}
export function usePresentationFocus() {
  const value = useContext(Handoff);
  if (!value) throw new Error('Presentation focus requires PresentationFocus');
  return value;
}
