import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    // リクエストボディの取得方法を修正
    const body = await new Response(request.body).json();
    console.log('Parsed request body:', body);
    
    // パスワードフィールドを削除
    const { email, name } = body;
    console.log('Extracted fields:', { email, name });

    // バリデーション
    if (!email) {
      console.log('Validation failed - email is required');
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    console.log('Creating user in database...');
    const newUser = await prisma.user.create({
      data: {
        email,
        name: name || null
      }
    });
    console.log('User created successfully:', newUser);

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error('Error details:', {
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined
    });
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
} 