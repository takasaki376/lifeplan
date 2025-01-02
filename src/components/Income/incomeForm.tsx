'use client';

import { useState } from 'react';
import { IconX } from '@tabler/icons-react';
import classcat from 'classcat';
import { Button, Notification, rem, TextInput } from '@mantine/core';

const IncomeForm = () => {
  const [salaryIncome, setSalaryIncome] = useState<number | undefined>(undefined);
  const [businessIncome, setBusinessIncome] = useState<number | undefined>(undefined);
  const [alartMes, setalartMes] = useState('');
  const xIcon = <IconX style={{ width: rem(20), height: rem(20) }} />;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // バリデーションチェック
    if (
      (salaryIncome === undefined || salaryIncome < 0) &&
      (businessIncome === undefined || businessIncome < 0)
    ) {
      setalartMes('少なくとも1つの収入を正しい金額で入力してください');
      return;
    }

    const incomeData = {
      salaryIncome: salaryIncome || 0,
      businessIncome: businessIncome || 0,
    };

    // Firebaseにデータを送信する処理を記述
    console.log('収入データが登録されました: ', incomeData);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <TextInput
          label="給与（円）"
          placeholder="例: 300000"
          type="number"
          value={salaryIncome}
          onChange={(e) => setSalaryIncome(Number(e.target.value))}
          className="w-full"
        />
        <TextInput
          label="事業所得（円）"
          placeholder="例: 150000"
          type="number"
          value={businessIncome}
          onChange={(e) => setBusinessIncome(Number(e.target.value))}
          className="w-full"
        />
        <Button
          type="submit"
          className={classcat([
            'w-full',
            salaryIncome === undefined && businessIncome === undefined
              ? 'bg-gray-400'
              : 'bg-blue-500',
          ])}
          disabled={
            (salaryIncome === undefined || salaryIncome < 0) &&
            (businessIncome === undefined || businessIncome < 0)
          }
        >
          保存
        </Button>
      </form>
      {alartMes && (
        <Notification icon={xIcon} color="red" title="入力エラー!" onClose={() => setalartMes('')}>
          {alartMes}
        </Notification>
      )}
    </>
  );
};

export default IncomeForm;
