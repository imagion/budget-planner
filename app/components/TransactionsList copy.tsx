'use client';

import { useMemo, useState } from 'react';
import { WhereFilterOp } from 'firebase/firestore';
import { useCollection } from '@/hooks/useCollection';
import { useFirestore } from '@/hooks/useFirestore';
import { cn } from '@/lib/utils';
import { DateRange, RangeKeyDict } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { ru } from 'date-fns/locale';
import TransactionSkeleton from '@/components/TransactionSkeleton';
import { Document } from '@/types/TransactionsListTypes';
import { useAuth } from '@/context/AuthContext';

export default function TransactionsList() {
  const { user } = useAuth();
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
    if (user && user.uid) {
      conditions.push(['uid', '==', user.uid]);
    }
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
    ['createdAt', 'desc'],
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

  // Дополнительная клиентская фильтрация по дате
  const filteredData: Document[] | null = useMemo(() => {
    if (!data) return null;

    return data.filter((doc) => {
      // Если createdAt отсутствует, просто возвращаем true,
      // чтобы отобразить скелетон вместо ошибки
      if (!doc.createdAt) return true;
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

  // Дополнительные статические диапазоны для выбора дат
  const customStaticRanges = [
    {
      label: 'Сегодня',
      range: () => ({
        startDate: new Date(),
        endDate: new Date(),
      }),
      isSelected(range: { startDate: Date; endDate: Date }) {
        const today = new Date();
        return (
          range.startDate.toDateString() === today.toDateString() &&
          range.endDate.toDateString() === today.toDateString()
        );
      },
    },
    {
      label: 'Последние 7 дней',
      range: () => {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - 6);
        return { startDate, endDate };
      },
      isSelected(range: { startDate: Date; endDate: Date }) {
        const { startDate, endDate } = range;
        const today = new Date();
        const last7Start = new Date();
        last7Start.setDate(today.getDate() - 6);
        return (
          startDate.toDateString() === last7Start.toDateString() &&
          endDate.toDateString() === today.toDateString()
        );
      },
    },
    {
      label: 'Этот месяц',
      range: () => {
        const now = new Date();
        const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        return { startDate, endDate };
      },
      isSelected(range: { startDate: Date; endDate: Date }) {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        return (
          range.startDate.toDateString() === startOfMonth.toDateString() &&
          range.endDate.toDateString() === endOfMonth.toDateString()
        );
      },
    },
    {
      label: 'Сбросить',
      range: () => ({ startDate: null, endDate: null }),
    },
  ];

  // Функция для обработки выбора предустановленного диапазона
  const applyStaticRange = (
    rangeFn: () => { startDate: Date | null; endDate: Date | null },
  ) => {
    const newRange = rangeFn();
    setDateRange(newRange);
  };

  return (
    <div className='mx-auto w-full max-w-md p-4 md:ml-auto'>
      <h2 className='text-2xl font-bold'>Список транзакций</h2>
      {/* Фильтры */}
      <div className='mt-4 space-y-2'>
        {/* Фильтр по типу */}
        <select
          value={filterType}
          onChange={(e) =>
            setFilterType(e.target.value as 'all' | 'income' | 'expense')
          }
          className='focus:ring-accent w-full rounded-sm border bg-white p-2 placeholder-neutral-300 focus:ring-2 focus:outline-hidden dark:border-neutral-600 dark:bg-neutral-700'>
          <option value='all'>Все</option>
          <option value='income'>Доход</option>
          <option value='expense'>Расход</option>
        </select>
        {/* Фильтр статических диапазонов */}
        <div className='flex gap-2'>
          {customStaticRanges.map((item) => (
            <button
              key={item.label}
              onClick={() => applyStaticRange(item.range)}
              className='focus:ring-accent rounded border bg-white p-2 text-sm focus:ring-2 dark:border-neutral-600 dark:bg-neutral-700'>
              {item.label}
            </button>
          ))}
        </div>

        {/* Выбор диапазона дат */}
        <div className='relative'>
          <button
            onClick={() => setShowDatePicker((prev) => !prev)}
            className='focus:ring-accent w-full rounded-sm border bg-white p-2 focus:ring-2 focus:outline-hidden dark:border-neutral-600 dark:bg-neutral-700'>
            {dateRange.startDate && dateRange.endDate
              ? `${dateRange.startDate.toLocaleDateString('ru-RU', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })} - ${dateRange.endDate.toLocaleDateString('ru-RU', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })}`
              : 'Выбрать диапазон дат'}
          </button>
          {showDatePicker && (
            <div className='mt-2 grid justify-center rounded-sm bg-white p-2 shadow-lg dark:bg-neutral-800'>
              <DateRange
                ranges={[
                  {
                    startDate: dateRange.startDate || new Date(),
                    endDate: dateRange.endDate || new Date(),
                    key: 'selection',
                  },
                ]}
                onChange={(ranges: RangeKeyDict) => {
                  // Используем ключ 'selection' по умолчанию
                  const { startDate, endDate } = ranges.selection;
                  setDateRange({
                    startDate: startDate || null,
                    endDate: endDate || null,
                  });
                }}
                editableDateInputs={true}
                locale={ru}
                dateDisplayFormat='dd.MM.yyyy'
                weekStartsOn={1}
                moveRangeOnFirstSelection={false}
                rangeColors={['var(--accent)']}
                maxDate={new Date()}
              />
              <button
                onClick={() => setShowDatePicker(false)}
                className='bg-accent w-full rounded-sm p-2 text-white hover:bg-blue-600'>
                Применить
              </button>
            </div>
          )}
        </div>
      </div>
      {/* Список транзакций */}
      <div className='mt-4'>
        {filteredData?.map((doc) => {
          // Если у документа еще нет createdAt, показываем скелетон
          if (!doc.createdAt) {
            return <TransactionSkeleton key={doc.id} />;
          }
          return (
            <div
              key={doc.id}
              className={cn(
                'flex flex-col content-center rounded-sm p-2 shadow-md',
                doc.type === 'income'
                  ? 'bg-green-100 text-green-900 dark:bg-green-800/40 dark:text-green-100'
                  : 'bg-red-100 text-red-900 dark:bg-red-800/40 dark:text-red-100',
              )}>
              {/* Форма редактирования */}
              {editingId === doc.id ? (
                <div className='w-full space-y-2'>
                  <input
                    type='text'
                    value={formData.title || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder='Название'
                    className='focus:ring-accent w-full rounded-sm border bg-white p-2 placeholder-neutral-300 focus:ring-2 focus:outline-hidden dark:border-neutral-600 dark:bg-neutral-700'
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
                    className='focus:ring-accent w-full rounded-sm border bg-white p-2 placeholder-neutral-300 focus:ring-2 focus:outline-hidden dark:border-neutral-600 dark:bg-neutral-700'
                  />
                  <select
                    value={formData.type || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        type: e.target.value as 'income' | 'expense',
                      })
                    }
                    className='focus:ring-accent w-full rounded-sm border bg-white p-2 placeholder-neutral-300 focus:ring-2 focus:outline-hidden dark:border-neutral-600 dark:bg-neutral-700'>
                    <option value='income'>Доход</option>
                    <option value='expense'>Расход</option>
                  </select>
                  <div className='flex gap-2'>
                    <button
                      onClick={handleSave}
                      className='rounded-sm bg-blue-500 px-4 py-2 text-white hover:bg-blue-700'>
                      Сохранить
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className='rounded-sm bg-gray-500 px-4 py-2 text-white hover:bg-gray-700'>
                      Отменить
                    </button>
                  </div>
                </div>
              ) : (
                <div className='flex w-full items-center justify-between'>
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
          );
        })}
      </div>
    </div>
  );
}
