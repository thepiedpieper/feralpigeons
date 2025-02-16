// ChecklistItem.js
import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import { ItemTypes } from './KanbanBoard';

const ChecklistItem = ({ item, cardId, updateCard, cardChecklist }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.TASK, // TASK type for checklist items
    item: { type: ItemTypes.TASK, ...item, cardId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // Use local state to manage time inputs.
  const [startTime, setStartTime] = useState(item.startTime || '');
  const [endTime, setEndTime] = useState(item.endTime || '');

  // When times are updated, propagate the changes to the parent card.
  const handleUpdateTimes = () => {
    // Create a new checklist array with the updated times for this item.
    const updatedChecklist = cardChecklist.map(ci =>
      ci.id === item.id ? { ...ci, startTime, endTime } : ci
    );
    updateCard(cardId, { checklist: updatedChecklist });
  };

  return (
    <li ref={drag} style={{ opacity: isDragging ? 0.5 : 1, cursor: 'move', marginBottom: '0.5rem' }}>
      <div>{item.text}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <label>
          Start:
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </label>
        <label>
          End:
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </label>
        <button onClick={handleUpdateTimes}>Set Times</button>
      </div>
    </li>
  );
};

export default ChecklistItem;
