'use client';

import '@mantine/dates/styles.css';

import { useAtomValue } from 'jotai';
import { familyAtom } from '@/src/store/atoms';
import { FamilyCard } from './FamilyCard';

// import { FamilyForm } from './FamilyForm';

export function FamilyList() {
  // const { family } = useFamily();
  const families = useAtomValue(familyAtom);
  console.log('family=', families);
  return (
    <div>
      {/* <FamilyForm /> */}
      <div className="mt-4">
        {families.map((member) => (
          <FamilyCard key={member.id} member={member} />
        ))}
      </div>
    </div>
  );
}
