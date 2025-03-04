import { useRouter } from 'next/navigation';
import { IconArrowLeft } from '@tabler/icons-react';
import { getAuth } from 'firebase/auth';
import { Button } from '@mantine/core';
import { firebaseApp } from '@/src/utils/firebase';

interface HeaderProps {
  title: string;
  btnTitle: string;
  onBtnClick?: () => void;
}

export const Header = ({ title, btnTitle, onBtnClick }: HeaderProps) => {
  const router = useRouter();
  const auth = getAuth(firebaseApp);
  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.push('/login');
    } catch (error) {
      console.error('ログアウト中にエラーが発生しました:', error);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <Button
          variant="subtle"
          leftSection={<IconArrowLeft size={16} />}
          onClick={() => router.push('/')}
        />
        <div className="flex flex-row">
          <Button className="mx-2" onClick={onBtnClick}>
            {btnTitle}
          </Button>
          <Button className="mx-2" onClick={handleLogout}>
            ログアウト
          </Button>
        </div>
      </div>
      <div className="flex-1 flex justify-center">
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>
    </>
  );
};
