// TimeSlotWrapper.js
import React from 'react';
import { useDrop } from 'react-dnd';

const TimeSlotWrapper = ({ children, value, onDropOnCalendar }) => {
  const [{ isOver }, drop] = useDrop({
    accept: 'EVENT',
    drop: (item) => {
      console.log("Dropped item:", item);
      // 'value' here is the date/time for this time slot
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

export default TimeSlotWrapper;
