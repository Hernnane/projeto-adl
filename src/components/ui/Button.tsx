'use client';

import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline' | 'gold';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    icon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', loading, icon, children, disabled, ...props }, ref) => {
        const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 touch-target focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-[0.98]';

        const variants = {
            primary: 'bg-[hsl(210,80%,22%)] text-white hover:bg-[hsl(210,70%,28%)] focus:ring-[hsl(210,80%,22%)] shadow-sm hover:shadow-md',
            secondary: 'bg-[hsl(220,15%,92%)] text-[hsl(220,25%,10%)] hover:bg-[hsl(220,15%,85%)] focus:ring-[hsl(220,15%,70%)]',
            danger: 'bg-[hsl(0,72%,51%)] text-white hover:bg-[hsl(0,72%,45%)] focus:ring-[hsl(0,72%,51%)] shadow-sm',
            ghost: 'text-[hsl(220,10%,45%)] hover:bg-[hsl(220,15%,92%)] hover:text-[hsl(220,25%,10%)] focus:ring-[hsl(220,15%,70%)]',
            outline: 'border-2 border-[hsl(220,15%,88%)] text-[hsl(220,25%,10%)] hover:border-[hsl(210,80%,22%)] hover:text-[hsl(210,80%,22%)] focus:ring-[hsl(210,80%,22%)]',
            gold: 'bg-[hsl(42,85%,55%)] text-[hsl(210,80%,14%)] hover:bg-[hsl(42,80%,50%)] focus:ring-[hsl(42,85%,55%)] shadow-sm hover:shadow-md font-semibold',
        };

        const sizes = {
            sm: 'text-xs px-3 py-1.5 min-h-[32px]',
            md: 'text-sm px-4 py-2.5 min-h-[40px]',
            lg: 'text-base px-6 py-3 min-h-[48px]',
        };

        return (
            <button
                ref={ref}
                className={cn(baseStyles, variants[variant], sizes[size], className)}
                disabled={disabled || loading}
                {...props}
            >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {!loading && icon}
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';
export { Button };
