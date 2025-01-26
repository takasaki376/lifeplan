import { NextRequest, NextResponse } from 'next/server';
import { addIncome, deleteIncome, getIncome } from '@/src/app/api/incomes';
import { Income } from '@/src/types';
import { adminAuth } from '@/src/utils/firebaseAdmin';

/**
 * GET: 収入データを取得
 */
export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: '認証トークンが必要です。' }, { status: 401 });
    }

    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    // 収入データを取得
    const incomes = await getIncome(userId);

    return NextResponse.json(incomes, { status: 200 });
  } catch (error) {
    console.error('収入データの取得中にエラーが発生しました:', error);
    return NextResponse.json({ error: '収入データの取得に失敗しました。' }, { status: 500 });
  }
}

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

    const savedIncomes = [];

    const { familyId, name, income, startAge, endAge } = body;
    if (!userId || !name || !income || !startAge || !endAge) {
      return NextResponse.json(
        { error: 'name, income, startAge, endAgeのすべてを含む必要があります。' },
        { status: 400 }
      );
    }

    const incomeData: Income = { familyId, name, income, startAge, endAge };

    // 登録処理
    incomeData.id = await addIncome(userId, incomeData);

    savedIncomes.push(incomeData);

    return NextResponse.json(savedIncomes, { status: 201 });
  } catch (error) {
    console.error('収入データの登録中にエラーが発生しました:', error);
    return NextResponse.json({ error: '収入データの登録に失敗しました。' }, { status: 500 });
  }
}

/**
 * DELETE: 収入データを削除
 */
export async function DELETE(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: '認証トークンが必要です。' }, { status: 401 });
    }

    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    // URLからincomeIdを取得
    const { searchParams } = new URL(req.url);
    const incomeId = searchParams.get('id');

    if (!incomeId) {
      return NextResponse.json({ error: '収入IDが必要です。' }, { status: 400 });
    }

    // 削除処理を実行
    await deleteIncome(userId, incomeId);

    return NextResponse.json({ message: '収入データを削除しました。' }, { status: 200 });
  } catch (error) {
    console.error('収入データの削除中にエラーが発生しました:', error);
    return NextResponse.json({ error: '収入データの削除に失敗しました。' }, { status: 500 });
  }
}
