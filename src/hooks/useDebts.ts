'use client';

import { useState } from 'react';
import { auth } from '@/src/utils/firebase';
import { Debt } from '../types';

export const useDebt = () => {
  const [debts, setDebt] = useState<Debt[]>([]);
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

  //   const fetchDebts = async () => {
  //     setLoading(true);
  //     try {
  //       const res = await fetch('/api/debts', {
  //         headers: {
  //           Authorization: `Bearer ${idToken}`,
  //         },
  //       });
  //       if (!res.ok) {
  //         throw new Error('Failed to fetch Debts');
  //       }
  //       const data: Debt[] = await res.json();
  //       setDebt(data);
  //     } catch (err) {
  //       console.error(err);
  //       setError('資産データの取得に失敗しました');
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchDebts();
  // }, [idToken]);

  /**
   * 資産データをAPI経由で登録する関数
   * @param newDebt - 登録する資産データの配列
   */
  const addDebt = async (newDebt: Debt) => {
    try {
      const response = await fetch('/api/debts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${idToken}` },
        body: JSON.stringify(newDebt),
      });

      if (!response.ok) {
        throw new Error('資産データの登録に失敗しました');
      }

      const savedDebt = await response.json();
      setDebt((prev) => [...prev, ...savedDebt]);
    } catch (error) {
      console.error('登録エラー:', error);
      throw error;
    }
  };

  // 資産を更新
  const updateDebt = async (id: string, updatedFields: Partial<Debt>) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/debts`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ id, updatedFields }),
      });
      if (!res.ok) {
        throw new Error('Failed to update Debt');
      }
      await res.json();
      // データ再取得
      const updatedDebts = await fetch(`/api/debts`, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      }).then((res) => res.json());
      setDebt(updatedDebts);
    } catch (err) {
      console.error(err);
      setError('資産の更新に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  // 資産を削除
  const deleteDebt = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/debts?id=${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      if (!res.ok) {
        throw new Error('Failed to delete Debt');
      }
      await res.json();
      // データ再取得
      const updatedDebts = await fetch(`/api/debts`, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      }).then((res) => res.json());
      setDebt(updatedDebts);
    } catch (err) {
      console.error(err);
      setError('資産の削除に失敗しました');
    } finally {
      setLoading(false);
    }
  };
  return { debts, addDebt, updateDebt, deleteDebt, loading, error };
};
