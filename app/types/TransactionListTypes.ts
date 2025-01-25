import { Timestamp } from 'firebase/firestore';

export interface Document {
  id: string;
  title: string;
  amount: number;
  type: 'expense' | 'income';
  createdAt: Timestamp;
}
