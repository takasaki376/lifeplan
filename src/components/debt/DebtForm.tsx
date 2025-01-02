'use client';

import dayjs from 'dayjs';
import { useState } from 'react';
import { Button, TextInput } from '@mantine/core';
import { DateInput, DateInputProps, MonthPickerInput } from '@mantine/dates';
import { useDebt } from '@/src/hooks/useDebts';
import { Debt } from '@/src/types';

const dateParser: DateInputProps['dateParser'] = (input) => {
  if (input === 'WW2') {
    return new Date(1939, 8, 1);
  }

  return dayjs(input, 'YYYY-MM-DD').toDate();
};

export default function DebtForm() {
  const [form, setForm] = useState<Debt>({
    name: '',
    balance: 0,
    interestRate: 0,
    dueDate: null,
    recordedDate: new Date(),
  });
  const { addDebt } = useDebt();

  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    try {
      await addDebt(form);
      setForm({
        name: '',
        balance: 0,
        interestRate: 0,
        dueDate: null,
        recordedDate: new Date(),
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-2">債務を追加する</h2>
      <div className="flex flex-col gap-4">
        <TextInput
          label="債務名"
          value={form.name}
          onChange={(e) => handleChange('name', e.target.value)}
          required
        />
        <TextInput
          label="残高"
          type="number"
          value={form.balance}
          onChange={(e) => handleChange('balance', Number(e.target.value))}
          required
        />
        <TextInput
          label="金利 (%)"
          type="number"
          value={form.interestRate}
          onChange={(e) => handleChange('interestRate', Number(e.target.value))}
          required
        />
        <MonthPickerInput
          label="返済期日"
          value={form.dueDate}
          onChange={(value) => handleChange('dueDate', value)}
          placeholder="例: 2000-01"
          valueFormat="YYYY-MM"
        />
        <DateInput
          label="登録時点の日付"
          value={form.recordedDate}
          onChange={(value) => handleChange('recordedDate', value)}
          placeholder="例: 2000-01-01"
          dateParser={dateParser}
          valueFormat="YYYY-MM-DD"
        />

        <Button onClick={handleSubmit}>追加</Button>
      </div>
    </div>
  );
}
