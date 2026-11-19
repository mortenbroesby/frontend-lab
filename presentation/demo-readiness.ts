export type DemoStatus = 'loading' | 'ready' | 'unavailable';
export function isDemoStatus(value: unknown): value is DemoStatus {
  return ['loading', 'ready', 'unavailable'].includes(value as string);
}

/** Document load is not app readiness: wait for the demo's validated handshake. */
export function createDemoReadiness(report: (status: DemoStatus) => void) {
  let status: DemoStatus = 'loading';
  let disposed = false;
  report(status);
  const deadline = setTimeout(() => change('unavailable'), 8000);
  function change(next: DemoStatus) {
    if (disposed || status === next) return;
    status = next;
    clearTimeout(deadline);
    report(status);
  }
  return {
    get status() {
      return status;
    },
    ready: () => change('ready'),
    dispose() {
      disposed = true;
      clearTimeout(deadline);
    },
  };
}
