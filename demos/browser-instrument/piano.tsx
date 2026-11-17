import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Button } from '@lab/ui/button';
import type { Instrument } from './audio';

const keys = [
  { note: 60, name: 'C4' },
  { note: 61, name: 'C sharp 4', black: 1 },
  { note: 62, name: 'D4' },
  { note: 63, name: 'D sharp 4', black: 2 },
  { note: 64, name: 'E4' },
  { note: 65, name: 'F4' },
  { note: 66, name: 'F sharp 4', black: 4 },
  { note: 67, name: 'G4' },
  { note: 68, name: 'G sharp 4', black: 5 },
  { note: 69, name: 'A4' },
  { note: 70, name: 'A sharp 4', black: 6 },
  { note: 71, name: 'B4' },
  { note: 72, name: 'C5' },
];

export function Piano({ instrument }: { instrument: Instrument | null }) {
  const [lit, setLit] = useState<number | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  function play(note: number) {
    if (!instrument) return;
    instrument.playNote(note);
    setLit(note);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setLit(null), 220);
  }
  return (
    <div className="piano-section">
      <p>
        {instrument ? 'Play a few notes. Make the loop yours.' : 'Press Play, then tap the keys.'}
        <span>Drag knobs up or down · Arrow keys when focused</span>
      </p>
      <div className="piano-keys" role="group" aria-label="One-octave synthesizer keyboard">
        {keys.map(({ note, name, black }) => (
          <Button
            key={note}
            variant="outline"
            className={`piano-key ${black ? 'piano-black' : 'piano-white'}`}
            style={black ? ({ '--key-position': black } as CSSProperties) : undefined}
            aria-label={`Play ${name}`}
            disabled={!instrument}
            data-lit={Boolean(instrument) && lit === note}
            onPointerDown={(event) => {
              if (event.button === 0) play(note);
            }}
            onClick={(event) => {
              if (event.detail === 0) play(note);
            }}
          >
            <span>{name.replace(' sharp ', '♯')}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
