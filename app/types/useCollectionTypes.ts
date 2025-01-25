import { WhereFilterOp } from 'firebase/firestore';

export type QueryCondition = [string, WhereFilterOp, unknown];
export type OrderByCondition = [string, 'asc' | 'desc'];

export interface UseCollectionReturn<T> {
  data: T[] | null;
  error: string | null;
  isLoading: boolean;
}
