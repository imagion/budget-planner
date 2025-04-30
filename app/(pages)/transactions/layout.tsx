import Header from '@/components/Header';

export default function TransactionsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='min-h-screen bg-background text-foreground'>
      <Header />
      <main className='container mx-auto p-4'>{children}</main>
    </div>
  );
}
