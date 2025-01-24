import Header from '@/components/Header';
import ProtectedRoute from '@/components/ProtectedRoute';
import TransactionForm from '@/components/TransactionForm';
import TransactionList from '@/components/TransactionList';

export default function Home() {
  return (
    <ProtectedRoute>
      <Header />
      <main className='container mx-auto mt-4 md:grid md:grid-cols-[auto_auto] md:justify-center'>
        <TransactionList />
        <TransactionForm />
      </main>
    </ProtectedRoute>
  );
}
