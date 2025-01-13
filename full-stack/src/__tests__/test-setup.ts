import { clearAllTables } from '@/lib/dbUtil';
import { afterAll, afterEach, beforeAll, beforeEach } from 'vitest';
// /home/wsl/app/full-stack/src/lib/prisma.ts
import { prisma } from '@/lib/prisma';

class TestSetup {
  static async initialize() {
    await clearAllTables();
  }

  static async cleanup() {
    await prisma.$disconnect();
    await clearAllTables();
  }

  static async setupTestUsers(users: Array<{ email: string; name: string | null }>) {
    await prisma.user.createMany({ data: users });
  }

  static async cleanupTestUsers(emails: string[]) {
    await prisma.user.deleteMany({ where: { email: { in: emails } } });
  }

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

