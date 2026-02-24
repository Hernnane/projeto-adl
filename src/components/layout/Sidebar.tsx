'use client';

import { cn } from '@/lib/utils';
import { useState, createContext, useContext, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    FileText,
    Users,
    Building2,
    Layers,
    Settings,
    ChevronLeft,
    ChevronRight,
    LogOut,
    Menu,
    X,
    Gem,
} from 'lucide-react';
import { CountBadge } from '@/components/ui/Badge';
import { Perfil } from '@/types';

// Sidebar context for collapse state
const SidebarContext = createContext({
    collapsed: false,
    setCollapsed: (_: boolean) => { },
    mobileOpen: false,
    setMobileOpen: (_: boolean) => { },
});

export const useSidebar = () => useContext(SidebarContext);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <SidebarContext.Provider value={{ collapsed, setCollapsed, mobileOpen, setMobileOpen }}>
            {children}
        </SidebarContext.Provider>
    );
}

// Navigation items with RBAC (RF39)
const navItems = [
    {
        label: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
        perfisPermitidos: [Perfil.OPERACIONAL, Perfil.GERENTE_LOCAL, Perfil.ADMINISTRADOR, Perfil.MASTER],
    },
    {
        label: 'Requisições',
        href: '/dashboard/requisicoes',
        icon: FileText,
        perfisPermitidos: [Perfil.OPERACIONAL, Perfil.GERENTE_LOCAL, Perfil.ADMINISTRADOR, Perfil.MASTER],
        badge: 0,
    },
    {
        label: 'Usuários',
        href: '/dashboard/usuarios',
        icon: Users,
        perfisPermitidos: [Perfil.ADMINISTRADOR, Perfil.MASTER],
    },
    {
        label: 'Filiais',
        href: '/dashboard/filiais',
        icon: Building2,
        perfisPermitidos: [Perfil.ADMINISTRADOR, Perfil.MASTER],
    },
    {
        label: 'Setores',
        href: '/dashboard/setores',
        icon: Layers,
        perfisPermitidos: [Perfil.ADMINISTRADOR, Perfil.MASTER],
    },
    {
        label: 'Configurações',
        href: '/dashboard/perfil',
        icon: Settings,
        perfisPermitidos: [Perfil.OPERACIONAL, Perfil.GERENTE_LOCAL, Perfil.ADMINISTRADOR, Perfil.MASTER],
    },
];

interface SidebarProps {
    userPerfil?: Perfil;
    userName?: string;
    userEmail?: string;
    pendingCounts?: Record<string, number>;
}

export function Sidebar({ userPerfil = Perfil.MASTER, userName = 'Usuário', userEmail = '', pendingCounts = {} }: SidebarProps) {
    const pathname = usePathname();
    const { collapsed, setCollapsed, mobileOpen, setMobileOpen } = useSidebar();

    // Close mobile sidebar on navigation
    useEffect(() => {
        setMobileOpen(false);
    }, [pathname, setMobileOpen]);

    // Filter nav items by RBAC
    const visibleItems = navItems.filter((item) =>
        item.perfisPermitidos.includes(userPerfil)
    );

    return (
        <>
            {/* Mobile overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    'fixed top-0 left-0 h-screen z-50 flex flex-col',
                    'bg-[hsl(210,80%,14%)] text-[hsl(210,20%,80%)]',
                    'transition-all duration-300 ease-in-out',
                    // Desktop
                    'lg:relative lg:translate-x-0',
                    collapsed ? 'lg:w-[72px]' : 'lg:w-[280px]',
                    // Mobile
                    mobileOpen ? 'translate-x-0 w-[280px]' : '-translate-x-full w-[280px]',
                )}
            >
                {/* Logo / Brand */}
                <div className="flex items-center gap-3 px-5 h-16 border-b border-white/10 flex-shrink-0">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[hsl(42,85%,55%)] to-[hsl(42,80%,45%)] flex items-center justify-center flex-shrink-0 shadow-lg">
                        <Gem className="h-5 w-5 text-[hsl(210,80%,14%)]" />
                    </div>
                    {!collapsed && (
                        <div className="overflow-hidden">
                            <h1 className="text-base font-bold text-white tracking-tight whitespace-nowrap">SCA</h1>
                            <p className="text-[10px] text-[hsl(210,20%,60%)] font-medium tracking-wider uppercase whitespace-nowrap">ADL Group</p>
                        </div>
                    )}

                    {/* Mobile close button */}
                    <button
                        onClick={() => setMobileOpen(false)}
                        className="lg:hidden ml-auto p-1 rounded-lg hover:bg-white/10 transition-colors"
                    >
                        <X size={20} className="text-white/70" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-4 px-3 no-scrollbar">
                    <ul className="space-y-1">
                        {visibleItems.map((item) => {
                            const isActive = pathname === item.href ||
                                (item.href !== '/dashboard' && pathname.startsWith(item.href));
                            const Icon = item.icon;
                            const badgeCount = pendingCounts[item.href] || 0;

                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className={cn(
                                            'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative',
                                            'hover:bg-[hsl(210,70%,20%)]',
                                            isActive
                                                ? 'bg-[hsl(210,80%,22%)] text-white shadow-md'
                                                : 'text-[hsl(210,20%,70%)]',
                                        )}
                                    >
                                        {/* Active indicator */}
                                        {isActive && (
                                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[hsl(42,85%,55%)] rounded-r-full" />
                                        )}

                                        <Icon
                                            size={20}
                                            className={cn(
                                                'flex-shrink-0 transition-colors',
                                                isActive ? 'text-[hsl(42,85%,55%)]' : 'text-[hsl(210,20%,55%)] group-hover:text-[hsl(210,20%,80%)]'
                                            )}
                                        />

                                        {!collapsed && (
                                            <>
                                                <span className="flex-1 text-sm font-medium whitespace-nowrap">{item.label}</span>
                                                {badgeCount > 0 && <CountBadge count={badgeCount} />}
                                            </>
                                        )}

                                        {/* Tooltip for collapsed mode */}
                                        {collapsed && (
                                            <div className="absolute left-full ml-2 px-2 py-1 bg-[hsl(220,25%,10%)] text-white text-xs rounded-md whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-lg">
                                                {item.label}
                                                {badgeCount > 0 && ` (${badgeCount})`}
                                            </div>
                                        )}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Footer - User info + collapse toggle */}
                <div className="border-t border-white/10 p-3 flex-shrink-0">
                    {!collapsed && (
                        <div className="flex items-center gap-3 px-3 py-2 mb-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[hsl(210,70%,32%)] to-[hsl(210,80%,22%)] flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                                {userName.charAt(0).toUpperCase()}
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-sm font-medium text-white truncate">{userName}</p>
                                <p className="text-xs text-[hsl(210,20%,55%)] truncate">{userEmail}</p>
                            </div>
                        </div>
                    )}

                    {/* Collapse toggle (desktop only) */}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="hidden lg:flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-[hsl(210,70%,20%)] transition-colors text-[hsl(210,20%,55%)] hover:text-white"
                    >
                        {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                        {!collapsed && <span className="text-sm">Recolher menu</span>}
                    </button>
                </div>
            </aside>
        </>
    );
}

// Mobile menu trigger button
export function MobileMenuTrigger() {
    const { setMobileOpen } = useSidebar();

    return (
        <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-[hsl(220,15%,92%)] transition-colors"
        >
            <Menu size={22} className="text-[hsl(220,10%,35%)]" />
        </button>
    );
}
