// MyCalendar.js
import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import styled from 'styled-components';

// Drag-and-drop support from react-big-calendar
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
// We'll use react-dnd for our custom drop target:
import { useDrop } from 'react-dnd';
const localizer = momentLocalizer(moment)
// --- CUSTOMIZATION OPTIONS ---

// 1. Custom Event Styling
const eventStyleGetter = (event, start, end, isSelected) => {
  const style = {
    backgroundColor: event.color || (props => props.theme.primaryColor),
    borderRadius: '4px',
    opacity: 0.8,
    color: 'white',
    border: 'none',
    display: 'block'
  };
  return { style };
};

const EventContainer = styled.div`
  position: relative;
  padding: 0.5rem;
  cursor: pointer;
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 2px;
  right: 2px;
  background: transparent;
  border: none;
  color: red;
  font-weight: bold;
  cursor: pointer;
`;

const CustomEvent = ({ event, onDeleteEvent }) => {
  return (
    <EventContainer>
      <div>{event.title}</div>
      <DeleteButton onClick={(e) => { e.stopPropagation(); onDeleteEvent(event.id); }}>
        X
      </DeleteButton>
    </EventContainer>
  );
};



// 3. Custom Toolbar Component

const ToolbarContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem;
  background-color: ${(props) => props.theme.primaryColor};
  color: #fff;
`;

const ToolbarButton = styled.button`
  background: none;
  border: none;
  color: #fff;
  font-size: 1rem;
  margin: 0 0.5rem;
  cursor: pointer;
`;

const CustomToolbar = (toolbar) => {
  const goToBack = () => toolbar.onNavigate('PREV');
  const goToNext = () => toolbar.onNavigate('NEXT');
  const label = () => {
    const date = toolbar.date;
    return `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
  };

  return (
    <ToolbarContainer>
      <ToolbarButton onClick={goToBack}>Back</ToolbarButton>
      <span>{label()}</span>
      <ToolbarButton onClick={goToNext}>Next</ToolbarButton>
    </ToolbarContainer>
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
  onEventDrop,
  onEventResize,
  onSelectSlot,
  onDeleteEvent,
  onDropOnCalendar, // for external drops if needed
}) => {
  return (
    <div style={{ height: '800px' }}>
      <DragAndDropCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        defaultView="week"
        selectable
        resizable
        onEventDrop={onEventDrop}       // Handler for moving events
        onEventResize={onEventResize}   // Handler for resizing events
        onSelectSlot={onSelectSlot}     // Handler for adding events by slot selection
        eventPropGetter={eventStyleGetter}
        components={{
          toolbar: CustomToolbar,
          event: (props) => (
            // Wrap your custom event to include a delete button, etc.
            <div style={{ position: 'relative', paddingRight: '20px' }}>
              <span>{props.event.title}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteEvent(props.event.id);
                }}
                style={{
                  position: 'absolute',
                  top: '2px',
                  right: '2px',
                  border: 'none',
                  background: 'transparent',
                  color: 'red',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                }}
              >
                X
              </button>
            </div>
          ),
          timeSlotWrapper: (props) => (
            <CustomTimeSlotWrapper {...props} onDropOnCalendar={onDropOnCalendar} />
          ),
        }}
        formats={formats}
        messages={messages}
        dayPropGetter={dayPropGetter}
      />
    </div>
  );
};

export default MyCalendar;
