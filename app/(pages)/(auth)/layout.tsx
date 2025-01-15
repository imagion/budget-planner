'use client';

import React from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex h-screen flex-col items-center justify-center bg-gray-100'>
      {children}
    </div>
  );
}
