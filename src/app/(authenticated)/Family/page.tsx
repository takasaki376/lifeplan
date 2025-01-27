'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Drawer } from '@mantine/core';
import { Header } from '@/src/components/common/Header';
import { FamilyForm } from '@/src/components/Family/FamilyForm';
import { FamilyList } from '@/src/components/Family/FamilyList';
import { useAuth } from '@/src/hooks/useAuth';

export default function FamilyPage() {
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
      <Header title="家族情報" btnTitle="家族追加" onBtnClick={() => setIsFormOpen(true)} />
      <FamilyList />
      <Drawer position="right" opened={isFormOpen} onClose={() => setIsFormOpen(false)}>
        <div className="w-full">
          <FamilyForm />
        </div>
      </Drawer>
    </div>
  );
}
