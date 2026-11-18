import { useRef, type PointerEvent } from 'react';
import { isInteractive } from './navigation';
import { swipeDelta } from './swipe';

export function useSlideSwipe(index: number, move: (delta: number) => void) {
  const gesture = useRef<{ id: number; x: number; y: number; time: number; index: number } | null>(
    null,
  );
  const cancel = () => {
    gesture.current = null;
  };
  return {
    onPointerDown(event: PointerEvent<HTMLDivElement>) {
      if (!event.isPrimary) {
        cancel();
        return;
      }
      if (event.pointerType !== 'touch' || isInteractive(event.target)) return;
      gesture.current = {
        id: event.pointerId,
        x: event.clientX,
        y: event.clientY,
        time: event.timeStamp,
        index,
      };
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    onPointerUp(event: PointerEvent<HTMLDivElement>) {
      const start = gesture.current;
      cancel();
      if (!start || start.id !== event.pointerId || start.index !== index) return;
      const delta = swipeDelta(
        event.clientX - start.x,
        event.clientY - start.y,
        event.timeStamp - start.time,
      );
      move(delta);
    },
    onPointerCancel: cancel,
    onLostPointerCapture: cancel,
  };
}
