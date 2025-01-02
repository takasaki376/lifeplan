'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">支出の入力</h1>
      <ExpenseForm />
    </div>
  );
}
