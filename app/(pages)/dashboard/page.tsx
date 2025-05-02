'use client';

import { useState } from 'react';
import BudgetChart from '@/components/BudgetChart';
import { useCollection } from '../../hooks/useCollection';
import { TransactionType } from '@/types/TransactionFormTypes';

const typeOptions = ['all', 'income', 'expense'] as const;
type FilterType = (typeof typeOptions)[number];

export default function DashboardPage() {
  const transactions = useCollection<TransactionType>('transactions');
  const [filter, setFilter] = useState<FilterType>('all');

  // Фильтрация типа транзакций (income, expense, all)
  const filteredData =
    transactions.data?.filter((tx) =>
      filter === 'all' ? true : tx.type === filter,
    ) ?? [];

  return (
    <div className='space-y-8'>
      <h1 className='text-2xl font-bold mb-4'>Дашборд</h1>

      <div className='flex justify-center gap-4'>
        {typeOptions.map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded ${
              filter === type
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800'
            }`}>
            {type === 'all' ? 'Все' : type === 'income' ? 'Доходы' : 'Расходы'}
          </button>
        ))}

        <div className='max-w-md mx-auto'>
          <BudgetChart data={filteredData} />
        </div>
      </div>
    </div>
  );
}
