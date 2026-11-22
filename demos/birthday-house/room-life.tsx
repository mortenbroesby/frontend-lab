import { useId, type CSSProperties } from 'react';
import type { RoomView } from './locations';
import './room-life.css';

type Window = { x: number; y: number; w: number; h: number; round: boolean };
const wide: Window[] = [
  { x: 7.5, y: 13, w: 20, h: 43, round: false },
  { x: 56.3, y: 27, w: 12.8, h: 22.6, round: true },
  { x: 17.4, y: 16, w: 22.2, h: 37.5, round: true },
];
const tall: Window[] = [
  { x: 5, y: 20, w: 23, h: 28, round: false },
  { x: 54, y: 36.5, w: 21, h: 12, round: true },
  { x: 12.5, y: 29.5, w: 24.7, h: 18.7, round: true },
];
const lights = [
  [
    [8.1, 45],
    [9.2, 46.2],
    [14.1, 42.8],
    [18.7, 44.2],
    [23.2, 43.7],
    [25.7, 42.9],
  ],
  [
    [59.3, 44],
    [63.5, 43],
    [66.2, 42],
  ],
  [
    [23.8, 47.2],
    [29.6, 45],
    [35.6, 43.5],
  ],
];
const portraitLights = [
  [
    [9.7, 43.4],
    [12.9, 43.1],
    [19.3, 43],
    [23.7, 42.7],
  ],
  [
    [58.8, 46],
    [63.5, 45.5],
    [68, 45],
  ],
  [
    [22, 44],
    [28.6, 42.3],
    [32, 43.8],
  ],
];
export function RoomLife({ view }: { view: RoomView }) {
  const id = useId();
  const window = (view.portrait ? tall : wide)[view.room]!;
  const villageLights = (view.portrait ? portraitLights : lights)[view.room]!;
  return (
    <svg className="room-life" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <radialGradient id={`${id}-glow`}>
          <stop stopColor="#ffe9a6" stopOpacity=".8" />
          <stop offset="1" stopColor="#ffc26c" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-leaf`} x2="1" y2="1">
          <stop stopColor="#7e9766" />
          <stop offset=".5" stopColor="#46684d" />
          <stop offset="1" stopColor="#233f37" />
        </linearGradient>
        <mask id={`${id}-window`} maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100">
          <WindowShape window={window} />
          <rect
            x={window.x + window.w * 0.48}
            y={window.y}
            width={view.portrait ? 0.65 : 0.5}
            height={window.h}
            fill="black"
          />
          <rect
            x={window.x}
            y={window.y + window.h * 0.46}
            width={window.w}
            height={view.portrait ? 0.45 : 0.7}
            fill="black"
          />
        </mask>
      </defs>
      <g mask={`url(#${id}-window)`}>
        <g className="village-clouds">
          <ellipse
            cx={window.x + window.w * 0.3}
            cy={window.y + window.h * 0.25}
            rx={window.w * 0.48}
            ry={window.h * 0.045}
            fill="#d4e3f0"
            opacity=".065"
          />
          <ellipse
            cx={window.x + window.w * 0.75}
            cy={window.y + window.h * 0.18}
            rx={window.w * 0.35}
            ry={window.h * 0.025}
            fill="#b1c9e0"
            opacity=".075"
          />
        </g>
        {villageLights.map(([x, y], i) => (
          <ellipse
            key={i}
            className="village-light"
            cx={x}
            cy={y}
            rx={view.portrait ? 0.65 : 0.26}
            ry={view.portrait ? 0.32 : 0.45}
            fill={`url(#${id}-glow)`}
            style={{ '--house': i } as CSSProperties}
          />
        ))}
        <VillageWalker window={window} />
        <g className="window-drizzle">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <path
              key={i}
              d={`M ${window.x + (window.w * (i + 0.5)) / 6} ${window.y + (window.h * (i % 3)) / 4} l -.15 1.4`}
              stroke="#c4dbe7"
              strokeWidth=".06"
              opacity=".17"
            />
          ))}
        </g>
      </g>
      <RoomShadows id={id} view={view} />
      <ForegroundSprig id={id} portrait={view.portrait} />
    </svg>
  );
}
function WindowShape({ window: w }: { window: Window }) {
  return w.round ? (
    <ellipse cx={w.x + w.w / 2} cy={w.y + w.h / 2} rx={w.w / 2} ry={w.h / 2} fill="white" />
  ) : (
    <rect x={w.x} y={w.y} width={w.w} height={w.h} fill="white" />
  );
}
function VillageWalker({ window: w }: { window: Window }) {
  const ground = w.y + w.h * 0.89;
  return (
    <g transform={`translate(${w.x + w.w * 0.18} ${ground})`}>
      <path
        d={`M 0 .4 Q ${w.w * 0.29} -.35 ${w.w * 0.58} .4`}
        stroke="#203b4e"
        strokeWidth=".13"
        fill="none"
        opacity=".6"
      />
      <g className="village-walker" style={{ '--crossing': `${w.w * 0.58}px` } as CSSProperties}>
        <circle cx="0" cy="-.7" r=".13" fill="#142733" />
        <path
          d="M 0 -.55 l -.14 .45 .26 0 Z M -.06 -.1 l -.1 .35 M .06 -.1 l .1 .35"
          stroke="#172b36"
          strokeWidth=".09"
          fill="#172b36"
        />
        <circle cx=".27" cy="-.14" r=".09" fill="#e3c17d" />
      </g>
    </g>
  );
}
function ForegroundSprig({ id, portrait }: { id: string; portrait: boolean }) {
  return (
    <g
      className="foreground-sprig"
      transform={`translate(97 1) scale(${portrait ? 1.3 : 1} ${portrait ? 0.7 : 1})`}
    >
      <g className="sprig-sway">
        <path d="M 0 0 Q -3 5 -1 12 Q 1 16 -2 20" fill="none" stroke="#52604b" strokeWidth=".16" />
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <g
            key={i}
            transform={`translate(${-1.1 + Math.sin(i) * 0.8} ${2 + i * 2.4}) rotate(${i % 2 ? 35 : -45})`}
          >
            <path
              d="M 0 0 C -1.8 -.4 -2.6 .5 -2.8 1.8 C -1.3 2.3 -.1 1.6 0 0 Z"
              fill={`url(#${id}-leaf)`}
              stroke="#a1a270"
              strokeOpacity=".3"
              strokeWidth=".06"
            />
            <path d="M -.2 .2 -2.5 1.6" stroke="#a7b38a" strokeOpacity=".25" strokeWidth=".05" />
          </g>
        ))}
      </g>
    </g>
  );
}

