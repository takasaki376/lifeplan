'use client';

import dayjs from 'dayjs';
import { useState } from 'react';
import { IconX } from '@tabler/icons-react';
import { Button, Notification, rem, TextInput } from '@mantine/core';
import { DateInput, DateInputProps, MonthPickerInput } from '@mantine/dates';
import { useDebt } from '@/src/hooks/useDebts';
import { Debt } from '@/src/types';

const dateParser: DateInputProps['dateParser'] = (input) => {
  if (input === 'WW2') {
    return new Date(1939, 8, 1);
  }

  return dayjs(input, 'YYYY-MM-DD').toDate();
};

const initDebt = {
  name: '',
  balance: 0,
  interestRate: 0,
  dueDate: null,
  monthlyPayment: 0,
  recordedDate: new Date(),
};

export default function DebtForm() {
  // const [date, setDate] = useState<Date | null>(new Date());
  const [alertMes, setAlertMes] = useState('');
  const [form, setForm] = useState<Debt>(initDebt);
  const { addDebt } = useDebt();

  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };
  const xIcon = <IconX style={{ width: rem(20), height: rem(20) }} />;

  const handleSubmit = async () => {
    if (!form.recordedDate) {
      setAlertMes('日付を選択してください。');
      return;
    }
    if (!form.dueDate) {
      setAlertMes('返済期日を選択してください。');
      return;
    }

    const newDebt: Debt = {
      ...form,
      dueDate: form.dueDate as Date,
      recordedDate: form.recordedDate as Date,
    };

    try {
      await addDebt(newDebt);
      setForm(initDebt);
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
          required
        />
        <TextInput
          label="月額返済金額"
          type="number"
          value={form.balance}
          onChange={(e) => handleChange('monthlyPayment', Number(e.target.value))}
          required
        />
        <DateInput
          label="登録時点の日付"
          value={form.recordedDate}
          onChange={(value) => handleChange('recordedDate', value)}
          placeholder="例: 2000-01-01"
          dateParser={dateParser}
          valueFormat="YYYY-MM-DD"
          required
        />

        <Button onClick={handleSubmit}>追加</Button>
      </div>
      {alertMes && (
        <Notification icon={xIcon} color="red" title="入力エラー!" onClose={() => setAlertMes('')}>
          {alertMes}
        </Notification>
      )}
    </div>
  );
}
