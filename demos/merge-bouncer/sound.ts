import type { Action } from './rules';

const tones: Partial<Record<Action, [number, number]>> = {
  merge: [330, 495],
  bounce: [160, 52],
  test: [220, 740],
};

// The stamp is a short falling knock; the lab tube rises as the ticket leaves.
export function playCue(context: AudioContext | null, action: Action) {
  const tone = tones[action];
  if (!context || !tone) return;
  const [from, to] = tone;
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const now = context.currentTime;
  oscillator.type = 'triangle';
  oscillator.frequency.setValueAtTime(from, now);
  oscillator.frequency.exponentialRampToValueAtTime(to, now + 0.1);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.12, now + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);
  oscillator.connect(gain).connect(context.destination);
  oscillator.onended = () => {
    oscillator.disconnect();
    gain.disconnect();
  };
  oscillator.start(now);
  oscillator.stop(now + 0.15);
}
