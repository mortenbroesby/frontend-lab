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
        <button onClick={() => openJournal()}>
          <span aria-hidden="true">✧</span> Notebook{hasPlate && <i />}
        </button>
        <button onClick={() => toggleMarkers()} aria-pressed={markers}>
          <span aria-hidden="true">◉</span> {markers ? 'Hide glimmers' : 'Show glimmers'}
        </button>
        <button onClick={() => openHint()}>
          <span aria-hidden="true">?</span> A little nudge
        </button>
        <button onClick={() => openRestart()} aria-label="Start again">
          ↻
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
