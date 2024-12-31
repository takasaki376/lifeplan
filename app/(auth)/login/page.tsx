'use client';

import { useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/app/utils/firebase';

const LoginPage = () => {
  const [error, setError] = useState<string | null>(null);

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
    <div>
      <h1>Login</h1>
      <button type="button" onClick={handleGoogleSignIn}>
        Sign in with Google
      </button>
      {error && <p>{error}</p>}
    </div>
  );
};

export default LoginPage;
