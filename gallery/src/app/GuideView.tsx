import { Component, Suspense, type ReactNode } from 'react';

import Guide from './Guide';
import { ideas } from './ideas';

class GuideBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    return this.state.failed
      ? <p role="alert">This guide could not load. <button onClick={() => location.reload()}>Reload</button> or choose another page.</p>
      : this.props.children;
  }
}

export function GuideView({ document }: { document: string }) {
  return <GuideBoundary key={document}><Suspense fallback={<p role="status">Loading guide…</p>}><Guide document={document} /></Suspense></GuideBoundary>;
}

export const guides: Record<string, { title: string; document: string }> = {
  ...Object.fromEntries(ideas.flatMap(idea => [
    [`/idea/${idea.id}`, { title: idea.title, document: `ideas/${idea.id}` }],
    [`/idea/${idea.id}/get-started`, { title: idea.title, document: `ideas/${idea.id}-start` }],
  ])),
  '/guide/setup': { title: 'Run the Lab locally', document: 'setup' },
};
