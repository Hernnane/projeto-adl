// ===========================
// ENUMS & CONSTANTS
// ===========================

export enum Perfil {
  OPERACIONAL = 'OPERACIONAL',
  GERENTE_LOCAL = 'GERENTE_LOCAL',
  ADMINISTRADOR = 'ADMINISTRADOR',
  MASTER = 'MASTER',
}

export const PERFIL_NIVEL: Record<Perfil, number> = {
  [Perfil.OPERACIONAL]: 1,
  [Perfil.GERENTE_LOCAL]: 2,
  [Perfil.ADMINISTRADOR]: 3,
  [Perfil.MASTER]: 4,
};

export const PERFIL_LABEL: Record<Perfil, string> = {
  [Perfil.OPERACIONAL]: 'Operacional',
  [Perfil.GERENTE_LOCAL]: 'Gerente Local',
  [Perfil.ADMINISTRADOR]: 'Administrador',
  [Perfil.MASTER]: 'Master',
};

export enum StatusUsuario {
  ATIVO = 'ATIVO',
  INATIVO = 'INATIVO',
  PENDENTE = 'PENDENTE',
  BLOQUEADO = 'BLOQUEADO',
}

export enum Prioridade {
  NORMAL = 'NORMAL',
  URGENTE = 'URGENTE',
  EMERGENCIA = 'EMERGENCIA',
}

export const PRIORIDADE_LABEL: Record<Prioridade, string> = {
  [Prioridade.NORMAL]: 'Normal',
  [Prioridade.URGENTE]: 'Urgente',
  [Prioridade.EMERGENCIA]: 'Emergência',
};

export const PRIORIDADE_PESO: Record<Prioridade, number> = {
  [Prioridade.EMERGENCIA]: 3,
  [Prioridade.URGENTE]: 2,
  [Prioridade.NORMAL]: 1,
};

export enum StatusRequisicao {
  RASCUNHO = 'RASCUNHO',
  AGUARDANDO_GERENTE = 'AGUARDANDO_GERENTE',
  RETORNO_SOLICITANTE = 'RETORNO_SOLICITANTE',
  AGUARDANDO_ADM = 'AGUARDANDO_ADM',
  RETORNO_GERENTE = 'RETORNO_GERENTE',
  AGUARDANDO_CEO = 'AGUARDANDO_CEO',
  APROVADO_FINAL = 'APROVADO_FINAL',
  REPROVADO_FINAL = 'REPROVADO_FINAL',
}

export const STATUS_REQUISICAO_LABEL: Record<StatusRequisicao, string> = {
  [StatusRequisicao.RASCUNHO]: 'Rascunho',
  [StatusRequisicao.AGUARDANDO_GERENTE]: 'Aguardando Gerente',
  [StatusRequisicao.RETORNO_SOLICITANTE]: 'Retorno ao Solicitante',
  [StatusRequisicao.AGUARDANDO_ADM]: 'Aguardando Administrador',
  [StatusRequisicao.RETORNO_GERENTE]: 'Retorno ao Gerente',
  [StatusRequisicao.AGUARDANDO_CEO]: 'Aguardando CEO',
  [StatusRequisicao.APROVADO_FINAL]: 'Aprovado',
  [StatusRequisicao.REPROVADO_FINAL]: 'Reprovado',
};

export enum StatusItem {
  PENDENTE = 'PENDENTE',
  APROVADO = 'APROVADO',
  REPROVADO = 'REPROVADO',
  RETORNO = 'RETORNO',
}

export enum DecisaoAprovacao {
  APROVADO = 'APROVADO',
  REPROVADO = 'REPROVADO',
  RETORNO = 'RETORNO',
}

export enum TipoNotificacao {
  REQUISICAO_CRIADA = 'REQUISICAO_CRIADA',
  REQUISICAO_APROVADA = 'REQUISICAO_APROVADA',
  REQUISICAO_REPROVADA = 'REQUISICAO_REPROVADA',
  REQUISICAO_RETORNO = 'REQUISICAO_RETORNO',
  REQUISICAO_PENDENTE = 'REQUISICAO_PENDENTE',
  SISTEMA = 'SISTEMA',
  SEGURANCA = 'SEGURANCA',
}

