-- Pagamento parcial: quanto já foi pago em cada leitura
ALTER TABLE `registros_mesa`
  ADD COLUMN `valor_pago` DECIMAL(10, 2) NOT NULL DEFAULT 0 AFTER `deve`;

-- Registros já marcados como quitados recebem valor_pago = deve
UPDATE `registros_mesa` SET `valor_pago` = `deve` WHERE `pago` = 1;
