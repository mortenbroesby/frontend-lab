import { Button } from '@lab/ui/button';
import { Component } from 'react';
import type { ReactNode } from 'react';

// Catches render failures, not event errors or blocking work. Not a security sandbox.
export class DemoBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <div role="alert">
        <h2>Could not open this demo.</h2>
        <p>Check the console and source, or try another demo.</p>
        <Button onClick={() => location.reload()}>Reload the lab</Button>
      </div>
    ) : (
      this.props.children
    );
  }
}
