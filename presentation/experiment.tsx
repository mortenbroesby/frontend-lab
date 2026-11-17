import { useState } from 'react';
import { Button } from '@lab/ui/button';

export function RendererIllustration({ preview = false }: { preview?: boolean }) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="renderer-illustration" data-presentation-interactive>
      <p className="illustration-label">Conceptual JSX</p>
      <pre>
        <code>{`<Tile\n  title="An evening in"\n  focused={${focused}}\n/>`}</code>
      </pre>
      <div className={`illustration-tile${focused ? ' is-focused' : ''}`}>
        <span aria-hidden="true">▶</span>
        <strong>An evening in</strong>
      </div>
      <Button
        className="text-foreground"
        variant="outline"
        aria-pressed={focused}
        disabled={preview}
        onClick={() => setFocused((value) => !value)}
      >
        Toggle highlight
      </Button>
      <p className="illustration-caption">
        React DOM illustration · not the original Lightning implementation
      </p>
    </div>
  );
}
