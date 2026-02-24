'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Badge, StatusBadge, PrioridadeBadge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { toast } from '@/components/ui/Toast';
import { StatusRequisicao, Prioridade, StatusItem, DecisaoAprovacao } from '@/types';
import { formatCurrency, formatDateTime, formatRelativeTime } from '@/lib/utils';
import {
    ArrowLeft,
    CheckCircle,
    XCircle,
    RotateCcw,
    User,
    Calendar,
    Building2,
    Layers,
    Clock,
    FileText,
    ImageIcon,
    Download,
    Eye,
    MessageSquare,
    AlertTriangle,
} from 'lucide-react';

// Demo data
const requisicao = {
    id: 'REQ-2026-00042',
    descricao: 'Peças de reposição para britador primário',
    solicitante: { nome: 'João Silva', perfil: 'Operacional', email: 'joao.silva@adlgroup.com.br' },
    filial: 'Fábrica - Rio de Janeiro',
    setor: 'Manutenção',
    prioridade: Prioridade.EMERGENCIA,
    justificativa_urgencia: 'Britador primário apresentou falha crítica no rolamento. Sem reposição, a linha de produção ficará parada, causando prejuízo estimado de R$ 50.000/dia.',
    status: StatusRequisicao.AGUARDANDO_CEO,
    valor_total: 8500,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    itens: [
        { id: '1', descricao: 'Rolamento cônico SKF 32220', quantidade: 2, unidade: 'UN', valor_unitario: 1200, valor_total: 2400, fornecedor: 'SKF Brasil', status: StatusItem.APROVADO, observacao: 'Modelo exato do fabricante' },
        { id: '2', descricao: 'Correia em V perfil B-68', quantidade: 4, unidade: 'UN', valor_unitario: 350, valor_total: 1400, fornecedor: 'Gates do Brasil', status: StatusItem.APROVADO, observacao: '' },
        { id: '3', descricao: 'Graxa especial para rolamentos de alta rotação', quantidade: 10, unidade: 'KG', valor_unitario: 120, valor_total: 1200, fornecedor: 'Mobil Industrial', status: StatusItem.PENDENTE, observacao: 'Verificar compatibilidade com SKF' },
        { id: '4', descricao: 'Serviço de usinagem do eixo', quantidade: 1, unidade: 'UN', valor_unitario: 3500, valor_total: 3500, fornecedor: 'Metalúrgica Precisão', status: StatusItem.PENDENTE, observacao: 'Prazo estimado de 3 dias úteis' },
    ],
    timeline: [
        { tipo: 'CRIACAO', descricao: 'Requisição criada por João Silva', usuario: 'João Silva', data: new Date(Date.now() - 86400000).toISOString(), icon: 'create' },
        { tipo: 'ENVIO', descricao: 'Enviada para aprovação do Gerente Local', usuario: 'João Silva', data: new Date(Date.now() - 85000000).toISOString(), icon: 'send' },
        { tipo: 'APROVACAO', descricao: 'Aprovada pelo Gerente Local com justificativa: "Manutenção crítica, parada de produção iminente"', usuario: 'Carlos Gerente', data: new Date(Date.now() - 72000000).toISOString(), icon: 'approved' },
        { tipo: 'COTACAO', descricao: 'Administrador realizou cotação com 3 fornecedores e selecionou os melhores preços', usuario: 'Ana Admin', data: new Date(Date.now() - 43200000).toISOString(), icon: 'quote' },
        { tipo: 'ENVIO', descricao: 'Encaminhada para aprovação final do CEO', usuario: 'Ana Admin', data: new Date(Date.now() - 43000000).toISOString(), icon: 'send' },
    ],
    anexos: [
        { id: '1', nome: 'foto_rolamento_danificado.jpg', legenda: 'Rolamento com desgaste severo', tipo: 'image/jpeg', tamanho: 2340000 },
        { id: '2', nome: 'cotacao_skf_brasil.pdf', legenda: 'Cotação Fornecedor SKF - 3 itens', tipo: 'application/pdf', tamanho: 450000 },
        { id: '3', nome: 'cotacao_gates.pdf', legenda: 'Cotação Fornecedor Gates - Correias', tipo: 'application/pdf', tamanho: 320000 },
    ],
};

