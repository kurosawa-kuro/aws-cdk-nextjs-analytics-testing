import { prisma } from './prisma';

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
