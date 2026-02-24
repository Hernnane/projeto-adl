'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { toast } from '@/components/ui/Toast';
import { Building2, MapPin, Users, Plus, Edit, FileText } from 'lucide-react';

const filiais = [
    { id: '1', nome: 'Matriz ADL Group', cidade: 'São Paulo', estado: 'SP', cnpj: '12.345.678/0001-00', ie: '123.456.789.000', responsavel: 'Gabriel Administrador', status: 'ATIVO', usuarios: 15, cep: '01310-100', endereco: 'Av. Paulista, 1500' },
    { id: '2', nome: 'Fábrica de Processamento', cidade: 'Rio de Janeiro', estado: 'RJ', cnpj: '12.345.678/0002-81', ie: '987.654.321.000', responsavel: 'Carlos Eduardo Gerente', status: 'ATIVO', usuarios: 32, cep: '20040-020', endereco: 'Rua Industrial, 450' },
    { id: '3', nome: 'Centro de Pesquisa', cidade: 'Salvador', estado: 'BA', cnpj: '12.345.678/0003-62', ie: '456.789.123.000', responsavel: 'Maria Luísa Oliveira', status: 'ATIVO', usuarios: 8, cep: '40140-130', endereco: 'Av. Tancredo Neves, 1200' },
];

export default function FiliaisPage() {
    const [showModal, setShowModal] = useState(false);

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[hsl(220,25%,10%)]">Filiais</h1>
                    <p className="text-sm text-[hsl(220,10%,45%)] mt-1">{filiais.length} unidades de negócio</p>
                </div>
                <Button icon={<Plus size={18} />} onClick={() => { setShowModal(true); toast.info('Abrir formulário de nova filial'); }}>
                    Nova Filial
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 stagger-list">
                {filiais.map((filial) => (
                    <div key={filial.id} className="bg-white rounded-xl border border-[hsl(220,15%,92%)] overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
                        {/* Header gradient */}
                        <div className="h-2 bg-gradient-to-r from-[hsl(210,80%,22%)] to-[hsl(42,85%,55%)]" />

                        <div className="p-5">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-[hsl(220,25%,10%)]">{filial.nome}</h3>
                                    <div className="flex items-center gap-1.5 mt-1 text-sm text-[hsl(220,10%,45%)]">
                                        <MapPin size={14} />
                                        <span>{filial.cidade} - {filial.estado}</span>
                                    </div>
                                </div>
                                <Badge variant="success" size="sm">● {filial.status}</Badge>
                            </div>

                            {/* Info grid */}
                            <div className="space-y-3 mb-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-[hsl(220,10%,50%)]">CNPJ</span>
                                    <span className="font-mono text-[hsl(220,25%,10%)] text-xs">{filial.cnpj}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-[hsl(220,10%,50%)]">IE</span>
                                    <span className="font-mono text-[hsl(220,25%,10%)] text-xs">{filial.ie}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-[hsl(220,10%,50%)]">Responsável</span>
                                    <span className="font-medium text-[hsl(220,25%,10%)]">{filial.responsavel}</span>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="pt-3 border-t border-[hsl(220,15%,94%)] flex items-center justify-between">
                                <div className="flex items-center gap-1.5 text-sm text-[hsl(220,10%,50%)]">
                                    <Users size={14} />
                                    <span>{filial.usuarios} usuários</span>
                                </div>
                                <button className="p-2 rounded-lg hover:bg-[hsl(220,15%,94%)] transition-colors opacity-0 group-hover:opacity-100">
                                    <Edit size={16} className="text-[hsl(220,10%,50%)]" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
