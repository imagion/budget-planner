'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className='flex items-center justify-between bg-accent px-6 py-4 shadow-md'>
      <Link href='/' className='text-2xl font-bold text-white'>
        Budget Planner
      </Link>

      <nav>
        {user ? (
          <>
            <span className='text-white'>{user.displayName}</span>
            <button
              onClick={logout}
              className='rounded bg-red-500 px-4 py-2 text-white hover:bg-red-700'>
              Выйти
            </button>
          </>
        ) : (
          <Link
            href='/login'
            className='rounded bg-white px-4 py-2 text-accent hover:bg-gray-200'>
            Войти
          </Link>
        )}
      </nav>
    </header>
  );
}
