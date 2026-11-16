import { Component, Suspense, type ReactNode } from 'react';

import Guide from './Guide';
import { Button } from '@lab/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@lab/ui/alert';
import { Skeleton } from '@lab/ui/skeleton';

class GuideBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <div className="guide">
        <Alert>
          <AlertTitle>This guide could not load</AlertTitle>
          <AlertDescription>
            <p>Check your connection, then reload to try again.</p>
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => location.reload()}>Reload page</Button>
              <Button variant="outline" asChild>
                <a href="#/">Return to tracks</a>
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    ) : (
      this.props.children
    );
  }
}

export function GuideView({
  document,
  layout = 'document',
}: {
  document: string;
  layout?: 'ideas' | 'document';
}) {
  return (
    <GuideBoundary key={document}>
      <Suspense
        key={document}
        fallback={
          <div className="guide guide-loading" role="status" aria-label="Loading guide">
            <div className="guide-skeleton" aria-hidden="true">
              <Skeleton className="my-6 h-6 w-1/2" />
              <Skeleton className="my-4 h-3.5 w-full" />
              <Skeleton className="my-4 h-3.5 w-full" />
              <Skeleton className="my-4 h-3.5 w-3/4" />
              <Skeleton className="my-6 h-6 w-1/2" />
              <Skeleton className="my-4 h-3.5 w-full" />
              <Skeleton className="my-4 h-3.5 w-3/4" />
            </div>
          </div>
        }
      >
        <Guide document={document} layout={layout} />
      </Suspense>
    </GuideBoundary>
  );
}
