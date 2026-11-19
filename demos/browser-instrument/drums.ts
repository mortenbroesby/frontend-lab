/** Short synthesized percussion, with one reusable noise sample. */
export function createDrums(context: AudioContext, output: AudioNode) {
  const noise = context.createBuffer(1, Math.ceil(context.sampleRate * 0.2), context.sampleRate);
  const data = noise.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;

  function hiss(time: number, duration: number, cutoff: number, volume: number) {
    const source = context.createBufferSource();
    source.buffer = noise;
    const filter = context.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = cutoff;
    const gain = context.createGain();
    gain.gain.setValueAtTime(volume, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
    source.connect(filter).connect(gain).connect(output);
    source.start(time);
    source.stop(time + duration);
    source.onended = () => {
      source.disconnect();
      filter.disconnect();
      gain.disconnect();
    };
  }
  function kick(time: number, volume: number) {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.frequency.setValueAtTime(165, time);
    oscillator.frequency.exponentialRampToValueAtTime(42, time + 0.1);
    gain.gain.setValueAtTime(volume, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.16);
    oscillator.connect(gain).connect(output);
    oscillator.start(time);
    oscillator.stop(time + 0.17);
    oscillator.onended = () => {
      oscillator.disconnect();
      gain.disconnect();
    };
  }
  return (time: number, beat: number, level: number) => {
    hiss(time, 0.035, 6500, level * 0.18);
    if (beat % 8 === 0) kick(time, level * 0.65);
    if (beat % 8 === 4) hiss(time, 0.14, 1200, level * 0.38);
  };
}
