'use client';

import { useState } from 'react';

export default function TransactionForm() {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log(title, amount, type);
  };

  return (
    <form className='mb-4' onSubmit={handleSubmit}>
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
        className='mb-2 w-full rounded border p-2'>
        <option value='expense'>Расход</option>
        <option value='income'>Доход</option>
      </select>
      <button
        type='submit'
        className='w-full rounded bg-accent p-2 text-foreground hover:bg-blue-600'>
        Добавить транзакцию
      </button>
    </form>
  );
}
