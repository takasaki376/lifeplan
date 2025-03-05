import { NextRequest, NextResponse } from 'next/server';
import { addFamily, deleteFamily } from '@/src/app/api/family';
import { Family } from '@/src/types';
import { getUserId } from '@/src/utils/getUserId';

/**
 * POST: 新しい家族データを登録
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
    const savedFamily = [];

    const { name, birthDate, relation } = body;
    if (!userId || !name || !birthDate || !relation) {
      return NextResponse.json(
        { error: '氏名, 生年月日, 続柄のすべてを含む必要があります。' },
        { status: 400 }
      );
    }

    const familyData: Family = { name, birthDate: new Date(birthDate), relation };

    // 登録処理
    familyData.id = await addFamily(userId, familyData);

    savedFamily.push(familyData);

    return NextResponse.json(savedFamily, { status: 201 });
  } catch (error) {
    console.error('家族データの登録中にエラーが発生しました:', error);
    return NextResponse.json({ error: '家族データの登録に失敗しました。' }, { status: 500 });
  }
}

/**
 * DELETE: 家族データを削除
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
    await deleteFamily(userId, id);
    return NextResponse.json({ id });
  } catch (error) {
    return NextResponse.json({ error: '家族データの削除に失敗しました。' }, { status: 500 });
  }
}
