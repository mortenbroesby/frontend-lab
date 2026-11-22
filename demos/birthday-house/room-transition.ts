import { useEffect, useRef, useState } from 'react';
type Phase = 'idle' | 'leaving' | 'waiting' | 'arriving';
export function useRoomTransition() {
  const [phase, setPhase] = useState<Phase>('idle');
  const current = useRef<Phase>('idle');
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const change = (next: Phase) => {
    current.current = next;
    setPhase(next);
  };
  useEffect(() => () => clearTimeout(timer.current), []);
  return {
    phase,
    busy: phase !== 'idle',
    begin(commit: () => void) {
      if (current.current !== 'idle') return;
      change('leaving');
      timer.current = setTimeout(() => {
        change('waiting');
        commit();
      }, 280);
    },
    ready() {
      if (current.current !== 'waiting') return;
      change('arriving');
      timer.current = setTimeout(() => change('idle'), 650);
    },
    cancel() {
      clearTimeout(timer.current);
      change('idle');
    },
  };
}
