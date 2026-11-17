import { useEffect, useRef } from 'react';
import type { Instrument } from './audio';
import { paintSignal } from './paint-signal';
export function Scope({
  instrument,
  onStep,
}: {
  instrument: Instrument | null;
  onStep: (step: number) => void;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const context = canvas.current?.getContext('2d');
    if (!context) return;
    const samples = new Uint8Array(1024);
    const spectrum = new Uint8Array(512);
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    const draw = () => {
      samples.fill(128);
      spectrum.fill(0);
      if (instrument && !reduced.matches) {
        instrument.analyser.getByteTimeDomainData(samples);
        instrument.analyser.getByteFrequencyData(spectrum);
      }
      paintSignal(context, samples, spectrum);
      if (instrument) onStep(instrument.currentStep());
      frame = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(frame);
  }, [instrument, onStep]);
  return (
    <canvas
      ref={canvas}
      width="1000"
      height="240"
      aria-label="Live waveform and frequency spectrum of the synthesized audio"
      role="img"
    />
  );
}
