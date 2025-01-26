import { NextRequest, NextResponse } from 'next/server';
import { addIncome, updateIncome } from '@/src/app/api/incomes';
import { Income } from '@/src/types';
import { adminAuth } from '@/src/utils/firebaseAdmin';

/**
 * POST: 新しい収入データを登録
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

    if (!Array.isArray(body)) {
      return NextResponse.json(
        { error: 'リクエストボディは配列形式である必要があります。' },
        { status: 400 }
      );
    }

    const savedIncomes = [];

    for (const income of body) {
      const { categories, recordedDate, id } = income;
      if (!userId || !categories || !recordedDate) {
        return NextResponse.json(
          { error: 'userId, category, dateのすべてを含む必要があります。' },
          { status: 400 }
        );
      }

      const incomeData: Income = { categories, recordedDate: new Date(recordedDate) };

      if (id) {
        // 更新処理
        await updateIncome(userId, id, incomeData);
        incomeData.id = id;
      } else {
        // 登録処理
        incomeData.id = await addIncome(userId, incomeData);
      }

      savedIncomes.push(incomeData);
    }

    return NextResponse.json(savedIncomes, { status: 201 });
  } catch (error) {
    console.error('収入データの登録中にエラーが発生しました:', error);
    return NextResponse.json({ error: '収入データの登録に失敗しました。' }, { status: 500 });
  }
}
