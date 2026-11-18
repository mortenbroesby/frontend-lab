import { DirectionPad } from '@lab/ui/direction-pad';
import { focusKey } from '@lab/demo-kit/focus';

export function RemotePad({
  dispatch,
  disabled = false,
}: {
  dispatch: (key: string) => void;
  disabled?: boolean;
}) {
  return (
    <DirectionPad
      className="tv-remote"
      disabled={disabled}
      onDirection={(direction) => dispatch(focusKey(direction))}
      onSelect={() => dispatch('Enter')}
      onBack={() => dispatch('Escape')}
    />
  );
}
