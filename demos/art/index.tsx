import { galleryHref } from '@lab/demo-kit/gallery-link';
import { useRef, useState } from 'react';
import { makeDots } from './art';

export default function Art() {
  const [seed, setSeed] = useState(42);
  const [count, setCount] = useState(90);
  const svg = useRef<SVGSVGElement>(null);
  const dots = makeDots(seed, count);

  function download() {
    if (!svg.current) return;
    const content = new XMLSerializer().serializeToString(svg.current);
    const url = URL.createObjectURL(new Blob([content], { type: 'image/svg+xml' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `front-end-lab-${seed}.svg`;
    link.click();
    // Let the browser begin reading the blob before releasing it.
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <div className="experiment-grid">
      <div className="visual-stage">
        <svg ref={svg} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 420" role="img" aria-labelledby="art-title art-description">
          <title id="art-title">A constellation of coloured dots</title>
          <desc id="art-description">{count} dots generated from seed {seed}. Changing the seed rearranges the composition.</desc>
          <rect width="640" height="420" fill="#132d32" rx="16" />
          {dots.map((dot, index) => <circle key={index} cx={dot.x} cy={dot.y} r={dot.radius} fill={`hsl(${dot.hue} 70% 67%)`} opacity="0.72" />)}
        </svg>
      </div>
      <div className="controls">
        <p className="eyebrow">01 / SVG + deterministic randomness</p>
        <h3>A little chaos. A repeatable result.</h3>
        <p>Change the composition, save one you like, then make the rules your own.</p>
        <label htmlFor="density">Dots <output>{count}</output></label>
        <input id="density" type="range" min="10" max="200" value={count} onChange={event => setCount(Number(event.target.value))} />
        <p className="small">Seed <strong data-testid="seed">{seed}</strong> · same seed, same composition</p>
        <div className="button-row">
          <button onClick={() => setSeed(value => value + 1)}>Remix composition</button>
          <button className="secondary" onClick={download}>Save SVG</button>
        </div>
        <p className="try-this"><strong>What if…</strong> the dots followed a spiral, responded to a pointer, or became a tiny game?</p>
        <p>Build a small version: draw one SVG circle, add a few shapes from your own rule, then add a control. Saving an image can come later. <a href={galleryHref('/create')}>Create your own artwork</a>.</p>
      </div>
    </div>
  );
}
