'use client';

import { cn } from '@/lib/utils';
import { FileText, Inbox, Search } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    description: string;
    action?: {
        label: string;
        onClick: () => void;
    };
    className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
    return (
        <div className={cn('flex flex-col items-center justify-center py-16 px-6 text-center', className)}>
            <div className="w-16 h-16 rounded-2xl bg-[hsl(220,15%,94%)] flex items-center justify-center mb-5">
                {icon || <Inbox className="h-8 w-8 text-[hsl(220,10%,55%)]" />}
            </div>
            <h3 className="text-lg font-semibold text-[hsl(220,25%,10%)] mb-2">{title}</h3>
            <p className="text-sm text-[hsl(220,10%,45%)] max-w-sm mb-6">{description}</p>
            {action && (
                <Button variant="primary" onClick={action.onClick}>
                    {action.label}
                </Button>
            )}
        </div>
    );
}

// Pre-built empty states (RF43)
export function EmptyRequisicoes({ onCriar }: { onCriar?: () => void }) {
    return (
        <EmptyState
            icon={<FileText className="h-8 w-8 text-[hsl(210,80%,40%)]" />}
            title="Nenhuma requisição encontrada"
            description="Comece criando uma nova requisição para solicitar materiais ou serviços para sua filial."
            action={onCriar ? { label: 'Nova Requisição', onClick: onCriar } : undefined}
        />
    );
}

export function EmptySearch() {
    return (
        <EmptyState
            icon={<Search className="h-8 w-8 text-[hsl(220,10%,55%)]" />}
            title="Nenhum resultado encontrado"
            description="Tente ajustar os filtros ou termos de busca para encontrar o que procura."
        />
    );
}
