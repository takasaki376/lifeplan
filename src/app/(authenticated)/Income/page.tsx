'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import IncomeForm from '@/src/components/Income/incomeForm';
import { useAuth } from '@/src/hooks/useAuth';

const IncomePage = () => {
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
    <div className="p-4">
      <h1 className="text-2xl font-bold">収入を入力してください</h1>
      <IncomeForm />
    </div>
  );
};

export default IncomePage;
