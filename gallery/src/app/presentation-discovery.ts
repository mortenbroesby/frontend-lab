const sequence = [
  'arrowup',
  'arrowup',
  'arrowdown',
  'arrowdown',
  'arrowleft',
  'arrowright',
  'arrowleft',
  'arrowright',
  'b',
  'a',
];

export function advanceKonami(progress: number, key: string): number {
  const entered = [...sequence.slice(0, progress), key.toLowerCase()];
  for (let length = Math.min(entered.length, sequence.length); length > 0; length--) {
    if (
      sequence
        .slice(0, length)
        .every((value, index) => value === entered[entered.length - length + index])
    )
      return length;
  }
  return 0;
}

export function listenForPresentation(href: string): () => void {
  let progress = 0;
  const reset = () => {
    progress = 0;
  };
  const handleKey = (event: KeyboardEvent) => {
    if (ignoreDiscovery(event)) {
      reset();
      return;
    }
    if (event.repeat) return;
    progress = advanceKonami(progress, event.key);
    if (progress === sequence.length) {
      reset();
      location.assign(href);
    }
  };
  window.addEventListener('keydown', handleKey);
  window.addEventListener('blur', reset);
  window.addEventListener('focusin', reset);
  return () => {
    window.removeEventListener('keydown', handleKey);
    window.removeEventListener('blur', reset);
    window.removeEventListener('focusin', reset);
  };
}

function ignoreDiscovery(event: KeyboardEvent) {
  const modified = [
    event.defaultPrevented,
    event.isComposing,
    event.altKey,
    event.ctrlKey,
    event.metaKey,
    event.shiftKey,
  ].some(Boolean);
  if (modified || document.querySelector('[role="dialog"]')) return true;
  const target = event.target;
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable ||
      Boolean(target.closest('input, textarea, select, button, [role="slider"]')))
  );
}
