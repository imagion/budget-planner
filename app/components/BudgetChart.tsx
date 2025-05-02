import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { TransactionType } from '@/types/TransactionFormTypes';

Chart.register(ArcElement, Tooltip, Legend);

type CategoryData = {
  [category: string]: number;
};

export default function BudgetChart({ data }: { data: TransactionType[] }) {
  // Группируем транзакции по категориям
  const grouped: CategoryData = {};
  for (const item of data) {
    grouped[item.category] = (grouped[item.category] || 0) + item.amount;
  }

  const chartData = {
    labels: Object.keys(grouped),
    datasets: [
      {
        data: Object.values(grouped),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4CAF50',
          '#FF9800',
        ],
      },
    ],
  };

  return <Doughnut data={chartData} />;
}
