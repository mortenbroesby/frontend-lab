import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';
import type { FocusAction, FocusScope } from '@lab/demo-kit/focus';

type Handler = (action: FocusAction) => boolean;
const Handoff = createContext<{
  active: boolean;
  setActive: (active: boolean) => void;
  focus: FocusScope;
  setScope: (scope: FocusScope) => void;
  input: Handler;
  register: (handler: Handler) => () => void;
} | null>(null);
export function PresentationFocus({ children }: { children: ReactNode }) {
  const [active, setActive] = useState(false);
  const [scope, setScope] = useState<FocusScope>('tv');
  const handler = useRef<Handler | null>(null);
  const register = useCallback((next: Handler) => {
    handler.current = next;
    return () => {
      if (handler.current === next) handler.current = null;
    };
  }, []);
  const input = useCallback((action: FocusAction) => handler.current?.(action) ?? false, []);
  return (
    <Handoff
      value={{ active, setActive, focus: active ? scope : 'slides', setScope, input, register }}
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
