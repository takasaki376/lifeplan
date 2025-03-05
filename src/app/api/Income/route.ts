import { NextRequest, NextResponse } from 'next/server';
import { addIncome, deleteIncome, getIncome } from '@/src/app/api/incomes';
import { Income } from '@/src/types';
import { getUserId } from '@/src/utils/getUserId';

/**
 * GET: 収入データを取得
 */
export async function GET(req: NextRequest) {
  try {
    const { userId, error } = await getUserId(req);
    if (error) {
      return NextResponse.json({ error }, { status: 401 });
    }
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

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
    const { userId, error } = await getUserId(req);
    if (error) {
      return NextResponse.json({ error }, { status: 401 });
    }
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const body = await req.json();
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
  const { userId, error } = await getUserId(req);
  if (error) {
    return NextResponse.json({ error }, { status: 401 });
  }
  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'family ID is required' }, { status: 400 });
  }

  try {
    await deleteIncome(userId, id);
    return NextResponse.json({ id });
  } catch (error) {
    console.error('収入データの削除中にエラーが発生しました:', error);
    return NextResponse.json({ error: '収入データの削除に失敗しました。' }, { status: 500 });
  }
}
