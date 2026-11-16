import type { ComponentType } from 'react';

export type TrackId = 'modern-web' | 'code-quality' | 'developer-experience' | 'experimental-projects';

/** Inline demos own their state; the gallery supplies no props. */
export type DemoComponent = ComponentType;

export interface DemoDefinition {
  title: string;
  track: TrackId;
  description: string;
  author: string;
  presentation?: 'standalone' | 'inline';
}
