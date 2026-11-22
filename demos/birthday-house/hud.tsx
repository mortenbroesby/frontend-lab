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
        <button onClick={() => openJournal()} aria-label="Notebook">
          <span aria-hidden="true">✧</span>
          <small>Notebook</small>
          {hasPlate && <i />}
        </button>
        <button
          onClick={() => toggleMarkers()}
          aria-pressed={markers}
          aria-label={markers ? 'Hide glimmers' : 'Show glimmers'}
        >
          <span aria-hidden="true">◉</span>
          <small>{markers ? 'Hide glimmers' : 'Show glimmers'}</small>
        </button>
        <button onClick={() => openHint()} aria-label="A little nudge">
          <span aria-hidden="true">?</span>
          <small>A little nudge</small>
        </button>
        <button onClick={() => openRestart()} aria-label="Start again">
          <span aria-hidden="true">↻</span>
          <small>Start again</small>
        </button>
      </footer>
      {revealed && (
        <button className="reveal-invitation gold-button" onClick={() => openReveal()}>
          A memory, kept for you →
        </button>
      )}
    </>
  );
}
