import { useEffect, useState } from 'react';
import { demos } from '../demo-registry';
import { tracks } from './tracks';
import type { TrackId } from '../demo-contract';

import { guides, GuideView } from './GuideView';

const trackTitle = (id: TrackId) => tracks.find(track => track.id === id)!.title;

function Gallery({ track }: { track?: TrackId }) {
  return <div className="journey-grid">{demos.filter(d => !track || d.track === track).map(d => <article className="journey-card" data-track={d.track} key={d.id}>
    <p className="eyebrow">{trackTitle(d.track)} · {d.author}</p><h3><a href={d.href}>{d.title}</a></h3><p>{d.description}</p>
  </article>)}</div>;
}

function TrackGuide({ track, route }: { track: typeof tracks[number]; route: string }) {
  const trackPage = route.slice(`/track/${track.id}`.length + 1) || 'get-started';
  return <>
        <nav className="guide-nav" aria-label="Track guide">
          {[['get-started', 'Getting started'], ['explore', 'Explore further'], ['examples', 'Worked examples'], ...(track.id === 'code-quality' ? [['fallow', 'Fallow guide']] : [])].map(([page, label]) =>
            <a key={page} aria-current={trackPage === page ? 'page' : undefined} href={`#/track/${track.id}${page === 'get-started' ? '' : '/' + page}`}>{label}</a>)}
        </nav>
        <GuideView document={`tracks/${track.id}/${trackPage}`} />
        <h2>Reference examples</h2><Gallery track={track.id} /></>;
}

function findTrack(route: string) {
  return tracks.find(t => [`/track/${t.id}`, `/track/${t.id}/explore`, `/track/${t.id}/examples`, ...(t.id === 'code-quality' ? ['/track/code-quality/fallow'] : [])].includes(route));
}

function pageTitle(route: string, track?: typeof tracks[number], demo?: typeof demos[number]) {
  if (track) return track.title;
  if (demo) return demo.title;
  if (guides[route]) return guides[route].title;
  if (route === '/') return 'Follow your what if.';
  if (route === '/create') return 'Make room for your idea.';
  return 'Page not found';
}

export function App() {
  const [route, setRoute] = useState(() => location.hash.slice(1) || '/');
  useEffect(() => {
    const navigate = () => { setRoute(location.hash.slice(1) || '/'); };
    window.addEventListener('hashchange', navigate);
    return () => window.removeEventListener('hashchange', navigate);
  }, []);
  useEffect(() => {
    document.getElementById('content')?.focus();
    window.scrollTo(0, 0);
  }, [route]);
  const track = findTrack(route);
  const guide = guides[route];
  const demo = demos.find(d => route === `/demo/${d.id}`);
  const title = pageTitle(route, track, demo);
  useEffect(() => { document.title = `${title} · The Front-End Lab`; }, [title]);
  return <>
    <a className="skip-link" href="#content" onClick={event => { event.preventDefault(); document.getElementById('content')?.focus(); }}>Skip to content</a>
    <header className="site-header"><a className="wordmark" href="#/">✳ THE FRONT-END LAB</a><nav aria-label="Lab"><a href="#/">All tracks</a><a href="#/create">Create a demo</a><a href="#/guide/setup">Local setup</a></nav></header>
    <main id="content" tabIndex={-1}>
      <section className="starter-welcome"><p className="eyebrow">{demo ? `${trackTitle(demo.track)} · ${demo.author}` : 'Four tracks. Shared discoveries.'}</p><h1>{title}</h1>
        <p>{track?.description ?? demo?.description ?? 'Explore a reference, start your own experiment, and share what you discover. Go solo or team up.'}</p>
      </section>
      {route === '/' && <>
        <div className="journey-grid">{tracks.map(t => <article className="journey-card" data-track={t.id} key={t.id}><h2>{t.title}</h2><p>{t.description}</p><a href={`#/track/${t.id}`}>Explore {t.title} →</a></article>)}</div>
        <section className="examples-intro"><div><p className="eyebrow">Experience it. Take it apart. Make it yours.</p><h2>The shared gallery</h2><p>Reference examples live here alongside demos contributed through Git.</p></div></section><Gallery />
      </>}
      {track && <TrackGuide track={track} route={route} />}
      {guide && <GuideView document={guide.document} />}
      {demo && <p><a href={demo.href}>Open standalone demo ↗</a></p>}
      {route === '/create' && <GuideView document="create-demo" />}
      {!track && !demo && !guide && route !== '/' && route !== '/create' && <p><a href="#/">Return to the tracks</a></p>}
      <section className="takeaway"><h2>Leave a small trail.</h2><p>Your question, what you tried, one discovery. <a href="#/guide/findings">Record your findings</a> and <a href="#/guide/contributing">share your work</a>.</p></section>
    </main><footer><span>THE FRONT-END LAB</span><span>No perfect outcome required. Just curiosity.</span></footer>
  </>;
}
