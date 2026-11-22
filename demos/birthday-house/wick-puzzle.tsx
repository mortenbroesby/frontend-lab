import { useState } from 'react';
import type { Action, Game } from './game';
import { tr } from './language';

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
      <p>
        {game.wickLit
          ? tr(
              'Vægen gløder. Tryllelygten har fået lys.',
              'The wick glows. The projector has its light.',
            )
          : game.inserted
            ? tr(
                'Tre tegn er ridset ind i messingen. Vælg det tegn, du så på skodderne.',
                'Three marks are etched into the brass. Choose the one you saw on the shutters.',
              )
            : tr(
                'Sæt først glaspladen i tryllelygten. Så kan du tænde vægen.',
                'Fit the glass plate into the projector first. Then you can light the wick.',
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
