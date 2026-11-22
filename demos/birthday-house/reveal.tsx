import { useEffect, useRef } from 'react';
import { birthday } from './birthday';
export function Reveal({ onClose, replay }: { onClose: () => void; replay: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const element = dialog.current!;
    element.showModal();
    return () => element.close();
  }, []);
  return (
    <dialog
      ref={dialog}
      className="reveal"
      aria-label="Your birthday photograph"
      onCancel={onClose}
    >
      <div className="reveal-card">
        <p className="eyebrow">THE MEMORY WAS ALWAYS YOU</p>
        <h1>{birthday.greeting}</h1>
        <figure>
          <img src={birthday.photo} alt={birthday.alt} />
          <figcaption>A little light, kept for you.</figcaption>
        </figure>
        <p>{birthday.message}</p>
        <div>
          <button onClick={onClose}>Stay a little longer</button>
          <button onClick={replay}>Play again</button>
        </div>
      </div>
    </dialog>
  );
}
