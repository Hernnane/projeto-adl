'use client';

import {
    FileText,
    TrendingUp,
    Clock,
    CheckCircle,
    AlertTriangle,
    ArrowRight,
    Plus,
    Users,
    Building2,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Badge, StatusBadge, PrioridadeBadge } from '@/components/ui/Badge';
import { StatusRequisicao, Prioridade } from '@/types';
import { formatCurrency, formatRelativeTime } from '@/lib/utils';

// Demo data
const stats = [
    { label: 'Requisições Abertas', value: 12, icon: FileText, color: 'bg-[hsl(210,75%,95%)]', iconColor: 'text-[hsl(210,80%,40%)]', trend: '+3 hoje' },
    { label: 'Aguardando Aprovação', value: 5, icon: Clock, color: 'bg-[hsl(38,90%,94%)]', iconColor: 'text-[hsl(38,80%,45%)]', trend: '2 urgentes' },
    { label: 'Aprovadas (mês)', value: 28, icon: CheckCircle, color: 'bg-[hsl(152,55%,95%)]', iconColor: 'text-[hsl(152,60%,35%)]', trend: 'R$ 45.200' },
    { label: 'Valor Total Pendente', value: 'R$ 18.5k', icon: TrendingUp, color: 'bg-[hsl(42,90%,92%)]', iconColor: 'text-[hsl(42,75%,40%)]', trend: '3 filiais' },
];

const recentRequisitions = [
    { id: 'REQ-2026-00042', descricao: 'Peças de reposição para britador', solicitante: 'João Silva', filial: 'Fábrica RJ', prioridade: Prioridade.EMERGENCIA, status: StatusRequisicao.AGUARDANDO_CEO, valor: 8500, criadoEm: new Date(Date.now() - 3600000).toISOString() },
    { id: 'REQ-2026-00041', descricao: 'EPIs para equipe de campo', solicitante: 'Maria Oliveira', filial: 'Pesquisa BA', prioridade: Prioridade.URGENTE, status: StatusRequisicao.AGUARDANDO_ADM, valor: 2300, criadoEm: new Date(Date.now() - 7200000).toISOString() },
    { id: 'REQ-2026-00040', descricao: 'Material de escritório', solicitante: 'Carlos Santos', filial: 'Matriz SP', prioridade: Prioridade.NORMAL, status: StatusRequisicao.AGUARDANDO_GERENTE, valor: 450, criadoEm: new Date(Date.now() - 14400000).toISOString() },
    { id: 'REQ-2026-00039', descricao: 'Reagentes químicos para laboratório', solicitante: 'Ana Costa', filial: 'Pesquisa BA', prioridade: Prioridade.URGENTE, status: StatusRequisicao.APROVADO_FINAL, valor: 12800, criadoEm: new Date(Date.now() - 86400000).toISOString() },
    { id: 'REQ-2026-00038', descricao: 'Manutenção preventiva separador magnético', solicitante: 'Pedro Lima', filial: 'Fábrica RJ', prioridade: Prioridade.NORMAL, status: StatusRequisicao.REPROVADO_FINAL, valor: 3200, criadoEm: new Date(Date.now() - 172800000).toISOString() },
];

