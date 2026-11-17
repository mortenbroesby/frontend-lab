import type { DemoDefinition } from './types';

/** Independent deployments may opt into links back to a hosted gallery. */
export function galleryHref(route: string): string | undefined {
  const base = import.meta.env.LAB_STANDALONE
    ? import.meta.env.VITE_GALLERY_URL
    : import.meta.env.BASE_URL;
  return base ? `${base.replace(/\/$/, '')}/#${route}` : undefined;
}

/** Only declared tracks can become return destinations. */
export function demoTrack(demo: DemoDefinition, search: string) {
  const requested = new URLSearchParams(search).get('track');
  return demo.tracks.find((id) => id === requested) ?? demo.tracks[0];
}
