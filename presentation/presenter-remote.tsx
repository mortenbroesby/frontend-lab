import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@lab/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@lab/ui/dialog';
import { useTheme } from '@lab/ui/theme-control';
import { useDemoHandoff } from './demo-handoff';
import { useRemote } from './use-remote';
import type { RemoteState } from './remote-protocol';

const ignoreMove = () => {};
export function PresenterRemote({ code }: { code: string }) {
  useTheme();
  const remote = useRemote(code, null, ignoreMove);
  const state = remote.snapshot;
  return (
    <main className="presenter-remote">
      <p className="remote-eyebrow">Frontend Lab · Presenter remote</p>
      <p role="status">
        {remote.supported ? remote.status : 'Open this page over HTTPS to connect.'}
      </p>
      <RemoteContent
        state={state}
        connected={remote.connected}
        request={remote.request}
        returnToSlides={remote.returnToSlides}
      />
      <Button variant="outline" onClick={() => location.reload()}>
        Reconnect
      </Button>
      <p className="remote-hint">
        Keep both screens open. If this phone sleeps, wait for Connected before advancing.
      </p>
    </main>
  );
}

function SlideButtons({ state, connected, request }: RemoteContentProps) {
  const canMove = connected && state !== null;
  return (
    <nav className="remote-navigation" aria-label="Slide navigation">
      <Button
        variant="outline"
        disabled={!canMove || state.index === 0}
        onClick={() => request(-1)}
      >
        ← Previous
      </Button>
      <Button disabled={!canMove || state.index === state.total - 1} onClick={() => request(1)}>
        Next →
      </Button>
    </nav>
  );
}
type RemoteContentProps = {
  state: RemoteState | null;
  connected: boolean;
  request: (delta: -1 | 1) => void;
  returnToSlides: () => void;
};
function RemoteContent({ state, connected, request, returnToSlides }: RemoteContentProps) {
  if (!state) return <h1>Connect your presentation</h1>;
  return (
    <>
      <div className="remote-meta">
        <span>{`Slide ${state.index + 1} of ${state.total}`}</span>
        <span>Elapsed {state.elapsed}</span>
      </div>
      <h1>{state.title}</h1>
      <RemoteNavigation
        state={state}
        connected={connected}
        request={request}
        returnToSlides={returnToSlides}
      />
      <section className="remote-notes" aria-label="Speaker notes">
        <h2>Presenter notes</h2>
        <p>{state.notes || 'No notes for this slide.'}</p>
      </section>
      <p>
        <strong>Up next:</strong> {state.next || 'End of presentation'}
      </p>
    </>
  );
}
function pairingStatus(supported: boolean, code: string | null, status: string) {
  if (!supported) return 'Pairing requires HTTPS or localhost.';
  return code ? status : 'Start a session, then scan the QR code.';
}
function pairingUrl(code: string | null) {
  const url = new URL(location.href);
  url.hash = code ? `remote=${code}` : '';
  return url.href;
}
export function RemotePairing({
  state,
  move,
}: {
  state: RemoteState;
  move: (delta: number) => void;
}) {
  const [code, setCode] = useState<string | null>(null);
  const { setActive } = useDemoHandoff();
  const remote = useRemote(code, state, move, () => setActive(false));
  const url = pairingUrl(code);
  function togglePairing() {
    setCode(code ? null : crypto.randomUUID().replaceAll('-', ''));
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Presenter remote</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Use your phone as a presenter remote</DialogTitle>
          <DialogDescription>
            See notes and control slides on a second screen. Keep this presentation open.
          </DialogDescription>
        </DialogHeader>
        <p role="status">{pairingStatus(remote.supported, code, remote.status)}</p>
        {code && (
          <div className="remote-pairing">
            <QRCodeSVG
              value={url}
              size={192}
              marginSize={4}
              title="Scan to open presenter remote"
            />
            <a href={url} target="_blank" rel="noreferrer">
              Open presenter remote
            </a>
            <p>
              Anyone with this link can control this session. Public signalling connects the
              screens; some networks block WebRTC.
            </p>
          </div>
        )}
        <Button disabled={!remote.supported} onClick={togglePairing}>
          {code ? 'Disconnect remote' : 'Start pairing'}
        </Button>
      </DialogContent>
    </Dialog>
  );
}

function RemoteNavigation(props: RemoteContentProps) {
  const { state, connected, returnToSlides } = props;
  if (state?.demoActive)
    return (
      <nav className="remote-navigation" aria-label="Demo navigation">
        <Button disabled={!connected} onClick={returnToSlides}>
          Return to slides
        </Button>
      </nav>
    );
  return <SlideButtons {...props} />;
}
