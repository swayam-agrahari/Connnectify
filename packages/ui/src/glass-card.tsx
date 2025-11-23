import { cn } from './lib/utils';
import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
}

export function GlassCard({ children, className }: GlassCardProps) {
  return (
    <div
      className={cn(
        'bg-white/10 backdrop-blur-md border border-white/20 shadow-lg rounded-xl p-8',
        className
      )}
    >
      {children}
    </div>
  );
}
