import { Timestamp } from 'firebase-admin/firestore';
import { Debt } from '@/src/types';
import { adminDb } from '@/src/utils/firebaseAdmin';

/**
 * 債務データを取得する関数
 * @param userId - ログインユーザーのID
 */
export const getDebt = async (userId: string) => {
  try {
    const expenseRef = adminDb.collection('users').doc(userId).collection('debts');
    const snapshot = await expenseRef.get();
    const debt = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return debt;
  } catch (error) {
    console.error('債務データの取得中にエラーが発生しました:', error);
    throw new Error('債務データの取得に失敗しました');
  }
};

/**
 * 債務データを追加する関数
 * @param userId - ログインユーザーのID
 * @param newDebt - 追加するデータ
 */
export const addDebt = async (userId: string, newDebt: Debt) => {
  try {
    const docRef = adminDb.collection('users').doc(userId).collection('debts').doc();

    const debtData = {
      ...newDebt,
      dueDate: newDebt.dueDate ? Timestamp.fromDate(newDebt.dueDate) : '',
      recordedDate: Timestamp.fromDate(newDebt.recordedDate),
    };

    await docRef.set(debtData);
    console.log(`ドキュメント ${docRef.id} が正常に追加されました`);
    return docRef.id;
  } catch (error) {
    console.error('債務データの追加中にエラーが発生しました:', error);
    throw new Error('債務データの追加に失敗しました');
  }
};

/**
 * 債務データを更新する関数
 * @param userId - ログインユーザーのID
 * @param id - 更新対象のドキュメントID
 * @param updatedData - 更新するデータ
 */
export const updateDebt = async (userId: string, id: string, updatedData: Debt) => {
  try {
    const docRef = adminDb.collection('users').doc(userId).collection('debts').doc(id);

    const dataToUpdate: Record<string, any> = {};
    if (updatedData.recordedDate !== undefined) {
      dataToUpdate.recordedDate = Timestamp.fromDate(updatedData.recordedDate);
    }
    if (updatedData.recordedDate !== undefined) {
      dataToUpdate.recordedDate = Timestamp.fromDate(updatedData.recordedDate);
    }

    await docRef.update(dataToUpdate);
    console.log(`ドキュメント ${id} が正常に更新されました`);
  } catch (error) {
    console.error('債務データの更新中にエラーが発生しました:', error);
    throw new Error('債務データの更新に失敗しました');
  }
};

/**
 * 債務データを削除する関数
 * @param userId - ログインユーザーのID
 * @param id - 削除するデータのID
 */
export const deleteDebt = async (userId: string, id: string) => {
  try {
    const docRef = adminDb.collection('users').doc(userId).collection('debts').doc(id);

    await docRef.delete();
    console.log(`ドキュメント ${id} が正常に削除されました`);
  } catch (error) {
    console.error('債務データの削除中にエラーが発生しました:', error);
    throw new Error('債務データの削除に失敗しました');
  }
};
