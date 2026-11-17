type Shortcut = Pick<
  KeyboardEvent,
  'key' | 'repeat' | 'altKey' | 'ctrlKey' | 'metaKey' | 'shiftKey'
>;

export function navigationDelta(event: Shortcut, interactive: boolean) {
  if (
    interactive ||
    event.repeat ||
    event.altKey ||
    event.ctrlKey ||
    event.metaKey ||
    event.shiftKey
  )
    return 0;
  if (event.key === 'ArrowRight' || event.key === 'ArrowDown' || event.key === ' ') return 1;
  if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') return -1;
  return 0;
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
