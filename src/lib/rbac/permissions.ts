import { Perfil, PERFIL_NIVEL, type Usuario } from '@/types';

/**
 * Verifica se o usuário possui nível mínimo de perfil
 */
export function temPerfilMinimo(usuario: Usuario, perfilMinimo: Perfil): boolean {
    return PERFIL_NIVEL[usuario.perfil] >= PERFIL_NIVEL[perfilMinimo];
}

/**
 * Verifica se o usuário pode acessar dados de uma filial
 */
export function podeAcessarFilial(
    usuario: Usuario,
    filialId: string,
    filiaisExtras?: { filial_id: string; pode_visualizar: boolean; pode_agir: boolean }[]
): boolean {
    // MASTER vê tudo
    if (usuario.perfil === Perfil.MASTER) return true;

    // Filial base
    if (usuario.filial_base_id === filialId) return true;

    // Filiais extras
    if (filiaisExtras) {
        return filiaisExtras.some(
            (f) => f.filial_id === filialId && f.pode_visualizar
        );
    }

    return false;
}

/**
 * Verifica se o usuário pode agir (aprovar/editar) em dados de uma filial
 */
export function podeAgirFilial(
    usuario: Usuario,
    filialId: string,
    filiaisExtras?: { filial_id: string; pode_visualizar: boolean; pode_agir: boolean }[]
): boolean {
    if (usuario.perfil === Perfil.MASTER) return true;
    if (usuario.filial_base_id === filialId) return true;

    if (filiaisExtras) {
        return filiaisExtras.some(
            (f) => f.filial_id === filialId && f.pode_agir
        );
    }

    return false;
}

/**
 * Retorna os itens de menu permitidos para o perfil do usuário
 */
export function filtrarMenuPorPerfil(
    itens: { perfisPermitidos: Perfil[] }[],
    perfilUsuario: Perfil
) {
    return itens.filter((item) =>
        item.perfisPermitidos.some(
            (perfil) => PERFIL_NIVEL[perfilUsuario] >= PERFIL_NIVEL[perfil]
        )
    );
}

/**
 * Verifica permissão para aprovar uma requisição baseado no nível
 */
export function podeAprovarRequisicao(
    usuario: Usuario,
    etapaAtual: string
): boolean {
    switch (etapaAtual) {
        case 'AGUARDANDO_GERENTE':
            return temPerfilMinimo(usuario, Perfil.GERENTE_LOCAL);
        case 'AGUARDANDO_ADM':
            return temPerfilMinimo(usuario, Perfil.ADMINISTRADOR);
        case 'AGUARDANDO_CEO':
            return usuario.perfil === Perfil.MASTER;
        default:
            return false;
    }
}
