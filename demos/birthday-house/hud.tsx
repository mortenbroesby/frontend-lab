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
        <button onClick={() => openJournal()} aria-label="Notesbog">
          <span aria-hidden="true">✧</span>
          <small>Notesbog</small>
          {hasPlate && <i />}
        </button>
        <button
          onClick={() => toggleMarkers()}
          aria-pressed={markers}
          aria-label={markers ? 'Skjul glimt' : 'Vis glimt'}
        >
          <span aria-hidden="true">◉</span>
          <small>{markers ? 'Skjul glimt' : 'Vis glimt'}</small>
        </button>
        <button onClick={() => openHint()} aria-label="Et lille vink">
          <span aria-hidden="true">?</span>
          <small>Et lille vink</small>
        </button>
        <button onClick={() => openRestart()} aria-label="Begynd forfra">
          <span aria-hidden="true">↻</span>
          <small>Begynd forfra</small>
        </button>
      </footer>
      {revealed && (
        <button className="reveal-invitation gold-button" onClick={() => openReveal()}>
          Et minde, gemt til dig →
        </button>
      )}
    </>
  );
}
