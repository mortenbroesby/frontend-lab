import { Badge } from '@lab/ui/badge';
import { Separator } from '@lab/ui/separator';
import { TooltipProvider } from '@lab/ui/tooltip';
import { Actions } from './actions';
import { Forms } from './forms';
import { Overlays } from './overlays';
import { Navigation } from './navigation';
import { Content } from './content';
import './styles.css';

export default function UiLibrary() {
  return (
    <TooltipProvider>
      <div className="ui-showcase">
        <header className="ui-showcase-hero">
          <Badge variant="outline">Component playground</Badge>
          <h2>
            Small pieces.
            <br />
            Better interfaces.
          </h2>
          <p>
            Real components, real states. Explore the shared UI library, then use the same pieces in
            your own demo.
          </p>
          <nav aria-label="Component sections" className="ui-showcase-links">
            <a href="#ui-actions">Actions</a>
            <a href="#ui-forms">Forms</a>
            <a href="#ui-overlays">Overlays</a>
            <a href="#ui-navigation">Navigation</a>
            <a href="#ui-content">Content</a>
          </nav>
        </header>
        <Separator />
        <Actions />
        <Forms />
        <Overlays />
        <Navigation />
        <Content />
        <p className="ui-showcase-note">
          Everything happens in this page. Refresh to reset your experiments.
        </p>
      </div>
    </TooltipProvider>
  );
}
