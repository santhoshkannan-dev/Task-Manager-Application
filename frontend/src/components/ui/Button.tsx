import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading = false, children, disabled, ...props }, ref) => {
    const variants = {
      primary:
        'bg-[#7050DC] hover:bg-[#5F3EC9] text-white shadow-sm hover:shadow-md active:scale-[0.98] border border-transparent font-medium',
      secondary:
        'bg-[#FAF8FF] hover:bg-[#F3F0FF] text-[#7050DC] border border-[#DDD6FE] font-medium active:scale-[0.98]',
      outline:
        'bg-white hover:bg-gray-50 text-charcoal border border-surface-border hover:border-gray-300 font-medium active:scale-[0.98]',
      danger:
        'bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 font-medium active:scale-[0.98]',
      ghost:
        'bg-transparent hover:bg-gray-100/70 text-charcoal-soft font-medium active:scale-[0.98]',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
      md: 'px-4 py-2 text-sm rounded-xl gap-2',
      lg: 'px-5 py-2.5 text-base rounded-xl gap-2.5',
      icon: 'p-2 rounded-xl',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40 disabled:opacity-50 disabled:pointer-events-none select-none',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin text-current shrink-0" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

