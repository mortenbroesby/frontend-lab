import { DirectionPad } from '@lab/ui/direction-pad';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@lab/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@lab/ui/accordion';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@lab/ui/breadcrumb';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@lab/ui/pagination';

const pages = [
  'Start with one useful interaction.',
  'Try the keyboard before adding polish.',
  'Try another variation.',
];

export function Navigation() {
  const [remoteAction, setRemoteAction] = useState('Try the remote');
  const [page, setPage] = useState(1);
  return (
    <section id="ui-navigation" className="ui-showcase-section" aria-labelledby="navigation-title">
      <div className="ui-showcase-section-heading">
        <span>04 / Navigation</span>
        <h3 id="navigation-title">Navigation</h3>
        <p>Arrow keys move between tabs. Tab reaches the content.</p>
      </div>
      <div className="ui-showcase-panel">
        <DirectionPad
          horizontal
          onDirection={setRemoteAction}
          onSelect={() => setRemoteAction('OK')}
          onBack={() => setRemoteAction('Back')}
        />
        <p role="status">{remoteAction}</p>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#ui-actions">Components</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Navigation</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Tabs defaultValue="overview">
          <TabsList aria-label="Navigation patterns">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="unavailable" disabled>
              Coming later
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <p>Tabs switch between related views without leaving the page.</p>
          </TabsContent>
          <TabsContent value="details">
            <p>Each trigger owns a panel. Keyboard focus and selection stay in sync.</p>
          </TabsContent>
        </Tabs>
        <Accordion type="single" collapsible>
          <AccordionItem value="reuse">
            <AccordionTrigger>How do I use these components?</AccordionTrigger>
            <AccordionContent>
              Import the component from its public @lab/ui entry and include @lab/ui/styles.css.
              Compose components around your demo’s own state.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="keyboard">
            <AccordionTrigger>What should I try with a keyboard?</AccordionTrigger>
            <AccordionContent>
              Use Tab and Shift+Tab to move through controls, arrows within tabs and menus, and
              Escape to dismiss overlays.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <div id="page-preview" className="ui-showcase-page" aria-live="polite">
          <span className="ui-showcase-note">
            Page {page} of {pages.length}
          </span>
          <p>{pages[page - 1]}</p>
        </div>
        <Pagination aria-label="Example pages">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#page-preview"
                aria-disabled={page === 1}
                tabIndex={page === 1 ? -1 : 0}
                onClick={(event) => {
                  event.preventDefault();
                  setPage(Math.max(1, page - 1));
                }}
              />
            </PaginationItem>
            {pages.map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  href="#page-preview"
                  isActive={page === index + 1}
                  aria-label={`Page ${index + 1}`}
                  onClick={(event) => {
                    event.preventDefault();
                    setPage(index + 1);
                  }}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#page-preview"
                aria-disabled={page === pages.length}
                tabIndex={page === pages.length ? -1 : 0}
                onClick={(event) => {
                  event.preventDefault();
                  setPage(Math.min(pages.length, page + 1));
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </section>
  );
}
