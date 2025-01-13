import { prisma } from './prisma';

// すべてのテーブルを削除するユーティリティ関数
export async function clearAllTables() {
  try {
    await prisma.user.deleteMany();
    // 他のテーブルがあればここに追加
    console.log('All tables cleared successfully');
  } catch (error) {
    console.error('Failed to clear tables:', error);
    throw error;
  }
}
