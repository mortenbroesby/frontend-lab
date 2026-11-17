import type { ComponentType } from 'react';
import { Button } from '@lab/ui/button';
import { TitleSlide, DiagramSlide, DemonstrationSlide } from './layouts';

type Slide = {
  id: string;
  title: string;
  Content: ComponentType<{ preview?: boolean }>;
  notes?: string;
};

const showcaseHref = import.meta.env.LAB_STANDALONE
  ? import.meta.env.VITE_GALLERY_URL &&
    `${import.meta.env.VITE_GALLERY_URL.replace(/\/$/, '')}/showcases/canvas-tv/`
  : `${import.meta.env.BASE_URL}showcases/canvas-tv/`;

function Television() {
  return (
    <TitleSlide eyebrow="A story from smart-TV development" title="A web app. On a TV.">
      <p>
        A fully animated, canvas-based interface.
        <br />
        <strong>Lightning was the required platform.</strong>
      </p>
      <span className="slide-caption">Comcast collaboration · Xfinity set-top boxes</span>
    </TitleSlide>
  );
}
function Remote({ preview }: { preview?: boolean }) {
  return (
    <DemonstrationSlide
      eyebrow="Try a different interaction model"
      title="No pointer. Where is your focus?"
    >
      <div className="remote-slide">
        <div className="remote-diagram" aria-label="A directional remote">
          <span>↑</span>
          <span>←</span>
          <strong>OK</strong>
          <span>→</span>
          <span>↓</span>
        </div>
        <p>Move. Select. Return.</p>
        {showcaseHref ? (
          <Button asChild className="text-foreground" variant="outline" disabled={preview}>
            <a
              href={showcaseHref}
              target="_blank"
              rel="noopener noreferrer"
              tabIndex={preview ? -1 : undefined}
            >
              Open Canvas TV ↗
            </a>
          </Button>
        ) : (
          <p className="showcase-setup">
            Open this deck through the gallery build to launch Canvas TV, or set
            VITE_GALLERY_URL for a standalone deck.
          </p>
        )}
        <small>Original Canvas 2D showcase · opens in a new tab</small>
      </div>
    </DemonstrationSlide>
  );
}
function Components() {
  return (
    <DiagramSlide
      eyebrow="The engineering behind our original app"
      title="Familiar components. Different renderer."
    >
      <ol className="system-diagram">
        <li>
          <span>AUTHOR</span>
          <strong>JSX</strong>
          <small>Familiar components</small>
        </li>
        <li>
          <span>TRANSLATE</span>
          <strong>Custom renderer</strong>
          <small>Our abstraction layer</small>
        </li>
        <li>
          <span>DISPLAY</span>
          <strong>Lightning</strong>
          <small>Primitives on the TV</small>
        </li>
      </ol>
      <p className="diagram-caption">
        Faster component onboarding. A boundary we could build testing tools around.
      </p>
    </DiagramSlide>
  );
}

export const slides: readonly Slide[] = [
  {
    id: 'television',
    title: 'A web app on a TV',
    Content: Television,
    notes:
      'About 1 minute. This is a short section within the broader talk, not the whole presentation. Our fully animated canvas-based TV app used Lightning because it was contractually required in our Comcast collaboration involving Xfinity set-top boxes. Do not generalise to current Xfinity policy or claim we chose it after a performance evaluation. Add original footage if available; the showcase on the next slide is not the original project.',
  },
  {
    id: 'remote',
    title: 'No pointer: navigating with a remote',
    Content: Remote,
    notes:
      'About 2–3 minutes live. Open Canvas TV in a separate tab, focus its screen using Use keyboard remote and put the mouse aside. Move right beyond the visible row, down to another shelf, then back up: each row remembers its selection. Enter opens title details; Escape returns to the same position. Ask where focus should move next. A visible focus and predictable movement replace pointer targeting. This is a new React + Canvas 2D interaction study with generated artwork, not Lightning, the original custom renderer or a video service. Close the tab to return here. Physical TV hardware has not been tested.',
  },
  {
    id: 'components',
    title: 'Familiar components, different renderer',
    Content: Components,
    notes:
      'About 1–2 minutes. The biggest recalled challenge was the imperative Lightning API. We built a custom React renderer over Lightning primitives so engineers could use JSX and a familiar ecosystem, and start building components quickly. No numerical productivity claims. We also built missing testing tools; the abstraction made that easier. Default tests mocked parts of rendering, including Canvas functionality; tests using real Lightning primitives also existed. Exact assertions, mocking APIs and boundaries remain open. The later move to Solid is optional spoken context only: its reason is not yet recalled. Return to the broader talk after this section.',
  },
];
