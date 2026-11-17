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
          <h2>Explore the components</h2>
          <p>
            Try the controls below. Every example uses the same components available in your demo.
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
        <section
          id="ui-foundations"
          className="ui-showcase-section"
          aria-labelledby="foundations-title"
        >
          <div className="ui-showcase-section-heading">
            <span>00 / Foundations</span>
            <h3 id="foundations-title">Foundations</h3>
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
