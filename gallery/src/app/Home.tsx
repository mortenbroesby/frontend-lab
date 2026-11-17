import { Button } from '@lab/ui/button';
import { demos } from '../demo-registry';
import { tracks } from './tracks';
import { TrackIllustration } from './TrackIllustration';

export function Home() {
  return (
    <>
      <section className="my-8 text-center sm:text-left" aria-label="Choose an experiment">
        <Button asChild>
          <a
            href="#tracks-heading"
            onClick={(event) => {
              event.preventDefault();
              const heading = document.getElementById('tracks-heading');
              heading?.focus({ preventScroll: true });
              heading?.scrollIntoView({ block: 'start' });
            }}
          >
            Choose a track ↓
          </a>
        </Button>
      </section>
      <HomeJourneys />
      <TrackChoices />
    </>
  );
}

function HomeJourneys() {
  return (
    <nav className="home-journeys" aria-label="Resources for your experiment">
      <a href="#/demos">
        <span className="journey-label">
          Try demos <span aria-hidden="true">↗</span>
        </span>
        <span>See an experiment in action.</span>
      </a>
      <a href="#/guides">
        <span className="journey-label">
          Follow guides <span aria-hidden="true">↗</span>
        </span>
        <span>Learn an approach you can reuse.</span>
      </a>
    </nav>
  );
}

function TrackChoices() {
  return (
    <section aria-labelledby="tracks-heading">
      <div className="track-heading">
        <h2 id="tracks-heading" tabIndex={-1}>
          Choose a track
        </h2>
        <p>Pick the direction that interests you. You can bring your own idea.</p>
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
              <TrackIllustration track={t.id} />
              <span className="track-number">
                {demos.filter((demo) => demo.tracks.includes(t.id)).length} demos ·{' '}
                {t.guides.length} guides
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
