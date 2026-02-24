'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge, StatusBadge, PrioridadeBadge } from '@/components/ui/Badge';
import { EmptyRequisicoes } from '@/components/ui/EmptyState';
import { StatusRequisicao, Prioridade, STATUS_REQUISICAO_LABEL, PRIORIDADE_LABEL } from '@/types';
import { formatCurrency, formatRelativeTime } from '@/lib/utils';
import {
    Plus,
    Search,
    Filter,
    ArrowRight,
    SlidersHorizontal,
    Eye,
    FileText,
    X,
} from 'lucide-react';

// TODO: Buscar requisições do Supabase
const requisicoes: { id: string; descricao: string; solicitante: string; filial: string; setor: string; prioridade: Prioridade; status: StatusRequisicao; valor: number; itens: number; criadoEm: string }[] = [];

export default function RequisicaoListPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [prioridadeFilter, setPrioridadeFilter] = useState<string>('');
    const [showFilters, setShowFilters] = useState(false);

    // Filter and sort
    const filtered = requisicoes
        .filter((r) => {
            if (searchQuery) {
                const q = searchQuery.toLowerCase();
                return (
                    r.id.toLowerCase().includes(q) ||
                    r.descricao.toLowerCase().includes(q) ||
                    r.solicitante.toLowerCase().includes(q)
                );
            }
            return true;
        })
        .filter((r) => !statusFilter || r.status === statusFilter)
        .filter((r) => !prioridadeFilter || r.prioridade === prioridadeFilter)
        .sort((a, b) => {
            // Sort by priority (RF-REQ-04)
            const prioA = a.prioridade === Prioridade.EMERGENCIA ? 3 : a.prioridade === Prioridade.URGENTE ? 2 : 1;
            const prioB = b.prioridade === Prioridade.EMERGENCIA ? 3 : b.prioridade === Prioridade.URGENTE ? 2 : 1;
            if (prioA !== prioB) return prioB - prioA;
            return new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime();
        });

    const hasActiveFilters = statusFilter || prioridadeFilter;

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[hsl(220,25%,10%)]">Requisições</h1>
                    <p className="text-sm text-[hsl(220,10%,45%)] mt-1">
                        {filtered.length} requisição(ões) encontrada(s)
                    </p>
                </div>
                <Link href="/dashboard/requisicoes/nova">
                    <Button icon={<Plus size={18} />}>
                        Nova Requisição
                    </Button>
                </Link>
            </div>

            {/* Search & Filters Bar */}
            <div className="bg-white rounded-xl border border-[hsl(220,15%,92%)] p-4">
                <div className="flex flex-col sm:flex-row gap-3">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(220,10%,55%)]" />
                        <input
                            type="text"
                            placeholder="Buscar por código, descrição ou solicitante..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[hsl(220,15%,88%)] text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(210,80%,22%)] focus:border-transparent hover:border-[hsl(220,15%,75%)] transition-all"
                        />
                    </div>

                    {/* Filter toggle */}
                    <Button
                        variant={showFilters ? 'primary' : 'outline'}
                        onClick={() => setShowFilters(!showFilters)}
                        icon={<SlidersHorizontal size={16} />}
                    >
                        Filtros
                        {hasActiveFilters && (
                            <span className="w-2 h-2 rounded-full bg-[hsl(42,85%,55%)]" />
                        )}
                    </Button>
                </div>

                {/* Filter Panel */}
                {showFilters && (
                    <div className="mt-4 pt-4 border-t border-[hsl(220,15%,92%)] flex flex-wrap gap-3 animate-slide-in-up">
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-[hsl(220,10%,45%)]">Status</label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="block w-48 rounded-lg border border-[hsl(220,15%,88%)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(210,80%,22%)]"
                            >
                                <option value="">Todos</option>
                                {Object.entries(STATUS_REQUISICAO_LABEL).map(([key, label]) => (
                                    <option key={key} value={key}>{label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-[hsl(220,10%,45%)]">Prioridade</label>
                            <select
                                value={prioridadeFilter}
                                onChange={(e) => setPrioridadeFilter(e.target.value)}
                                className="block w-48 rounded-lg border border-[hsl(220,15%,88%)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(210,80%,22%)]"
                            >
                                <option value="">Todas</option>
                                {Object.entries(PRIORIDADE_LABEL).map(([key, label]) => (
                                    <option key={key} value={key}>{label}</option>
                                ))}
                            </select>
                        </div>
                        {hasActiveFilters && (
                            <div className="flex items-end">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => { setStatusFilter(''); setPrioridadeFilter(''); }}
                                    icon={<X size={14} />}
                                >
                                    Limpar filtros
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Requisitions List */}
            {filtered.length === 0 ? (
                <EmptyRequisicoes onCriar={() => router.push('/dashboard/requisicoes/nova')} />
            ) : (
                <div className="space-y-3 stagger-list">
                    {filtered.map((req) => (
                        <Link
                            key={req.id}
                            href={`/dashboard/requisicoes/${req.id}`}
                            className="block bg-white rounded-xl border border-[hsl(220,15%,92%)] p-5 hover:shadow-md hover:border-[hsl(220,15%,85%)] transition-all duration-200 group"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                                {/* Main info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-2 mb-2">
                                        <span className="text-sm font-bold text-[hsl(210,80%,30%)] font-mono">{req.id}</span>
                                        <PrioridadeBadge prioridade={req.prioridade} />
                                        <StatusBadge status={req.status} />
                                    </div>
                                    <h3 className="text-base font-medium text-[hsl(220,25%,10%)] mb-1 truncate group-hover:text-[hsl(210,80%,30%)] transition-colors">
                                        {req.descricao}
                                    </h3>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[hsl(220,10%,50%)]">
                                        <span>👤 {req.solicitante}</span>
                                        <span>🏢 {req.filial}</span>
                                        <span>📂 {req.setor}</span>
                                        <span>📦 {req.itens} item(ns)</span>
                                        <span>🕐 {formatRelativeTime(req.criadoEm)}</span>
                                    </div>
                                </div>

                                {/* Value & Action */}
                                <div className="flex sm:flex-col items-center sm:items-end gap-3">
                                    <span className="text-lg font-bold text-[hsl(220,25%,10%)]">
                                        {req.valor > 0 ? formatCurrency(req.valor) : '—'}
                                    </span>
                                    <div className="flex items-center gap-1 text-[hsl(210,80%,40%)] opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-xs font-medium">Ver detalhes</span>
                                        <ArrowRight size={14} />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
