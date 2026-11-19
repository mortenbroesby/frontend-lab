import type { CSSProperties } from 'react';
import { Button } from '@lab/ui/button';
import { Slider } from '@lab/ui/slider';
import { finishAt, finishes } from './finishes';

const gradient = `linear-gradient(90deg, ${finishes.map((finish) => `${finish.shell} ${finish.at}%`).join(', ')})`;

export function FinishControls({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  const finish = finishAt(value);
  return (
    <div className="orbit-colour-control">
      <div className="orbit-finishes" role="group" aria-label="Colour presets">
        {finishes.map((colour) => (
          <Button
            key={colour.name}
            className="orbit-finish-button"
            variant="outline"
            aria-pressed={value === colour.at}
            onClick={() => onChange(colour.at)}
            style={{ '--swatch': colour.shell } as CSSProperties}
          >
            <span className="orbit-swatch" aria-hidden="true" />
            {colour.name}
          </Button>
        ))}
      </div>
      <div className="orbit-colour-label">
        <span>Drag to blend colours</span>
        <output>{finish.shell.toUpperCase()}</output>
      </div>
      <Slider
        className="orbit-colour-slider"
        aria-label={`Speaker colour: ${finish.name}`}
        value={[value]}
        min={0}
        max={100}
        step={0.1}
        onValueChange={([next]) => onChange(next)}
        style={{ '--colour-gradient': gradient, '--thumb-colour': finish.shell } as CSSProperties}
      />
      <p className="orbit-selected">{finish.name}</p>
    </div>
  );
}
