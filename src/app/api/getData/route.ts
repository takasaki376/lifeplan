import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/src/utils/firebaseAdmin';
import { getAssets } from '../assets';
import { getDebt } from '../debts';
import { getExpense } from '../expenses';
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
    const assets = await getAssets(userId);

    // Familyデータの取得
    const families = await getFamily(userId);

    // Incomeデータの取得
    const incomes = await getIncome(userId);

    // Expenseデータの取得
    const expenses = await getExpense(userId);

    // 債務データの取得
    const debts = await getDebt(userId);

    return NextResponse.json({ assets, families, incomes, expenses, debts }, { status: 200 });
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
