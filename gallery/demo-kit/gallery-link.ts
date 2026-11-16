/** Independent deployments may opt into links back to a hosted gallery. */
export function galleryHref(route: string): string | undefined {
  const base = import.meta.env.LAB_STANDALONE ? import.meta.env.VITE_GALLERY_URL : import.meta.env.BASE_URL;
  return base ? `${base.replace(/\/$/, '')}/#${route}` : undefined;
}
