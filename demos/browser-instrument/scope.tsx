import { useEffect, useRef } from 'react';
import type { Instrument } from './audio';
import { paintSignal } from './paint-signal';
export function Scope({
  instrument,
  onStep,
  waveformOnly = false,
}: {
  waveformOnly?: boolean;
  instrument: Instrument | null;
  onStep: (step: number) => void;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const context = canvas.current?.getContext('2d');
    if (!context) return;
    const samples = new Uint8Array(1024);
    const spectrum = new Uint8Array(512);
    if (!instrument) {
      samples.fill(128);
      paintSignal(context, samples, waveformOnly ? undefined : spectrum);
      return;
    }
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    const draw = () => {
      samples.fill(128);
      spectrum.fill(0);
      if (!reduced.matches) {
        instrument.analyser.getByteTimeDomainData(samples);
        if (!waveformOnly) instrument.analyser.getByteFrequencyData(spectrum);
      }
      paintSignal(context, samples, waveformOnly ? undefined : spectrum);
      if (!waveformOnly) onStep(instrument.currentStep());
      frame = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(frame);
  }, [instrument, onStep, waveformOnly]);
  return (
    <canvas
      ref={canvas}
      width="1000"
      height="240"
      aria-label={
        waveformOnly
          ? 'Live waveform of the synthesized audio'
          : 'Live waveform and frequency spectrum of the synthesized audio'
      }
      role="img"
    />
  );
}
