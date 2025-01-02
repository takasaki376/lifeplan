import { NextRequest, NextResponse } from 'next/server';
import { addExpense, updateExpense } from '@/src/app/api/expenses';
import { Expense } from '@/src/types';
import { adminAuth } from '@/src/utils/firebaseAdmin';

/**
 * POST: 新しい支出データを登録
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

    const savedExpenses = [];

    for (const expense of body) {
      const { categories, date, id } = expense;
      if (!userId || !categories || !date) {
        return NextResponse.json(
          { error: 'userId, category, dateのすべてを含む必要があります。' },
          { status: 400 }
        );
      }

      const expenseData: Expense = { categories, date: new Date(date) };

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
