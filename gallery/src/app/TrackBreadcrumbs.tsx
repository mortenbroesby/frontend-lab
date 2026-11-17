import { Fragment } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@lab/ui/breadcrumb';
import { tracks } from './tracks';

type Track = (typeof tracks)[number];

function trackTrail(track: Track, route: string) {
  const root = `/track/${track.id}`;
  const trail = [
    { title: 'Tracks', href: '#/' },
    { title: track.title, href: `#${root}` },
  ];
  if (route === root) return trail;
  if (route === `${root}/examples`) {
    trail.push({ title: 'Demos', href: `#${root}/examples` });
    return trail;
  }
  trail.push({ title: 'Guides', href: `#${root}/guides` });
  const guide = track.guides.find((item) => route === `${root}/${item.slug}`);
  if (guide) trail.push({ title: guide.title, href: `#${route}` });
  return trail;
}

export function TrackBreadcrumbs({ track, route }: { track: Track; route: string }) {
  const trail = trackTrail(track, route);
  return (
    <Breadcrumb className="page-path" aria-label="Breadcrumb">
      <BreadcrumbList>
        {trail.map((item, index) => (
          <Fragment key={item.href}>
            {index > 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem className="min-w-0 max-w-full">
              {index === trail.length - 1 ? (
                <BreadcrumbPage>{item.title}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink
                  className="inline-flex min-h-11 items-center rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                  href={item.href}
                >
                  {item.title}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
