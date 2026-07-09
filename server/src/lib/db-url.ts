import type { PoolConfig } from 'mariadb';

/** Normaliza parâmetros da conexão MySQL/MariaDB para dev local. */
export function normalizeDatabaseUrl(url: string): string {
  if (!url) {
    return url;
  }

  let result = url;

  if (!/[?&]charset=/i.test(result)) {
    result += `${result.includes('?') ? '&' : '?'}charset=utf8mb4`;
  }

  if (!/[?&]allowPublicKeyRetrieval=/i.test(result)) {
    result += `${result.includes('?') ? '&' : '?'}allowPublicKeyRetrieval=true`;
  }

  return result;
}

/** Converte DATABASE_URL em config explícita do pool MariaDB. */
export function parseDatabasePoolConfig(url: string): PoolConfig {
  const normalized = normalizeDatabaseUrl(url);
  const parsed = new URL(normalized);

  return {
    host: parsed.hostname,
    port: parsed.port ? Number(parsed.port) : 3306,
    user: decodeURIComponent(parsed.username),
    password: decodeURIComponent(parsed.password),
    database: parsed.pathname.replace(/^\//, ''),
    charset: 'utf8mb4',
    allowPublicKeyRetrieval: true,
    prepareCacheLength: 0,
  };
}
