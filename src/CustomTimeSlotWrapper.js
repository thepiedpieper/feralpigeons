// CustomTimeSlotWrapper.js
import React from 'react';
import { useDrop } from 'react-dnd';
import { ItemTypes } from './constants';

const CustomTimeSlotWrapper = ({ children, value, onDropOnCalendar }) => {
  const [{ isOver }, drop] = useDrop({
    // Accept both types
    accept: [ItemTypes.EVENT, ItemTypes.TASK],
    drop: (item) => {
      // Determine if the dropped item is a TASK or an EVENT.
      // Here, if it’s a TASK, create a new event.
      if (item.type === ItemTypes.TASK) {
        onDropOnCalendar({ ...item, isTask: true }, value);
      } else {
        // If it's an event dragged from the board as a full card.
        onDropOnCalendar(item.card || item, value);
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

export default CustomTimeSlotWrapper;
