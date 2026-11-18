import { DirectionPad } from '@lab/ui/direction-pad';
import { SlideStage } from './slide-stage';
import { slides } from './slides';
import { useEffect, useState } from 'react';
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
import type { RemoteAction } from './remote-protocol';
import { useRemote } from './use-remote';
import type { RemoteState } from './remote-protocol';

const ignoreInput = () => {};
export function PresenterRemote({ code }: { code: string }) {
  useTheme();
  const remote = useRemote(code, null, ignoreInput);
  const state = remote.snapshot;
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [state?.index]);
  return (
    <main className="presenter-remote">
      <p className="remote-eyebrow">Frontend Lab · Presenter remote</p>
      <p role="status">
        {remote.supported ? remote.status : 'Open this page over HTTPS to connect.'}
      </p>
      <RemoteContent state={state} connected={remote.connected} request={remote.request} />
      <Button variant="outline" onClick={() => location.reload()}>
        Reconnect
      </Button>
      <p className="remote-hint">
        Keep both screens open. If this phone sleeps, wait for Connected before advancing.
      </p>
    </main>
  );
}

type RemoteContentProps = {
  state: RemoteState | null;
  connected: boolean;
  request: (action: RemoteAction) => void;
};
function RemoteContent({ state, connected, request }: RemoteContentProps) {
  if (!state) return <h1>Connect your presentation</h1>;
  return (
    <>
      <div className="remote-meta">
        <span>{`Slide ${state.index + 1} of ${state.total}`}</span>
        <span>Elapsed {state.elapsed}</span>
      </div>
      <h1>{state.title}</h1>
      <RemoteSlidePreview state={state} />
      <RemoteNavigation state={state} connected={connected} request={request} />
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
  input,
  onConnectionChange,
}: {
  state: RemoteState;
  input: (action: RemoteAction) => void;
  onConnectionChange: (connected: boolean) => void;
}) {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState<string | null>(null);
  const remote = useRemote(code, state, input);
  useEffect(() => {
    onConnectionChange(remote.connected);
    if (remote.connected) setOpen(false);
  }, [remote.connected, onConnectionChange]);
  const url = pairingUrl(code);
  function togglePairing() {
    setCode(code ? null : crypto.randomUUID().replaceAll('-', ''));
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Presenter remote</Button>
      </DialogTrigger>
      <DialogContent
        onCloseAutoFocus={(event) => {
          if (!remote.connected) return;
          event.preventDefault();
          document.getElementById('presentation-stage')?.focus();
        }}
      >
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

const focusLabels = { slides: 'Slides', tv: 'TV', playback: 'Playback' };
function DemoRemote({
  tour,
  connected,
  request,
}: {
  tour: NonNullable<RemoteState['walkthrough']>;
  connected: boolean;
  request: RemoteContentProps['request'];
}) {
  const playback = tour.playing
    ? { action: 'demo-stop' as const, label: 'Stop demo' }
    : { action: 'demo-play' as const, label: 'Play demo' };
  return (
    <>
      <p role="status">
        {tour.index + 1} of {tour.total} · {tour.label}
      </p>
      {tour.message && <p role="status">{tour.message}</p>}
      <div className="remote-demo-actions">
        <Button variant="outline" disabled={!connected} onClick={() => request('back')}>
          ← Back
        </Button>
        <Button disabled={!connected} onClick={() => request('right')}>
          {tour.index === tour.total - 1 ? 'Next slide →' : 'Next part →'}
        </Button>
        <Button variant="outline" disabled={!connected} onClick={() => request(playback.action)}>
          {playback.label}
        </Button>
      </div>
    </>
  );
}
function RemoteNavigation({
  state,
  connected,
  request,
}: Omit<RemoteContentProps, 'state'> & { state: RemoteState }) {
  return (
    <section className="remote-control-panel" aria-label="Remote control">
      {state.walkthrough ? (
        <DemoRemote tour={state.walkthrough} connected={connected} request={request} />
      ) : (
        <DirectionPad
          horizontal
          disabled={!connected}
          label={`Focus · ${focusLabels[state.focus]}`}
          onDirection={request}
          onSelect={() => request('select')}
          onBack={() => request('back')}
        />
      )}
      <Button
        variant="outline"
        disabled={!connected || state.index === state.total - 1}
        onClick={() => request('next-slide')}
      >
        {state.walkthrough ? 'Skip demo →' : 'Next slide →'}
      </Button>
    </section>
  );
}

function RemoteSlidePreview({ state }: { state: RemoteState }) {
  return (
    <div className="remote-slide-preview" aria-label={`Current slide: ${state.title}`}>
      {slides[state.index]?.title === state.title ? (
        <SlideStage index={state.index} preview />
      ) : (
        <p>Reload this remote to load the current deck.</p>
      )}
    </div>
  );
}
