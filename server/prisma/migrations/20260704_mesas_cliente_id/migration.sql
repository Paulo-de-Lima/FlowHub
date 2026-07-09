-- Migration: adicionar cliente_id em mesas (vínculo mesa ↔ cliente)
-- Aplicada via `npm run db:push` em 2026-07-04
-- Schema baseline: mesas.cliente_id INT NOT NULL + FK para clientes(id)

ALTER TABLE mesas ADD COLUMN cliente_id INT NOT NULL AFTER id;
ALTER TABLE mesas ADD CONSTRAINT mesas_ibfk_1 FOREIGN KEY (cliente_id) REFERENCES clientes(id);
CREATE INDEX cliente_id ON mesas (cliente_id);
