import type { Game } from './game';
import { PaperDialog } from './inspection';
export function Journal({ game, onClose }: { game: Game; onClose: () => void }) {
  return (
    <PaperDialog title="Things worth keeping" onClose={onClose} className="notebook">
      {!game.note && !game.negative && (
        <p>
          The pages are waiting. Explore the house; anything you discover will find a home here.
        </p>
      )}
      {game.note && (
        <section>
          <h3>The invitation</h3>
          <p>
            “Begin with what rises before dawn. Then touch the thing that holds a wish. End with
            what chases sleep away.”
          </p>
        </section>
      )}
      {game.recipe && (
        <section>
          <h3>The photographer’s verse</h3>
          <p>
            “Moon wakes the silver. Rain stills its dreaming. A star keeps the memory, long after
            morning.”
          </p>
        </section>
      )}
      {game.negative && (
        <section>
          <h3>{game.plate ? 'The developed glass plate' : 'A sleeping memory'}</h3>
          {game.plate ? (
            <div className="glass-clue">
              <span>Horizon &nbsp; ✦ — ✦</span>
              <span>
                Sky &nbsp; ✦<br />
                　　　 ✦<br />
                　　　 ✦
              </span>
            </div>
          ) : (
            <p>A cool, dark glass plate. Its image has yet to be developed.</p>
          )}
        </section>
      )}
      <button className="ink-button" onClick={onClose}>
        Close notebook
      </button>
    </PaperDialog>
  );
}
