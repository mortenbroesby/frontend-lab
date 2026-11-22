import { useState } from 'react';
import guide from './art/nisse-guide.webp';
export { default as lanternKeeper } from './art/nisse-keeper.webp';
import './nisse.css';

export function DoorGuide({ open, portrait }: { open: boolean; portrait: boolean }) {
  // Returning from the darkroom should never replay his departure.
  const [alreadyLeft] = useState(open);
  if (alreadyLeft) return null;
  return (
    <img
      className="door-guide"
      data-leaving={open}
      src={guide}
      alt=""
      style={{ left: portrait ? '69%' : '75%', top: portrait ? '48%' : '55%' }}
    />
  );
}
