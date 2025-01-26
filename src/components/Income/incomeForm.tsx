'use client';

import { useState } from 'react';
import { IconX } from '@tabler/icons-react';
import classcat from 'classcat';
import {
  Button,
  List,
  ListItem,
  Notification,
  rem,
  Select,
  Space,
  TextInput,
  Title,
} from '@mantine/core';
import { useFamily } from '@/src/hooks/useFamily';
import { useIncome } from '@/src/hooks/useIncome';
import { CalculationResult } from '@/src/types';
import { calculateNetIncome } from '@/src/utils/taxCalculations';

const IncomeForm = () => {
  const [name, setName] = useState<string>('');
  const [familyId, setFamilyId] = useState<string>('');
  const [income, setIncome] = useState<number | undefined>(undefined);
  const [startAge, setStartAge] = useState<number | undefined>(undefined);
  const [endAge, setEndAge] = useState<number | undefined>(undefined);
  const [alartMes, setalartMes] = useState('');
  const xIcon = <IconX style={{ width: rem(20), height: rem(20) }} />;
  const { addIncome } = useIncome();
  const { family } = useFamily();
  // 家族メンバーのデータをSelectコンポーネント用に変換
  const familyOptions = family
    .map((member) => {
      if (member.id === undefined || member.id === null) {
        return null;
      }
      return {
        value: member.id,
        label: member.name,
      };
    })
    .filter((option): option is { value: string; label: string } => option !== null);

  const [result, setResult] = useState<CalculationResult | null>(null);

  const handleBlur = () => {
    const calculation = calculateNetIncome(income);
    setResult(calculation);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // バリデーションチェック
    if (
      !familyId ||
      familyId === undefined ||
      !name ||
      income === undefined ||
      income < 0 ||
      startAge === undefined ||
      startAge < 0 ||
      endAge === undefined ||
      endAge < 0
    ) {
      setalartMes('すべての項目を正しく入力してください');
      return;
    }

    if (startAge > endAge) {
      setalartMes('開始年齢は終了年齢より小さい値を入力してください');
      return;
    }

    await addIncome({ familyId, name, income, startAge, endAge });

    // フォームをリセット
    setFamilyId('');
    setName('');
    setIncome(0);
    setStartAge(0);
    setEndAge(0);
    setResult(null);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Select
          label="氏名"
          placeholder="家族メンバーを選択"
          data={familyOptions}
          value={familyId}
          onChange={(value) => setFamilyId(value || '')}
          required
        />
        <TextInput
          label="名称"
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="例: 給与"
          required
        />
        <TextInput
          label="収入額（円）"
          placeholder="例: 300000"
          type="number"
          value={income}
          onChange={(e) => setIncome(Number(e.target.value))}
          className="w-full"
          onBlur={handleBlur}
          required
        />
        <TextInput
          label="開始年齢"
          placeholder="例: 25"
          type="number"
          value={startAge}
          onChange={(e) => setStartAge(Number(e.target.value))}
          required
        />
        <TextInput
          label="終了年齢"
          placeholder="例: 60"
          type="number"
          value={endAge}
          onChange={(e) => setEndAge(Number(e.target.value))}
          required
        />

        <Space h="md" />
        {result && (
          <>
            <Title order={3}>計算結果</Title>
            <Space h="sm" />
            <List withPadding>
              <ListItem>総所得: {result.totalIncome.toLocaleString()} 円</ListItem>
              <ListItem>社会保険料: {result.socialInsurance.toLocaleString()} 円</ListItem>
              <ListItem>所得税: {result.incomeTax.toLocaleString()} 円</ListItem>
              <ListItem>住民税: {result.residentTax.toLocaleString()} 円</ListItem>
              <ListItem>手取り額: {result.netIncome.toLocaleString()} 円</ListItem>
            </List>
          </>
        )}
        <Button
          type="submit"
          className={classcat([
            'w-full',
            !name ||
            income === undefined ||
            income < 0 ||
            startAge === undefined ||
            endAge === undefined
              ? 'bg-gray-400'
              : 'bg-blue-500',
          ])}
          disabled={
            !familyId ||
            familyId === undefined ||
            !name ||
            income === undefined ||
            income < 0 ||
            startAge === undefined ||
            endAge === undefined
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
