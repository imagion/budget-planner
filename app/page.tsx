import Header from '@/components/Header';
import TransactionForm from '@/components/TransactionForm';

export default function Home() {
  return (
    <>
      <Header />
      <main className='mx-auto max-w-md rounded bg-white p-4 shadow'>
        <TransactionForm />
      </main>
    </>
  );
}
