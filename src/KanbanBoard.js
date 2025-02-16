// KanbanBoard.js
import React, { useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import ChecklistItem from './ChecklistItem';
import styled from 'styled-components';


export const ItemTypes = {
  EVENT: 'EVENT', // Unified drag type for events/cards
  TASK: 'TASK',
};


const CardContainer = styled.div`
  padding: 1rem;
  margin: 0 0 1rem 0;
  background: ${(props) => props.theme.eventBackground || '#fff'};
  border: 1px solid ${(props) => props.theme.secondaryColor};
  border-radius: 4px;
  cursor: move;
  position: relative;
  opacity: ${(props) => (props.isDragging ? 0.5 : 1)};
  color: ${(props) => props.theme.textColor};
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  background: transparent;
  border: none;
  color: red;
  font-weight: bold;
  cursor: pointer;
`;



const KanbanCard = ({ card, index, moveCard, updateCard, onDeleteEvent }) => {
  // Setup drag hook
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.EVENT,
    item: { id: card.id, index, column: card.status, card },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // Setup drop hook for reordering within the column
  const [, drop] = useDrop({
    accept: ItemTypes.EVENT,
    hover(item, monitor) {
      if (item.id === card.id) return;
      // Reorder within the same column if applicable
      if (item.column === card.status && item.index !== index) {
        moveCard(item, index);
        item.index = index;
      }
    },
  });

  // Local state for new checklist items
  const [newChecklistItem, setNewChecklistItem] = useState('');

  const addChecklistItem = () => {
    if (!newChecklistItem.trim()) return;
    const updatedChecklist = card.checklist ? [...card.checklist] : [];
    updatedChecklist.push({ id: Date.now(), text: newChecklistItem, completed: false });
    updateCard(card.id, { checklist: updatedChecklist });
    setNewChecklistItem('');
  };

  const toggleChecklistItem = (itemId) => {
    const updatedChecklist = card.checklist.map((item) =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );
    updateCard(card.id, { checklist: updatedChecklist });
  };

  // For logging time manually
  const [timeLog, setTimeLog] = useState('');
  const handleAddTimeLog = () => {
    const newLog = parseInt(timeLog, 10);
    if (!isNaN(newLog)) {
      // We'll store logged time as the total minutes on the card.
      const updatedTime = (card.loggedTime || 0) + newLog;
      updateCard(card.id, { loggedTime: updatedTime });
      setTimeLog('');
    }
  };

  return (
    <div
      ref={(node) => drag(drop(node))}
      style={{
        position: 'relative', // Needed for absolutely positioned delete button
        opacity: isDragging ? 0.5 : 1,
        padding: '1rem',
        margin: '0 0 1rem 0',
        background: '#fff',
        border: '1px solid #ccc',
        cursor: 'move',
      }}
    >
      <div style={{ fontWeight: 'bold' }}>{card.title}</div>
      
      {/* Delete Button */}
      <button
        onClick={() => onDeleteEvent(card.id)}
        style={{
          position: 'absolute',
          top: '5px',
          right: '5px',
          background: 'transparent',
          border: 'none',
          color: 'red',
          fontWeight: 'bold',
          cursor: 'pointer',
        }}
      >
        X
      </button>
      
      {/* Render checklist items */}
      {card.checklist && card.checklist.length > 0 && (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {card.checklist.map((item) => (
            <ChecklistItem
              key={item.id}
              item={item}
              cardId={card.id}
              updateCard={updateCard}
              cardChecklist={card.checklist}
            />
          ))}
        </ul>
      )}

      {/* Section for logging time manually */}
      <div style={{ marginTop: '0.5rem' }}>
        <input
          type="number"
          placeholder="Log time (minutes)"
          value={timeLog}
          onChange={(e) => setTimeLog(e.target.value)}
          style={{ width: '120px' }}
        />
        <button onClick={handleAddTimeLog} style={{ marginLeft: '0.5rem' }}>
          Log Time
        </button>
        {card.loggedTime && (
          <div style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
            Total logged time: {card.loggedTime} minutes
          </div>
        )}
      </div>
    </div>
  );
};

const KanbanColumn = ({ column, cards, addCard, moveCard, moveCardToColumn, updateCard, onDeleteEvent }) => {
  const [newCardTitle, setNewCardTitle] = useState('');

  const handleAddCard = () => {
    if (newCardTitle.trim() !== '') {
      addCard(column, newCardTitle);
      setNewCardTitle('');
    }
  };

  return (
    <div style={{ background: '#f0f0f0', padding: '1rem', width: '300px', minHeight: '400px' }}>
      <h3>{column.toUpperCase()}</h3>
      {cards.map((card, index) => (
        <KanbanCard
          key={card.id}
          card={card}
          index={index}
          moveCard={moveCard}
          updateCard={updateCard}
          onDeleteEvent={onDeleteEvent}  // Pass it down here
        />
      ))}
      <input
        type="text"
        placeholder="Add new card"
        value={newCardTitle}
        onChange={(e) => setNewCardTitle(e.target.value)}
      />
      <button onClick={handleAddCard}>Add Card</button>
    </div>
  );
};
const KanbanBoard = ({ events, setEvents, updateCard, onDeleteEvent }) => {
  const columns = ['Academics', 'Research', 'Hobbies', 'Recurring'];

  // Functions to add/move cards (addCard, moveCard, moveCardToColumn) should be defined here.
  const addCard = (column, title) => {
    const newCard = {
      id: Date.now(),
      title,
      start: new Date(),
      end: new Date(new Date().getTime() + 60 * 60 * 1000),
      color: '#3788d8',
      desc: '',
      status: column,
      category: 'planner',
      checklist: [],
    };
    setEvents([...events, newCard]);
  };

  const moveCard = (item, newIndex) => {
    const columnCards = events.filter((e) => e.status === item.column);
    const cardToMove = columnCards.find((e) => e.id === item.id);
    if (!cardToMove) return;
    const newColumnCards = columnCards.filter((e) => e.id !== item.id);
    newColumnCards.splice(newIndex, 0, cardToMove);
    const updatedEvents = events.filter((e) => e.status !== item.column).concat(newColumnCards);
    setEvents(updatedEvents);
  };

  const moveCardToColumn = (item, newColumn) => {
    const updatedEvents = events.map((e) =>
      e.id === item.id ? { ...e, status: newColumn } : e
    );
    setEvents(updatedEvents);
  };

  return (
    <div style={{ display: 'flex', gap: '1rem' }}>
      {columns.map((col) => (
        <KanbanColumn
          key={col}
          column={col}
          cards={events.filter((e) => e.status === col)}
          addCard={addCard}
          moveCard={moveCard}
          moveCardToColumn={moveCardToColumn}
          updateCard={updateCard}
          onDeleteEvent={onDeleteEvent}  // Pass the deletion handler
        />
      ))}
    </div>
  );
};

export default KanbanBoard;
