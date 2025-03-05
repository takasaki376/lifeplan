import { Timestamp } from 'firebase-admin/firestore';
import { ApiDebt, Debt } from '@/src/types';
import { adminDb } from '@/src/utils/firebaseAdmin';

/**
 * 債務データを取得する関数
 * @param userId - ログインユーザーのID
 */
export const getDebt = async (userId: string) => {
  try {
    const expenseRef = adminDb.collection('users').doc(userId).collection('debts');
    const snapshot = await expenseRef.get();
    const debt = snapshot.docs.map((doc) => {
      const data = doc.data() as ApiDebt;
      return {
        id: doc.id,
        ...data,
        dueDate: data.dueDate instanceof Timestamp ? data.dueDate.toDate() : null,
        recordedDate: data.recordedDate instanceof Timestamp ? data.recordedDate.toDate() : null,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : null,
        updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : null,
      };
    });
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

    const debtData: ApiDebt = {
      ...newDebt,
      dueDate: newDebt.dueDate ? Timestamp.fromDate(new Date(newDebt.dueDate)) : '',
      recordedDate: Timestamp.fromDate(new Date(newDebt.recordedDate)),
      createdAt: Timestamp.fromDate(new Date()),
      updatedAt: Timestamp.fromDate(new Date()),
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

    const debtData = {
      ...updatedData,
      dueDate: updatedData.dueDate ? Timestamp.fromDate(updatedData.dueDate) : '',
      recordedDate: Timestamp.fromDate(updatedData.recordedDate),
      createdAt: Timestamp.fromDate(updatedData.createdAt || new Date()),
      updatedAt: Timestamp.fromDate(new Date()),
    };

    await docRef.update(debtData);
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
