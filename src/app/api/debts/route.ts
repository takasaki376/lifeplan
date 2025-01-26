import { NextResponse } from 'next/server';
import { addDebt } from '@/src/app/api/debts';
import { Debt } from '@/src/types';
import { adminDb } from '@/src/utils/firebaseAdmin';

// // 債務の取得
// export async function GET(req: Request) {
//   const { searchParams } = new URL(req.url);
//   const userId = searchParams.get('userId');
//   if (!userId) {
//     return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
//   }

//   try {
//     const snapshot = await adminDb.collection('debts').where('userId', '==', userId).get();
//     const debts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//     return NextResponse.json(debts);
//   } catch (error) {
//     return NextResponse.json({ error: '債務データの取得に失敗しました' }, { status: 500 });
//   }
// }

// 債務の追加
export async function POST(req: Request) {
  const body = await req.json();
  const { userId, name, balance, interestRate, monthlyPayment, dueDate, recordedDate } = body;

  if (!userId || !name || balance === undefined) {
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
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Debt ID is required' }, { status: 400 });
  }

  try {
    await adminDb.collection('debts').doc(id).delete();
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: '債務データの削除に失敗しました。' }, { status: 500 });
  }
}
