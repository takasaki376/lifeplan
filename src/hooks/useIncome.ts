'use client';

import { useState } from 'react';
import { useAtom } from 'jotai';
import { auth } from '@/src/utils/firebase';
import { incomeAtom } from '../store/atoms';
import { Income } from '../types';

export const useIncome = () => {
  const [income, setIncome] = useAtom(incomeAtom);
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

  /**
   * 収入データをAPI経由で登録する関数
   * @param newIncome - 登録する収入データの配列
   */
  const addIncome = async (newIncome: Income) => {
    try {
      const token = await idToken();

      const response = await fetch('/api/income', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newIncome),
      });

      if (!response.ok) {
        throw new Error('収入データの登録に失敗しました');
      }

      const savedIncome = await response.json();
      setIncome((prev) => [...prev, ...savedIncome]);
      // const incomeData = await response.json();
      // setIncome((prev) => [...prev, ...incomeData]);
    } catch (error) {
      console.error('登録エラー:', error);
      throw error;
    }
  };

  // 収入を更新
  const updateIncome = async (id: string, updatedFields: Partial<Income>) => {
    setLoading(true);
    try {
      const token = await idToken();
      const res = await fetch(`/api/income`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, updatedFields }),
      });
      if (!res.ok) {
        throw new Error('Failed to update Income');
      }
      await res.json();
      // データ再取得
      const updatedIncomes = await fetch(`/api/income`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => res.json());
      setIncome(updatedIncomes);
    } catch (err) {
      console.error(err);
      setError('収入の更新に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  // 収入を削除
  const deleteIncome = async (id: string) => {
    setLoading(true);
    try {
      const token = await idToken();
      const res = await fetch(`/api/income?id=${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error('Failed to delete Income');
      }
      await res.json();
      // データ再取得
      const updatedIncomes = await fetch(`/api/income`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => res.json());
      setIncome(updatedIncomes);
    } catch (err) {
      console.error(err);
      setError('収入の削除に失敗しました');
    } finally {
      setLoading(false);
    }
  };
  return { income, addIncome, updateIncome, deleteIncome, loading, error };
};
