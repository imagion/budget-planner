'use client';

import React from 'react';
import PublicRoute from '@/components/PublicRoute';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PublicRoute>
      <div className='flex h-screen flex-col items-center justify-center bg-gray-100'>
        {children}
      </div>
    </PublicRoute>
  );
}
