'use client';

import '@mantine/dates/styles.css';

import { useState } from 'react';
import { IconX } from '@tabler/icons-react';
import { Button, Group, Notification, rem, TextInput } from '@mantine/core';
import { MonthPickerInput } from '@mantine/dates';
import { useExpenses } from '@/src/hooks/useExpenses';
import { Expense } from '@/src/types';

const categories = [
  { code: 'HousingCosts', name: '家賃' },
  { code: 'UtilityExpenses', name: '光熱費' },
  { code: 'FoodExpenses', name: '食費' },
  { code: 'EducationalCosts', name: '教育費' },
  { code: 'EntertainmentExpenses', name: '交際費' },
  { code: 'BeautyExpenses', name: '美容費' },
  { code: 'HobbyExpenses', name: '趣味娯楽' },
  { code: 'MedicalExpenses', name: '医療費' },
  { code: 'CommunicationCosts', name: '通信費' },
  { code: 'TransportationExpenses', name: '交通費' },
  { code: 'DailyNecessities', name: '日用品' },
  { code: 'OtherExpenses', name: 'その他' },
];

export const ExpenseForm = () => {
  const [date, setDate] = useState<Date | null>(new Date());
  const [alartMes, setalartMes] = useState('');
  const xIcon = <IconX style={{ width: rem(20), height: rem(20) }} />;

  const [amounts, setAmounts] = useState<Expense['categories']>(
    categories.reduce((acc, category) => ({ ...acc, [category.code]: 0 }), {})
  );
  const [notification, setNotification] = useState(false);
  const { addExpenses } = useExpenses();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!date) {
      setalartMes('日付を選択してください。');
      return;
    }

    const newExpense: Expense = {
      recordedDate: date,
      categories: Object.fromEntries(Object.entries(amounts).filter(([_, value]) => value !== 0)),
    };

    await addExpenses([newExpense]);
    setNotification(true);
    setTimeout(() => setNotification(false), 3000);

    setDate(new Date());
    setAmounts(categories.reduce((acc, category) => ({ ...acc, [category.code]: 0 }), {}));
  };

  const handleAmountChange = (category: string, value: string) => {
    setAmounts((prev) => ({ ...prev, [category]: parseFloat(value) || 0 }));
  };

  return (
    <>
      {notification && (
        <Notification color="teal" title="成功" onClose={() => setNotification(false)}>
          支出を登録しました！
        </Notification>
      )}
      <form onSubmit={handleSubmit}>
        <MonthPickerInput
          label="年月"
          value={date}
          onChange={setDate}
          placeholder="例: 2000-01"
          valueFormat="YYYY-MM"
        />
        <div className="space-y-4 mt-4">
          {categories.map((category) => (
            <div key={category.code}>
              <TextInput
                label={category.name}
                placeholder="金額を入力"
                type="number"
                value={amounts[category.code]?.toString() || ''}
                onChange={(e) => handleAmountChange(category.code, e.target.value)}
              />
            </div>
          ))}
        </div>
        <Group mt="md">
          <Button type="submit" color="blue">
            登録
          </Button>
        </Group>
      </form>
      {alartMes && (
        <Notification icon={xIcon} color="red" title="入力エラー!" onClose={() => setalartMes('')}>
          {alartMes}
        </Notification>
      )}
    </>
  );
};
