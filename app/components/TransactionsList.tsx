'use client';

import { useMemo, useState } from 'react';
import { WhereFilterOp } from 'firebase/firestore';
import { useCollection } from '@/hooks/useCollection';
import { useFirestore } from '@/hooks/useFirestore';
import { cn } from '@/lib/utils';
import { DateRange, RangeKeyDict } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { Document } from '@/types/TransactionsListTypes';

export default function TransactionsList() {
  // Состояния для редактирования транзакций
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Document>>({});
  // Состояния фильтров
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>(
    'all',
  );
  const [dateRange, setDateRange] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({
    startDate: null,
    endDate: null,
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Формирование условий фильтрации
  const getWhereConditions = (): [string, WhereFilterOp, unknown][] => {
    const conditions: [string, WhereFilterOp, unknown][] = [];
    if (filterType !== 'all') {
      conditions.push(['type', '==', filterType]);
    }
    if (dateRange.startDate) {
      conditions.push(['createdAt', '>=', dateRange.startDate]);
    }
    if (dateRange.endDate) {
      conditions.push(['createdAt', '<=', dateRange.endDate]);
    }
    return conditions;
  };

  const { data, error, isLoading } = useCollection<Document>(
    'transactions',
    getWhereConditions(),
    ['createdAt', 'asc'],
  );

  const { updateDocument, deleteDocument } =
    useFirestore<Document>('transactions');

  // Редактирование и удаление транзакций
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

  // Дополнительная клиентская фильтрация (на случай, если требуется дополнительная обработка)
  // Здесь мы фильтруем по дате, преобразуя поле createdAt (объект с seconds) в Date
  const filteredData: Document[] | null = useMemo(() => {
    if (!data) return null;

    return data.filter((doc) => {
      const docDate = new Date(doc.createdAt.seconds * 1000);
      const matchesType = filterType === 'all' || doc.type === filterType;
      const matchesDate =
        (!dateRange.startDate || docDate >= dateRange.startDate) &&
        (!dateRange.endDate || docDate <= dateRange.endDate);
      return matchesType && matchesDate;
    });
  }, [filterType, dateRange, data]);

  if (isLoading) return <p>Загрузка данных...</p>;
  if (error) return <p>Ошибка: {error}</p>;

  console.log(data);

  return (
    <div className='mx-auto w-full max-w-md p-4 md:ml-auto'>
      <h2 className='text-2xl font-bold'>Список транзакций</h2>
      {/* Фильтры */}
      <div className='mb-4 space-y-2'>
        {/* Фильтр по типу */}
        <select
          value={filterType}
          onChange={(e) =>
            setFilterType(e.target.value as 'all' | 'income' | 'expense')
          }
          className='w-full rounded border bg-white p-2 placeholder-neutral-300 focus:outline-none focus:ring-2 focus:ring-accent dark:border-neutral-600 dark:bg-neutral-700'>
          <option value='all'>Все</option>
          <option value='income'>Доход</option>
          <option value='expense'>Расход</option>
        </select>

        {/* Выбор диапазона дат */}
        <div className='relative'>
          <button
            onClick={() => setShowDatePicker((prev) => !prev)}
            className='w-full rounded border bg-white p-2 focus:outline-none focus:ring-2 focus:ring-accent dark:border-neutral-600 dark:bg-neutral-700'>
            {dateRange.startDate && dateRange.endDate
              ? `${dateRange.startDate.toLocaleDateString()} - ${dateRange.endDate.toLocaleDateString()}`
              : 'Выбрать диапазон дат'}
          </button>
          {showDatePicker && (
            <div className='absolute z-10 mt-2 rounded border bg-white p-2 shadow-lg dark:bg-neutral-800'>
              <DateRange
                editableDateInputs={true}
                onChange={(ranges: RangeKeyDict) => {
                  // Используем ключ 'selection' по умолчанию
                  const { startDate, endDate } = ranges.selection;
                  setDateRange({
                    startDate: startDate || null,
                    endDate: endDate || null,
                  });
                }}
                moveRangeOnFirstSelection={false}
                ranges={[
                  {
                    startDate: dateRange.startDate || new Date(),
                    endDate: dateRange.endDate || new Date(),
                    key: 'selection',
                  },
                ]}
              />
              <button
                onClick={() => setShowDatePicker(false)}
                className='mt-2 w-full rounded bg-accent p-2 text-white hover:bg-accent-dark'>
                Применить
              </button>
            </div>
          )}
        </div>
      </div>
      {/* Список транзакций */}
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
            {/* Форма редактирования */}
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
                    {/* Иконка карандаша */}
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 24 24'
                      fill='currentColor'
                      className='size-5 text-yellow-600 hover:text-yellow-800'>
                      <path d='M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z' />
                    </svg>
                  </button>

                  <button
                    onClick={() => handleDelete(doc.id)}
                    className='flex items-center justify-center p-2'>
                    {/* Иконка корзины */}
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 24 24'
                      fill='currentColor'
                      className='size-5 text-red-500 hover:text-red-700'>
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
