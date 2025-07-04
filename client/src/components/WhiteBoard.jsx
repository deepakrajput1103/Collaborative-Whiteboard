import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../context/SocketContext';
import DrawingCanvas from './DrawingCanvas';
import Toolbar from './Toolbar';
import UserCursors from './UserCursors';
import useDrawing from '../hooks/useDrawing'; // ← Add this line

const Whiteboard = ({ roomId }) => {
  const socket = useSocket();
  const [userCount, setUserCount] = useState(1);
  const [drawingData, setDrawingData] = useState([]);
  const canvasRef = useRef(null);

  const {
    startDrawing,
    draw,
    endDrawing,
    clearCanvas,
    replayDrawing,
    setColor,
    setLineWidth,
  } = useDrawing(canvasRef, socket, roomId);

  useEffect(() => {
    if (!socket) return;

    const handleUserCount = ({ count }) => setUserCount(count);
    const handleInitialData = ({ drawingData }) => setDrawingData(drawingData || []);

    socket.emit('join-room', roomId);
    socket.on('user-count', handleUserCount);
    socket.on('room-joined', handleInitialData);

    return () => {
      socket.off('user-count', handleUserCount);
      socket.off('room-joined', handleInitialData);
    };
  }, [socket, roomId]);

  useEffect(() => {
    if (drawingData.length > 0) {
      replayDrawing(drawingData);
    }
  }, [drawingData, replayDrawing]);

  return (
    <div className="whiteboard-container">
      <div className="whiteboard-header">
        <h2>Room: {roomId}</h2>
        <p>Users online: {userCount}</p>
      </div>
      <Toolbar
        setColor={setColor}
        setLineWidth={setLineWidth}
        clearCanvas={clearCanvas}
      />
      <div className="canvas-wrapper">
        <canvas
          ref={canvasRef}
          width={window.innerWidth * 0.8}
          height={window.innerHeight * 0.7}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={endDrawing}
          onMouseLeave={endDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={endDrawing}
        />
        <UserCursors socket={socket} canvasRef={canvasRef} />
      </div>
    </div>
  );
};

export default Whiteboard;
