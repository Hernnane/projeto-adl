-- ===========================
-- SCA - SCHEMA CORE
-- Executar no Supabase SQL Editor
-- ===========================

-- Extensão para UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===========================
-- TABELA: filiais
-- ===========================
CREATE TABLE filiais (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(200) NOT NULL,
    cnpj VARCHAR(20) UNIQUE NOT NULL,
    inscricao_estadual VARCHAR(30),
    endereco TEXT,
    cidade VARCHAR(100),
    estado CHAR(2),
    cep VARCHAR(10),
    responsavel_id UUID,
    status VARCHAR(10) DEFAULT 'ATIVO' CHECK (status IN ('ATIVO', 'INATIVO')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================
-- TABELA: setores
-- ===========================
CREATE TABLE setores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(200) NOT NULL,
    descricao TEXT,
    status VARCHAR(10) DEFAULT 'ATIVO' CHECK (status IN ('ATIVO', 'INATIVO')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================
-- TABELA: filial_setores (vínculo N:N)
-- ===========================
CREATE TABLE filial_setores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    filial_id UUID NOT NULL REFERENCES filiais(id) ON DELETE CASCADE,
    setor_id UUID NOT NULL REFERENCES setores(id) ON DELETE CASCADE,
    UNIQUE(filial_id, setor_id)
);

-- ===========================
-- TABELA: usuarios
-- ===========================
CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_id UUID UNIQUE, -- FK para Supabase Auth
    nome VARCHAR(200) NOT NULL,
    email VARCHAR(200) UNIQUE NOT NULL,
    perfil VARCHAR(20) NOT NULL CHECK (perfil IN ('OPERACIONAL', 'GERENTE_LOCAL', 'ADMINISTRADOR', 'MASTER')),
    filial_base_id UUID NOT NULL REFERENCES filiais(id),
    setor_id UUID REFERENCES setores(id),
    cargo VARCHAR(200),
    status VARCHAR(15) DEFAULT 'PENDENTE' CHECK (status IN ('ATIVO', 'INATIVO', 'PENDENTE', 'BLOQUEADO')),
    avatar_url TEXT,
    login_attempts INT DEFAULT 0,
    locked_until TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Referência para responsável da filial
ALTER TABLE filiais ADD CONSTRAINT fk_filial_responsavel FOREIGN KEY (responsavel_id) REFERENCES usuarios(id);

-- ===========================
-- TABELA: usuario_filiais (escopo multi-filial)
-- ===========================
CREATE TABLE usuario_filiais (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    filial_id UUID NOT NULL REFERENCES filiais(id) ON DELETE CASCADE,
    pode_visualizar BOOLEAN DEFAULT TRUE,
    pode_agir BOOLEAN DEFAULT FALSE,
    UNIQUE(usuario_id, filial_id)
);

-- ===========================
-- TABELA: sessoes_log
-- ===========================
CREATE TABLE sessoes_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID REFERENCES usuarios(id),
    ip VARCHAR(50),
    user_agent TEXT,
    login_at TIMESTAMPTZ DEFAULT NOW(),
    sucesso BOOLEAN DEFAULT TRUE
);

-- ===========================
-- TABELA: audit_trail
-- ===========================
CREATE TABLE audit_trail (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tabela VARCHAR(100) NOT NULL,
    registro_id UUID NOT NULL,
    campo VARCHAR(200),
    valor_anterior TEXT,
    valor_novo TEXT,
    usuario_id UUID REFERENCES usuarios(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================
-- TABELA: notificacoes
-- ===========================
CREATE TABLE notificacoes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_destino_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    tipo VARCHAR(50) NOT NULL,
    titulo VARCHAR(300) NOT NULL,
    mensagem TEXT,
    lida BOOLEAN DEFAULT FALSE,
    link TEXT,
    urgente BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================
-- TABELA: anexos
-- ===========================
CREATE TABLE anexos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entidade_tipo VARCHAR(50) NOT NULL,
    entidade_id UUID NOT NULL,
    nome_arquivo VARCHAR(300) NOT NULL,
    legenda TEXT,
    mime_type VARCHAR(100),
    tamanho BIGINT,
    storage_path TEXT NOT NULL,
    versao INT DEFAULT 1,
    ativo BOOLEAN DEFAULT TRUE,
    uploaded_by UUID REFERENCES usuarios(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================
-- ÍNDICES para performance
-- ===========================
CREATE INDEX idx_usuarios_filial ON usuarios(filial_base_id);
CREATE INDEX idx_usuarios_perfil ON usuarios(perfil);
CREATE INDEX idx_usuarios_status ON usuarios(status);
CREATE INDEX idx_notificacoes_destino ON notificacoes(usuario_destino_id, lida);
CREATE INDEX idx_audit_trail_tabela ON audit_trail(tabela, registro_id);
CREATE INDEX idx_audit_trail_data ON audit_trail(created_at);
CREATE INDEX idx_sessoes_log_usuario ON sessoes_log(usuario_id, login_at);
CREATE INDEX idx_anexos_entidade ON anexos(entidade_tipo, entidade_id);
