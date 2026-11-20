import { Button } from '@lab/ui/button';
import { upgradeCost, upgrades, type Round, type Upgrade } from './rules';

export function UpgradeShop({
  round,
  buy,
  resume,
}: {
  round: Round;
  buy: (id: Upgrade) => void;
  resume: () => void;
}) {
  return (
    <section
      className="mb-menu mb-shop"
      aria-label="Upgrade desk"
      onKeyDown={(e) => {
        if (e.key === 'Escape') resume();
      }}
    >
      <div>
        <h2>Upgrade desk</h2>
        <p role="status">Wallet: {round.storyPoints} story points</p>
        <p>Earn 1 per clean merge or caught bug. Gear lasts this shift. Clock paused.</p>
        <div className="mb-stock">
          {upgrades.map((item) => (
            <button
              key={item.id}
              aria-label={item.name}
              aria-describedby={`${item.id}-detail ${item.id}-price`}
              disabled={round.installed[item.id] || round.storyPoints < upgradeCost}
              onClick={() => buy(item.id)}
            >
              <strong>{item.name}</strong>
              <span id={item.id + '-detail'}>{item.detail}</span>
              <b id={item.id + '-price'}>
                {round.installed[item.id] ? 'Installed' : upgradeCost + ' SP'}
              </b>
            </button>
          ))}
        </div>
        <Button autoFocus onClick={resume}>
          Resume round
        </Button>
      </div>
    </section>
  );
}
