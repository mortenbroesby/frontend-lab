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
  return [
    tr('Begynd med månebadet.', 'Begin with the moon bath.'),
    tr('Månen lyser. Prøv nu regnbadet.', 'The moon glows. Try the rain bath next.'),
    tr(
      'Regnen falder til ro. Nu mangler kun stjernebadet.',
      'The rain settles. Only the star bath remains.',
    ),
  ][s.bath]!;
}
function atticFeedback(s: Game, action: Action) {
  if (s.revealed) return tr('Lyset samler sig…', 'The light is gathering…');
  if (action === 'lightwick')
    return tr(
      'Vægen brænder. Tilbage til tryllelygten.',
      'The wick is lit. Return to the magic lantern.',
    );
  if (action === 'insert')
    return tr(
      'Pladen er på plads. Find nissens lygte.',
      'The plate is in place. Find the elf’s lantern.',
    );
  if (action === 'project')
    return s.wickLit
      ? tr('Se på stjernerne på glaspladen igen.', 'Look again at the stars on your glass plate.')
      : tr('Lyset mangler. Se efter nissens lygte.', 'It needs light. Look for the elf’s lantern.');
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
    'Glaspladen er fundet. Prøv månebadet.',
    'You found the glass plate. Try the moon bath.',
  ],
};
export function feedback(before: Game, after: Game, action: Action) {
  if (after.room !== before.room) return getLocation(after.room).subtitle;
  const message = actionMessages[action];
  if (message) return tr(...message);
  return [breakfastFeedback, darkroomFeedback, atticFeedback][after.room]!(after, action);
}
