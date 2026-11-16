import type { DemoDefinition } from '@lab/demo-kit/types';
export type { DemoDefinition, TrackId } from '@lab/demo-kit/types';

export function discoverDemos(modules: Record<string, unknown>): (DemoDefinition & { id: string })[] {
  return Object.entries(modules).sort(([a], [b]) => a.localeCompare(b)).map(([path, value]) => {
    const id = demoId(path);
    if (!value || typeof value !== 'object') throw new Error(`${path}: export a default DemoDefinition.`);
    const demo = value as Partial<DemoDefinition>;
    validateMetadata(demo, path);
    if (!['modern-web', 'code-quality', 'developer-experience', 'experimental-projects'].includes(demo.track ?? '') || !validPresentation(demo)) {
      throw new Error(`${path}: provide a valid track and presentation; inline demos require a lazy load function.`);
    }
    return { ...(demo as DemoDefinition), id };
  });
}

function validateMetadata(demo: Partial<DemoDefinition>, path: string) {
  for (const key of ['title', 'description', 'author'] as const) {
    const value = demo[key];
    if (typeof value !== 'string' || !value.trim() || value.length > 240) {
      throw new Error(`${path}: ${key} must contain 1–240 characters.`);
    }
  }
}

function demoId(path: string): string {
  const id = /^\.\/demos\/([a-z][a-z0-9]*(?:-[a-z0-9]+)*)\/demo\.config\.ts$/.exec(path)?.[1];
  if (!id || id.length > 60 || /^(template|con|prn|aux|nul|com[0-9]|lpt[0-9])$/.test(id)) {
    throw new Error(`Invalid demo folder: ${path}. Use a unique lowercase kebab-case ID (max 60 characters).`);
  }
  return id;
}

function validPresentation(demo: Partial<DemoDefinition>): boolean {
  if (demo.presentation === 'standalone') return demo.load === undefined || typeof demo.load === 'function';
  return (demo.presentation === undefined || demo.presentation === 'inline') && typeof demo.load === 'function';
}
