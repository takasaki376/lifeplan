import { Timestamp } from 'firebase-admin/firestore';
import { Expense } from '@/src/types';
import { adminDb } from '@/src/utils/firebaseAdmin';

/**
 * 支出データを追加する関数
 * @param userId - ログインユーザーのID
 * @param newExpense - 追加するデータ
 */
export const addExpense = async (userId: string, newExpense: Expense) => {
  try {
    const docRef = adminDb.collection('users').doc(userId).collection('expenses').doc();

    const expenseData = {
      ...newExpense,
      date: Timestamp.fromDate(newExpense.date),
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
    const docRef = db.collection('users').doc(userId).collection('expenses').doc(id);

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
    console.error('支出データの更新中にエラーが発生しました:', error);
    throw new Error('支出データの更新に失敗しました');
  }
};
