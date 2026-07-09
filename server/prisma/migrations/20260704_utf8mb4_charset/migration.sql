-- Charset UTF-8 para suporte a acentuação (pt-BR)
-- Executar uma vez se cidades aparecerem como "Macei�"

ALTER DATABASE flowhub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE cobrancas CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE clientes CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Corrigir registro corrompido (ajuste o id se necessário)
-- UPDATE cobrancas SET cidade = 'Maceió' WHERE id = 1;
