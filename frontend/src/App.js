import React, { useState, useEffect, useRef } from 'react';
import { socket } from './utils/socket';
import './App.css';

const App = () => {
  const [yourID, setYourID] = useState('');
  // const [socket, setSocket] = useState(null);

  useEffect(() => {
    socket.emit('Hello There');
  }, []);

  return (
    <div className="App">
      <h1> Hello</h1>
    </div>
  );
};

export default App;
