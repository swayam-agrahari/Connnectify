import * as React from 'react';
import { cn } from './lib/utils';
import { Loader2 } from 'lucide-react';

export interface GlassButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  isLoading?: boolean;
}

const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className, variant = 'primary', isLoading, children, disabled, ...props }, ref) => {
    const variants = {
      primary: 'bg-neutral-800 hover:bg-neutral-900 text-white shadow-md',
      secondary: 'bg-white/10 hover:bg-white/20 text-neutral-800 dark:text-white border border-white/20',
      ghost: 'bg-transparent hover:bg-white/10 text-neutral-600 dark:text-neutral-300',
    };

    return (
      <button
        className={cn(
          'inline-flex items-center justify-center rounded-lg px-6 py-3',
          'text-sm font-medium',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          'transition-all duration-200',
          variants[variant],
          className
        )}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        {children}
      </button>
    );
  }
);
GlassButton.displayName = 'GlassButton';

export { GlassButton };
