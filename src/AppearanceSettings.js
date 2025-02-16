// AppearanceSettings.js
import React, { useState } from 'react';
import styled from 'styled-components';
import { themes } from './theme';

const DropdownContainer = styled.div`
  position: fixed;
  right: 0;
  top: 20%;
  background: ${(props) => props.theme.background};
  padding: 1rem;
  border: 1px solid ${(props) => props.theme.primaryColor};
  border-radius: 4px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  z-index: 1000;
`;

const Label = styled.label`
  font-size: 1rem;
  margin-right: 0.5rem;
`;

const Select = styled.select`
  padding: 0.5rem;
  border: 1px solid ${(props) => props.theme.primaryColor};
  border-radius: 4px;
  background: ${(props) => props.theme.background};
  color: ${(props) => props.theme.textColor};
`;

const AppearanceSettings = ({ currentTheme, setTheme }) => {
  const [selectedTheme, setSelectedTheme] = useState(currentTheme.name);

  const handleChange = (e) => {
    const themeName = e.target.value;
    setSelectedTheme(themeName);
    // Update the app theme by looking up the chosen theme in our themes dictionary
    setTheme(themes[themeName]);
    localStorage.setItem('selectedTheme', themeName);
  };

  return (
    <DropdownContainer>
      <Label>Theme:</Label>
      <Select value={selectedTheme} onChange={handleChange}>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="minimalist">Minimalist</option>
        <option value="solaris">Solaris</option>
      </Select>
    </DropdownContainer>
  );
};

export default AppearanceSettings;
