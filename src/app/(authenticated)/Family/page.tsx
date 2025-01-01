import { FamilyList } from '@/src/components/Family/FamilyList';

export default function FamilyPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">家族構成の管理</h1>
      <FamilyList />
    </div>
  );
}
