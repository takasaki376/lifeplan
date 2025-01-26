import { NextResponse } from 'next/server';
// import { Asset } from '@/src/types';
import { adminAuth, adminDb } from '@/src/utils/firebaseAdmin';
import { getAssets } from '../assets';

// import { getAssets } from '../assets';

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

// /**
//  * POST: 新しい資産データを登録
//  */
// export async function POST(req: Request) {
//   const body = await req.json();

//   const authHeader = req.headers.get('Authorization');
//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     return NextResponse.json({ error: '認証トークンが必要です。' }, { status: 401 });
//   }

//   const idToken = authHeader.split('Bearer ')[1];
//   const decodedToken = await adminAuth.verifyIdToken(idToken);
//   const userId = decodedToken.uid;

//   if (!body.type || !body.amount) {
//     return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
//   }

//   const assetsData: Asset = { categories, date: new Date(date) };

//   try {
//     if (id) {
//       // 更新処理
//       await updateAssets(userId, id, assetsData);
//       assetsData.id = id;
//     } else {
//       // 登録処理
//       assetsData.id = await addAssets(userId, assetsData);
//     }

//     savedAssets.push(assetsData);
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ error: 'Failed to create asset' }, { status: 500 });
//   }
// }

// export async function PUT(req: Request) {
//   const body = await req.json();

//   const authHeader = req.headers.get('Authorization');
//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     return NextResponse.json({ error: '認証トークンが必要です。' }, { status: 401 });
//   }

//   const idToken = authHeader.split('Bearer ')[1];
//   const decodedToken = await adminAuth.verifyIdToken(idToken);
//   const userId = decodedToken.uid;

//   if (!body.id || !body.updatedFields) {
//     return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
//   }

//   try {
//     // 更新処理
//     await updateAssets(userId, id, expenseData);
//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ error: 'Failed to update asset' }, { status: 500 });
//   }
// }

export async function POST(req: Request) {
  const body = await req.json();

  if (!body.userId || !body.type || !body.amount) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    const assetsRef = adminDb.collection('users').doc(body.userId).collection('Assets');
    const docRef = await assetsRef.add({
      type: body.type,
      details: body.details || '',
      amount: body.amount,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return NextResponse.json({ id: docRef.id });
  } catch (error) {
    console.error('Failed to add asset:', error);
    return NextResponse.json({ error: 'Failed to add asset' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const body = await req.json();

  if (!body.id || !body.updatedFields || !body.userId) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    const assetRef = adminDb.collection('users').doc(body.userId).collection('Assets').doc(body.id);
    await assetRef.update({
      ...body.updatedFields,
      updatedAt: new Date(),
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update asset:', error);
    return NextResponse.json({ error: 'Failed to update asset' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  const assetId = searchParams.get('id');

  if (!userId || !assetId) {
    return NextResponse.json({ error: 'User ID and Asset ID are required' }, { status: 400 });
  }

  try {
    const assetRef = adminDb.collection('users').doc(userId).collection('Assets').doc(assetId);
    await assetRef.delete();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete asset:', error);
    return NextResponse.json({ error: 'Failed to delete asset' }, { status: 500 });
  }
}
