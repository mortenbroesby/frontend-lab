import { tr } from './language.ts';
import { useId, useState, type CSSProperties } from 'react';
import { connectedMirrors, lightPath, mirrorPoints, mirrorTargets } from './mini-games';
import type { Game, Action } from './game';
import nisse from './art/nisse.svg';
import './mini-games.css';
export function StarLantern({
  game,
  perform,
  onClose,
}: {
  game: Game;
  perform: (action: Action, keep?: boolean) => void;
  onClose: () => void;
}) {
  const id = useId();
  const [help, setHelp] = useState(false);
  const connected = connectedMirrors(game.mirrors);
  const beam = lightPath(game.mirrors)
    .map((p) => p.join(','))
    .join(' ');
  return (
    <>
      <p className="mini-intro">
        {tr(
          'Drej spejlene. Lad lyset finde glaspladen.',
          'Turn the mirrors. Guide the light onto the glass plate.',
        )}
      </p>
      <div className={`lantern-board ${game.plate ? 'lantern-solved' : ''}`}>
        <svg viewBox="0 0 100 70" aria-hidden="true">
          <defs>
            <radialGradient id={`${id}-glow`}>
              <stop stopColor="#ffdf96" stopOpacity=".3" />
              <stop offset="1" stopColor="#ffdf96" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="50" cy="35" r="47" fill={`url(#${id}-glow)`} />
          <path
            d="M 8 55 H 25 V 22 H 73 V 55"
            fill="none"
            stroke="#b39c6e"
            strokeWidth=".35"
            strokeDasharray=".5 2"
            opacity=".4"
          />
          <rect
            x="64"
            y="47"
            width="18"
            height="16"
            rx="1"
            fill="#28414d"
            stroke="#b8bdad"
            strokeWidth=".7"
          />
          <path
            d="M 68 51 H 78 M 73 55 V 61"
            fill="none"
            stroke={game.plate ? '#fff1ba' : '#52626b'}
            strokeWidth=".5"
          />
          {[
            [68, 51],
            [78, 51],
            [73, 55],
            [73, 58],
            [73, 61],
          ].map(([x, y], i) => (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={game.plate ? 1 : 0.5}
              fill={game.plate ? '#fff5cf' : '#697b7f'}
            />
          ))}
          {game.negative && (
            <>
              <polyline className="lantern-beam halo" points={beam} />
              <polyline className="lantern-beam" points={beam} />
            </>
          )}
          <circle cx="8" cy="55" r="3" fill="#ffe1a0" />
          {help &&
            mirrorPoints.map(([x, y], i) => (
              <path
                key={i}
                d="M -5 0 H 5"
                transform={`translate(${x} ${y}) rotate(${mirrorTargets[i]! * 45})`}
                stroke="#bdeee3"
                strokeWidth=".5"
                strokeDasharray="1 1"
              />
            ))}
        </svg>
        <img className="lantern-nisse" src={nisse} alt="" />
        {mirrorPoints.map(([x, y], i) => (
          <button
            key={i}
            className={`mirror-control ${i < connected ? 'mirror-connected' : ''}`}
            style={
              {
                left: `${x}%`,
                top: `${(y! / 70) * 100}%`,
                '--mirror-angle': `${game.mirrors[i]! * 45}deg`,
              } as CSSProperties
            }
            aria-label={tr(`Spejl ${i + 1} — drej`, `Mirror ${i + 1} — turn`)}
            disabled={!game.negative || i < connected}
            onClick={() => perform((['mirror0', 'mirror1', 'mirror2'] as const)[i]!, true)}
          >
            <i />
            <span>{i < connected ? '✦' : i + 1}</span>
          </button>
        ))}
      </div>
      <p className="mini-status" role="status">
        {game.plate
          ? tr(
              'Stjernerne vågner. Trappen til loftet er åben.',
              'The stars are waking. The attic stairs are open.',
            )
          : game.negative
            ? tr(`${connected} af 3 lysforbindelser`, `${connected} of 3 light connections`)
            : tr('Find først glaspladen i kameraet.', 'First, find the glass plate in the camera.')}
      </p>
      <div className="mini-actions">
        {game.plate ? (
          <button className="ink-button" onClick={() => perform('attic')}>
            {tr('Gå til loftet ↗', 'Go to the attic ↗')}
          </button>
        ) : (
          <button className="text-button" onClick={() => setHelp(!help)}>
            Hint
          </button>
        )}
        <button className="text-button" onClick={onClose}>
          {tr('Gem og gå tilbage', 'Save and go back')}
        </button>
      </div>
      {help && !game.plate && (
        <p className="quiet">
          {tr(
            'Følg de lyse, stiplede streger. De rigtige spejle bliver stående.',
            'Follow the pale dotted lines. Each mirror stays put when you get it right.',
          )}
        </p>
      )}
    </>
  );
}
