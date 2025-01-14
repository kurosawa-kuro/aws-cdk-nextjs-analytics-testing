// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // favicon.icoのリクエストを無視
  if (request.nextUrl.pathname.includes('favicon.ico')) {
    return NextResponse.next();
  }
  
  // 特定のパスだけ処理する
  if (!request.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.next();
  }
  
  console.log('middleware');
  // 認証チェックなどの処理
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * 以下のパスを除外
     * - _next/static (静的ファイル)
     * - _next/image (画像最適化)
     * - favicon.ico (ファビコン)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};