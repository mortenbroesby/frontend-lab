import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@lab/ui/accordion';
import { DemoGallery } from './DemoGallery';
import { GuideView } from './GuideView';
import { tracks } from './tracks';

export function TrackGuide({ track, route }: { track: (typeof tracks)[number]; route: string }) {
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
      ...[
        'examples',
        ...(t.id === 'modern-web' ? ['devices'] : []),
        ...(t.id === 'code-quality' ? ['fallow'] : []),
      ].map((page) => `/track/${t.id}/${page}`),
    ].includes(route),
  );
}
