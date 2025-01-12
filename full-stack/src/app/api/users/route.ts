import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic'; // キャッシュ無効化

export async function POST(request: Request) {
  try {
    const { email, name } = await request.json();
    
    // バリデーション
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const newUser = await prisma.user.create({
      data: {
        email,
        name // Optionalなのでnull許容
      }
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error('Failed to create user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
} 