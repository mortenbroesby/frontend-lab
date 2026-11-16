import { useState } from 'react';
import { Button } from '@lab/ui/button';
import { Input } from '@lab/ui/input';
import { Label } from '@lab/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@lab/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@lab/ui/alert-dialog';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@lab/ui/sheet';
import { Popover, PopoverContent, PopoverTrigger } from '@lab/ui/popover';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@lab/ui/dropdown-menu';

function RenameDialog({ onRename }: { onRename: (name: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Open dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Name your experiment</DialogTitle>
          <DialogDescription>
            Give this playground a temporary name. Nothing is sent or stored.
          </DialogDescription>
        </DialogHeader>
        <form
          className="ui-showcase-fields"
          onSubmit={(event) => {
            event.preventDefault();
            const name = new FormData(event.currentTarget).get('experiment');
            onRename(String(name));
            setOpen(false);
          }}
        >
          <div className="ui-showcase-field">
            <Label htmlFor="experiment-name">Name</Label>
            <Input
              id="experiment-name"
              name="experiment"
              defaultValue="Untitled experiment"
              required
              maxLength={80}
            />
          </div>
          <DialogFooter>
            <Button type="submit">Use name</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function Overlays() {
  const [message, setMessage] = useState('Open an overlay to explore focus and dismissal.');
  const [name, setName] = useState('Untitled experiment');
  return (
    <section id="ui-overlays" className="ui-showcase-section" aria-labelledby="overlays-title">
      <div className="ui-showcase-section-heading">
        <span>03 / Overlays</span>
        <h3 id="overlays-title">A little room to focus.</h3>
        <p>Use Tab to move, Escape to close. Focus returns to the trigger.</p>
      </div>
      <div className="ui-showcase-panel">
        <div className="ui-showcase-row">
          <RenameDialog
            onRename={(value) => {
              setName(value);
              setMessage(`Renamed to “${value}”.`);
            }}
          />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">Open sheet</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Keep the page in view</SheetTitle>
                <SheetDescription>A sheet gives supporting content its own space.</SheetDescription>
              </SheetHeader>
              <div className="p-4">
                <p>
                  Current experiment: <strong>{name}</strong>
                </p>
                <p>Try Tab and Shift+Tab. The keyboard stays in the open sheet.</p>
              </div>
            </SheetContent>
          </Sheet>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">Open popover</Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className="ui-showcase-field">
                <Label htmlFor="popover-name">Quick rename</Label>
                <Input
                  id="popover-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  maxLength={80}
                />
                <p className="text-sm text-muted-foreground">Changes apply as you type.</p>
              </div>
            </PopoverContent>
          </Popover>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">More actions ↓</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Experiment</DropdownMenuLabel>
              <DropdownMenuItem
                onSelect={() => {
                  setName(`${name.slice(0, 70)} (copy)`);
                  setMessage('Copied the experiment name.');
                }}
              >
                Duplicate name
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => {
                  setName('Untitled experiment');
                  setMessage('Name reset.');
                }}
              >
                Reset name
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled>Publish (unavailable)</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Reset experiment</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reset the experiment name?</AlertDialogTitle>
                <AlertDialogDescription>
                  This replaces your local name with “Untitled experiment”. The rest of the
                  playground stays as it is.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Keep name</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    setName('Untitled experiment');
                    setMessage('Experiment name reset.');
                  }}
                >
                  Reset name
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <p>
          Current experiment: <strong>{name || 'Unnamed'}</strong>
        </p>
        <p role="status" className="ui-showcase-note">
          {message}
        </p>
      </div>
    </section>
  );
}
