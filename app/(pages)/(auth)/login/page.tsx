'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Login() {
  const { login, loginWithGoogle, isPending, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
    if (!error) {
      router.push('/');
    }
  };

  const handleGoogleLogin = async () => {
    await loginWithGoogle();
    if (!error) {
      router.push('/');
    }
  };

  return (
    <div className='flex h-screen items-center justify-center bg-gray-100'>
      <form
        onSubmit={handleLogin}
        className='w-full max-w-md rounded bg-white p-6 shadow-md'>
        <h2 className='mb-4 text-2xl font-bold'>Login</h2>
        <input
          type='email'
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='mb-4 block w-full rounded border p-2'
          required
        />
        <input
          type='password'
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className='mb-4 block w-full rounded border p-2'
          required
        />
        <button
          type='submit'
          disabled={isPending}
          className='w-full rounded bg-blue-500 p-2 text-white disabled:opacity-50'>
          {isPending ? 'Logging in...' : 'Login'}
        </button>
        <button
          type='button'
          onClick={handleGoogleLogin}
          className='mt-2 w-full rounded bg-red-500 p-2 text-white'>
          Login with Google
        </button>
        {error && <p className='mt-2 text-red-500'>{error}</p>}
      </form>
    </div>
  );
}
