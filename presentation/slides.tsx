import { TrackSymbol } from '@lab/demo-kit/track-symbol';
import { TVFrame } from './tv-frame';
import { DemoFrame } from './demo-frame';
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
    </TitleSlide>
  );
}

function Possibilities() {
  return (
    <StatementSlide eyebrow="A different starting point" title="Change one assumption.">
      <p>
        What if the browser makes sound?
        <br />
        What if there is no pointer?
        <br />
        What if two screens share an interaction?
      </p>
    </StatementSlide>
  );
}

function Workshop() {
  return (
    <StatementSlide eyebrow="Chapter day" title="Today is for experimenting.">
      <p>
        Choose something interesting. Work solo or together.
        <br />
        Aim for a small experiment, not a finished product.
      </p>
    </StatementSlide>
  );
}

function TrackChoice() {
  return (
    <StatementSlide eyebrow="Choose your starting point" title="Four tracks to choose from.">
      <p>
        Explore a browser capability. Improve some code.
        <br />
        Make development easier. Build your own idea.
      </p>
      <p>Choose what interests you. Work solo or together.</p>
    </StatementSlide>
  );
}

function ModernWeb() {
  return (
    <div className="track-peek">
      <DiagramSlide
        eyebrow={
          <>
            <TrackSymbol track="modern-web" />
            Make the browser do something new.
          </>
        }
        title="Modern Web Capabilities"
      >
        <ExperimentOptions
          options={[
            {
              label: 'CONNECT',
              title: 'Connect two screens.',
              description: 'Send a message from your phone to your laptop.',
            },
            {
              label: 'COMPUTE',
              title: 'Keep it responsive.',
              description: 'Move a busy calculation into a Web Worker.',
            },
            {
              label: 'CREATE',
              title: 'Draw something live.',
              description: 'Explore Canvas, SVG or a browser animation.',
            },
          ]}
        />
      </DiagramSlide>
    </div>
  );
}

function CodeQuality() {
  return (
    <div className="track-peek">
      <DiagramSlide
        eyebrow={
          <>
            <TrackSymbol track="code-quality" />
            Work with code you already have.
          </>
        }
        title="Code Quality & Maintainability"
      >
        <ExperimentOptions
          options={[
            {
              label: 'UNDERSTAND',
              title: 'Trace a dependency.',
              description: 'See what relies on it before making a change.',
            },
            {
              label: 'TEST',
              title: 'Build one rule test-first.',
              description: 'Try red, green, refactor on a small behaviour.',
            },
            {
              label: 'SIMPLIFY',
              title: 'Follow a finding.',
              description: 'Use Fallow or another tool, then inspect the evidence.',
            },
          ]}
        />
      </DiagramSlide>
    </div>
  );
}

function DeveloperExperience() {
  return (
    <div className="track-peek">
      <DiagramSlide
        eyebrow={
          <>
            <TrackSymbol track="developer-experience" />
            Start with something that slows you down.
          </>
        }
        title="Developer Experience & Tooling"
      >
        <ExperimentOptions
          options={[
            {
              label: 'FEEDBACK',
              title: 'Run fewer tests.',
              description: 'Find the smallest useful check for one change.',
            },
            {
              label: 'WORKFLOW',
              title: 'Remove a manual step.',
              description: 'Make a small script, CLI or local API mock.',
            },
            {
              label: 'AGENTS',
              title: 'Try a repeatable task.',
              description: 'Explore a Codex or Copilot skill and review its output.',
            },
          ]}
        />
      </DiagramSlide>
    </div>
  );
}

function ExperimentalProjects() {
  return (
    <div className="track-peek">
      <DiagramSlide
        eyebrow={
          <>
            <TrackSymbol track="experimental-projects" />
            Build something you want to play with.
          </>
        }
        title="Experimental Projects"
      >
        <ExperimentOptions
          options={[
            {
              label: 'PLAY',
              title: 'Make a tiny game.',
              description: 'One control, one challenge and a restart button.',
            },
            {
              label: 'DRAW',
              title: 'Invent a visual rule.',
              description: 'Grow a pattern or make an interactive data picture.',
            },
            {
              label: 'LISTEN',
              title: 'Shape a sound.',
              description: 'Turn a slider or gesture into a musical control.',
            },
          ]}
        />
      </DiagramSlide>
    </div>
  );
}

