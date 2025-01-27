import { Timestamp } from 'firebase-admin/firestore';
import { ApiFamily, Family } from '@/src/types';
import { adminDb } from '@/src/utils/firebaseAdmin';

/**
 * 家族データを取得する関数
 * @param userId - ログインユーザーのID
 */
export const getFamily = async (userId: string) => {
  try {
    const familyRef = adminDb.collection('users').doc(userId).collection('family');
    const snapshot = await familyRef.get();
    const families = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        birthDate: data.birthDate ? data.birthDate.toDate() : null,
      };
    });

    return families;
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

    const familyData: ApiFamily = {
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

/**
 * 家族データを削除する関数
 * @param userId - ログインユーザーのID
 * @param id - 削除対象のドキュメントID
 */
export const deleteFamily = async (userId: string, id: string) => {
  try {
    const docRef = adminDb.collection('users').doc(userId).collection('family').doc(id);
    await docRef.delete();
    console.log(`ドキュメント ${id} が正常に削除されました`);
  } catch (error) {
    console.error('家族データの削除中にエラーが発生しました:', error);
    throw new Error('家族データの削除に失敗しました');
  }
};
