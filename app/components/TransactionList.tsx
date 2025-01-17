'use client';

import { useCollection } from '@/hooks/useCollection';
import { orderBy } from 'firebase/firestore';
import { useMemo } from 'react';

interface Document {
  id: string;
  title: string;
  amount: number;
  type: 'expense' | 'income';
}

export default function TransactionList() {
  const memoizedOrderBy = useMemo(() => orderBy('createdAt', 'asc'), []);

  const { data, error, isLoading } = useCollection<Document>(
    'transactions',
    undefined,
    memoizedOrderBy,
  );

  if (isLoading) return <p>Загрузка данных...</p>;
  if (error) return <p>Ошибка: {error}</p>;

  console.log(data);

  return (
    <div>
      <h1>Данные из Firestore:</h1>
      {data?.map((doc) => (
        <div key={doc.id}>
          <p>Название: {doc.title}</p>
          <p>Сумма: {doc.amount}</p>
          <p>Тип: {doc.type}</p>
        </div>
      ))}
    </div>
  );
}