export default function RequisicaoDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [approvalModal, setApprovalModal] = useState<{ type: 'approve' | 'reject' | 'return'; itemId?: string } | null>(null);
    const [justificativa, setJustificativa] = useState('');

    const handleApproval = (decisao: DecisaoAprovacao) => {
        if (decisao !== DecisaoAprovacao.APROVADO && !justificativa.trim()) {
            toast.error('Informe a justificativa');
            return;
        }

        toast.success(
            decisao === DecisaoAprovacao.APROVADO
                ? 'Requisição aprovada com sucesso!'
                : decisao === DecisaoAprovacao.REPROVADO
                    ? 'Requisição reprovada'
                    : 'Requisição devolvida para revisão'
        );
        setApprovalModal(null);
        setJustificativa('');
    };

    const valorAprovado = requisicao.itens
        .filter((i) => i.status === StatusItem.APROVADO)
        .reduce((sum, i) => sum + (i.valor_total || 0), 0);

    const timelineIcons: Record<string, React.ReactNode> = {
        create: <div className="w-8 h-8 rounded-full bg-[hsl(210,75%,95%)] flex items-center justify-center"><FileText size={14} className="text-[hsl(210,80%,40%)]" /></div>,
        send: <div className="w-8 h-8 rounded-full bg-[hsl(38,90%,94%)] flex items-center justify-center"><Clock size={14} className="text-[hsl(38,80%,40%)]" /></div>,
        approved: <div className="w-8 h-8 rounded-full bg-[hsl(152,55%,95%)] flex items-center justify-center"><CheckCircle size={14} className="text-[hsl(152,60%,35%)]" /></div>,
        quote: <div className="w-8 h-8 rounded-full bg-[hsl(42,90%,92%)] flex items-center justify-center"><MessageSquare size={14} className="text-[hsl(42,75%,40%)]" /></div>,
        rejected: <div className="w-8 h-8 rounded-full bg-[hsl(0,70%,95%)] flex items-center justify-center"><XCircle size={14} className="text-[hsl(0,72%,45%)]" /></div>,
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/requisicoes">
                        <Button variant="ghost" size="sm" icon={<ArrowLeft size={18} />}>
                            Voltar
                        </Button>
                    </Link>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h1 className="text-xl font-bold text-[hsl(210,80%,25%)] font-mono">{requisicao.id}</h1>
                            <PrioridadeBadge prioridade={requisicao.prioridade} />
                            <StatusBadge status={requisicao.status} />
                        </div>
                        <p className="text-sm text-[hsl(220,10%,45%)]">{requisicao.descricao}</p>
                    </div>
                </div>

                {/* Approval Actions */}
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        icon={<RotateCcw size={16} />}
                        onClick={() => setApprovalModal({ type: 'return' })}
                    >
                        Devolver
                    </Button>
                    <Button
                        variant="danger"
                        size="sm"
                        icon={<XCircle size={16} />}
                        onClick={() => setApprovalModal({ type: 'reject' })}
                    >
                        Reprovar
                    </Button>
                    <Button
                        variant="primary"
                        size="sm"
                        icon={<CheckCircle size={16} />}
                        onClick={() => setApprovalModal({ type: 'approve' })}
                        className="touch-target"
                    >
                        Aprovar
                    </Button>
                </div>
            </div>

            {/* Urgency alert */}
            {requisicao.prioridade !== Prioridade.NORMAL && requisicao.justificativa_urgencia && (
                <div className="flex items-start gap-3 p-4 rounded-xl bg-[hsl(0,70%,97%)] border border-[hsl(0,65%,85%)]">
                    <AlertTriangle size={20} className="text-[hsl(0,72%,50%)] flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-semibold text-[hsl(0,72%,40%)]">Justificativa de Emergência</p>
                        <p className="text-sm text-[hsl(0,40%,35%)] mt-1">{requisicao.justificativa_urgencia}</p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Info Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="bg-white rounded-xl border border-[hsl(220,15%,92%)] p-4">
                            <User size={16} className="text-[hsl(220,10%,55%)]" />
                            <p className="text-sm font-medium mt-2 text-[hsl(220,25%,10%)]">{requisicao.solicitante.nome}</p>
                            <p className="text-xs text-[hsl(220,10%,45%)]">{requisicao.solicitante.perfil}</p>
                        </div>
                        <div className="bg-white rounded-xl border border-[hsl(220,15%,92%)] p-4">
                            <Building2 size={16} className="text-[hsl(220,10%,55%)]" />
                            <p className="text-sm font-medium mt-2 text-[hsl(220,25%,10%)]">{requisicao.filial}</p>
                            <p className="text-xs text-[hsl(220,10%,45%)]">Filial</p>
                        </div>
                        <div className="bg-white rounded-xl border border-[hsl(220,15%,92%)] p-4">
                            <Layers size={16} className="text-[hsl(220,10%,55%)]" />
                            <p className="text-sm font-medium mt-2 text-[hsl(220,25%,10%)]">{requisicao.setor}</p>
                            <p className="text-xs text-[hsl(220,10%,45%)]">Setor</p>
                        </div>
                        <div className="bg-white rounded-xl border border-[hsl(220,15%,92%)] p-4">
                            <Calendar size={16} className="text-[hsl(220,10%,55%)]" />
                            <p className="text-sm font-medium mt-2 text-[hsl(220,25%,10%)]">{formatDateTime(requisicao.created_at)}</p>
                            <p className="text-xs text-[hsl(220,10%,45%)]">Criada</p>
                        </div>
                    </div>

                    {/* Items Table (RF-REQ-05) */}
                    <div className="bg-white rounded-xl border border-[hsl(220,15%,92%)] overflow-hidden">
                        <div className="p-5 border-b border-[hsl(220,15%,92%)]">
                            <h2 className="font-semibold text-[hsl(220,25%,10%)]">Itens ({requisicao.itens.length})</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-[hsl(220,15%,97%)] text-xs font-medium text-[hsl(220,10%,45%)] uppercase tracking-wider">
                                        <th className="text-left px-5 py-3">#</th>
                                        <th className="text-left px-5 py-3">Descrição</th>
                                        <th className="text-center px-5 py-3">Qtd</th>
                                        <th className="text-right px-5 py-3">Valor Unit.</th>
                                        <th className="text-right px-5 py-3">Total</th>
                                        <th className="text-center px-5 py-3">Status</th>
                                        <th className="text-center px-5 py-3">Ação</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[hsl(220,15%,95%)]">
                                    {requisicao.itens.map((item, idx) => (
                                        <tr key={item.id} className="hover:bg-[hsl(220,15%,98%)] transition-colors">
                                            <td className="px-5 py-4 text-sm text-[hsl(220,10%,45%)]">{idx + 1}</td>
                                            <td className="px-5 py-4">
                                                <p className="text-sm font-medium text-[hsl(220,25%,10%)]">{item.descricao}</p>
                                                {item.fornecedor && (
                                                    <p className="text-xs text-[hsl(220,10%,50%)] mt-0.5">🏪 {item.fornecedor}</p>
                                                )}
                                                {item.observacao && (
                                                    <p className="text-xs text-[hsl(220,10%,55%)] mt-0.5 italic">📝 {item.observacao}</p>
                                                )}
                                            </td>
                                            <td className="px-5 py-4 text-center text-sm text-[hsl(220,25%,10%)]">
                                                {item.quantidade} {item.unidade}
                                            </td>
                                            <td className="px-5 py-4 text-right text-sm text-[hsl(220,25%,10%)]">
                                                {item.valor_unitario ? formatCurrency(item.valor_unitario) : '—'}
                                            </td>
                                            <td className="px-5 py-4 text-right text-sm font-semibold text-[hsl(220,25%,10%)]">
                                                {item.valor_total ? formatCurrency(item.valor_total) : '—'}
                                            </td>
                                            <td className="px-5 py-4 text-center">
                                                <Badge
                                                    variant={item.status === StatusItem.APROVADO ? 'success' : item.status === StatusItem.REPROVADO ? 'danger' : 'warning'}
                                                >
                                                    {item.status === StatusItem.APROVADO ? '✓ Aprovado' : item.status === StatusItem.REPROVADO ? '✗ Reprovado' : '⏳ Pendente'}
                                                </Badge>
                                            </td>
                                            <td className="px-5 py-4 text-center">
                                                {item.status === StatusItem.PENDENTE && (
                                                    <div className="flex items-center justify-center gap-1">
                                                        <button
                                                            onClick={() => toast.success(`Item "${item.descricao}" aprovado`)}
                                                            className="w-8 h-8 rounded-lg bg-[hsl(152,55%,95%)] text-[hsl(152,60%,35%)] hover:bg-[hsl(152,55%,90%)] flex items-center justify-center transition-colors touch-target"
                                                            title="Aprovar item"
                                                        >
                                                            <CheckCircle size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => toast.warning(`Item "${item.descricao}" reprovado`)}
                                                            className="w-8 h-8 rounded-lg bg-[hsl(0,70%,96%)] text-[hsl(0,72%,50%)] hover:bg-[hsl(0,70%,92%)] flex items-center justify-center transition-colors touch-target"
                                                            title="Reprovar item"
                                                        >
                                                            <XCircle size={16} />
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="bg-[hsl(220,15%,97%)] border-t-2 border-[hsl(220,15%,88%)]">
                                        <td colSpan={4} className="px-5 py-4 text-sm font-semibold text-[hsl(220,25%,10%)] text-right">
                                            Total Aprovado:
                                        </td>
                                        <td className="px-5 py-4 text-right text-lg font-bold text-[hsl(152,60%,30%)]">
                                            {formatCurrency(valorAprovado)}
                                        </td>
                                        <td colSpan={2} />
                                    </tr>
                                    <tr className="bg-[hsl(220,15%,97%)]">
                                        <td colSpan={4} className="px-5 py-2 text-sm text-[hsl(220,10%,45%)] text-right">
                                            Total Geral:
                                        </td>
                                        <td className="px-5 py-2 text-right text-sm font-semibold text-[hsl(220,25%,10%)]">
                                            {formatCurrency(requisicao.valor_total)}
                                        </td>
                                        <td colSpan={2} />
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>

                    {/* Attachments (RF-REQ-08) */}
                    <div className="bg-white rounded-xl border border-[hsl(220,15%,92%)] p-5">
                        <h2 className="font-semibold text-[hsl(220,25%,10%)] mb-4">Anexos ({requisicao.anexos.length})</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {requisicao.anexos.map((anexo) => (
                                <div key={anexo.id} className="rounded-lg border border-[hsl(220,15%,90%)] overflow-hidden hover:shadow-md transition-all group">
                                    {/* Preview area */}
                                    <div className="h-28 bg-[hsl(220,15%,95%)] flex items-center justify-center relative">
                                        {anexo.tipo.startsWith('image/') ? (
                                            <ImageIcon size={32} className="text-[hsl(220,10%,65%)]" />
                                        ) : (
                                            <FileText size={32} className="text-[hsl(0,60%,55%)]" />
                                        )}
                                        {/* Hover overlay */}
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                            <button className="w-9 h-9 rounded-lg bg-white/90 flex items-center justify-center hover:bg-white transition-colors">
                                                <Eye size={16} className="text-[hsl(220,25%,10%)]" />
                                            </button>
                                            <button className="w-9 h-9 rounded-lg bg-white/90 flex items-center justify-center hover:bg-white transition-colors">
                                                <Download size={16} className="text-[hsl(220,25%,10%)]" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-3">
                                        <p className="text-sm font-medium text-[hsl(220,25%,10%)] truncate">{anexo.nome}</p>
                                        <p className="text-xs text-[hsl(220,10%,50%)] mt-0.5">{anexo.legenda}</p>
                                        <p className="text-xs text-[hsl(220,10%,60%)] mt-1">{(anexo.tamanho / 1024 / 1024).toFixed(1)} MB</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar - Timeline (RF22) */}
                <div className="space-y-6">
                    {/* Value Summary */}
                    <div className="bg-gradient-to-br from-[hsl(210,80%,14%)] to-[hsl(210,75%,20%)] rounded-xl p-5 text-white">
                        <h3 className="text-sm font-medium text-[hsl(210,20%,70%)] mb-3">Resumo Financeiro</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-[hsl(210,20%,70%)]">Valor Total</span>
                                <span className="text-xl font-bold text-[hsl(42,85%,55%)]">{formatCurrency(requisicao.valor_total)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-[hsl(210,20%,70%)]">Aprovados</span>
                                <span className="text-base font-semibold text-white">{formatCurrency(valorAprovado)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-[hsl(210,20%,70%)]">Pendentes</span>
                                <span className="text-base text-[hsl(38,85%,55%)]">{formatCurrency(requisicao.valor_total - valorAprovado)}</span>
                            </div>
                            <div className="h-px bg-white/20 my-2" />
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-[hsl(210,20%,70%)]">Itens aprovados</span>
                                <span className="text-sm font-medium text-white">
                                    {requisicao.itens.filter((i) => i.status === StatusItem.APROVADO).length}/{requisicao.itens.length}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="bg-white rounded-xl border border-[hsl(220,15%,92%)] p-5">
                        <h3 className="font-semibold text-[hsl(220,25%,10%)] mb-4">Linha do Tempo</h3>
                        <div className="space-y-0">
                            {requisicao.timeline.map((event, idx) => (
                                <div key={idx} className="flex gap-3 pb-6 last:pb-0 relative">
                                    {/* Vertical line */}
                                    {idx < requisicao.timeline.length - 1 && (
                                        <div className="absolute left-4 top-8 bottom-0 w-px bg-[hsl(220,15%,88%)]" />
                                    )}
                                    {/* Icon */}
                                    {timelineIcons[event.icon] || timelineIcons.create}
                                    {/* Content */}
                                    <div className="flex-1 min-w-0 pt-0.5">
                                        <p className="text-sm text-[hsl(220,25%,10%)]">{event.descricao}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs text-[hsl(220,10%,50%)]">{event.usuario}</span>
                                            <span className="text-xs text-[hsl(220,10%,65%)]">•</span>
                                            <span className="text-xs text-[hsl(220,10%,60%)]">{formatRelativeTime(event.data)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Approval Modal */}
            <Modal
                isOpen={!!approvalModal}
                onClose={() => { setApprovalModal(null); setJustificativa(''); }}
                title={
                    approvalModal?.type === 'approve'
                        ? 'Confirmar Aprovação'
                        : approvalModal?.type === 'reject'
                            ? 'Reprovar Requisição'
                            : 'Devolver para Revisão'
                }
                description={
                    approvalModal?.type === 'approve'
                        ? 'Confirme a aprovação desta requisição. Esta ação finalizará o processo.'
                        : approvalModal?.type === 'reject'
                            ? 'Selecione o tipo de reprovação e informe a justificativa.'
                            : 'Informe o motivo do retorno para que o solicitante possa fazer os ajustes.'
                }
                size="sm"
            >
                <div className="space-y-4">
                    {approvalModal?.type !== 'approve' && (
                        <div>
                            <label className="block text-sm font-medium text-[hsl(220,25%,10%)] mb-1.5">
                                Justificativa *
                            </label>
                            <textarea
                                value={justificativa}
                                onChange={(e) => setJustificativa(e.target.value)}
                                rows={4}
                                placeholder={
                                    approvalModal?.type === 'reject'
                                        ? 'Motivo da reprovação...'
                                        : 'O que precisa ser ajustado...'
                                }
                                className="w-full rounded-lg border border-[hsl(220,15%,88%)] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(210,80%,22%)] resize-none"
                            />
                        </div>
                    )}

                    <div className="flex justify-end gap-2 pt-2">
                        <Button variant="ghost" onClick={() => { setApprovalModal(null); setJustificativa(''); }}>
                            Cancelar
                        </Button>
                        <Button
                            variant={approvalModal?.type === 'approve' ? 'primary' : approvalModal?.type === 'reject' ? 'danger' : 'secondary'}
                            onClick={() =>
                                handleApproval(
                                    approvalModal?.type === 'approve'
                                        ? DecisaoAprovacao.APROVADO
                                        : approvalModal?.type === 'reject'
                                            ? DecisaoAprovacao.REPROVADO
                                            : DecisaoAprovacao.RETORNO
                                )
                            }
                            icon={
                                approvalModal?.type === 'approve'
                                    ? <CheckCircle size={16} />
                                    : approvalModal?.type === 'reject'
                                        ? <XCircle size={16} />
                                        : <RotateCcw size={16} />
                            }
                        >
                            {approvalModal?.type === 'approve' ? 'Confirmar Aprovação' : approvalModal?.type === 'reject' ? 'Reprovar' : 'Devolver'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
