export type TransactionType = {
  title: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  uid?: string;
};
