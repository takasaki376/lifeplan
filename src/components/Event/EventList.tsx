'use client';

import { FC } from 'react';
import { Button, Group, Paper, Stack, Text, Title } from '@mantine/core';
import { Event } from '@/src/types';

type EventListProps = {
  events: Event[];
  onUpdateEvent: (event: Event) => void;
  onDeleteEvent: (eventId: string) => void;
};

const EventList: FC<EventListProps> = ({ events, onUpdateEvent, onDeleteEvent }) => {
  return (
    <Paper shadow="sm" p="md" mt="lg">
      <Title order={2} mb="md">
        イベント一覧
      </Title>
      <Stack>
        {events.map((event) => (
          <Paper shadow="xs" p="sm" key={event.id}>
            <Text>
              <strong>名前:</strong> {event.title}
            </Text>
            <Text>
              <strong>日付:</strong> {event.date ? event.date.toISOString().split('T')[0] : '不明'}
            </Text>
            <Text>
              <strong>費用:</strong> ¥{event.cost.toLocaleString()}
            </Text>
            <Group mt="sm">
              <Button variant="outline" color="blue" onClick={() => onUpdateEvent(event)}>
                編集
              </Button>
              <Button variant="outline" color="red" onClick={() => onDeleteEvent(event.id || '')}>
                削除
              </Button>
            </Group>
          </Paper>
        ))}
      </Stack>
    </Paper>
  );
};

export default EventList;
