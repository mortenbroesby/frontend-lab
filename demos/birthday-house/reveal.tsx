import { tr } from './language';
import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import { birthday } from './birthday';
import './reveal.css';

export function Reveal({
  onClose,
  replay,
  soundControl,
}: {
  onClose: () => void;
  replay: () => void;
  soundControl?: ReactNode;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const element = dialog.current!;
    element.showModal();
    return () => element.close();
  }, []);
  return (
    <dialog
      ref={dialog}
      className="reveal portrait-reveal"
      aria-label={tr('Dit fødselsdagsbillede', 'Your birthday portrait')}
      onCancel={onClose}
      style={{ '--memory-image': `url("${birthday.photo}")` } as CSSProperties}
    >
      <span className="portrait-backdrop" aria-hidden="true" />
      <span className="portrait-confetti" aria-hidden="true">
        {Array.from({ length: 14 }, (_, i) => (
          <i key={i} style={{ '--confetti': i } as CSSProperties} />
        ))}
      </span>
      <div className="reveal-card portrait-gallery">
        <header className="portrait-heading">
          <p className="eyebrow">
            <BirthdayFlag /> {tr('ET LILLE FØDSELSDAGSMIRAKEL', 'A LITTLE BIRTHDAY MIRACLE')}{' '}
            <BirthdayFlag />
          </p>
          <h1>{birthday.greeting}</h1>
        </header>
        <figure className="portrait-painting">
          <span className="portrait-frame">
            <img src={birthday.photo} alt={birthday.alt} />
            {[0, 1, 2, 3].map((corner) => (
              <FrameCorner key={corner} corner={corner} />
            ))}
            <span className="photo-stardust" aria-hidden="true">
              {Array.from({ length: 8 }, (_, i) => (
                <i key={i} style={{ '--star': i } as CSSProperties}>
                  ✦
                </i>
              ))}
            </span>
          </span>
          <figcaption>
            {tr('Et lille lys, gemt til dig.', 'A little light, saved for you.')}
          </figcaption>
        </figure>
        <p className="portrait-message">{birthday.message}</p>
        <div className="portrait-actions">
          <button onClick={onClose}>{tr('Bliv lidt endnu', 'Stay a little longer')}</button>
          <button onClick={replay}>{tr('Spil igen', 'Play again')}</button>
          {soundControl}
        </div>
      </div>
    </dialog>
  );
}

function BirthdayFlag() {
  return (
    <svg viewBox="0 0 28 20" className="portrait-flag" aria-hidden="true">
      <path d="M0 0h28v20H0z" fill="#b63235" />
      <path d="M8 0h3v20H8zM0 8.5h28v3H0z" fill="#fff2d5" />
    </svg>
  );
}

function FrameCorner({ corner }: { corner: number }) {
  return (
    <svg
      className={`portrait-corner portrait-corner-${corner}`}
      viewBox="0 0 48 48"
      aria-hidden="true"
    >
      <path d="M3 43V3h40M8 37V8h29" fill="none" stroke="#f3d693" strokeWidth="2" />
      <path
        d="M10 10c18-4 22 8 10 9 9 1 7 14 0 11 3-7-6-8-10-20Z"
        fill="#bc8a42"
        stroke="#ffe7ac"
        strokeWidth="1"
      />
      <path
        d="M13 13 29 29M17 14c7-1 9 1 8 5M14 17c-1 7 1 9 5 8"
        fill="none"
        stroke="#724719"
        strokeWidth="1.5"
      />
      <circle cx="9" cy="9" r="3" fill="#ffdf8b" />
    </svg>
  );
}
