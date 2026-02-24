-- ===========================
-- SCA - MÓDULO DE REQUISIÇÕES
-- Executar no Supabase SQL Editor após 001_core_schema.sql
-- ===========================

-- ===========================
-- TABELA: requisicoes
-- ===========================
CREATE TABLE requisicoes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    codigo VARCHAR(20) UNIQUE NOT NULL, -- Ex: REQ-2026-00001
    solicitante_id UUID NOT NULL REFERENCES usuarios(id),
    filial_id UUID NOT NULL REFERENCES filiais(id),
    setor_id UUID REFERENCES setores(id),
    descricao TEXT NOT NULL,
    prioridade VARCHAR(15) DEFAULT 'NORMAL' CHECK (prioridade IN ('NORMAL', 'URGENTE', 'EMERGENCIA')),
    justificativa_urgencia TEXT,
    status_geral VARCHAR(30) DEFAULT 'RASCUNHO' CHECK (status_geral IN (
        'RASCUNHO', 'AGUARDANDO_GERENTE', 'RETORNO_SOLICITANTE',
        'AGUARDANDO_ADM', 'RETORNO_GERENTE',
        'AGUARDANDO_CEO', 'APROVADO_FINAL', 'REPROVADO_FINAL'
    )),
    valor_total DECIMAL(15, 2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================
-- TABELA: requisicao_itens
-- ===========================
CREATE TABLE requisicao_itens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    requisicao_id UUID NOT NULL REFERENCES requisicoes(id) ON DELETE CASCADE,
    descricao TEXT NOT NULL,
    quantidade DECIMAL(10, 2) DEFAULT 1,
    unidade VARCHAR(10) DEFAULT 'UN',
    valor_unitario DECIMAL(15, 2),
    valor_total DECIMAL(15, 2),
    fornecedor VARCHAR(300),
    status_item VARCHAR(15) DEFAULT 'PENDENTE' CHECK (status_item IN ('PENDENTE', 'APROVADO', 'REPROVADO', 'RETORNO')),
    observacao TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================
-- TABELA: requisicao_aprovacoes
-- ===========================
CREATE TABLE requisicao_aprovacoes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    requisicao_id UUID NOT NULL REFERENCES requisicoes(id) ON DELETE CASCADE,
    item_id UUID REFERENCES requisicao_itens(id) ON DELETE CASCADE,
    aprovador_id UUID NOT NULL REFERENCES usuarios(id),
    nivel INT NOT NULL CHECK (nivel IN (1, 2, 3)), -- 1=Gerente, 2=Adm, 3=CEO
    decisao VARCHAR(15) NOT NULL CHECK (decisao IN ('APROVADO', 'REPROVADO', 'RETORNO')),
    justificativa TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================
-- TABELA: requisicao_timeline
-- ===========================
CREATE TABLE requisicao_timeline (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    requisicao_id UUID NOT NULL REFERENCES requisicoes(id) ON DELETE CASCADE,
    tipo_evento VARCHAR(50) NOT NULL,
    descricao TEXT NOT NULL,
    usuario_id UUID REFERENCES usuarios(id),
    dados_extra JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================
-- SEQUÊNCIA para código de requisição
-- ===========================
CREATE SEQUENCE requisicao_seq START WITH 1 INCREMENT BY 1;

-- Função para auto-gerar código
CREATE OR REPLACE FUNCTION gerar_codigo_requisicao()
RETURNS TRIGGER AS $$
BEGIN
    NEW.codigo := 'REQ-' || EXTRACT(YEAR FROM NOW()) || '-' || LPAD(NEXTVAL('requisicao_seq')::TEXT, 5, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_gerar_codigo
    BEFORE INSERT ON requisicoes
    FOR EACH ROW
    WHEN (NEW.codigo IS NULL OR NEW.codigo = '')
    EXECUTE FUNCTION gerar_codigo_requisicao();

-- ===========================
-- FUNÇÃO: recalcular total da requisição (RF-REQ-06)
-- ===========================
CREATE OR REPLACE FUNCTION recalcular_total_requisicao()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE requisicoes
    SET valor_total = (
        SELECT COALESCE(SUM(valor_total), 0)
        FROM requisicao_itens
        WHERE requisicao_id = COALESCE(NEW.requisicao_id, OLD.requisicao_id)
          AND status_item != 'REPROVADO'
    ),
    updated_at = NOW()
    WHERE id = COALESCE(NEW.requisicao_id, OLD.requisicao_id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_recalcular_total
    AFTER INSERT OR UPDATE OR DELETE ON requisicao_itens
    FOR EACH ROW
    EXECUTE FUNCTION recalcular_total_requisicao();

-- ===========================
-- ÍNDICES para performance
-- ===========================
CREATE INDEX idx_requisicoes_solicitante ON requisicoes(solicitante_id);
CREATE INDEX idx_requisicoes_filial ON requisicoes(filial_id);
CREATE INDEX idx_requisicoes_status ON requisicoes(status_geral);
CREATE INDEX idx_requisicoes_prioridade ON requisicoes(prioridade);
CREATE INDEX idx_requisicoes_data ON requisicoes(created_at DESC);
CREATE INDEX idx_requisicao_itens_req ON requisicao_itens(requisicao_id);
CREATE INDEX idx_requisicao_aprovacoes_req ON requisicao_aprovacoes(requisicao_id);
CREATE INDEX idx_requisicao_timeline_req ON requisicao_timeline(requisicao_id, created_at);
