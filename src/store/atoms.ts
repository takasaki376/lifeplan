import { atom } from 'jotai';
import { auth } from '@/src/utils/firebase';
import { colorScheme, Debt, Expense, Family, Income } from '../types';

export const colorSchemeAtom = atom<colorScheme>('light');
export const familyAtom = atom<Family[]>([]);
export const incomeAtom = atom<Income[]>([]);
export const expensesAtom = atom<Expense[]>([]);
export const debtsAtom = atom<Debt[]>([]);

// データ取得用の関数
export const fetchData = async (
  setFamilies: (families: Family[]) => void,
  setIncomes: (incomes: Income[]) => void,
  setExpense: (expenses: Expense[]) => void,
  setDebts: (debts: Debt[]) => void
) => {
  const idToken = async () => {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('ユーザーが認証されていません');
    }

    const idToken = await user.getIdToken();
    return idToken;
  };
  const token = await idToken();

  try {
    const response = await fetch('/api/getData', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('データの取得に失敗しました');
    }
    const data = await response.json();
    console.log('API Response:', data); // レスポンスの内容を確認

    // atomの値を更新
    setFamilies(data.families);
    setIncomes(data.incomes);
    setExpense(data.expenses);
    setDebts(data.debts);
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
