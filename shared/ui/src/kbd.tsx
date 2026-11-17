import type { ComponentProps } from 'react';
import { cn } from './utils';

function Kbd({ className, ...props }: ComponentProps<'kbd'>) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        'inline-flex min-w-6 items-center justify-center rounded border border-solid border-border bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground',
        className,
      )}
      {...props}
    />
  );
}

export { Kbd };
