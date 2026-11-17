import { useRef, type CSSProperties } from 'react';

/** A native range keeps keyboard and assistive controls; vertical drag turns the dial. */
export function RotaryKnob({
  label,
  value,
  min,
  max,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  unit: string;
  onChange: (value: number) => void;
}) {
  const drag = useRef<{ y: number; value: number; height: number } | null>(null);
  const fraction = (value - min) / (max - min);
  return (
    <label className="rotary-control">
      <span className="rotary-label">{label}</span>
      <span
        className="rotary-dial"
        style={
          {
            '--rotation': `${-135 + fraction * 270}deg`,
            '--arc': `${fraction * 270}deg`,
          } as CSSProperties
        }
      >
        <span className="rotary-face" aria-hidden="true">
          <i />
        </span>
        <input
          type="range"
          aria-label={label}
          aria-valuetext={`${value} ${unit}`}
          min={min}
          max={max}
          step={1}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          onPointerDown={(event) => {
            if (event.button !== 0 || !event.isPrimary) return;
            event.preventDefault();
            event.currentTarget.focus();
            event.currentTarget.setPointerCapture(event.pointerId);
            drag.current = {
              y: event.clientY,
              value,
              height: event.currentTarget.getBoundingClientRect().height,
            };
          }}
          onPointerMove={(event) => {
            const start = drag.current;
            if (!start) return;
            const next = start.value + ((start.y - event.clientY) / start.height) * (max - min);
            onChange(Math.round(Math.max(min, Math.min(max, next))));
          }}
          onPointerUp={() => {
            drag.current = null;
          }}
          onPointerCancel={() => {
            drag.current = null;
          }}
          onLostPointerCapture={() => {
            drag.current = null;
          }}
        />
      </span>
      <output>
        {value}
        <small>{unit}</small>
      </output>
    </label>
  );
}
