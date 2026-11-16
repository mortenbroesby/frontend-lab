import { DemoGallery } from './DemoGallery';
import { GuideView } from './GuideView';
import { tracks } from './tracks';

export function TrackGuide({ track, route }: { track: (typeof tracks)[number]; route: string }) {
  const trackPage = route.slice(`/track/${track.id}`.length + 1) || 'ideas';
  const section = ['ideas', 'examples'].includes(trackPage) ? trackPage : 'guides';
  return (
    <>
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
        <a className="track-build-link" href="#/create">
          Create a demo <span aria-hidden="true">↗</span>
        </a>
      </nav>
      {trackPage === 'examples' ? (
        <DemoGallery track={track.id} />
      ) : trackPage === 'guides' ? (
        <section className="guide" aria-labelledby="guides-heading">
          <h2 id="guides-heading">Guides</h2>
          <p>Work through a real example. Learn what to look for and what to try next.</p>
          <ul>
            {track.guides.map((guide) => (
              <li key={guide.slug}>
                <h3>
                  <a href={`#/track/${track.id}/${guide.slug}`}>{guide.title}</a>
                </h3>
                <p>{guide.description}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <GuideView
          document={`tracks/${track.id}/${trackPage}`}
          layout={trackPage === 'ideas' ? 'ideas' : 'document'}
        />
      )}
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
