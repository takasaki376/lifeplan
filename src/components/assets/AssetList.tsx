import { IconEdit, IconTrash } from '@tabler/icons-react';
import { Button, Card, Group, Stack, Text } from '@mantine/core';
import { Asset } from '@/src/types';
import { assetTypes } from './AssetForm';

type CardProps = {
  asset: Asset;
  onEdit: (asset: Asset) => void;
  onDelete: (id: string) => void;
};
const AssetCard = ({ asset, onEdit, onDelete }: CardProps) => {
  if (!asset.id) {
    return null;
  }
  // asset.typeを日本語の名称に変換
  const assetTypeName = assetTypes.map((type) => (type.value === asset.type ? type.label : ''))[0];

  return (
    <Card key={asset.id} shadow="sm" padding="lg" radius="md" withBorder>
      <Group align="flex-start">
        <div>
          <Text className="mb-2 text-lg">{assetTypeName}</Text>
          <Text className="mb-2 text-sm">{asset.details || '詳細なし'}</Text>
          <Text className="text-gray-600 text-sm">¥{asset.amount}</Text>
        </div>
        <Group>
          <Button size="xs" color="blue" onClick={() => onEdit(asset)}>
            <IconEdit size={16} />
            編集
          </Button>
          <Button
            size="xs"
            color="red"
            // leftIcon={}
            onClick={() => onDelete(asset.id || '')}
          >
            <IconTrash size={16} />
            削除
          </Button>
        </Group>
      </Group>
    </Card>
  );
};

export default function AssetList({
  assets,
  onEdit,
  onDelete,
}: {
  assets: Asset[];
  onEdit: (asset: Asset) => void;
  onDelete: (id: string) => void;
}) {
  if (assets.length === 0 || !assets) {
    return <Text className="text-center text-gray-800 mb-4">資産が登録されていません</Text>;
  }

  return (
    <Stack>
      {assets.map((asset) => (
        <AssetCard key={asset.id} asset={asset} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </Stack>
  );
}
