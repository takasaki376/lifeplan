'use client';

import { FC, FormEvent, useState } from 'react';
import { IconX } from '@tabler/icons-react';
import {
  Button,
  Group,
  Notification,
  NumberInput,
  Paper,
  rem,
  TextInput,
  Title,
} from '@mantine/core';
import { MonthPickerInput } from '@mantine/dates';
import { Event } from '@/src/types';

type EventFormProps = {
  onAddEvent: (event: Event) => void;
};

const EventForm: FC<EventFormProps> = ({ onAddEvent }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState<Date | null>(null);
  const [cost, setCost] = useState<string | number>(0);
  const [alertMes, setAlertMes] = useState('');
  const xIcon = <IconX style={{ width: rem(20), height: rem(20) }} />;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title || !date) {
      setAlertMes('すべての必須項目を入力してください。');

      return;
    }
    const newEvent: Event = { title, date, cost: Number(cost) };

    onAddEvent(newEvent);
    setTitle('');
    setDate(null);
    setCost(0);
  };

  return (
    <Paper shadow="sm" p="md">
      <Title order={2} mb="md">
        イベントを追加
      </Title>
      <form onSubmit={handleSubmit}>
        <TextInput
          label="イベント名 *"
          placeholder="例: 結婚"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <MonthPickerInput
          label="年月"
          value={date}
          onChange={setDate}
          placeholder="例: 2000-01"
          valueFormat="YYYY-MM"
        />
        <NumberInput
          label="費用"
          placeholder="例: 1000000"
          value={cost}
          onChange={setCost}
          mt="sm"
        />
        <Group mt="md">
          <Button type="submit" color="blue">
            追加
          </Button>
        </Group>
        {alertMes && (
          <Notification
            icon={xIcon}
            color="red"
            title="入力エラー!"
            onClose={() => setAlertMes('')}
          >
            {alertMes}
          </Notification>
        )}
      </form>
    </Paper>
  );
};

export default EventForm;