// ===========================
// DATA MODELS
// ===========================

export interface Filial {
  id: string;
  nome: string;
  cnpj: string;
  inscricao_estadual: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  responsavel_id: string | null;
  status: 'ATIVO' | 'INATIVO';
  created_at: string;
  updated_at: string;
}

export interface Setor {
  id: string;
  nome: string;
  descricao: string;
  status: 'ATIVO' | 'INATIVO';
  created_at: string;
}

export interface Usuario {
  id: string;
  auth_id: string;
  nome: string;
  email: string;
  perfil: Perfil;
  filial_base_id: string;
  setor_id: string | null;
  cargo: string;
  status: StatusUsuario;
  avatar_url: string | null;
  login_attempts: number;
  locked_until: string | null;
  created_at: string;
  updated_at: string;
  // Relations
  filial?: Filial;
  setor?: Setor;
}

export interface UsuarioFilial {
  id: string;
  usuario_id: string;
  filial_id: string;
  pode_visualizar: boolean;
  pode_agir: boolean;
}

export interface Requisicao {
  id: string;
  codigo: string;
  solicitante_id: string;
  filial_id: string;
  setor_id: string | null;
  prioridade: Prioridade;
  justificativa_urgencia: string | null;
  descricao: string;
  status_geral: StatusRequisicao;
  valor_total: number;
  created_at: string;
  updated_at: string;
  // Relations
  solicitante?: Usuario;
  filial?: Filial;
  setor?: Setor;
  itens?: RequisicaoItem[];
  aprovacoes?: RequisicaoAprovacao[];
  timeline?: RequisicaoTimeline[];
  anexos?: Anexo[];
}

export interface RequisicaoItem {
  id: string;
  requisicao_id: string;
  descricao: string;
  quantidade: number;
  unidade: string;
  valor_unitario: number | null;
  valor_total: number | null;
  fornecedor: string | null;
  status_item: StatusItem;
  observacao: string | null;
  created_at: string;
}

export interface RequisicaoAprovacao {
  id: string;
  requisicao_id: string;
  item_id: string | null;
  aprovador_id: string;
  nivel: number;
  decisao: DecisaoAprovacao;
  justificativa: string | null;
  created_at: string;
  aprovador?: Usuario;
}

export interface RequisicaoTimeline {
  id: string;
  requisicao_id: string;
  tipo_evento: string;
  descricao: string;
  usuario_id: string | null;
  dados_extra: Record<string, unknown> | null;
  created_at: string;
  usuario?: Usuario;
}

export interface Anexo {
  id: string;
  entidade_tipo: 'requisicao' | 'usuario' | 'filial';
  entidade_id: string;
  nome_arquivo: string;
  legenda: string | null;
  mime_type: string;
  tamanho: number;
  storage_path: string;
  versao: number;
  ativo: boolean;
  uploaded_by: string;
  created_at: string;
}

export interface Notificacao {
  id: string;
  usuario_destino_id: string;
  tipo: TipoNotificacao;
  titulo: string;
  mensagem: string;
  lida: boolean;
  link: string | null;
  urgente: boolean;
  created_at: string;
}

export interface AuditTrail {
  id: string;
  tabela: string;
  registro_id: string;
  campo: string;
  valor_anterior: string | null;
  valor_novo: string | null;
  usuario_id: string;
  created_at: string;
}

export interface SessaoLog {
  id: string;
  usuario_id: string;
  ip: string;
  user_agent: string;
  login_at: string;
  sucesso: boolean;
}

// ===========================
// API / UI HELPERS
// ===========================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface FiltroRequisicao {
  status?: StatusRequisicao;
  prioridade?: Prioridade;
  filial_id?: string;
  setor_id?: string;
  solicitante_id?: string;
  search?: string;
  page?: number;
  perPage?: number;
}

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: number;
  perfisPermitidos: Perfil[];
  children?: NavItem[];
}
