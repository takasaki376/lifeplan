// import { Timestamp } from 'firebase-admin/firestore';
// import { Asset } from '@/src/types';
import { adminDb } from '@/src/utils/firebaseAdmin';

/**
 * 資産データを取得する関数
 * @param userId - ログインユーザーのID
 */
export const getAssets = async (userId: string) => {
  try {
    const assetsRef = adminDb.collection('users').doc(userId).collection('Assets');
    const snapshot = await assetsRef.get();
    const assets = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return assets;
  } catch (error) {
    console.error('資産データの取得中にエラーが発生しました:', error);
    throw new Error('資産データの取得に失敗しました');
  }
};

// /**
//  * 資産データを追加する関数
//  * @param userId - ログインユーザーのID
//  * @param newAssets - 追加するデータ
//  */
// export const addAssets = async (userId: string, newAssets: Asset) => {
//   try {
//     const docRef = adminDb.collection('users').doc(userId).collection('assets').doc();

//     const assetsData = {
//       ...newAssets,
//       date: Timestamp.fromDate(newAssets.date),
//     };

//     await docRef.set(assetsData);
//     console.log(`ドキュメント ${docRef.id} が正常に追加されました`);
//     return docRef.id;
//   } catch (error) {
//     console.error('資産データの追加中にエラーが発生しました:', error);
//     throw new Error('資産データの追加に失敗しました');
//   }
// };

// /**
//  * 資産データを更新する関数
//  * @param userId - ログインユーザーのID
//  * @param id - 更新対象のドキュメントID
//  * @param updatedData - 更新するデータ
//  */
// export const updateAssets = async (userId: string, id: string, updatedData: Asset) => {
//   try {
//     const docRef = db.collection('users').doc(userId).collection('Assetss').doc(id);

//     const dataToUpdate: Record<string, any> = {};
//     if (updatedData.categories !== undefined) {
//       dataToUpdate.categories = updatedData.categories;
//     }
//     if (updatedData.date !== undefined) {
//       dataToUpdate.date = Timestamp.fromDate(updatedData.date);
//     }

//     await docRef.update(dataToUpdate);
//     console.log(`ドキュメント ${id} が正常に更新されました`);
//   } catch (error) {
//     console.error('資産データの更新中にエラーが発生しました:', error);
//     throw new Error('資産データの更新に失敗しました');
//   }
// };
