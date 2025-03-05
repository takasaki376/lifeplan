import { Timestamp } from 'firebase-admin/firestore';
import { ApiAsset, Asset } from '@/src/types';
import { adminDb } from '@/src/utils/firebaseAdmin';

/**
 * 資産データを取得する関数
 * @param userId - ログインユーザーのID
 */
export const getAssets = async (userId: string) => {
  try {
    const assetsRef = adminDb.collection('users').doc(userId).collection('assets');
    const snapshot = await assetsRef.get();
    const assets = snapshot.docs.map((doc) => {
      const data = doc.data() as ApiAsset;
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : null,
        updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : null,
      };
    });
    return assets;
  } catch (error) {
    console.error('資産データの取得中にエラーが発生しました:', error);
    throw new Error('資産データの取得に失敗しました');
  }
};

/**
 * 資産データを追加する関数
 * @param userId - ログインユーザーのID
 * @param newAssets - 追加するデータ
 */
export const addAssets = async (userId: string, newAssets: Asset) => {
  try {
    const docRef = adminDb.collection('users').doc(userId).collection('assets').doc();

    const assetsData: ApiAsset = {
      ...newAssets,
      createdAt: Timestamp.fromDate(new Date()),
      updatedAt: Timestamp.fromDate(new Date()),
    };

    await docRef.set(assetsData);
    console.log(`ドキュメント ${docRef.id} が正常に追加されました`);
    return docRef.id;
  } catch (error) {
    console.error('資産データの追加中にエラーが発生しました:', error);
    throw new Error('資産データの追加に失敗しました');
  }
};

/**
 * 資産データを更新する関数
 * @param userId - ログインユーザーのID
 * @param id - 更新対象のドキュメントID
 * @param updatedData - 更新するデータ
 */
export const updateAssets = async (userId: string, id: string, updatedData: Asset) => {
  try {
    const docRef = adminDb.collection('users').doc(userId).collection('assets').doc(id);

    const assetsData: ApiAsset = {
      ...updatedData,
      createdAt: Timestamp.fromDate(updatedData.createdAt || new Date()),
      updatedAt: Timestamp.fromDate(new Date()),
    };

    await docRef.update(assetsData);
    console.log(`ドキュメント ${id} が正常に更新されました`);
    return assetsData;
  } catch (error) {
    console.error('資産データの更新中にエラーが発生しました:', error);
    throw new Error('資産データの更新に失敗しました');
  }
};

/**
 * 資産データを削除する関数
 * @param userId - ログインユーザーのID
 * @param id - 削除するデータのID
 */
export const deleteAssets = async (userId: string, id: string) => {
  try {
    const docRef = adminDb.collection('users').doc(userId).collection('assets').doc(id);

    await docRef.delete();
    console.log(`ドキュメント ${id} が正常に削除されました`);
    return id;
  } catch (error) {
    console.error('資産データの削除中にエラーが発生しました:', error);
    throw new Error('資産データの削除に失敗しました');
  }
};
