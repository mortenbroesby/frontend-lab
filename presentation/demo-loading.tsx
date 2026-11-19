import { Button } from '@lab/ui/button';
import type { DemoStatus } from './demo-readiness';

export function DemoLoading({ status, retry }: { status: DemoStatus; retry: () => void }) {
  if (status === 'ready') return null;
  return (
    <div className="demo-loading" role="status">
      <p>{status === 'loading' ? 'Loading demo…' : 'This demo is not responding.'}</p>
      {status === 'unavailable' && (
        <Button variant="outline" onClick={retry}>
          Retry demo
        </Button>
      )}
      <p className="small">You can continue to the next slide below or on your remote.</p>
    </div>
  );
}
