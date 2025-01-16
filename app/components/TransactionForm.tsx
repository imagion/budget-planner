'use client';

import { useState } from 'react';
import { useFirestore } from '@/hooks/useFirestore';
import { FieldValue, serverTimestamp } from 'firebase/firestore';

type TransactionType = {
  title: string;
  amount: number;
  type: 'income' | 'expense';
  createdAt: FieldValue;
};

export default function TransactionForm() {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [error, setError] = useState<string | null>(null);

  const { addDocument, response } = useFirestore('transactions');

  const validateForm = () => {
    if (!title.trim()) return 'Название не может быть пустым.';
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0)
      return 'Сумма должна быть положительным числом.';
    return null;
  };

  // TODO: check document after server response
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    const transaction: TransactionType = {
      title,
      amount: parseFloat(amount),
      type,
      createdAt: serverTimestamp(),
    };

    await addDocument({ transaction });

    // Reset the form after successful addition
    if (response.success) {
      setTitle('');
      setAmount('');
      setType('expense');
    } else {
      setError(response.error || 'Произошла ошибка при добавлении транзакции.');
    }
  };

  return (
    <form
      className='bg-component mb-4 w-full max-w-md rounded p-6 shadow-md'
      onSubmit={handleSubmit}>
      {error && <p className='mb-2 text-red-500'>{error}</p>}
      <input
        type='text'
        placeholder='Название'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className='mb-2 w-full rounded border p-2'
      />
      <input
        type='number'
        placeholder='Сумма'
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className='mb-2 w-full rounded border p-2'
      />
      <select
        value={type}
        onChange={(e) => setType(e.target.value as 'income' | 'expense')}
        className='mb-2 w-full rounded border bg-white p-2 dark:border-neutral-600 dark:bg-neutral-700'>
        <option value='expense'>Расход</option>
        <option value='income'>Доход</option>
      </select>
      {response.isPending ? (
        <button
          type='submit'
          className='w-full rounded bg-accent p-2 text-foreground hover:bg-neutral-600'
          disabled>
          Добавление...
        </button>
      ) : (
        <button
          type='submit'
          className='w-full rounded bg-accent p-2 text-foreground hover:bg-blue-600'>
          Добавить транзакцию
        </button>
      )}
    </form>
  );
}
