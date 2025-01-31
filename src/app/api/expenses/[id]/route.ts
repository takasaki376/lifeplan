import { NextRequest, NextResponse } from 'next/server';
import { updateExpense } from '@/src/app/api/expenses';
import { Expense } from '@/src/types';
import { adminAuth } from '@/src/utils/firebaseAdmin';

/**
 * PATCH: 既存の支出データを更新
 */
export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  try {
    const body = await req.json();
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: '認証トークンが必要です。' }, { status: 401 });
    }

    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    const { categories, date } = body;
    const expenseData: Expense = { categories, recordedDate: new Date(date) };

    if (!categories && !date) {
      return NextResponse.json({ error: '更新するデータが指定されていません。' }, { status: 400 });
    }

    await updateExpense(userId, id, expenseData);

    return NextResponse.json({ id, ...expenseData }, { status: 200 });
  } catch (error) {
    console.error('支出データの更新中にエラーが発生しました:', error);
    return NextResponse.json({ error: '支出データの更新に失敗しました。' }, { status: 500 });
  }
}
