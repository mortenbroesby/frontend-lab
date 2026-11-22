import { useEffect, useRef, useState } from 'react';
import { createSoundscape, type SoundCue } from './soundscape';
import type { Game } from './game';
import { storyProgress } from './sound-events';

export function useSoundscape(game: Game) {
  const context = useRef<AudioContext | null>(null);
  const score = useRef<ReturnType<typeof createSoundscape> | null>(null);
  const current = useRef(game);
  current.current = game;
  const [muted, setMuted] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const muteRef = useRef(muted);
  muteRef.current = muted;
  const progress = storyProgress(game);
  useEffect(() => {
    score.current?.setScene(game.room, progress);
  }, [game.room, progress]);
  useEffect(() => {
    function visibility() {
      const audio = context.current;
      if (!audio || audio.state === 'closed') return;
      if (document.hidden) {
        void audio.suspend().catch(() => {});
        return;
      }
      void score.current
        ?.start()
        .then(() => setBlocked(audio.state !== 'running'))
        .catch(() => setBlocked(true));
    }
    document.addEventListener('visibilitychange', visibility);
    return () => {
      document.removeEventListener('visibilitychange', visibility);
      score.current?.dispose();
      score.current = null;
      void context.current?.close().catch(() => {});
      context.current = null;
    };
  }, []);
  async function start() {
    try {
      if (!context.current) {
        if (!window.AudioContext) {
          setUnavailable(true);
          return;
        }
        const audio = new AudioContext();
        context.current = audio;
        score.current = createSoundscape(audio);
        score.current.setScene(current.current.room, storyProgress(current.current));
        score.current.setMuted(muteRef.current);
      }
      await score.current?.start();
      setBlocked(context.current.state !== 'running');
    } catch {
      setBlocked(true);
    }
  }
  function toggle() {
    if (blocked) {
      setMuted(false);
      muteRef.current = false;
      score.current?.setMuted(false);
      void start();
      return;
    }
    const next = !muted;
    setMuted(next);
    muteRef.current = next;
    score.current?.setMuted(next);
    if (!next && context.current) void start();
  }
  return {
    muted,
    blocked,
    unavailable,
    start,
    toggle,
    reset: () => score.current?.reset(),
    play: (cue: SoundCue) => score.current?.play(cue),
  };
}
