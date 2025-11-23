import * as React from 'react';
import { cn } from './lib/utils';
import { LucideIcon } from 'lucide-react';

export interface GlassInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: LucideIcon;
  error?: string;
}

const GlassInput = React.forwardRef<HTMLInputElement, GlassInputProps>(
  ({ className, type, icon: Icon, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <div className="relative">
          {Icon && (
            <Icon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
          )}
          <input
            type={type}
            className={cn(
              'flex h-12 w-full rounded-lg bg-white/5 backdrop-blur-sm border border-white/10',
              'px-4 py-3 text-sm text-neutral-800 dark:text-white',
              'placeholder:text-neutral-400',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-0',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'transition-all duration-200',
              Icon && 'pl-12',
              error && 'border-red-500/50 focus-visible:ring-red-500',
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);
GlassInput.displayName = 'GlassInput';

export { GlassInput };
