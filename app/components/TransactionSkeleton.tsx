'use client';

export default function TransactionSkeleton() {
  return (
    <div className='animate-pulse rounded-sm bg-gray-200 p-4 shadow-md dark:bg-gray-700'>
      <div className='mb-2 h-4 w-1/2 bg-gray-300 dark:bg-gray-600'></div>
      <div className='h-4 w-1/3 bg-gray-300 dark:bg-gray-600'></div>
    </div>
  );
}
