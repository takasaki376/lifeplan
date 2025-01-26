'use client';

import { useState } from 'react';
import { useAtom } from 'jotai';
import { auth } from '@/src/utils/firebase';
import { familyAtom } from '../store/atoms';
import { Family } from '../types';

export const useFamily = () => {
  const [family, setFamily] = useAtom(familyAtom);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const idToken = async () => {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('ユーザーが認証されていません');
    }

    const idToken = await user.getIdToken();
    return idToken;
  };

  // useEffect(() => {
  //   if (!idToken) {
  //     return;
  //   }

  //   const fetchFamilys = async () => {
  //     setLoading(true);
  //     try {
  //       const res = await fetch('/api/family', {
  //         headers: {
  //           Authorization: `Bearer ${idToken}`,
  //         },
  //       });
  //       if (!res.ok) {
  //         throw new Error('Failed to fetch Familys');
  //       }
  //       const data: Family[] = await res.json();
  //       setFamily(data);
  //     } catch (err) {
  //       console.error(err);
  //       setError('家族データの取得に失敗しました');
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchFamilys();
  // }, [idToken]);

  /**
   * 家族データをAPI経由で登録する関数
   * @param newFamily - 登録する家族データの配列
   */
  const addFamily = async (newFamily: Family) => {
    try {
      const token = await idToken();

      const response = await fetch('/api/family', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newFamily),
      });

      if (!response.ok) {
        throw new Error('家族データの登録に失敗しました');
      }

      const savedFamily = await response.json();
      setFamily((prev) => [...prev, ...savedFamily]);
      // const familyData = await response.json();
      // setFamily((prev) => [...prev, ...familyData]);
    } catch (error) {
      console.error('登録エラー:', error);
      throw error;
    }
  };

  // 家族を更新
  const updateFamily = async (id: string, updatedFields: Partial<Family>) => {
    setLoading(true);
    try {
      const token = await idToken();
      const res = await fetch(`/api/family`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, updatedFields }),
      });
      if (!res.ok) {
        throw new Error('Failed to update Family');
      }
      await res.json();
      // データ再取得
      const updatedFamilys = await fetch(`/api/family`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => res.json());
      setFamily(updatedFamilys);
    } catch (err) {
      console.error(err);
      setError('家族の更新に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  // 家族を削除
  const deleteFamily = async (id: string) => {
    setLoading(true);
    try {
      const token = await idToken();
      const res = await fetch(`/api/family?id=${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error('Failed to delete Family');
      }
      await res.json();
      // データ再取得
      const updatedFamilys = await fetch(`/api/family`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => res.json());
      setFamily(updatedFamilys);
    } catch (err) {
      console.error(err);
      setError('家族の削除に失敗しました');
    } finally {
      setLoading(false);
    }
  };
  return { family, addFamily, updateFamily, deleteFamily, loading, error };
};
