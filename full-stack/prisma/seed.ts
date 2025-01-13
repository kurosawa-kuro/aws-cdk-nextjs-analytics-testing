import { logWithColor } from '@/lib/logger';
import { clearAllTables, prisma } from '@/lib/prisma';

// デフォルトユーザーデータ
const DEFAULT_USERS = [
  { email: 'test1@develop.com', name: 'User One' },
  { email: 'test2@develop.com', name: 'User Two' },
  { email: 'test3@develop.com', name: 'User Three' }
];

// ユーザー作成関数
async function createUsers(users: typeof DEFAULT_USERS) {
  const createdUsers = [];
  
  for (const userData of users) {
    try {
      const user = await prisma.user.create({
        data: userData
      });
      createdUsers.push(user);
      console.log(`Created user: ${user.email}`);
    } catch (error) {
      console.error(`Failed to create user ${userData.email}:`, error);
    }
  }
  
  return createdUsers;
}

// メイン処理
async function main() {
  // /home/wsl/app/full-stack/src/lib/logger.tsでオレンジ ログ
  logWithColor('Seed script started', 'processStart');
  
  try {
    // テーブルをクリア
    await clearAllTables();
    
    // ユーザーを作成
    const users = await createUsers(DEFAULT_USERS);
    console.log(`Total ${users.length} users created`);
    
  } catch (error) {
    console.error("Seed script failed:", error);
    process.exit(1);
  }
}

// スクリプト実行
main()
  .then(() => {
    console.log("Seed script completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Unexpected error:", error);
    process.exit(1);
  });
