import { useEffect, useState, type KeyboardEvent } from 'react';
import { useTheme } from '@lab/ui/theme-control';
import { Button } from '@lab/ui/button';
import { Input } from '@lab/ui/input';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@lab/ui/dialog';
import { DebugInfo } from './DebugInfo';
import { isCommandShortcut, matchesCommand } from './command-search';

type CommandLink = { label: string; group: string; href: string };
type Command = { label: string; group: string; run: () => void; selected?: boolean };

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
        placeholder="Search demos, tracks, appearance…"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && !event.nativeEvent.isComposing) {
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
            <Button
              variant="ghost"
              className="command-item"
              onClick={command.run}
              aria-pressed={command.selected}
            >
              {command.label}
              {command.selected && <span aria-hidden="true">✓</span>}
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

function MenuContents({
  links,
  close,
  appearance,
}: {
  links: CommandLink[];
  close: () => void;
  appearance: ReturnType<typeof useTheme>;
}) {
  const [debug, setDebug] = useState(false);
  const commands: Command[] = [
    ...(['light', 'dark', 'system'] as const).map((theme) => ({
      label: theme === 'system' ? 'Use system theme' : `Use ${theme} mode`,
      group: 'Appearance',
      selected: appearance.theme === theme,
      run: () => {
        appearance.setTheme(theme);
        close();
      },
    })),
    ...links.map(({ label, group, href }) => ({
      label,
      group,
      run: () => {
        close();
        location.assign(href);
      },
    })),
    { label: 'Show debug information', group: 'Developer', run: () => setDebug(true) },
    { label: 'Reload page', group: 'Developer', run: () => location.reload() },
  ];
  return (
    <>
      <DialogTitle>{debug ? 'Debug information' : 'Commands'}</DialogTitle>
      {debug ? (
        <>
          <Button autoFocus variant="outline" onClick={() => setDebug(false)}>
            ← Back to commands
          </Button>
          <DebugInfo />
        </>
      ) : (
        <CommandResults commands={commands} />
      )}
    </>
  );
}

export function CommandMenu({ links = [] }: { links?: CommandLink[] }) {
  const [open, setOpen] = useState(false);
  const appearance = useTheme();
  useEffect(() => {
    const toggle = (event: globalThis.KeyboardEvent) => {
      if (!event.defaultPrevented && isCommandShortcut(event)) {
        event.preventDefault();
        setOpen((value) => !value);
      }
    };
    window.addEventListener('keydown', toggle);
    return () => window.removeEventListener('keydown', toggle);
  }, []);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          aria-label="Open command palette"
          aria-keyshortcuts="Meta+K Control+K"
        >
          Commands <kbd className="command-shortcut">⌘ / Ctrl K</kbd>
        </Button>
      </DialogTrigger>
      <DialogContent className="lab-command-menu" aria-describedby={undefined}>
        <MenuContents appearance={appearance} links={links} close={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
