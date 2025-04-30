'use client';

import BudgetChart from '@/components/BudgetChart';
import { useCollection } from '../../hooks/useCollection';
import { TransactionType } from '@/types/TransactionFormTypes';

export default function DashboardPage() {
  const transactions = useCollection<TransactionType>('transactions');

  return (
    <div className='space-y-8'>
      <h1 className='text-2xl font-bold mb-4'>Дашборд</h1>
      <div className='max-w-md mx-auto'>
        <BudgetChart data={transactions.data || []} />
      </div>
    </div>
  );
}
