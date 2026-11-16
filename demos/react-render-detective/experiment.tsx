import { useId, useState } from 'react';
import { Button } from '@lab/ui/button';
import { Input } from '@lab/ui/input';
import { Label } from '@lab/ui/label';
import { Badge } from '@lab/ui/badge';
import { MemoTile, RenderTile, samples } from './tile';

type Mode = 'plain' | 'unstable' | 'stable';
const explanations = {
  plain: {
    title: 'No memo',
    code: '<RenderTile sample={sample} />',
    note: 'A parent update also renders its children.',
    badge: '01 / Baseline',
  },
  unstable: {
    title: 'Memo, new object',
    code: '<MemoTile sample={{ ...sample }} />',
    note: 'Same values, different object. The shallow prop comparison cannot skip this render.',
    badge: '02 / False fix',
  },
  stable: {
    title: 'Memo, stable prop',
    code: '<MemoTile sample={sample} />',
    note: 'The existing object is reused. Unrelated parent updates can skip the tiles.',
    badge: '03 / Targeted fix',
  },
};

export function Experiment({ mode }: { mode: Mode }) {
  const id = useId();
  const [note, setNote] = useState('A tiny collection');
  const [updates, setUpdates] = useState(0);
  const example = explanations[mode];
  return (
    <section className="detective-lane" aria-label={example.title}>
      <Badge variant="outline">{example.badge}</Badge>
      <h3>{example.title}</h3>
      <p>{example.note}</p>
      <pre>
        <code>{example.code}</code>
      </pre>
      <Label htmlFor={id}>Collection note</Label>
      <Input id={id} value={note} onChange={(event) => setNote(event.target.value)} />
      <Button variant="outline" onClick={() => setUpdates((value) => value + 1)}>
        Update parent · {updates}
      </Button>
      <div className="detective-tiles">
        {samples.map((sample) =>
          mode === 'plain' ? (
            <RenderTile key={sample.name} sample={sample} />
          ) : (
            <MemoTile key={sample.name} sample={mode === 'unstable' ? { ...sample } : sample} />
          ),
        )}
      </div>
    </section>
  );
}

Experiment.displayName = 'Experiment';