export default function DashboardPage() {
    return (
        <div className="space-y-6 animate-fade-in">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[hsl(220,25%,10%)]">Dashboard</h1>
                    <p className="text-sm text-[hsl(220,10%,45%)] mt-1">
                        Visão geral do sistema • Atualizado agora
                    </p>
                </div>
                <Link href="/dashboard/requisicoes/nova">
                    <Button icon={<Plus size={18} />}>
                        Nova Requisição
                    </Button>
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={stat.label}
                            className="bg-white rounded-xl border border-[hsl(220,15%,92%)] p-5 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
                        >
                            <div className="flex items-start justify-between">
                                <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center`}>
                                    <Icon size={20} className={stat.iconColor} />
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-[hsl(220,25%,10%)] mt-3">
                                {typeof stat.value === 'number' ? stat.value : stat.value}
                            </p>
                            <p className="text-sm text-[hsl(220,10%,45%)] mt-0.5">{stat.label}</p>
                            <p className="text-xs text-[hsl(210,80%,40%)] font-medium mt-2">{stat.trend}</p>
                        </div>
                    );
                })}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Requisitions */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-[hsl(220,15%,92%)] overflow-hidden">
                    <div className="p-5 border-b border-[hsl(220,15%,92%)] flex items-center justify-between">
                        <h2 className="font-semibold text-[hsl(220,25%,10%)]">Requisições Recentes</h2>
                        <Link
                            href="/dashboard/requisicoes"
                            className="text-sm font-medium text-[hsl(210,80%,35%)] hover:text-[hsl(210,80%,25%)] flex items-center gap-1 transition-colors"
                        >
                            Ver todas <ArrowRight size={14} />
                        </Link>
                    </div>

                    <div className="divide-y divide-[hsl(220,15%,95%)]">
                        {recentRequisitions.map((req) => (
                            <Link
                                key={req.id}
                                href={`/dashboard/requisicoes/${req.id}`}
                                className="flex items-center gap-4 p-4 hover:bg-[hsl(220,15%,98%)] transition-colors group"
                            >
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-sm font-semibold text-[hsl(210,80%,30%)]">{req.id}</span>
                                        <PrioridadeBadge prioridade={req.prioridade} />
                                    </div>
                                    <p className="text-sm text-[hsl(220,25%,10%)] truncate">{req.descricao}</p>
                                    <p className="text-xs text-[hsl(220,10%,55%)] mt-1">
                                        {req.solicitante} • {req.filial} • {formatRelativeTime(req.criadoEm)}
                                    </p>
                                </div>
                                <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                                    <StatusBadge status={req.status} />
                                    <span className="text-sm font-semibold text-[hsl(220,25%,10%)]">
                                        {formatCurrency(req.valor)}
                                    </span>
                                </div>
                                <ArrowRight size={16} className="text-[hsl(220,10%,70%)] group-hover:text-[hsl(210,80%,35%)] transition-colors flex-shrink-0 hidden sm:block" />
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Quick Actions */}
                    <div className="bg-white rounded-xl border border-[hsl(220,15%,92%)] p-5">
                        <h2 className="font-semibold text-[hsl(220,25%,10%)] mb-4">Ações Rápidas</h2>
                        <div className="space-y-2">
                            <Link href="/dashboard/requisicoes/nova" className="block">
                                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-[hsl(220,15%,97%)] transition-colors group cursor-pointer">
                                    <div className="w-9 h-9 rounded-lg bg-[hsl(210,75%,95%)] flex items-center justify-center group-hover:bg-[hsl(210,75%,90%)] transition-colors">
                                        <FileText size={18} className="text-[hsl(210,80%,35%)]" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-[hsl(220,25%,10%)]">Nova Requisição</p>
                                        <p className="text-xs text-[hsl(220,10%,55%)]">Solicitar material ou serviço</p>
                                    </div>
                                </div>
                            </Link>
                            <Link href="/dashboard/usuarios" className="block">
                                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-[hsl(220,15%,97%)] transition-colors group cursor-pointer">
                                    <div className="w-9 h-9 rounded-lg bg-[hsl(152,55%,95%)] flex items-center justify-center group-hover:bg-[hsl(152,55%,90%)] transition-colors">
                                        <Users size={18} className="text-[hsl(152,60%,35%)]" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-[hsl(220,25%,10%)]">Gerenciar Usuários</p>
                                        <p className="text-xs text-[hsl(220,10%,55%)]">Cadastrar e editar acessos</p>
                                    </div>
                                </div>
                            </Link>
                            <Link href="/dashboard/filiais" className="block">
                                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-[hsl(220,15%,97%)] transition-colors group cursor-pointer">
                                    <div className="w-9 h-9 rounded-lg bg-[hsl(42,90%,92%)] flex items-center justify-center group-hover:bg-[hsl(42,90%,87%)] transition-colors">
                                        <Building2 size={18} className="text-[hsl(42,75%,40%)]" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-[hsl(220,25%,10%)]">Filiais</p>
                                        <p className="text-xs text-[hsl(220,10%,55%)]">Gerenciar unidades de negócio</p>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>

                    {/* Pending Approvals */}
                    <div className="bg-gradient-to-br from-[hsl(210,80%,14%)] to-[hsl(210,75%,20%)] rounded-xl p-5 text-white">
                        <div className="flex items-center gap-2 mb-4">
                            <AlertTriangle size={18} className="text-[hsl(42,85%,55%)]" />
                            <h2 className="font-semibold">Pendências</h2>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-[hsl(210,20%,70%)]">Aguardando sua aprovação</span>
                                <span className="text-lg font-bold text-[hsl(42,85%,55%)]">5</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-[hsl(210,20%,70%)]">Retornos pendentes</span>
                                <span className="text-lg font-bold text-white">2</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-[hsl(210,20%,70%)]">Valor total pendente</span>
                                <span className="text-lg font-bold text-[hsl(42,85%,55%)]">R$ 18.5k</span>
                            </div>
                        </div>
                        <Link href="/dashboard/requisicoes?status=pendente" className="block mt-4">
                            <Button variant="gold" className="w-full" size="sm">
                                Revisar Pendências
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
