'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/src/components/common/Header';
import DebtForm from '@/src/components/debt/DebtForm';
import DebtList from '@/src/components/debt/DebtList';
import { useAuth } from '@/src/hooks/useAuth';

export default function DebtsPage() {
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
      <Header title="債権管理" btnTitle="債務追加" />
      <DebtForm />
      <DebtList />
    </div>
  );
}
