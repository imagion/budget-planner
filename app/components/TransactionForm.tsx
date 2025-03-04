'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useFirestore } from '@/hooks/useFirestore';
import { TransactionType } from '@/types/TransactionFormTypes';
import { cn } from '@/lib/utils';

export default function TransactionForm() {
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TransactionType>({
    mode: 'onBlur',
  });

  const { addDocument, response } = useFirestore('transactions');

  const onSubmit = async (data: TransactionType) => {
    setError(null);
    try {
      await addDocument(data);
      // Сброс формы после успешного добавления
      reset();
    } catch (error) {
      setError(response.error || 'Произошла ошибка при добавлении транзакции');
    }
  };

  return (
    <div className='mx-auto w-full max-w-md p-4'>
      <h2 className='text-2xl font-bold'>Новая транзакция</h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='mt-4 w-full max-w-md rounded bg-white p-6 shadow-md dark:bg-neutral-800 space-y-4'>
        {/* Глобальная ошибка от Firestore, если есть */}
        {error && <p className='text-red-500'>{error}</p>}

        {/* Поле "Название" */}
        <div>
          <input
            type='text'
            placeholder='Название'
            {...register('title', {
              required: 'Название не может быть пустым',
            })}
            className={cn(
              'w-full rounded-sm focus:ring-accent border-2 bg-neutral-50 p-2 placeholder-neutral-500 hover:bg-neutral-100 focus:ring-2 focus:outline-hidden disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:shadow-none dark:border-neutral-600 dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:disabled:border-gray-700 dark:disabled:bg-gray-800/20',
              errors.title ? 'border-red-500' : '',
            )}
          />
          {errors.title && (
            <p className='mt-1 text-xs text-red-500'>{errors.title.message}</p>
          )}
        </div>

        {/* Поле "Сумма" */}
        <div>
          <input
            type='number'
            placeholder='Сумма'
            {...register('amount', {
              required: 'Сумма должна быть положительным числом',
              valueAsNumber: true,
              validate: (value) =>
                value > 0 || 'Сумма должна быть положительной.',
            })}
            className={cn(
              'w-full rounded-sm focus:ring-accent border-2 bg-neutral-50 p-2 placeholder-neutral-500 hover:bg-neutral-100 focus:ring-2 focus:outline-hidden disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:shadow-none dark:border-neutral-600 dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:disabled:border-gray-700 dark:disabled:bg-gray-800/20',
              errors.amount ? 'border-red-500' : '',
            )}
          />
          {errors.amount && (
            <p className='mt-1 text-xs text-red-500'>{errors.amount.message}</p>
          )}
        </div>

        {/* Поле "Тип транзакции" */}
        <div>
          <select
            {...register('type', { required: 'Выберите тип транзакции.' })}
            className={cn(
              'w-full rounded-sm focus:ring-accent border-2 bg-neutral-50 p-2 placeholder-neutral-500 hover:bg-neutral-100 focus:ring-2 focus:outline-hidden disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 disabled:shadow-none dark:border-neutral-600 dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:disabled:border-gray-700 dark:disabled:bg-gray-800/20',
            )}>
            <option value='expense'>Расход</option>
            <option value='income'>Доход</option>
          </select>
          {errors.type && (
            <p className='mt-1 text-xs text-red-500'>{errors.type.message}</p>
          )}
        </div>

        <button
          type='submit'
          disabled={isSubmitting}
          className='bg-accent text-foreground w-full rounded p-2 disabled:opacity-50 hover:bg-blue-600'>
          {isSubmitting ? 'Добавление...' : 'Добавить транзакцию'}
        </button>
      </form>
    </div>
  );
}
