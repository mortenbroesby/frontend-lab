'use client';

import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import { cn } from './utils';

function Progress({
  className,
  value,
  max = 100,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  const limit = Number.isFinite(max) && max > 0 ? max : 100;
  const current =
    typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= limit
      ? value
      : null;
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      value={current}
      max={limit}
      className={cn('relative h-2 w-full overflow-hidden rounded-full bg-primary/20', className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="h-full w-full bg-primary transition-transform data-[state=indeterminate]:opacity-40"
        style={{
          transform:
            current === null ? undefined : `translateX(-${100 - (current / limit) * 100}%)`,
        }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
