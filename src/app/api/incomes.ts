import { Timestamp } from 'firebase-admin/firestore';
import { Income } from '@/src/types';
import { adminDb } from '@/src/utils/firebaseAdmin';

/**
 * 収入データを取得する関数
 * @param userId - ログインユーザーのID
 */
export const getIncome = async (userId: string) => {
  try {
    const incomeRef = adminDb.collection('users').doc(userId).collection('incomes');
    const snapshot = await incomeRef.get();
    const income = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return income;
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

    const incomeData = {
      ...newIncome,
      date: Timestamp.fromDate(newIncome.date),
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

    const dataToUpdate: Record<string, any> = {};
    if (updatedData.categories !== undefined) {
      dataToUpdate.categories = updatedData.categories;
    }
    if (updatedData.date !== undefined) {
      dataToUpdate.date = Timestamp.fromDate(updatedData.date);
    }

    await docRef.update(dataToUpdate);
    console.log(`ドキュメント ${id} が正常に更新されました`);
  } catch (error) {
    console.error('収入データの更新中にエラーが発生しました:', error);
    throw new Error('収入データの更新に失敗しました');
  }
};
