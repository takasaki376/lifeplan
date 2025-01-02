import { IconEdit, IconTrash } from '@tabler/icons-react';
import { Button, Card, Group, Stack, Text } from '@mantine/core';

export default function AssetList({
  assets,
  onEdit,
  onDelete,
}: {
  assets: any[];
  onEdit: (asset: any) => void;
  onDelete: (id: string) => void;
}) {
  if (assets.length === 0) {
    return <Text className="text-center text-gray-800 mb-4">資産が登録されていません</Text>;
  }

  return (
    <Stack>
      {assets.map((asset) => (
        <Card key={asset.id} shadow="sm" padding="lg" radius="md" withBorder>
          <Group align="flex-start">
            <div>
              <Text className="mb-2 text-lg">{asset.type}</Text>
              <Text className="mb-2 text-sm">{asset.details || '詳細なし'}</Text>
              <Text className="text-gray-600 text-sm">¥{asset.amount.toLocaleString()}</Text>
            </div>
            <Group>
              <Button
                size="xs"
                color="blue"
                // leftIcon={<IconEdit size={16} />}
                onClick={() => onEdit(asset)}
              >
                <IconEdit size={16} />
                編集
              </Button>
              <Button
                size="xs"
                color="red"
                // leftIcon={}
                onClick={() => onDelete(asset.id)}
              >
                <IconTrash size={16} />
                削除
              </Button>
            </Group>
          </Group>
        </Card>
      ))}
    </Stack>
  );
}
