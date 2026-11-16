import { useState } from 'react';

// A place to try an API, not a finished visualisation.
export function BrowserStarter() {
  const [radius, setRadius] = useState(30);
  return (
    <div className="experiment-grid">
      <div className="visual-stage">
        <svg viewBox="0 0 400 260" role="img" aria-label={`One circle with radius ${radius}`}>
          <circle cx="200" cy="130" r={radius} fill="#24483e" />
        </svg>
      </div>
      <div className="controls">
        <h2>One shape. Your next question.</h2>
        <p>Change a value, then try a browser capability. This starting page contains no completed D3 graph, Worker or messaging solution.</p>
        <label htmlFor="radius">Circle radius <output>{radius}</output></label>
        <input id="radius" type="range" min="10" max="90" value={radius} onChange={event => setRadius(Number(event.target.value))} />
        <p>To get your own copy, run <code>npm run demo:new</code> and choose Modern Web Capabilities. In your generated <code>index.tsx</code>, change the circle fill colour and save. Refresh to confirm your code change stays, then try a new interaction.</p>
      </div>
    </div>
  );
}
