import { capacity, validBatch } from './reactions.ts';
export type HostMessage =
  | { type: 'welcome' | 'presence'; count: number }
  | { type: 'reactions'; sender: string; emojis: string[] }
  | { type: 'error'; message: string };
const validCount = (data: Record<string, unknown>) =>
  typeof data.count === 'number' &&
  Number.isInteger(data.count) &&
  data.count >= 1 &&
  data.count <= capacity;
const validators = new Map<string, (data: Record<string, unknown>) => boolean>([
  ['welcome', validCount],
  ['presence', validCount],
  ['reactions', (data) => typeof data.sender === 'string' && validBatch(data.emojis)],
  ['error', (data) => typeof data.message === 'string'],
]);
export function parseHostMessage(value: unknown): HostMessage | null {
  if (!value || typeof value !== 'object') return null;
  const data = value as Record<string, unknown>;
  const validate = validators.get(data.type as string);
  if (!validate) return null;
  return validate(data) ? (data as HostMessage) : null;
}
