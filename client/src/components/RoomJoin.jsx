import React, { useState } from 'react';
import { useSocket } from '../context/SocketContext';

const RoomJoin = ({ onJoinRoom }) => {
  const [roomId, setRoomId] = useState('');
  const [error, setError] = useState('');
  const socket = useSocket();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!roomId.trim()) {
      setError('Please enter a room code');
      return;
    }

    socket.emit('join-room', roomId);
    onJoinRoom(roomId);
  };

  return (
    <div className="room-join">
      <h1>Collaborative Whiteboard</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          placeholder="Enter room code"
          maxLength="8"
        />
        <button type="submit">Join Room</button>
        {error && <p className="error">{error}</p>}
      </form>
      <p>Or leave empty to create a new room</p>
    </div>
  );
};

export default RoomJoin;