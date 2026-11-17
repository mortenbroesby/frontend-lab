import { Button } from '@lab/ui/button';

export function RemotePad({
  dispatch,
  disabled = false,
}: {
  dispatch: (key: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="tv-remote" role="group" aria-label="On-screen remote">
      <Button
        disabled={disabled}
        className="tv-up"
        variant="outline"
        aria-label="Move up"
        onClick={() => dispatch('ArrowUp')}
      >
        ↑
      </Button>
      <Button
        disabled={disabled}
        className="tv-left"
        variant="outline"
        aria-label="Move left"
        onClick={() => dispatch('ArrowLeft')}
      >
        ←
      </Button>
      <Button disabled={disabled} className="tv-ok" onClick={() => dispatch('Enter')}>
        OK
      </Button>
      <Button
        disabled={disabled}
        className="tv-right"
        variant="outline"
        aria-label="Move right"
        onClick={() => dispatch('ArrowRight')}
      >
        →
      </Button>
      <Button
        disabled={disabled}
        className="tv-down"
        variant="outline"
        aria-label="Move down"
        onClick={() => dispatch('ArrowDown')}
      >
        ↓
      </Button>
      <Button
        disabled={disabled}
        className="tv-back"
        variant="ghost"
        onClick={() => dispatch('Escape')}
      >
        Back
      </Button>
    </div>
  );
}
