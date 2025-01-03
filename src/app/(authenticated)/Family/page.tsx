'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FamilyList } from '@/src/components/Family/FamilyList';
import { useAuth } from '@/src/hooks/useAuth';

export default function FamilyPage() {
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
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">家族構成の管理</h1>
      <FamilyList />
    </div>
  );
}
