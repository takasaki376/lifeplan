'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Title } from '@mantine/core';
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
    <Container size="md">
      <Title order={1} mb="lg">
        債務管理
      </Title>
      <DebtForm />
      <DebtList />
    </Container>
  );
}
