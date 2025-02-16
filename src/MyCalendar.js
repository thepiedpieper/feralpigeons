// MyCalendar.js
import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Drag-and-drop support from react-big-calendar
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
// We'll use react-dnd for our custom drop target:
import { useDrop } from 'react-dnd';

// --- CUSTOMIZATION OPTIONS ---

// 1. Custom Event Styling
const eventStyleGetter = (event, start, end, isSelected) => {
  const backgroundColor = event.color || '#3174ad';
  const style = {
    backgroundColor,
    borderRadius: '4px',
    opacity: 0.8,
    color: 'white',
    border: 'none',
    display: 'block',
  };
  return { style };
};

// 2. Custom Event Rendering
const CustomEvent = ({ event }) => (
  <span>
    <strong>{event.title}</strong>
    {event.desc ? `: ${event.desc}` : ''}
  </span>
);

// 3. Custom Toolbar Component
const CustomToolbar = (toolbar) => {
  const goToBack = () => toolbar.onNavigate('PREV');
  const goToNext = () => toolbar.onNavigate('NEXT');
  const label = () => {
    const date = toolbar.date;
    return (
      <span>
        {date.toLocaleString('default', { month: 'long' })} {date.getFullYear()}
      </span>
    );
  };

  return (
    <div className="rbc-toolbar" style={{ marginBottom: '1rem' }}>
      <button onClick={goToBack}>Back</button>
      <span style={{ margin: '0 1rem' }}>{label()}</span>
      <button onClick={goToNext}>Next</button>
    </div>
  );
};

// 4. Custom Formats for Date/Time Display
const formats = {
  timeGutterFormat: (date, culture, localizer) =>
    localizer.format(date, 'HH:mm', culture),
  eventTimeRangeFormat: ({ start, end }, culture, localizer) =>
    `${localizer.format(start, 'HH:mm', culture)} - ${localizer.format(end, 'HH:mm', culture)}`,
};

// 5. Custom Messages/Text
const messages = {
  allDay: 'All Day',
  previous: '<',
  next: '>',
  today: 'Today',
  month: 'Month',
  week: 'Week',
  day: 'Day',
  agenda: 'Agenda',
  date: 'Date',
  time: 'Time',
  event: 'Event',
};

// 6. Custom Day Styling (for example, weekends)
const dayPropGetter = (date) => {
  const day = date.getDay();
  if (day === 0 || day === 6) {
    return { style: { backgroundColor: '#f8f8f8' } };
  }
  return {};
};

// 7. Custom Time Slot Wrapper (Drop Target)
// This component wraps each time slot so external drags (e.g., from a Kanban board)
// can be dropped onto a specific time slot.
const CustomTimeSlotWrapper = ({ children, value, onDropOnCalendar }) => {
  const [{ isOver }, drop] = useDrop({
    accept: 'EVENT', // Ensure this type matches the one used in your Kanban board
    drop: (item) => {
      if (onDropOnCalendar) {
        onDropOnCalendar(item.event, value);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div ref={drop} style={{ backgroundColor: isOver ? '#e0ffe0' : 'inherit' }}>
      {children}
    </div>
  );
};

// 8. Wrap Calendar with Drag and Drop from react-big-calendar
const DragAndDropCalendar = withDragAndDrop(Calendar);

// --- INTEGRATED CALENDAR COMPONENT ---
const MyCalendar = ({
  events,
  setEvents,
  onDropOnCalendar,
  onEventDrop,
  onEventResize,
  onSelectSlot,
}) => {
  const localizer = momentLocalizer(moment);

  return (
    <div style={{ height: '800px' }}>
      <DragAndDropCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        defaultView="week"
        selectable
        onSelectSlot={onSelectSlot} // For creating new events via selection
        onEventDrop={onEventDrop}   // Handle internal drag-and-drop updates
        resizable
        onEventResize={onEventResize} // Handle event resizing
        eventPropGetter={eventStyleGetter}
        components={{
          event: CustomEvent,
          toolbar: CustomToolbar,
          // Use our custom timeSlotWrapper to enable external drops
          timeSlotWrapper: (props) => (
            <CustomTimeSlotWrapper {...props} onDropOnCalendar={onDropOnCalendar} />
          ),
        }}
        formats={formats}
        messages={messages}
        dayPropGetter={dayPropGetter}
        views={['month', 'week', 'day', 'agenda']}
      />
    </div>
  );
};

export default MyCalendar;
