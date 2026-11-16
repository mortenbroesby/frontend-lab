import { useState } from 'react';
import { ideas } from './ideas';
import { tracks } from './tracks';

export function Ideas() {
  const [filter, setFilter] = useState('');
  const visible = ideas.filter(idea => !filter || idea.track === filter);
  return <>
    <label htmlFor="idea-track">Browse by track</label>
    <select id="idea-track" value={filter} onChange={event => setFilter(event.target.value)}>
      <option value="">All ideas</option>
      {tracks.map(track => <option key={track.id} value={track.id}>{track.title}</option>)}
    </select>
    <p className="small" role="status">{visible.length} {visible.length === 1 ? 'idea' : 'ideas'} to explore</p>
    <div className="journey-grid topic-grid idea-grid">{visible.map(idea => <article className="journey-card" data-track={idea.track} key={idea.id}>
      <p className="eyebrow">{tracks.find(track => track.id === idea.track)!.title}</p>
      <h2><a href={`#/idea/${idea.id}`}>{idea.title}</a></h2><p>{idea.description}</p>
    </article>)}</div>
    <h2>Bring your own idea</h2>
    <p>Follow your curiosity. <a href="#/create">Start your own demo</a> or use a React project you already have.</p>
    <nav className="guide-nav" aria-label="Track overviews">{tracks.map(track => <a key={track.id} href={`#/track/${track.id}`}>{track.title}</a>)}</nav>
  </>;
}
