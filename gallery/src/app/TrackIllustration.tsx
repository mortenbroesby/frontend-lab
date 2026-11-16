import type { TrackId } from '../demo-contract';

const drawings: Record<TrackId, string> = {
  'modern-web':
    'M35 38h90v65H35z M45 50h70 M65 115h30 M80 103v12 M205 25h50v105h-50z M215 38h30 M225 117h10 M140 65h50m-8-8 8 8-8 8 M190 90h-50m8-8-8 8 8 8',
  'code-quality':
    'M30 30h90v95H30z M180 30h90v95h-90z M50 55h50 M50 75h30 M50 95h40 M200 55h50 M200 75h30 M200 95h40 M120 78h60 M140 68l10 10-10 10',
  'developer-experience':
    'M25 55h65v50H25z M118 55h65v50h-65z M210 55h65v50h-65z M90 80h28 M183 80h27 M55 55V30h185v25 M40 73l8 7-8 7 M57 87h17 M133 80l9 9 17-18 M225 80l9 9 17-18',
  'experimental-projects':
    'M150 15 215 80 150 145 85 80z M150 30 200 80 150 130 100 80z M150 45 185 80 150 115 115 80z M150 60 170 80 150 100 130 80z M35 80h30m-15-15v30 M235 80h30m-15-15v30',
};

export function TrackIllustration({ track }: { track: TrackId }) {
  return (
    <svg className="track-illustration" viewBox="0 0 300 160" fill="none" aria-hidden="true">
      <path
        d={drawings[track]}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
