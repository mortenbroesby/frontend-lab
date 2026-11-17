import { useState } from 'react';
import { Slider } from '@lab/ui/slider';
import { Button } from '@lab/ui/button';

export function WaveExperiment({ preview = false }: { preview?: boolean }) {
  const [frequency, setFrequency] = useState(3);
  const points = Array.from(
    { length: 161 },
    (_, index) => `${index * 3},${100 + Math.sin((index / 160) * Math.PI * 2 * frequency) * 65}`,
  ).join(' ');
  return (
    <div className="wave-experiment" data-presentation-interactive>
      <svg viewBox="0 0 480 200" role="img" aria-label={`Sine wave with ${frequency} cycles`}>
        <path className="wave-axis" d="M0 100H480" />
        <polyline className="wave-line" points={points} />
      </svg>
      <div className="wave-label">
        <span>Frequency</span>
        <output>{frequency} cycles</output>
      </div>
      <Slider
        aria-label="Wave frequency"
        min={1}
        max={8}
        step={1}
        value={[frequency]}
        onValueChange={([value]) => setFrequency(value)}
        disabled={preview}
      />
      <div className="wave-bottom">
        <code>y = sin(x × frequency)</code>
        <Button
          className="text-foreground"
          variant="outline"
          onClick={() => setFrequency(3)}
          disabled={preview}
        >
          Reset
        </Button>
      </div>
    </div>
  );
}
