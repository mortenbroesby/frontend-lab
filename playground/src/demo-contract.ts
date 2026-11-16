import type { ComponentType } from 'react';

export type TrackId = 'modern-web' | 'code-quality' | 'developer-experience' | 'experimental-projects';

/** A demo supplies its own state; the host never supplies required props. */
export interface DemoDefinition {
  title: string;
  track: TrackId;
  description: string;
  author: string;
  load: () => Promise<{ default: ComponentType }>;
}

export function discoverDemos(modules: Record<string, unknown>): (DemoDefinition & { id: string })[] {
  return Object.entries(modules).sort(([a], [b]) => a.localeCompare(b)).map(([path, value]) => {
    const id = demoId(path);
    if (!value || typeof value !== 'object') throw new Error(`${path}: export a default DemoDefinition.`);
    const demo = value as Partial<DemoDefinition>;
    validateMetadata(demo, path);
    if (!['modern-web', 'code-quality', 'developer-experience', 'experimental-projects'].includes(demo.track ?? '') || typeof demo.load !== 'function') {
      throw new Error(`${path}: provide a valid named track and a lazy load function.`);
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
