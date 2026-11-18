/** Commands shared by keyboard, phone and embedded experiences. */
const keys = {
  up: 'ArrowUp',
  down: 'ArrowDown',
  left: 'ArrowLeft',
  right: 'ArrowRight',
  select: 'Enter',
  back: 'Escape',
} as const;
export type FocusAction = keyof typeof keys;
export type FocusScope = 'slides' | 'tv' | 'playback';
export function isFocusAction(value: unknown): value is FocusAction {
  return typeof value === 'string' && Object.hasOwn(keys, value);
}
export function isFocusScope(value: unknown): value is FocusScope {
  return ['slides', 'tv', 'playback'].includes(value as string);
}
export function focusKey(action: FocusAction) {
  return keys[action];
}
export function focusAction(key: string): FocusAction | undefined {
  if (key === 'Backspace') return 'back';
  return (Object.keys(keys) as FocusAction[]).find((action) => keys[action] === key);
}
export function slideDelta(action: FocusAction) {
  if (action === 'right' || action === 'down') return 1;
  if (action === 'left' || action === 'up' || action === 'back') return -1;
  return 0;
}
