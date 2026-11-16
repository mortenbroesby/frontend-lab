import { Input } from '@lab/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@lab/ui/select';
import { Label } from '@lab/ui/label';
import { Slider } from '@lab/ui/slider';
import { Button } from '@lab/ui/button';
import { galleryHref } from '@lab/demo-kit/gallery-link';
import { useRef, useState } from 'react';
import { makeDots } from './art';

export default function Art() {
  const [seed, setSeed] = useState(42);
  const [seedInput, setSeedInput] = useState('42');
  const [layout, setLayout] = useState<'scatter' | 'spiral'>('scatter');
  const [count, setCount] = useState(90);
  const svg = useRef<SVGSVGElement>(null);
  const dots = makeDots(seed, count, layout);

  function download() {
    if (!svg.current) return;
    const content = new XMLSerializer().serializeToString(svg.current);
    const url = URL.createObjectURL(new Blob([content], { type: 'image/svg+xml' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `front-end-lab-${seed}-${count}-${layout}.svg`;
    link.click();
    // Let the browser begin reading the blob before releasing it.
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <div className="experiment-grid">
      <div className="visual-stage">
        <svg
          ref={svg}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 640 420"
          role="img"
          aria-labelledby="art-title art-description"
        >
          <title id="art-title">A constellation of coloured dots</title>
          <desc id="art-description">
            {count} dots in a {layout} layout from seed {seed}. The same seed, count and layout
            reproduce this composition.
          </desc>
          <rect width="640" height="420" fill="#132d32" rx="16" />
          {dots.map((dot, index) => (
            <circle
              key={index}
              cx={dot.x}
              cy={dot.y}
              r={dot.radius}
              fill={`hsl(${dot.hue} 70% 67%)`}
              opacity="0.72"
            />
          ))}
        </svg>
      </div>
      <div className="controls">
        <p className="eyebrow">01 / SVG + deterministic randomness</p>
        <h3>Repeatable randomness.</h3>
        <p>
          Keep the seed fixed and switch layouts. The dot sizes and colours stay the same; the
          position rule changes.
        </p>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const value = Number(seedInput);
            if (seedInput.trim() && Number.isInteger(value) && value >= 0 && value <= 4294967295)
              setSeed(value);
          }}
        >
          <Label htmlFor="art-seed">Seed</Label>
          <Input
            id="art-seed"
            type="number"
            min={0}
            max={4294967295}
            step={1}
            required
            value={seedInput}
            onChange={(event) => setSeedInput(event.target.value)}
          />
          <Button type="submit" variant="outline">
            Apply seed
          </Button>
        </form>
        <Label htmlFor="art-layout">Position rule</Label>
        <Select value={layout} onValueChange={(value) => setLayout(value as 'scatter' | 'spiral')}>
          <SelectTrigger id="art-layout">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="scatter">Scatter</SelectItem>
            <SelectItem value="spiral">Spiral</SelectItem>
          </SelectContent>
        </Select>
        <Label id="density-label">
          Dots <output>{count}</output>
        </Label>
        <Slider
          aria-labelledby="density-label"
          min={10}
          max={200}
          value={[count]}
          onValueChange={([value]) => setCount(value)}
        />
        <p className="small">
          Seed <strong data-testid="seed">{seed}</strong> · {count} dots · {layout}
        </p>
        <div className="button-row">
          <Button
            onClick={() => {
              const next = (seed + 1) >>> 0;
              setSeed(next);
              setSeedInput(String(next));
            }}
          >
            Remix composition
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setSeed(42);
              setSeedInput('42');
              setCount(90);
              setLayout('scatter');
            }}
          >
            Restore starting composition
          </Button>
          <Button variant="outline" onClick={download}>
            Save SVG
          </Button>
        </div>
        <p className="small">
          Record the seed, dot count and position rule to recreate a result. Reload starts a new
          session; nothing is saved until you export.
        </p>
        {galleryHref('/track/experimental-projects/postcard') && (
          <p>
            <a href={galleryHref('/track/experimental-projects/postcard')}>
              Understand this · Try it in your project
            </a>
          </p>
        )}
        <p className="try-this">
          <strong>What if…</strong> dots followed a pointer or became a game?
        </p>
        <p>
          Start with one SVG circle, add shapes using a rule, then add a control. Save images later.{' '}
          <a href={galleryHref('/create')}>Create your own artwork</a>.
        </p>
      </div>
    </div>
  );
}
