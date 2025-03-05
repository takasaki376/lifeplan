'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth } from 'firebase/auth';
import { useSetAtom } from 'jotai';
import { Button, Container, Loader, Stack } from '@mantine/core';
// import { auth } from '@/src/utils/firebase';
import { useAuth } from '../hooks/useAuth';
import {
  assetsAtom,
  debtsAtom,
  expensesAtom,
  familyAtom,
  fetchData,
  incomeAtom,
} from '../store/atoms';
import { firebaseApp } from '../utils/firebase';

export default function HomePage() {
  const router = useRouter();
  const setAssets = useSetAtom(assetsAtom);
  const setFamilies = useSetAtom(familyAtom);
  const setIncomes = useSetAtom(incomeAtom);
  const setExpenses = useSetAtom(expensesAtom);
  const setDebts = useSetAtom(debtsAtom);
  const { user, loading } = useAuth();
  const [loadingData, setLoadingData] = useState(true);

  const auth = getAuth(firebaseApp);
  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.push('/login');
    } catch (error) {
      console.error('ログアウト中にエラーが発生しました:', error);
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login'); // 未ログインの場合はログインページにリダイレクト
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user && !loading) {
      fetchData(setAssets, setFamilies, setIncomes, setExpenses, setDebts)
        .catch(console.error)
        .finally(() => setLoadingData(false));
    }
  }, [user, loading]);

  if (loadingData || loading) {
    return (
      <Container>
        <Loader />
      </Container>
    );
  }

  return (
    <Container>
      <div className="flex flex-col">
        <div className="flex items-end justify-end gap-4 m-4">
          <Button className="mx-2 ml-auto" onClick={handleLogout}>
            ログアウト
          </Button>
        </div>
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
      </div>
    </Container>
  );
}
