import { useMemo, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Input } from '@lab/ui/input';
import { Button } from '@lab/ui/button';
import { useTheme } from '@lab/ui/theme-control';
import { selectedTitle, playbackHint, type TVState } from './navigation';
import { rows } from './catalogue';
import { RemotePad } from './remote-pad';
import type { Snapshot } from './remote-protocol';
import { usePhone } from './use-phone';

const roomParam = new URLSearchParams(location.search).get('remote');
export const phoneRoom = roomParam && /^[a-f0-9]{32}$/.test(roomParam) ? roomParam : null;
const emptySnapshot = { title: '', row: '', playing: false };
const ignoreCommand = () => {};

export function PhoneRemote({ code }: { code: string }) {
  useTheme();
  const phone = usePhone(code, true, emptySnapshot, ignoreCommand);
  return (
    <main className="tv-phone tv-shell">
      <p className="tv-eyebrow">FRONTEND LAB / SECOND SCREEN</p>
      <h1>Your TV remote.</h1>
      <p role="status">
        {phone.supported ? phone.status : 'Open this remote over trusted HTTPS to connect.'}
      </p>
      <PhoneSelection selection={phone.selection} />
      <RemotePad disabled={!phone.connected} dispatch={phone.send} />
      <p>
        {phone.selection?.playing
          ? phone.selection.row
          : 'Use the arrows to browse. OK plays; Back returns.'}
      </p>
      <Button variant="outline" onClick={() => location.reload()}>
        Reconnect
      </Button>
      <Button variant="ghost" asChild>
        <a href={location.pathname}>Use this screen as a TV</a>
      </Button>
    </main>
  );
}

export function PhonePairing({
  state,
  dispatch,
}: {
  state: TVState;
  dispatch: (key: string) => void;
}) {
  const [code, setCode] = useState<string | null>(null);
  const snapshot = useMemo(
    () => ({
      title: selectedTitle(state).title,
      row: state.playback.value !== 'browsing' ? playbackHint(state) : rows[state.row].title,
      playing: state.playback.value !== 'browsing',
    }),
    [state],
  );
  const phone = usePhone(code, false, snapshot, dispatch);
  return (
    <section className="tv-pairing" aria-label="Optional phone remote">
      <div>
        <p className="tv-eyebrow">OPTIONAL / SECOND SCREEN</p>
        <h2>Make your phone the remote.</h2>
        <p role="status">
          {code ? phone.status : 'Keep browsing here, or pair a phone to control this TV.'}
        </p>
        <p className="tv-pairing-note">Phone pairing needs trusted HTTPS and internet.</p>
        <Button
          variant="outline"
          disabled={!phone.supported}
          onClick={() => setCode(code ? null : crypto.randomUUID().replaceAll('-', ''))}
        >
          {code ? 'Disconnect phone' : 'Connect phone'}
        </Button>
      </div>
      {code && <PairingCode code={code} />}
    </section>
  );
}

function PhoneSelection({ selection }: { selection: Snapshot | null }) {
  const current = selection ?? {
    title: 'Ready when you are.',
    row: 'Keep the TV open on your other screen.',
    playing: false,
  };
  return (
    <div className="tv-phone-selection" aria-live="polite">
      <p>{current.playing ? 'Now playing' : current.row}</p>
      <h2>{current.title}</h2>
    </div>
  );
}

function PairingCode({ code }: { code: string }) {
  const url = new URL(location.href);
  url.search = '';
  url.hash = '';
  url.searchParams.set('remote', code);
  return (
    <div className="tv-pairing-code">
      <p className="tv-pairing-note">
        One phone per TV. Anyone with this link can control it. Public signaling finds the screens;
        WebRTC carries controls. Some networks block connections.
      </p>

      <QRCodeSVG
        value={url.href}
        size={176}
        marginSize={4}
        title="Scan to open your phone remote"
      />
      <p>
        {location.hostname === 'localhost'
          ? 'Local test only. Use a hosted HTTPS page to scan from a phone.'
          : 'Scan with your phone camera.'}
      </p>
      <a href={url.href} target="_blank" rel="noreferrer">
        Open remote ↗
      </a>
      <Input
        aria-label="Phone remote link"
        readOnly
        value={url.href}
        onFocus={(event) => event.currentTarget.select()}
      />
    </div>
  );
}
