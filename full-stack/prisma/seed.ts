import { prisma } from '@/lib/prisma';
import { clearAllTables } from '@/lib/dbUtil';

console.log("Seed script started");

// テーブルをクリア
await clearAllTables();

// ユーザーを作成
const user = await prisma.user.create({
  data: {
    email: "test@example.com",
    name: "Test User"
  }
});

console.log(`Created user: ${user.email}`);