function RoomShadows({ id, view }: { id: string; view: RoomView }) {
  return (
    <g className="illustrated-shadows">
      <defs>
        <radialGradient id={`${id}-table-light`}>
          <stop stopColor="#ffdb9f" stopOpacity=".08" />
          <stop offset="1" stopColor="#ffdb9f" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-cloth`}>
          <stop stopColor="#142d31" stopOpacity="0" />
          <stop offset=".5" stopColor="#142d31" stopOpacity=".14" />
          <stop offset="1" stopColor="#f2ddba" stopOpacity="0" />
        </linearGradient>
      </defs>
      <ellipse
        className="lamplight-on-timber"
        cx="55"
        cy={view.portrait ? 67 : 79}
        rx="28"
        ry="12"
        fill={`url(#${id}-table-light)`}
      />
      <path
        className="leaf-shadow"
        d="M 98 4 Q 91 15 96 25 M 95 14 q -6 -2 -5 3 q 4 1 5 -3 M 95 19 q 4 -3 4 1 q -1 3 -4 -1"
        fill="#061b1a"
        fillOpacity=".12"
        stroke="#08211e"
        strokeOpacity=".12"
        strokeWidth=".3"
      />
      {view.room === 0 && (
        <g className="curtain-folds" fill={`url(#${id}-cloth)`}>
          <path
            d={
              view.portrait
                ? 'M 1 5 Q 5 24 2 44 L 3 57 L 0 57 L 0 5 Z'
                : 'M 1 4 Q 8 20 4 44 L 5 63 L 1 63 L 0 4 Z'
            }
          />
          <path
            d={
              view.portrait
                ? 'M 29 8 Q 32 28 30 49 L 33 55 L 31 9 Z'
                : 'M 29 2 Q 32 25 31 49 L 33 59 L 35 59 L 33 2 Z'
            }
          />
        </g>
      )}
    </g>
  );
}
