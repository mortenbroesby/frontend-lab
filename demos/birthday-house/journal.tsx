import type { Game } from './game';
import { PaperDialog } from './inspection';
export function Journal({ game, onClose }: { game: Game; onClose: () => void }) {
  return (
    <PaperDialog title="Det, vi gemmer" onClose={onClose} className="notebook">
      {!game.note && !game.negative && (
        <p>Siderne venter. Gå på opdagelse — dine fund får en plads her.</p>
      )}
      {game.note && (
        <section>
          <h3>Invitationen</h3>
          <p>
            “Begynd med det, der hæver før daggry. Rør så ved det, der bærer et ønske. Slut med det,
            der jager søvnen væk.”
          </p>
        </section>
      )}
      {game.recipe && (
        <section>
          <h3>Fotografens vers</h3>
          <p>
            “Månen vækker sølvet. Regnen giver drømmen ro. Stjernen gemmer mindet, længe efter
            morgen.”
          </p>
        </section>
      )}
      {game.negative && (
        <section>
          <h3>{game.plate ? 'Den fremkaldte glasplade' : 'Et sovende minde'}</h3>
          {game.plate ? (
            <div className="glass-clue">
              <span>Vandret &nbsp; ✦ — ✦</span>
              <span>
                Lodret &nbsp; ✦<br />
                　　　 ✦<br />
                　　　 ✦
              </span>
            </div>
          ) : (
            <p>En kølig, mørk glasplade. Billedet venter på at blive fremkaldt.</p>
          )}
        </section>
      )}
      <button className="ink-button" onClick={onClose}>
        Luk notesbogen
      </button>
    </PaperDialog>
  );
}
