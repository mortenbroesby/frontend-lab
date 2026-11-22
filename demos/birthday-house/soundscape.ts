import { createVoices } from './sound-voices';
import { birthdayMelody, nisseMelody } from './birthday-melody';
import { createMelodyPlayer } from './sound-melody';

export type SoundCue =
  | 'touch'
  | 'paper'
  | 'brass'
  | 'water'
  | 'door'
  | 'nisse'
  | 'progress'
  | 'developed'
  | 'finale'
  | 'birthday'
  | 'bonus';

const milestones = new Set<SoundCue>(['birthday', 'bonus', 'finale', 'developed', 'progress']);
const chords = [
  [50, 57, 60, 64],
  [53, 60, 64, 67],
  [48, 55, 62, 64],
  [55, 62, 65, 69],
];
const melody = [2, -1, 1, -1, 3, 2, -1, 1];
const hz = (note: number) => 440 * 2 ** ((note - 69) / 12);

/** Caller owns the AudioContext and its visibility/suspension policy. */
export function createSoundscape(context: AudioContext) {
  let synth = createVoices(context);
  const featured = createMelodyPlayer(() => synth);
  let room = 0;
  let progress = 0;
  let muted = false;
  let disposed = false;
  let started = false;
  let starting: Promise<void> | undefined;
  let timer: ReturnType<typeof setInterval> | undefined;
  let nextBeat = 0;
  let beat = 0;
  let lastCue = -1;

  function renew() {
    featured.clear();
    synth.dispose();
    synth = createVoices(context);
    if (started) synth.weather();
    synth.room(room);
    synth.volume(muted || !started ? 0 : 0.65);
    nextBeat = context.currentTime + 0.1;
    lastCue = -1;
  }
  function music(at: number) {
    const chord = chords[Math.floor(beat / 8) % chords.length]!;
    const step = beat % 8;
    if (step === 0) {
      synth.tone(hz(chord[0]! - 12), at, 13, 0.035, -0.15, 'pad');
      if (progress > 0) synth.tone(hz(chord[1]!), at, 12, 0.018, 0.2, 'pad');
      if (progress > 1) synth.tone(hz(chord[3]!), at, 11, 0.012, -0.3, 'pad');
    }
    const note = melody[step]!;
    if (note >= 0) {
      synth.tone(hz(chord[note]! + 12), at, 4.5, 0.052, Math.sin(beat * 0.7) * 0.35);
      if (progress > 1 && step === 4)
        synth.tone(hz(chord[1]! + 24), at + 0.3, 3.5, 0.018, 0.45, 'bell');
    }
    if (progress === 3 && step === 6) synth.tone(hz(chord[2]! + 12), at, 5, 0.035, -0.4, 'bell');
    // A low wooden settling sound, far apart and never on every repeated phrase.
    if (beat % 29 === 17) {
      synth.rustle(at, 0.65, 0.06, 220, room === 2 ? 0.6 : -0.6);
      synth.tone(96, at, 0.4, 0.012, -0.6);
    }
    beat++;
  }
  function schedule() {
    if (disposed || muted || context.state !== 'running') return;
    const now = context.currentTime;
    if (featured.tick(now)) {
      nextBeat = now + 0.5;
      return;
    }
    // Background throttling or a suspended context never creates a catch-up burst.
    if (nextBeat < now - 0.5) nextBeat = now + 0.08;
    if (nextBeat < now + 0.5) {
      music(nextBeat);
      nextBeat += 1.6;
    }
  }
  async function start() {
    if (disposed || context.state === 'closed') return;
    if (starting) return starting;
    starting = (async () => {
      if (context.state !== 'running') await context.resume();
      if (disposed || context.state !== 'running') return;
      if (!started) {
        started = true;
        synth.weather();
        synth.room(room);
        nextBeat = context.currentTime + 0.1;
        timer = setInterval(schedule, 200);
      }
      synth.volume(muted ? 0 : 0.65);
      schedule();
    })();
    try {
      await starting;
    } finally {
      starting = undefined;
    }
  }
  function chime(notes: number[], at: number, spacing: number, gain = 0.07) {
    notes.forEach((note, i) =>
      synth.tone(hz(note), at + i * spacing, 3.4, gain, ((i % 3) - 1) * 0.3, 'bell'),
    );
  }
  function canPlay(cue: SoundCue, at: number) {
    return (
      started &&
      !disposed &&
      !muted &&
      context.state === 'running' &&
      (at - lastCue >= 0.07 || milestones.has(cue))
    );
  }
  function play(cue: SoundCue) {
    const at = context.currentTime + 0.012;
    if (!canPlay(cue, at)) return;
    lastCue = at;
    switch (cue) {
      case 'birthday':
      case 'bonus':
        renew();
        featured.start(cue === 'birthday' ? birthdayMelody : nisseMelody, at + 0.08);
        schedule();
        break;
      case 'paper':
        synth.rustle(at, 0.22, 0.28, 2400, -0.2);
        synth.rustle(at + 0.1, 0.28, 0.12, 1300, 0.2);
        break;
      case 'brass':
        synth.tone(620, at, 0.3, 0.07, 0, 'bell');
        synth.tone(310, at, 0.12, 0.045);
        break;
      case 'water':
        synth.rustle(at, 0.65, 0.25, 1100, 0.2);
        [420, 560, 720].forEach((frequency, i) =>
          synth.tone(frequency, at + i * 0.09, 0.2, 0.035, i * 0.2 - 0.2),
        );
        break;
      case 'door':
        synth.rustle(at, 0.9, 0.13, 280, -0.45);
        synth.tone(110, at + 0.05, 0.5, 0.05);
        synth.rustle(at + 0.55, 0.1, 0.12, 500);
        break;
      case 'nisse':
        chime([81, 76, 79], at, 0.18, 0.05);
        break;
      case 'progress':
        chime([62, 69, 74], at, 0.16);
        break;
      case 'developed':
        synth.rustle(at, 1.4, 0.12, 1600);
        chime([62, 65, 69, 76], at + 0.2, 0.23, 0.06);
        break;
      case 'finale':
        chime([62, 65, 69, 74, 77, 81], at + 1, 0.5, 0.055);
        chime([62, 69, 74], at + 4.6, 0.25, 0.06);
        [50, 57, 65].forEach((note) => synth.tone(hz(note), at, 9, 0.035, 0, 'pad'));
        break;
      case 'touch':
        synth.tone(196, at, 0.14, 0.07);
        synth.rustle(at, 0.06, 0.07, 700);
    }
  }
  return {
    start,
    play,
    reset() {
      if (disposed) return;
      room = 0;
      progress = 0;
      beat = 0;
      renew();
    },
    setScene(nextRoom: number, nextProgress: number) {
      if (disposed) return;
      room = Math.max(0, Math.min(2, Math.floor(nextRoom) || 0));
      const next = Math.max(0, Math.min(3, Math.floor(nextProgress) || 0));
      const restarting = next < progress;
      progress = next;
      if (restarting) {
        beat = 0;
        renew();
      } else synth.room(room);
    },
    setMuted(value: boolean) {
      if (disposed) return;
      if (muted === value) return;
      muted = value;
      if (muted) synth.volume(0);
      else renew();
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      clearInterval(timer);
      featured.clear();
      synth.dispose();
    },
  };
}
