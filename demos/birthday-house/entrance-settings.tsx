import { useEffect, useId, useRef } from 'react';
import { currentLanguage, selectLanguage, tr } from './language';
import './entrance-settings.css';

export function EntranceSettings() {
  const dialog = useRef<HTMLDialogElement>(null);
  const title = useId();
  useEffect(() => {
    const element = dialog.current;
    return () => element?.close();
  }, []);
  return (
    <>
      <button
        className="entrance-settings-trigger"
        aria-haspopup="dialog"
        onClick={() => dialog.current?.showModal()}
      >
        {tr('Indstillinger', 'Settings')} <span aria-hidden="true">·</span>{' '}
        <span lang={tr('en', 'da')}>{tr('English', 'Dansk')}</span>
      </button>
      <dialog ref={dialog} className="paper-dialog entrance-settings" aria-labelledby={title}>
        <h2 id={title}>{tr('Indstillinger', 'Settings')}</h2>
        <fieldset>
          <legend>{tr('Spilsprog', 'Game language')}</legend>
          {(['da', 'en'] as const).map((code) => (
            <label key={code}>
              <input
                type="radio"
                name="house-language"
                value={code}
                checked={currentLanguage() === code}
                onChange={() => selectLanguage(code)}
              />
              <span lang={code}>{code === 'da' ? 'Dansk' : 'English'}</span>
            </label>
          ))}
        </fieldset>
        <button className="ink-button" onClick={() => dialog.current?.close()}>
          {tr('Tilbage til huset', 'Back to the house')}
        </button>
      </dialog>
    </>
  );
}
