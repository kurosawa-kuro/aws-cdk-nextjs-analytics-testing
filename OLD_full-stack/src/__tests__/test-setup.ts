// import { clearAllTables } from '@/lib/dbUtil';
import { afterAll, afterEach, beforeAll, beforeEach } from 'vitest';
// /home/wsl/app/full-stack/src/lib/prisma.ts
import { clearAllTables, prisma } from '@/lib/prisma';

class TestSetup {
  // 1. 初期化関連メソッド
  static async initialize() {
    await clearAllTables();
  }

  // 2. クリーンアップ関連メソッド
  static async cleanup() {
    await prisma.$disconnect();
    await clearAllTables();
  }

  // 3. テストデータ作成メソッド
  static async setupTestUsers(users: Array<{ email: string; name: string | null }>) {
    await prisma.user.createMany({ data: users });
  }

  // 4. テストデータ削除メソッド
  static async cleanupTestUsers(emails: string[]) {
    await prisma.user.deleteMany({ where: { email: { in: emails } } });
  }

  // 5. テスト用ユーティリティメソッド
  static createMockRequest(
    endpoint: string,
    init: { method: string; body?: string }
  ): Request {
    return new Request(`http://localhost${endpoint}`, {
      method: init.method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: init.body
    });
  }
}

// テストフックの設定
beforeAll(async () => {
  // console.log('beforeAll');
  await TestSetup.initialize();
});

afterAll(async () => {
  // console.log('afterAll');
  await TestSetup.cleanup();
});

export { TestSetup };

