import { InstrumentFrame } from './instrument-frame';
import type { ComponentType } from 'react';
import { TitleSlide, DiagramSlide, StatementSlide, ExperimentOptions } from './layouts';

type Slide = {
  id: string;
  title: string;
  Content: ComponentType<{ preview?: boolean }>;
  notes?: string;
};

function demoUrl(id: string) {
  const base = import.meta.env.LAB_STANDALONE
    ? import.meta.env.VITE_GALLERY_URL
    : import.meta.env.BASE_URL;
  return base && `${base.replace(/\/$/, '')}/demos/${id}/`;
}
const demoHref = demoUrl('canvas-tv');
const instrumentHref = demoUrl('browser-instrument');

function Entrance() {
  return (
    <TitleSlide eyebrow="A chapter session" title="The Frontend Lab">
      <p>Front-end development outside the usual web page.</p>
      <span className="slide-caption">Morten Broesby</span>
    </TitleSlide>
  );
}

function Possibilities() {
  return (
    <StatementSlide eyebrow="What this session is about" title="Front-end beyond the page.">
      <p>
        TV interfaces. Interactive installations. Visual tools. Games.
        <br />
        <strong>A TV project, then a browser instrument.</strong>
      </p>
    </StatementSlide>
  );
}

function Assumptions() {
  return (
    <DiagramSlide eyebrow="In this project" title="What was different.">
      <ExperimentOptions
        options={[
          {
            label: 'INPUT',
            title: 'Remote input.',
            description: 'Focus and directional navigation replaced pointer targeting.',
          },
          {
            label: 'RENDERING',
            title: 'Canvas visuals.',
            description: 'The interface was drawn rather than laid out with HTML elements.',
          },
          {
            label: 'TOOLING',
            title: 'Our own tools.',
            description: 'We built a component layer and testing tools for this setup.',
          },
        ]}
      />
    </DiagramSlide>
  );
}

function Experiments() {
  return (
    <DiagramSlide eyebrow="Two parts of the TV example" title="A few related experiments.">
      <ExperimentOptions
        options={[
          {
            label: 'INPUT',
            title: 'Keyboard navigation.',
            description:
              'Build a small grid. Move focus with arrow keys and restore it after opening an item.',
          },
          {
            label: 'RENDERING',
            title: 'React and Canvas.',
            description:
              'Keep position or colour in React state. Draw it on Canvas and update it from a control.',
          },
        ]}
      />
    </DiagramSlide>
  );
}

function Closing() {
  return (
    <StatementSlide eyebrow="Discussion" title="Questions?">
      <p>About the TV project, the demos, or something you'd like to try.</p>
    </StatementSlide>
  );
}

