import { tr } from './language';
export function SoundControl({
  muted,
  blocked,
  unavailable,
  onToggle,
}: {
  muted: boolean;
  blocked: boolean;
  unavailable: boolean;
  onToggle: () => void;
}) {
  const label = unavailable
    ? tr('Lyd er ikke tilgængelig', 'Sound unavailable')
    : blocked
      ? tr('Start lyden', 'Start sound')
      : muted
        ? tr('Slå lyden til', 'Unmute sound')
        : tr('Slå lyden fra', 'Mute sound');
  return (
    <button
      className="sound-control"
      onClick={onToggle}
      disabled={unavailable}
      aria-label={label}
      aria-pressed={!muted && !blocked && !unavailable}
      title={label}
    >
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M4 9h4l5-4v14l-5-4H4Z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        {muted || blocked || unavailable ? (
          <path d="m17 9 5 6m0-6-5 6" stroke="currentColor" strokeWidth="1.4" />
        ) : (
          <path
            d="M17 8c2 2 2 6 0 8m3-11c4 4 4 10 0 14"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        )}
      </svg>
    </button>
  );
}
