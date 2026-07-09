-- Restaura data_viagem como data agendada da próxima viagem
ALTER TABLE `cobrancas`
  ADD COLUMN `data_viagem` DATE NOT NULL DEFAULT (CURDATE()) AFTER `intervalo_dias`;

UPDATE `cobrancas` SET `data_viagem` = CURDATE() WHERE `data_viagem` IS NULL;
