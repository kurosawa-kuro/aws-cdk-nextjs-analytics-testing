import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from 'vitest'
import { POST } from '@/app/api/users/route'
import { prisma } from '@/lib/prisma'
import { getUsersData } from '@/app/page'
import { test } from 'vitest'

describe('Users API (Integration)', () => {
  beforeEach(async () => {
    // テストデータのセットアップ
    await prisma.user.createMany({
      data: [
        { email: 'test1@example.com', name: 'User One' },
        { email: 'test2@example.com', name: 'User Two' }
      ]
    })
  })

  afterEach(async () => {
    // テストデータのクリーンアップ
    await prisma.user.deleteMany()
  })

  afterAll(async () => {
    // データベース接続の切断
    await prisma.$disconnect()
  })

  it('POST /api/users should create new user', async () => {
    const mockBody = {
      email: 'test@example.com',
      name: 'Test User'
    }

    const req = new Request('http://localhost/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mockBody)
    })

    const res = await POST(req)
    
    // ステータスコード確認
    expect(res.status).toBe(201)
    
    // レスポンスデータ確認
    const responseData = await res.json()
    expect(responseData).toMatchObject({
      email: mockBody.email,
      name: mockBody.name
    })

    // データベース検証
    const createdUser = await prisma.user.findUnique({
      where: { email: mockBody.email }
    })
    expect(createdUser).toMatchObject({
      email: mockBody.email,
      name: mockBody.name
    })
    
    // 総件数の確認
    const totalUsers = await prisma.user.count()
    expect(totalUsers).toBe(3) // 初期データ2件 + 新規作成1件
  })
})

describe('getUsers Function', () => {
  // テストデータのセットアップ
  const testUsers = [
    { email: 'test1@example.com', name: 'Test User 1' },
    { email: 'test2@example.com', name: 'Test User 2' },
    { email: 'test3@example.com', name: null }, // nameがnullの場合のテスト用
  ];

  beforeAll(async () => {
    // テストデータの挿入
    await prisma.user.createMany({
      data: testUsers,
    });
  });

  afterAll(async () => {
    // テストデータの削除
    await prisma.user.deleteMany({
      where: {
        email: {
          in: testUsers.map(user => user.email),
        },
      },
    });
  });

  test('should return all users', async () => {
    const users = await getUsersData();
    
    // 返却されるユーザー数が正しいか確認
    expect(users.length).toBe(testUsers.length);
    
    // 各ユーザーのデータが正しいか確認
    users.forEach((user, index) => {
      expect(user.email).toBe(testUsers[index].email);
      expect(user.name).toBe(testUsers[index].name);
    });
  });

  
}); 