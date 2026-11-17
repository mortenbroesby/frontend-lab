import { frequency, melody, stepDuration } from './pattern';
export type Settings = {
  tempo: number;
  cutoff: number;
  echo: number;
  levels: number[];
  pattern: boolean[][];
};

/** Schedule against the audio clock; React and drawing never drive musical timing. */
export function createInstrument() {
  const context = new AudioContext();
  const filter = context.createBiquadFilter();
  filter.type = 'lowpass';
  filter.Q.value = 1.8;
  const master = context.createGain();
  master.gain.value = 0.45;
  const delay = context.createDelay(1);
  delay.delayTime.value = 0.23;
  const wet = context.createGain();
  const feedback = context.createGain();
  feedback.gain.value = 0.25;
  const analyser = context.createAnalyser();
  analyser.fftSize = 1024;
  filter.connect(master);
  filter.connect(delay);
  delay.connect(wet).connect(master);
  delay.connect(feedback).connect(delay);
  master.connect(analyser).connect(context.destination);
  let timer: ReturnType<typeof setInterval> | undefined;
  let closed = false;
  let nextTime = 0;
  let step = 0;
  let visibleStep = -1;
  const queued: { time: number; step: number }[] = [];

  function tone(
    note: number,
    time: number,
    duration: number,
    type: OscillatorType,
    volume: number,
  ) {
    const oscillator = context.createOscillator();
    const envelope = context.createGain();
    oscillator.type = type;
    oscillator.frequency.value = frequency(note);
    envelope.gain.setValueAtTime(0, time);
    envelope.gain.linearRampToValueAtTime(volume, time + 0.008);
    envelope.gain.exponentialRampToValueAtTime(0.001, time + duration);
    oscillator.connect(envelope).connect(filter);
    oscillator.start(time);
    oscillator.stop(time + duration + 0.01);
    oscillator.onended = () => {
      oscillator.disconnect();
      envelope.disconnect();
    };
  }

  function drum(time: number, beat: number, level: number) {
    const oscillator = context.createOscillator();
    const envelope = context.createGain();
    const sound =
      beat % 4 === 0
        ? { type: 'sine' as const, start: 150, end: 42, gain: 0.8 }
        : { type: 'triangle' as const, start: 1800, end: 300, gain: 0.15 };
    oscillator.type = sound.type;
    oscillator.frequency.setValueAtTime(sound.start, time);
    oscillator.frequency.exponentialRampToValueAtTime(sound.end, time + 0.08);
    envelope.gain.setValueAtTime(level * sound.gain, time);
    envelope.gain.exponentialRampToValueAtTime(0.001, time + 0.13);
    oscillator.connect(envelope).connect(master);
    oscillator.start(time);
    oscillator.stop(time + 0.14);
    oscillator.onended = () => {
      oscillator.disconnect();
      envelope.disconnect();
    };
  }

  function schedule(settings: Settings) {
    filter.frequency.setTargetAtTime(settings.cutoff, context.currentTime, 0.03);
    wet.gain.setTargetAtTime(settings.echo, context.currentTime, 0.03);
    // Skip missed time after a suspended/background tab rather than burst old notes.
    nextTime = Math.max(nextTime, context.currentTime);
    while (nextTime < context.currentTime + 0.1) {
      playStep(settings, step, nextTime);
      queued.push({ time: nextTime, step });
      nextTime += stepDuration(settings.tempo);
      step = (step + 1) % 16;
    }
    while (queued.length > 32) queued.shift();
  }
  function playStep(settings: Settings, beat: number, time: number) {
    const { pattern, levels } = settings;
    if (pattern[0][beat]) tone(melody[beat], time, 0.18, 'square', levels[0] * 0.12);
    if (pattern[1][beat])
      tone([36, 39, 34, 32][Math.floor(beat / 4)], time, 0.22, 'sawtooth', levels[1] * 0.2);
    if (pattern[2][beat]) drum(time, beat, levels[2]);
  }
  return {
    analyser,
    playNote(note: number) {
      if (closed || context.state !== 'running') return;
      tone(note, context.currentTime, 0.45, 'triangle', 0.2);
    },
    async start(read: () => Settings) {
      await context.resume();
      if (closed) return;
      nextTime = context.currentTime + 0.05;
      schedule(read());
      timer = setInterval(() => schedule(read()), 25);
    },
    currentStep() {
      while (queued[0] && queued[0].time <= context.currentTime) visibleStep = queued.shift()!.step;
      return visibleStep;
    },
    async close() {
      clearInterval(timer);
      if (closed) return;
      closed = true;
      await context.close();
    },
  };
}
export type Instrument = ReturnType<typeof createInstrument>;
