import { Button } from './button';
import { cn } from './utils';
import './direction-pad.css';

type Direction = 'up' | 'down' | 'left' | 'right';
export function DirectionPad({
  onDirection,
  onSelect,
  onBack,
  disabled = false,
  label = 'Remote',
  horizontal = false,
  className,
}: {
  onDirection: (direction: Direction) => void;
  onSelect: () => void;
  onBack: () => void;
  disabled?: boolean;
  label?: string;
  horizontal?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn('lab-remote', horizontal && 'lab-remote-horizontal', className)}
      role="group"
      aria-label="On-screen remote"
    >
      <span className="lab-remote-label">{label}</span>
      <div className="lab-dpad">
        {(
          [
            ['up', '↑'],
            ['left', '←'],
            ['right', '→'],
            ['down', '↓'],
          ] as const
        ).map(([direction, arrow]) => (
          <Button
            key={direction}
            disabled={disabled}
            className={`lab-${direction}`}
            variant="outline"
            aria-label={`Move ${direction}`}
            onClick={() => onDirection(direction)}
          >
            {arrow}
          </Button>
        ))}
        <Button disabled={disabled} className="lab-ok" onClick={onSelect}>
          OK
        </Button>
      </div>
      <Button disabled={disabled} className="lab-back" variant="ghost" onClick={onBack}>
        <span aria-hidden="true">↶</span> Back
      </Button>
    </div>
  );
}
