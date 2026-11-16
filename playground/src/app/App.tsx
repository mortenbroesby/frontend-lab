import { lazy, Suspense, useEffect, useState } from 'react';
import { demos } from '../demo-registry';
import { tracks } from './tracks';
import type { TrackId } from '../demo-contract';

import { DemoBoundary } from './DemoBoundary';

const trackTitle = (id: TrackId) => tracks.find(track => track.id === id)!.title;

const Template = lazy(() => import('../demos/template/Demo'));
const BrowserStarter = lazy(() => import('../starters/BrowserStarter').then(m => ({ default: m.BrowserStarter })));
// Optional source-repository link; local use needs no remote.
const sourceUrl = import.meta.env.VITE_SOURCE_URL?.replace(/\/$/, '');

function BootstrapLink({ track }: { track: TrackId }) {
  const path = `tracks/${track}/bootstrap.md`;
  return sourceUrl
    ? <a href={`${sourceUrl}/${path}`}>Read the bootstrap guide</a>
    : <span>Open <code>{path}</code> in your editor</span>;
}

function Gallery({ track }: { track?: TrackId }) {
  return <div className="journey-grid">{demos.filter(d => !track || d.track === track).map(d => <article className="journey-card" data-track={d.track} key={d.id}>
    <p className="eyebrow">{trackTitle(d.track)} · {d.author}</p><h3><a href={`#/demo/${d.id}`}>{d.title}</a></h3><p>{d.description}</p>
  </article>)}</div>;
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
  const track = tracks.find(t => route === `/track/${t.id}`);
  const demo = demos.find(d => route === `/demo/${d.id}`);
  const title = track?.title ?? demo?.title ?? (route === '/' ? 'Follow your what if.' : route === '/create' ? 'Make room for your idea.' : 'Page not found');
  useEffect(() => { document.title = `${title} · The Front-End Lab`; }, [title]);
  return <>
    <a className="skip-link" href="#content" onClick={event => { event.preventDefault(); document.getElementById('content')?.focus(); }}>Skip to content</a>
    <header className="site-header"><a className="wordmark" href="#/">✳ THE FRONT-END LAB</a><nav aria-label="Lab"><a href="#/">All tracks</a><a href="#/create">Create a demo</a></nav></header>
    <main id="content" tabIndex={-1}>
      <section className="starter-welcome"><p className="eyebrow">{demo ? `${trackTitle(demo.track)} · ${demo.author}` : 'Four tracks. Shared discoveries.'}</p><h1>{title}</h1>
        <p>{track?.description ?? demo?.description ?? 'Explore a reference, start your own experiment, and share what you discover. Go solo or team up.'}</p>
      </section>
      {route === '/' && <>
        <div className="journey-grid">{tracks.map(t => <article className="journey-card" data-track={t.id} key={t.id}><h2>{t.title}</h2><p>{t.description}</p><a href={`#/track/${t.id}`}>Explore {t.title} →</a></article>)}</div>
        <section className="examples-intro"><div><p className="eyebrow">Experience it. Take it apart. Make it yours.</p><h2>The shared gallery</h2><p>Reference examples live here alongside demos contributed through Git.</p></div></section><Gallery />
      </>}
      {track && <><section className="inspect-panel"><div><h2>Getting started</h2><p>{track.start}</p><p><BootstrapLink track={track.id} /> · <a href="#/create">Use the shared demo template</a></p><p className="source">Local guide: <code>tracks/{track.id}/bootstrap.md</code></p></div><div><h3>Questions to explore</h3><ul>{track.ideas.map(idea => <li key={idea}>{idea}</li>)}</ul></div></section>
        {track.id === 'modern-web' && <section className="experiment"><DemoBoundary><Suspense fallback={<p role="status">Loading starter…</p>}><BrowserStarter /></Suspense></DemoBoundary></section>}
        <h2>Reference examples</h2><Gallery track={track.id} /></>}
      {demo && <><section id={demo.id} className="experiment"><DemoBoundary key={demo.id}><Suspense fallback={<p role="status">Loading experiment…</p>}><demo.Component /></Suspense></DemoBoundary></section><p><a href={`#/track/${demo.track}`}>Back to {trackTitle(demo.track)}</a> · <a href="#/create">Build your own version</a></p></>}
      {route === '/create' && <><section className="inspect-panel"><div><h2>One command. Your own demo.</h2><p>This page is a preview. To save your own code changes, generate a demo in your local checkout.</p><ol><li>Run <code>npm run demo:new</code> from the repository root.</li><li>Give your demo a name, confirm its suggested ID, then choose a track, author and description.</li><li>Run <code>npm run dev</code> if needed. Open the printed demo route at your local server and edit <code>playground/src/demos/&lt;id&gt;/Demo.tsx</code>.</li></ol><p>Modern Web starts with a circle and radius control; other tracks start with an idea and colour. Your generated README gives you a first change and success check. No shared files need editing. The full guide is in <code>playground/src/demos/template/README.md</code>.</p></div><div><h3>Share through Git</h3><p>Work on your own branch. Run the checks, commit your demo and open a pull request. Once merged, others pull the latest version to see your work here.</p><p>For an external project, contribute a short findings component with an appropriate link or walkthrough. Do not commit private code or data from another repository.</p></div></section>
        <section className="experiment"><DemoBoundary><Suspense fallback={<p role="status">Loading template…</p>}><Template /></Suspense></DemoBoundary></section></>}
      {!track && !demo && route !== '/' && route !== '/create' && <p><a href="#/">Return to the tracks</a></p>}
      <section className="takeaway"><h2>Leave a small trail.</h2><p>Your question, what you tried, one discovery. Use <code>tracks/findings.md</code>.</p></section>
    </main><footer><span>THE FRONT-END LAB</span><span>No perfect outcome required. Just curiosity.</span></footer>
  </>;
}
