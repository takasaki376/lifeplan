'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/src/utils/firebase';

const LoginPage = () => {
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      router.push('/'); // ログイン済みの場合はリダイレクト
    }
  }, [router]);

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();

      // サーバーサイドにIDトークンを送信
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });

      if (response.ok) {
        // 認証成功時の処理
      } else {
        setError('Authentication failed');
      }
    } catch (error) {
      setError('Sign-in error');
    }
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center ">
      <h1 className="justify-items-center bg-red-300 border-black text-xl">Login</h1>
      <button type="button" onClick={handleGoogleSignIn}>
        Sign in with Google
      </button>
      {error && <p>{error}</p>}
    </div>
  );
};

export default LoginPage;
