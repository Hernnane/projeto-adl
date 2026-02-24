'use client';

import { cn } from '@/lib/utils';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Bell,
    Search,
    ChevronRight,
    LogOut,
    User,
    Settings,
    X,
} from 'lucide-react';
import { MobileMenuTrigger } from './Sidebar';
import { CountBadge } from '@/components/ui/Badge';
import { formatRelativeTime } from '@/lib/utils';

// Breadcrumb labels
const routeLabels: Record<string, string> = {
    dashboard: 'Dashboard',
    requisicoes: 'Requisições',
    nova: 'Nova Requisição',
    usuarios: 'Usuários',
    filiais: 'Filiais',
    setores: 'Setores',
    perfil: 'Meu Perfil',
};

interface HeaderProps {
    userName?: string;
    notificationCount?: number;
}

export function Header({ userName = 'Usuário', notificationCount = 0 }: HeaderProps) {
    const pathname = usePathname();
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [profileOpen, setProfileOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);
    const notifRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLInputElement>(null);

    // Close dropdowns on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
                setProfileOpen(false);
            }
            if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
                setNotifOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Focus search input when opened
    useEffect(() => {
        if (searchOpen && searchRef.current) {
            searchRef.current.focus();
        }
    }, [searchOpen]);

    // Build breadcrumbs
    const segments = pathname.split('/').filter(Boolean);
    const breadcrumbs = segments.map((segment, i) => ({
        label: routeLabels[segment] || segment,
        href: '/' + segments.slice(0, i + 1).join('/'),
        isLast: i === segments.length - 1,
    }));

    // Dummy notifications for demo
    const notifications = [
        { id: '1', title: 'Nova requisição #REQ-2026-00012', message: 'João Silva criou uma requisição urgente', time: new Date(Date.now() - 3600000).toISOString(), urgente: true },
        { id: '2', title: 'Requisição aprovada', message: 'Gerente aprovou REQ-2026-00010', time: new Date(Date.now() - 7200000).toISOString(), urgente: false },
        { id: '3', title: 'Novo usuário cadastrado', message: 'Maria Oliveira foi adicionada ao sistema', time: new Date(Date.now() - 86400000).toISOString(), urgente: false },
    ];

    return (
        <header className="h-16 bg-white border-b border-[hsl(220,15%,90%)] flex items-center justify-between px-4 lg:px-6 flex-shrink-0 sticky top-0 z-30">
            {/* Left: Mobile menu + Breadcrumbs */}
            <div className="flex items-center gap-3">
                <MobileMenuTrigger />

                {/* Breadcrumbs (RF42) */}
                <nav className="hidden sm:flex items-center gap-1 text-sm">
                    {breadcrumbs.map((crumb) => (
                        <div key={crumb.href} className="flex items-center gap-1">
                            {crumb.isLast ? (
                                <span className="font-medium text-[hsl(220,25%,10%)]">{crumb.label}</span>
                            ) : (
                                <>
                                    <Link
                                        href={crumb.href}
                                        className="text-[hsl(220,10%,45%)] hover:text-[hsl(210,80%,22%)] transition-colors"
                                    >
                                        {crumb.label}
                                    </Link>
                                    <ChevronRight size={14} className="text-[hsl(220,10%,65%)]" />
                                </>
                            )}
                        </div>
                    ))}
                </nav>
            </div>

            {/* Right: Search + Notifications + Profile */}
            <div className="flex items-center gap-1">
                {/* Search (RF40) */}
                <div className="relative">
                    {searchOpen ? (
                        <div className="flex items-center gap-2 bg-[hsl(220,15%,96%)] rounded-lg px-3 py-1.5 animate-scale-in">
                            <Search size={18} className="text-[hsl(220,10%,45%)] flex-shrink-0" />
                            <input
                                ref={searchRef}
                                type="text"
                                placeholder="Buscar requisição, usuário..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-transparent text-sm outline-none w-48 lg:w-64 text-[hsl(220,25%,10%)] placeholder:text-[hsl(220,10%,55%)]"
                                onKeyDown={(e) => {
                                    if (e.key === 'Escape') {
                                        setSearchOpen(false);
                                        setSearchQuery('');
                                    }
                                }}
                            />
                            <button
                                onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                                className="text-[hsl(220,10%,55%)] hover:text-[hsl(220,25%,10%)]"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setSearchOpen(true)}
                            className="p-2.5 rounded-lg hover:bg-[hsl(220,15%,94%)] transition-colors"
                        >
                            <Search size={20} className="text-[hsl(220,10%,40%)]" />
                        </button>
                    )}
                </div>

                {/* Notifications (RF35) */}
                <div ref={notifRef} className="relative">
                    <button
                        onClick={() => setNotifOpen(!notifOpen)}
                        className="relative p-2.5 rounded-lg hover:bg-[hsl(220,15%,94%)] transition-colors"
                    >
                        <Bell size={20} className="text-[hsl(220,10%,40%)]" />
                        {notificationCount > 0 && (
                            <CountBadge
                                count={notificationCount}
                                className="absolute -top-0.5 -right-0.5 scale-90"
                            />
                        )}
                    </button>

                    {/* Notification dropdown */}
                    {notifOpen && (
                        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-[hsl(220,15%,90%)] animate-scale-in overflow-hidden z-50">
                            <div className="p-4 border-b border-[hsl(220,15%,92%)] flex items-center justify-between">
                                <h3 className="font-semibold text-sm text-[hsl(220,25%,10%)]">Notificações</h3>
                                <button className="text-xs text-[hsl(210,80%,40%)] hover:text-[hsl(210,80%,30%)] font-medium">
                                    Marcar todas como lidas
                                </button>
                            </div>
                            <div className="max-h-80 overflow-y-auto">
                                {notifications.map((notif) => (
                                    <button
                                        key={notif.id}
                                        className={cn(
                                            'w-full text-left p-4 hover:bg-[hsl(220,15%,97%)] transition-colors border-b border-[hsl(220,15%,95%)] last:border-0',
                                            notif.urgente && 'bg-[hsl(0,70%,98%)]'
                                        )}
                                    >
                                        <div className="flex items-start gap-3">
                                            {notif.urgente && (
                                                <div className="w-2 h-2 rounded-full bg-[hsl(0,72%,51%)] mt-1.5 flex-shrink-0 animate-pulse" />
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-[hsl(220,25%,10%)] truncate">{notif.title}</p>
                                                <p className="text-xs text-[hsl(220,10%,45%)] mt-0.5 truncate">{notif.message}</p>
                                                <p className="text-xs text-[hsl(220,10%,60%)] mt-1">{formatRelativeTime(notif.time)}</p>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                            <div className="p-3 border-t border-[hsl(220,15%,92%)]">
                                <Link
                                    href="/dashboard/notificacoes"
                                    className="block text-center text-xs font-medium text-[hsl(210,80%,40%)] hover:text-[hsl(210,80%,30%)]"
                                >
                                    Ver todas as notificações
                                </Link>
                            </div>
                        </div>
                    )}
                </div>

                {/* Profile dropdown */}
                <div ref={profileRef} className="relative ml-1">
                    <button
                        onClick={() => setProfileOpen(!profileOpen)}
                        className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-[hsl(220,15%,94%)] transition-colors"
                    >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[hsl(210,70%,32%)] to-[hsl(210,80%,22%)] flex items-center justify-center text-xs font-bold text-white">
                            {userName.charAt(0).toUpperCase()}
                        </div>
                    </button>

                    {profileOpen && (
                        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-[hsl(220,15%,90%)] animate-scale-in overflow-hidden z-50">
                            <div className="p-3 border-b border-[hsl(220,15%,92%)]">
                                <p className="text-sm font-medium text-[hsl(220,25%,10%)]">{userName}</p>
                                <p className="text-xs text-[hsl(220,10%,45%)]">Master</p>
                            </div>
                            <div className="p-1.5">
                                <Link
                                    href="/dashboard/perfil"
                                    className="flex items-center gap-2.5 px-3 py-2 text-sm text-[hsl(220,10%,35%)] rounded-lg hover:bg-[hsl(220,15%,94%)] transition-colors"
                                >
                                    <User size={16} />
                                    Meu Perfil
                                </Link>
                                <Link
                                    href="/dashboard/perfil"
                                    className="flex items-center gap-2.5 px-3 py-2 text-sm text-[hsl(220,10%,35%)] rounded-lg hover:bg-[hsl(220,15%,94%)] transition-colors"
                                >
                                    <Settings size={16} />
                                    Configurações
                                </Link>
                                <button
                                    className="flex items-center gap-2.5 px-3 py-2 text-sm text-[hsl(0,72%,45%)] rounded-lg hover:bg-[hsl(0,70%,97%)] transition-colors w-full"
                                >
                                    <LogOut size={16} />
                                    Sair
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