function Assumptions() {
  return (
    <DiagramSlide
      eyebrow="Beyond the usual web page"
      title="Familiar skills. Different constraints."
    >
      <ExperimentOptions
        options={[
          {
            label: 'STATE',
            title: 'Where am I?',
            description: 'Track focus and restore the selection when someone returns.',
          },
          {
            label: 'COMPONENTS',
            title: 'What gets rendered?',
            description: 'Separate the interface model from the way it is drawn.',
          },
          {
            label: 'TOOLING',
            title: 'How do I check it?',
            description: 'Test navigation rules and inspect what the renderer is doing.',
          },
        ]}
      />
    </DiagramSlide>
  );
}

function InstrumentIntroduction() {
  return (
    <StatementSlide eyebrow="A personal experiment" title="Could the browser be an instrument?">
      <p>
        I remembered the music in old demoscene intros.
        <br />
        Could we make something like that with browser APIs?
      </p>
    </StatementSlide>
  );
}

function Closing() {
  const labHref = import.meta.env.LAB_STANDALONE
    ? import.meta.env.VITE_GALLERY_URL
    : import.meta.env.BASE_URL;
  return (
    <StatementSlide eyebrow="Questions, then time to explore" title="Choose your starting point.">
      <p>
        Pick a track. Browse the ideas.
        <br />
        Use a guide, adapt a demo or bring your own project.
      </p>
      {labHref && (
        <a className="slide-resource" href={`${labHref.replace(/\/$/, '')}/#/`}>
          Open the Frontend Lab →
        </a>
      )}
    </StatementSlide>
  );
}

function NextDirections() {
  return (
    <DiagramSlide eyebrow="The same example, four directions" title="Where would you take it?">
      <div className="track-options">
        <ExperimentOptions
          options={[
            {
              label: 'MODERN WEB',
              icon: <TrackSymbol track="modern-web" />,
              title: 'Connect a phone.',
              description: 'Explore messages between a remote and a shared screen.',
            },
            {
              label: 'CODE QUALITY',
              icon: <TrackSymbol track="code-quality" />,
              title: 'Understand the state.',
              description: 'Trace navigation rules and test what happens when you go back.',
            },
            {
              label: 'DEVELOPER EXPERIENCE',
              icon: <TrackSymbol track="developer-experience" />,
              title: 'Make debugging easier.',
              description: 'Explore ways to inspect focus, events and transitions.',
            },
            {
              label: 'EXPERIMENTAL PROJECTS',
              icon: <TrackSymbol track="experimental-projects" />,
              title: 'Invent another interface.',
              description: 'Turn the interaction into a game, visual world or something else.',
            },
          ]}
        />
      </div>
    </DiagramSlide>
  );
}

function Television() {
  return (
    <StatementSlide eyebrow="A different input device" title="A screen without a pointer.">
      <p>
        How do you know where you are?
        <br />
        Where does the next arrow press take you?
        <br />
        What happens when you press Back?
      </p>
    </StatementSlide>
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
  return demoHref ? <TVFrame href={demoHref} /> : <p>Set VITE_GALLERY_URL to embed Canvas TV.</p>;
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
          title="Browser Beat — interactive browser instrument"
          src={`${instrumentHref}?embed=1&presentation=1`}
          allow="autoplay; fullscreen"
        />
      ) : (
        <p>Set VITE_GALLERY_URL to the gallery URL to embed Browser Beat in a standalone deck.</p>
      )}
      <div className="tv-slide-footer">
        <span>Press Play · Shape the sound · Tab to continue</span>
        <a href="#sound-system">Continue presentation →</a>
      </div>
    </div>
  );
}

function DiagramItems({ items }: { items: [string, string, string][] }) {
  return items.map(([label, title, description]) => (
    <li key={label}>
      <span>{label}</span>
      <strong>{title}</strong>
      <small>{description}</small>
    </li>
  ));
}

function Components() {
  return (
    <DiagramSlide
      eyebrow="A different rendering target"
      title="The interface doesn’t have to be HTML."
    >
      <ol className="system-diagram rendering-options">
        <DiagramItems
          items={[
            ['DOM', 'Elements', 'The browser lays out and paints HTML and CSS.'],
            ['CANVAS', 'Drawing', 'Your code or a renderer draws the interface.'],
          ]}
        />
      </ol>
      <p className="diagram-caption">
        Lightning is a JavaScript framework for TV interfaces. It was the rendering platform on a TV
        project I worked on.
      </p>
      <a className="slide-resource" href="https://lightningjs.io/" target="_blank" rel="noreferrer">
        Lightning overview and documentation ↗
      </a>
    </DiagramSlide>
  );
}

