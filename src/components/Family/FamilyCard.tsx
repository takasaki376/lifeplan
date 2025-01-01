'use client';

import '@mantine/dates/styles.css';

import { Button, Card, Text } from '@mantine/core';
import { FamilyMember } from '@/src/types';

type FamilyCardProps = {
  member: FamilyMember;
  onUpdate: (member: FamilyMember) => void;
  onRemove: (id: string) => void;
};

function calculateAge(birthDate: Date | null): number {
  if (!birthDate) {
    return 0;
  }

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

export function FamilyCard({ member, onUpdate, onRemove }: FamilyCardProps) {
  const age = calculateAge(member.birthDate);

  return (
    <Card shadow="sm" padding="lg" className="mb-4">
      <Text className="text-lg font-bold">{member.name}</Text>
      <Text>
        生年月日: {member.birthDate ? member.birthDate.toISOString().split('T')[0] : '不明'}
      </Text>
      <Text>年齢: {age}歳</Text>
      <Text>関係: {member.relation}</Text>
      <div className="flex justify-between mt-4">
        <Button onClick={() => onUpdate(member)} variant="outline" size="xs">
          編集
        </Button>
        <Button onClick={() => onRemove(member.id || '')} color="red" size="xs">
          削除
        </Button>
      </div>
    </Card>
  );
}
