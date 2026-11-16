import { Button } from '@lab/ui/button';
import { DemoGallery } from './DemoGallery';
import { GuideList } from './GuideGallery';
import { GuideView } from './GuideView';
import { tracks } from './tracks';

export function TrackGuide({ track, route }: { track: (typeof tracks)[number]; route: string }) {
  const trackPage = route.slice(`/track/${track.id}`.length + 1) || 'ideas';
  const section = ['ideas', 'examples'].includes(trackPage) ? trackPage : 'guides';
  return (
    <>
      {trackPage === 'ideas' && (
        <section className="mb-8" aria-labelledby="starting-point-heading">
          <h2 id="starting-point-heading">Choose your starting point</h2>
          <p>
            Use an idea below, adapt an existing demo or explore your own question within this
            track. Choose one small experiment; the ideas are not a checklist. Guides are here to
            help when you need them.
          </p>
          <Button asChild className="mt-4">
            <a href="#/create">Start your experiment →</a>
          </Button>
        </section>
      )}
      <TrackNavigation track={track} page={trackPage} section={section} />
      <TrackContent track={track} page={trackPage} />
    </>
  );
}

export function findTrack(route: string) {
  return tracks.find((t) =>
    [
      `/track/${t.id}`,
      ...['examples', 'guides', ...t.guides.map((guide) => guide.slug)].map(
        (page) => `/track/${t.id}/${page}`,
      ),
    ].includes(route),
  );
}

function TrackContent({ track, page }: { track: (typeof tracks)[number]; page: string }) {
  return page === 'examples' ? (
    <DemoGallery track={track.id} />
  ) : page === 'guides' ? (
    <section className="guide" aria-labelledby="guides-heading">
      <h2 id="guides-heading">Guides</h2>
      <p>Work through a real example. Learn what to look for and what to try next.</p>
      <GuideList track={track} />
    </section>
  ) : (
    <GuideView
      document={`tracks/${track.id}/${page}`}
      layout={page === 'ideas' ? 'ideas' : 'document'}
    />
  );
}

function TrackNavigation({
  track,
  page,
  section,
}: {
  track: (typeof tracks)[number];
  page: string;
  section: string;
}) {
  return (
    <nav className="guide-nav" aria-label="Track guide">
      {[
        ['ideas', 'Ideas'],
        ['examples', 'Demos'],
        ['guides', 'Guides'],
      ].map(([page, label]) => (
        <a
          key={page}
          aria-current={section === page ? 'page' : undefined}
          href={`#/track/${track.id}${page === 'ideas' ? '' : '/' + page}`}
        >
          {label}
        </a>
      ))}
      {page !== 'ideas' && (
        <a className="track-build-link" href="#/create">
          Start your experiment <span aria-hidden="true">↗</span>
        </a>
      )}
    </nav>
  );
}
