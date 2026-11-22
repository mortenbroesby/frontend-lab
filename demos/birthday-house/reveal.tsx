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
    <dialog ref={dialog} className="reveal" aria-label="Dit fødselsdagsbillede" onCancel={onClose}>
      <div className="reveal-card">
        <p className="eyebrow">DET BEDSTE MINDE ER DIG</p>
        <h1>{birthday.greeting}</h1>
        <figure>
          <img src={birthday.photo} alt={birthday.alt} />
          <figcaption>Et lille lys, gemt til dig.</figcaption>
        </figure>
        <p>{birthday.message}</p>
        <div>
          <button onClick={onClose}>Bliv lidt endnu</button>
          <button onClick={replay}>Spil igen</button>
        </div>
      </div>
    </dialog>
  );
}
