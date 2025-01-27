import { useRouter } from 'next/navigation';
import { IconArrowLeft } from '@tabler/icons-react';
import { Button } from '@mantine/core';

interface HeaderProps {
  title: string;
  btnTitle: string;
  onBtnClick?: () => void;
}

export const Header = ({ title, btnTitle, onBtnClick }: HeaderProps) => {
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <Button
          variant="subtle"
          leftSection={<IconArrowLeft size={16} />}
          onClick={() => router.push('/')}
        />
        <Button onClick={onBtnClick}>{btnTitle}</Button>
      </div>
      <div className="flex-1 flex justify-center">
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>
    </>
  );
};
