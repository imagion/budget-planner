import ProtectedRoute from '@/components/ProtectedRoute';
import TransactionForm from '@/components/TransactionForm';
import TransactionList from '@/components/TransactionsList';

export default function Home() {
  return (
    <ProtectedRoute>
      <main className='container mx-auto mt-4 md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:justify-center'>
        <TransactionList />
        <TransactionForm />
      </main>
    </ProtectedRoute>
  );
}
