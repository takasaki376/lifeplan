// src/utils/getUserId.ts
import { adminAuth } from '@/src/utils/firebaseAdmin';

export async function getUserId(req: Request) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: '認証トークンが必要です。' };
  }

  const idToken = authHeader.split('Bearer ')[1];
  const decodedToken = await adminAuth.verifyIdToken(idToken);
  const userId = decodedToken.uid;

  return { userId };
}
