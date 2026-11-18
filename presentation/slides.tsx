import { galleryHref } from '@lab/demo-kit/gallery-link';
import { TrackSymbol } from '@lab/demo-kit/track-symbol';
import { TVFrame } from './tv-frame';
import { DemoFrame } from './demo-frame';
import { WidescreenFrame } from './widescreen-frame';
import type { ComponentType, ReactNode } from 'react';
import { TitleSlide, DiagramSlide, StatementSlide, ExperimentOptions } from './layouts';

type Slide = {
  id: string;
  title: string;
  Content: ComponentType<{ preview?: boolean; onDemoExit?: () => void }>;
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
  const labHref = galleryHref('/');
  return (
    <StatementSlide eyebrow="Questions, then time to explore" title="Choose your starting point.">
      <p>
        Pick a track. Browse the ideas.
        <br />
        Use a guide, adapt a demo or bring your own project.
      </p>
      {labHref && (
        <a className="slide-resource" href={labHref}>
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

function Remote({ preview, onDemoExit }: { preview?: boolean; onDemoExit?: () => void }) {
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
  return demoHref ? (
    <TVFrame href={demoHref} onExit={onDemoExit} />
  ) : (
    <p>Set VITE_GALLERY_URL to embed Canvas TV.</p>
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
        <WidescreenFrame
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

function LiveExample({
  preview,
  id,
  title,
  hint,
  action,
}: {
  preview?: boolean;
  id: string;
  title: string;
  hint: string;
  action: ReactNode;
}) {
  if (preview)
    return (
      <div className="tv-slide-preview">
        <p>LIVE BROWSER DEMO</p>
        <h1>{title}</h1>
      </div>
    );
  const href = demoUrl(id);
  return (
    <div className="tv-slide" data-presentation-interactive>
      {href ? (
        <WidescreenFrame
          src={`${href}?embed=1&presentation=1`}
          title={title}
          allow="fullscreen"
          fillWidth={id === 'orbit'}
        />
      ) : (
        <p>Set VITE_GALLERY_URL to embed this demo.</p>
      )}
      <div className="tv-slide-footer">
        <span>{hint}</span>
        {action}
      </div>
    </div>
  );
}

function Orbit({ preview }: { preview?: boolean }) {
  return (
    <LiveExample
      preview={preview}
      id="orbit"
      title="Orbit — a scroll story"
      hint="Scroll inside the demo · Try a different finish"
      action={<a href="#television">Continue presentation →</a>}
    />
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
    <DiagramSlide eyebrow="Inside the TV demo" title="Draw the screen. Track the focus.">
      <ol className="system-diagram">
        <DiagramItems
          items={[
            ['INPUT', 'Remote buttons', 'Arrows move. OK opens. Back returns.'],
            ['STATE', 'Focus', 'Remember which item is selected and where to return.'],
            ['RENDER', 'Canvas', 'Draw the interface and its selection highlight.'],
          ]}
        />
      </ol>
      <p className="diagram-caption">
        The selected item lives in application state. Canvas makes that selection visible.
      </p>
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
“Today is a chance to explore something outside our normal delivery work. First, a quick look at the tracks, then three experiments with sound, scrolling and TV navigation.”`,
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
“Sound is one way to respond to an interaction. Now let’s use scrolling to move through a scene.”`,
  },
  {
    id: 'orbit',
    title: 'Orbit — a scroll story',
    Content: Orbit,
    notes: `SCROLL AND MOTION · 1 minute
“Here, scrolling controls a scene rather than just moving a page. The browser connects our gesture to the rotation, lighting and reveal of an object.”

Scroll slowly through the speaker’s turn, then try a finish. Keep it brief: this is an example of Motion and Three.js working together, not a product pitch. Reduced motion intentionally shows a still object.

TRANSITION
“That used a familiar gesture. What changes when there is no pointer or scroll wheel, just a remote?”

Use Continue presentation below the demo, or the presenter remote. Scroll and keyboard input inside the iframe belong to Orbit.`,
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
    title: 'Draw the screen. Track the focus.',
    Content: Components,
    notes: `CANVAS AND FOCUS · 1–2 minutes
“This interface is drawn on Canvas. A remote button changes the application state: which row and item are selected, or whether playback is open. The renderer draws the screen from that state, including the selection highlight.”

“Directional focus is a rule we implement: where should Right go, and where should Back return? Remembering that selection makes the interface feel predictable.”

Canvas does not provide the DOM's layout, semantics or focus behaviour for drawn items. Those responsibilities need deliberate implementation; Canvas is useful for particular constraints, not a general replacement for HTML. This demo also has HTML controls around the Canvas.

ONLY IF ASKED
Lightning was required by the agreement with Comcast for Xfinity devices. Its imperative API led us to build a custom React renderer so engineers could use familiar JSX. This accelerated component work and helped us build testing tools. Default tests mocked rendering, including Canvas; real-primitives tests also existed. The team later switched to Solid.js. Exact versions, testing APIs and migration reasons remain unconfirmed.

TRANSITION
“Let’s try a small illustration of that interaction. Watch what happens to the selection when we come back.”`,
  },
  {
    id: 'remote',
    title: 'Try the TV interface',
    Content: Remote,
    notes: `TV DEMO · 2–3 minutes
“This is a new React and Canvas illustration, not our original Lightning app.”

Move right until the shelf scrolls. Move down and back up: the row remembers the selection. Press Enter to play, then Escape to return. On a phone, use the on-screen arrows, OK and Back. Ask “Where should focus return?” before going back.

Playback is an original procedural animation, not streamed video. This does not demonstrate our custom renderer or Lightning itself. The TV receives keyboard focus automatically on every visit. Back unwinds the TV interface, then returns to the previous slide. Continue presentation leads forward to the four tracks.`,
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

Keep this slide up for questions, then invite people to choose a track. Answer historical project details honestly; say when a detail needs checking.`,
  },
];
