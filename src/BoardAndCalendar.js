import React, { useState, useEffect } from 'react';
import MyCalendar from './MyCalendar';
import KanbanBoard from './KanbanBoard';
import Dashboard from './Dashboard';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Split from 'react-split';

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

const parseEvents = (events) =>
  events.map(event => ({
    ...event,
    start: new Date(event.start),
    end: new Date(event.end),
  }));

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

  // Function to update a specific card/event
  const updateCard = (cardId, updates) => {
    const updatedEvents = events.map(e => e.id === cardId ? { ...e, ...updates } : e);
    setEvents(updatedEvents);
  };

  // Function to delete an event
  const handleDeleteEvent = (eventId) => {
    const updatedEvents = events.filter(e => e.id !== eventId);
    setEvents(updatedEvents);
  };

  const handleDropOnCalendar = (item, dropDate) => {
    if (!item.isTask) {
      const updatedEvents = events.map((e) =>
        e.id === (item.card ? item.card.id : item.id)
          ? { ...e, start: dropDate, end: new Date(dropDate.getTime() + 60 * 60 * 1000), status: 'inCalendar' }
          : e
      );
      setEvents(updatedEvents);
    } else {
      const newEvent = {
        id: Date.now(),
        title: item.text,
        start: dropDate,
        end: new Date(dropDate.getTime() + 60 * 60 * 1000),
        color: '#ff7f50',
        desc: '',
        status: 'inCalendar',
        category: 'planner',
      };
      setEvents([...events, newEvent]);
      // Optionally remove the task from its originating card
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

  const handleSelectSlot = (slotInfo) => {
    const newEvent = {
      id: Date.now(),
      title: 'New Event',
      start: slotInfo.start,
      end: slotInfo.end,
      color: '#3788d8',
      desc: 'Created via selection',
      status: 'todo',
      category: 'planner',
    };
    setEvents([...events, newEvent]);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ height: '100vh' }}>
        <Dashboard events={events} onDeleteEvent={handleDeleteEvent} />
        <Split
          split="vertical" 
          minSize={300} 
          defaultSize="50%"
          style={{ height: 'calc(100vh - 150px)' }}
        >
          <div style={{ padding: '1rem', overflow: 'auto' }}>
            <MyCalendar
              events={events}
              setEvents={setEvents}
              onDropOnCalendar={handleDropOnCalendar}
              onEventDrop={handleEventDrop}
              onEventResize={handleEventResize}
              onSelectSlot={handleSelectSlot}
              onDeleteEvent={handleDeleteEvent}  // Pass deletion handler to calendar events
            />
          </div>
          <div style={{ padding: '1rem', overflow: 'auto' }}>
            <KanbanBoard 
              events={events} 
              setEvents={setEvents} 
              updateCard={updateCard}
              onDeleteEvent={handleDeleteEvent}  // Pass deletion handler to Kanban board cards
            />
          </div>
        </Split>
      </div>
    </DndProvider>
  );
};

export default BoardAndCalendar;
