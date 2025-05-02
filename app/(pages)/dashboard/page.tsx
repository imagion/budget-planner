'use client';

import { useState } from 'react';
import BudgetChart from '@/components/BudgetChart';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
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

      <Tabs
        defaultValue='all'
        onValueChange={(val) => setFilter(val as FilterType)}
        className='w-full'>
        <TabsList className='flex justify-center'>
          <TabsTrigger value='all'>Все</TabsTrigger>
          <TabsTrigger value='income'>Доходы</TabsTrigger>
          <TabsTrigger value='expense'>Расходы</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className='max-w-md mx-auto'>
        <BudgetChart data={filteredData} />
      </div>
    </div>
  );
}
