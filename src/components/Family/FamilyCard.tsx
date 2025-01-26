'use client';

import '@mantine/dates/styles.css';

import { Button, Card, Text } from '@mantine/core';
import { useFamily } from '@/src/hooks/useFamily';
import { Family } from '@/src/types';

type FamilyCardProps = {
  member: Family;
};

function calculateAge(birthDate: Date | null): number {
  if (!birthDate) {
    return 0;
  }

  // birthDateがDate型でない場合は新しいDateオブジェクトを作成
  const birthDateObj = birthDate instanceof Date ? birthDate : new Date(birthDate);

  // 無効な日付の場合は0を返す
  if (isNaN(birthDateObj.getTime())) {
    return 0;
  }

  const today = new Date();
  let age = today.getFullYear() - birthDateObj.getFullYear();
  const monthDifference = today.getMonth() - birthDateObj.getMonth();

  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDateObj.getDate())) {
    age--;
  }

  return age;
}

export function FamilyCard({ member }: FamilyCardProps) {
  const age = calculateAge(member.birthDate);
  const { updateFamily, deleteFamily } = useFamily();

  const formatBirthDate = (date: Date | null) => {
    if (!date) {
      return '不明';
    }
    const dateObj = date instanceof Date ? date : new Date(date);
    return isNaN(dateObj.getTime()) ? '不明' : dateObj.toISOString().split('T')[0];
  };

  return (
    <Card shadow="sm" padding="lg" className="mb-4">
      <Text className="text-lg font-bold">{member.name}</Text>
      <Text>生年月日: {formatBirthDate(member.birthDate)}</Text>
      <Text>年齢: {age}歳</Text>
      <Text>関係: {member.relation}</Text>
      <div className="flex justify-between mt-4">
        <Button
          onClick={() =>
            updateFamily(member.id || '', {
              name: member.name,
              birthDate: member.birthDate,
              relation: member.relation,
            })
          }
          variant="outline"
          size="xs"
        >
          編集
        </Button>
        <Button onClick={() => deleteFamily(member.id || '')} color="red" size="xs">
          削除
        </Button>
      </div>
    </Card>
  );
}
