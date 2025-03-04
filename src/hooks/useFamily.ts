'use client';

import { useState } from 'react';
import { useAtom } from 'jotai';
import { createDelete, createPost, createPut } from '../services/api';
import { familyAtom } from '../store/atoms';
import { Family } from '../types';

export const useFamily = () => {
  const [family, setFamily] = useAtom(familyAtom);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * 家族データをAPI経由で登録する関数
   * @param newFamily - 登録する家族データの配列
   */
  const addFamily = async (newFamily: Family) => {
    try {
      const savedFamily = await createPost<Family>('family', newFamily);
      setFamily((prev) => [...prev, ...savedFamily.data]);
    } catch (error) {
      console.error('登録エラー:', error);
      throw error;
    }
  };

  // 家族を更新
  const updateFamily = async (id: string, updatedFields: Partial<Family>) => {
    setLoading(true);
    try {
      const updatedFamilys = await createPut<Family>('family', updatedFields);

      setFamily((prev) => prev.map((family) => (family.id === id ? updatedFamilys.data : family)));
      // setFamily(updatedFamilys);
    } catch (err) {
      console.error(err);
      setError('家族の更新に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  // 家族を削除
  const deleteFamily = async (id: string) => {
    setLoading(true);
    try {
      const updatedFamilys = await createDelete<Family>('family', id);
      setFamily(updatedFamilys.data);
    } catch (err) {
      console.error(err);
      setError('家族の削除に失敗しました');
    } finally {
      setLoading(false);
    }
  };
  return { family, addFamily, updateFamily, deleteFamily, loading, error };
};
