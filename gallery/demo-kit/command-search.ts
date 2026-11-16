export function matchesCommand(command: { label: string; group: string }, query: string) {
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
