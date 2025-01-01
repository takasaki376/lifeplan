'use client';

import { FC } from 'react';
import { Paper, Timeline, Title } from '@mantine/core';
import { Event } from '@/src/types';

type EventTimelineProps = {
  events: Event[];
};

const EventTimeline: FC<EventTimelineProps> = ({ events }) => {
  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.date ?? '').getTime() - new Date(b.date ?? '').getTime()
  );

  return (
    <Paper shadow="sm" p="md">
      <Title order={2} mb="md">
        タイムライン
      </Title>
      <Timeline bulletSize={24} lineWidth={2} color="blue">
        {sortedEvents.map((event) => (
          <Timeline.Item key={event.id} title={event.title}>
            <div>{event.date ? event.date.toISOString().split('T')[0] : '不明'}</div>
            <div>費用: ¥{event.cost.toLocaleString()}</div>
          </Timeline.Item>
        ))}
      </Timeline>
    </Paper>
  );
};

export default EventTimeline;
