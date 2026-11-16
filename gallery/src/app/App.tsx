import { useEffect, useRef, useState, type ReactNode } from 'react';
import { requirementLabels } from '@lab/demo-kit/types';
import { demos } from '../demo-registry';
import { tracks } from './tracks';
import type { TrackId } from '../demo-contract';

import { GuideView } from './GuideView';

const trackTitle = (id: TrackId) => tracks.find((track) => track.id === id)!.title;

function Gallery({ track }: { track?: TrackId }) {
  const entries = demos.filter((d) => !track || d.track === track);
  if (!entries.length)
    return (
      <p>
        No demos yet. <a href="#/create">Create the first one</a> or try a track idea.
      </p>
    );
  return (
    <div className="journey-grid">
      {entries.map((d) => (
        <article className="journey-card" data-track={d.track} key={d.id}>
          <p className="eyebrow">
            {trackTitle(d.track)} · {d.author}
          </p>
          <h3>
            <a className="demo-title-link" href={d.href}>
              {d.title}
            </a>
          </h3>
          <p>{d.description}</p>
          {d.requirements && (
            <p className="demo-requirements">
              {d.requirements.map((id) => requirementLabels[id]).join(' · ')}
            </p>
          )}
        </article>
      ))}
    </div>
  );
}

function TrackGuide({ track, route }: { track: (typeof tracks)[number]; route: string }) {
  const trackPage = route.slice(`/track/${track.id}`.length + 1) || 'ideas';
  return (
    <>
      <nav className="guide-nav" aria-label="Track guide">
        {[
          ['ideas', 'Ideas'],
          ['examples', 'Demos'],
          ['get-started', 'Get started'],
        ].map(([page, label]) => (
          <a
            key={page}
            aria-current={trackPage === page ? 'page' : undefined}
            href={`#/track/${track.id}${page === 'ideas' ? '' : '/' + page}`}
          >
            {label}
          </a>
        ))}
      </nav>
      {trackPage === 'examples' ? (
        <>
          <Gallery track={track.id} />
          <GuideView document={`tracks/${track.id}/examples`} />
        </>
      ) : (
        <GuideView document={`tracks/${track.id}/${trackPage}`} />
      )}
    </>
  );
}

function findTrack(route: string) {
  return tracks.find((t) =>
    [
      `/track/${t.id}`,
      ...[
        'get-started',
        'examples',
        ...(t.id === 'modern-web' ? ['devices'] : []),
        ...(t.id === 'code-quality' ? ['fallow'] : []),
      ].map((page) => `/track/${t.id}/${page}`),
    ].includes(route),
  );
}

interface Page {
  title: string;
  description?: string;
  attribution?: string;
  content: ReactNode;
}

const pages: Record<string, Page> = {
  '/': { title: 'Choose your track.', content: <TrackChoices /> },
  '/create': { title: 'Create a demo.', content: <GuideView document="create-demo" /> },
  '/guide/setup': { title: 'Run the Lab locally', content: <GuideView document="setup" /> },
};
const notFound: Page = {
  title: 'Page not found',
  content: (
    <p>
      <a href="#/">Return to the tracks</a>
    </p>
  ),
};

function resolvePage(route: string): Page {
  const track = findTrack(route);
  if (track) return { ...track, content: <TrackGuide track={track} route={route} /> };
  const demo = demos.find((entry) => route === `/demo/${entry.id}`);
  if (demo)
    return {
      title: demo.title,
      description: demo.description,
      attribution: `${trackTitle(demo.track)} · ${demo.author}`,
      content: (
        <p>
          <a href={demo.href}>Open standalone demo ↗</a>
        </p>
      ),
    };
  return pages[route] ?? notFound;
}

function TrackChoices() {
  return (
    <section aria-labelledby="tracks-heading">
      <div className="track-heading">
        <h2 id="tracks-heading">Pick a starting point</h2>
        <p>04 tracks / Your own pace</p>
      </div>
      <div className="track-grid">
        {tracks.map((t, index) => (
          <a
            className="track-card"
            key={t.id}
            href={`#/track/${t.id}`}
            aria-label={`Explore ${t.title}`}
          >
            <div className="track-card-top">
              <span className="track-symbol" aria-hidden="true">
                {['◇', '{ }', '>_', '✳'][index]}
              </span>
              <span className="track-number" aria-hidden="true">
                0{index + 1}
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

function LabNavigation({ route }: { route: string }) {
  return (
    <nav aria-label="Lab">
      {[
        ['/', 'All tracks'],
        ['/create', 'Create a demo'],
        ['/guide/setup', 'Local setup'],
      ].map(([path, label]) => (
        <a
          className="site-nav-link"
          key={path}
          href={`#${path}`}
          aria-current={route === path ? 'page' : undefined}
        >
          {label}
        </a>
      ))}
    </nav>
  );
}

function useRoute() {
  const [route, setRoute] = useState(() => location.hash.slice(1) || '/');
  useEffect(() => {
    const navigate = () => {
      setRoute(location.hash.slice(1) || '/');
    };
    window.addEventListener('hashchange', navigate);
    return () => window.removeEventListener('hashchange', navigate);
  }, []);
  const previousRoute = useRef(route);
  useEffect(() => {
    const previousTrack = findTrack(previousRoute.current);
    const currentTrack = findTrack(route);
    if (previousRoute.current === route) return;
    previousRoute.current = route;
    const tab =
      previousTrack === currentTrack
        ? document.querySelector<HTMLElement>('.guide-nav [aria-current="page"]')
        : null;
    if (tab) {
      tab.focus({ preventScroll: true });
      tab.scrollIntoView({ block: 'nearest' });
    } else {
      document.getElementById('content')?.focus({ preventScroll: true });
      window.scrollTo(0, 0);
    }
  }, [route]);
  return route;
}

export function App() {
  const route = useRoute();
  const page = resolvePage(route);
  useEffect(() => {
    document.title = `${page.title} · The Front-End Lab`;
  }, [page.title]);
  return (
    <>
      <a
        className="skip-link"
        href="#content"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById('content')?.focus();
        }}
      >
        Skip to content
      </a>
      <header className="site-header">
        <a className="wordmark" href="#/">
          <span aria-hidden="true">↗</span>Front-End Lab
        </a>
        <LabNavigation route={route} />
      </header>
      <main id="content" className={route === '/' ? undefined : 'reading-page'} tabIndex={-1}>
        <section className="starter-welcome">
          {page.attribution && <p className="eyebrow welcome-eyebrow">{page.attribution}</p>}
          <h1>{page.title}</h1>
          <p className="welcome-description">
            {page.description ?? 'Try a demo or build your own—solo or together.'}
          </p>
        </section>
        {page.content}
      </main>
    </>
  );
}
