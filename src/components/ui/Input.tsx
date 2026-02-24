'use client';

import { cn } from '@/lib/utils';
import { forwardRef, InputHTMLAttributes, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    hint?: string;
    icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, hint, icon, type, id, ...props }, ref) => {
        const [showPassword, setShowPassword] = useState(false);
        const isPassword = type === 'password';
        const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

        return (
            <div className="space-y-1.5">
                {label && (
                    <label htmlFor={inputId} className="block text-sm font-medium text-[hsl(220,25%,10%)]">
                        {label}
                    </label>
                )}
                <div className="relative">
                    {icon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(220,10%,45%)]">
                            {icon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        id={inputId}
                        type={isPassword && showPassword ? 'text' : type}
                        className={cn(
                            'w-full rounded-lg border border-[hsl(220,15%,88%)] bg-white px-4 py-2.5 text-sm text-[hsl(220,25%,10%)] placeholder:text-[hsl(220,10%,65%)] transition-all duration-200',
                            'focus:outline-none focus:ring-2 focus:ring-[hsl(210,80%,22%)] focus:border-transparent',
                            'hover:border-[hsl(220,15%,75%)]',
                            'disabled:bg-[hsl(220,15%,95%)] disabled:cursor-not-allowed',
                            icon && 'pl-10',
                            isPassword && 'pr-10',
                            error && 'border-[hsl(0,72%,51%)] focus:ring-[hsl(0,72%,51%)]',
                            className
                        )}
                        {...props}
                    />
                    {isPassword && (
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(220,10%,45%)] hover:text-[hsl(220,25%,10%)] transition-colors"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    )}
                </div>
                {error && <p className="text-xs text-[hsl(0,72%,51%)]">{error}</p>}
                {hint && !error && <p className="text-xs text-[hsl(220,10%,45%)]">{hint}</p>}
            </div>
        );
    }
);

Input.displayName = 'Input';
export { Input };
