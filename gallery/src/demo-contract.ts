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
      if (
        !['modern-web', 'code-quality', 'developer-experience', 'experimental-projects'].includes(
          demo.track ?? '',
        )
      ) {
        throw new Error(`${path}: provide a valid named track.`);
      }
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
