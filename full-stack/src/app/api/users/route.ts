import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 定数定義
const ERROR_MESSAGES = {
  EMAIL_REQUIRED: 'Email is required',
  CREATE_FAILED: 'Failed to create user'
};

const STATUS_CODES = {
  BAD_REQUEST: 400,
  CREATED: 201,
  SERVER_ERROR: 500
};

export const dynamic = 'force-dynamic';

// バリデーション関数
function validateUserInput(body: any) {
  if (!body?.email) {
    return {
      isValid: false,
      error: NextResponse.json(
        { error: ERROR_MESSAGES.EMAIL_REQUIRED },
        { status: STATUS_CODES.BAD_REQUEST }
      )
    };
  }
  return { isValid: true };
}

// ユーザー作成ロジック
async function createUser(email: string, name?: string) {
  return await prisma.user.create({
    data: {
      email,
      name: name || null
    }
  });
}

export async function POST(request: Request) {
  try {
    const body = await new Response(request.body).json();
    console.log('Parsed request body:', body);

    const { email, name } = body;
    console.log('Extracted fields:', { email, name });

    // バリデーション
    const validation = validateUserInput(body);
    if (!validation.isValid) return validation.error;

    console.log('Creating user in database...');
    const newUser = await createUser(email, name);
    console.log('User created successfully:', newUser);

    return NextResponse.json(newUser, { status: STATUS_CODES.CREATED });
  } catch (error) {
    console.error('Error details:', {
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined
    });
    return NextResponse.json(
      { error: ERROR_MESSAGES.CREATE_FAILED },
      { status: STATUS_CODES.SERVER_ERROR }
    );
  }
} 