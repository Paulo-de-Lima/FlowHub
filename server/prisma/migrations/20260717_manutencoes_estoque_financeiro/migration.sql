-- FlowHub: manutenções, estoque_minimo, despesas.material_id
-- Executar manualmente no MySQL se db push/migrate não estiver disponível.

ALTER TABLE `materiais`
  ADD COLUMN `estoque_minimo` INT NOT NULL DEFAULT 5 AFTER `quantidade`;

ALTER TABLE `despesas`
  ADD COLUMN `material_id` INT NULL AFTER `total`,
  ADD INDEX `despesas_material_id_idx` (`material_id`),
  ADD CONSTRAINT `despesas_material_id_fkey`
    FOREIGN KEY (`material_id`) REFERENCES `materiais`(`id`)
    ON DELETE SET NULL ON UPDATE NO ACTION;

CREATE TABLE `manutencoes` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `cliente_id` INT NOT NULL,
  `descricao` VARCHAR(500) NOT NULL,
  `data` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
  `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`id`),
  INDEX `manutencoes_cliente_id_idx` (`cliente_id`),
  CONSTRAINT `manutencoes_cliente_id_fkey`
    FOREIGN KEY (`cliente_id`) REFERENCES `clientes`(`id`)
    ON DELETE NO ACTION ON UPDATE NO ACTION
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `manutencao_materiais` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `manutencao_id` INT NOT NULL,
  `material_id` INT NOT NULL,
  `quantidade` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `manutencao_materiais_manutencao_id_idx` (`manutencao_id`),
  INDEX `manutencao_materiais_material_id_idx` (`material_id`),
  CONSTRAINT `manutencao_materiais_manutencao_id_fkey`
    FOREIGN KEY (`manutencao_id`) REFERENCES `manutencoes`(`id`)
    ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `manutencao_materiais_material_id_fkey`
    FOREIGN KEY (`material_id`) REFERENCES `materiais`(`id`)
    ON DELETE NO ACTION ON UPDATE NO ACTION
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Recalcular status com estoque_minimo
UPDATE `materiais`
SET `status` = CASE
  WHEN `quantidade` <= 0 THEN 'VAZIO'
  WHEN `quantidade` <= `estoque_minimo` THEN 'BAIXO'
  ELSE 'ALTO'
END;
