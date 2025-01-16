import Header from '@/components/Header';
import ProtectedRoute from '@/components/ProtectedRoute';
import TransactionForm from '@/components/TransactionForm';

export default function Home() {
  return (
    <ProtectedRoute>
      <Header />
      <main className='mx-auto mt-4 max-w-md p-4'>
        <TransactionForm />
      </main>
    </ProtectedRoute>
  );
}
