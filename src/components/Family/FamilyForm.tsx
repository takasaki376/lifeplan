'use client';

import '@mantine/dates/styles.css';

import dayjs from 'dayjs';
import { useState } from 'react';
import { Button, Select, TextInput } from '@mantine/core';
import { DateInput, DateInputProps } from '@mantine/dates';
import { FamilyMember } from '@/src/types';

type FamilyFormProps = {
  onSubmit: (member: FamilyMember) => void;
};

const dateParser: DateInputProps['dateParser'] = (input) => {
  if (input === 'WW2') {
    return new Date(1939, 8, 1);
  }

  return dayjs(input, 'YYYY-MM-DD').toDate();
};

export function FamilyForm({ onSubmit }: FamilyFormProps) {
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [relation, setRelation] = useState('');

  const handleSubmit = () => {
    if (name && birthDate && relation) {
      onSubmit({ id: '', name, birthDate, relation });
      setName('');
      setBirthDate(null);
      setRelation('');
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 border rounded">
      <TextInput
        label="名前"
        value={name}
        onChange={(e) => setName(e.currentTarget.value)}
        placeholder="例: 山田 太郎"
      />
      <DateInput
        label="生年月日"
        value={birthDate}
        onChange={setBirthDate}
        placeholder="例: 2000-01-01"
        dateParser={dateParser}
        valueFormat="YYYY-MM-DD"
      />
      <Select
        label="関係"
        value={relation}
        onChange={(value) => setRelation(value || '')}
        data={['父', '母', '兄弟姉妹', '配偶者', '子供']}
        placeholder="例: 父"
      />
      <Button onClick={handleSubmit} variant="outline">
        家族を追加
      </Button>
    </div>
  );
}
