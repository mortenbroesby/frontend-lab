import { EntranceSettings } from './entrance-settings';
import { tr } from './language';
import entrance from './art/entrance.png';

export function SplashScreen({ onStart }: { onStart: () => void }) {
  return (
    <section
      className="splash-screen"
      aria-label={tr('Fødselsdagshusets startskærm', 'The Birthday House entrance')}
    >
      <img
        className="splash-art"
        src={entrance}
        alt={tr(
          'Et hyggeligt dansk hus med lys i vinduerne i den blå time',
          'A cosy Danish house with lit windows at dusk',
        )}
        fetchPriority="high"
      />
      <div className="splash-vignette" />
      <div className="splash-mist" aria-hidden="true" />
      <div className="splash-title">
        <p>{tr('ET LILLE MYSTERIUM', 'A LITTLE MYSTERY')}</p>
        <h1 aria-label={tr('Fødselsdagshuset', 'The Birthday House')}>
          {tr('Fødselsdags-', 'The Birthday')}
          <br />
          <em>{tr('huset', 'House')}</em>
        </h1>
      </div>
      <div className="splash-entry">
        <button className="gold-button" onClick={onStart}>
          {tr('Start spillet', 'Start game')} <span aria-hidden="true">→</span>
        </button>
        <EntranceSettings />
      </div>
    </section>
  );
}
