import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

const app =
  getApps()[0] ??
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });

export const adminAuth = getAuth(app);
export const adminDb = getFirestore(app);

export const verifyIdToken = async (token: string) => {
  try {
    return await adminAuth.verifyIdToken(token);
  } catch (error) {
    console.error('Error verifying ID token:', error);
    return null;
  }
};
