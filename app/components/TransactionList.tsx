'use client';

import { useCollection } from '@/hooks/useCollection';
import { useFirestore } from '@/hooks/useFirestore';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface Document {
  id: string;
  title: string;
  amount: number;
  type: 'expense' | 'income';
}

export default function TransactionList() {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Document>>({});

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

  if (isLoading) return <p>Загрузка данных...</p>;
  if (error) return <p>Ошибка: {error}</p>;

  console.log(data);

  return (
    <div className='w-full max-w-md p-4 lg:w-1/2'>
      <h1 className='text-2xl font-bold'>Список транзакций</h1>
      <div className='space-y-4'>
        {data?.map((doc) => (
          <div
            key={doc.id}
            className={`flex flex-col rounded-lg p-4 shadow-md ${
              doc.type === 'income'
                ? 'bg-green-100 text-green-900 dark:bg-green-800 dark:text-green-100'
                : 'bg-red-100 text-red-900 dark:bg-red-800 dark:text-red-100'
            }`}>
            {editingId === doc.id ? (
              <div>
                <input
                  type='text'
                  value={formData.title || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder='Название'
                  className='mb-2 w-full rounded p-2'
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
                  className='mb-2 w-full rounded p-2'
                />
                <select
                  value={formData.type || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      type: e.target.value as 'income' | 'expense',
                    })
                  }
                  className='mb-2 w-full rounded p-2'>
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
                    {doc.type === 'income' ? '+' : '-'}${doc.amount}
                  </p>
                </div>
                <div className='flex gap-2'>
                  <button
                    onClick={() => handleEdit(doc.id, doc)}
                    className='rounded bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-700'>
                    Редактировать
                  </button>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className='rounded bg-red-500 px-4 py-2 text-white hover:bg-red-700'>
                    Удалить
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
