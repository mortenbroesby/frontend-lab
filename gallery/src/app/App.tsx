import { useEffect, useRef, useState, type ReactNode } from 'react';
import { LabMark } from '@lab/demo-kit/mark';
import { DemoGallery } from './DemoGallery';
import { GuideGallery } from './GuideGallery';
import { GuideView } from './GuideView';
import { Home } from './Home';
import { ShowcaseGallery } from './ShowcaseGallery';
import { LabNavigation } from './LabNavigation';
import { TrackGuide, findTrack } from './TrackPage';

interface Page {
  title: string;
  description?: string;
  content: ReactNode;
}

const pages: Record<string, Page> = {
  '/': {
    title: 'Build one small experiment.',
    description: 'Pick a track, then use a suggested idea, remix a demo or bring your own idea.',
    content: <Home />,
  },
  '/demos': {
    title: 'Try a demo',
    description: 'Every demo, across all four tracks.',
    content: <DemoGallery />,
  },
  '/showcases': {
    title: 'Showcases',
    description: 'Larger interactive pieces. Explore what a few web technologies can become.',
    content: <ShowcaseGallery />,
  },
  '/guides': {
    title: 'Follow a guide',
    description: 'Investigate a question here, then apply the lesson in your own project.',
    content: <GuideGallery />,
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
