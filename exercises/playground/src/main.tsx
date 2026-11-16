import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Art } from './examples/ArtStudio';
import { Workers } from './examples/Workers';
import { Signals } from './examples/Signals';
import { YourLab } from './YourLab';
import './styles.css';

function App() {
  const [showExamples, setShowExamples] = useState(true);
  return (
    <>
      <a className="skip-link" href="#journey">Skip to your journey</a>
      <header className="site-header">
        <a className="wordmark" href="#"><span aria-hidden="true">✳</span> THE FRONT-END LAB</a>
        <span className="edition">CHAPTER DAY / 20 NOV 2026</span>
      </header>
      <main>
        <section className="hero" aria-labelledby="welcome">
          <div>
            <p className="eyebrow">An open invitation to experiment</p>
            <h1 id="welcome">Follow your<br /><em>what if.</em></h1>
            <p className="intro">Something unfamiliar. A tiny prototype. A useful discovery.<br />Choose a starting point, borrow an idea, or make your own.</p>
            <div className="button-row"><a className="button" href="#journey">Find your starting point ↓</a><a className="text-link" href="#your-lab">Start with your own idea ↗</a></div>
          </div>
          <div className="hero-art" aria-hidden="true">
            <span className="art-ring ring-one" /><span className="art-ring ring-two" /><span className="art-ring ring-three" />
            <span className="art-dot" /><span className="art-label">SMALL EXPERIMENTS.<br />OPEN POSSIBILITIES.</span>
          </div>
        </section>
        <section id="journey" aria-labelledby="journey-heading">
          <div className="section-heading"><div><p className="eyebrow">Choose your own route</p><h2 id="journey-heading">A starting point, not a syllabus.</h2></div><p>Go solo or team up. Mix tracks.<br />An unfinished experiment still counts.</p></div>
          <div className="journey-grid">
            <article className="journey-card"><span className="track-letter">A</span><h3>Modern Web<br />Capabilities</h3><p>Ask what the browser can do. Explore visuals, computation and communication.</p><a href="#art" onClick={() => setShowExamples(true)}>Try the browser examples ↓</a><p className="source">Guide: <code>exercises/journeys/browser.md</code></p></article>
            <article className="journey-card"><span className="track-letter">B</span><h3>Code Quality &<br />Maintainability</h3><p>Investigate this kit or your own codebase. Follow one question, validate what you find.</p><a href="#inspect">Find a first investigation ↓</a><p className="source">Guide: <code>exercises/journeys/quality.md</code></p></article>
            <article className="journey-card"><span className="track-letter">C</span><h3>Developer Experience<br />& Tooling</h3><p>Choose a recurring annoyance. Improve the workflow before inventing another tool.</p><a href="#inspect">Explore a faster feedback loop ↓</a><p className="source">Guide: <code>exercises/journeys/tooling.md</code></p></article>
            <article className="journey-card"><span className="track-letter">D</span><h3>Experimental<br />Projects</h3><p>A game, a visual story, a quiz. Start with one visible behaviour and follow your curiosity.</p><a href="#your-lab">Make something of your own ↓</a><p className="source">Guide: <code>exercises/journeys/project.md</code></p></article>
          </div>
        </section>
        <section className="examples-intro" aria-labelledby="examples-heading">
          <div><p className="eyebrow">Touch it. Take it apart. Make it yours.</p><h2 id="examples-heading">Three small possibilities.</h2><p>These work already. Rebuild one, change one rule, combine them—or start elsewhere.</p></div>
          <button className="secondary" aria-expanded={showExamples} aria-controls="examples" onClick={() => setShowExamples(value => !value)}>{showExamples ? 'Hide examples' : 'Show examples'}</button>
        </section>
        <div id="examples" hidden={!showExamples}>
          <section id="art" className="experiment" aria-label="Generative art example"><Art /></section>
          <section id="workers" className="experiment" aria-label="Worker example"><Workers /></section>
          <section id="signals" className="experiment" aria-label="Local signals example"><Signals /></section>
        </div>
        <section id="inspect" className="inspect-panel" aria-labelledby="inspect-heading">
          <div><p className="eyebrow">Different kinds of experiments</p><h2 id="inspect-heading">The code is a starting point too.</h2><p>No intentionally broken app. No answer sheet. Use this small repository or one you know well.</p></div>
          <div><h3>Investigate its health</h3><p>Run <code>npm ls --depth=0</code> inside <code>exercises/playground</code>. Pick one dependency. Where is it used? What would removing it affect?</p><p>Then trace a boundary: UI → Worker → computation. What belongs on either side?</p></div>
          <div><h3>Improve a feedback loop</h3><p>Run <code>npm run test:watch</code>. Change one rule in <code>src/examples/art.ts</code> and watch the feedback. Does the test tell you something useful?</p><p>Choose a real friction point, make one improvement, and ask someone to try it.</p></div>
        </section>
        <section id="your-lab" className="experiment" aria-label="Your own experiment"><YourLab /></section>
        <section className="takeaway" aria-labelledby="takeaway-heading"><p className="eyebrow">Leave a small trail</p><h2 id="takeaway-heading">What did you discover?</h2><p>Capture your question, what you tried, a piece of evidence and one surprise.<br />Use <code>exercises/FINDINGS.md</code> or your track’s whiteboard area.</p><p className="small">Show & tell · 13:00 India, anyone ready welcome · 14:30–15:00 Denmark & wrap-up<br />All times Danish local time.</p></section>
      </main>
      <footer><span>THE FRONT-END LAB</span><span>No perfect outcome required. Just curiosity.</span></footer>
    </>
  );
}

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);
