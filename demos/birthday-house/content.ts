import type { Action, Game } from './game';
import { locations } from './locations';
function breakfastFeedback(s: Game) {
  if (s.breakfast) return 'Three lights. The darkroom unlocks.';
  return s.sequence.length
    ? `Next: the ${['buns', 'cake', 'coffee cup'][s.sequence.length]}.`
    : 'The cabinet is waiting. Buns → cake → coffee. Your lights are safe.';
}
function darkroomFeedback(s: Game) {
  if (s.plate) return 'Two stars across. Three rising. The attic awaits.';
  if (!s.negative) return 'First, take the glass plate from the camera.';
  return s.bath
    ? `Next: the ${s.bath === 1 ? 'rain' : 'star'} bath.`
    : 'Start with the moon bath → rain → star. Progress is safe.';
}
function atticFeedback(s: Game, action: Action) {
  if (s.revealed) return 'A memory, kept for you.';
  if (action === 'insert') return 'The lantern wakes.';
  if (action === 'project') return 'Still asleep. Horizontal II (2), vertical III (3).';
  return 'A quiet click. The light shifts.';
}
export function feedback(before: Game, after: Game, action: Action) {
  if (after.room !== before.room) return locations[after.room]!.subtitle;
  if (action === 'darkroom') return 'Still locked. Wake the three cabinet lights.';
  if (action === 'attic') return 'Develop the glass plate to open the attic.';
  if (action === 'takeplate') return 'Glass plate found. Try the moon bath.';
  return [breakfastFeedback, darkroomFeedback, atticFeedback][after.room]!(after, action);
}
