'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ChildrenProps } from '@/types/general';

export default function ProtectedRoute({ children }: ChildrenProps) {
  const { user, isPending } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !user) {
      // Если пользователь не авторизован, перенаправить на страницу логина
      router.push('/login');
    }
  }, [user, isPending, router]);

  // Пока идет проверка статуса аутентификации, ничего не отображать
  if (isPending || !user) return null;

  return <>{children}</>;
}
