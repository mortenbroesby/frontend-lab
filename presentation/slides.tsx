import type { ComponentType } from 'react';
import { TitleSlide, DiagramSlide } from './layouts';

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
  if (preview)
    return (
      <div className="tv-slide-preview">
        <p>LIVE CANVAS SHOWCASE</p>
        <h1>
          No pointer.
          <br />
          Follow the focus.
        </h1>
      </div>
    );
  return (
    <div className="tv-slide" data-presentation-interactive>
      {showcaseHref ? (
        <iframe title="Canvas TV — interactive remote navigation" src={`${showcaseHref}?embed=1`} />
      ) : (
        <p>Set VITE_GALLERY_URL to the gallery URL to embed Canvas TV in a standalone deck.</p>
      )}
      <div className="tv-slide-footer">
        <span>↑ ↓ ← → Navigate · Enter select · Escape back · Tab to leave TV</span>
        <a href="#components">Continue presentation →</a>
      </div>
    </div>
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
    notes: `BRIDGE INTO THE STORY · 1–2 minutes
“For us, this became a real project. We had to build a fully animated web application for TVs, using Lightning as part of our agreement with Comcast for Xfinity devices.”

“The interesting question wasn't which framework to choose. It was how to make this unfamiliar environment productive for our engineers.”

POINT TO LAND
A web application can have a very different rendering surface and interaction model from the pages we build every day. This is one personal example, not a recommendation that everyone should build for TVs.

TRANSITION
“Before I explain how we built components, let's try the part that feels most different: there is no pointer.”

REMEMBER
This describes our project's contractual constraint, not current Xfinity policy. The next slide is a new illustration, not footage of the original app.`,
  },
  {
    id: 'remote',
    title: 'No pointer: navigating with a remote',
    Content: Remote,
    notes: `LET PEOPLE TRY IT · 2–3 minutes
“This is a small Canvas example made for this talk, not our original Lightning application. Put the mouse aside for a moment. Where would you expect the focus to go?”

LIVE SEQUENCE
Move right until the shelf scrolls. Move down, then back up: the row remembers its selection. Press Enter to open a title, then Escape to return. On a phone, use the on-screen arrows, OK and Back.

PAUSE FOR A QUESTION
“What should happen when I go back?” Give people a moment to predict it before pressing Back. The focus ring, predictable movement and restored selection are doing work a pointer normally makes easy.

TRANSITION
“The interaction was unfamiliar. We wanted building the components to feel familiar.” Tab through the remote to Continue presentation, or click that link, to move on.

REMEMBER
This illustration uses React state and native Canvas 2D. It does not demonstrate Lightning or our custom renderer, and it does not stream video.`,
  },
  {
    id: 'components',
    title: 'Familiar components, different renderer',
    Content: Components,
    notes: `THE ENGINEERING STORY · 2–3 minutes
“The biggest challenge for us was Lightning's imperative API. Our engineers were used to building components. So we built a custom React renderer over Lightning's primitives and exposed the JSX model people already knew.”

WALK THROUGH THE DIAGRAM
Engineers authored familiar components. Our renderer translated that into Lightning primitives. That helped people get up and running building components quickly.

THE SECOND BENEFIT
“We also had to build testing tools for this setup. Having that abstraction made it easier to create a testing library.” Default tests mocked parts of the rendering environment, including Canvas functionality; tests using real Lightning primitives also existed.

BACK TO CURIOSITY
“The point isn't that you should build a framework. It's that an unfamiliar platform doesn't mean throwing away everything you know. Which familiar skill could you take somewhere new?”

HAND BACK TO THE BROADER TALK
“You don't need to build a TV application. Try a different input method, an interactive visualisation, or communication between browsers. Pick something you haven't tried before and see what happens.”

IF ASKED
We later switched to Solid.js, but the reason and migration details aren't confirmed here. The exact testing APIs also need checking; don't improvise those details.`,
  },
];
