import { NextResponse } from 'next/server';
import { addDebt, deleteDebt } from '@/src/app/api/debts';
import { Debt } from '@/src/types';
import { getUserId } from '@/src/utils/getUserId';

// 債務の追加
export async function POST(req: Request) {
  const { userId, error } = await getUserId(req);
  if (error) {
    return NextResponse.json({ error }, { status: 401 });
  }
  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  const body = await req.json();
  const { name, balance, interestRate, monthlyPayment, dueDate, recordedDate } = body;

  if (
    !name ||
    balance === undefined ||
    interestRate === undefined ||
    monthlyPayment === undefined
  ) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  }

  try {
    const newDebt: Debt = {
      name,
      balance,
      interestRate,
      monthlyPayment,
      dueDate,
      recordedDate,
    };

    // 登録処理
    newDebt.id = await addDebt(userId, newDebt);

    return NextResponse.json({ newDebt });
  } catch (error) {
    return NextResponse.json({ error: '債務データの登録に失敗しました。' }, { status: 500 });
  }
}

// 債務の削除
export async function DELETE(req: Request) {
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
    return NextResponse.json({ error: 'Debt ID is required' }, { status: 400 });
  }

  try {
    await deleteDebt(userId, id);
    return NextResponse.json({ id });
  } catch (error) {
    return NextResponse.json({ error: '債務データの削除に失敗しました。' }, { status: 500 });
  }
}
