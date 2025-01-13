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

// すべてのテーブルを削除するユーティリティ関数
export async function clearAllTables() {
  try {
    // テーブル削除とIDリセットを同時に行う
    await prisma.$executeRaw`TRUNCATE TABLE "User" RESTART IDENTITY CASCADE`;
    console.log('All tables cleared and IDs reset successfully');
  } catch (error) {
    console.error('Failed to clear tables:', error);
    throw error;
  }
}