import { Component, Suspense, type ReactNode } from 'react';

import Guide from './Guide';

class GuideBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <div className="guide" role="alert">
        <h2>This guide could not load</h2>
        <p>Check your connection, then reload to try again.</p>
        <button onClick={() => location.reload()}>Reload page</button>{' '}
        <a href="#/">Return to tracks</a>
      </div>
    ) : (
      this.props.children
    );
  }
}

export function GuideView({ document }: { document: string }) {
  return (
    <GuideBoundary key={document}>
      <Suspense
        key={document}
        fallback={
          <div className="guide guide-loading" role="status" aria-label="Loading guide">
            <div className="guide-skeleton" aria-hidden="true">
              <span className="skeleton-heading" />
              <span />
              <span />
              <span className="skeleton-short" />
              <span className="skeleton-heading" />
              <span />
              <span className="skeleton-short" />
            </div>
          </div>
        }
      >
        <Guide document={document} />
      </Suspense>
    </GuideBoundary>
  );
}

export const guides: Record<string, { title: string; document: string }> = {
  '/guide/setup': { title: 'Run the Lab locally', document: 'setup' },
};
