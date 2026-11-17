import type { TrackId } from './types';

const paths: Record<TrackId, string> = {
  'modern-web': 'M8 8h16v16H8z M12 4v4m8-4v4M12 24v4m8-4v4M4 12h4m-4 8h4m16-8h4m-4 8h4',
  'code-quality': 'm5 9 2 2 4-4m-6 9 2 2 4-4m-6 9 2 2 4-4M16 9h11M16 16h11M16 23h11',
  'developer-experience': 'M4 5h8v8H4zM20 19h8v8h-8zM12 9h12v10m-4-4 4 4 4-4M8 17v7h8',
  'experimental-projects': 'M16 3 29 16 16 29 3 16zM16 8l8 8-8 8-8-8zM16 13l3 3-3 3-3-3z',
};

export function TrackSymbol({ track }: { track: TrackId }) {
  return (
    <svg
      className="track-symbol"
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[track]} />
    </svg>
  );
}
