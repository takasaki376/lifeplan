import { Timestamp } from 'firebase-admin/firestore';
import { Family } from '@/src/types';
import { adminDb } from '@/src/utils/firebaseAdmin';

/**
 * 家族データを取得する関数
 * @param userId - ログインユーザーのID
 */
export const getFamily = async (userId: string) => {
  try {
    const familyRef = adminDb.collection('users').doc(userId).collection('family');
    const snapshot = await familyRef.get();
    const family = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return family;
  } catch (error) {
    console.error('家族データの取得中にエラーが発生しました:', error);
    throw new Error('家族データの取得に失敗しました');
  }
};

/**
 * 家族データを追加する関数
 * @param userId - ログインユーザーのID
 * @param newFamily - 追加するデータ
 */
export const addFamily = async (userId: string, newFamily: Family) => {
  try {
    const docRef = adminDb.collection('users').doc(userId).collection('family').doc();

    const familyData = {
      ...newFamily,
      birthDate: newFamily.birthDate ? Timestamp.fromDate(newFamily.birthDate) : '',
    };

    await docRef.set(familyData);
    console.log(`ドキュメント ${docRef.id} が正常に追加されました`);
    return docRef.id;
  } catch (error) {
    console.error('家族データの追加中にエラーが発生しました:', error);
    throw new Error('家族データの追加に失敗しました');
  }
};

/**
 * 家族データを更新する関数
 * @param userId - ログインユーザーのID
 * @param id - 更新対象のドキュメントID
 * @param newFamily - 更新するデータ
 */
export const updateFamily = async (userId: string, id: string, newFamily: Family) => {
  try {
    const docRef = adminDb.collection('users').doc(userId).collection('family').doc(id);
    const familyData = {
      ...newFamily,
      birthDate: newFamily.birthDate ? Timestamp.fromDate(newFamily.birthDate) : '',
    };

    await docRef.update(familyData);
    console.log(`ドキュメント ${id} が正常に更新されました`);
  } catch (error) {
    console.error('家族データの更新中にエラーが発生しました:', error);
    throw new Error('家族データの更新に失敗しました');
  }
};
