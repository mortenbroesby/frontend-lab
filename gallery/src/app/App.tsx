import { useEffect, useRef, useState, type ReactNode } from 'react';
import { CommandMenu, commandMenuLabel } from '@lab/demo-kit/command-menu';
import { Button } from '@lab/ui/button';
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from '@lab/ui/dialog';
import { LabMark } from '@lab/demo-kit/mark';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@lab/ui/accordion';
import { DemoGallery } from './DemoGallery';
import { TrackSymbol } from './TrackSymbol';
import { demos } from '../demo-registry';
import { tracks } from './tracks';

import { GuideView } from './GuideView';

function TrackGuide({ track, route }: { track: (typeof tracks)[number]; route: string }) {
  const trackPage = route.slice(`/track/${track.id}`.length + 1) || 'ideas';
  return (
    <>
      <nav className="guide-nav" aria-label="Track guide">
        {[
          ['ideas', 'Ideas'],
          ['examples', 'Demos'],
        ].map(([page, label]) => (
          <a
            key={page}
            aria-current={trackPage === page ? 'page' : undefined}
            href={`#/track/${track.id}${page === 'ideas' ? '' : '/' + page}`}
          >
            {label}
          </a>
        ))}
        <a className="track-build-link" href="#/create">
          Create a demo <span aria-hidden="true">↗</span>
        </a>
      </nav>
      {trackPage === 'examples' ? (
        <>
          <DemoGallery track={track.id} />
          <Accordion className="demo-notes" type="single" collapsible>
            <AccordionItem value="notes">
              <AccordionTrigger>Experiments to try with these demos</AccordionTrigger>
              <AccordionContent>
                <GuideView document={`tracks/${track.id}/examples`} />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </>
      ) : (
        <GuideView document={`tracks/${track.id}/${trackPage}`} />
      )}
    </>
  );
}

function findTrack(route: string) {
  return tracks.find((t) =>
    [
      `/track/${t.id}`,
      ...[
        'examples',
        ...(t.id === 'modern-web' ? ['devices'] : []),
        ...(t.id === 'code-quality' ? ['fallow'] : []),
      ].map((page) => `/track/${t.id}/${page}`),
    ].includes(route),
  );
}

interface Page {
  title: string;
  description?: string;
  content: ReactNode;
}

const pages: Record<string, Page> = {
  '/': {
    title: 'Explore. Try. Build.',
    description:
      'A playground for front-end experiments. Find an idea, try a working example or create something of your own.',
    content: (
      <>
        <HomeJourneys />
        <TrackChoices />
      </>
    ),
  },
  '/demos': {
    title: 'Try a demo',
    description: 'Every demo, across all four tracks.',
    content: <DemoGallery />,
  },
  '/create': {
    title: 'Create a demo',
    description: 'Start with a small React app. Make it your own.',
    content: <GuideView document="create-demo" />,
  },
  '/guide/setup': {
    title: 'Run the Lab locally',
    description: 'Install the workspace and start experimenting.',
    content: <GuideView document="setup" />,
  },
};
const notFound: Page = {
  title: 'Page not found',
  content: (
    <p>
      <a href="#/">Return to the tracks</a>
    </p>
  ),
};

function resolvePage(route: string): Page {
  const track = findTrack(route);
  if (track) return { ...track, content: <TrackGuide track={track} route={route} /> };
  return pages[route] ?? notFound;
}

function HomeJourneys() {
  return (
    <nav className="home-journeys" aria-label="Choose a journey">
      <a
        href="#tracks-heading"
        onClick={(event) => {
          event.preventDefault();
          const heading = document.getElementById('tracks-heading');
          heading?.focus({ preventScroll: true });
          heading?.scrollIntoView({ block: 'start' });
        }}
      >
        <span className="journey-label">
          Explore tracks <span aria-hidden="true">↓</span>
        </span>
        <span>Find an idea worth trying.</span>
      </a>
      <a href="#/demos">
        <span className="journey-label">
          Try demos <span aria-hidden="true">↗</span>
        </span>
        <span>See an experiment in action.</span>
      </a>
      <a href="#/create">
        <span className="journey-label">
          Create a demo <span aria-hidden="true">↗</span>
        </span>
        <span>Start with a small React app.</span>
      </a>
    </nav>
  );
}

