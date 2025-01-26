'use client';

import '@mantine/dates/styles.css';

import { Button, Card, Text } from '@mantine/core';
import { useIncome } from '@/src/hooks/useIncome';
import { Income } from '@/src/types';

interface IncomeCardProps {
  income: Income;
}

const IncomeCard = ({ income }: IncomeCardProps) => {
  const { updateIncome, deleteIncome } = useIncome();

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder className="mb-4">
      <Text className="text-lg font-bold">{income.name}</Text>
      <Text>名称: {income.name}</Text>
      <Text>収入額: {income.income?.toLocaleString()} 円</Text>
      <Text>
        期間: {income.startAge}歳 〜 {income.endAge}歳
      </Text>

      <div className="flex justify-between mt-4">
        <Button
          onClick={() =>
            updateIncome(income.id || '', {
              name: income.name,
              income: income.income,
              startAge: income.startAge,
              endAge: income.endAge,
            })
          }
          variant="outline"
          size="xs"
        >
          編集
        </Button>
        <Button onClick={() => deleteIncome(income.id || '')} color="red" size="xs">
          削除
        </Button>
      </div>
    </Card>
  );
};

export default IncomeCard;
