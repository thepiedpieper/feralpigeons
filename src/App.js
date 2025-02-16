// App.js
import React, { useState, useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import GlobalStyle from './GlobalStyle';
import { themes } from './theme';
import AppearanceSettings from './AppearanceSettings';
import BoardAndCalendar from './BoardAndCalendar';
import GoogleCalendarIntegration from './GoogleCalendarIntegration';
import './App.css';
import logo from './birdo.gif'; // Replace this with your actual logo file
import Dashboard from './Dashboard';

function App() {
  const defaultTheme = themes.light;
  const [theme, setTheme] = useState(defaultTheme);

  useEffect(() => {
    const savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme && themes[savedTheme]) {
      setTheme(themes[savedTheme]);
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <>
        <GlobalStyle />
        <div className="App">
          <header className="App-header">
            <div className="logo">
              <img src={logo} alt="Logo" />
              <h1>feralpigeons</h1>
            </div>
            {/* The AppearanceSettings dropdown can either be inside the header or positioned as desired */}
            <AppearanceSettings currentTheme={theme} setTheme={setTheme} />
          </header>
          <main>
            <BoardAndCalendar />
            <div style={{
              position: 'fixed', 
              bottom: '20px', 
              right: '20px', 
              background: '#fff', 
              padding: '1rem', 
              border: '1px solid #ccc', 
              borderRadius: '4px', 
              zIndex: 1000
            }}>
            <GoogleCalendarIntegration />
            </div>
          </main>
        </div>
      </>
    </ThemeProvider>
  );
}

export default App;
