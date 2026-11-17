import type { ComponentType } from 'react';
import {
  TitleSlide,
  StatementSlide,
  DiagramSlide,
  DemonstrationSlide,
  TakeawaySlide,
} from './layouts';
import { WaveExperiment } from './experiment';

type Slide = {
  id: string;
  title: string;
  Content: ComponentType<{ preview?: boolean }>;
  notes?: string;
};

function Opening() {
  return (
    <TitleSlide eyebrow="A technical spotlight" title="The Front-End Lab">
      <p>
        Small experiments.
        <br />
        <strong>New possibilities.</strong>
      </p>
      <span className="slide-caption">An example deck · React, all the way down</span>
    </TitleSlide>
  );
}
function Question() {
  return (
    <StatementSlide
      eyebrow="01 / A question worth exploring"
      title="What changes when we can try an idea immediately?"
    >
      <p>Make the feedback loop visible.</p>
    </StatementSlide>
  );
}
function System() {
  return (
    <DiagramSlide
      eyebrow="02 / Understanding the system"
      title="A short path from idea to insight."
    >
      <ol className="system-diagram">
        <li>
          <span>01</span>
          <strong>Change</strong>
          <small>A single input</small>
        </li>
        <li>
          <span>02</span>
          <strong>Render</strong>
          <small>A React component</small>
        </li>
        <li>
          <span>03</span>
          <strong>Observe</strong>
          <small>A visible result</small>
        </li>
      </ol>
      <p className="diagram-caption">Adjust one thing. See what follows. Repeat.</p>
    </DiagramSlide>
  );
}
function Experiment({ preview }: { preview?: boolean }) {
  return (
    <DemonstrationSlide eyebrow="03 / Try it yourself" title="Shape the signal.">
      <WaveExperiment preview={preview} />
    </DemonstrationSlide>
  );
}
function Closing() {
  return (
    <TakeawaySlide eyebrow="04 / What did we learn?" title="Keep the loop small.">
      <p>
        <span>01</span>Start with a question.
      </p>
      <p>
        <span>02</span>Make one thing tangible.
      </p>
      <p>
        <span>03</span>Follow the interesting result.
      </p>
    </TakeawaySlide>
  );
}

export const slides: readonly Slide[] = [
  {
    id: 'front-end-lab',
    title: 'The Front-End Lab',
    Content: Opening,
    notes:
      'These five slides demonstrate the presentation system. Replace this example narrative with your technical spotlight. A 20–30 minute session can mix a few visual ideas with a live experiment.',
  },
  {
    id: 'question',
    title: 'A question worth exploring',
    Content: Question,
    notes:
      'Use a single question to establish the topic. This is a layout example, not a proposed talk script.',
  },
  {
    id: 'system',
    title: 'Understanding the system',
    Content: System,
    notes:
      'Explain the diagram from left to right. Keep labels short and move implementation details into your own notes.',
  },
  {
    id: 'experiment',
    title: 'Try it yourself',
    Content: Experiment,
    notes:
      'Move the frequency slider with the pointer or arrow keys. The deck must stay on this slide while controls have focus. Click the slide background to resume slide shortcuts. The example has no timers or subscriptions to clean up.',
  },
  {
    id: 'takeaways',
    title: 'What did we learn?',
    Content: Closing,
    notes:
      'Replace these example takeaways with the ideas your audience should remember. There is no required reporting or sharing workflow.',
  },
];
