'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { toast } from '@/components/ui/Toast';
import { validarSenha } from '@/lib/utils';
import { User, Mail, Building2, Shield, Key, Save, Camera } from 'lucide-react';

export default function PerfilPage() {
    const [nome, setNome] = useState('Gabriel Administrador');
    const [email] = useState('gabriel@adlgroup.com.br');
    const [cargo] = useState('CEO');
    const [saving, setSaving] = useState(false);

    // Password change
    const [senhaAtual, setSenhaAtual] = useState('');
    const [novaSenha, setNovaSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [senhaErrors, setSenhaErrors] = useState<string[]>([]);

    const handleSaveProfile = () => {
        setSaving(true);
        setTimeout(() => {
            setSaving(false);
            toast.success('Perfil atualizado com sucesso!');
        }, 1000);
    };

    const handleChangePassword = () => {
        if (!senhaAtual) {
            toast.error('Informe a senha atual');
            return;
        }
        const validation = validarSenha(novaSenha);
        if (!validation.valida) {
            setSenhaErrors(validation.erros);
            return;
        }
        if (novaSenha !== confirmarSenha) {
            toast.error('As senhas não conferem');
            return;
        }
        setSenhaErrors([]);
        toast.success('Senha alterada com sucesso!');
        setSenhaAtual('');
        setNovaSenha('');
        setConfirmarSenha('');
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
            <div>
                <h1 className="text-2xl font-bold text-[hsl(220,25%,10%)]">Meu Perfil</h1>
                <p className="text-sm text-[hsl(220,10%,45%)] mt-1">Gerencie suas informações pessoais e senha</p>
            </div>

            {/* Avatar & Info */}
            <div className="bg-white rounded-xl border border-[hsl(220,15%,92%)] p-6">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[hsl(210,70%,32%)] to-[hsl(210,80%,22%)] flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                            GA
                        </div>
                        <button className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-white border-2 border-[hsl(220,15%,88%)] flex items-center justify-center hover:border-[hsl(210,80%,40%)] transition-colors shadow-sm">
                            <Camera size={14} className="text-[hsl(220,10%,45%)]" />
                        </button>
                    </div>
                    <div className="text-center sm:text-left">
                        <h2 className="text-xl font-bold text-[hsl(220,25%,10%)]">{nome}</h2>
                        <p className="text-sm text-[hsl(220,10%,45%)]">{email}</p>
                        <div className="flex items-center gap-2 mt-2 justify-center sm:justify-start">
                            <Badge variant="gold"><Shield size={10} /> Master</Badge>
                            <Badge variant="info"><Building2 size={10} /> Matriz SP</Badge>
                        </div>
                    </div>
                </div>
            </div>

            {/* Personal Info */}
            <div className="bg-white rounded-xl border border-[hsl(220,15%,92%)] p-6">
                <h3 className="text-base font-semibold text-[hsl(220,25%,10%)] mb-4 flex items-center gap-2">
                    <User size={18} className="text-[hsl(210,80%,35%)]" />
                    Informações Pessoais
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label="Nome Completo" value={nome} onChange={(e) => setNome(e.target.value)} icon={<User size={16} />} />
                    <Input label="E-mail" value={email} disabled icon={<Mail size={16} />} hint="Não é possível alterar o email" />
                    <Input label="Cargo" value={cargo} disabled icon={<Shield size={16} />} />
                    <Input label="Filial Base" value="Matriz - São Paulo" disabled icon={<Building2 size={16} />} />
                </div>
                <div className="flex justify-end mt-4">
                    <Button onClick={handleSaveProfile} loading={saving} icon={<Save size={16} />}>
                        Salvar Alterações
                    </Button>
                </div>
            </div>

            {/* Password Change */}
            <div className="bg-white rounded-xl border border-[hsl(220,15%,92%)] p-6">
                <h3 className="text-base font-semibold text-[hsl(220,25%,10%)] mb-4 flex items-center gap-2">
                    <Key size={18} className="text-[hsl(38,80%,45%)]" />
                    Alterar Senha
                </h3>
                <div className="space-y-4 max-w-md">
                    <Input
                        label="Senha Atual"
                        type="password"
                        value={senhaAtual}
                        onChange={(e) => setSenhaAtual(e.target.value)}
                        placeholder="••••••••"
                    />
                    <Input
                        label="Nova Senha"
                        type="password"
                        value={novaSenha}
                        onChange={(e) => { setNovaSenha(e.target.value); setSenhaErrors([]); }}
                        placeholder="••••••••"
                        error={senhaErrors.length > 0 ? senhaErrors.join(', ') : undefined}
                        hint="Mín. 8 caracteres, maiúscula, número e símbolo"
                    />
                    <Input
                        label="Confirmar Nova Senha"
                        type="password"
                        value={confirmarSenha}
                        onChange={(e) => setConfirmarSenha(e.target.value)}
                        placeholder="••••••••"
                        error={confirmarSenha && novaSenha !== confirmarSenha ? 'As senhas não conferem' : undefined}
                    />
                </div>
                <div className="flex justify-end mt-4">
                    <Button variant="secondary" onClick={handleChangePassword} icon={<Key size={16} />}>
                        Alterar Senha
                    </Button>
                </div>
            </div>
        </div>
    );
}
