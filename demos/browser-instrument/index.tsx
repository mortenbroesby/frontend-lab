import { useEffect, useRef, useState, type RefObject } from 'react';
import { Button } from '@lab/ui/button';
import { Slider } from '@lab/ui/slider';
import { createInstrument } from './audio';
import type { Instrument, Settings } from './audio';
import { initialPattern, toggleStep } from './pattern';
import { Scope } from './scope';
import { PerformanceControls } from './performance-controls';
import './instrument.css';

const embedded = new URLSearchParams(window.location.search).has('embed');
const instrumentClass = embedded ? 'pocket-instrument instrument-performance' : 'pocket-instrument';
const voices = ['Lead', 'Bass', 'Drums'];
function Dial({
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
  return (
    <label className="instrument-dial">
      <span>
        {label}
        <output>
          {value} {unit}
        </output>
      </span>
      <Slider
        aria-label={label}
        value={[value]}
        min={min}
        max={max}
        step={1}
        onValueChange={([next]) => onChange(next)}
      />
    </label>
  );
}
export default function InstrumentDemo() {
  const stage = useRef<HTMLDivElement>(null);
  const [settings, setSettings] = useState<Settings>({
    tempo: 112,
    cutoff: 3800,
    echo: 0.25,
    levels: [0.7, 0.65, 0.7],
    pattern: initialPattern,
  });
  const current = useRef(settings);
  useEffect(() => {
    current.current = settings;
  }, [settings]);
  const active = useRef<Instrument | null>(null);
  const [instrument, setInstrument] = useState<Instrument | null>(null);
  const [step, setStep] = useState(-1);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  useEffect(
    () => () => {
      void active.current?.close();
      active.current = null;
    },
    [],
  );
  async function togglePlayback() {
    setError('');
    setBusy(true);
    try {
      if (active.current) {
        await active.current.close();
        active.current = null;
        setInstrument(null);
        setStep(-1);
      } else {
        const next = createInstrument();
        active.current = next;
        await next.start(() => current.current);
        setInstrument(next);
      }
    } catch {
      void active.current?.close();
      active.current = null;
      setInstrument(null);
      setError('Audio could not start. Try Play again in a browser that supports Web Audio.');
    } finally {
      setBusy(false);
    }
  }
  return (
    <div ref={stage} className={instrumentClass}>
      <InstrumentHeader
        stage={stage}
        busy={busy}
        playing={Boolean(instrument)}
        onPlay={() => void togglePlayback()}
      />
      {error && <p role="alert">{error}</p>}
      <div className="instrument-console">
        <div className="instrument-scope">
          <div className="scope-caption">
            <span className="signal-status" data-live={Boolean(instrument)}>
              {instrument ? 'PLAYING' : 'READY'}
            </span>
            <span>LIVE WAVEFORM</span>
          </div>
          <Scope instrument={instrument} onStep={setStep} />
          <div className="scope-footer">
            <span>WEB AUDIO</span>
            <span>16 STEPS · 3 VOICES</span>
          </div>
        </div>
        <div className="instrument-controls">
          <Dial
            label="Tempo"
            value={settings.tempo}
            min={70}
            max={160}
            unit="BPM"
            onChange={(tempo) => setSettings((s) => ({ ...s, tempo }))}
          />
          <Dial
            label="Tone"
            value={settings.cutoff}
            min={200}
            max={8000}
            unit="Hz"
            onChange={(cutoff) => setSettings((s) => ({ ...s, cutoff }))}
          />
          <Dial
            label="Echo"
            value={Math.round(settings.echo * 100)}
            min={0}
            max={60}
            unit="%"
            onChange={(echo) => setSettings((s) => ({ ...s, echo: echo / 100 }))}
          />
        </div>
      </div>
      <div className="sequencer-heading">
        <h3>Step sequencer</h3>
        <span>Tap a step to add or remove a note.</span>
      </div>
      <div className="sequencer-scroll">
        <div className="sequencer">
          {voices.map((voice, row) => (
            <div
              className="sequence-row"
              key={voice}
              style={
                { '--voice-color': ['#b3a0ff', '#80d9ed', '#ffc778'][row] } as React.CSSProperties
              }
            >
              <div className="voice-label">
                <strong>
                  <span className="voice-dot" aria-hidden="true" />
                  {voice}
                  <span className="voice-level">{Math.round(settings.levels[row] * 100)}%</span>
                </strong>
                <Slider
                  aria-label={`${voice} volume`}
                  value={[settings.levels[row] * 100]}
                  min={0}
                  max={100}
                  onValueChange={([level]) =>
                    setSettings((s) => ({
                      ...s,
                      levels: s.levels.map((v, i) => (i === row ? level / 100 : v)),
                    }))
                  }
                />
              </div>
              {settings.pattern[row].map((on, column) => (
                <Button
                  key={column}
                  variant="outline"
                  className="sequence-step"
                  aria-label={`${voice} step ${column + 1}`}
                  aria-pressed={on}
                  data-on={on}
                  data-current={step === column}
                  onClick={() =>
                    setSettings((s) => ({ ...s, pattern: toggleStep(s.pattern, row, column) }))
                  }
                >
                  <span>{String(column + 1).padStart(2, '0')}</span>
                  <i aria-hidden="true" />
                </Button>
              ))}
            </div>
          ))}
        </div>
      </div>
      {!embedded && (
        <div className="instrument-note">
          <p>
            Inspired by tracker music and tiny demoscene intros. The melody, bass and percussion are
            generated live with oscillators. The grid changes the loop; the sliders shape its sound.
            No recording is playing behind the controls. Start with the tone slider, then take a few
            notes out.
          </p>
          <Button
            variant="outline"
            onClick={() => setSettings((s) => ({ ...s, pattern: initialPattern }))}
          >
            Reset pattern
          </Button>
        </div>
      )}
    </div>
  );
}

function InstrumentHeader({
  stage,
  busy,
  playing,
  onPlay,
}: {
  stage: RefObject<HTMLDivElement | null>;
  busy: boolean;
  playing: boolean;
  onPlay: () => void;
}) {
  return (
    <div className="instrument-top">
      <div>
        <span className="instrument-eyebrow">PATTERN 01 / C MINOR</span>
        {embedded ? <h1>Pocket tracker</h1> : <h2>Press play. Find your sound.</h2>}
        <p>An original loop, ready to reshape.</p>
      </div>
      <div className="instrument-actions">
        <Button className="instrument-play" onClick={onPlay} disabled={busy}>
          {playing ? '■ Stop' : '▶ Play'}
        </Button>
        {embedded ? (
          <PerformanceControls stage={stage} />
        ) : (
          <Button variant="outline" asChild>
            <a href="?embed=1">Performance view ↗</a>
          </Button>
        )}
      </div>
    </div>
  );
}
