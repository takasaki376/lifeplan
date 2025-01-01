'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Grid, Title } from '@mantine/core';
import EventForm from '@/src/components/Event/EventForm';
import EventList from '@/src/components/Event/EventList';
import EventTimeline from '@/src/components/Event/EventTimeline';
import { useAuth } from '@/src/hooks/useAuth';
import { Event } from '@/src/types';

const EventsPage = () => {
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

  const [events, setEvents] = useState<Event[]>([]);

  const addEvent = (newEvent: Event) => {
    setEvents([...events, newEvent]);
  };

  const updateEvent = (updatedEvent: Event) => {
    setEvents(events.map((event) => (event.id === updatedEvent.id ? updatedEvent : event)));
  };

  const deleteEvent = (eventId: string) => {
    setEvents(events.filter((event) => event.id !== eventId));
  };

  return (
    <Container size="lg">
      <Title order={1} mb="lg">
        ライフイベント管理
      </Title>
      <Grid>
        <Grid.Col span={6}>
          <EventForm onAddEvent={addEvent} />
        </Grid.Col>
        <Grid.Col span={6}>
          <EventTimeline events={events} />
        </Grid.Col>
      </Grid>
      <EventList events={events} onUpdateEvent={updateEvent} onDeleteEvent={deleteEvent} />
    </Container>
  );
};

export default EventsPage;
