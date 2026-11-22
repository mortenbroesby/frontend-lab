import { tr } from './language.ts';
type Props = {
  note: string;
  markers: boolean;
  hasPlate: boolean;
  revealed: boolean;
  openJournal: () => void;
  openHint: () => void;
  openRestart: () => void;
  openReveal: () => void;
  toggleMarkers: () => void;
};
export function GameHUD({
  note,
  markers,
  hasPlate,
  revealed,
  openJournal,
  openHint,
  openRestart,
  openReveal,
  toggleMarkers,
}: Props) {
  return (
    <>
      {note && (
        <p className="whisper" role="status" key={note}>
          {note}
        </p>
      )}
      <footer className="game-toolbar">
        <button onClick={() => openJournal()} aria-label={tr('Notesbog', 'Notebook')}>
          <span aria-hidden="true">✧</span>
          <small>{tr('Notesbog', 'Notebook')}</small>
          {hasPlate && <i />}
        </button>
        <button
          onClick={() => toggleMarkers()}
          aria-pressed={markers}
          aria-label={
            markers ? tr('Skjul glimt', 'Hide glimmers') : tr('Vis glimt', 'Show glimmers')
          }
        >
          <span aria-hidden="true">◉</span>
          <small>
            {markers ? tr('Skjul glimt', 'Hide glimmers') : tr('Vis glimt', 'Show glimmers')}
          </small>
        </button>
        <button onClick={() => openHint()} aria-label="Hint">
          <span aria-hidden="true">?</span>
          <small>Hint</small>
        </button>
        <button onClick={() => openRestart()} aria-label={tr('Begynd forfra', 'Start over')}>
          <span aria-hidden="true">↻</span>
          <small>{tr('Begynd forfra', 'Start over')}</small>
        </button>
      </footer>
      {revealed && (
        <button className="reveal-invitation gold-button" onClick={() => openReveal()}>
          {tr('Et minde, gemt til dig →', 'A memory saved for you →')}
        </button>
      )}
    </>
  );
}
