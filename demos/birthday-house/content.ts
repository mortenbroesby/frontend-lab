import { tr } from './language.ts';
import type { Action, Game } from './game';
import { getLocation } from './locations';
function breakfastFeedback(s: Game) {
  if (s.breakfast)
    return tr(
      'Tre lys. Døren til mørkekammeret går op.',
      'Three lights. The darkroom door swings open.',
    );
  return s.sequence.length
    ? tr(
        `Næste: ${['bollerne', 'kagen', 'kaffekoppen'][s.sequence.length]}.`,
        `Next: ${['the buns', 'the cake', 'the coffee cup'][s.sequence.length]}.`,
      )
    : tr(
        'Skabet venter. Boller → kage → kaffe. Dine lys bliver ved med at lyse.',
        'The cabinet is waiting. Buns → cake → coffee. Your lights will stay lit.',
      );
}
function darkroomFeedback(s: Game) {
  if (s.plate)
    return tr(
      'Glaspladen er klar. Trappen til højre er nu åben.',
      'The glass plate is ready. The stairs on the right are open.',
    );
  if (!s.negative)
    return tr(
      'Tag først glaspladen fra kameraet.',
      'First, take the glass plate out of the camera.',
    );
  return tr(
    'Drej spejlene, så nissens lys finder glaspladen.',
    'Turn the mirrors to guide the elf’s light onto the glass plate.',
  );
}
function atticFeedback(s: Game, action: Action) {
  if (s.revealed) return tr('Lyset samler sig…', 'The light is gathering…');
  if (action === 'insert') return tr('Lygten vågner.', 'The lantern stirs.');
  if (action === 'project')
    return tr(
      'Stadig i dvale. Vandret II (2), lodret III (3).',
      'Still asleep. Horizontal II (2), vertical III (3).',
    );
  return tr('Et sagte klik. Lyset flytter sig.', 'A soft click. The light shifts.');
}
const actionMessages: Partial<Record<Action, [danish: string, english: string]>> = {
  darkroom: [
    'Stadig låst. Tænd skabets tre små lys.',
    'Still locked. Light the three little lamps on the cabinet.',
  ],
  attic: [
    'Fremkald glaspladen for at åbne døren til loftet.',
    'Develop the glass plate to open the attic door.',
  ],
  takeplate: [
    'Glaspladen er fundet. Nissens stjernelygte venter ved badene.',
    'You found the glass plate. The elf’s star lantern is waiting by the trays.',
  ],
  nissegift: [
    'Nissens messingknap er din. En lille ekstramelodi følger med.',
    'The elf’s brass button is yours, along with a little tune.',
  ],
};
export function feedback(before: Game, after: Game, action: Action) {
  if (after.room !== before.room) return getLocation(after.room).subtitle;
  const message = actionMessages[action];
  if (message) return tr(...message);
  return [breakfastFeedback, darkroomFeedback, atticFeedback][after.room]!(after, action);
}
