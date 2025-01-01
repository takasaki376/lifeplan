'use client';

import { FC, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ColorSchemeToggle } from '@/src/components/ColorSchemeToggle/ColorSchemeToggle';
import { useAuth } from '@/src/hooks/useAuth';

const Settings: FC = () => {
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
    <>
      <ColorSchemeToggle />
    </>
  );
};

export default Settings;
