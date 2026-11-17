import { Badge } from '@lab/ui/badge';
import { Separator } from '@lab/ui/separator';
import { TooltipProvider } from '@lab/ui/tooltip';
import { Actions } from './actions';
import { Forms } from './forms';
import { Overlays } from './overlays';
import { Navigation } from './navigation';
import { Content } from './content';
import { DeveloperPatterns } from './developer-patterns';
import './styles.css';

export default function UiLibrary() {
  return (
    <TooltipProvider>
      <div className="ui-showcase">
        <header className="ui-showcase-hero">
          <Badge variant="outline">Component playground</Badge>
          <h2>
            Shared components.
            <br />
            Working examples.
          </h2>
          <p>
            Real components, real states. Explore the shared UI library, then use the same pieces in
            your own demo.
          </p>
          <nav aria-label="Component sections" className="ui-showcase-links">
            <a href="#ui-foundations">Foundations</a>
            <a href="#ui-actions">Actions</a>
            <a href="#ui-forms">Forms</a>
            <a href="#ui-overlays">Overlays</a>
            <a href="#ui-navigation">Navigation</a>
            <a href="#ui-content">Content</a>
            <a href="#ui-developer">Developer patterns</a>
          </nav>
        </header>
        <Separator />
        <section id="ui-foundations" className="ui-showcase-section">
          <div className="ui-showcase-heading">
            <span>00 Foundations</span>
            <h3>A shared visual language.</h3>
            <p>
              Neutral surfaces, readable type and clear focus. These tokens follow your light or
              dark theme.
            </p>
          </div>
          <div className="ui-showcase-panel">
            <div className="ui-showcase-surfaces">
              <div style={{ background: 'var(--lab-paper)' }}>
                <strong>Canvas</strong>
                <code>--lab-paper</code>
              </div>
              <div style={{ background: 'var(--lab-surface)' }}>
                <strong>Surface</strong>
                <code>--lab-surface</code>
              </div>
              <div style={{ background: 'var(--lab-hover)' }}>
                <strong>Hover</strong>
                <code>--lab-hover</code>
              </div>
            </div>
            <div className="ui-showcase-type">
              <h4>Clear hierarchy</h4>
              <p>Body text gives an interface context.</p>
              <small>Secondary text supports the next decision.</small>
              <code>const idea = 'start small';</code>
            </div>
            <p className="ui-showcase-note">
              Keep cards flat. Reserve shadows for floating menus and dialogs. Use colour to
              communicate state.
            </p>
          </div>
        </section>
        <Actions />
        <Forms />
        <Overlays />
        <Navigation />
        <Content />
        <DeveloperPatterns />
        <p className="ui-showcase-note">
          Everything happens in this page. Refresh to reset your experiments.
        </p>
      </div>
    </TooltipProvider>
  );
}
