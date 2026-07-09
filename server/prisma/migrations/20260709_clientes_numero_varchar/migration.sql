-- Telefone: INT não comporta números com DDD (ex.: 85999998888)
ALTER TABLE `clientes`
  MODIFY COLUMN `numero` VARCHAR(20) NULL;
