import type { ComponentProps } from 'react';
import { Check, Copy, FileCode } from 'lucide-react';
import { Button } from './button';
import { useCopyText } from './use-copy-text';
import { cn } from './utils';

type CodePreviewProps = Omit<ComponentProps<'figure'>, 'children'> & {
  code: string;
  filename: string;
  language?: string;
};

function CodePreview({ code, filename, language, className, ...props }: CodePreviewProps) {
  const { message, copy } = useCopyText(code);
  return (
    <figure
      data-slot="code-preview"
      className={cn(
        'm-0 min-w-0 overflow-hidden rounded-lg border border-solid border-border bg-background text-foreground',
        className,
      )}
      {...props}
    >
      <figcaption
        data-slot="code-preview-caption"
        className="flex min-h-14 items-center gap-3 border-b border-solid border-border bg-muted/40 px-4 py-1"
      >
        <FileCode aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
        <span className="min-w-0 flex-1 break-all font-mono text-xs">{filename}</span>
        {language && <span className="text-xs text-muted-foreground">{language}</span>}
        <Button
          variant="ghost"
          size="icon"
          aria-label={`Copy ${filename}`}
          onClick={() => void copy()}
        >
          {message === 'Copied' ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
        </Button>
      </figcaption>
      <pre
        data-slot="code-preview-source"
        tabIndex={0}
        aria-label={`${filename} source code`}
        className="m-0 max-h-96 overflow-auto p-5 font-mono text-sm leading-7 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
      >
        <code className="bg-transparent p-0 text-inherit [font-size:inherit]">{code}</code>
      </pre>
      <div role="status" className="min-h-7 px-4 pb-2 text-xs text-muted-foreground">
        {message}
      </div>
    </figure>
  );
}

export { CodePreview };
