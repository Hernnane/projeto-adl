'use client';

import { cn } from '@/lib/utils';
import { StatusRequisicao, STATUS_REQUISICAO_LABEL, Prioridade, PRIORIDADE_LABEL } from '@/types';

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'gold';
    size?: 'sm' | 'md';
    pulse?: boolean;
    className?: string;
}

export function Badge({ children, variant = 'default', size = 'sm', pulse, className }: BadgeProps) {
    const variants = {
        default: 'bg-[hsl(220,15%,92%)] text-[hsl(220,10%,45%)] border-[hsl(220,15%,85%)]',
        success: 'bg-[hsl(152,55%,95%)] text-[hsl(152,60%,30%)] border-[hsl(152,55%,80%)]',
        warning: 'bg-[hsl(38,90%,94%)] text-[hsl(38,80%,35%)] border-[hsl(38,85%,75%)]',
        danger: 'bg-[hsl(0,70%,95%)] text-[hsl(0,72%,45%)] border-[hsl(0,65%,80%)]',
        info: 'bg-[hsl(210,75%,95%)] text-[hsl(210,80%,40%)] border-[hsl(210,70%,80%)]',
        gold: 'bg-[hsl(42,90%,92%)] text-[hsl(42,75%,30%)] border-[hsl(42,80%,70%)]',
    };

    const sizes = {
        sm: 'text-xs px-2 py-0.5',
        md: 'text-sm px-2.5 py-1',
    };

    return (
        <span
            className={cn(
                'inline-flex items-center gap-1 font-medium rounded-full border whitespace-nowrap',
                variants[variant],
                sizes[size],
                pulse && 'animate-pulse',
                className
            )}
        >
            {children}
        </span>
    );
}

// Pré-configurados para status de requisições
export function StatusBadge({ status }: { status: StatusRequisicao }) {
    const variantMap: Record<StatusRequisicao, BadgeProps['variant']> = {
        [StatusRequisicao.RASCUNHO]: 'default',
        [StatusRequisicao.AGUARDANDO_GERENTE]: 'warning',
        [StatusRequisicao.RETORNO_SOLICITANTE]: 'info',
        [StatusRequisicao.AGUARDANDO_ADM]: 'warning',
        [StatusRequisicao.RETORNO_GERENTE]: 'info',
        [StatusRequisicao.AGUARDANDO_CEO]: 'gold',
        [StatusRequisicao.APROVADO_FINAL]: 'success',
        [StatusRequisicao.REPROVADO_FINAL]: 'danger',
    };

    return <Badge variant={variantMap[status]}>{STATUS_REQUISICAO_LABEL[status]}</Badge>;
}

export function PrioridadeBadge({ prioridade }: { prioridade: Prioridade }) {
    const variantMap: Record<Prioridade, BadgeProps['variant']> = {
        [Prioridade.NORMAL]: 'default',
        [Prioridade.URGENTE]: 'warning',
        [Prioridade.EMERGENCIA]: 'danger',
    };

    return (
        <Badge
            variant={variantMap[prioridade]}
            pulse={prioridade === Prioridade.EMERGENCIA}
        >
            {prioridade === Prioridade.EMERGENCIA && '🔴 '}
            {prioridade === Prioridade.URGENTE && '🟠 '}
            {PRIORIDADE_LABEL[prioridade]}
        </Badge>
    );
}

// Badge numérico para menu (RF41)
export function CountBadge({ count, className }: { count: number; className?: string }) {
    if (count <= 0) return null;

    return (
        <span
            className={cn(
                'inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold rounded-full',
                'bg-[hsl(0,72%,51%)] text-white',
                className
            )}
        >
            {count > 99 ? '99+' : count}
        </span>
    );
}
