'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { toast } from '@/components/ui/Toast';
import { Plus, Edit, Layers, Users, Building2 } from 'lucide-react';

const setores = [
    { id: '1', nome: 'Manutenção', descricao: 'Manutenção preventiva e corretiva de equipamentos industriais', status: 'ATIVO', filiais: ['Fábrica RJ'], usuarios: 12 },
    { id: '2', nome: 'Operações', descricao: 'Operação de equipamentos de mineração e processamento', status: 'ATIVO', filiais: ['Fábrica RJ', 'Pesquisa BA'], usuarios: 18 },
    { id: '3', nome: 'Laboratório', descricao: 'Análise química e física de amostras minerais', status: 'ATIVO', filiais: ['Pesquisa BA'], usuarios: 6 },
    { id: '4', nome: 'Administrativo', descricao: 'Gestão financeira, contábil e recursos humanos', status: 'ATIVO', filiais: ['Matriz SP'], usuarios: 8 },
    { id: '5', nome: 'Logística', descricao: 'Transporte, armazenamento e distribuição de materiais', status: 'ATIVO', filiais: ['Fábrica RJ', 'Matriz SP'], usuarios: 5 },
    { id: '6', nome: 'Compras', descricao: 'Cotação, negociação e aquisição de materiais e serviços', status: 'ATIVO', filiais: ['Matriz SP'], usuarios: 3 },
    { id: '7', nome: 'Segurança do Trabalho', descricao: 'NR/ISO, EPIs, treinamentos de segurança', status: 'ATIVO', filiais: ['Fábrica RJ', 'Pesquisa BA'], usuarios: 4 },
];

export default function SetoresPage() {
    const [showModal, setShowModal] = useState(false);
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');

    const handleSubmit = () => {
        if (!nome.trim()) {
            toast.error('Informe o nome do setor');
            return;
        }
        toast.success('Setor criado com sucesso!');
        setShowModal(false);
        setNome('');
        setDescricao('');
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[hsl(220,25%,10%)]">Setores</h1>
                    <p className="text-sm text-[hsl(220,10%,45%)] mt-1">Catálogo global de setores da empresa</p>
                </div>
                <Button icon={<Plus size={18} />} onClick={() => setShowModal(true)}>
                    Novo Setor
                </Button>
            </div>

            <div className="bg-white rounded-xl border border-[hsl(220,15%,92%)] overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="bg-[hsl(220,15%,97%)] text-xs font-medium text-[hsl(220,10%,45%)] uppercase tracking-wider">
                            <th className="text-left px-5 py-3">Setor</th>
                            <th className="text-left px-5 py-3 hidden md:table-cell">Descrição</th>
                            <th className="text-center px-5 py-3">Filiais</th>
                            <th className="text-center px-5 py-3">Usuários</th>
                            <th className="text-center px-5 py-3">Status</th>
                            <th className="text-center px-5 py-3">Ação</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[hsl(220,15%,95%)]">
                        {setores.map((setor) => (
                            <tr key={setor.id} className="hover:bg-[hsl(220,15%,98%)] transition-colors group">
                                <td className="px-5 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-lg bg-[hsl(210,75%,95%)] flex items-center justify-center flex-shrink-0">
                                            <Layers size={16} className="text-[hsl(210,80%,40%)]" />
                                        </div>
                                        <span className="text-sm font-semibold text-[hsl(220,25%,10%)]">{setor.nome}</span>
                                    </div>
                                </td>
                                <td className="px-5 py-4 text-sm text-[hsl(220,10%,45%)] hidden md:table-cell max-w-xs truncate">{setor.descricao}</td>
                                <td className="px-5 py-4 text-center">
                                    <div className="flex flex-wrap gap-1 justify-center">
                                        {setor.filiais.map((f) => (
                                            <Badge key={f} variant="default" size="sm">
                                                <Building2 size={10} /> {f}
                                            </Badge>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-5 py-4 text-center">
                                    <span className="text-sm font-medium text-[hsl(220,25%,10%)] flex items-center gap-1 justify-center">
                                        <Users size={14} className="text-[hsl(220,10%,50%)]" /> {setor.usuarios}
                                    </span>
                                </td>
                                <td className="px-5 py-4 text-center">
                                    <Badge variant="success" size="sm">● Ativo</Badge>
                                </td>
                                <td className="px-5 py-4 text-center">
                                    <button className="p-2 rounded-lg hover:bg-[hsl(220,15%,94%)] transition-colors opacity-0 group-hover:opacity-100">
                                        <Edit size={16} className="text-[hsl(220,10%,50%)]" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Novo Setor" description="Crie um novo setor no catálogo global" size="sm">
                <div className="space-y-4">
                    <Input label="Nome do Setor *" placeholder="Ex: Controle de Qualidade" value={nome} onChange={(e) => setNome(e.target.value)} />
                    <div>
                        <label className="block text-sm font-medium text-[hsl(220,25%,10%)] mb-1.5">Descrição</label>
                        <textarea
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                            rows={3}
                            placeholder="Descreva as responsabilidades do setor..."
                            className="w-full rounded-lg border border-[hsl(220,15%,88%)] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(210,80%,22%)] resize-none"
                        />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <Button variant="ghost" onClick={() => setShowModal(false)}>Cancelar</Button>
                        <Button onClick={handleSubmit}>Criar Setor</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
