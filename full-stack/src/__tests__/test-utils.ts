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