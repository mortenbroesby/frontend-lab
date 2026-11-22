import entrance from './art/entrance.png';

export function SplashScreen({ onStart }: { onStart: () => void }) {
  return (
    <section className="splash-screen" aria-label="The Birthday House title screen">
      <img
        className="splash-art"
        src={entrance}
        alt="A welcoming Danish cottage glowing at blue hour"
        fetchPriority="high"
      />
      <div className="splash-vignette" />
      <div className="splash-mist" aria-hidden="true" />
      <div className="splash-title">
        <p>A LITTLE MYSTERY</p>
        <h1>
          The Birthday
          <br />
          <em>House</em>
        </h1>
      </div>
      <div className="splash-entry">
        <button className="gold-button" onClick={onStart}>
          Start Game <span aria-hidden="true">→</span>
        </button>
      </div>
    </section>
  );
}
