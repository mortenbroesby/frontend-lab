import type { ComponentType } from 'react';
import { TitleSlide, DiagramSlide, StatementSlide, ExperimentOptions } from './layouts';

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

function Entrance() {
  return (
    <TitleSlide eyebrow="A technical spotlight" title="The Front-End Lab">
      <p>What else could we build?</p>
      <span className="slide-caption">Morten Broesby</span>
    </TitleSlide>
  );
}

function Possibilities() {
  return (
    <StatementSlide
      eyebrow="What's possible?"
      title="The browser can do more than we usually ask of it."
    >
      <p>
        Think beyond what we normally build.
        <br />
        <strong>Try something unfamiliar.</strong>
      </p>
    </StatementSlide>
  );
}

function Assumptions() {
  return (
    <DiagramSlide eyebrow="Take something you know somewhere new" title="Change one assumption.">
      <ExperimentOptions
        options={[
          {
            label: 'INPUT',
            title: 'Beyond the pointer.',
            description: 'What if you only had five buttons?',
          },
          {
            label: 'SURFACE',
            title: 'Beyond the page.',
            description: 'What if your interface was a canvas?',
          },
          {
            label: 'CONNECTION',
            title: 'Beyond one screen.',
            description: 'What if another browser could join in?',
          },
        ]}
      />
    </DiagramSlide>
  );
}

function Experiments() {
  return (
    <DiagramSlide
      eyebrow="A starting point, not a specification"
      title="Something you could try today."
    >
      <ExperimentOptions
        options={[
          {
            label: 'MAKE',
            title: 'A small world.',
            description: 'Draw a landscape. Give one thing movement or a response to input.',
          },
          {
            label: 'REVEAL',
            title: 'A hidden pattern.',
            description: 'Visualise a small dataset. Let someone explore a connection.',
          },
          {
            label: 'CONNECT',
            title: 'Two screens.',
            description: 'Send one action from a browser and show its effect in another.',
          },
        ]}
      />
      <p className="diagram-caption">Start with one interaction. Follow what interests you.</p>
    </DiagramSlide>
  );
}

function Closing() {
  return (
    <StatementSlide eyebrow="Your turn" title="What are you curious about?">
      <p>
        Pick something you haven't tried before.
        <br />
        <strong>See what happens.</strong>
      </p>
    </StatementSlide>
  );
}

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
    id: 'welcome',
    title: 'The Front-End Lab',
    Content: Entrance,
    notes: `ARRIVAL SLIDE
Leave this on screen while people arrive. No explanation is needed yet.

WHEN READY
“Welcome. Today I'd like to share a few possibilities, and one experience that changed how I think about web applications.” Advance to the invitation.`,
  },
  {
    id: 'possibilities',
    title: "What's possible?",
    Content: Possibilities,
    notes: `THE INVITATION · 2–3 minutes
“This is mostly an invitation to think outside what we normally build. The modern browser gives us so many possibilities, and our everyday work only touches some of them.”

“Hopefully, by the end, I've inspired you to try something unfamiliar. You don't need a production-ready result or a business case for every experiment today.”

MAKE IT PERSONAL
Ask what people normally spend their time building. Leave a moment for an answer; don't turn this into a catalogue of browser APIs.

BRIDGE TO LIGHTNING
“One experience that changed how I thought about web applications was building one for a TV.”`,
  },
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
  {
    id: 'assumptions',
    title: 'Change one assumption',
    Content: Assumptions,
    notes: `ZOOM BACK OUT · 3–4 minutes
“We changed the input and the rendering surface, but kept a familiar way to build components. You can try a much smaller version of that idea.”

THREE POSSIBILITIES
Input: take away the pointer and design a predictable path through an interface.
Surface: keep React for state, but try drawing an interactive scene on Canvas.
Connection: let an action in one browser affect another. Start with one message rather than a complete multiplayer application.

INVITE A RESPONSE
“Which assumption in something you build every day would be interesting to change?” Give people time to think. These are possibilities, not requirements.

TRANSITION
“Here are three small places you could start.”`,
  },
  {
    id: 'experiments',
    title: 'Something you could try today',
    Content: Experiments,
    notes: `CHOOSE A FIRST EXPERIMENT · 3–4 minutes
A small world: start with a shape or landscape that moves. Then let a key press change something. The TV scenery is one illustration, not a target you need to match.

A hidden pattern: use a small dataset you understand. Draw relationships and make one of them selectable. Finding an interesting question matters more than the size of the dataset.

Two screens: send one action and display it elsewhere. Same-origin tabs can be a first step; separate devices need an appropriate connection and setup. Don't promise that a tab-messaging API works across devices.

KEEP IT OPEN
People can explore these through Modern Web Capabilities or Experimental Projects. Improving the workflow or understanding an existing codebase is also a valid choice in the other tracks. There is no required finished product.

TRANSITION
“You don't need to build a TV application. You just need a question you'd enjoy exploring.”`,
  },
  {
    id: 'curiosity',
    title: 'What are you curious about?',
    Content: Closing,
    notes: `CLOSE · 1 minute, then questions
“Pick something you haven't tried before and see what happens. Today is a good opportunity to do that.”

Leave the question on screen. Invite questions or ideas about what people would like to explore. Allow roughly 4–5 minutes for discussion if the session has a 20–25-minute slot.

If questions return to the original project, distinguish what you remember from details that still need checking. No need to turn this into a framework comparison.`,
  },
];
