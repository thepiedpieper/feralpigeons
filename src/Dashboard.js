// Dashboard.js
import React from 'react';
import styled from 'styled-components';

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
`;

const DeleteButton = styled.button`
  background: transparent;
  border: none;
  color: red;
  cursor: pointer;
  font-weight: bold;
`;

const Dashboard = ({ events, onDeleteEvent }) => {
  return (
    <DashboardContainer>
      <h2>Dashboard</h2>
      <EventList>
        {events.map((event) => (
          <EventItem key={event.id}>
            <span>
              {event.title} - {new Date(event.start).toLocaleString()}
            </span>
            <DeleteButton onClick={() => onDeleteEvent(event.id)}>X</DeleteButton>
          </EventItem>
        ))}
      </EventList>
    </DashboardContainer>
  );
};

export default Dashboard;
