import { memo, useLayoutEffect, useRef, useState } from 'react';
import { Button } from '@lab/ui/button';

type Sample = { name: string; hue: string };
export const samples: Sample[] = [
  { name: 'Orbit', hue: '#c4b5fd' },
  { name: 'Bloom', hue: '#86efac' },
  { name: 'Ripple', hue: '#7dd3fc' },
];

export function RenderTile({ sample }: { sample: Sample }) {
  const [likes, setLikes] = useState(0);
  const commits = useRef(0);
  const count = useRef<HTMLOutputElement>(null);
  // Observe commits without scheduling another React render to display the count.
  useLayoutEffect(() => {
    commits.current += 1;
    if (count.current) count.current.textContent = String(commits.current);
  });
  return (
    <article className="detective-tile">
      <div className="detective-art" style={{ background: sample.hue }} aria-hidden="true">
        <span />
      </div>
      <div className="detective-tile-heading">
        <strong>{sample.name}</strong>
        <span>
          <output ref={count} aria-label={`${sample.name} commits`} aria-live="off" /> commits
        </span>
      </div>
      <Button variant="outline" size="sm" onClick={() => setLikes((value) => value + 1)}>
        Like {sample.name} · {likes}
      </Button>
    </article>
  );
}

// Keep teaching component names readable in the minified static build.
RenderTile.displayName = 'RenderTile';
export const MemoTile = memo(RenderTile);
MemoTile.displayName = 'MemoTile';
