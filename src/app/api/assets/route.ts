import { NextResponse } from 'next/server';
import { Asset } from '@/src/types';
import { adminAuth } from '@/src/utils/firebaseAdmin';
import { getUserId } from '@/src/utils/getUserId';
import { addAssets, deleteAssets, getAssets, updateAssets } from '../assets';

/**
 * GET: 資産データを取得
 */
export async function GET(req: Request) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: '認証トークンが必要です。' }, { status: 401 });
  }

  const idToken = authHeader.split('Bearer ')[1];
  const decodedToken = await adminAuth.verifyIdToken(idToken);
  const userId = decodedToken.uid;

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const assets = getAssets(userId);
    return NextResponse.json(assets);
  } catch (error) {
    console.error(error);
    console.error('ユーザーID：', userId);
    return NextResponse.json({ error: 'Failed to fetch assets' }, { status: 500 });
  }
}

/**
 * POST: 資産データを登録
 */
export async function POST(req: Request) {
  const { userId, error } = await getUserId(req);
  if (error) {
    return NextResponse.json({ error }, { status: 401 });
  }
  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  const body = await req.json();
  const { type, amount, details } = body;

  if (!type || !amount) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  }

  try {
    const newAsset: Asset = {
      type,
      details,
      amount,
    };

    // 登録処理
    newAsset.id = await addAssets(userId, newAsset);

    return NextResponse.json({ newAsset });
  } catch (error) {
    console.error('資産データの登録に失敗しました。:', error);
    return NextResponse.json({ error: '資産データの登録に失敗しました。' }, { status: 500 });
  }
}

/**
 * PUT: 資産データを更新
 */
export async function PUT(req: Request) {
  const { userId, error } = await getUserId(req);
  if (error) {
    return NextResponse.json({ error }, { status: 401 });
  }

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  const body = await req.json();
  const { id, type, amount, details } = body;

  if (!id || !type || !amount) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  }

  const newAsset: Asset = {
    id,
    type,
    details,
    amount,
  };
  try {
    // 登録処理
    const asset = await updateAssets(userId, id, newAsset);

    return NextResponse.json({ asset });
  } catch (error) {
    console.error('資産データの更新に失敗しました。:', error);
    return NextResponse.json({ error: '資産データの更新に失敗しました。' }, { status: 500 });
  }
}

/**
 * DELETE: 資産データを削除
 */
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
    await deleteAssets(userId, id);
    return NextResponse.json({ id });
  } catch (error) {
    console.error('Failed to delete asset:', error);
    return NextResponse.json({ error: '資産データの削除に失敗しました。' }, { status: 500 });
  }
}
