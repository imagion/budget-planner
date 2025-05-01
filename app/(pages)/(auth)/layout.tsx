import PublicRoute from '@/components/PublicRoute';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PublicRoute>
      <main className='bg-background flex h-screen flex-col items-center justify-center'>
        {children}
      </main>
    </PublicRoute>
  );
}
