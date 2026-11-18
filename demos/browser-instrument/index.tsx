import { usePlayback } from './use-playback';
import { useWalkthrough } from '@lab/demo-kit/use-walkthrough';
import { sweepSettings } from './walkthrough';
import { useRef, useState, type RefObject } from 'react';
import { Button } from '@lab/ui/button';
import { Slider } from '@lab/ui/slider';
import type { Settings } from './audio';
import { initialPattern, songs, toggleStep } from './pattern';
import { Scope } from './scope';
import { PerformanceControls } from './performance-controls';
import './instrument.css';

const embedded = new URLSearchParams(window.location.search).has('embed');
const presentation = embedded && new URLSearchParams(window.location.search).has('presentation');
const instrumentClass = `pocket-instrument${embedded ? ' instrument-performance' : ''}${presentation ? ' instrument-presentation' : ''}`;
const walkthroughLabels = [
  'Start the loop',
  'Open the filter',
  'Add echo',
  'An octave up',
  'Finish',
];
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
      <span className="instrument-dial-label">
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
    song: 0,
    pitch: 0,
    tempo: 112,
    cutoff: 3800,
    echo: 0.25,
    levels: [0.7, 0.65, 0.7],
    pattern: initialPattern,
  });
  const [step, setStep] = useState(-1);
  const { instrument, busy, error, startPlayback, stopPlayback, togglePlayback } =
    usePlayback(settings);
  useWalkthrough(
    walkthroughLabels,
    async (index, signal) => {
      if (index === 4) {
        stopPlayback();
        return;
      }
      await startPlayback(signal);
      if (signal.aborted) return;
      const targets = [
        { cutoff: 600, echo: 0, pitch: 0 },
        { cutoff: 6500, echo: 0, pitch: 0 },
        { cutoff: 6500, echo: 0.55, pitch: 0 },
        { cutoff: 6500, echo: 0.55, pitch: 12 },
      ];
      await sweepSettings(settings, targets[index]!, signal, (patch) => {
        setSettings((value) => ({ ...value, ...patch }));
      });
    },
    stopPlayback,
  );
  return (
    <div ref={stage} className={instrumentClass}>
      <InstrumentHeader
        song={settings.song}
        onSong={(direction) =>
          setSettings((previous) => {
            const song = (previous.song + direction + songs.length) % songs.length;
            return { ...previous, song, pattern: songs[song].pattern };
          })
        }
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
          <Scope instrument={instrument} onStep={setStep} waveformOnly={presentation} />
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
            label="Pitch"
            value={settings.pitch}
            min={-12}
            max={12}
            unit="semitones"
            onChange={(pitch) => setSettings((s) => ({ ...s, pitch }))}
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
      {presentation && (
        <p className="instrument-fader-hint">Drag left or right · Arrow keys when focused</p>
      )}
      {!presentation && (
        <>
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
                    {
                      '--voice-color': ['#b3a0ff', '#80d9ed', '#ffc778'][row],
                    } as React.CSSProperties
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
        </>
      )}
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
            onClick={() => setSettings((s) => ({ ...s, pattern: songs[s.song].pattern }))}
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
  song,
  onSong,
}: {
  stage: RefObject<HTMLDivElement | null>;
  busy: boolean;
  playing: boolean;
  onPlay: () => void;
  song: number;
  onSong: (direction: number) => void;
}) {
  return (
    <div className="instrument-top">
      <div>
        {!presentation && <span className="instrument-eyebrow">3 ORIGINAL LOOPS</span>}
        {embedded ? <h1>Browser Beat</h1> : <h2>Press play. Find your sound.</h2>}
        <p>Three original loops, ready to reshape.</p>
      </div>
      <div className="instrument-song-picker" role="group" aria-label="Choose a song">
        <Button variant="ghost" aria-label="Previous song" onClick={() => onSong(-1)}>
          ◀
        </Button>
        <div className="instrument-song-display" aria-live="polite" aria-atomic="true">
          <small>TRACK 0{song + 1} / 03</small>
          <strong>{songs[song].name}</strong>
        </div>
        <Button variant="ghost" aria-label="Next song" onClick={() => onSong(1)}>
          ▶
        </Button>
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
