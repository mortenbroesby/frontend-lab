import type { ComponentType } from 'react';
import {
  TitleSlide,
  StatementSlide,
  DiagramSlide,
  DemonstrationSlide,
  TakeawaySlide,
} from './layouts';
import { RendererIllustration } from './experiment';

type Slide = {
  id: string;
  title: string;
  Content: ComponentType<{ preview?: boolean }>;
  notes?: string;
};

function Opening() {
  return (
    <TitleSlide
      eyebrow="A story from smart-TV development"
      title="Same components. Different screen."
    >
      <p>
        Building a familiar world
        <br />
        <strong>on an unfamiliar platform.</strong>
      </p>
      <span className="slide-caption">The Front-End Lab · Working draft</span>
    </TitleSlide>
  );
}
function Television() {
  return (
    <StatementSlide eyebrow="01 / The application" title="A fully animated web app. On a TV.">
      <p>Our team built a canvas-based interface for smart TVs and Xfinity set-top boxes.</p>
    </StatementSlide>
  );
}
function Constraint() {
  return (
    <StatementSlide eyebrow="02 / The constraint" title="The platform was already decided.">
      <p>
        Our collaboration with Comcast required Lightning.
        <br />
        Choosing a different framework was not the starting point.
      </p>
    </StatementSlide>
  );
}
function Friction() {
  return (
    <StatementSlide
      eyebrow="03 / The friction"
      title="Imperative APIs. Component-minded engineers."
    >
      <p>We wanted engineers to get up and running building components quickly.</p>
    </StatementSlide>
  );
}
function SystemDiagram({
  items,
  connected = true,
}: {
  items: readonly { label: string; title: string; description: string }[];
  connected?: boolean;
}) {
  return (
    <ol className={`system-diagram${connected ? '' : ' testing-options'}`}>
      {items.map((item) => (
        <li key={item.label}>
          <span>{item.label}</span>
          <strong>{item.title}</strong>
          <small>{item.description}</small>
        </li>
      ))}
    </ol>
  );
}
function Bridge() {
  return (
    <DiagramSlide eyebrow="04 / The bridge" title="We changed the authoring model.">
      <SystemDiagram
        items={[
          { label: 'AUTHOR', title: 'JSX', description: 'Familiar components' },
          { label: 'TRANSLATE', title: 'Custom renderer', description: 'Our abstraction layer' },
          { label: 'DISPLAY', title: 'Lightning', description: 'Primitives on the TV' },
        ]}
      />
      <p className="diagram-caption">Lightning remained the rendering platform.</p>
    </DiagramSlide>
  );
}
function Illustration({ preview }: { preview?: boolean }) {
  return (
    <DemonstrationSlide eyebrow="05 / An illustration" title="Describe the result.">
      <RendererIllustration preview={preview} />
    </DemonstrationSlide>
  );
}
function Testing() {
  return (
    <DiagramSlide eyebrow="06 / The second payoff" title="The abstraction helped us test, too.">
      <SystemDiagram
        connected={false}
        items={[
          { label: 'BUILD', title: 'Components', description: 'The same authoring model' },
          {
            label: 'DEFAULT TESTS',
            title: 'Test doubles',
            description: 'Mocked rendering and Canvas functionality',
          },
          {
            label: 'ALSO AVAILABLE',
            title: 'Real primitives',
            description: 'Tests using Lightning',
          },
        ]}
      />
      <p className="diagram-caption">We built the missing testing tools around that boundary.</p>
    </DiagramSlide>
  );
}
function Evolution() {
  return (
    <StatementSlide eyebrow="07 / The story continued" title="Later, the team moved to Solid.">
      <p>
        The original goal was a familiar component development experience.
        <br />
        The implementation evolved.
      </p>
    </StatementSlide>
  );
}
function Closing() {
  return (
    <TakeawaySlide eyebrow="08 / The takeaway" title="A useful boundary opens possibilities.">
      <p>
        <span>01</span>A fixed platform need not fix the authoring model.
      </p>
      <p>
        <span>02</span>Familiar components helped engineers get started.
      </p>
      <p>
        <span>03</span>The abstraction made testing tools easier to build.
      </p>
    </TakeawaySlide>
  );
}

export const slides: readonly Slide[] = [
  {
    id: 'front-end-lab',
    title: 'Same components. Different screen.',
    Content: Opening,
    notes:
      '1 minute. Working title, not final. Tell this as a project experience rather than a framework recommendation. The story is how we shaped developer experience within a prescribed platform.',
  },
  {
    id: 'television',
    title: 'A web app on a TV',
    Content: Television,
    notes:
      '3 minutes. Describe the fully working, fully animated canvas-based application. We do not yet have a screenshot, recording or code from the original project. If one becomes available and can be shared, replace this statement with a short recording. Do not present our illustration as original footage. Product name, dates, role and device details remain to be filled in.',
  },
  {
    id: 'constraint',
    title: 'The required platform',
    Content: Constraint,
    notes:
      '2 minutes. In this project, Lightning was a contractual decision in the Comcast collaboration involving Xfinity set-top boxes. Do not generalise this into a current requirement for every Xfinity application, and do not invent a performance-based selection process. Use the historical framework name and version if recovered.',
  },
  {
    id: 'friction',
    title: 'The developer experience gap',
    Content: Friction,
    notes:
      '3 minutes. The biggest challenge you recalled was Lightning’s imperative API compared with the modern component frameworks engineers knew. Explain how this affected your team using a real example if you remember one. The confirmed outcome is that the abstraction let engineers start building components quickly; no numerical onboarding improvement has been established.',
  },
  {
    id: 'bridge',
    title: 'JSX to Lightning primitives',
    Content: Bridge,
    notes:
      '4 minutes. Explain the custom React renderer and the abstraction over Lightning primitives. Developers saw JSX and a familiar React-style ecosystem. This is a conceptual flow, not a recovered architecture diagram. Avoid inventing host methods, package names or lifecycle details. A real before-and-after code snippet would improve this slide.',
  },
  {
    id: 'illustration',
    title: 'An illustrative component update',
    Content: Illustration,
    notes:
      '4 minutes. Change the highlighted state. The conceptual JSX and visible card change together. This example uses ordinary React DOM: it neither runs Lightning nor implements the original custom renderer. Use it to explain the idea of describing a result separately from its rendering target. The interactive button retains its keyboard behaviour. If time is short, explain the static view instead.',
  },
  {
    id: 'testing',
    title: 'Building the missing testing tools',
    Content: Testing,
    notes:
      '4 minutes. There was no testing framework for your setup, so you built one. The abstraction made that easier. Default tests mocked parts of the rendering environment, including Canvas functionality; tests using real Lightning primitives also existed. The three cards are related concerns, not a literal sequential test pipeline. Exact mocking libraries, assertion APIs and test boundaries are not yet recalled. Do not call this a separate test renderer or claim pixel-accurate Canvas simulation without evidence.',
  },
  {
    id: 'evolution',
    title: 'The later move to Solid',
    Content: Evolution,
    notes:
      '1 minute, optional. You recall a later switch to Solid.js. Why, when and how that changed the renderer and testing setup remain open. Keep this brief or omit it until there is a concrete firsthand detail. Do not frame it as React versus Solid or claim one was faster.',
  },
  {
    id: 'takeaways',
    title: 'What the boundary enabled',
    Content: Closing,
    notes:
      '2 minutes plus discussion. Return to the two confirmed benefits: engineers could build components quickly, and the abstraction made creating testing tools easier. A tradeoff discussion would be useful but needs your real recollection: what complexity did your team take responsibility for? The point is not that every unfamiliar platform needs a custom renderer.',
  },
];
