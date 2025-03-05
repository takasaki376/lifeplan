'use client';

import { useState } from 'react';
import { useAtom } from 'jotai';
import { createDelete, createPost, createPut } from '../services/api';
import { assetsAtom } from '../store/atoms';
import { Asset } from '../types';

export const useAsset = () => {
  const [assets, setAsset] = useAtom(assetsAtom);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * 資産データをAPI経由で登録する関数
   * @param newAsset - 登録する資産データの配列
   */
  const addAsset = async (newAsset: Asset) => {
    setLoading(true);
    try {
      const savedAsset = await createPost<Asset>('assets', newAsset);
      setAsset((prev) => [...prev, ...savedAsset.data]);
    } catch (error) {
      console.error('登録エラー:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 資産を更新
  const updateAsset = async (id: string, updatedFields: Partial<Asset>) => {
    setLoading(true);
    try {
      const updatedAsset = await createPut<Asset>('assets', updatedFields);

      setAsset((prev) => prev.map((asset) => (asset.id === id ? updatedAsset.data : asset)));
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
      const res = await createDelete<Asset>('assets', id);
      if (res.status === 200) {
        setAsset((prev) => prev.filter((asset) => asset.id !== id));
      } else {
        console.error(res);
        setError('資産の削除に失敗しました');
      }
    } catch (err) {
      console.error(err);
      setError('資産の削除に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return { assets, addAsset, updateAsset, deleteAsset, loading, error };
};
