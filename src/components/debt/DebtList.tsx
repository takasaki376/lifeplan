'use client';

import '@mantine/dates/styles.css';

import { Button, Card, Group, Stack, Text } from '@mantine/core';
import { useDebt } from '@/src/hooks/useDebts';

export default function DebtList() {
  const { debts, deleteDebt } = useDebt();

  return (
    <Stack>
      {debts.map((debt) => (
        <Card shadow="sm" padding="lg" key={debt.id} withBorder>
          <Group mb="sm">
            <Text className="w-4">{debt.name}</Text>
            <Button onClick={() => deleteDebt(debt.id || '')} variant="light" color="red" size="xs">
              削除
            </Button>
          </Group>
          <Text>残高: ¥{debt.balance.toLocaleString()}</Text>
          <Text>金利: {debt.interestRate}%</Text>
          <Text>返済期日: {debt.dueDate ? debt.dueDate.toLocaleDateString() : 'N/A'}</Text>
        </Card>
      ))}
    </Stack>
  );
}
