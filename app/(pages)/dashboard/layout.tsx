import Header from '@/components/Header';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className='min-h-screen bg-background text-foreground'>
        <Header />
        <main className='container mx-auto p-4'>{children}</main>
      </div>
    </ProtectedRoute>
  );
}
