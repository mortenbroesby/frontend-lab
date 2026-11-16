import type { ComponentType } from 'react';

export type TrackId = 'modern-web' | 'code-quality' | 'developer-experience' | 'experimental-projects';

/** A demo supplies its own state; the host never supplies required props. */
interface DemoMetadata {
  title: string;
  track: TrackId;
  description: string;
  author: string;
}

type DemoLoader = () => Promise<{ default: ComponentType }>;
export type DemoDefinition = DemoMetadata & (
  | { presentation: 'standalone'; load?: DemoLoader }
  | { presentation?: 'inline'; load: DemoLoader }
);
