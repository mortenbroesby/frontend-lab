import { useState } from 'react';
import { Button } from '@lab/ui/button';
import { Input } from '@lab/ui/input';
import { Textarea } from '@lab/ui/textarea';
import { Label } from '@lab/ui/label';
import { Checkbox } from '@lab/ui/checkbox';
import { Switch } from '@lab/ui/switch';
import { RadioGroup, RadioGroupItem } from '@lab/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@lab/ui/select';
import { Slider } from '@lab/ui/slider';

export function Forms() {
  const [volume, setVolume] = useState([60]);
  const [feedback, setFeedback] = useState('Your draft stays in this page.');
  return (
    <section id="ui-forms" className="ui-showcase-section" aria-labelledby="forms-title">
      <div className="ui-showcase-section-heading">
        <span>02 / Forms</span>
        <h3 id="forms-title">Give every input a purpose.</h3>
        <p>Try native validation, keyboard controls and disabled states.</p>
      </div>
      <form
        className="ui-showcase-panel ui-showcase-fields"
        onSubmit={(event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          setFeedback(`Draft “${data.get('name')}” is ready to explore. No data was sent.`);
        }}
      >
        <div className="ui-showcase-field">
          <Label htmlFor="project-name">Project name</Label>
          <Input
            id="project-name"
            name="name"
            placeholder="A small, useful idea"
            required
            maxLength={80}
          />
        </div>
        <div className="ui-showcase-field">
          <Label htmlFor="project-notes">Notes</Label>
          <Textarea
            id="project-notes"
            name="notes"
            placeholder="What would you like to try?"
            rows={3}
          />
        </div>
        <div className="ui-showcase-field">
          <Label htmlFor="project-track">Track</Label>
          <Select defaultValue="experience" name="track">
            <SelectTrigger id="project-track">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="experience">Developer experience</SelectItem>
              <SelectItem value="web">Modern web</SelectItem>
              <SelectItem value="quality">Code quality</SelectItem>
              <SelectItem value="experiment">Experiments</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <fieldset className="ui-showcase-field">
          <legend>Working style</legend>
          <RadioGroup defaultValue="together" name="style">
            <div className="ui-showcase-inline">
              <RadioGroupItem id="style-together" value="together" />
              <Label htmlFor="style-together">Together</Label>
            </div>
            <div className="ui-showcase-inline">
              <RadioGroupItem id="style-solo" value="solo" />
              <Label htmlFor="style-solo">Solo</Label>
            </div>
          </RadioGroup>
        </fieldset>
        <div className="ui-showcase-inline">
          <Checkbox id="project-feedback" name="feedback" defaultChecked />
          <Label htmlFor="project-feedback">Welcome feedback</Label>
        </div>
        <div className="ui-showcase-inline">
          <Switch id="project-preview" name="preview" />
          <Label htmlFor="project-preview">Show a preview</Label>
        </div>
        <div className="ui-showcase-field">
          <Label htmlFor="project-energy">Energy · {volume[0]}%</Label>
          <Slider
            id="project-energy"
            aria-label="Energy"
            value={volume}
            onValueChange={setVolume}
            max={100}
            step={10}
          />
          <p className="ui-showcase-note">Use arrow keys to adjust in steps of 10.</p>
        </div>
        <div className="ui-showcase-two-columns">
          <div className="ui-showcase-field">
            <Label htmlFor="invalid-example">Invalid example</Label>
            <Input
              id="invalid-example"
              value="missing-at-sign"
              readOnly
              aria-invalid="true"
              aria-describedby="invalid-help"
            />
            <p id="invalid-help" className="ui-showcase-error">
              Enter an email with an @ sign.
            </p>
          </div>
          <div className="ui-showcase-field">
            <Label htmlFor="disabled-example">Disabled example</Label>
            <Input id="disabled-example" value="Not available" disabled />
          </div>
        </div>
        <div className="ui-showcase-row">
          <Button type="submit">Preview draft</Button>
          <p role="status" className="ui-showcase-note">
            {feedback}
          </p>
        </div>
      </form>
    </section>
  );
}
