'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { toast } from '@/components/ui/Toast';
import { ToastContainer } from '@/components/ui/Toast';
import { Mail, Lock, Gem } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // Contas demo para teste
    const demoAccounts = [
        { email: 'ceo@adl.com', password: 'Adl@2026', nome: 'Gabriel CEO', perfil: 'Master / CEO', cor: 'from-[hsl(42,85%,55%)] to-[hsl(42,80%,45%)]', textCor: 'text-[hsl(210,80%,14%)]' },
        { email: 'admin@adl.com', password: 'Adl@2026', nome: 'Ana Admin', perfil: 'Administrador', cor: 'from-[hsl(210,80%,35%)] to-[hsl(210,80%,22%)]', textCor: 'text-white' },
        { email: 'gerente@adl.com', password: 'Adl@2026', nome: 'Carlos Gerente', perfil: 'Gerente Local', cor: 'from-[hsl(152,60%,40%)] to-[hsl(152,55%,32%)]', textCor: 'text-white' },
        { email: 'operador@adl.com', password: 'Adl@2026', nome: 'João Operador', perfil: 'Operacional', cor: 'from-[hsl(220,15%,55%)] to-[hsl(220,15%,42%)]', textCor: 'text-white' },
    ];

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            toast.error('Preencha todos os campos');
            return;
        }

        setLoading(true);

        // Verificar credenciais demo
        const account = demoAccounts.find(a => a.email === email);

        setTimeout(() => {
            if (account && password === account.password) {
                localStorage.setItem('sca_demo_user', JSON.stringify({
                    nome: account.nome,
                    email: account.email,
                    perfil: account.perfil,
                }));
                toast.success(`Bem-vindo, ${account.nome}!`);
                router.push('/dashboard');
            } else if (account && password !== account.password) {
                setLoading(false);
                toast.error('Senha incorreta', 'Use: Adl@2026');
            } else {
                setLoading(false);
                toast.error('Credenciais inválidas', 'Use uma das contas demo abaixo');
            }
        }, 800);
    };

    const quickLogin = (account: typeof demoAccounts[0]) => {
        setEmail(account.email);
        setPassword(account.password);
        setLoading(true);
        localStorage.setItem('sca_demo_user', JSON.stringify({
            nome: account.nome,
            email: account.email,
            perfil: account.perfil,
        }));
        setTimeout(() => {
            toast.success(`Bem-vindo, ${account.nome}!`);
            router.push('/dashboard');
        }, 600);
    };

    return (
        <div className="min-h-screen flex">
            <ToastContainer />

            {/* Left side - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[hsl(210,80%,14%)] via-[hsl(210,75%,18%)] to-[hsl(210,80%,10%)] relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-full h-full">
                    <div className="absolute top-20 left-20 w-64 h-64 bg-[hsl(42,85%,55%)] rounded-full opacity-5 blur-3xl" />
                    <div className="absolute bottom-32 right-16 w-96 h-96 bg-[hsl(210,80%,40%)] rounded-full opacity-10 blur-3xl" />
                    <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-[hsl(42,85%,55%)] rounded-full opacity-5 blur-2xl" />
                </div>

                {/* Grid pattern overlay */}
                <div className="absolute inset-0 opacity-[0.03]" style={{
                    backgroundImage: 'linear-gradient(hsl(0,0%,100%) 1px, transparent 1px), linear-gradient(90deg, hsl(0,0%,100%) 1px, transparent 1px)',
                    backgroundSize: '50px 50px',
                }} />

                <div className="relative z-10 flex flex-col justify-center px-16">
                    {/* Logo */}
                    <div className="flex items-center gap-4 mb-12">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[hsl(42,85%,55%)] to-[hsl(42,80%,45%)] flex items-center justify-center shadow-2xl">
                            <Gem className="h-7 w-7 text-[hsl(210,80%,14%)]" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white tracking-tight">SCA</h1>
                            <p className="text-sm text-[hsl(42,85%,55%)] font-medium tracking-widest uppercase">ADL Group</p>
                        </div>
                    </div>

                    <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
                        Sistema<br />
                        Centralizador<br />
                        <span className="text-[hsl(42,85%,55%)]">ADL</span>
                    </h2>

                    <p className="text-[hsl(210,20%,65%)] text-lg max-w-md leading-relaxed">
                        Plataforma integrada de gestão para mineração de terras raras.
                        Conectando todas as unidades em um único ecosistema digital.
                    </p>

                    {/* Stats */}
                    <div className="flex gap-10 mt-12">
                        <div>
                            <p className="text-3xl font-bold text-[hsl(42,85%,55%)]">5</p>
                            <p className="text-sm text-[hsl(210,20%,55%)]">Unidades</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-[hsl(42,85%,55%)]">4</p>
                            <p className="text-sm text-[hsl(210,20%,55%)]">Minerais</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-[hsl(42,85%,55%)]">100%</p>
                            <p className="text-sm text-[hsl(210,20%,55%)]">Digital</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right side - Login form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-[hsl(220,20%,97%)] overflow-y-auto">
                <div className="w-full max-w-md">
                    {/* Mobile logo */}
                    <div className="lg:hidden flex items-center gap-3 mb-10 justify-center">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[hsl(42,85%,55%)] to-[hsl(42,80%,45%)] flex items-center justify-center">
                            <Gem className="h-5 w-5 text-[hsl(210,80%,14%)]" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-[hsl(210,80%,14%)]">SCA</h1>
                            <p className="text-[9px] text-[hsl(220,10%,45%)] font-medium tracking-widest uppercase">ADL Group</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl border border-[hsl(220,15%,92%)] p-8">
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-[hsl(220,25%,10%)]">Bem-vindo de volta</h2>
                            <p className="text-sm text-[hsl(220,10%,45%)] mt-1">
                                Faça login para acessar o sistema
                            </p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-5">
                            <Input
                                label="E-mail"
                                type="email"
                                placeholder="seu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                icon={<Mail size={18} />}
                            />

                            <Input
                                label="Senha"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                icon={<Lock size={18} />}
                            />

                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 rounded border-[hsl(220,15%,80%)] text-[hsl(210,80%,22%)] focus:ring-[hsl(210,80%,22%)]"
                                    />
                                    <span className="text-sm text-[hsl(220,10%,45%)]">Lembrar-me</span>
                                </label>
                                <Link
                                    href="/recuperar-senha"
                                    className="text-sm font-medium text-[hsl(210,80%,35%)] hover:text-[hsl(210,80%,25%)] transition-colors"
                                >
                                    Esqueceu a senha?
                                </Link>
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                size="lg"
                                loading={loading}
                            >
                                Entrar
                            </Button>
                        </form>

                        {/* Quick Demo Access */}
                        <div className="mt-6 pt-6 border-t border-[hsl(220,15%,92%)]">
                            <p className="text-xs text-[hsl(220,10%,55%)] mb-3 text-center font-medium">⚡ Acesso rápido demo</p>
                            <div className="grid grid-cols-2 gap-2">
                                {demoAccounts.map((account) => (
                                    <button
                                        key={account.email}
                                        onClick={() => quickLogin(account)}
                                        className="flex items-center gap-2 p-2.5 rounded-lg border border-[hsl(220,15%,90%)] hover:border-[hsl(210,80%,50%)] hover:shadow-sm transition-all text-left group"
                                    >
                                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${account.cor} flex items-center justify-center text-[10px] font-bold ${account.textCor} flex-shrink-0`}>
                                            {account.nome.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs font-medium text-[hsl(220,25%,10%)] truncate">{account.nome}</p>
                                            <p className="text-[10px] text-[hsl(220,10%,50%)]">{account.perfil}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                            <p className="text-[10px] text-[hsl(220,10%,60%)] mt-2 text-center">Senha: <code className="bg-[hsl(220,15%,95%)] px-1.5 py-0.5 rounded text-[hsl(210,80%,35%)] font-mono">Adl@2026</code></p>
                        </div>
                    </div>

                    <p className="text-center text-xs text-[hsl(220,10%,60%)] mt-6">
                        © {new Date().getFullYear()} ADL Group. Todos os direitos reservados.
                    </p>
                </div>
            </div>
        </div>
    );
}
