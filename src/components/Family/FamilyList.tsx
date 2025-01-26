'use client';

import '@mantine/dates/styles.css';

// import { useState } from 'react';
import { useFamily } from '@/src/hooks/useFamily';
// import { Family } from '@/src/types';
import { FamilyCard } from './FamilyCard';
import { FamilyForm } from './FamilyForm';

export function FamilyList() {
  // const [familyMembers, setFamilyMembers] = useState<Family[]>([]);
  const { family } = useFamily();

  // const removeFamilyMember = (id: string) => {
  //   setFamilyMembers(familyMembers.filter((member) => member.id !== id));
  // };

  return (
    <div>
      <FamilyForm />
      <div className="mt-4">
        {family.map((member) => (
          <FamilyCard key={member.id} member={member} />
        ))}
      </div>
    </div>
  );
}
