// components/eventList/EventList.tsx
import React from 'react';
import * as styled from './style';

interface EventItem {
  id: number;
  eventName: string;
  date: string;
  numberOfGuests?: number;
  note?: string;
  givenBy?: string; // Add this line
}

interface EventListProps {
  events: EventItem[];
}

const EventList: React.FC<EventListProps> = ({ events }) => {
  if (!events || events.length === 0) return null;

  return (
    <styled.Container>
      <styled.Heading>Existing Events</styled.Heading>
      <styled.List>
        {events.map((event) => (
          <styled.ListItem key={event.id}>
            <strong>{event.eventName}</strong> —{' '}
            {new Date(event.date).toLocaleDateString()} (Guests: {event.numberOfGuests ?? 0})
            {event.note && (
              <>
                <br />
                <span style={{ color: "#aaa" }}>Note: {event.note}</span>
              </>
            )}
            {event.givenBy && (
              <>
                <br />
                <span style={{ color: "#aaa" }}>Given by: {event.givenBy}</span>
              </>
            )}
          </styled.ListItem>
        ))}
      </styled.List>
    </styled.Container>
  );
};

export default EventList;
