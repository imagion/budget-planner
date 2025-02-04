'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Signup() {
  const { signup, isPending, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    await signup(email, password, displayName);
    if (!error) {
      router.push('/');
    }
  };

  return (
    <form
      onSubmit={handleSignup}
      className='w-full max-w-md rounded-sm bg-white p-6 shadow-md'>
      <h2 className='mb-4 text-2xl font-bold'>Регистрация</h2>
      <input
        type='text'
        placeholder='Имя пользователя'
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
        className='mb-4 block w-full rounded-sm border p-2'
        required
      />
      <input
        type='email'
        placeholder='Email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className='mb-4 block w-full rounded-sm border p-2'
        required
      />
      <input
        type='password'
        placeholder='Пароль'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className='mb-4 block w-full rounded-sm border p-2'
        required
      />
      <button
        type='submit'
        disabled={isPending}
        className='w-full rounded-sm bg-blue-500 p-2 text-white disabled:opacity-50'>
        {isPending ? 'Регистрируем...' : 'Регистрация'}
      </button>
      {error && <p className='mt-2 text-red-500'>{error}</p>}
    </form>
  );
}
