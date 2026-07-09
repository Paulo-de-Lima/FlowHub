-- Valor da ficha por mesa (cálculo de leitura)
ALTER TABLE `mesas`
  ADD COLUMN `valor_ficha` DECIMAL(10, 2) NOT NULL DEFAULT 1.50 AFTER `numeracao`;
