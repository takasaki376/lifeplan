'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Container, Stack } from '@mantine/core';
import { auth } from '@/src/utils/firebase';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      router.push('/login'); // ログイン済みの場合はリダイレクト
    }
  }, [router]);

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
