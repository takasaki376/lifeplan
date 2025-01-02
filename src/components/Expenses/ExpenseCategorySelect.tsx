import { FC } from 'react';
import { Select } from '@mantine/core';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export const ExpenseCategorySelect: FC<Props> = ({ value, onChange }) => {
  const categories = ['家賃', '光熱費', '食費', '娯楽', '交通費', 'その他'];

  return (
    <Select
      label="カテゴリ"
      placeholder="カテゴリを選択"
      data={categories.map((category) => ({ value: category, label: category }))}
      value={value}
      onChange={(_value, option) => onChange(option.value)}
      required
    />
  );
};
