import React, { useState, useEffect } from 'react';

const UserCursors = ({ socket, canvasRef }) => {
  const [cursors, setCursors] = useState({});
  const [scale, setScale] = useState({ scaleX: 1, scaleY: 1 });

  useEffect(() => {
    if (!socket || !canvasRef.current) return;

    const canvas = canvasRef.current;
    if (canvas && typeof canvas.getBoundingClientRect === 'function') {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      setScale({ scaleX, scaleY });
    }

    const handleCursorMove = ({ userId, position }) => {
      setCursors((prev) => ({
        ...prev,
        [userId]: position,
      }));
    };

    socket.on('cursor-move', handleCursorMove);

    return () => {
      socket.off('cursor-move', handleCursorMove);
    };
  }, [socket, canvasRef]);

  return (
    <div className="cursors-container">
      {Object.entries(cursors).map(([userId, position]) => (
        <div
          key={userId}
          className="user-cursor"
          style={{
            left: `${position.x / scale.scaleX}px`,
            top: `${position.y / scale.scaleY}px`,
            position: 'absolute',
            pointerEvents: 'none',
          }}
        >
          <div className="cursor" />
        </div>
      ))}
    </div>
  );
};

export default UserCursors;