function Television() {
  return (
    <DiagramSlide eyebrow="Comcast collaboration · Xfinity set-top boxes" title="The TV project.">
      <div className="slide-description">
        <p>
          We built an animated, canvas-based interface controlled with a remote. Lightning was
          required by the project agreement.
        </p>
        <p>
          <strong>Lightning is a JavaScript framework for building TV interfaces.</strong> In our
          app, it rendered the interface to a canvas rather than HTML elements.
        </p>
        <a
          className="slide-resource"
          href="https://lightningjs.io/"
          target="_blank"
          rel="noreferrer"
        >
          Lightning overview and documentation ↗
        </a>
      </div>
    </DiagramSlide>
  );
}
function Remote({ preview }: { preview?: boolean }) {
  if (preview)
    return (
      <div className="tv-slide-preview">
        <p>LIVE CANVAS DEMO</p>
        <h1>
          No pointer.
          <br />
          Follow the focus.
        </h1>
      </div>
    );
  return (
    <div className="tv-slide" data-presentation-interactive>
      {demoHref ? (
        <iframe title="Canvas TV — interactive remote navigation" src={`${demoHref}?embed=1`} />
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

function Instrument({ preview }: { preview?: boolean }) {
  if (preview)
    return (
      <div className="tv-slide-preview">
        <p>LIVE WEB AUDIO DEMO</p>
        <h1>
          The browser
          <br />
          as an instrument.
        </h1>
      </div>
    );
  return (
    <div className="tv-slide instrument-slide" data-presentation-interactive>
      {instrumentHref ? (
        <InstrumentFrame
          title="Pocket tracker — interactive browser instrument"
          src={`${instrumentHref}?embed=1&presentation=1`}
          allow="autoplay; fullscreen"
        />
      ) : (
        <p>Set VITE_GALLERY_URL to the gallery URL to embed Pocket tracker in a standalone deck.</p>
      )}
      <div className="tv-slide-footer">
        <span>Press Play · Shape the sound · Tab to continue</span>
        <a href="#experiments">Continue presentation →</a>
      </div>
    </div>
  );
}

function Components() {
  return (
    <DiagramSlide eyebrow="Familiar components, different screen" title="How our app worked.">
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
        Engineers built components. Our renderer translated them into the TV interface.
      </p>
    </DiagramSlide>
  );
}

export const slides: readonly Slide[] = [
  {
    id: 'welcome',
    title: 'The Frontend Lab',
    Content: Entrance,
    notes: `ARRIVAL SLIDE
Leave this on screen while people arrive. No explanation is needed yet.

WHEN READY
“I want to show you a different use of front-end technology, using a project I worked on. We'll look at the interaction and then how the app worked.”`,
  },
  {
    id: 'possibilities',
    title: 'Front-end beyond the page',
    Content: Possibilities,
    notes: `FRONT-END IN OTHER SETTINGS · 2–3 minutes
“We usually associate front-end development with websites. But the same skills show up in very different environments: TV interfaces, interactive installations, visual tools and games.”

THE PURPOSE
“I'm using one project as an example. It involved familiar front-end work, but with a different rendering system and input device.”

BRIDGE TO OUR EXAMPLE
“I worked on one of those: a TV application. Let me give you a quick look at how that worked.”

Keep the other settings brief. The TV project is the concrete firsthand example; don't imply its architecture represents every TV app today.`,
  },
  {
    id: 'television',
    title: 'The TV project',
    Content: Television,
    notes: `ONE REAL EXAMPLE · 1–2 minutes
“We built a fully animated, canvas-based application for smart TVs. People navigated it with a remote rather than a pointer. Lightning was part of our agreement with Comcast for Xfinity devices.”

WHAT LIGHTNING IS
“Lightning is a JavaScript framework for TV interfaces. In our project it drew the interface to a canvas, rather than us building it from HTML elements.” The slide links to its official site for anyone who wants to look further. Today the site covers Lightning 3 and Blits; those names do not identify the version we used.

THE APP AT A GLANCE
The interface was drawn on Canvas. Remote input moved focus and selected things. It was still front-end work: building components, managing state and making the interaction understandable, on a different kind of screen.

TRANSITION
“Let's try what that interaction feels like, and then I'll show you the high-level structure.”

REMEMBER
This describes our project, not current Xfinity policy. The next slide is a new illustration, not footage of the original app.`,
  },
  {
    id: 'remote',
    title: 'Try the interaction: no pointer',
    Content: Remote,
    notes: `LET PEOPLE TRY IT · 2–3 minutes
“This is a small Canvas example made for this talk, not our original Lightning application. Notice what changes when you navigate with a remote instead of a mouse. Put the pointer aside for a moment.”

LIVE SEQUENCE
Move right until the shelf scrolls. Move down, then back up: the row remembers its selection. Press Enter to play the selected title as a full-frame procedural animation, then Escape to return. On a phone, use the on-screen arrows, OK and Back.

PAUSE FOR A QUESTION
“What should happen when I go back?” Give people a moment to predict it before pressing Back. The focus ring, predictable movement and restored selection are doing work a pointer normally makes easy.

TRANSITION
“The interaction was unfamiliar. We wanted building the components to feel familiar.” Tab through the remote to Continue presentation, or click that link, to move on.

REMEMBER
This illustration uses React state and native Canvas 2D. It does not demonstrate Lightning or our custom renderer, and its playback is an original procedural animation, not streamed video.`,
  },
  {
    id: 'components',
    title: 'How our app worked',
    Content: Components,
    notes: `HOW IT WORKED, AT A HIGH LEVEL · 2–3 minutes
“Lightning exposed an imperative API. Our engineers were used to components, so we built a custom React renderer that let them work with familiar JSX.”

FOLLOW THE DIAGRAM
Engineers described components in JSX. Our renderer translated them into Lightning primitives. Lightning provided the rendered TV interface. That is the level of detail needed here; no reconciler internals or code walkthrough.

WHY THAT HELPED
“People could get up and running building components quickly. The abstraction also made it easier to build testing tools for this environment.” Keep testing to that brief benefit unless someone asks.

BACK TO THE BIGGER IDEA
“The component model was familiar, but input, rendering and testing were different. Here are the main differences.”

IF ASKED
Default tests mocked parts of rendering, including Canvas functionality; tests using real Lightning primitives also existed. Exact testing APIs need checking. The team later switched to Solid.js, but the reason and migration details aren't confirmed here. The live example is React plus Canvas 2D, not this original renderer.`,
  },
  {
    id: 'assumptions',
    title: 'What was different',
    Content: Assumptions,
    notes: `BRIEF RECAP · about 1 minute
“The input was different, the rendering was different, and we built some of the tooling ourselves. Components and application state were still familiar.”

Don't explain the diagram again. Use these three points to draw together what people just saw. The animation makes the demo enjoyable; the focus movement and return behaviour are the connection to the project.

TRANSITION
“That project changed the input and rendering. Here is another direction: using the browser to generate sound.”`,
  },
  {
    id: 'instrument',
    title: 'The browser as an instrument',
    Content: Instrument,
    notes: `A SECOND PERSPECTIVE · 2–3 minutes
“This one is a new experiment, not part of the TV project. I remembered those small demoscene intros with tracker music and wondered what we could make in a browser.”

TRY IT LIVE
Press Play. Move Tone slowly, then add a little Echo. Turn the lead volume down to hear the rhythm and bass, then bring it back. Toggle a few steps so people can hear the pattern change. Keep the volume comfortable and stop playback before discussing it.

WHAT IS HAPPENING
“The browser is generating the sound. React manages the controls, Web Audio schedules the notes and processes the signal, and Canvas draws what we hear.” The loop is original synthesized audio, not a recording or a historical tracker file. The waveform and frequency bars read the live audio signal.

TRANSITION
“Changing an input, a rendering surface or an output can lead to quite a different experiment.” Click Continue presentation outside the instrument. Moving to another slide removes the iframe and stops its audio. The presenter preview is deliberately static and silent.

IF AUDIO IS UNAVAILABLE
Describe the signal path and show the controls. Do not spend the talk debugging the room's sound system.`,
  },
  {
    id: 'experiments',
    title: 'A few related experiments',
    Content: Experiments,
    notes: `TWO RELATED EXPERIMENTS · 2–3 minutes
Keyboard navigation: build a small grid of items, move focus with arrows, open one and return to the same selection. This is the interaction we just tried. It can use ordinary HTML; Canvas isn't required to investigate focus.

React and Canvas: keep a position or colour in React state, draw it on Canvas, and change it from a control. This is a small way to explore state and a different rendering surface. It is not the same as implementing a custom React renderer.

These are suggestions, not assignments. People can also work on code quality or tooling in the other tracks. Stop here if discussion is already underway.`,
  },
  {
    id: 'curiosity',
    title: 'Questions',
    Content: Closing,
    notes: `QUESTIONS
“Any questions about the project or either of the demos?”

Leave this slide up for discussion. If someone asks about a historical detail you don't remember, say so. The current Lightning documentation and this Canvas demo are not evidence of exactly how the original app was implemented.

There is no need for another motivational summary. Allow time for questions rather than stretching the material to fill the slot.`,
  },
];
