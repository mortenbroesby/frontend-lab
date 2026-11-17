import type { CSSProperties } from 'react';

export const posters = [
  {
    id: 'orbit',
    title: 'Orbital',
    category: 'Space',
    ink: '#bef264',
    paper: '#17251c',
    shape: 'rings',
    caption: 'A signal finding its way home.',
  },
  {
    id: 'tide',
    title: 'Low tide',
    category: 'Nature',
    ink: '#99e2dd',
    paper: '#173440',
    shape: 'waves',
    caption: 'The coast, reduced to rhythm.',
  },
  {
    id: 'echo',
    title: 'Afterimage',
    category: 'Form',
    ink: '#fbb6ce',
    paper: '#49233d',
    shape: 'tiles',
    caption: 'One shape. A slightly different perspective.',
  },
  {
    id: 'solar',
    title: 'Solar study',
    category: 'Space',
    ink: '#ffcc80',
    paper: '#44291d',
    shape: 'rings',
    caption: 'An imperfect map of a distant sun.',
  },
  {
    id: 'terrain',
    title: 'Contour',
    category: 'Nature',
    ink: '#d3d99a',
    paper: '#28372c',
    shape: 'waves',
    caption: 'A landscape without a fixed horizon.',
  },
  {
    id: 'phase',
    title: 'Phase shift',
    category: 'Form',
    ink: '#b8c4ff',
    paper: '#25274c',
    shape: 'tiles',
    caption: 'Order, just before it changes.',
  },
] as const;
export type Poster = (typeof posters)[number];

export function PosterArt({ poster }: { poster: Poster }) {
  return (
    <div
      className="poster-art"
      style={{ '--poster-ink': poster.ink, '--poster-paper': poster.paper } as CSSProperties}
      aria-hidden="true"
    >
      <svg viewBox="0 0 400 440" fill="none">
        <path d="M24 48H376M24 392H376" stroke="currentColor" opacity=".25" />
        {Array.from({ length: 9 }, (_, index) => {
          const offset = index * 14;
          if (poster.shape === 'rings')
            return (
              <ellipse
                key={index}
                cx="200"
                cy="214"
                rx={40 + offset}
                ry={128 - index * 10}
                transform={`rotate(-35 200 214)`}
                stroke="currentColor"
                strokeWidth="2"
              />
            );
          if (poster.shape === 'waves')
            return (
              <path
                key={index}
                d={`M-30 ${132 + offset} Q80 ${20 + offset} 200 ${150 + offset} T430 ${150 + offset}`}
                stroke="currentColor"
                strokeWidth="3"
              />
            );
          return (
            <rect
              key={index}
              x={91 + index * 8}
              y={98 + index * 8}
              width={218 - index * 16}
              height={218 - index * 16}
              rx="12"
              transform={`rotate(${index * 6 - 24} 200 207)`}
              stroke="currentColor"
              strokeWidth="2"
            />
          );
        })}
        <circle cx="305" cy="95" r="12" fill="currentColor" />
        <text x="26" y="32" fill="currentColor" fontSize="11" letterSpacing="3">
          LAB / {poster.category.toUpperCase()}
        </text>
        <text x="26" y="425" fill="currentColor" fontSize="28" fontWeight="600" letterSpacing="-1">
          {poster.title}
        </text>
        <text x="374" y="425" textAnchor="end" fill="currentColor" fontSize="11">
          ED. 01
        </text>
      </svg>
    </div>
  );
}
