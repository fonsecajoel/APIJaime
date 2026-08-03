-- Executa este script no SQL Editor do Supabase (https://supabase.com/dashboard)
-- para criar a tabela e ativar o real-time.

CREATE TABLE IF NOT EXISTS pedidos (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  titulo TEXT NOT NULL,
  responsavel TEXT NOT NULL DEFAULT '',
  data_pedido TEXT DEFAULT '',
  data_execucao TEXT DEFAULT '',
  prioridade TEXT DEFAULT 'Normal',
  estado TEXT DEFAULT 'Por tratar',
  descricao TEXT DEFAULT '',
  observacoes TEXT DEFAULT '',
  utilizador TEXT DEFAULT '',
  updates JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ativar real-time para esta tabela
ALTER PUBLICATION supabase_realtime ADD TABLE pedidos;

-- Inserir dados iniciais (opcional)
-- INSERT INTO pedidos (titulo, responsavel, estado, descricao) VALUES
-- ('Exemplo de pedido', 'João', 'Por tratar', 'Descrição do pedido de exemplo');
