import { connectedMirrors } from './mini-games.ts';
import type { Game } from './game';
import type { ObjectId } from './locations';
export type Reaction = { object: ObjectId; kind: 'touch' | 'collect' | 'progress' | 'complete' };
const discoveries = [
  ['revealed', 'frame', 'complete'],
  ['breakfast', 'cabinet', 'complete'],
  ['plate', 'fix', 'complete'],
  ['note', 'note', 'collect'],
  ['recipe', 'recipe', 'collect'],
  ['negative', 'camera', 'collect'],
  ['inserted', 'projector', 'progress'],
] as const;
export function reactionFor(before: Game, after: Game): Reaction | null {
  if (before.room !== after.room) return null;
  const discovery = discoveries.find(([key]) => !before[key] && after[key]);
  if (discovery) return { object: discovery[1], kind: discovery[2] };
  if (after.sequence.length > before.sequence.length)
    return { object: 'cabinet', kind: 'progress' };
  if (connectedMirrors(after.mirrors) > connectedMirrors(before.mirrors))
    return { object: 'fix', kind: 'progress' };
  if (after.horizontal !== before.horizontal || after.vertical !== before.vertical)
    return { object: 'projector', kind: 'progress' };
  return null;
}
