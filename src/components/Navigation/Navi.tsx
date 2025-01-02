'use client';

import type { FC } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import cc from 'classcat';

const items = [
  { href: '/PlanList', label: 'プラン一覧' },
  { href: '/PlanDetail', label: 'PlanDetail' },
  { href: '/PlanEdit', label: 'PlanEdit' },
  { href: '/PlanCreate', label: 'PlanCreate' },
  { href: '/PlanDelete', label: 'PlanDelete' },
  { href: '/PlanUpdate', label: 'PlanUpdate' },
  { href: '/PlanSelect', label: 'PlanSelect' },
  { href: '/PlanSearch', label: 'PlanSearch' },
  { href: '/Family', label: '家族情報' },
  { href: '/Events', label: 'ライフイベント' },
  { href: '/Income', label: '収入' },
  { href: '/Expenses', label: '支出' },
  { href: '/Assets', label: '資産' },
  { href: '/Debt', label: '債務' },
  { href: '/Profile', label: 'Profile' },
  { href: '/Settings', label: 'Settings' },
  { href: '/Privacy', label: 'Privacy' },
] as const;

/**
 * @package
 */
export const Navigation: FC = () => {
  const pathname = usePathname();
  return (
    <div>
      <nav className="flex flex-col items-start text-gray">
        {items.map(({ href, label }) => {
          const activeColorClass = cc([
            'inline-block p-4',
            {
              'text-black': pathname === href!,
              'text-tomato': pathname === href,
            },
          ]);
          return (
            <Link href={href} key={label}>
              <span className={activeColorClass}>{label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
