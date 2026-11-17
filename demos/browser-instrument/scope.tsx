import { useEffect, useRef } from 'react';
import type { Instrument } from './audio';
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
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    const draw = () => {
      context.clearRect(0, 0, 1000, 240);
      context.strokeStyle = '#9cf6b8';
      context.lineWidth = 2;
      context.beginPath();
      context.moveTo(0, 120);
      samples.fill(128);
      if (instrument && !reduced.matches) instrument.analyser.getByteTimeDomainData(samples);
      samples.forEach((value, index) => {
        const x = (index / 1023) * 1000;
        const y = 120 + ((value - 128) / 128) * 400;
        context.lineTo(x, y);
      });
      context.stroke();
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
      aria-label="Live waveform of the synthesized audio"
      role="img"
    />
  );
}
