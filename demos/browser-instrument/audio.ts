import { createDrums } from './drums';
import { frequency, songs, stepDuration } from './pattern';
export type Settings = {
  song: number;
  pitch: number;
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
    pitch: number,
  ) {
    if (volume <= 0) return;
    const oscillator = context.createOscillator();
    const envelope = context.createGain();
    oscillator.type = type;
    oscillator.frequency.value = frequency(note, pitch);
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

  const drum = createDrums(context, master);

  function schedule(settings: Settings) {
    filter.frequency.setTargetAtTime(settings.cutoff, context.currentTime, 0.03);
    wet.gain.setTargetAtTime(settings.echo, context.currentTime, 0.03);
    delay.delayTime.setTargetAtTime(stepDuration(settings.tempo) * 3, context.currentTime, 0.03);
    // Skip missed time after a suspended/background tab rather than burst old notes.
    nextTime = Math.max(nextTime, context.currentTime);
    while (nextTime < context.currentTime + 0.1) {
      playStep(settings, step, nextTime);
      queued.push({ time: nextTime, step: step % 16 });
      nextTime += stepDuration(settings.tempo);
      step = (step + 1) % 64;
    }
    while (queued.length > 32) queued.shift();
  }
  function playStep(settings: Settings, beat: number, time: number) {
    const { pattern, levels } = settings;
    const song = songs[settings.song];
    const column = beat % 16;
    const bar = Math.floor(beat / 16);
    const length = stepDuration(settings.tempo);
    const root = song.bass[bar];
    if (pattern[0][column]) {
      tone(
        song.melody[beat],
        time,
        length * song.voice.sustain,
        song.voice.lead,
        levels[0] * 0.1,
        settings.pitch,
      );
      // Tracker-style chord illusion: three rapid notes share one sixteenth.
      [0, song.thirds[bar], 7].forEach((interval, i) => {
        tone(
          root + 24 + interval,
          time + (length * i) / 3,
          (length / 3) * 0.8,
          'square',
          levels[0] * song.voice.arpeggio,
          settings.pitch,
        );
      });
    }
    if (pattern[1][column])
      tone(
        root + [0, 0, song.voice.octave, 0][column % 4],
        time,
        length * song.voice.bassLength,
        'triangle',
        levels[1] * 0.45,
        settings.pitch,
      );
    if (pattern[2][column]) drum(time, column, levels[2], song.voice.softness);
  }
  return {
    analyser,
    async start(read: () => Settings) {
      let timeout: ReturnType<typeof setTimeout> | undefined;
      try {
        await Promise.race([
          context.resume(),
          new Promise<never>((_, reject) => {
            timeout = setTimeout(
              () =>
                reject(
                  new Error(
                    'Tap Play on the presentation screen once to enable audio, then try the remote again.',
                  ),
                ),
              1800,
            );
          }),
        ]);
      } finally {
        clearTimeout(timeout);
      }
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
