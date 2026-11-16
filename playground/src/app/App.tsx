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
    ? <p><a href={`${sourceUrl}/${path}`}>More detail in the repository guide</a> (repository access required)</p>
    : null;
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
      {track && <><section className="inspect-panel"><div><h2>Your first result</h2><p>{track.start}</p><p><strong>You need:</strong> {track.needs}</p><ol>{track.steps.map(step => <li key={step}>{step}</li>)}</ol><pre><code>{track.commands}</code></pre><p><strong>Success check:</strong> {track.success}</p><p>Create a branch before editing so your experiment stays separate from other people’s work.</p><p><a href="#/create">Set up and share a demo</a></p><BootstrapLink track={track.id} /></div><div><h3>Questions to explore</h3><ul>{track.ideas.map(idea => <li key={idea}>{idea}</li>)}</ul></div></section>
        {track.id === 'modern-web' && <section className="experiment"><DemoBoundary><Suspense fallback={<p role="status">Loading starter…</p>}><BrowserStarter /></Suspense></DemoBoundary></section>}
        <h2>Reference examples</h2><Gallery track={track.id} /></>}
      {demo && <><section id={demo.id} className="experiment"><DemoBoundary key={demo.id}><Suspense fallback={<p role="status">Loading experiment…</p>}><demo.Component /></Suspense></DemoBoundary></section><p><a href={`#/track/${demo.track}`}>Back to {trackTitle(demo.track)}</a> · <a href="#/create">Build your own version</a></p></>}
      {route === '/create' && <><section className="inspect-panel"><div><h2>One command. Your own demo.</h2><p>This page is a preview. Create a local copy to save code changes; typing into the preview does not create a demo.</p><ol><li>Use Node 24 and clone the lab repository. If you cannot access it, ask the organiser for repository access.</li><li>From the repository root, run <code>npm ci</code>. Create your own branch with <code>git switch -c demo/your-idea</code>, using a unique name.</li><li>Run <code>npm run demo:new</code>. Give your demo a name, confirm its ID, then choose a track, author and description.</li><li>Run <code>npm run dev</code> if needed. Open the printed demo route at your local server.</li></ol><h3>Your first change</h3><p>Edit <code>playground/src/demos/&lt;id&gt;/Demo.tsx</code>. For Modern Web, change the circle fill colour. For other tracks, change “An idea, taking shape” to your own heading. Save and refresh: the code change stays while temporary input resets.</p><p>Your demo appears in your local gallery automatically. No shared files need editing. Keep going with your own idea or borrow one technique from a reference.</p></div><div><h3>Share through Git</h3><ol><li>Try your interaction, navigate away and back, and check for browser errors.</li><li>Run <code>npm run check</code> and <code>npm run analyze:changes</code> from the repository root. For UI changes, install a test browser once with <code>npx playwright install chromium</code> from <code>playground/</code>, then run <code>npm run test:browser</code>.</li><li>Commit your demo folder, push your branch and open a pull request describing what to try and what you learned.</li></ol><p>Other people see your contribution after it is merged and they pull the latest version; the hosted gallery updates on deployment.</p><p>An investigation can be shared as notes or a walkthrough instead of a demo. Include your question, evidence, decision and one remaining uncertainty. Share only code and data permitted for this audience.</p></div></section>
        <section className="experiment"><DemoBoundary><Suspense fallback={<p role="status">Loading template…</p>}><Template /></Suspense></DemoBoundary></section></>}
      {!track && !demo && route !== '/' && route !== '/create' && <p><a href="#/">Return to the tracks</a></p>}
      <section className="takeaway"><h2>Leave a small trail.</h2><p>Record your question, what you tried, one piece of evidence and what surprised you. Share a next step or something another person could reuse.</p></section>
    </main><footer><span>THE FRONT-END LAB</span><span>No perfect outcome required. Just curiosity.</span></footer>
  </>;
}
