import type { ReactNode } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@lab/ui/accordion';

export function IdeaGrid({ children }: { children: ReactNode }) {
  return <div className="idea-grid">{children}</div>;
}

export function Idea({
  title,
  summary,
  children,
}: {
  title: string;
  summary: string;
  children: ReactNode;
}) {
  return (
    <section className="idea-card">
      <h2>{title}</h2>
      <p className="idea-summary">{summary}</p>
      <Accordion type="single" collapsible>
        <AccordionItem value="details">
          <AccordionTrigger aria-label={`Explore ${title}`}>
            Experiment & resources
          </AccordionTrigger>
          <AccordionContent>
            <div className="idea-details">{children}</div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
}

export function Inspiration({ children }: { children: ReactNode }) {
  return (
    <Accordion className="idea-inspiration" type="single" collapsible>
      <AccordionItem value="examples">
        <AccordionTrigger>See real examples</AccordionTrigger>
        <AccordionContent>
          <div className="idea-details">{children}</div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export function IdeaNote({ children }: { children: ReactNode }) {
  return <p className="idea-note">{children}</p>;
}
