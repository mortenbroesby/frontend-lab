import type { Action, Game } from './game';
import type { SoundCue } from './soundscape';
const objects: Partial<Record<Action, SoundCue>> = {
  readnote: 'paper',
  readrecipe: 'paper',
  takeplate: 'progress',
  develop: 'water',
  stop: 'water',
  fix: 'water',
  insert: 'brass',
  horizontal: 'brass',
  vertical: 'brass',
  project: 'brass',
};
export function storyProgress(game: Game) {
  return Number(game.breakfast) + Number(game.plate) + Number(game.revealed);
}
export function soundFor(before: Game, after: Game, action: Action): SoundCue {
  if (after.room !== before.room) return 'door';
  if (after.revealed && !before.revealed) return 'finale';
  if (after.plate && !before.plate) return 'developed';
  if (after.breakfast && !before.breakfast) return 'progress';
  if (after.sequence.length > before.sequence.length) return 'brass';
  return objects[action] ?? 'touch';
}
