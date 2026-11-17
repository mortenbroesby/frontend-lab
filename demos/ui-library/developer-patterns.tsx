import { useState } from 'react';
import { Button } from '@lab/ui/button';
import { EmptyState } from '@lab/ui/empty-state';
import { Input } from '@lab/ui/input';
import { Label } from '@lab/ui/label';
import { Kbd } from '@lab/ui/kbd';
import { Snippet } from '@lab/ui/snippet';

export function DeveloperPatterns() {
  const [query, setQuery] = useState('unicorn');
  const items = ['Browser Beat', 'Lunar Lander', 'Signals between tabs'].filter((name) =>
    name.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <section id="ui-developer" className="ui-showcase-section" aria-labelledby="developer-title">
      <div className="ui-showcase-section-heading">
        <span>06 / Developer patterns</span>
        <h3 id="developer-title">Developer patterns</h3>
        <p>Small patterns for the moments between building and running.</p>
      </div>
      <div className="ui-showcase-panel">
        <div>
          <h4>Copy a command</h4>
          <Snippet code="npm run demo:new" />
          <p className="ui-showcase-note">
            On HTTP connections, select the command if clipboard access is unavailable.
          </p>
        </div>
        <div>
          <h4>Keyboard hints</h4>
          <p>
            Open the lab command menu with <Kbd>⌘ K</Kbd> on Mac or <Kbd>Ctrl K</Kbd> on Windows and
            Linux.
          </p>
        </div>
        <div className="ui-showcase-field">
          <Label htmlFor="ui-demo-search">Filter example names</Label>
          <Input
            id="ui-demo-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <div aria-live="polite">
            {items.length ? (
              <ul>
                {items.map((name) => (
                  <li key={name}>{name}</li>
                ))}
              </ul>
            ) : (
              <EmptyState
                title="No matching demos"
                description="Try a shorter name, or clear the filter to see all three examples."
              >
                <Button variant="outline" onClick={() => setQuery('')}>
                  Clear filter
                </Button>
              </EmptyState>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
