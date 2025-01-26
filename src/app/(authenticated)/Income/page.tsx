'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { IncomeList } from '@/src/components/Income/IncomeList';
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
      <h1 className="text-2xl font-bold">定期収入</h1>
      <IncomeList />
    </div>
  );
};

export default IncomePage;
