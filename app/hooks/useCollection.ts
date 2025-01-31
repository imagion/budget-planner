'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  QueryConstraint,
  where,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  OrderByCondition,
  QueryCondition,
  UseCollectionReturn,
} from '@/types/useCollectionTypes';

export function useCollection<T>(
  collectionName: string,
  _where?: QueryCondition[],
  _orderBy?: OrderByCondition,
): UseCollectionReturn<T> {
  const [data, setData] = useState<T[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Мемоизация constraints для повышения производительности.
  // Применение JSON.stringify в массиве зависимостей обеспечивает
  //  правильное сравнение объектов (они сравниваются по значению, а не по ссылке).
  const constraints = useMemo(() => {
    const constraints: QueryConstraint[] = [];
    if (_where && _where.length > 0) {
      _where.forEach((condition) => constraints.push(where(...condition)));
    }
    if (_orderBy) constraints.push(orderBy(..._orderBy));
    return constraints;
  }, [
    _where ? JSON.stringify(_where) : null,
    _orderBy ? JSON.stringify(_orderBy) : null,
  ]);

  useEffect(() => {
    const collectionRef = collection(db, collectionName);
    const q = constraints.length
      ? query(collectionRef, ...constraints)
      : collectionRef;

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const results = snapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() }) as T,
        );
        setData(results);
        setError(null);
        setIsLoading(false);
      },
      (error) => {
        console.error('Error fetching collection:', error);
        setError('Could not fetch the data');
        setIsLoading(false);
      },
    );

    return () => unsubscribe();
  }, [collectionName, constraints]);

  return { data, error, isLoading };
}
