'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { toast } from '@/components/ui/Toast';
import { Perfil, PERFIL_LABEL, StatusUsuario } from '@/types';
import { getInitials } from '@/lib/utils';
import { Plus, Search, MoreVertical, Mail, Shield, Building2, Edit, Power } from 'lucide-react';

const usuarios = [
    { id: '1', nome: 'Gabriel Administrador', email: 'gabriel@adlgroup.com.br', perfil: Perfil.MASTER, filial: 'Matriz SP', cargo: 'CEO', status: StatusUsuario.ATIVO },
    { id: '2', nome: 'Ana Carolina Costa', email: 'ana.costa@adlgroup.com.br', perfil: Perfil.ADMINISTRADOR, filial: 'Matriz SP', cargo: 'Coord. Administrativo', status: StatusUsuario.ATIVO },
    { id: '3', nome: 'Carlos Eduardo Gerente', email: 'carlos.gerente@adlgroup.com.br', perfil: Perfil.GERENTE_LOCAL, filial: 'Fábrica RJ', cargo: 'Gerente de Produção', status: StatusUsuario.ATIVO },
    { id: '4', nome: 'João Pedro Silva', email: 'joao.silva@adlgroup.com.br', perfil: Perfil.OPERACIONAL, filial: 'Fábrica RJ', cargo: 'Operador de Máquinas', status: StatusUsuario.ATIVO },
    { id: '5', nome: 'Maria Luísa Oliveira', email: 'maria.oliveira@adlgroup.com.br', perfil: Perfil.GERENTE_LOCAL, filial: 'Pesquisa BA', cargo: 'Coord. de Pesquisa', status: StatusUsuario.ATIVO },
    { id: '6', nome: 'Pedro Henrique Lima', email: 'pedro.lima@adlgroup.com.br', perfil: Perfil.OPERACIONAL, filial: 'Fábrica RJ', cargo: 'Técnico de Manutenção', status: StatusUsuario.INATIVO },
    { id: '7', nome: 'Fernanda Souza', email: 'fernanda@adlgroup.com.br', perfil: Perfil.OPERACIONAL, filial: 'Pesquisa BA', cargo: 'Pesquisadora', status: StatusUsuario.PENDENTE },
];

const perfilColors: Record<Perfil, string> = {
    [Perfil.MASTER]: 'gold',
    [Perfil.ADMINISTRADOR]: 'info',
    [Perfil.GERENTE_LOCAL]: 'success',
    [Perfil.OPERACIONAL]: 'default',
};

const statusColors: Record<StatusUsuario, 'success' | 'danger' | 'warning' | 'default'> = {
    [StatusUsuario.ATIVO]: 'success',
    [StatusUsuario.INATIVO]: 'danger',
    [StatusUsuario.PENDENTE]: 'warning',
    [StatusUsuario.BLOQUEADO]: 'danger',
};

export default function UsuariosPage() {
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [perfil, setPerfil] = useState('');
    const [filial, setFilial] = useState('');
    const [cargo, setCargo] = useState('');

    const filtered = usuarios.filter((u) => {
        if (!search) return true;
        const q = search.toLowerCase();
        return u.nome.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.cargo.toLowerCase().includes(q);
    });

    const handleSubmit = () => {
        if (!nome || !email || !perfil || !filial) {
            toast.error('Preencha todos os campos obrigatórios');
            return;
        }
        toast.success('Convite enviado!', `Um email de ativação foi enviado para ${email}`);
        setShowModal(false);
        setNome(''); setEmail(''); setPerfil(''); setFilial(''); setCargo('');
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[hsl(220,25%,10%)]">Usuários</h1>
                    <p className="text-sm text-[hsl(220,10%,45%)] mt-1">{usuarios.length} usuários cadastrados</p>
                </div>
                <Button icon={<Plus size={18} />} onClick={() => setShowModal(true)}>
                    Novo Usuário
                </Button>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(220,10%,55%)]" />
                <input
                    type="text"
                    placeholder="Buscar por nome, email ou cargo..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[hsl(220,15%,88%)] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(210,80%,22%)] transition-all"
                />
            </div>

            {/* Users Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 stagger-list">
                {filtered.map((user) => (
                    <div key={user.id} className="bg-white rounded-xl border border-[hsl(220,15%,92%)] p-5 hover:shadow-md transition-all hover:-translate-y-0.5 group">
                        <div className="flex items-start gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${user.perfil === Perfil.MASTER
                                    ? 'bg-gradient-to-br from-[hsl(42,85%,55%)] to-[hsl(42,80%,45%)] text-[hsl(210,80%,14%)]'
                                    : 'bg-gradient-to-br from-[hsl(210,70%,32%)] to-[hsl(210,80%,22%)] text-white'
                                }`}>
                                {getInitials(user.nome)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-semibold text-[hsl(220,25%,10%)] truncate">{user.nome}</h3>
                                <p className="text-xs text-[hsl(220,10%,50%)] truncate">{user.cargo}</p>
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                    <Badge variant={perfilColors[user.perfil] as 'gold' | 'info' | 'success' | 'default'} size="sm">
                                        <Shield size={10} /> {PERFIL_LABEL[user.perfil]}
                                    </Badge>
                                    <Badge variant={statusColors[user.status]} size="sm">
                                        {user.status === StatusUsuario.ATIVO ? '● Ativo' : user.status === StatusUsuario.PENDENTE ? '◐ Pendente' : '○ Inativo'}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 pt-3 border-t border-[hsl(220,15%,94%)] flex items-center justify-between">
                            <div className="flex items-center gap-3 text-xs text-[hsl(220,10%,50%)]">
                                <span className="flex items-center gap-1"><Mail size={12} /> {user.email.split('@')[0]}</span>
                                <span className="flex items-center gap-1"><Building2 size={12} /> {user.filial}</span>
                            </div>
                            <button className="p-1.5 rounded-lg hover:bg-[hsl(220,15%,94%)] transition-colors opacity-0 group-hover:opacity-100">
                                <MoreVertical size={16} className="text-[hsl(220,10%,50%)]" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* New User Modal */}
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Cadastrar Novo Usuário" description="Um convite de ativação será enviado por email.">
                <div className="space-y-4">
                    <Input label="Nome Completo *" placeholder="Ex: João Pedro Silva" value={nome} onChange={(e) => setNome(e.target.value)} />
                    <Input label="E-mail *" type="email" placeholder="joao@adlgroup.com.br" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-[hsl(220,25%,10%)] mb-1.5">Perfil *</label>
                            <select value={perfil} onChange={(e) => setPerfil(e.target.value)} className="w-full rounded-lg border border-[hsl(220,15%,88%)] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(210,80%,22%)]">
                                <option value="">Selecione...</option>
                                {Object.entries(PERFIL_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[hsl(220,25%,10%)] mb-1.5">Filial Base *</label>
                            <select value={filial} onChange={(e) => setFilial(e.target.value)} className="w-full rounded-lg border border-[hsl(220,15%,88%)] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(210,80%,22%)]">
                                <option value="">Selecione...</option>
                                <option value="sp">Matriz SP</option>
                                <option value="rj">Fábrica RJ</option>
                                <option value="ba">Pesquisa BA</option>
                            </select>
                        </div>
                    </div>
                    <Input label="Cargo" placeholder="Ex: Operador de Máquinas" value={cargo} onChange={(e) => setCargo(e.target.value)} />
                    <div className="flex justify-end gap-2 pt-2">
                        <Button variant="ghost" onClick={() => setShowModal(false)}>Cancelar</Button>
                        <Button onClick={handleSubmit} icon={<Mail size={16} />}>Enviar Convite</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
