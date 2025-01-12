import { PrismaClient } from '@prisma/client';

// グローバルスコープにPrismaクライアントを保持
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// 既存のPrismaクライアントがあればそれを使用し、なければ新規作成
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'error', 'warn'] 
    : ['error']
});

// 開発環境ではグローバルにPrismaクライアントを保持
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}