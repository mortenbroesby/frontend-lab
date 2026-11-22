import type { Action, Game } from './game';
import { locations } from './locations';
function breakfastFeedback(s: Game) {
  if (s.breakfast) return 'Three little suns wake above the fireplace. Somewhere, a door unlocks.';
  return s.sequence.length
    ? 'A golden light lifts from the table and settles in the cabinet.'
    : 'The lights settle back into darkness. The invitation might know the order.';
}
function darkroomFeedback(s: Game) {
  if (s.plate)
    return 'Constellations bloom on the glass. Two stars across. Three stars rising. You wrap the plate carefully.';
  if (!s.negative)
    return 'An empty tray, waiting for a memory. Perhaps the camera still holds one.';
  return s.bath
    ? 'Silver moves beneath the surface. The image is beginning to remember.'
    : 'The silver clouds over. The glass can be tried again; nothing is lost.';
}
function atticFeedback(s: Game, action: Action) {
  if (s.revealed)
    return 'The sun opens its eyes. This was the memory the house was keeping for you.';
  if (action === 'insert')
    return 'The glass settles into its slot. A slender beam finds the shutters.';
  if (action === 'project') return 'The light brushes the wood, but the sun is still asleep.';
  return 'A brass wheel clicks. The light travels quietly across the shutters.';
}
export function feedback(before: Game, after: Game, action: Action) {
  if (after.room !== before.room) return locations[after.room]!.subtitle;
  if (action === 'darkroom')
    return 'The door is locked. Three unlit symbols watch from above the fireplace.';
  if (action === 'attic') return 'A note on the stairs: “Bring a memory that can hold the light.”';
  if (action === 'takeplate')
    return 'You lift a cool glass plate from the camera. A memory is sleeping inside it.';
  return [breakfastFeedback, darkroomFeedback, atticFeedback][after.room]!(after, action);
}
