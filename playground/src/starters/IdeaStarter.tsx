import { useState } from 'react';

// This is your starting point. Keep, replace or delete anything here.
export default function Demo() {
  const [idea, setIdea] = useState('What if…');
  const [colour, setColour] = useState('#b4e5c4');

  return (
    <div className="experiment-grid">
      <div className="idea-stage" style={{ backgroundColor: colour }}>
        <span className="eyebrow">An idea, taking shape</span>
        <h3>{idea || 'Your next experiment'}</h3>
      </div>
      <div className="controls">
        <p className="eyebrow">Your space / no prescribed outcome</p>
        <h3>Start with one small thing.</h3>
        <p>In your generated <code>index.tsx</code>, change “An idea, taking shape” to your own heading and save. Refresh to confirm your code change stays. Then build one visible behaviour of your own.</p>
        <label htmlFor="idea">What are you curious about?</label>
        <input id="idea" value={idea} maxLength={120} onChange={event => setIdea(event.target.value)} />
        <label htmlFor="colour">A colour to start with</label>
        <input id="colour" type="color" value={colour} onChange={event => setColour(event.target.value)} />
        <p className="small">This draft lives in memory. Record anything you want to keep in your findings before refreshing.</p>
      </div>
    </div>
  );
}
