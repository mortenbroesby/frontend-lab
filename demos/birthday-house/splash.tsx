import entrance from './art/entrance.png';

export function SplashScreen({ onStart }: { onStart: () => void }) {
  return (
    <section className="splash-screen" aria-label="Fødselsdagshusets startskærm">
      <img
        className="splash-art"
        src={entrance}
        alt="Et hyggeligt dansk hus med lys i vinduerne i den blå time"
        fetchPriority="high"
      />
      <div className="splash-vignette" />
      <div className="splash-mist" aria-hidden="true" />
      <div className="splash-title">
        <p>ET LILLE MYSTERIUM</p>
        <h1 aria-label="Fødselsdagshuset">
          Fødselsdags-
          <br />
          <em>huset</em>
        </h1>
      </div>
      <div className="splash-entry">
        <button className="gold-button" onClick={onStart}>
          Start spillet <span aria-hidden="true">→</span>
        </button>
      </div>
    </section>
  );
}
