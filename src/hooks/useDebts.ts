'use client';

import { useState } from 'react';
import { useAtom } from 'jotai';
import { createDelete, createPost, createPut } from '../services/api';
import { debtsAtom } from '../store/atoms';
import { Debt } from '../types';

export const useDebt = () => {
  const [debts, setDebt] = useAtom(debtsAtom);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * 債務データをAPI経由で登録する関数
   * @param newDebt - 登録する債務データの配列
   */
  const addDebt = async (newDebt: Debt) => {
    setLoading(true);

    try {
      const savedDebt = await createPost<Debt>('debts', newDebt);
      setDebt((prev) => [...prev, ...savedDebt.data]);
    } catch (error) {
      console.error('登録エラー:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 債務を更新
  const updateDebt = async (id: string, updatedFields: Partial<Debt>) => {
    setLoading(true);
    try {
      const updatedDebt = await createPut<Debt>('debts', updatedFields);

      setDebt((prev) => prev.map((debt) => (debt.id === id ? updatedDebt.data : debt)));
    } catch (err) {
      console.error(err);
      setError('債務の更新に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  // 債務を削除
  const deleteDebt = async (id: string) => {
    setLoading(true);
    try {
      const updatedDebts = await createDelete<Debt>('debts', id);
      setDebt(updatedDebts.data);
    } catch (err) {
      console.error(err);
      setError('債務の削除に失敗しました');
    } finally {
      setLoading(false);
    }
  };
  return { debts, addDebt, updateDebt, deleteDebt, loading, error };
};
