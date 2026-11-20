import type { ImpactKind, Round } from './rules';

type Note = [delay: number, from: number, to: number, voice: OscillatorType];
const knock: Note = [0, 160, 52, 'triangle'];
const cues: Partial<Record<ImpactKind, Note[]>> = {
  merge: [[0, 330, 495, 'triangle']],
  block: [knock, [0.34, 730, 395, 'sawtooth']],
  reject: [knock],
  regression: [[0, 220, 98, 'triangle']],
  test: [[0, 220, 740, 'triangle']],
};

export function playCue(context: AudioContext | null, impact: Round['impact']) {
  if (!context || !impact) return;
  const now = context.currentTime;
  cues[impact.kind]?.forEach(([delay, from, to, voice]) =>
    chirp(context, now + delay, from, to, voice),
  );
}

function chirp(
  context: AudioContext,
  now: number,
  from: number,
  to: number,
  voice: OscillatorType,
) {
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = voice;
  oscillator.frequency.setValueAtTime(from, now);
  oscillator.frequency.exponentialRampToValueAtTime(to, now + 0.1);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(voice === 'triangle' ? 0.12 : 0.035, now + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);
  oscillator.connect(gain).connect(context.destination);
  oscillator.onended = () => {
    oscillator.disconnect();
    gain.disconnect();
  };
  oscillator.start(now);
  oscillator.stop(now + 0.15);
}
