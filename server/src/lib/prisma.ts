import 'dotenv/config';

import { PrismaMariaDb } from '@prisma/adapter-mariadb';

import { parseDatabasePoolConfig } from './db-url';

// Client gerado fica fora de src/ — require evita conflito com rootDir do TypeScript.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient } = require('../../generated/prisma/client');

const globalForPrisma = globalThis as unknown as {
  prisma: InstanceType<typeof PrismaClient> | undefined;
};

function createPrismaClient() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL não está definida no ambiente.');
  }

  const poolConfig = parseDatabasePoolConfig(process.env.DATABASE_URL);

  const adapter = new PrismaMariaDb(poolConfig);

  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
