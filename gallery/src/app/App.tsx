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
  const trackPage = route.slice(`/track/${track.id}`.length + 1) || 'overview';
  return <>
    <nav className="guide-nav" aria-label="Track guide">
      {[['overview', 'Overview'], ['examples', 'Explore demos'], ['get-started', 'Get started'], ['explore', 'Explore further'], ...(track.id === 'code-quality' ? [['fallow', 'Fallow guide']] : [])].map(([page, label]) =>
        <a key={page} aria-current={trackPage === page ? 'page' : undefined} href={`#/track/${track.id}${page === 'overview' ? '' : '/' + page}`}>{label}</a>)}
    </nav>
    {trackPage === 'examples' ? <><Gallery track={track.id} /><GuideView document={`tracks/${track.id}/examples`} /></> : <GuideView document={`tracks/${track.id}/${trackPage}`} />}
  </>;
}

function findTrack(route: string) {
  return tracks.find(t => [`/track/${t.id}`, ...['get-started', 'explore', 'examples', ...(t.id === 'modern-web' ? ['devices'] : []), ...(t.id === 'code-quality' ? ['fallow'] : [])].map(page => `/track/${t.id}/${page}`)].includes(route));
}

function pageTitle(route: string, track?: typeof tracks[number], demo?: typeof demos[number]) {
  if (track) return track.title;
  if (demo) return demo.title;
  if (guides[route]) return guides[route].title;
  if (route === '/') return 'Choose your track.';
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
        <p>{track?.description ?? demo?.description ?? 'Find something that sparks your curiosity. Try a demo or get straight to experimenting—solo or together.'}</p>
      </section>
      {route === '/' && <>
        <div className="journey-grid">{tracks.map(t => <article className="journey-card" data-track={t.id} key={t.id}><h2>{t.title}</h2><p>{t.description}</p><a href={`#/track/${t.id}`}>Choose this track →</a></article>)}</div>
      </>}
      {track && <TrackGuide track={track} route={route} />}
      {guide && <GuideView document={guide.document} />}
      {demo && <p><a href={demo.href}>Open standalone demo ↗</a></p>}
      {route === '/create' && <GuideView document="create-demo" />}
      {!track && !demo && !guide && route !== '/' && route !== '/create' && <p><a href="#/">Return to the tracks</a></p>}
    </main><footer><span>THE FRONT-END LAB</span><span>No perfect outcome required. Just curiosity.</span></footer>
  </>;
}
