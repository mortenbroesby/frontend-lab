import type { Action, Game } from './game';
import { locations } from './locations';
function breakfastFeedback(s: Game) {
  if (s.breakfast) return 'Tre lys. Døren til mørkekammeret går op.';
  return s.sequence.length
    ? `Næste: ${['bollerne', 'kagen', 'kaffekoppen'][s.sequence.length]}.`
    : 'Skabet venter. Boller → kage → kaffe. Dine lys bliver ved med at lyse.';
}
function darkroomFeedback(s: Game) {
  if (s.plate) return 'To stjerner vandret. Tre lodret. Loftet venter.';
  if (!s.negative) return 'Tag først glaspladen fra kameraet.';
  return s.bath
    ? `Næste: ${s.bath === 1 ? 'regnbadet' : 'stjernebadet'}.`
    : 'Begynd med månebadet → regn → stjerne. Intet går tabt.';
}
function atticFeedback(s: Game, action: Action) {
  if (s.revealed) return 'Lyset samler sig…';
  if (action === 'insert') return 'Lygten vågner.';
  if (action === 'project') return 'Stadig i dvale. Vandret II (2), lodret III (3).';
  return 'Et sagte klik. Lyset flytter sig.';
}
export function feedback(before: Game, after: Game, action: Action) {
  if (after.room !== before.room) return locations[after.room]!.subtitle;
  if (action === 'darkroom') return 'Stadig låst. Tænd skabets tre små lys.';
  if (action === 'attic') return 'Fremkald glaspladen for at åbne døren til loftet.';
  if (action === 'takeplate') return 'Glaspladen er fundet. Prøv månebadet.';
  return [breakfastFeedback, darkroomFeedback, atticFeedback][after.room]!(after, action);
}