function TrackChoices() {
  return (
    <section aria-labelledby="tracks-heading">
      <div className="track-heading">
        <h2 id="tracks-heading" tabIndex={-1}>
          Explore tracks
        </h2>
        <p>Choose a direction. Follow your curiosity.</p>
      </div>
      <div className="track-grid">
        {tracks.map((t) => (
          <a
            className="track-card"
            data-track={t.id}
            key={t.id}
            href={`#/track/${t.id}`}
            aria-label={`Explore ${t.title}`}
          >
            <div className="track-card-top">
              <TrackSymbol track={t.id} />
              <span className="track-number">
                {demos.filter((demo) => demo.track === t.id).length} demos
              </span>
            </div>
            <h3>{t.title}</h3>
            <p>{t.description}</p>
            <span className="track-card-cta">
              Explore track
              <span className="track-link-arrow" aria-hidden="true">
                ↗
              </span>
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}

function LabNavigation({ route }: { route: string }) {
  const [commandOpen, setCommandOpen] = useState(false);
  const mobileTrigger = useRef<HTMLButtonElement>(null);
  const links = [
    ['/', 'Tracks'],
    ['/demos', 'Demos'],
    ['/create', 'Create a demo'],
    ['/guide/setup', 'Local setup'],
  ];
  return (
    <nav aria-label="Lab">
      <CommandMenu
        open={commandOpen}
        onOpenChange={setCommandOpen}
        triggerClassName="command-desktop-trigger"
        onCloseAutoFocus={(event) => {
          if (mobileTrigger.current?.getClientRects().length) {
            event.preventDefault();
            mobileTrigger.current.focus();
          }
        }}
        links={[
          { label: 'All demos', group: 'Navigation', href: '#/demos', shortcut: 'G' },
          { label: 'Create a demo', group: 'Navigation', href: '#/create' },
          ...demos.map((demo) => ({ label: demo.title, group: 'Demos', href: demo.href })),
        ]}
      />
      <div className="desktop-nav">
        {links.map(([path, label]) => (
          <a
            className="site-nav-link"
            key={path}
            href={`#${path}`}
            aria-current={route === path ? 'page' : undefined}
          >
            {label}
          </a>
        ))}
      </div>
      <Dialog key={route}>
        <DialogTrigger asChild>
          <Button
            ref={mobileTrigger}
            className="mobile-nav-toggle"
            variant="ghost"
            size="lg"
            aria-label="Open navigation menu"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            Menu
          </Button>
        </DialogTrigger>
        <DialogContent
          className="mobile-navigation translate-x-0 translate-y-0"
          onCloseAutoFocus={(event) => {
            if (commandOpen) event.preventDefault();
          }}
          showCloseButton={false}
          aria-describedby={undefined}
        >
          <div className="mobile-navigation-header">
            <DialogTitle className="wordmark">
              <LabMark />
              Front-End Lab
            </DialogTitle>
            <DialogClose asChild>
              <Button variant="ghost" size="lg" aria-label="Close navigation menu">
                Close <span aria-hidden="true">×</span>
              </Button>
            </DialogClose>
          </div>
          <nav aria-label="Mobile navigation" className="mobile-navigation-links">
            {links.map(([path, label]) => (
              <DialogClose key={path} asChild>
                <a href={`#${path}`} aria-current={route === path ? 'page' : undefined}>
                  <span>{label}</span>
                  <span className="mobile-navigation-arrow" aria-hidden="true">
                    ↗
                  </span>
                </a>
              </DialogClose>
            ))}
          </nav>
          <DialogClose asChild>
            <Button
              variant="outline"
              onClick={() => setCommandOpen(true)}
              aria-label="Open command palette"
            >
              {commandMenuLabel}
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </nav>
  );
}

function useRoute() {
  const [route, setRoute] = useState(() => location.hash.slice(1) || '/');
  useEffect(() => {
    const navigate = () => {
      setRoute(location.hash.slice(1) || '/');
    };
    window.addEventListener('hashchange', navigate);
    return () => window.removeEventListener('hashchange', navigate);
  }, []);
  const previousRoute = useRef(route);
  useEffect(() => {
    const previousTrack = findTrack(previousRoute.current);
    const currentTrack = findTrack(route);
    if (previousRoute.current === route) return;
    previousRoute.current = route;
    const tab =
      previousTrack === currentTrack
        ? document.querySelector<HTMLElement>('.guide-nav [aria-current="page"]')
        : null;
    if (tab) {
      tab.focus({ preventScroll: true });
      tab.scrollIntoView({ block: 'nearest' });
    } else {
      document.getElementById('content')?.focus({ preventScroll: true });
      window.scrollTo(0, 0);
    }
  }, [route]);
  return route;
}

function PageHeading({ page, track, plain }: { page: Page; track: boolean; plain: boolean }) {
  return (
    <>
      {track && (
        <nav className="page-path" aria-label="Breadcrumb">
          <a href="#/">Tracks</a>
          <span aria-hidden="true">/</span>
          <span>{page.title}</span>
        </nav>
      )}
      <section className={`starter-welcome ${plain ? 'page-intro' : ''}`}>
        <h1>{page.title}</h1>
        {page.description && <p className="welcome-description">{page.description}</p>}
      </section>
    </>
  );
}

const pageLayouts: Record<string, string> = {
  '/': 'home-page',
  '/create': 'reading-page',
  '/guide/setup': 'reading-page',
};

export function App() {
  const route = useRoute();
  const page = resolvePage(route);
  useEffect(() => {
    document.title = `${page.title} · The Front-End Lab`;
  }, [page.title]);
  return (
    <>
      <a
        className="skip-link"
        href="#content"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById('content')?.focus();
        }}
      >
        Skip to content
      </a>
      <header className="site-header">
        <a className="wordmark" href="#/">
          <LabMark />
          Front-End Lab
        </a>
        <LabNavigation route={route} />
      </header>
      <main
        id="content"
        className={pageLayouts[route] ?? 'gallery-page'}
        data-track={findTrack(route)?.id}
        tabIndex={-1}
      >
        <PageHeading page={page} track={Boolean(findTrack(route))} plain={route !== '/'} />
        {page.content}
      </main>
    </>
  );
}
