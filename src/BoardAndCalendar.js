// BoardAndCalendar.js
import React, { useState, useEffect } from 'react';
import MyCalendar from './MyCalendar';
import KanbanBoard from './KanbanBoard';
import EventForm from './EventForm';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const initialEvents = [
  {
    id: 1,
    title: 'Test Meeting',
    start: new Date(),
    end: new Date(new Date().getTime() + 60 * 60 * 1000),
    color: '#3788d8',
    desc: 'Discuss project updates',
    status: 'todo',
    category: 'planner',
  },
];

// Helper: Convert stored date strings back to Date objects.
const parseEvents = (events) => {
  return events.map((event) => ({
    ...event,
    start: new Date(event.start),
    end: new Date(event.end),
  }));
};

const BoardAndCalendar = () => {
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('myEvents');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parseEvents(parsed);
      } catch (e) {
        console.error('Error parsing events from localStorage', e);
        return initialEvents;
      }
    }
    return initialEvents;
  });

  useEffect(() => {
    localStorage.setItem('myEvents', JSON.stringify(events));
  }, [events]);

  const addEvent = (newEvent) => {
    setEvents([...events, newEvent]);
  };

  const handleDropOnCalendar = (item, dropDate) => {
    if (item.isTask) {
      // Create a new event from the checklist task
      const newEvent = {
        id: Date.now(),
        title: item.text, // use the checklist item's text as the event title
        start: dropDate,
        end: new Date(dropDate.getTime() + 60 * 60 * 1000), // e.g., a default 1-hour block
        color: '#ff7f50',
        desc: '',
        status: 'inCalendar',
        category: 'planner',
      };
      setEvents([...events, newEvent]);
      // Optionally: Remove the checklist item from the originating card.
      // You can use updateCard here to remove that item from its card.
    } else {
      // Handle as before if it’s a full event being moved.
      const updatedEvents = events.map((e) =>
        e.id === (item.card ? item.card.id : item.id)
          ? { ...e, start: dropDate, end: new Date(dropDate.getTime() + 60 * 60 * 1000), status: 'inCalendar' }
          : e
      );
      setEvents(updatedEvents);
    }
  };

  const handleEventDrop = ({ event, start, end, allDay }) => {
    const updatedEvents = events.map((e) =>
      e.id === event.id ? { ...e, start, end, allDay } : e
    );
    setEvents(updatedEvents);
  };

  const handleEventResize = ({ event, start, end }) => {
    const updatedEvents = events.map((e) =>
      e.id === event.id ? { ...e, start, end } : e
    );
    setEvents(updatedEvents);
  };

  const updateCard = (cardId, updates) => {
    const updatedEvents = events.map(e =>
      e.id === cardId ? { ...e, ...updates } : e
    );
    setEvents(updatedEvents);
  };
  
  const handleSelectSlot = (slotInfo) => {
    const newEvent = {
      id: Date.now(),
      title: 'New Event',
      start: slotInfo.start,
      end: slotInfo.end,
      color: '#3788d8',
      desc: 'Created via selection',
      status: 'inCalendar',
      category: 'planner',
    };
    setEvents([...events, newEvent]);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ padding: '1rem' }}>
        <h2>Add a New Event</h2>
        <EventForm addEvent={addEvent} />
      </div>
      <div style={{ display: 'flex', gap: '2rem' }}>
        <div style={{ flex: 1 }}>
          <MyCalendar
            events={events}
            setEvents={setEvents}
            onDropOnCalendar={handleDropOnCalendar}
            onEventDrop={handleEventDrop}
            onEventResize={handleEventResize}
            onSelectSlot={handleSelectSlot}
          />
        </div>
        <div style={{ flex: 1 }}>
          <KanbanBoard events={events} setEvents={setEvents} updateCard={updateCard}  />
        </div>
      </div>
    </DndProvider>
  );
};


export default BoardAndCalendar;
