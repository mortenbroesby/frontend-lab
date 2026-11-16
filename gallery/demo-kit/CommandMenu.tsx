import { DemoInspector } from './DemoInspector';
import type { DemoInspection } from './inspection';
import { useEffect, useState, type ComponentProps, type KeyboardEvent } from 'react';
import { ThemeControl, useTheme } from '@lab/ui/theme-control';
import { Button } from '@lab/ui/button';
import { Input } from '@lab/ui/input';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@lab/ui/dialog';
import { DebugInfo } from './DebugInfo';
import { developerShortcut, isCommandShortcut, matchesCommand } from './command-search';

type View = 'commands' | 'debug' | 'inspect';

type CommandLink = { label: string; group: string; href: string; shortcut?: string };
type Command = { label: string; group: string; run: () => void; shortcut?: string };

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
            <Button variant="ghost" className="command-item" onClick={command.run}>
              <span>{command.label}</span>
              {command.shortcut && <kbd className="command-key">Alt ⇧ {command.shortcut}</kbd>}
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
  view,
  setView,
  inspection,
}: {
  links: CommandLink[];
  close: () => void;
  view: View;
  setView: (view: View) => void;
  inspection?: DemoInspection;
}) {
  const details = { debug: <DebugInfo />, inspect: <DemoInspector inspection={inspection} /> };
  const commands: Command[] = [
    ...(inspection
      ? [{ label: 'Inspect this demo', group: 'This demo', run: () => setView('inspect') }]
      : []),
    ...links.map(({ label, group, href, shortcut }) => ({
      label,
      group,
      shortcut,
      run: () => {
        close();
        location.assign(href);
      },
    })),
    { label: 'Debug information', group: 'Developer', shortcut: 'D', run: () => setView('debug') },
    { label: 'Reload page', group: 'Developer', run: () => location.reload() },
  ];
  return (
    <>
      <DialogTitle>
        {{ commands: '⌘K', debug: 'Debug information', inspect: 'Inspect this demo' }[view]}
      </DialogTitle>
      {view !== 'commands' ? (
        <>
          <Button autoFocus variant="outline" onClick={() => setView('commands')}>
            ← Back to commands
          </Button>
          {details[view]}
        </>
      ) : (
        <>
          <CommandResults commands={commands} />
          <div className="command-appearance">
            <span>Appearance</span>
            <ThemeControl />
          </div>
        </>
      )}
    </>
  );
}

function usePaletteShortcuts(
  open: boolean,
  setOpen: (open: boolean) => void,
  setView: (view: View) => void,
  gallery?: string,
) {
  useEffect(() => {
    const actions = new Map<string | undefined, () => void>([
      [
        'toggle',
        () => {
          setView('commands');
          setOpen(!open);
        },
      ],
      [
        'debug',
        () => {
          setView('debug');
          setOpen(true);
        },
      ],
    ]);
    if (gallery)
      actions.set('gallery', () => {
        setOpen(false);
        location.assign(gallery);
      });
    const handleKey = (event: globalThis.KeyboardEvent) => {
      const run = actions.get(isCommandShortcut(event) ? 'toggle' : developerShortcut(event));
      if (event.defaultPrevented || !run) return;
      event.preventDefault();
      run();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, setOpen, setView, gallery]);
}

export function CommandMenu({
  links = [],
  inspection,
  open: controlledOpen,
  onOpenChange,
  triggerClassName,
  onCloseAutoFocus,
}: {
  links?: CommandLink[];
  inspection?: DemoInspection;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  triggerClassName?: string;
  onCloseAutoFocus?: ComponentProps<typeof DialogContent>['onCloseAutoFocus'];
}) {
  // Follow device theme changes even while the palette is closed.
  useTheme();
  const [view, setView] = useState<View>('commands');
  const [localOpen, setLocalOpen] = useState(false);
  const open = controlledOpen ?? localOpen;
  const setOpen = onOpenChange ?? setLocalOpen;
  const gallery = links.find((link) => link.shortcut === 'G')?.href;
  usePaletteShortcuts(open, setOpen, setView, gallery);
  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setView('commands');
        setOpen(value);
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={triggerClassName}
          aria-label="Open command palette"
          title="Command K (Ctrl K on Windows and Linux)"
          aria-keyshortcuts="Meta+K Control+K"
        >
          <span aria-hidden="true">⌘K</span>
        </Button>
      </DialogTrigger>
      <DialogContent
        className="lab-command-menu"
        aria-describedby={undefined}
        onCloseAutoFocus={onCloseAutoFocus}
      >
        <MenuContents
          inspection={inspection}
          links={links}
          close={() => setOpen(false)}
          view={view}
          setView={setView}
        />
      </DialogContent>
    </Dialog>
  );
}
