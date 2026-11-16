import { demos } from '../demo-registry';
import { tracks } from './tracks';
import { TrackSymbol } from './TrackSymbol';

export function Home() {
  return (
    <>
      <HomeJourneys />
      <TrackChoices />
    </>
  );
}

function HomeJourneys() {
  return (
    <nav className="home-journeys" aria-label="Choose a journey">
      <a
        href="#tracks-heading"
        onClick={(event) => {
          event.preventDefault();
          const heading = document.getElementById('tracks-heading');
          heading?.focus({ preventScroll: true });
          heading?.scrollIntoView({ block: 'start' });
        }}
      >
        <span className="journey-label">
          Explore tracks <span aria-hidden="true">↓</span>
        </span>
        <span>Find an idea worth trying.</span>
      </a>
      <a href="#/demos">
        <span className="journey-label">
          Try demos <span aria-hidden="true">↗</span>
        </span>
        <span>See an experiment in action.</span>
      </a>
      <a href="#/create">
        <span className="journey-label">
          Create a demo <span aria-hidden="true">↗</span>
        </span>
        <span>Start with a small React app.</span>
      </a>
    </nav>
  );
}

function TrackChoices() {
  return (
    <section aria-labelledby="tracks-heading">
      <div className="track-heading">
        <h2 id="tracks-heading" tabIndex={-1}>
          Explore tracks
        </h2>
        <p>Choose a direction. Follow your curiosity.</p>
      </div>
      <div className="track-grid">
        {tracks.map((t) => (
          <a
            className="track-card"
            data-track={t.id}
            key={t.id}
            href={`#/track/${t.id}`}
            aria-label={`Explore ${t.title}`}
          >
            <div className="track-card-top">
              <TrackSymbol track={t.id} />
              <span className="track-number">
                {demos.filter((demo) => demo.track === t.id).length} demos
              </span>
            </div>
            <h3>{t.title}</h3>
            <p>{t.description}</p>
            <span className="track-card-cta">
              Explore track
              <span className="track-link-arrow" aria-hidden="true">
                ↗
              </span>
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
