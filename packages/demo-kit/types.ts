export type TrackId = 'modern-web' | 'code-quality' | 'developer-experience' | 'experimental-projects';

export interface DemoDefinition {
  title: string;
  track: TrackId;
  description: string;
  author: string;
}
