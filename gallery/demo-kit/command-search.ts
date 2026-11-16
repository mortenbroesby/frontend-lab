export function matchesCommand(command: { label: string; group: string }, query: string) {
  if (command.group === 'Demos' && !query.trim()) return false;
  const text = `${command.group} ${command.label}`.toLowerCase();
  return query
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .every((word) => text.includes(word));
}

export function isCommandShortcut(
  event: Pick<
    KeyboardEvent,
    'key' | 'metaKey' | 'ctrlKey' | 'altKey' | 'shiftKey' | 'repeat' | 'isComposing'
  >,
) {
  return (
    event.key.toLowerCase() === 'k' &&
    (event.metaKey || event.ctrlKey) &&
    !event.altKey &&
    !event.shiftKey &&
    !event.repeat &&
    !event.isComposing
  );
}

export function developerShortcut(
  event: Pick<
    KeyboardEvent,
    'code' | 'altKey' | 'shiftKey' | 'ctrlKey' | 'metaKey' | 'repeat' | 'isComposing'
  >,
) {
  if (
    !event.altKey ||
    !event.shiftKey ||
    event.ctrlKey ||
    event.metaKey ||
    event.repeat ||
    event.isComposing
  )
    return;
  return ({ KeyD: 'debug', KeyG: 'gallery' } as const)[event.code as 'KeyD' | 'KeyG'];
}
