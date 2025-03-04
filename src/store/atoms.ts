import { atom } from 'jotai';
import { createGet } from '../services/api';
import { Asset, colorScheme, Debt, Expense, Family, Income } from '../types';

export const colorSchemeAtom = atom<colorScheme>('light');
export const assetsAtom = atom<Asset[]>([]);
export const familyAtom = atom<Family[]>([]);
export const incomeAtom = atom<Income[]>([]);
export const expensesAtom = atom<Expense[]>([]);
export const debtsAtom = atom<Debt[]>([]);

// データ取得用の関数
export const fetchData = async (
  setAssets: (families: Asset[]) => void,
  setFamilies: (families: Family[]) => void,
  setIncomes: (incomes: Income[]) => void,
  setExpense: (expenses: Expense[]) => void,
  setDebts: (debts: Debt[]) => void
) => {
  type Data = {
    assets: Asset[];
    families: Family[];
    incomes: Income[];
    expenses: Expense[];
    debts: Debt[];
  };
  const res = await createGet<Data>('getData');
  console.log('API Response:', res.data); // レスポンスの内容を確認

  // atomの値を更新
  {
    res.data.assets && setAssets(res.data.assets);
  }
  {
    res.data.families && setFamilies(res.data.families);
  }
  {
    res.data.incomes && setIncomes(res.data.incomes);
  }
  {
    res.data.expenses && setExpense(res.data.expenses);
  }
  {
    res.data.debts && setDebts(res.data.debts);
  }
};
