import { useState } from 'react';
import { Input } from '@lab/ui/input';
import { requirementLabels } from '@lab/demo-kit/types';
import { demos } from '../demo-registry';
import type { TrackId } from '../demo-contract';
import { tracks } from './tracks';
import { TrackSymbol } from './TrackSymbol';
import { TrackIllustration } from './TrackIllustration';

export function DemoGallery({ track }: { track?: TrackId }) {
  const [query, setQuery] = useState('');
  const entries = demos.filter(
    (demo) =>
      (!track || demo.track === track) &&
      `${demo.title} ${demo.description} ${demo.author} ${tracks.find((t) => t.id === demo.track)?.title}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  return (
    <section aria-label="Demo gallery" className="demo-gallery">
      <div className="demo-toolbar">
        <Input
          aria-label="Find a demo"
          placeholder="Find a demo…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <p role="status">
          {entries.length} {entries.length === 1 ? 'demo' : 'demos'}
        </p>
      </div>
      <div className="demo-grid">
        {entries.map((demo) => (
          <a className="demo-card" data-track={demo.track} key={demo.id} href={demo.href}>
            <div className="demo-preview" aria-hidden="true">
              {demo.preview ? (
                <img src={demo.preview} alt="" loading="lazy" width="600" height="300" />
              ) : (
                <TrackIllustration track={demo.track} />
              )}
            </div>
            <div className="demo-identity">
              <TrackSymbol track={demo.track} />
              <span>{tracks.find((t) => t.id === demo.track)?.title}</span>
            </div>
            <h2>{demo.title}</h2>
            <p className="demo-description">{demo.description}</p>
            <p className="demo-author">By {demo.author}</p>
            {demo.requirements && (
              <ul className="requirement-list">
                {demo.requirements.map((id) => (
                  <li key={id}>{requirementLabels[id]}</li>
                ))}
              </ul>
            )}
            <span className="demo-open">
              Open demo <span aria-hidden="true">↗</span>
            </span>
          </a>
        ))}
      </div>
      {!entries.length && (
        <p className="empty-demos">
          {track && !query.trim() ? (
            <>
              This track has practical guides to explore.{' '}
              <a href={`#/track/${track}/guides`}>Open its guides</a>.
            </>
          ) : (
            <>
              No demos match. Try another search, or <a href="#/guides">explore the guides</a>.
            </>
          )}
        </p>
      )}
    </section>
  );
}
