import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@lab/ui/accordion';
import { Snippet } from '@lab/ui/snippet';
import type { DemoDefinition } from './types';
import { galleryHref } from './gallery-link';

/** The gallery and standard demo shell share the same opt-in editing guidance. */
export function ExploreCode({ demo, id }: { demo: DemoDefinition; id: string }) {
  if (!demo.explore) return null;
  const guide = demo.explore.guide && galleryHref(demo.explore.guide);
  return (
    <Accordion type="single" collapsible className="demo-code">
      <AccordionItem value="code">
        <AccordionTrigger aria-label={`Explore the code for ${demo.title}`}>
          Explore the code
        </AccordionTrigger>
        <AccordionContent>
          <p>
            Source folder: <code>demos/{id}/</code>
          </p>
          <p>After installing the Lab, run from the repository root:</p>
          <Snippet
            code={`npm run dev --workspace @lab/demo-${id}`}
            label={`Copy command for ${demo.title}`}
          />
          <p>
            Start in <code>{demo.explore.file}</code>. {demo.explore.change}
          </p>
          {guide && <a href={guide}>Open the related guide →</a>}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
