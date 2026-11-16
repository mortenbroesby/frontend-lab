import { Component } from 'react';
import type { ReactNode } from 'react';

// React render failures stay inside the demo. This is not a security sandbox:
// event-handler errors and blocking main-thread work still need local handling.
export class DemoBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    return this.state.failed
      ? <div role="alert"><h2>This experiment could not open.</h2><p>Check your browser console and source. You can still choose another track or demo.</p><button onClick={() => location.reload()}>Reload the lab</button></div>
      : this.props.children;
  }
}
