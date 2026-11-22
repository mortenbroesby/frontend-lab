import { useState } from 'react';
import type { Action, Game } from './game';
import { tr } from './language';
import { lanternKeeper } from './nisse';

export function WickPuzzle({
  game,
  perform,
  onClose,
}: {
  game: Game;
  perform: (action: Action, keep?: boolean) => void;
  onClose: () => void;
}) {
  const [miss, setMiss] = useState(false);
  return (
    <>
      <img className="wick-keeper" src={lanternKeeper} alt="" />
      <p>
        {game.wickLit
          ? tr(
              'Vægen gløder. Tryllelygten har fået lys.',
              'The wick glows. The projector has its light.',
            )
          : game.inserted
            ? tr(
                '“Min flamme tænder kun én væge.” Nissen peger på skodderne. “Hvilket tegn har du set dér?”',
                '“My flame will light just one wick.” The elf points to the shutters. “Which mark did you see there?”',
              )
            : tr(
                '“Først billedet, så lyset.” Nissen venter, mens du sætter pladen i tryllelygten.',
                '“First the picture, then the light.” The elf waits while you fit the plate into the projector.',
              )}
      </p>
      {game.inserted && !game.wickLit && (
        <>
          <div className="wick-symbols">
            {[
              ['☾', tr('Måne', 'Moon')],
              ['☀', tr('Sol', 'Sun')],
              ['✦', tr('Stjerne', 'Star')],
            ].map(([symbol, label]) => (
              <button
                className="ink-button"
                key={symbol}
                onClick={() => (symbol === '☀' ? perform('lightwick', true) : setMiss(true))}
              >
                <span aria-hidden="true">{symbol}</span>
                {label}
              </button>
            ))}
          </div>
          <p role="status" className="quiet">
            {miss &&
              tr(
                'Vægen er kold. Se på skodderne igen.',
                'The wick stays cold. Take another look at the shutters.',
              )}
          </p>
        </>
      )}
      <button className="text-button" onClick={onClose}>
        {tr('Tilbage til rummet', 'Back to the room')}
      </button>
    </>
  );
}
