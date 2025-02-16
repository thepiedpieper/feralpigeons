// EventForm.js
import React, { useState } from 'react';

const EventForm = ({ addEvent }) => {
  const [title, setTitle] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [desc, setDesc] = useState('');
  const [category, setCategory] = useState('planner'); // 'planner' or 'routine'

  const handleSubmit = (e) => {
    e.preventDefault();
    // Create a new event object. Using Date.now() for a unique id.
    const newEvent = {
      id: Date.now(),
      title,
      start: new Date(start),
      end: new Date(end),
      desc,
      category, // differentiate planner vs routine
      status: 'todo', // default status for Kanban board grouping
      color: category === 'routine' ? '#f39c12' : '#3788d8',
    };
    addEvent(newEvent);
    // Reset form fields
    setTitle('');
    setStart('');
    setEnd('');
    setDesc('');
    setCategory('planner');
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        placeholder="Start Time"
        type="datetime-local"
        value={start}
        onChange={(e) => setStart(e.target.value)}
        required
      />
      <input
        placeholder="End Time"
        type="datetime-local"
        value={end}
        onChange={(e) => setEnd(e.target.value)}
        required
      />
      <input
        placeholder="Description"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
      />
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="planner">Planner</option>
        <option value="routine">Routine</option>
      </select>
      <button type="submit">Add Event</button>
    </form>
  );
};

export default EventForm;
