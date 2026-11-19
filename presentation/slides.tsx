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
    <TitleSlide eyebrow="A day to tinker" title="The Frontend Lab">
      <p>Take things apart. See what the browser can do.</p>
    </TitleSlide>
  );
}

function Possibilities() {
  return (
    <StatementSlide
      eyebrow="Still finding things that surprise me"
      title="More than text and images."
    >
      <p>
        What if the browser makes sound?
        <br />
        What if there is no pointer?
        <br />
        What if scrolling moves a whole scene?
      </p>
    </StatementSlide>
  );
}

function Workshop() {
  return (
    <StatementSlide eyebrow="Chapter day" title="Today is for experimenting.">
      <p>
        These demos are starting points. Bring your own idea.
        <br />
        Already inspired? Go ahead and start.
        <br />
        Work solo or pair up — whatever makes sense.
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
      <p>Starting points, not fixed lanes. Your own project is welcome.</p>
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
              title: 'Get feedback sooner.',
              description: 'Find the smallest useful check for one change.',
            },
            {
              label: 'WORKFLOW',
              title: 'Remove a manual step.',
              description: 'Try a script, local mock or parallel worktree.',
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
    <StatementSlide eyebrow="I'll be experimenting too" title="Try something new.">
      <p>
        Take it apart. Change something. Try again.
        <br />
        I'll be around for questions, ideas and discussions.
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
    <DiagramSlide
      eyebrow="Examples to borrow from — or leave behind"
      title="Where would you take it?"
    >
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
    <StatementSlide
      eyebrow="A different side of frontend — TV and streaming"
      title="A screen without a pointer."
    >
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
    <div className="tv-slide orbit-slide" data-presentation-interactive>
      {href ? (
        <WidescreenFrame
          src={`${href}?embed=1&presentation=1`}
          title={title}
          allow="fullscreen"
          responsive
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
      hint="Scroll down for the tour · Blend a colour at the end"
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
    notes: `01 / 17 · WELCOME
“As far back as I can remember, I've tinkered with computers — both software and hardware.”

• Around 11 → tried different firmware on a router
• Bricked it
• Taking things apart; figuring out how they work

“I thought I'd become a game developer. My first job unexpectedly turned into building web pages.”

• Untraditional route into the web
• Years in TV / streaming
• Same curiosity — web = more than text and images

NEXT → What today is for`,
  },
  {
    id: 'workshop',
    title: 'Today is for experimenting',
    Content: Workshop,
    notes: `02 / 17 · TODAY
“I built this Lab to give you ideas, not a list of things you have to finish.”
• Already inspired? Go ahead and start
• Solo or together — pair however it makes sense
• No production-ready result needed

AI
“Yes, I used AI to build this site. I want to be light on it today, but how you work is up to you.”

NEXT → Four possible starting points`,
  },
  {
    id: 'tracks',
    title: 'Four tracks to choose from',
    Content: TrackChoice,
    notes: `03 / 17 · FOUR TRACKS
“These are four ways to get started. You can follow an idea across tracks, or bring something of your own.”
• Ideas / demos / guides in the Lab
• Own project or own idea equally welcome

NEXT → Modern Web`,
  },
  {
    id: 'modern-web',
    title: 'Modern Web Capabilities',
    Content: ModernWeb,
    notes: `04 / 17 · MODERN WEB
“Pick a browser capability you haven't used before and see what you can make it do.”
• Phone ↔ laptop
• Workers → responsive UI
• Canvas / SVG → live visuals
• Pick one behaviour; play with it

NEXT → Code Quality`,
  },
  {
    id: 'code-quality',
    title: 'Code Quality & Maintainability',
    Content: CodeQuality,
    notes: `05 / 17 · CODE QUALITY
“You don't need a new app for this track. Take a piece of code you already have and understand it a little better.”
• Dependency → who uses it?
• Small behaviour → red / green / refactor
• Fallow or another tool → investigate findings
• Understand before changing

NEXT → Developer Experience`,
  },
  {
    id: 'developer-experience',
    title: 'Developer Experience & Tooling',
    Content: DeveloperExperience,
    notes: `06 / 17 · DEVELOPER EXPERIENCE
“If something annoys you every day, this is a chance to try a better way of doing it.”
• Faster feedback / fewer unnecessary checks
• Script, CLI, local mock
• Worktrees / parallel tasks
• Agent workflow if useful
• Existing solution counts too

NEXT → Experimental Projects`,
  },
  {
    id: 'experimental-projects',
    title: 'Experimental Projects',
    Content: ExperimentalProjects,
    notes: `07 / 17 · EXPERIMENTAL PROJECTS
“This is closest to how I like to explore: make something because I want to play with it.”
• Tiny game
• Generative picture / moving world
• Sound / musical controls
• Curiosity is enough

NEXT → Beyond the usual web page`,
  },
  {
    id: 'possibilities',
    title: 'More than text and images',
    Content: Possibilities,
    notes: `08 / 17 · MORE THAN A PAGE
“The browser still surprises me. I want to show a few things that make me want to keep tinkering.”
• What if the output were sound?
• What if scrolling moved a scene?
• What if the input were a TV remote?

NEXT → Music / personal inspiration`,
  },
  {
    id: 'instrument-introduction',
    title: 'Could the browser be an instrument?',
    Content: InstrumentIntroduction,
    notes: `09 / 17 · BROWSER AS AN INSTRUMENT
“I remember those small intros with really memorable music. I wanted to see whether I could make something with that feeling in a browser.”
• Could I make something like that in a browser?
• Shape the sound while it plays
• New experiment, not an old tracker file

NEXT → Browser Beat — hear it`,
  },
  {
    id: 'instrument',
    title: 'Browser Beat',
    Content: Instrument,
    notes: `10 / 17 · BROWSER BEAT
“Let's hear what happens when we change just a few controls.”

• Comfortable volume → Play
• Tone → hear the change
• Echo → add space
• Tempo → speed
• Pitch ±12 → octave, same tempo
• Stop sound before explaining

IF NEEDED → tap Play on audience screen
NO AUDIO → show controls; move on

NEXT → How the sound works`,
  },
  {
    id: 'sound-system',
    title: 'What makes that possible?',
    Content: SoundSystem,
    notes: `11 / 17 · THE SOUND PATH
“React handles the controls; Web Audio makes the sound. They don't have to do the same job.”

• Web Audio → timing and effects
• Speakers → sound
• Canvas → waveform
• Synthesised, not a recording
• No React render for each audio sample

NEXT → Orbit — sound to movement`,
  },
  {
    id: 'orbit',
    title: 'Orbit — a scroll story',
    Content: Orbit,
    notes: `12 / 17 · ORBIT
“We usually scroll to read more. Here, the same gesture lets us move through a scene.”
• Slow turn → lighting → reveal
• At the end → drag the colour gradient
• Motion + Three.js
• Familiar gesture; different result
• Keep this brief

REMOTE → Next part / Play demo
NEXT → TV — no pointer, no scroll wheel`,
  },
  {
    id: 'television',
    title: 'A screen without a pointer',
    Content: Television,
    notes: `13 / 17 · A SCREEN WITHOUT A POINTER
“I spent years working in TV and streaming. A lot of the skills were familiar, but a remote changes how you think about an interface.”
• Remote: directions, OK, Back
• Where should selection start?
• Where should Back return?
• Focus = part of the state

NEXT → Canvas + focus, high level`,
  },
  {
    id: 'components',
    title: 'Draw the screen. Track the focus.',
    Content: Components,
    notes: `14 / 17 · DRAW + TRACK FOCUS
“The remote changes our state, and Canvas draws the result. We have to decide where the focus goes and where Back takes us.”
• State: row / item / playback
• Canvas draws the screen + highlight
• We define movement and return behaviour
• Drawn items don't inherit DOM layout or semantics
• This demo also has HTML controls

IF ASKED → Lightning requirement; JSX custom renderer;
testing tools; later Solid (details in working draft)

NEXT → Try the TV`,
  },
  {
    id: 'remote',
    title: 'Try the TV interface',
    Content: Remote,
    notes: `15 / 17 · TV DEMO
“This is a small illustration of that idea, not the original TV app. Watch what happens to the selection when we come back.”
• Right → shelf scrolls
• Down → up → remembered selection
• OK / Enter → play
• Back / Escape → return
• Ask: where should focus land?
• Playback = generated animation

LEAVE → remote Next slide / Continue presentation
BACK → unwinds TV, then previous slide

NEXT → Their ideas`,
  },
  {
    id: 'next-directions',
    title: 'Where would you take it?',
    Content: NextDirections,
    notes: `16 / 17 · WHERE WOULD YOU TAKE IT?
“You don't have to extend anything I've shown. If it gave you a different idea, follow that instead.”
• Connect screens / investigate focus / improve a tool
• Remix, bring your own idea, or use your own code
• Discovering something useful is enough
• Already know what to try? Start

NEXT → Questions + handover`,
  },
  {
    id: 'curiosity',
    title: 'Try something new',
    Content: Closing,
    notes: `17 / 17 · OVER TO YOU
“Don't be afraid to break something while trying to make it better. Take it apart, see how it works, and try again.”

• Hope: try something new
• Solo or pair up — whatever makes sense
• Available all day: questions, ideas, discussions
• I'll be tinkering too
• Still surprised by what the browser can do

OPEN THE LAB → choose an idea / demo / guide
• Questions?`,
  },
];
