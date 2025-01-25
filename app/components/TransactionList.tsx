'use client';

import { useMemo, useState } from 'react';
import { useCollection } from '@/hooks/useCollection';
import { useFirestore } from '@/hooks/useFirestore';
import { cn } from '@/lib/utils';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Document } from '@/types/TransactionListTypes';

export default function TransactionList() {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Document>>({});
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>(
    'all',
  );
  const [filterType1, setFilterType1] = useState<
    undefined | 'income' | 'expense'
  >(undefined);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const { data, error, isLoading } = useCollection<Document>(
    'transactions',
    undefined,
    ['createdAt', 'asc'],
  );
  const { updateDocument, deleteDocument } =
    useFirestore<Document>('transactions');

  const handleEdit = (id: string, doc: Document) => {
    setEditingId(id);
    setFormData(doc);
  };

  const handleSave = async () => {
    if (editingId) {
      await updateDocument(editingId, formData);
      setEditingId(null);
      setFormData({});
    }
  };

  const handleDelete = async (id: string) => {
    await deleteDocument(id);
  };

  const filteredData: Document[] | null = useMemo(() => {
    if (!data) return null;
    let result = data;
    if (filterType !== 'all') {
      result = result?.filter((doc) => doc.type === filterType);
    }
    if (startDate) {
      result = result?.filter((doc) => {
        const docDate = new Date(doc.createdAt.seconds * 1000);
        return docDate >= startDate!;
      });
    }
    if (endDate) {
      result = result?.filter((doc) => {
        const docDate = new Date(doc.createdAt.seconds * 1000);
        return docDate <= endDate!;
      });
    }
    return result;
  }, [filterType, startDate, endDate, data]);

  if (isLoading) return <p>Загрузка данных...</p>;
  if (error) return <p>Ошибка: {error}</p>;

  console.log('filteredData:', filteredData);

  return (
    <div className='mx-auto w-full max-w-md p-4'>
      <h2 className='text-2xl font-bold'>Список транзакций</h2>
      <div>
        <select
          value={filterType}
          onChange={(e) =>
            setFilterType(e.target.value as 'all' | 'income' | 'expense')
          }
          className='w-full rounded border bg-white p-2 placeholder-neutral-300 focus:outline-none focus:ring-2 focus:ring-accent dark:border-neutral-600 dark:bg-neutral-700'>
          <option value='all'>Все</option>
          <option value='expense'>Расход</option>
          <option value='income'>Доход</option>
        </select>
        <div className='flex gap-2'>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            placeholderText='Начальная дата'
            className='w-full rounded border bg-white p-2 placeholder-neutral-300 focus:outline-none focus:ring-2 focus:ring-accent dark:border-neutral-600 dark:bg-neutral-700'
          />
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            placeholderText='Конечная дата'
            className='w-full rounded border bg-white p-2 placeholder-neutral-300 focus:outline-none focus:ring-2 focus:ring-accent dark:border-neutral-600 dark:bg-neutral-700'
          />
        </div>
      </div>
      <div className='mt-4 space-y-2'>
        {filteredData?.map((doc) => (
          <div
            key={doc.id}
            className={cn(
              'flex flex-col content-center rounded p-4 shadow-md',
              doc.type === 'income'
                ? 'bg-green-100 text-green-900 dark:bg-green-800/40 dark:text-green-100'
                : 'bg-red-100 text-red-900 dark:bg-red-800/40 dark:text-red-100',
            )}>
            {editingId === doc.id ? (
              <div className='space-y-2'>
                <input
                  type='text'
                  value={formData.title || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder='Название'
                  className='w-full rounded border bg-white p-2 placeholder-neutral-300 focus:outline-none focus:ring-2 focus:ring-accent dark:border-neutral-600 dark:bg-neutral-700'
                />
                <input
                  type='number'
                  value={formData.amount || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      amount: parseFloat(e.target.value),
                    })
                  }
                  placeholder='Сумма'
                  className='w-full rounded border bg-white p-2 placeholder-neutral-300 focus:outline-none focus:ring-2 focus:ring-accent dark:border-neutral-600 dark:bg-neutral-700'
                />
                <select
                  value={formData.type || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      type: e.target.value as 'income' | 'expense',
                    })
                  }
                  className='w-full rounded border bg-white p-2 placeholder-neutral-300 focus:outline-none focus:ring-2 focus:ring-accent dark:border-neutral-600 dark:bg-neutral-700'>
                  <option value='income'>Доход</option>
                  <option value='expense'>Расход</option>
                </select>
                <button
                  onClick={handleSave}
                  className='mr-2 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700'>
                  Сохранить
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className='rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-700'>
                  Отменить
                </button>
              </div>
            ) : (
              <div className='flex items-center justify-between'>
                <div>
                  <p className='font-medium'>{doc.title}</p>
                  <p className='font-medium'>
                    {doc.type === 'income' ? '+' : '-'}
                    {doc.amount}₽
                  </p>
                </div>
                <div className='flex gap-2'>
                  <button
                    onClick={() => handleEdit(doc.id, doc)}
                    className='flex items-center justify-center p-2'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 24 24'
                      fill='currentColor'
                      className='size-6 text-yellow-600 hover:text-yellow-800'>
                      <path d='M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z' />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className='flex items-center justify-center p-2'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 24 24'
                      fill='currentColor'
                      className='size-6 text-red-500 hover:text-red-700'>
                      <path
                        fillRule='evenodd'
                        d='M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z'
                        clipRule='evenodd'
                      />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
