import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// Styled components for the dashboard
const DashboardContainer = styled.div`
  padding: 1rem;
  background: ${(props) => props.theme.background};
  color: ${(props) => props.theme.textColor};
  border-bottom: 1px solid ${(props) => props.theme.primaryColor};
  text-align: left;
`;

const EventList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const EventItem = styled.li`
  padding: 0.5rem 0;
  border-bottom: 1px solid #ccc;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
`;

const DeleteButton = styled.button`
  background: transparent;
  border: none;
  color: red;
  cursor: pointer;
  font-weight: bold;
`;

const DetailContainer = styled.div`
  padding: 1rem;
  border: 1px solid ${(props) => props.theme.primaryColor};
  border-radius: 4px;
  background: ${(props) => props.theme.eventBackground};
  margin-bottom: 1rem;
`;

const InputField = styled.input`
  width: 100%;
  padding: 0.5rem;
  margin: 0.5rem 0;
  box-sizing: border-box;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.5rem;
  margin: 0.5rem 0;
  box-sizing: border-box;
`;

const SaveButton = styled.button`
  margin-right: 1rem;
  padding: 0.5rem 1rem;
  background: ${(props) => props.theme.primaryColor};
  border: none;
  color: #fff;
  border-radius: 4px;
  cursor: pointer;
`;

const BackButton = styled.button`
  padding: 0.5rem 1rem;
  background: #ccc;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

function formatDateForInput(date) {
  const d = new Date(date);
  const pad = (n) => (n < 10 ? '0' + n : n);
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

const Dashboard = ({ events, onDeleteEvent, onUpdateEvent }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all'); // "all", "planner", "routine"
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Local state for editing details
  const [editedTitle, setEditedTitle] = useState('');
  const [editedStart, setEditedStart] = useState('');
  const [editedEnd, setEditedEnd] = useState('');
  const [editedDesc, setEditedDesc] = useState('');

  useEffect(() => {
    if (selectedEvent) {
      setEditedTitle(selectedEvent.title);
      setEditedStart(formatDateForInput(selectedEvent.start));
      setEditedEnd(formatDateForInput(selectedEvent.end));
      setEditedDesc(selectedEvent.desc || '');
    }
  }, [selectedEvent]);

  const filteredEvents = events.filter((event) => {
    const matchesQuery = event.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' ? true : event.category === filterCategory;
    return matchesQuery && matchesCategory;
  });

  const handleSave = () => {
    // Convert input values back to Date objects
    const updatedEvent = {
      ...selectedEvent,
      title: editedTitle,
      start: new Date(editedStart),
      end: new Date(editedEnd),
      desc: editedDesc,
    };
    onUpdateEvent(updatedEvent.id, updatedEvent);
    setSelectedEvent(updatedEvent);
  };

  if (selectedEvent) {
    return (
      <DashboardContainer>
        <h2>Event Details</h2>
        <DetailContainer>
          <div>
            <label>
              Title:
              <InputField
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              Start:
              <InputField
                type="datetime-local"
                value={editedStart}
                onChange={(e) => setEditedStart(e.target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              End:
              <InputField
                type="datetime-local"
                value={editedEnd}
                onChange={(e) => setEditedEnd(e.target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              Description:
              <TextArea
                rows="3"
                value={editedDesc}
                onChange={(e) => setEditedDesc(e.target.value)}
              />
            </label>
          </div>
          <div>
            <SaveButton onClick={handleSave}>Save</SaveButton>
            <DeleteButton onClick={() => {
              onDeleteEvent(selectedEvent.id);
              setSelectedEvent(null);
            }}>
              Delete Event
            </DeleteButton>
          </div>
        </DetailContainer>
        <BackButton onClick={() => setSelectedEvent(null)}>Back to List</BackButton>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <h2>Dashboard</h2>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}
        >
          <option value="all">All</option>
          <option value="planner">Planned</option>
          <option value="routine">Routine</option>
        </select>
      </div>
      <EventList>
        {filteredEvents.map((event) => (
          <EventItem key={event.id} onClick={() => setSelectedEvent(event)}>
            <span>
              {event.title} - {new Date(event.start).toLocaleString()}
            </span>
            <DeleteButton onClick={(e) => {
              e.stopPropagation(); // Prevent triggering the detail view
              onDeleteEvent(event.id);
            }}>
              X
            </DeleteButton>
          </EventItem>
        ))}
      </EventList>
    </DashboardContainer>
  );
};

export default Dashboard;
