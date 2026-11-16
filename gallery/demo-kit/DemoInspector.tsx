import { useState } from 'react';
import { Button } from '@lab/ui/button';
import type { DemoInspection } from './inspection';

export function DemoInspector({ inspection }: { inspection?: DemoInspection }) {
  const [status, setStatus] = useState('');
  async function copy(command: string) {
    try {
      await navigator.clipboard.writeText(command);
      setStatus('Command copied.');
    } catch {
      setStatus('Clipboard unavailable. Select the command and copy it manually.');
    }
  }
  if (!inspection) return <p>Demo information is unavailable in this build.</p>;
  return (
    <div className="demo-inspector">
      <p>Source folder</p>
      <code>{inspection.source}</code>
      <p>Run these from the repository root after installing dependencies.</p>
      {inspection.commands.map(({ label, command }) => (
        <div key={label}>
          <p>{label}</p>
          <code className="inspection-command">{command}</code>
          <Button
            variant="outline"
            aria-label={`Copy ${label.toLowerCase()} command`}
            onClick={() => void copy(command)}
          >
            Copy
          </Button>
        </div>
      ))}
      {!inspection.commands.length && <p>No dev, build or test scripts are defined.</p>}
      <p className="command-hint">
        Only scripts defined by this demo are shown. Commands are copied, never executed here. For
        Vite demos, append <code>-- --host 0.0.0.0</code> for LAN access.
      </p>
      <p role="status" className="command-hint">
        {status}
      </p>
    </div>
  );
}
