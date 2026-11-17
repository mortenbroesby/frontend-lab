import type { ComponentProps, ReactNode } from 'react';
import { cn } from './utils';

type EmptyStateProps = ComponentProps<'div'> & {
  title: string;
  description: ReactNode;
  icon?: ReactNode;
};

function EmptyState({ title, description, icon, children, className, ...props }: EmptyStateProps) {
  return (
    <div
      data-slot="empty-state"
      className={cn(
        'flex flex-col items-center gap-3 rounded-lg border border-dashed border-border p-8 text-center',
        className,
      )}
      {...props}
    >
      {icon && (
        <span
          aria-hidden="true"
          className="flex size-11 items-center justify-center rounded-lg border border-solid border-border bg-muted text-muted-foreground"
        >
          {icon}
        </span>
      )}
      <p className="m-0 text-base font-semibold text-foreground">{title}</p>
      <div className="max-w-sm text-sm leading-relaxed text-muted-foreground">{description}</div>
      {children && <div className="mt-2 flex flex-wrap justify-center gap-2">{children}</div>}
    </div>
  );
}

export { EmptyState };
