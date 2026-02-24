'use client';

import { cn } from '@/lib/utils';

interface SkeletonProps {
    className?: string;
    variant?: 'text' | 'circular' | 'rectangular';
    width?: string | number;
    height?: string | number;
}

export function Skeleton({ className, variant = 'text', width, height }: SkeletonProps) {
    const baseStyles = 'bg-[hsl(220,15%,90%)] animate-pulse';

    const variants = {
        text: 'rounded h-4',
        circular: 'rounded-full',
        rectangular: 'rounded-lg',
    };

    return (
        <div
            className={cn(baseStyles, variants[variant], className)}
            style={{ width, height }}
        />
    );
}

// Pre-built skeleton layouts
export function CardSkeleton() {
    return (
        <div className="bg-white rounded-xl border border-[hsl(220,15%,90%)] p-5 space-y-4">
            <div className="flex items-center justify-between">
                <Skeleton width="40%" height={20} />
                <Skeleton width={80} height={24} variant="rectangular" />
            </div>
            <Skeleton width="80%" />
            <Skeleton width="60%" />
            <div className="flex items-center gap-3 pt-2">
                <Skeleton variant="circular" width={32} height={32} />
                <div className="space-y-1.5 flex-1">
                    <Skeleton width="30%" />
                    <Skeleton width="20%" />
                </div>
            </div>
        </div>
    );
}

export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
    return (
        <tr className="border-b border-[hsl(220,15%,92%)]">
            {Array.from({ length: columns }).map((_, i) => (
                <td key={i} className="py-4 px-4">
                    <Skeleton width={`${60 + Math.random() * 30}%`} />
                </td>
            ))}
        </tr>
    );
}

export function ListSkeleton({ rows = 5 }: { rows?: number }) {
    return (
        <div className="space-y-3">
            {Array.from({ length: rows }).map((_, i) => (
                <CardSkeleton key={i} />
            ))}
        </div>
    );
}
