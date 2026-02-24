'use client';

import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { useEffect, useCallback } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

export function Modal({ isOpen, onClose, title, description, children, size = 'md', className }: ModalProps) {
    const handleEsc = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        },
        [onClose]
    );

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleEsc);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, handleEsc]);

    if (!isOpen) return null;

    const sizes = {
        sm: 'max-w-sm',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            />

            {/* Modal */}
            <div
                className={cn(
                    'relative w-full bg-white rounded-2xl shadow-xl animate-scale-in',
                    sizes[size],
                    className
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-[hsl(220,15%,92%)]">
                    <div>
                        <h2 className="text-lg font-semibold text-[hsl(220,25%,10%)]">{title}</h2>
                        {description && (
                            <p className="text-sm text-[hsl(220,10%,45%)] mt-1">{description}</p>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-[hsl(220,15%,92%)] transition-colors text-[hsl(220,10%,55%)]"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 max-h-[70vh] overflow-y-auto">{children}</div>
            </div>
        </div>
    );
}
