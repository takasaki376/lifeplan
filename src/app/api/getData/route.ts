import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/src/utils/firebaseAdmin';
import { getFamily } from '../family';
import { getIncome } from '../incomes';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: '認証トークンが必要です。' }, { status: 401 });
    }

    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    // Familyデータの取得
    const families = await getFamily(userId);

    // Incomeデータの取得
    const incomes = await getIncome(userId);

    return NextResponse.json({ families, incomes }, { status: 200 });
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
