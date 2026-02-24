'use client';

import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
    id: string;
    type: ToastType;
    title: string;
    message?: string;
    duration?: number;
}

// Global toast state
let toasts: Toast[] = [];
let listeners: Array<(toasts: Toast[]) => void> = [];

function notify() {
    listeners.forEach((listener) => listener([...toasts]));
}

export function toast(type: ToastType, title: string, message?: string, duration = 5000) {
    const id = Math.random().toString(36).slice(2);
    toasts.push({ id, type, title, message, duration });
    notify();

    if (duration > 0) {
        setTimeout(() => {
            toasts = toasts.filter((t) => t.id !== id);
            notify();
        }, duration);
    }
}

export function dismissToast(id: string) {
    toasts = toasts.filter((t) => t.id !== id);
    notify();
}

// Convenience functions
toast.success = (title: string, message?: string) => toast('success', title, message);
toast.error = (title: string, message?: string) => toast('error', title, message);
toast.warning = (title: string, message?: string) => toast('warning', title, message);
toast.info = (title: string, message?: string) => toast('info', title, message);

// Toast Container Component
export function ToastContainer() {
    const [currentToasts, setCurrentToasts] = useState<Toast[]>([]);

    useEffect(() => {
        listeners.push(setCurrentToasts);
        return () => {
            listeners = listeners.filter((l) => l !== setCurrentToasts);
        };
    }, []);

    if (currentToasts.length === 0) return null;

    return (
        <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full">
            {currentToasts.map((t) => (
                <ToastItem key={t.id} toast={t} />
            ))}
        </div>
    );
}

function ToastItem({ toast: t }: { toast: Toast }) {
    const icons = {
        success: <CheckCircle className="h-5 w-5 text-[hsl(152,60%,40%)]" />,
        error: <XCircle className="h-5 w-5 text-[hsl(0,72%,51%)]" />,
        warning: <AlertTriangle className="h-5 w-5 text-[hsl(38,95%,55%)]" />,
        info: <Info className="h-5 w-5 text-[hsl(210,80%,52%)]" />,
    };

    const borders = {
        success: 'border-l-[hsl(152,60%,40%)]',
        error: 'border-l-[hsl(0,72%,51%)]',
        warning: 'border-l-[hsl(38,95%,55%)]',
        info: 'border-l-[hsl(210,80%,52%)]',
    };

    return (
        <div
            className={cn(
                'bg-white rounded-lg shadow-lg border border-[hsl(220,15%,90%)] border-l-4 p-4 animate-slide-in-right',
                borders[t.type]
            )}
        >
            <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">{icons[t.type]}</div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[hsl(220,25%,10%)]">{t.title}</p>
                    {t.message && (
                        <p className="text-xs text-[hsl(220,10%,45%)] mt-1">{t.message}</p>
                    )}
                </div>
                <button
                    onClick={() => dismissToast(t.id)}
                    className="flex-shrink-0 text-[hsl(220,10%,65%)] hover:text-[hsl(220,25%,10%)] transition-colors"
                >
                    <X size={16} />
                </button>
            </div>
        </div>
    );
}
