import { NextRequest, NextResponse } from 'next/server';
import { updateExpense } from '@/src/app/api/expenses';
import { Expense } from '@/src/types';
import { adminAuth } from '@/src/utils/firebaseAdmin';

/**
 * PATCH: 既存の支出データを更新
 */
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;

  try {
    const body = await req.json();
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: '認証トークンが必要です。' }, { status: 401 });
    }

    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    const expenseData: Expense = { categories, date: new Date(date) };
    const { categories, date } = body;

    if (!categories && !date) {
      return NextResponse.json({ error: '更新するデータが指定されていません。' }, { status: 400 });
    }

    await updateExpense(userId, id, expenseData);

    return NextResponse.json({ id, ...dataToUpdate }, { status: 200 });
  } catch (error) {
    console.error('支出データの更新中にエラーが発生しました:', error);
    return NextResponse.json({ error: '支出データの更新に失敗しました。' }, { status: 500 });
  }
}
