import { useState } from 'react';

// Keep, replace or delete this starter.
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
        <p className="eyebrow">Your experiment</p>
        <h3>Start small.</h3>
        <p>
          Edit the heading in your generated <code>index.tsx</code>. Save and refresh to confirm it
          persists, then add an interaction.
        </p>
        <label htmlFor="idea">What are you curious about?</label>
        <input
          id="idea"
          value={idea}
          maxLength={120}
          onChange={(event) => setIdea(event.target.value)}
        />
        <label htmlFor="colour">Colour</label>
        <input
          id="colour"
          type="color"
          value={colour}
          onChange={(event) => setColour(event.target.value)}
        />
        <p className="small">Refresh resets this preview.</p>
      </div>
    </div>
  );
}
