'use client';

import { useState, useEffect } from 'react';
import {
  collection,
  query,
  getDocs,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export function useCollection<T>(
  collectionName: string,
  where?: QueryConstraint,
  orderBy?: QueryConstraint,
) {
  const [data, setData] = useState<T[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const colRef = collection(db, collectionName);

        // Собираем запрос с учетом фильтрации и сортировки
        const q = query(
          colRef,
          ...(where ? [where] : []),
          ...(orderBy ? [orderBy] : []),
        );

        const querySnapshot = await getDocs(q);
        const items: T[] = querySnapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() }) as T,
        );

        setData(items);
      } catch (err) {
        setError((err as Error).message);
        console.log((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [collectionName, where, orderBy]);

  return { data, error, isLoading };
}
