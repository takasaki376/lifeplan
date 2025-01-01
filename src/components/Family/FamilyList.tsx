'use client';

import '@mantine/dates/styles.css';

import { useState } from 'react';
import { FamilyMember } from '@/src/types';
import { FamilyCard } from './FamilyCard';
import { FamilyForm } from './FamilyForm';

export function FamilyList() {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);

  const addFamilyMember = (member: FamilyMember) => {
    setFamilyMembers([...familyMembers, member]);
  };

  const updateFamilyMember = (updatedMember: FamilyMember) => {
    setFamilyMembers(
      familyMembers.map((member) => (member.id === updatedMember.id ? updatedMember : member))
    );
  };

  const removeFamilyMember = (id: string) => {
    setFamilyMembers(familyMembers.filter((member) => member.id !== id));
  };

  return (
    <div>
      <FamilyForm onSubmit={addFamilyMember} />
      <div className="mt-4">
        {familyMembers.map((member) => (
          <FamilyCard
            key={member.id}
            member={member}
            onUpdate={updateFamilyMember}
            onRemove={removeFamilyMember}
          />
        ))}
      </div>
    </div>
  );
}
