-- Cobranças: nome único + intervalo em dias (remove estado/cidade/datas fixas)

ALTER TABLE cobrancas
  ADD COLUMN nome VARCHAR(150) NULL AFTER id,
  ADD COLUMN intervalo_dias INT NOT NULL DEFAULT 30 AFTER nome;

UPDATE cobrancas
SET nome = CONCAT(cidade, ' - ', estado)
WHERE nome IS NULL;

ALTER TABLE cobrancas
  MODIFY nome VARCHAR(150) NOT NULL,
  DROP COLUMN estado,
  DROP COLUMN cidade,
  DROP COLUMN data_viagem,
  DROP COLUMN data_retorno;
