export const requirementLabels = {
  internet: 'Internet required',
  'secure-context': 'Localhost or trusted HTTPS',
} as const;

export type TrackId =
  'modern-web' | 'code-quality' | 'developer-experience' | 'experimental-projects';

export interface DemoDefinition {
  title: string;
  track: TrackId;
  description: string;
  author: string;
  requirements?: readonly (keyof typeof requirementLabels)[];
}
