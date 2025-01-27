'use client';

import '@mantine/dates/styles.css';

import { useAtomValue } from 'jotai';
import { incomeAtom } from '@/src/store/atoms';
import IncomeCard from './IncomeCard';

// import IncomeForm from './IncomeForm';

export function IncomeList() {
  const incomes = useAtomValue(incomeAtom);

  return (
    <div>
      {/* <IncomeForm /> */}
      <div className="mt-4">
        {incomes.map((income) => (
          <IncomeCard key={income.id} income={income} />
        ))}
      </div>
    </div>
  );
}
