import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from 'vitest'
import { POST } from '@/app/api/users/route'
import { prisma } from '@/lib/prisma'
import { getUsersData } from '@/app/page'
import { test } from 'vitest'

// テストデータ管理用のユーティリティ関数を追加
const setupTestUsers = async (users: Array<{ email: string; name: string | null }>) => {
  await prisma.user.createMany({ data: users });
};

const cleanupTestUsers = async (emails: string[]) => {
  await prisma.user.deleteMany({
    where: { email: { in: emails } }
  });
};

// 共通のテストデータを定数化
const TEST_USERS = [
  { email: 'test1@example.com', name: 'User One' },
  { email: 'test2@example.com', name: 'User Two' },
  { email: 'test3@example.com', name: null }
];

// 共通のアサーション関数を定義
const assertUserData = (actual: any, expected: any) => {
  expect(actual.email).toBe(expected.email);
  expect(actual.name).toBe(expected.name);
};

describe('Users API (Integration)', () => {
  beforeEach(async () => {
    await prisma.user.deleteMany({});
    await setupTestUsers(TEST_USERS.slice(0, 2));
  });

  afterEach(async () => {
    await cleanupTestUsers(TEST_USERS.map(u => u.email));
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /api/users', () => {
    const createTestRequest = (body: any) => new Request('http://localhost/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    it('should create new user with valid data', async () => {
      const mockBody = { email: 'unique@example.com', name: 'New User' };
      const req = createTestRequest(mockBody);

      const res = await POST(req);
      if (!res) {
        throw new Error('Response is undefined');
      }

      expect(res.status).toBe(201);
      
      const responseData = await res.json();
      assertUserData(responseData, mockBody);

      const createdUser = await prisma.user.findUnique({
        where: { email: mockBody.email }
      });
      assertUserData(createdUser, mockBody);
    });

    // 他のテストケースも同様にリファクタリング可能
  });
});

describe('getUsers Function', () => {
  beforeAll(async () => {
    await prisma.user.deleteMany({});
    await setupTestUsers(TEST_USERS);
  });

  afterAll(async () => {
    await cleanupTestUsers(TEST_USERS.map(u => u.email));
  });

  it('should return all users with correct data', async () => {
    const users = await getUsersData();
    
    // データ順序を考慮せずに検証
    TEST_USERS.forEach(expectedUser => {
      const actualUser = users.find(u => u.email === expectedUser.email);
      expect(actualUser).toBeDefined();
      assertUserData(actualUser, expectedUser);
    });
  });
}); 