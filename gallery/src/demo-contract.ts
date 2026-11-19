import { requirementLabels } from '@lab/demo-kit/types';
import type { DemoDefinition } from '@lab/demo-kit/types';
export type { DemoDefinition, TrackId } from '@lab/demo-kit/types';

export function discoverDemos(modules: Record<string, unknown>) {
  return Object.entries(modules)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([path, value]) => {
      const id = demoId(path);
      if (!value || typeof value !== 'object')
        throw new Error(`${path}: export a default DemoDefinition.`);
      const demo = value as Partial<DemoDefinition>;
      validateMetadata(demo, path);
      validateTracks(demo.tracks, path);
      validateExplore(demo.explore, path);
      return { ...(demo as DemoDefinition), id };
    });
}

function validateMetadata(demo: Partial<DemoDefinition>, path: string) {
  if (
    demo.requirements !== undefined &&
    (!Array.isArray(demo.requirements) ||
      demo.requirements.some((value) => !Object.hasOwn(requirementLabels, value)))
  ) {
    throw new Error(`${path}: requirements must be an array of known requirement IDs.`);
  }
  for (const key of ['title', 'description', 'author'] as const) {
    const value = demo[key];
    if (typeof value !== 'string' || !value.trim() || value.length > 240) {
      throw new Error(`${path}: ${key} must contain 1–240 characters.`);
    }
  }
}

function demoId(path: string): string {
  const pattern = /^\.\.\/\.\.\/demos\/([a-z][a-z0-9]*(?:-[a-z0-9]+)*)\/demo\.config\.ts$/;
  const id = pattern.exec(path)?.[1];
  if (!id || id.length > 60 || /^(template|con|prn|aux|nul|com[0-9]|lpt[0-9])$/.test(id)) {
    throw new Error(
      `Invalid demo folder: ${path}. Use a unique lowercase kebab-case ID (max 60 characters).`,
    );
  }
  return id;
}

function validateTracks(tracks: unknown, path: string) {
  const known = ['modern-web', 'code-quality', 'developer-experience', 'experimental-projects'];
  if (!Array.isArray(tracks) || !tracks.length) {
    throw new Error(`${path}: tracks must be a nonempty array.`);
  }
  if (tracks.some((track) => !known.includes(track)) || new Set(tracks).size !== tracks.length) {
    throw new Error(`${path}: tracks must contain unique, valid named tracks.`);
  }
}

function validateExplore(explore: DemoDefinition['explore'], path: string) {
  if (explore === undefined) return;
  if (!explore || typeof explore !== 'object')
    throw new Error(`${path}: explore must be an object.`);
  validateExplorePaths(explore, path);
  validateFirstChange(explore.change, path);
}
function matches(value: unknown, pattern: RegExp) {
  return typeof value === 'string' && pattern.test(value);
}
function validateExplorePaths(explore: NonNullable<DemoDefinition['explore']>, path: string) {
  if (!matches(explore.file, /^[a-zA-Z0-9_-]+(?:\/[a-zA-Z0-9_-]+)*\.[a-zA-Z0-9]+$/))
    throw new Error(`${path}: explore.file must name a file inside the demo.`);
  if (explore.guide !== undefined && !matches(explore.guide, /^\/track\/[a-z-]+\/[a-z-]+$/))
    throw new Error(`${path}: explore.guide must be a track guide route.`);
}
function validateFirstChange(change: unknown, path: string) {
  if (typeof change !== 'string' || !change.trim() || change.length > 400)
    throw new Error(`${path}: explore.change must contain 1–400 characters.`);
}
