import { FC, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/src/hooks/useAuth';

const PlanListPage: FC = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login'); // 未ログインの場合はログインページにリダイレクト
    }
  }, [user, loading, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const plans = [
    { id: 1, name: 'Plan 1' },
    { id: 2, name: 'Plan 2' },
    { id: 3, name: 'Plan 3' },
  ];

  //   const handleBtnClick = () => {
  //     console.log('プラン登録');
  //   };
  return (
    <div className="container mx-auto p-4 plan-list-container">
      <div className="absolute top-5 right-5">
        <button
          type="button"
          // onClick={handleBtnClick}
        >
          プラン登録
        </button>
      </div>
      <h1 className="text-center text-2xl font-bold">ライフプラン一覧</h1>
      <div className="flex justify-center items-center mt-4">
        <ul className="list-item w-full">
          {plans.map((plan) => (
            <li key={plan.id} className="text-lg bg-red-300 my-1 w-full">
              {plan.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PlanListPage;
