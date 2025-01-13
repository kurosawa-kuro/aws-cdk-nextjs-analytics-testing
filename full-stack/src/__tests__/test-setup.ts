import { afterAll, beforeAll } from 'vitest';

beforeAll(async () => {
  // テスト前の初期化処理
});

afterAll(async () => {
  // テスト後の後処理
});

export function createMockRequest(init: {
  method: string;
  body?: string;
}): Request {
  return new Request('http://localhost/api/users', {
    method: init.method,
    headers: {
      'Content-Type': 'application/json'
    },
    body: init.body
  });
} 