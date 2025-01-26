import { NextRequest, NextResponse } from 'next/server';
import { addFamily } from '@/src/app/api/family';
import { Family } from '@/src/types';
import { adminAuth } from '@/src/utils/firebaseAdmin';

/**
 * POST: 新しい家族データを登録
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: '認証トークンが必要です。' }, { status: 401 });
    }

    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    const savedFamily = [];

    const { name, birthDate, relation } = body;
    if (!userId || !name || !birthDate || !relation) {
      return NextResponse.json(
        { error: '氏名, 生年月日, 続柄のすべてを含む必要があります。' },
        { status: 400 }
      );
    }

    const familyData: Family = { name, birthDate: new Date(birthDate), relation };

    // 登録処理
    familyData.id = await addFamily(userId, familyData);

    savedFamily.push(familyData);

    return NextResponse.json(savedFamily, { status: 201 });
  } catch (error) {
    console.error('家族データの登録中にエラーが発生しました:', error);
    return NextResponse.json({ error: '家族データの登録に失敗しました。' }, { status: 500 });
  }
}
