'use client';

import { useState } from 'react';
import { auth } from '@/src/utils/firebase';
import { Asset } from '../types';

export const useAsset = () => {
  const [assets, setAsset] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const idToken = async () => {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('ユーザーが認証されていません');
    }

    const idToken = await user.getIdToken();
    return idToken;
  };

  // useEffect(() => {
  //   if (!idToken) {
  //     return;
  //   }

  //   const fetchAssets = async () => {
  //     setLoading(true);
  //     try {
  //       const res = await fetch('/api/assets', {
  //         headers: {
  //           Authorization: `Bearer ${idToken}`,
  //         },
  //       });
  //       if (!res.ok) {
  //         throw new Error('Failed to fetch assets');
  //       }
  //       const data: Asset[] = await res.json();
  //       setAsset(data);
  //     } catch (err) {
  //       console.error(err);
  //       setError('資産データの取得に失敗しました');
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchAssets();
  // }, [idToken]);

  /**
   * 資産データをAPI経由で登録する関数
   * @param newAsset - 登録する資産データの配列
   */
  const addAsset = async (newAsset: Asset) => {
    try {
      const response = await fetch('/api/assets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${idToken}` },
        body: JSON.stringify(newAsset),
      });

      if (!response.ok) {
        throw new Error('資産データの登録に失敗しました');
      }

      const savedAsset = await response.json();
      setAsset((prev) => [...prev, ...savedAsset]);
    } catch (error) {
      console.error('登録エラー:', error);
      throw error;
    }
  };

  // 資産を更新
  const updateAsset = async (id: string, updatedFields: Partial<Asset>) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/assets`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ id, updatedFields }),
      });
      if (!res.ok) {
        throw new Error('Failed to update asset');
      }
      await res.json();
      // データ再取得
      const updatedAssets = await fetch(`/api/assets`, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      }).then((res) => res.json());
      setAsset(updatedAssets);
    } catch (err) {
      console.error(err);
      setError('資産の更新に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  // 資産を削除
  const deleteAsset = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/assets?id=${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      if (!res.ok) {
        throw new Error('Failed to delete asset');
      }
      await res.json();
      // データ再取得
      const updatedAssets = await fetch(`/api/assets`, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      }).then((res) => res.json());
      setAsset(updatedAssets);
    } catch (err) {
      console.error(err);
      setError('資産の削除に失敗しました');
    } finally {
      setLoading(false);
    }
  };
  return { assets, addAsset, updateAsset, deleteAsset, loading, error };
};
