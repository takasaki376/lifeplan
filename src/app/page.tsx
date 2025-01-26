'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSetAtom } from 'jotai';
import { Button, Container, Stack } from '@mantine/core';
// import { auth } from '@/src/utils/firebase';
import { useAuth } from '../hooks/useAuth';
import { familyAtom, fetchData, incomeAtom } from '../store/atoms';

export default function HomePage() {
  const router = useRouter();
  const setFamilies = useSetAtom(familyAtom);
  const setIncomes = useSetAtom(incomeAtom);
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login'); // 未ログインの場合はログインページにリダイレクト
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user && !loading) {
      fetchData(setFamilies, setIncomes).catch(console.error);
    }
  }, [user, loading]);

  return (
    <Container>
      <Stack mt="md">
        <Button variant="outline" onClick={() => router.push('/Family')}>
          家族登録
        </Button>
        <Button variant="outline" onClick={() => router.push('/Events')}>
          イベント登録
        </Button>
        <Button variant="outline" onClick={() => router.push('/Income')}>
          収入登録
        </Button>
        <Button variant="outline" onClick={() => router.push('/Expenses')}>
          支出登録
        </Button>
        <Button variant="outline" onClick={() => router.push('/Assets')}>
          資産登録
        </Button>
        <Button variant="outline" onClick={() => router.push('/Debt')}>
          負債登録
        </Button>
        <Button variant="outline" onClick={() => router.push('/PlanList')}>
          プラン一覧
        </Button>
      </Stack>
    </Container>
  );
}
