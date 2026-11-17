import { useState } from 'react';
import { Button } from '@lab/ui/button';
import { Toggle } from '@lab/ui/toggle';
import { ToggleGroup, ToggleGroupItem } from '@lab/ui/toggle-group';
import { Tooltip, TooltipContent, TooltipTrigger } from '@lab/ui/tooltip';

export function Actions() {
  const [message, setMessage] = useState('Choose an action to see its feedback.');
  const [saved, setSaved] = useState(false);
  const [alignment, setAlignment] = useState('left');
  return (
    <section id="ui-actions" className="ui-showcase-section" aria-labelledby="actions-title">
      <div className="ui-showcase-section-heading">
        <span>01 / Actions</span>
        <h3 id="actions-title">Buttons & toggles</h3>
        <p>Buttons communicate priority. Toggles keep their state.</p>
      </div>
      <div className="ui-showcase-panel">
        <div className="ui-showcase-row">
          <Button onClick={() => setMessage('Primary action selected.')}>Primary</Button>
          <Button variant="secondary" onClick={() => setMessage('Secondary action selected.')}>
            Secondary
          </Button>
          <Button variant="outline" onClick={() => setMessage('Outline action selected.')}>
            Outline
          </Button>
          <Button variant="ghost" onClick={() => setMessage('Ghost action selected.')}>
            Ghost
          </Button>
          <Button
            variant="destructive"
            onClick={() => setMessage('Destructive style selected. Nothing was deleted.')}
          >
            Destructive
          </Button>
          <Button disabled>Unavailable</Button>
        </div>
        <div className="ui-showcase-row">
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle aria-label="Save this example" pressed={saved} onPressedChange={setSaved}>
                {saved ? 'Saved' : 'Save example'}
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Keep this selection until you refresh.</TooltipContent>
          </Tooltip>
          <ToggleGroup
            type="single"
            value={alignment}
            onValueChange={(value) => {
              if (value) setAlignment(value);
            }}
            aria-label="Text alignment"
          >
            <ToggleGroupItem value="left" aria-label="Align left">
              Left
            </ToggleGroupItem>
            <ToggleGroupItem value="center" aria-label="Align center">
              Center
            </ToggleGroupItem>
            <ToggleGroupItem value="right" aria-label="Align right">
              Right
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        <p style={{ textAlign: alignment as 'left' | 'center' | 'right' }}>
          A small change in perspective.
        </p>
        <p role="status" className="ui-showcase-note">
          {message}
        </p>
      </div>
    </section>
  );
}
