import { tr } from './language.ts';
import type { Game } from './game';
import { PaperDialog } from './inspection';
export function Journal({ game, onClose }: { game: Game; onClose: () => void }) {
  return (
    <PaperDialog
      title={tr('Det, vi gemmer', 'The things we keep')}
      onClose={onClose}
      className="notebook"
    >
      {!game.note && !game.negative && (
        <p>
          {tr(
            'Siderne venter. Gå på opdagelse — dine fund får en plads her.',
            'The pages are waiting. Explore the house and your discoveries will find a home here.',
          )}
        </p>
      )}
      {game.note && (
        <section>
          <h3>{tr('Invitationen', 'The invitation')}</h3>
          <p>
            {tr(
              '“Begynd med det, der hæver før daggry. Rør så ved det, der bærer et ønske. Slut med det, der jager søvnen væk.”',
              '“Begin with what rises before dawn. Then touch what holds a wish. Finish with what chases sleep away.”',
            )}
          </p>
        </section>
      )}
      {game.recipe && (
        <section>
          <h3>{tr('Fotografens vers', 'The photographer’s verse')}</h3>
          <p>
            {tr(
              '“Tre spejle låner nissens lys. Lad det vandre op, hen og ned til glaspladen.”',
              '“Three mirrors borrow the elf’s light. Let it travel up, across and down to the glass plate.”',
            )}
          </p>
        </section>
      )}
      {game.nisseGift && (
        <section>
          <h3>{tr('Nissens messingknap', 'The elf’s brass button')}</h3>
          <p>{tr('Et lille minde fra hans koptrick.', 'A little keepsake from his cup trick.')}</p>
        </section>
      )}
      {game.negative && <PlateEntry developed={game.plate} />}
      <button className="ink-button" onClick={onClose}>
        {tr('Luk notesbogen', 'Close the notebook')}
      </button>
    </PaperDialog>
  );
}

function PlateEntry({ developed }: { developed: boolean }) {
  return (
    <section>
      <h3>
        {developed
          ? tr('Den fremkaldte glasplade', 'The developed glass plate')
          : tr('Et sovende minde', 'A sleeping memory')}
      </h3>
      {developed ? (
        <div className="glass-clue">
          <span>{tr('Vandret   ✦ — ✦', 'Horizontal   ✦ — ✦')}</span>
          <span>
            {tr('Lodret   ✦', 'Vertical   ✦')}
            <br />
            　　　 ✦<br />
            　　　 ✦
          </span>
        </div>
      ) : (
        <p>
          {tr(
            'En kølig, mørk glasplade. Billedet venter på at blive fremkaldt.',
            'A cool, dark glass plate. A picture is waiting to be developed.',
          )}
        </p>
      )}
    </section>
  );
}
