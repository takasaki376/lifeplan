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
      <div className="flex flex-col ">
        <h1 className="text-2xl font-bold mb-4">家族情報</h1>
        <div>追加</div>
      </div>
      <FamilyList />
    </div>
  );
}
