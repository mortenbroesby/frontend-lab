import { connectedMirrors } from './mini-games.ts';
import type { Action, Game } from './game';
import type { SoundCue } from './soundscape';
const objects: Partial<Record<Action, SoundCue>> = {
  readnote: 'paper',
  readrecipe: 'paper',
  takeplate: 'progress',
  mirror0: 'brass',
  mirror1: 'brass',
  mirror2: 'brass',
  nissegift: 'bonus',
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
  if (connectedMirrors(after.mirrors) > connectedMirrors(before.mirrors)) return 'progress';
  if (after.breakfast && !before.breakfast) return 'progress';
  if (after.sequence.length > before.sequence.length) return 'brass';
  return objects[action] ?? 'touch';
}
