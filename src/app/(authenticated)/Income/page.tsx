'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Drawer } from '@mantine/core';
import { Header } from '@/src/components/common/Header';
import { IncomeForm } from '@/src/components/Income/IncomeForm';
import { IncomeList } from '@/src/components/Income/IncomeList';
import { useAuth } from '@/src/hooks/useAuth';

const IncomePage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isFormOpen, setIsFormOpen] = useState(false);

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
      <Header title="定期収入" btnTitle="収入追加" onBtnClick={() => setIsFormOpen(true)} />
      <IncomeList />
      <Drawer position="right" opened={isFormOpen} onClose={() => setIsFormOpen(false)}>
        <div className="w-full">
          <IncomeForm />
        </div>
      </Drawer>
    </div>
  );
};

export default IncomePage;
