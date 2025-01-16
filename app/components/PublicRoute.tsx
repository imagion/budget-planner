'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface PublicRouteProps {
  children: ReactNode;
}

export default function PublicRoute({ children }: PublicRouteProps) {
  const { user, isPending } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && user) {
      // Если пользователь авторизован, перенаправить на главную страницу
      router.push('/');
    }
  }, [user, isPending, router]);

  // Пока идет проверка статуса аутентификации, ничего не отображать
  if (isPending) return null;

  return <>{children}</>;
}
