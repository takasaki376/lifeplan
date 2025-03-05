import { NextRequest, NextResponse } from 'next/server';
import { addExpense, updateExpense } from '@/src/app/api/expenses';
import { Expense } from '@/src/types';
// import { adminAuth } from '@/src/utils/firebaseAdmin';

import { getUserId } from '@/src/utils/getUserId';

/**
 * POST: 新しい支出データを登録
 */
export async function POST(req: NextRequest) {
  try {
    const { userId, error } = await getUserId(req);
    if (error) {
      return NextResponse.json({ error }, { status: 401 });
    }
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const body = await req.json();
    if (!Array.isArray(body)) {
      return NextResponse.json(
        { error: 'リクエストボディは配列形式である必要があります。' },
        { status: 400 }
      );
    }

    const savedExpenses = [];

    for (const expense of body) {
      const { categories, recordedDate, id } = expense;
      if (!categories || !recordedDate) {
        return NextResponse.json(
          { error: 'category, dateのすべてを含む必要があります。' },
          { status: 400 }
        );
      }

      const expenseData: Expense = { categories, recordedDate: new Date(recordedDate) };

      if (id) {
        // 更新処理
        await updateExpense(userId, id, expenseData);
        expenseData.id = id;
      } else {
        // 登録処理
        expenseData.id = await addExpense(userId, expenseData);
      }

      savedExpenses.push(expenseData);
    }

    return NextResponse.json(savedExpenses, { status: 201 });
  } catch (error) {
    console.error('支出データの登録中にエラーが発生しました:', error);
    return NextResponse.json({ error: '支出データの登録に失敗しました。' }, { status: 500 });
  }
}
