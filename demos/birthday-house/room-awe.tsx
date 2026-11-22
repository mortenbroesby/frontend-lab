import { useId, type CSSProperties } from 'react';
import type { RoomView } from './locations';
import './room-awe.css';
export function RoomAwe({ view, awake }: { view: RoomView; awake: boolean }) {
  const id = useId();
  if (view.room !== 2 || !awake) return null;
  return (
    <svg className="room-awe" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-fade`} x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="white" />
          <stop offset=".65" stopColor="white" />
          <stop offset="1" stopColor="black" />
        </linearGradient>
        <mask id={`${id}-roof`}>
          <rect width="100" height={view.portrait ? 34 : 24} fill={`url(#${id}-fade)`} />
        </mask>
        <radialGradient id={`${id}-aurora`}>
          <stop stopColor="#79d4c9" stopOpacity=".35" />
          <stop offset=".5" stopColor="#9c83cb" stopOpacity=".2" />
          <stop offset="1" stopColor="#2c4474" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g className="sky-awakening" mask={`url(#${id}-roof)`}>
        <rect width="100" height="40" fill="#0c1830" />
        <ellipse
          className="aurora-ribbon"
          cx="48"
          cy="12"
          rx="58"
          ry="18"
          fill={`url(#${id}-aurora)`}
        />
        {Array.from({ length: 62 }, (_, i) => (
          <circle
            key={i}
            className="ceiling-star"
            cx={(i * 37.71) % 100}
            cy={(i * 13.27) % 31}
            r={i % 5 === 0 ? 0.18 : 0.08}
            fill="#fff2cc"
            style={{ '--star-delay': `${(i % 9) * 0.22}s` } as CSSProperties}
          />
        ))}
        <path
          className="ceiling-constellation"
          d="M 14 12 20 9 28 13 34 7 M 62 10 68 5 75 8 82 4"
          fill="none"
          stroke="#fce0a0"
          strokeWidth=".1"
          opacity=".45"
        />
        <path
          className="shooting-star"
          d="M -12 6 l 7 -1"
          fill="none"
          stroke="#ffe6b8"
          strokeWidth=".13"
        />
      </g>
    </svg>
  );
}
