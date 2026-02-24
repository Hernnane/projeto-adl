import { clsx, type ClassValue } from 'clsx';

/**
 * Utility para merge de classes CSS (compatível com Tailwind)
 */
export function cn(...inputs: ClassValue[]) {
    return clsx(inputs);
}

/**
 * Formata valor monetário em BRL
 */
export function formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);
}

/**
 * Formata data para exibição
 */
export function formatDate(date: string | Date): string {
    return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    }).format(new Date(date));
}

/**
 * Formata data e hora
 */
export function formatDateTime(date: string | Date): string {
    return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(date));
}

/**
 * Formata data relativa (ex: "há 2 horas")
 */
export function formatRelativeTime(date: string | Date): string {
    const now = new Date();
    const then = new Date(date);
    const diffMs = now.getTime() - then.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHrs = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMin < 1) return 'agora';
    if (diffMin < 60) return `há ${diffMin}min`;
    if (diffHrs < 24) return `há ${diffHrs}h`;
    if (diffDays < 7) return `há ${diffDays}d`;
    return formatDate(date);
}

/**
 * Gera código de requisição
 */
export function gerarCodigoRequisicao(sequencial: number): string {
    const ano = new Date().getFullYear();
    return `REQ-${ano}-${String(sequencial).padStart(5, '0')}`;
}

/**
 * Trunca texto com ellipsis
 */
export function truncate(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
}

/**
 * Valida senha forte (RNF01)
 */
export function validarSenha(senha: string): { valida: boolean; erros: string[] } {
    const erros: string[] = [];

    if (senha.length < 8) erros.push('Mínimo de 8 caracteres');
    if (!/[A-Z]/.test(senha)) erros.push('Pelo menos uma letra maiúscula');
    if (!/[a-z]/.test(senha)) erros.push('Pelo menos uma letra minúscula');
    if (!/[0-9]/.test(senha)) erros.push('Pelo menos um número');
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(senha)) erros.push('Pelo menos um caractere especial');

    return { valida: erros.length === 0, erros };
}

/**
 * Valida tamanho de arquivo (RNF19 - max 10MB)
 */
export function validarTamanhoArquivo(tamanho: number, maxMB = 10): boolean {
    return tamanho <= maxMB * 1024 * 1024;
}

/**
 * Valida tipo de arquivo (RF30)
 */
export function validarTipoArquivo(mimeType: string): boolean {
    const tiposPermitidos = [
        'image/jpeg',
        'image/png',
        'image/webp',
        'application/pdf',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/csv',
    ];
    return tiposPermitidos.includes(mimeType);
}

/**
 * Extrai iniciais do nome
 */
export function getInitials(name: string): string {
    return name
        .split(' ')
        .map((n) => n[0])
        .filter(Boolean)
        .slice(0, 2)
        .join('')
        .toUpperCase();
}
