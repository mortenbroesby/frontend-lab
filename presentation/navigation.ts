import { focusAction } from '@lab/demo-kit/focus';
type Shortcut = Pick<
  KeyboardEvent,
  'key' | 'repeat' | 'altKey' | 'ctrlKey' | 'metaKey' | 'shiftKey'
>;

export function navigationAction(event: Shortcut, interactive: boolean) {
  if (
    interactive ||
    event.repeat ||
    event.altKey ||
    event.ctrlKey ||
    event.metaKey ||
    event.shiftKey
  )
    return undefined;
  return event.key === ' ' ? 'right' : focusAction(event.key);
}

export function moveSlide(current: number, delta: number, total: number) {
  return Math.max(0, Math.min(total - 1, current + delta));
}

export function isInteractive(target: EventTarget | null) {
  return (
    target instanceof Element &&
    Boolean(
      target.closest(
        'input, textarea, select, button, a, [contenteditable]:not([contenteditable="false"]), [role="slider"], [role="button"], [role="dialog"], [data-presentation-interactive]',
      ),
    )
  );
}

export function navigateToSlide(
  current: { index: number; autoEnter: boolean },
  target: number,
  total: number,
) {
  const index = moveSlide(current.index, target - current.index, total);
  return index === current.index ? current : { index, autoEnter: index > current.index };
}
