import { useState } from 'react';
import { initialState, act, type Action, type Game } from './game';
import { useRoomTransition } from './room-transition';
import { useSoundscape } from './use-soundscape';
import { soundFor } from './sound-events';
import { reactionFor, type Reaction } from './reactions';
import type { SceneReaction } from './interaction-effects';
import type { ObjectId } from './locations';
import { feedback } from './content';
import { tr } from './language';

const doors: Partial<Record<ObjectId, Action>> = {
  breakfast: 'breakfast',
  darkroom: 'darkroom',
  attic: 'attic',
};
export function instantAction(id: ObjectId, room: number) {
  if (room === 0 && (id === 'bun' || id === 'cake' || id === 'cup')) return id;
  return doors[id];
}
function actionNote(before: Game, after: Game, action: Action) {
  if (action === 'readnote' || action === 'readrecipe')
    return tr('Gemt i din notesbog.', 'Saved in your notebook.');
  return feedback(before, after, action);
}
export function useHouseRound(close: () => void, enterRoom: () => void) {
  const [game, setGame] = useState(initialState);
  const [note, setNote] = useState('');
  const [reaction, setReaction] = useState<SceneReaction | null>(null);
  const audio = useSoundscape(game);
  const passage = useRoomTransition();
  function reactTo(next: Reaction) {
    setReaction((previous) => ({ ...next, serial: (previous?.serial ?? 0) + 1 }));
  }
  function perform(action: Action, keep = false) {
    if (passage.busy) return;
    const next = act(game, action);
    audio.play(soundFor(game, next, action));
    const commit = () => {
      setGame(next);
      setNote(actionNote(game, next, action));
    };
    if (next.room !== game.room) {
      close();
      setReaction(null);
      passage.begin(() => {
        commit();
        enterRoom();
      });
      return;
    }
    commit();
    const response = reactionFor(game, next);
    if (response) reactTo(response);
    if (!keep) close();
  }
  function resetRound() {
    passage.cancel();
    audio.reset();
    setGame(initialState());
    setReaction(null);
    setNote('');
  }
  function finishReaction(serial: number) {
    setReaction((current) => (current?.serial === serial ? null : current));
  }
  return {
    game,
    note,
    setNote,
    reaction,
    reactTo,
    audio,
    passage,
    perform,
    resetRound,
    finishReaction,
  };
}
