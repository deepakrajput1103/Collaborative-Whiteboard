import React, { useState } from 'react';
import RoomJoin from './components/RoomJoin';
import Whiteboard from './components/Whiteboard';
import { SocketProvider } from './context/SocketContext';
import './styles.css';

function App() {
  const [roomId, setRoomId] = useState(null);

  const handleJoinRoom = (roomId) => {
    setRoomId(roomId);
  };

  return (
    <SocketProvider>
      <div className="app">
        {!roomId ? (
          <RoomJoin onJoinRoom={handleJoinRoom} />
        ) : (
          <Whiteboard roomId={roomId} />
        )}
      </div>
    </SocketProvider>
  );
}

export default App;