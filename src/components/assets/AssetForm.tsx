import { Button, NumberInput, Select, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';

const assetTypes = [
  { value: 'cash', label: '現金' },
  { value: 'deposit', label: '預金' },
  { value: 'real_estate', label: '不動産' },
  { value: 'stocks', label: '株式' },
  { value: 'other', label: 'その他' },
];

export default function AssetForm({
  initialValues,
  onSubmit,
  onCancel,
}: {
  initialValues?: any;
  onSubmit: (values: any) => void;
  onCancel?: () => void;
}) {
  const form = useForm({
    initialValues: initialValues || {
      type: '',
      details: '',
      amount: 0,
    },
    validate: {
      type: (value) => (value ? null : '資産の種類を選択してください'),
      amount: (value) => (value > 0 ? null : '金額を入力してください'),
    },
  });

  return (
    <form onSubmit={form.onSubmit((values) => onSubmit(values))} className="space-y-4">
      <Select
        label="資産の種類"
        placeholder="選択してください"
        data={assetTypes}
        {...form.getInputProps('type')}
      />
      <TextInput
        label="詳細"
        placeholder="例: 銀行名、不動産の所在地など"
        {...form.getInputProps('details')}
      />
      <NumberInput
        label="金額"
        // type="number"
        placeholder="金額を入力してください"
        {...form.getInputProps('amount')}
      />
      <div className="flex space-x-4">
        <Button type="submit" color="blue">
          登録
        </Button>
        {onCancel && (
          <Button type="button" color="gray" onClick={onCancel}>
            キャンセル
          </Button>
        )}
      </div>
    </form>
  );
}
