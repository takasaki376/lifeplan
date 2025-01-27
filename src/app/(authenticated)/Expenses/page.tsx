'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/src/components/common/Header';
import { ExpenseForm } from '@/src/components/Expenses/ExpenseForm';
import { useAuth } from '@/src/hooks/useAuth';

export default function ExpensesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login'); // 未ログインの場合はログインページにリダイレクト
    }
  }, [user, loading, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4 flex flex-col">
      <Header title="支出登録" btnTitle="支出追加" />
      <ExpenseForm />
    </div>
  );
}