function SoundSystem() {
  return (
    <DiagramSlide eyebrow="Inside Browser Beat" title="What makes that possible?">
      <ol className="system-diagram">
        <DiagramItems
          items={[
            ['CONTROL', 'React', 'Faders update the sound parameters.'],
            ['GENERATE', 'Web Audio', 'Schedules notes and processes the sound.'],
            ['OUTPUT', 'Speakers', 'Hear the signal as you change it.'],
          ]}
        />
      </ol>
      <p className="diagram-caption">Canvas draws a waveform from the live audio signal.</p>
    </DiagramSlide>
  );
}

export const slides: readonly Slide[] = [
  {
    id: 'welcome',
    title: 'The Frontend Lab',
    Content: Entrance,
    notes: `ARRIVAL
Leave this on screen while people arrive.

WHEN READY
“Today is a chance to explore something outside our normal delivery work. First, a quick look at the tracks, then two examples of what front-end skills can do.”`,
  },
  {
    id: 'workshop',
    title: 'Today is for experimenting',
    Content: Workshop,
    notes: `THE DAY · 1 minute
“Choose a question or an idea that interests you. You can work alone or with people from other squads. A useful outcome might be discovering an existing solution, comparing approaches or building something small.”

No production-ready deliverable is expected. The tracks provide starting points; participants can follow their curiosity. Keep logistics separate from this introduction.`,
  },
  {
    id: 'tracks',
    title: 'Four tracks to choose from',
    Content: TrackChoice,
    notes: `CHOOSING A TRACK · 30 seconds
There are four tracks, each with ideas and guides to help people begin. You can bring your own idea and work alone or with others. The next slides offer a few examples from each track.`,
  },
  {
    id: 'modern-web',
    title: 'Modern Web Capabilities',
    Content: ModernWeb,
    notes: `TRACK 1 OF 4 · 30–45 seconds
Make the browser do something new. Offer these as possible starting points, not tasks everyone must complete.
Send a message from your phone to your laptop. Move a busy calculation into a Web Worker. Explore Canvas, SVG or a browser animation.
Participants can work independently or together. Guides in the Lab explain how to begin.`,
  },
  {
    id: 'code-quality',
    title: 'Code Quality & Maintainability',
    Content: CodeQuality,
    notes: `TRACK 2 OF 4 · 30–45 seconds
Work with code you already have. Offer these as possible starting points, not tasks everyone must complete.
See what relies on it before making a change. Try red, green, refactor on a small behaviour. Use Fallow or another tool, then inspect the evidence.
Participants can work independently or together. Guides in the Lab explain how to begin.`,
  },
  {
    id: 'developer-experience',
    title: 'Developer Experience & Tooling',
    Content: DeveloperExperience,
    notes: `TRACK 3 OF 4 · 30–45 seconds
Start with something that slows you down. Offer these as possible starting points, not tasks everyone must complete.
Find the smallest useful check for one change. Make a small script, CLI or local API mock. Explore a Codex or Copilot skill and review its output.
Participants can work independently or together. Guides in the Lab explain how to begin.`,
  },
  {
    id: 'experimental-projects',
    title: 'Experimental Projects',
    Content: ExperimentalProjects,
    notes: `TRACK 4 OF 4 · 30–45 seconds
Build something you want to play with. Offer these as possible starting points, not tasks everyone must complete.
One control, one challenge and a restart button. Grow a pattern or make an interactive data picture. Turn a slider or gesture into a musical control.
Participants can work independently or together. Guides in the Lab explain how to begin.`,
  },
  {
    id: 'possibilities',
    title: 'Change one assumption',
    Content: Possibilities,
    notes: `OPEN THE QUESTION · 1–2 minutes
“We often start with a page and a pointer. Change one assumption and the same front-end skills lead somewhere different.”

Give people a moment to consider the questions. Do not turn this into a catalogue of APIs. Two examples follow: browser-generated music, then a remote-controlled interface.`,
  },
  {
    id: 'instrument-introduction',
    title: 'Could the browser be an instrument?',
    Content: InstrumentIntroduction,
    notes: `PERSONAL CURIOSITY · 1 minute
“I remembered those small demoscene intros with tracker music. Could the browser generate music, and could we shape it while it plays?”

Browser Beat is a new experiment made for this session, not a historical tracker file or part of the TV project. “Let’s hear it.”`,
  },
  {
    id: 'instrument',
    title: 'Browser Beat',
    Content: Instrument,
    notes: `LIVE MUSIC · 2–3 minutes
Press Play. Slowly change Tone, then add Echo. Change Tempo, and move Pitch to −12 or +12 to hear an octave shift without changing tempo. Faders support arrow keys too.

Keep the volume comfortable. Stop playback before discussing it. Continue presentation opens the signal diagram; leaving the slide removes the iframe and stops its audio. Presenter previews are static and silent.

IF AUDIO IS UNAVAILABLE
Show the controls and explain the signal path. Avoid spending the session troubleshooting the room’s sound system.`,
  },
  {
    id: 'sound-system',
    title: 'What makes that possible?',
    Content: SoundSystem,
    notes: `EXPLAIN WHAT THEY HEARD · 1–2 minutes
“React handles the controls. Web Audio schedules notes and processes the sound. The speakers play that signal; Canvas draws a waveform from it.”

The loop is original synthesized audio, not a recording. React does not need to render every audio sample. Keep the explanation at the level of responsibilities, not a tour of the source.

TRANSITION
“Now change the input instead of the output. Imagine using a screen without a pointer.”`,
  },
  {
    id: 'television',
    title: 'A screen without a pointer',
    Content: Television,
    notes: `REMOTE INPUT · 1–2 minutes
Ask where focus should start, how it moves between rows and where it should return after playback. Give people a moment to predict the behaviour.

Focus is part of the interface state, not just decoration. Explain directional navigation before showing the TV. Do not imply every TV app uses the same rendering system.`,
  },
  {
    id: 'components',
    title: 'The interface doesn’t have to be HTML',
    Content: Components,
    notes: `RENDERING · 2 minutes
“HTML and CSS are one way to describe an interface. With Canvas, code or a rendering library draws it. That changes which responsibilities the platform handles for us.”

A BRIEF REAL EXAMPLE
“I worked on an animated TV application using Lightning, rendered to canvas and controlled with a remote.” The link provides context for anyone unfamiliar with Lightning. Current documentation is not evidence of which historical version we used. Canvas is an alternative for particular constraints, not a general replacement for HTML; layout, semantics and accessibility need deliberate attention.

ONLY IF ASKED
Lightning was required by the agreement with Comcast for Xfinity devices. Its imperative API led us to build a custom React renderer so engineers could use familiar JSX. This accelerated component work and helped us build testing tools. Default tests mocked rendering, including Canvas; real-primitives tests also existed. The team later switched to Solid.js. Exact versions, testing APIs and migration reasons remain unconfirmed.`,
  },
  {
    id: 'assumptions',
    title: 'Familiar skills, different constraints',
    Content: Assumptions,
    notes: `CONNECT TO EVERYDAY WORK · 1–2 minutes
“State, components and events are still useful. The questions change: where does focus live, who draws the screen, and how do we inspect and test it?”

This is the link to quality and tooling, not a recommendation to build a framework. Existing tools and small improvements are valid experiments.

TRANSITION
“Let’s try a small illustration of that interaction. Watch what happens to the selection when we come back.”`,
  },
  {
    id: 'remote',
    title: 'Try the TV interface',
    Content: Remote,
    notes: `FINAL LIVE DEMO · 2–3 minutes
“This is a new React and Canvas illustration, not our original Lightning app.”

Move right until the shelf scrolls. Move down and back up: the row remembers the selection. Press Enter to play, then Escape to return. On a phone, use the on-screen arrows, OK and Back. Ask “Where should focus return?” before going back.

Playback is an original procedural animation, not streamed video. This does not demonstrate our custom renderer or Lightning itself. Tab through the remote to Continue presentation, which leads back to the four tracks.`,
  },
  {
    id: 'next-directions',
    title: 'Where would you take it?',
    Content: NextDirections,
    notes: `CONNECT THE DEMOS TO THE TRACKS · 2 minutes
“These examples are starting points. You could explore device communication, investigate the navigation state, improve a debugging workflow or invent a different interface.”

You do not have to extend these demos. An existing codebase or a recurring workflow problem is equally useful. Discovering a good existing solution counts; building a new tool is not compulsory.`,
  },
  {
    id: 'curiosity',
    title: 'Choose your starting point',
    Content: Closing,
    notes: `QUESTIONS AND HANDOVER · 3–5 minutes
“Any questions before we start? If you already have an idea, open a track and find a useful starting point.”

Use Open the Frontend Lab to return to the gallery. Track pages offer ideas, guides and demos. Participants can work independently or in small groups, using their own project where appropriate.

Keep this slide up for questions. Answer historical project details honestly; say when a detail needs checking. No additional motivational closing or requirement to present a finished result.`,
  },
];
