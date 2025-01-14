import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { TestSetup } from '../test-setup'
import { POST } from '@/app/api/users/route'
import { getUsersData } from '@/app/page'
import { prisma } from '@/lib/prisma';

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
    // 各テスト前に初期データをセットアップ
    await TestSetup.setupTestUsers(TEST_USERS.slice(0, 2));
  });

  afterEach(async () => {
    // 各テスト後にデータをクリーンアップ
    await TestSetup.cleanupTestUsers(TEST_USERS.map(u => u.email));
  });

  describe('POST /api/users', () => {
    it('should create new user with valid data', async () => {
      const mockBody = { email: 'unique@example.com', name: 'New User' };
      const req = TestSetup.createMockRequest('/api/users', {
        method: 'POST',
        body: JSON.stringify(mockBody)
      });

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
  });
});

describe('getUsers Function', () => {
  beforeEach(async () => {
    // 各テスト前に初期データをセットアップ
    await TestSetup.setupTestUsers(TEST_USERS);
  });

  afterEach(async () => {
    // 各テスト後にデータをクリーンアップ
    await TestSetup.cleanupTestUsers(TEST_USERS.map(u => u.email));
  });

  it('should return all users with correct data', async () => {
    const users = await getUsersData();
    
    TEST_USERS.forEach(expectedUser => {
      const actualUser = users.find(u => u.email === expectedUser.email);
      expect(actualUser).toBeDefined();
      assertUserData(actualUser, expectedUser);
    });
  });
}); 