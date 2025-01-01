'use client';

import type { FC } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import cc from 'classcat';

const items = [
  { href: '/PlanList', label: 'PlanList' },
  { href: '/PlanDetail', label: 'PlanDetail' },
  { href: '/PlanEdit', label: 'PlanEdit' },
  { href: '/PlanCreate', label: 'PlanCreate' },
  { href: '/PlanDelete', label: 'PlanDelete' },
  { href: '/PlanUpdate', label: 'PlanUpdate' },
  { href: '/PlanSelect', label: 'PlanSelect' },
  { href: '/PlanSearch', label: 'PlanSearch' },
  { href: '/Family', label: 'Family' },
  { href: '/Events', label: 'Events' },
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
