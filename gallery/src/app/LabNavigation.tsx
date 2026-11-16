import { useRef, useState } from 'react';
import { CommandMenu, commandMenuLabel } from '@lab/demo-kit/command-menu';
import { Button } from '@lab/ui/button';
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from '@lab/ui/dialog';
import { LabMark } from '@lab/demo-kit/mark';
import { tracks } from './tracks';
import { demos } from '../demo-registry';

export function LabNavigation({ route }: { route: string }) {
  const [commandOpen, setCommandOpen] = useState(false);
  const mobileTrigger = useRef<HTMLButtonElement>(null);
  const links = [
    ['/', 'Tracks'],
    ['/demos', 'Demos'],
    ['/guides', 'Guides'],
    ['/create', 'Create a demo'],
    ['/guide/setup', 'Local setup'],
  ];
  return (
    <nav aria-label="Lab">
      <CommandMenu
        open={commandOpen}
        onOpenChange={setCommandOpen}
        triggerClassName="command-desktop-trigger"
        onCloseAutoFocus={(event) => {
          if (mobileTrigger.current?.getClientRects().length) {
            event.preventDefault();
            mobileTrigger.current.focus();
          }
        }}
        links={[
          { label: 'All demos', group: 'Navigation', href: '#/demos', shortcut: 'G' },
          { label: 'All guides', group: 'Navigation', href: '#/guides' },
          { label: 'Create a demo', group: 'Navigation', href: '#/create' },
          ...tracks.flatMap((track) =>
            track.guides.map((guide) => ({
              label: guide.title,
              group: 'Guides',
              href: `#/track/${track.id}/${guide.slug}`,
            })),
          ),
          ...demos.map((demo) => ({ label: demo.title, group: 'Demos', href: demo.href })),
        ]}
      />
      <div className="desktop-nav">
        {links.map(([path, label]) => (
          <a
            className="site-nav-link"
            key={path}
            href={`#${path}`}
            aria-current={route === path ? 'page' : undefined}
          >
            {label}
          </a>
        ))}
      </div>
      <Dialog key={route}>
        <DialogTrigger asChild>
          <Button
            ref={mobileTrigger}
            className="mobile-nav-toggle"
            variant="ghost"
            size="lg"
            aria-label="Open navigation menu"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            Menu
          </Button>
        </DialogTrigger>
        <DialogContent
          className="mobile-navigation translate-x-0 translate-y-0"
          onCloseAutoFocus={(event) => {
            if (commandOpen) event.preventDefault();
          }}
          showCloseButton={false}
          aria-describedby={undefined}
        >
          <div className="mobile-navigation-header">
            <DialogTitle className="wordmark">
              <LabMark />
              Front-End Lab
            </DialogTitle>
            <DialogClose asChild>
              <Button variant="ghost" size="lg" aria-label="Close navigation menu">
                Close <span aria-hidden="true">×</span>
              </Button>
            </DialogClose>
          </div>
          <nav aria-label="Mobile navigation" className="mobile-navigation-links">
            {links.map(([path, label]) => (
              <DialogClose key={path} asChild>
                <a href={`#${path}`} aria-current={route === path ? 'page' : undefined}>
                  <span>{label}</span>
                  <span className="mobile-navigation-arrow" aria-hidden="true">
                    ↗
                  </span>
                </a>
              </DialogClose>
            ))}
          </nav>
          <DialogClose asChild>
            <Button
              variant="outline"
              onClick={() => setCommandOpen(true)}
              aria-label="Open command palette"
            >
              {commandMenuLabel}
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </nav>
  );
}
