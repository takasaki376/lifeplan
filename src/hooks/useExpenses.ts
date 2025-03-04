'use client';

import { useState } from 'react';
import { useAtom } from 'jotai';
import { createPost, createPut } from '../services/api';
import { expensesAtom } from '../store/atoms';
import { Expense } from '../types';

export const useExpenses = () => {
  const [expenses, setExpenses] = useAtom(expensesAtom);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * 支出データをAPI経由で登録する関数
   * @param newExpenses - 登録する支出データの配列
   */
  const addExpenses = async (newExpenses: Expense[]) => {
    setLoading(true);
    try {
      const savedExpenses = await createPost<Expense>('expenses', newExpenses);

      setExpenses((prev) => [...prev, ...savedExpenses.data]);
    } catch (error) {
      console.error('登録エラー:', error);
      setError('支出の登録に失敗しました');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * 支出データをAPI経由で更新する関数
   * @param id - 更新対象のドキュメントID
   * @param updatedData - 更新するデータ
   */
  const updateExpense = async (id: string, updatedData: Partial<Expense>) => {
    setLoading(true);
    try {
      const updatedExpense = await createPut<Expense>('expenses', updatedData);

      setExpenses((prev) =>
        prev.map((expense) => (expense.id === id ? updatedExpense.data : expense))
      );
    } catch (error) {
      console.error('更新エラー:', error);
      setError('支出の更新に失敗しました');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    expenses,
    addExpenses,
    updateExpense,
    loading,
    error,
  };
};
