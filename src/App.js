// App.js
import React from 'react';
import logo from './logo.svg';
import './App.css';
import BoardAndCalendar from './BoardAndCalendar';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Welcome to My Calendar App</h1>
      </header>
      <main>
        <BoardAndCalendar />
      </main>
    </div>
  );
}

export default App;
