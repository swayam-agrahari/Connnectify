import * as React from 'react';
import { cn } from './lib/utils';
import { ChevronDown } from 'lucide-react';

export interface GlassSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
}

const GlassSelect = React.forwardRef<HTMLSelectElement, GlassSelectProps>(
  ({ className, error, children, ...props }, ref) => {
    return (
      <div className="w-full">
        <div className="relative">
          <select
            className={cn(
              'flex h-12 w-full rounded-lg bg-white/5 backdrop-blur-sm border border-white/10',
              'px-4 py-3 text-sm text-neutral-800 dark:text-white',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-0',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'transition-all duration-200',
              'appearance-none cursor-pointer',
              error && 'border-red-500/50 focus-visible:ring-red-500',
              className
            )}
            ref={ref}
            {...props}
          >
            {children}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400 pointer-events-none" />
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);
GlassSelect.displayName = 'GlassSelect';

export { GlassSelect };
