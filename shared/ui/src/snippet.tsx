import { useState, type ComponentProps } from 'react';
import { Check, Copy } from 'lucide-react';
import { Button } from './button';
import { cn } from './utils';

type SnippetProps = Omit<ComponentProps<'div'>, 'children'> & {
  code: string;
  label?: string;
};

function Snippet({ code, label = 'Copy command', className, ...props }: SnippetProps) {
  const [message, setMessage] = useState('');
  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setMessage('Copied');
    } catch {
      setMessage('Copy unavailable. Select and copy the command above.');
    }
  }
  return (
    <div data-slot="snippet" className={cn('min-w-0', className)} {...props}>
      <div className="flex items-start gap-3 rounded-md border border-solid border-border bg-muted/40 p-3">
        <pre
          data-slot="snippet-code"
          tabIndex={0}
          aria-label="Command"
          className="m-0 min-w-0 flex-1 overflow-x-auto self-center rounded font-mono text-sm leading-6 text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <code>{code}</code>
        </pre>
        <Button variant="ghost" size="icon" aria-label={label} onClick={() => void copy()}>
          {message === 'Copied' ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
        </Button>
      </div>
      <span role="status" className="mt-1 block min-h-5 text-xs text-muted-foreground">
        {message}
      </span>
    </div>
  );
}

export { Snippet };
