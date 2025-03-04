import { Timestamp } from 'firebase-admin/firestore';
import { ApiIncome, Income } from '@/src/types';
import { adminDb } from '@/src/utils/firebaseAdmin';

/**
 * 収入データを取得する関数
 * @param userId - ログインユーザーのID
 */
export const getIncome = async (userId: string) => {
  try {
    const incomeRef = adminDb.collection('users').doc(userId).collection('incomes');
    const snapshot = await incomeRef.get();
    const incomes = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return incomes;
  } catch (error) {
    console.error('収入データの取得中にエラーが発生しました:', error);
    throw new Error('収入データの取得に失敗しました');
  }
};

/**
 * 収入データを追加する関数
 * @param userId - ログインユーザーのID
 * @param newIncome - 追加するデータ
 */
export const addIncome = async (userId: string, newIncome: Income) => {
  try {
    const docRef = adminDb.collection('users').doc(userId).collection('incomes').doc();

    const incomeData: ApiIncome = {
      ...newIncome,
      createdAt: Timestamp.fromDate(new Date()),
      updatedAt: Timestamp.fromDate(new Date()),
    };

    await docRef.set(incomeData);
    console.log(`ドキュメント ${docRef.id} が正常に追加されました`);
    return docRef.id;
  } catch (error) {
    console.error('収入データの追加中にエラーが発生しました:', error);
    throw new Error('収入データの追加に失敗しました');
  }
};

/**
 * 収入データを更新する関数
 * @param userId - ログインユーザーのID
 * @param id - 更新対象のドキュメントID
 * @param updatedData - 更新するデータ
 */
export const updateIncome = async (userId: string, id: string, updatedData: Income) => {
  try {
    const docRef = adminDb.collection('users').doc(userId).collection('incomes').doc(id);

    const incomeData: ApiIncome = {
      ...updatedData,
      createdAt: Timestamp.fromDate(updatedData.createdAt || new Date()),
      updatedAt: Timestamp.fromDate(new Date()),
    };

    await docRef.update(incomeData);
    console.log(`ドキュメント ${id} が正常に更新されました`);
  } catch (error) {
    console.error('収入データの更新中にエラーが発生しました:', error);
    throw new Error('収入データの更新に失敗しました');
  }
};

/**
 * 収入データを削除する関数
 * @param userId - ログインユーザーのID
 * @param id - 削除対象のドキュメントID
 */
export const deleteIncome = async (userId: string, id: string) => {
  try {
    const docRef = adminDb.collection('users').doc(userId).collection('incomes').doc(id);
    await docRef.delete();
    console.log(`ドキュメント ${id} が正常に削除されました`);
  } catch (error) {
    console.error('収入データの削除中にエラーが発生しました:', error);
    throw new Error('収入データの削除に失敗しました');
  }
};
