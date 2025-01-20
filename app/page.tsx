import Header from '@/components/Header';
import ProtectedRoute from '@/components/ProtectedRoute';
import TransactionForm from '@/components/TransactionForm';
import TransactionList from '@/components/TransactionList';

export default function Home() {
  return (
    <ProtectedRoute>
      <Header />
      <main className='container mx-auto mt-4 gap-6 md:flex md:flex-row md:justify-between'>
        <TransactionList />
        <TransactionForm />
      </main>
    </ProtectedRoute>
  );
}
