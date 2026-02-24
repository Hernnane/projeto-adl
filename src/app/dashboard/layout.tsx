'use client';

import { Sidebar, SidebarProvider } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { useSidebar } from '@/components/layout/Sidebar';
import { cn } from '@/lib/utils';

function DashboardContent({ children }: { children: React.ReactNode }) {
    const { collapsed } = useSidebar();

    return (
        <div className="flex h-screen overflow-hidden bg-[hsl(220,20%,97%)]">
            <Sidebar
                userPerfil={undefined}
                userName="Admin SCA"
                userEmail="admin@adlgroup.com.br"
                pendingCounts={{
                    '/dashboard/requisicoes': 5,
                }}
            />

            <div className="flex-1 flex flex-col overflow-hidden">
                <Header
                    userName="Admin SCA"
                    notificationCount={3}
                />

                <main className="flex-1 overflow-y-auto p-4 lg:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider>
            <DashboardContent>{children}</DashboardContent>
        </SidebarProvider>
    );
}
