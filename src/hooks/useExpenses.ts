import { useState } from 'react';
import { auth } from '@/src/utils/firebase';
import { Expense } from '../types';

export const useExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  /**
   * 支出データをAPI経由で登録する関数
   * @param newExpenses - 登録する支出データの配列
   */
  const addExpenses = async (newExpenses: Expense[]) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('ユーザーが認証されていません');
      }

      const idToken = await user.getIdToken();

      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${idToken}` },
        body: JSON.stringify(newExpenses),
      });

      if (!response.ok) {
        throw new Error('支出データの登録に失敗しました');
      }

      const savedExpenses = await response.json();
      setExpenses((prev) => [...prev, ...savedExpenses]);
    } catch (error) {
      console.error('登録エラー:', error);
      throw error;
    }
  };

  /**
   * 支出データをAPI経由で更新する関数
   * @param id - 更新対象のドキュメントID
   * @param updatedData - 更新するデータ
   */
  const updateExpense = async (id: string, updatedData: Partial<Expense>) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('ユーザーが認証されていません');
      }

      const idToken = await user.getIdToken();

      const response = await fetch(`/api/expenses/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${idToken}` },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error('支出データの更新に失敗しました');
      }

      const updatedExpense = await response.json();
      setExpenses((prev) =>
        prev.map((expense) => (expense.id === id ? { ...expense, ...updatedExpense } : expense))
      );
    } catch (error) {
      console.error('更新エラー:', error);
      throw error;
    }
  };

  return {
    expenses,
    addExpenses,
    updateExpense,
  };
};
