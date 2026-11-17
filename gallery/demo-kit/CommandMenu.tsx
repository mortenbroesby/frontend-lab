import { useEffect, useState, type ComponentProps, type KeyboardEvent } from 'react';
import { ThemeControl, useTheme } from '@lab/ui/theme-control';
import { Button } from '@lab/ui/button';
import { Input } from '@lab/ui/input';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@lab/ui/dialog';
import { commandLabel, isCommandShortcut, matchesCommand } from './command-search';

export const commandMenuLabel = commandLabel(navigator.platform);

type CommandLink = { label: string; group: string; href: string };
type Command = { label: string; group: string; run: () => void };

function moveCommandFocus(event: KeyboardEvent<HTMLDivElement>) {
  if (event.nativeEvent.isComposing || !['ArrowDown', 'ArrowUp'].includes(event.key)) return;
  const targets = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('input, button'));
  event.preventDefault();
  const index = targets.indexOf(document.activeElement as HTMLElement);
  const direction = event.key === 'ArrowDown' ? 1 : -1;
  targets[(index + direction + targets.length) % targets.length]?.focus();
}

function CommandResults({ commands }: { commands: Command[] }) {
  const [query, setQuery] = useState('');
  const matches = commands.filter((command) => matchesCommand(command, query));
  return (
    <div onKeyDown={moveCommandFocus}>
      <Input
        autoFocus
        aria-label="Search commands"
        placeholder="Search demos or commands…"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onKeyDown={(event) => {
          if (!event.defaultPrevented && event.key === 'Enter' && !event.nativeEvent.isComposing) {
            event.preventDefault();
            matches[0]?.run();
          }
        }}
      />
      <div className="command-results">
        {matches.map((command, index) => (
          <div key={`${command.group}/${command.label}`}>
            {matches[index - 1]?.group !== command.group && (
              <p className="command-group">{command.group}</p>
            )}
            <Button variant="ghost" className="command-item" onClick={command.run}>
              <span>{command.label}</span>
            </Button>
          </div>
        ))}
        {!matches.length && (
          <p role="status" className="command-hint">
            No commands found.
          </p>
        )}
      </div>
      <p className="command-hint">↑ ↓ Navigate · Enter Select · Esc Close</p>
    </div>
  );
}

function MenuContents({ links, close }: { links: CommandLink[]; close: () => void }) {
  const commands = links.map(({ label, group, href }) => ({
    label,
    group,
    run: () => {
      close();
      location.assign(href);
    },
  }));
  return (
    <>
      <DialogTitle>{commandMenuLabel}</DialogTitle>
      <CommandResults commands={commands} />
      <div className="command-appearance">
        <span>Appearance</span>
        <ThemeControl />
      </div>
    </>
  );
}

export function CommandMenu({
  links = [],
  open: controlledOpen,
  onOpenChange,
  triggerClassName,
  onCloseAutoFocus,
}: {
  links?: CommandLink[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  triggerClassName?: string;
  onCloseAutoFocus?: ComponentProps<typeof DialogContent>['onCloseAutoFocus'];
}) {
  // Follow device theme changes even while the palette is closed.
  useTheme();
  const [localOpen, setLocalOpen] = useState(false);
  const open = controlledOpen ?? localOpen;
  const setOpen = onOpenChange ?? setLocalOpen;
  useEffect(() => {
    const handleKey = (event: globalThis.KeyboardEvent) => {
      if (event.defaultPrevented || !isCommandShortcut(event)) return;
      event.preventDefault();
      setOpen(!open);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, setOpen]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={triggerClassName}
          aria-label="Open command palette"
          title={`Open commands (${commandMenuLabel})`}
          aria-keyshortcuts="Meta+K Control+K"
        >
          <span aria-hidden="true">{commandMenuLabel}</span>
        </Button>
      </DialogTrigger>
      <DialogContent
        className="lab-command-menu"
        aria-describedby={undefined}
        onCloseAutoFocus={onCloseAutoFocus}
      >
        <MenuContents links={links} close={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
