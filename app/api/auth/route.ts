// app/api/auth/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/app/utils/firebaseAdmin';

export async function POST(request: NextRequest) {
  const { idToken } = await request.json();

  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const uid = decodedToken.uid;
    // 必要に応じてユーザー情報を取得・処理
    return NextResponse.json({ uid });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid ID token' }, { status: 401 });
  }
}
