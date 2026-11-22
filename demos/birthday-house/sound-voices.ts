/** Small, bounded synthesis graph. Everything is generated locally, including the room response. */
export function createVoices(context: BaseAudioContext) {
  const output = context.createGain();
  output.gain.value = 0;
  const color = context.createBiquadFilter();
  color.type = 'lowpass';
  color.frequency.value = 4200;
  const dry = context.createGain();
  dry.gain.value = 0.82;
  const reverb = context.createConvolver();
  const wet = context.createGain();
  wet.gain.value = 0.24;
  reverb.buffer = roomResponse(context);
  color.connect(dry).connect(output);
  color.connect(reverb).connect(wet).connect(output);
  output.connect(context.destination);
  const voices = new Set<AudioScheduledSourceNode>();
  const loops: { source: AudioBufferSourceNode; filter: BiquadFilterNode; gain: GainNode }[] = [];
  const noise = noiseBuffer(context, 4);
  let disposed = false;

  function own(source: AudioScheduledSourceNode, nodes: AudioNode[]) {
    voices.add(source);
    source.onended = () => {
      voices.delete(source);
      source.disconnect();
      nodes.forEach((node) => node.disconnect());
    };
  }
  function tone(
    frequency: number,
    at: number,
    duration: number,
    volume: number,
    pan = 0,
    kind: 'felt' | 'bell' | 'pad' = 'felt',
  ) {
    if (disposed || voices.size >= 40) return;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const stereo = context.createStereoPanner();
    oscillator.type = kind === 'pad' ? 'triangle' : 'sine';
    oscillator.frequency.value = frequency;
    stereo.pan.value = pan;
    const attack = kind === 'pad' ? 1.7 : 0.012;
    gain.gain.setValueAtTime(0, at);
    gain.gain.linearRampToValueAtTime(volume, at + attack);
    gain.gain.exponentialRampToValueAtTime(0.00001, at + duration);
    oscillator.connect(gain).connect(stereo).connect(color);
    own(oscillator, [gain, stereo]);
    oscillator.start(at);
    oscillator.stop(at + duration + 0.03);
    if (kind === 'bell') tone(frequency * 2.003, at, duration * 0.48, volume * 0.12, pan);
  }
  function rustle(at: number, duration: number, volume: number, frequency: number, pan = 0) {
    if (disposed || voices.size >= 40) return;
    const source = context.createBufferSource();
    const filter = context.createBiquadFilter();
    const gain = context.createGain();
    const stereo = context.createStereoPanner();
    source.buffer = noise;
    filter.type = 'bandpass';
    filter.frequency.value = frequency;
    filter.Q.value = 0.8;
    stereo.pan.value = pan;
    gain.gain.setValueAtTime(0, at);
    gain.gain.linearRampToValueAtTime(volume, at + Math.min(0.06, duration / 3));
    gain.gain.exponentialRampToValueAtTime(0.00001, at + duration);
    source.connect(filter).connect(gain).connect(stereo).connect(color);
    own(source, [filter, gain, stereo]);
    source.start(at, (at * 0.71) % 2);
    source.stop(at + duration);
  }
  function weather() {
    if (disposed || loops.length) return;
    for (const [frequency, volume, pan] of [
      [850, 0.045, -0.55],
      [180, 0.075, 0.4],
    ]) {
      const source = context.createBufferSource();
      const filter = context.createBiquadFilter();
      const gain = context.createGain();
      const stereo = context.createStereoPanner();
      source.buffer = noise;
      source.loop = true;
      filter.type = 'lowpass';
      filter.frequency.value = frequency!;
      gain.gain.value = volume!;
      stereo.pan.value = pan!;
      source.connect(filter).connect(gain).connect(stereo).connect(color);
      own(source, [filter, gain, stereo]);
      loops.push({ source, filter, gain });
      source.start();
    }
  }
  return {
    tone,
    rustle,
    weather,
    volume(value: number) {
      output.gain.cancelAndHoldAtTime(context.currentTime);
      output.gain.linearRampToValueAtTime(value, context.currentTime + 0.12);
    },
    room(room: number) {
      color.frequency.setTargetAtTime([4200, 1700, 5200][room] ?? 4200, context.currentTime, 1.2);
      wet.gain.setTargetAtTime([0.24, 0.34, 0.4][room] ?? 0.24, context.currentTime, 1.2);
      loops.forEach(({ filter, gain }, i) => {
        filter.frequency.setTargetAtTime(
          i ? 180 : ([850, 450, 1200][room] ?? 850),
          context.currentTime,
          1.4,
        );
        gain.gain.setTargetAtTime(
          i ? 0.075 : ([0.045, 0.025, 0.06][room] ?? 0.045),
          context.currentTime,
          1.4,
        );
      });
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      voices.forEach((source) => {
        source.stop();
        source.disconnect();
      });
      voices.clear();
      loops.length = 0;
      [color, dry, reverb, wet, output].forEach((node) => node.disconnect());
    },
  };
}
function noiseBuffer(context: BaseAudioContext, seconds: number) {
  const buffer = context.createBuffer(1, context.sampleRate * seconds, context.sampleRate);
  const channel = buffer.getChannelData(0);
  let previous = 0;
  for (let i = 0; i < channel.length; i++) {
    // Soft correlated noise rather than sharp white hiss. The ends meet at silence.
    previous = previous * 0.84 + (Math.random() * 2 - 1) * 0.16;
    const edge = Math.min(1, i / 800, (channel.length - i - 1) / 800);
    channel[i] = previous * edge;
  }
  return buffer;
}
function roomResponse(context: BaseAudioContext) {
  const buffer = context.createBuffer(2, context.sampleRate * 2.3, context.sampleRate);
  for (let channel = 0; channel < 2; channel++) {
    const data = buffer.getChannelData(channel);
    for (let i = 0; i < data.length; i++) {
      const time = i / context.sampleRate;
      data[i] = (Math.random() * 2 - 1) * Math.exp(-time * 3.3) * Math.min(1, time * 90);
    }
  }
  return buffer;
}
