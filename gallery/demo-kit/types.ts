export const requirementLabels = {
  internet: 'Internet required',
  'secure-context': 'Localhost or trusted HTTPS',
} as const;

export type TrackId =
  'modern-web' | 'code-quality' | 'developer-experience' | 'experimental-projects';

export interface DemoDefinition {
  title: string;
  /** The first track is the default when a demo is opened directly. */
  tracks: readonly [TrackId, ...TrackId[]];
  description: string;
  author: string;
  /** Optional editing guidance, owned by the demo. Paths are relative to its folder. */
  explore?: {
    file: string;
    change: string;
    guide?: `/track/${TrackId}/${string}`;
  };
  requirements?: readonly (keyof typeof requirementLabels)[];
}
