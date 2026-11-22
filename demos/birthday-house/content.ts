import type { Action, Game } from './game';
import { locations } from './locations';
function breakfastFeedback(s: Game) {
  if (s.breakfast) return 'Three little suns wake inside the cabinet. Somewhere, a door unlocks.';
  return s.sequence.length
    ? `Your lights are safe. Next, touch the ${['buns', 'cake', 'coffee cup'][s.sequence.length]}.`
    : 'The cabinet is waiting. Start with the buns, then cake, then coffee. Wrong choices will not undo your lights.';
}
function darkroomFeedback(s: Game) {
  if (s.plate)
    return 'Constellations bloom on the glass. Two stars across. Three stars rising. You wrap the plate carefully.';
  if (!s.negative)
    return 'An empty tray, waiting for a memory. Perhaps the camera still holds one.';
  return s.bath
    ? `Your progress is safe. Next, lower the plate into the ${s.bath === 1 ? 'rain' : 'star'} bath.`
    : 'Start with the moon bath, then rain, then star. Nothing is lost if you try another tray.';
}
function atticFeedback(s: Game, action: Action) {
  if (s.revealed)
    return 'The sun opens its eyes. This was the memory the house was keeping for you.';
  if (action === 'insert')
    return 'The glass settles into its slot. A slender beam finds the shutters.';
  if (action === 'project')
    return 'The sun is still asleep. Set Horizontal II (2) and Vertical III (3), then release the light.';
  return 'A brass wheel clicks. The light travels quietly across the shutters.';
}
export function feedback(before: Game, after: Game, action: Action) {
  if (after.room !== before.room) return locations[after.room]!.subtitle;
  if (action === 'darkroom')
    return 'The door is locked. Three unlit symbols watch from inside the cabinet.';
  if (action === 'attic') return 'A note on the stairs: “Bring a memory that can hold the light.”';
  if (action === 'takeplate')
    return 'You lift a cool glass plate from the camera. A memory is sleeping inside it.';
  return [breakfastFeedback, darkroomFeedback, atticFeedback][after.room]!(after, action);
}
