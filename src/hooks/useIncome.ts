'use client';

import { useState } from 'react';
import { useAtom } from 'jotai';
import { createDelete, createPost, createPut } from '../services/api';
import { incomeAtom } from '../store/atoms';
import { Income } from '../types';

export const useIncome = () => {
  const [income, setIncome] = useAtom(incomeAtom);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * 収入データをAPI経由で登録する関数
   * @param newIncome - 登録する収入データの配列
   */
  const addIncome = async (newIncome: Income) => {
    setLoading(true);
    try {
      const savedIncome = await createPost<Income>('income', newIncome);
      setIncome((prev) => [...prev, ...savedIncome.data]);
    } catch (error) {
      console.error('収入登録エラー:', error);
      setError('収入の登録に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  // 収入を更新
  const updateIncome = async (id: string, updatedFields: Partial<Income>) => {
    setLoading(true);
    try {
      const updatedIncomes = await createPut<Income>('income', updatedFields);

      setIncome((prev) => prev.map((income) => (income.id === id ? updatedIncomes.data : income)));

      // setIncome(updatedIncomes);
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
      const updatedIncomes = await createDelete<Income>('income', id);
      setIncome(updatedIncomes.data);
    } catch (err) {
      console.error(err);
      setError('収入の削除に失敗しました');
    } finally {
      setLoading(false);
    }
  };
  return { income, addIncome, updateIncome, deleteIncome, loading, error };
};
