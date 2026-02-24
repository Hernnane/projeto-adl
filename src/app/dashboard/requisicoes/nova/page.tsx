'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { toast } from '@/components/ui/Toast';
import { Prioridade, PRIORIDADE_LABEL } from '@/types';
import {
    Plus,
    Trash2,
    Upload,
    ArrowLeft,
    Save,
    Send,
    AlertTriangle,
    Package,
    X,
    FileText,
} from 'lucide-react';
import Link from 'next/link';

interface ItemForm {
    id: string;
    descricao: string;
    quantidade: string;
    unidade: string;
    valor_unitario: string;
    fornecedor: string;
    observacao: string;
}

interface AnexoForm {
    id: string;
    file: File | null;
    legenda: string;
    preview?: string;
}

const emptyItem = (): ItemForm => ({
    id: Math.random().toString(36).slice(2),
    descricao: '',
    quantidade: '1',
    unidade: 'UN',
    valor_unitario: '',
    fornecedor: '',
    observacao: '',
});

export default function NovaRequisicaoPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Form state
    const [descricao, setDescricao] = useState('');
    const [prioridade, setPrioridade] = useState<Prioridade>(Prioridade.NORMAL);
    const [justificativa, setJustificativa] = useState('');
    const [itens, setItens] = useState<ItemForm[]>([emptyItem()]);
    const [anexos, setAnexos] = useState<AnexoForm[]>([]);

    // Filiais e setores demo
    const [filial, setFilial] = useState('');
    const [setor, setSetor] = useState('');

    const addItem = () => {
        setItens([...itens, emptyItem()]);
    };

    const removeItem = (id: string) => {
        if (itens.length === 1) {
            toast.warning('A requisição precisa ter pelo menos 1 item');
            return;
        }
        setItens(itens.filter((i) => i.id !== id));
    };

    const updateItem = (id: string, field: keyof ItemForm, value: string) => {
        setItens(itens.map((i) => (i.id === id ? { ...i, [field]: value } : i)));
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        Array.from(files).forEach((file) => {
            if (file.size > 10 * 1024 * 1024) {
                toast.error('Arquivo muito grande', `${file.name} excede o limite de 10MB`);
                return;
            }

            const preview = file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined;
            setAnexos((prev) => [
                ...prev,
                { id: Math.random().toString(36).slice(2), file, legenda: '', preview },
            ]);
        });
        e.target.value = '';
    };

    const removeAnexo = (id: string) => {
        setAnexos(anexos.filter((a) => a.id !== id));
    };

    const calcularTotal = () => {
        return itens.reduce((sum, item) => {
            const qty = parseFloat(item.quantidade) || 0;
            const price = parseFloat(item.valor_unitario) || 0;
            return sum + qty * price;
        }, 0);
    };

    const handleSubmit = (asDraft: boolean) => {
        if (!descricao.trim()) {
            toast.error('Preencha a descrição da requisição');
            return;
        }
        if (!filial) {
            toast.error('Selecione a filial');
            return;
        }
        if (itens.some((i) => !i.descricao.trim())) {
            toast.error('Preencha a descrição de todos os itens');
            return;
        }
        if (prioridade !== Prioridade.NORMAL && !justificativa.trim()) {
            toast.error('Justifique a prioridade acima de Normal');
            return;
        }

        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            if (asDraft) {
                toast.success('Rascunho salvo com sucesso!');
            } else {
                toast.success('Requisição enviada para aprovação!');
                router.push('/dashboard/requisicoes');
            }
        }, 1500);
    };

    const total = calcularTotal();

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/dashboard/requisicoes">
                    <Button variant="ghost" size="sm" icon={<ArrowLeft size={18} />}>
                        Voltar
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-[hsl(220,25%,10%)]">Nova Requisição</h1>
                    <p className="text-sm text-[hsl(220,10%,45%)]">Preencha os dados para solicitar materiais ou serviços</p>
                </div>
            </div>

            {/* General Info */}
            <div className="bg-white rounded-xl border border-[hsl(220,15%,92%)] p-6">
                <h2 className="text-base font-semibold text-[hsl(220,25%,10%)] mb-4">Informações Gerais</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                        <Input
                            label="Descrição da Requisição *"
                            placeholder="Ex: Peças de reposição para britador primário"
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[hsl(220,25%,10%)] mb-1.5">Filial *</label>
                        <select
                            value={filial}
                            onChange={(e) => setFilial(e.target.value)}
                            className="w-full rounded-lg border border-[hsl(220,15%,88%)] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(210,80%,22%)] hover:border-[hsl(220,15%,75%)] transition-all"
                        >
                            <option value="">Selecione...</option>
                            <option value="sp">Matriz - São Paulo</option>
                            <option value="rj">Fábrica - Rio de Janeiro</option>
                            <option value="ba">Pesquisa - Bahia</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[hsl(220,25%,10%)] mb-1.5">Setor</label>
                        <select
                            value={setor}
                            onChange={(e) => setSetor(e.target.value)}
                            className="w-full rounded-lg border border-[hsl(220,15%,88%)] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(210,80%,22%)] hover:border-[hsl(220,15%,75%)] transition-all"
                        >
                            <option value="">Selecione...</option>
                            <option value="manut">Manutenção</option>
                            <option value="ops">Operações</option>
                            <option value="lab">Laboratório</option>
                            <option value="adm">Administrativo</option>
                            <option value="log">Logística</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[hsl(220,25%,10%)] mb-1.5">Prioridade *</label>
                        <div className="flex gap-2">
                            {Object.entries(PRIORIDADE_LABEL).map(([key, label]) => (
                                <button
                                    key={key}
                                    type="button"
                                    onClick={() => setPrioridade(key as Prioridade)}
                                    className={`flex-1 px-3 py-2.5 rounded-lg text-sm font-medium border-2 transition-all ${prioridade === key
                                            ? key === 'EMERGENCIA'
                                                ? 'border-[hsl(0,72%,51%)] bg-[hsl(0,70%,97%)] text-[hsl(0,72%,45%)]'
                                                : key === 'URGENTE'
                                                    ? 'border-[hsl(38,95%,55%)] bg-[hsl(38,90%,96%)] text-[hsl(38,80%,35%)]'
                                                    : 'border-[hsl(210,80%,22%)] bg-[hsl(210,75%,97%)] text-[hsl(210,80%,25%)]'
                                            : 'border-[hsl(220,15%,88%)] text-[hsl(220,10%,45%)] hover:border-[hsl(220,15%,75%)]'
                                        }`}
                                >
                                    {key === 'EMERGENCIA' && '🔴 '}
                                    {key === 'URGENTE' && '🟠 '}
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div />
                    {prioridade !== Prioridade.NORMAL && (
                        <div className="sm:col-span-2">
                            <div className="flex items-start gap-2 p-3 rounded-lg bg-[hsl(38,90%,96%)] border border-[hsl(38,85%,80%)] mb-3">
                                <AlertTriangle size={16} className="text-[hsl(38,80%,40%)] mt-0.5 flex-shrink-0" />
                                <p className="text-sm text-[hsl(38,70%,30%)]">
                                    Requisições com prioridade acima de Normal exigem uma justificativa detalhada.
                                </p>
                            </div>
                            <label className="block text-sm font-medium text-[hsl(220,25%,10%)] mb-1.5">
                                Justificativa de {PRIORIDADE_LABEL[prioridade]} *
                            </label>
                            <textarea
                                value={justificativa}
                                onChange={(e) => setJustificativa(e.target.value)}
                                rows={3}
                                placeholder="Explique o motivo da urgência..."
                                className="w-full rounded-lg border border-[hsl(220,15%,88%)] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(210,80%,22%)] hover:border-[hsl(220,15%,75%)] transition-all resize-none"
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Items (RF-REQ-01) */}
            <div className="bg-white rounded-xl border border-[hsl(220,15%,92%)] p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-semibold text-[hsl(220,25%,10%)] flex items-center gap-2">
                        <Package size={18} className="text-[hsl(210,80%,35%)]" />
                        Itens da Requisição
                    </h2>
                    <Button variant="outline" size="sm" onClick={addItem} icon={<Plus size={16} />}>
                        Adicionar Item
                    </Button>
                </div>

                <div className="space-y-4">
                    {itens.map((item, index) => (
                        <div key={item.id} className="p-4 rounded-lg border border-[hsl(220,15%,90%)] bg-[hsl(220,20%,98%)] relative group">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-semibold text-[hsl(210,80%,35%)] bg-[hsl(210,75%,95%)] px-2 py-0.5 rounded-full">
                                    Item {index + 1}
                                </span>
                                {itens.length > 1 && (
                                    <button
                                        onClick={() => removeItem(item.id)}
                                        className="text-[hsl(0,60%,55%)] hover:text-[hsl(0,72%,45%)] transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-6 gap-3">
                                <div className="sm:col-span-3">
                                    <Input
                                        label="Descrição *"
                                        placeholder="Ex: Correia transportadora 1500mm"
                                        value={item.descricao}
                                        onChange={(e) => updateItem(item.id, 'descricao', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Input
                                        label="Qtd *"
                                        type="number"
                                        min="1"
                                        value={item.quantidade}
                                        onChange={(e) => updateItem(item.id, 'quantidade', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[hsl(220,25%,10%)] mb-1.5">Un.</label>
                                    <select
                                        value={item.unidade}
                                        onChange={(e) => updateItem(item.id, 'unidade', e.target.value)}
                                        className="w-full rounded-lg border border-[hsl(220,15%,88%)] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(210,80%,22%)]"
                                    >
                                        <option value="UN">UN</option>
                                        <option value="KG">KG</option>
                                        <option value="L">L</option>
                                        <option value="M">M</option>
                                        <option value="CX">CX</option>
                                        <option value="PCT">PCT</option>
                                    </select>
                                </div>
                                <div>
                                    <Input
                                        label="Valor Unit. (R$)"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        placeholder="0,00"
                                        value={item.valor_unitario}
                                        onChange={(e) => updateItem(item.id, 'valor_unitario', e.target.value)}
                                        hint="Opcional para operacional"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                                <Input
                                    label="Fornecedor sugerido"
                                    placeholder="Ex: Correias Brasil LTDA"
                                    value={item.fornecedor}
                                    onChange={(e) => updateItem(item.id, 'fornecedor', e.target.value)}
                                />
                                <Input
                                    label="Observação"
                                    placeholder="Detalhes adicionais..."
                                    value={item.observacao}
                                    onChange={(e) => updateItem(item.id, 'observacao', e.target.value)}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Totals */}
                <div className="mt-4 pt-4 border-t border-[hsl(220,15%,92%)] flex items-center justify-between">
                    <span className="text-sm text-[hsl(220,10%,45%)]">
                        {itens.length} item(ns)
                    </span>
                    <div className="text-right">
                        <p className="text-xs text-[hsl(220,10%,45%)]">Total estimado</p>
                        <p className="text-xl font-bold text-[hsl(220,25%,10%)]">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Attachments (RF-REQ-08) */}
            <div className="bg-white rounded-xl border border-[hsl(220,15%,92%)] p-6">
                <h2 className="text-base font-semibold text-[hsl(220,25%,10%)] mb-4 flex items-center gap-2">
                    <Upload size={18} className="text-[hsl(210,80%,35%)]" />
                    Anexos
                </h2>

                {/* Upload area */}
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[hsl(220,15%,85%)] rounded-xl cursor-pointer hover:border-[hsl(210,80%,50%)] hover:bg-[hsl(210,75%,98%)] transition-all group">
                    <div className="flex flex-col items-center">
                        <Upload size={24} className="text-[hsl(220,10%,55%)] group-hover:text-[hsl(210,80%,40%)] transition-colors mb-2" />
                        <p className="text-sm text-[hsl(220,10%,45%)]">
                            <span className="font-medium text-[hsl(210,80%,35%)]">Clique para enviar</span> ou arraste arquivos
                        </p>
                        <p className="text-xs text-[hsl(220,10%,60%)] mt-1">JPG, PNG, PDF, XLS até 10MB</p>
                    </div>
                    <input
                        type="file"
                        className="hidden"
                        multiple
                        accept=".jpg,.jpeg,.png,.pdf,.xls,.xlsx,.csv"
                        onChange={handleFileUpload}
                    />
                </label>

                {/* Uploaded files */}
                {anexos.length > 0 && (
                    <div className="mt-4 space-y-2">
                        {anexos.map((anexo) => (
                            <div key={anexo.id} className="flex items-center gap-3 p-3 rounded-lg border border-[hsl(220,15%,90%)] bg-[hsl(220,20%,98%)]">
                                {anexo.preview ? (
                                    <img src={anexo.preview} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                                ) : (
                                    <div className="w-10 h-10 rounded-lg bg-[hsl(0,70%,95%)] flex items-center justify-center flex-shrink-0">
                                        <FileText size={18} className="text-[hsl(0,72%,50%)]" />
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-[hsl(220,25%,10%)] truncate">{anexo.file?.name}</p>
                                    <input
                                        type="text"
                                        placeholder="Legenda do arquivo (obrigatório)"
                                        value={anexo.legenda}
                                        onChange={(e) => {
                                            setAnexos(anexos.map((a) => a.id === anexo.id ? { ...a, legenda: e.target.value } : a));
                                        }}
                                        className="w-full text-xs text-[hsl(220,10%,45%)] mt-1 bg-transparent border-b border-[hsl(220,15%,85%)] focus:outline-none focus:border-[hsl(210,80%,40%)] py-0.5"
                                    />
                                </div>
                                <button
                                    onClick={() => removeAnexo(anexo.id)}
                                    className="text-[hsl(220,10%,60%)] hover:text-[hsl(0,72%,50%)] transition-colors flex-shrink-0"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 pb-6">
                <Button
                    variant="outline"
                    onClick={() => handleSubmit(true)}
                    icon={<Save size={16} />}
                    loading={loading}
                >
                    Salvar Rascunho
                </Button>
                <Button
                    variant="primary"
                    onClick={() => handleSubmit(false)}
                    icon={<Send size={16} />}
                    loading={loading}
                >
                    Enviar para Aprovação
                </Button>
            </div>
        </div>
    );
}
