import { Timestamp } from 'firebase-admin/firestore';
import { ApiExpense, Expense } from '@/src/types';
import { adminDb } from '@/src/utils/firebaseAdmin';

/**
 * 支出データを取得する関数
 * @param userId - ログインユーザーのID
 */
export const getExpense = async (userId: string) => {
  try {
    const expenseRef = adminDb.collection('users').doc(userId).collection('expenses');
    const snapshot = await expenseRef.get();
    const expense = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return expense;
  } catch (error) {
    console.error('支出データの取得中にエラーが発生しました:', error);
    throw new Error('支出データの取得に失敗しました');
  }
};

/**
 * 支出データを追加する関数
 * @param userId - ログインユーザーのID
 * @param newExpense - 追加するデータ
 */
export const addExpense = async (userId: string, newExpense: Expense) => {
  try {
    const docRef = adminDb.collection('users').doc(userId).collection('expenses').doc();

    const expenseData: ApiExpense = {
      ...newExpense,
      recordedDate: Timestamp.fromDate(newExpense.recordedDate),
      createdAt: Timestamp.fromDate(new Date()),
      updatedAt: Timestamp.fromDate(new Date()),
    };

    await docRef.set(expenseData);
    console.log(`ドキュメント ${docRef.id} が正常に追加されました`);
    return docRef.id;
  } catch (error) {
    console.error('支出データの追加中にエラーが発生しました:', error);
    throw new Error('支出データの追加に失敗しました');
  }
};

/**
 * 支出データを更新する関数
 * @param userId - ログインユーザーのID
 * @param id - 更新対象のドキュメントID
 * @param updatedData - 更新するデータ
 */
export const updateExpense = async (userId: string, id: string, updatedData: Expense) => {
  try {
    const docRef = adminDb.collection('users').doc(userId).collection('expenses').doc(id);

    const expenseData: ApiExpense = {
      ...updatedData,
      categories: updatedData.categories,
      recordedDate: Timestamp.fromDate(updatedData.recordedDate),
      createdAt: Timestamp.fromDate(updatedData.createdAt || new Date()),
      updatedAt: Timestamp.fromDate(new Date()),
    };

    await docRef.update(expenseData);
    console.log(`ドキュメント ${id} が正常に更新されました`);
  } catch (error) {
    console.error('支出データの更新中にエラーが発生しました:', error);
    throw new Error('支出データの更新に失敗しました');
  }
};

/**
 * 支出データを削除する関数
 * @param userId - ログインユーザーのID
 * @param id - 削除するデータのID
 */
export const deleteExpense = async (userId: string, id: string) => {
  try {
    const docRef = adminDb.collection('users').doc(userId).collection('expenses').doc(id);

    await docRef.delete();
    console.log(`ドキュメント ${id} が正常に削除されました`);
  } catch (error) {
    console.error('支出データの削除中にエラーが発生しました:', error);
    throw new Error('支出データの削除に失敗しました');
  }
};
