import { describe, it, expect, beforeEach, afterEach, afterAll } from 'vitest'
import { createMocks } from 'node-mocks-http'
// import { POST } from '@/app/api/users/route'
import { POST } from '../../app/api/users/route'
import { prisma } from '../../lib/prisma'
import { createMockRequest } from '../../lib/test-utils'

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
    await prisma.$disconnect()
  })

  it.only('POST /api/users should create new user', async () => {
    const mockBody = {
      email: 'test@example.com',
      name: 'Test User'
    };

    const req = createMockRequest({
      method: 'POST',
      body: JSON.stringify(mockBody)
    });

    const res = await POST(req);
    
    expect(res.status).toBe(201);
    expect(await res.json()).toMatchObject({
      email: mockBody.email,
      name: mockBody.name
    });
  })
}) 