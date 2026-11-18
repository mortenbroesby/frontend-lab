import { useState } from 'react';
import { galleryHref } from '@lab/demo-kit/gallery-link';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@lab/ui/button';
import { Input } from '@lab/ui/input';
import { Label } from '@lab/ui/label';
import { createRoomCode, validRoomCode } from './reactions';

function openRoom(code: string | null, host = false) {
  if (host && code) sessionStorage.setItem('reaction-host', code);
  else sessionStorage.removeItem('reaction-host');
  const url = new URL(location.href);
  if (code) url.searchParams.set('reactionRoom', code);
  else url.searchParams.delete('reactionRoom');
  // Navigation starts a fresh room session and clears its local reactions.
  location.assign(url.href);
}
export function RoomLobby() {
  const [code, setCode] = useState('');
  return (
    <section className="reaction-lobby">
      <div className="reaction-lobby-icons" aria-hidden="true">
        🚀 ✨ 💜
      </div>
      <p className="eyebrow">One room. Everyone’s reactions.</p>
      <h2>Bring the room to life.</h2>
      <p>Create a room and invite your group, or join with a code.</p>
      <Button size="lg" onClick={() => openRoom(createRoomCode(), true)}>
        Create a room
      </Button>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (validRoomCode(code)) openRoom(code);
        }}
      >
        <Label htmlFor="reaction-room-code">Have a room code?</Label>
        <div className="reaction-join-row">
          <Input
            id="reaction-room-code"
            value={code}
            onChange={(event) => setCode(event.target.value.toLowerCase().trim())}
            placeholder="cosmic-otter-7k4p"
            maxLength={24}
            pattern={'[a-z0-9\\-]{1,24}'}
            required
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
          />
          <Button type="submit" variant="outline">
            Join room
          </Button>
        </div>
      </form>
      <small>The creator hosts the room. Keep that page open. No accounts or server setup.</small>
      <p>
        <a
          href={
            galleryHref('/track/modern-web/devices') ??
            'https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API'
          }
        >
          How to connect the screens
        </a>
      </p>
    </section>
  );
}
export function RoomShare({ code }: { code: string }) {
  const [feedback, setFeedback] = useState('');
  const url = new URL(location.href);
  url.searchParams.set('reactionRoom', code);
  url.searchParams.delete('embed');
  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url.href);
      setFeedback('Link copied');
    } catch {
      setFeedback('Copy the room code above, or scan the QR code.');
    }
  }
  return (
    <aside className="reaction-share" aria-label="Invite your group">
      <h3>Invite your group</h3>
      <strong className="reaction-code">{code}</strong>
      <div className="reaction-qr">
        <QRCodeSVG
          value={url.href}
          size={160}
          marginSize={3}
          title="Scan to join this reaction room"
        />
      </div>
      <Button
        variant="outline"
        onClick={() => {
          void copyLink();
        }}
      >
        Copy invite link
      </Button>
      <p role="status">{feedback}</p>
      <p>Share this code or scan to join. Each screen takes one place, including the projector.</p>
      <p>
        Fast tapping warms an icon up, even on your own. A group burst burns brighter. Stop tapping
        and it settles, then fades.
      </p>
      <Button variant="ghost" onClick={() => openRoom(null)}>
        Leave room
      </Button>
    </aside>
  );
}
