'use client';

import { useState } from 'react';
import { Alert, Loader } from '@mantine/core';
import AssetForm from '@/src/components/assets/AssetForm';
import AssetList from '@/src/components/assets/AssetList';
import { Header } from '@/src/components/common/Header';
import { useAsset } from '@/src/hooks/useAsset';
import { Asset } from '@/src/types';

export default function AssetPage() {
  const { assets, addAsset, updateAsset, deleteAsset, loading, error } = useAsset();

  const [isEditing, setIsEditing] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);

  const handleEdit = (asset: any) => {
    setIsEditing(true);
    setEditingAsset(asset);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingAsset(null);
  };

  const handleSubmit = async (values: any) => {
    if (isEditing) {
      // 編集モード: updateAsset を呼び出し
      if (editingAsset) {
        await updateAsset(editingAsset.id || '', values);
      }
      setIsEditing(false);
      setEditingAsset(null);
    } else {
      // 新規モード: addAsset を呼び出し
      await addAsset(values);
    }
  };

  return (
    <div className="container mx-auto p-4 flex flex-col">
      <Header title="資産管理" btnTitle="資産追加" />
      {loading && (
        <div className="flex justify-center mb-4">
          <Loader />
        </div>
      )}
      {error && (
        <Alert color="red" className="mb-4">
          {error}
        </Alert>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-medium mb-2">{isEditing ? '資産を編集' : '資産を追加'}</h2>
          <AssetForm
            initialValues={editingAsset}
            onSubmit={handleSubmit}
            onCancel={handleCancelEdit}
          />
        </div>
        <div>
          <h2 className="text-lg font-medium mb-2">登録済みの資産</h2>
          <AssetList assets={assets} onEdit={handleEdit} onDelete={deleteAsset} />
        </div>
      </div>
    </div>
  );
}
