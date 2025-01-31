import Header from '@/components/Header';
import ProtectedRoute from '@/components/ProtectedRoute';
import TransactionForm from '@/components/TransactionForm';
import TransactionList from '@/components/TransactionsList';

export default function Home() {
  return (
    <ProtectedRoute>
      <Header />
      <main className='container mx-auto mt-4 md:grid md:grid-cols-[minmax(0,_1fr)_minmax(0,_1fr)] md:justify-center'>
        <TransactionList />
        <TransactionForm />
      </main>
    </ProtectedRoute>
  );
}
