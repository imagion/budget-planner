'use client';

import { useState } from 'react';
import { useFirestore } from '@/hooks/useFirestore';
import { TransactionType } from '@/types/TransactionFormTypes';

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

    await addDocument({
      title,
      amount: parseFloat(amount),
      type,
    } as TransactionType);

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
    <div className='mx-auto w-full max-w-md p-4'>
      <h2 className='text-2xl font-bold'>Новая транзакция</h2>
      <form
        className='mt-4 w-full max-w-md space-y-2 rounded-sm bg-white p-6 shadow-md dark:bg-neutral-800'
        onSubmit={handleSubmit}>
        {error && <p className='text-red-500'>{error}</p>}
        <input
          type='text'
          placeholder='Название'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className='w-full rounded-sm'
          required
        />
        <input
          type='number'
          placeholder='Сумма'
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className='w-full rounded-sm'
          required
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value as 'income' | 'expense')}
          className='w-full rounded-sm'>
          <option value='expense'>Расход</option>
          <option value='income'>Доход</option>
        </select>
        {response.isPending ? (
          <button
            type='submit'
            className='bg-accent text-foreground w-full rounded-sm p-2 hover:bg-neutral-600'
            disabled>
            Добавление...
          </button>
        ) : (
          <button
            type='submit'
            className='bg-accent w-full rounded-sm p-2 text-white hover:bg-blue-600'>
            Добавить транзакцию
          </button>
        )}
      </form>
    </div>
  );
}
