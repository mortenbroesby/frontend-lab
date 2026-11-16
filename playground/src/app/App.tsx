import { lazy, Suspense, useEffect, useState } from 'react';
import { demos } from '../demo-registry';
import { tracks } from './tracks';
import { DemoBoundary } from './DemoBoundary';

const Template = lazy(() => import('../demos/template/Demo'));
const BrowserStarter = lazy(() => import('../starters/BrowserStarter').then(m => ({ default: m.BrowserStarter })));
const guide = 'https://github.com/mortenbroesby/frontend-chapter-day/blob/main/tracks';

function Gallery({ track }: { track?: string }) {
  return <div className="journey-grid">{demos.filter(d => !track || d.track === track).map(d => <article className="journey-card" key={d.id}>
    <p className="eyebrow">Track {d.track.toUpperCase()} · {d.author}</p><h3><a href={`#/demo/${d.id}`}>{d.title}</a></h3><p>{d.description}</p>
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
      <section className="starter-welcome"><p className="eyebrow">{demo ? `Track ${demo.track.toUpperCase()} · ${demo.author}` : 'Four tracks. Shared discoveries.'}</p><h1>{title}</h1>
        <p>{track?.description ?? demo?.description ?? 'Explore a reference, start your own experiment, and share what you discover. Go solo or team up.'}</p>
      </section>
      {route === '/' && <>
        <div className="journey-grid">{tracks.map(t => <article className="journey-card" key={t.id}><span className="track-letter">{t.id.toUpperCase()}</span><h2>{t.title}</h2><p>{t.description}</p><a href={`#/track/${t.id}`}>Explore Track {t.id.toUpperCase()} →</a></article>)}</div>
        <section className="examples-intro"><div><p className="eyebrow">Experience it. Take it apart. Make it yours.</p><h2>The shared gallery</h2><p>Reference examples live here alongside demos contributed through Git.</p></div></section><Gallery />
      </>}
      {track && <><section className="inspect-panel"><div><h2>Getting started</h2><p>{track.start}</p><p><a href={`${guide}/${track.id}/bootstrap.md`}>Read the bootstrap guide</a> · <a href="#/create">Use the shared demo template</a></p><p className="source">Local guide: <code>tracks/{track.id}/bootstrap.md</code></p></div><div><h3>Questions to explore</h3><ul>{track.ideas.map(idea => <li key={idea}>{idea}</li>)}</ul></div></section>
        {track.id === 'a' && <section className="experiment"><DemoBoundary><Suspense fallback={<p role="status">Loading starter…</p>}><BrowserStarter /></Suspense></DemoBoundary></section>}
        <h2>Reference examples</h2><Gallery track={track.id} /></>}
      {demo && <><section id={demo.id} className="experiment"><DemoBoundary key={demo.id}><Suspense fallback={<p role="status">Loading experiment…</p>}><demo.Component /></Suspense></DemoBoundary></section><p><a href={`#/track/${demo.track}`}>Back to Track {demo.track.toUpperCase()}</a> · <a href="#/create">Build your own version</a></p></>}
      {route === '/create' && <><section className="inspect-panel"><div><h2>One command. Your own demo.</h2><ol><li>Run <code>npm run demo:new</code> from the repository root.</li><li>Give your demo a name, confirm its suggested ID, then choose a track, author and description.</li><li>Open the printed demo route and edit your generated <code>Demo.tsx</code>.</li></ol><p>Turborepo creates your folder and registers it in the gallery. Keep state and styles local. The full guide is in <code>src/demos/template/README.md</code>.</p></div><div><h3>Share through Git</h3><p>Work on your own branch. Run the checks, commit your demo and open a pull request. Once merged, others pull the latest version to see your work here.</p><p>For an external project, contribute a short findings component with an appropriate link or walkthrough. Do not commit private code or data from another repository.</p></div></section>
        <section className="experiment"><DemoBoundary><Suspense fallback={<p role="status">Loading template…</p>}><Template /></Suspense></DemoBoundary></section></>}
      {!track && !demo && route !== '/' && route !== '/create' && <p><a href="#/">Return to the tracks</a></p>}
      <section className="takeaway"><h2>Leave a small trail.</h2><p>Your question, what you tried, one discovery. Use <code>tracks/findings.md</code>.</p><p className="small">Show & tell: 13:00 India, anyone ready welcome · 14:30–15:00 Denmark & wrap-up. Danish local time.</p></section>
    </main><footer><span>THE FRONT-END LAB</span><span>No perfect outcome required. Just curiosity.</span></footer>
  </>;
}
