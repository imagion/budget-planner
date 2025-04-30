'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className='bg-accent flex items-center justify-between px-6 py-4 shadow-md'>
      <div className='space-x-10'>
        <Link href='/' className='text-2xl font-bold text-white'>
          Budget Planner
        </Link>
        <Link href='/dashboard' className='text-md font-bold text-white'>
          Графики
        </Link>
        <Link href='/transactions' className='text-md font-bold text-white'>
          Транзакции
        </Link>
      </div>

      <nav className='flex items-center space-x-4'>
        {user ? (
          <>
            <span className='text-white'>{user.displayName}</span>
            <button
              onClick={logout}
              className='rounded-sm bg-red-500 px-4 py-2 text-white hover:bg-red-700'>
              Выйти
            </button>
          </>
        ) : (
          <Link
            href='/login'
            className='text-accent rounded-sm bg-white px-4 py-2 hover:bg-gray-200'>
            Войти
          </Link>
        )}
      </nav>
    </header>
  );
}
