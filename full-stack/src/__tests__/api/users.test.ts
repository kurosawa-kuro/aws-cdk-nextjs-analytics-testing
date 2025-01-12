import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { POST } from '@/app/api/users/route'
import { prisma } from '@/lib/prisma'

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

    // データベースに実際に保存されたか確認
    const createdUser = await prisma.user.findUnique({
      where: { email: mockBody.email }
    })
    expect(createdUser).not.toBeNull()
  })
}) 