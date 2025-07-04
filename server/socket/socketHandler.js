const Room = require('../models/Room');

module.exports = (io, socket) => {
  const { roomId } = socket.handshake.query;
  let currentRoom = null;

  const joinRoom = async () => {
    if (!roomId) return;

    try {
      currentRoom = await Room.findOne({ roomId });
      if (!currentRoom) {
        currentRoom = new Room({ roomId });
        await currentRoom.save();
      }

      socket.join(roomId);
      socket.emit('room-joined', { 
        roomId, 
        drawingData: currentRoom.drawingData 
      });

      updateUserCount();
    } catch (err) {
      console.error('Error joining room:', err);
    }
  };

  const updateUserCount = () => {
    const userCount = io.sockets.adapter.rooms.get(roomId)?.size || 0;
    io.to(roomId).emit('user-count', { count: userCount });
  };

  const handleDrawStart = (data) => {
    socket.to(roomId).emit('draw-start', data);
  };

  const handleDrawMove = (data) => {
    socket.to(roomId).emit('draw-move', data);
  };

  const handleDrawEnd = async (data) => {
    try {
      if (currentRoom) {
        currentRoom.drawingData.push({
          type: 'stroke',
          data,
        });
        currentRoom.lastActivity = new Date();
        await currentRoom.save();
      }
      socket.to(roomId).emit('draw-end', data);
    } catch (err) {
      console.error('Error saving drawing:', err);
    }
  };

  const handleClearCanvas = async () => {
    try {
      if (currentRoom) {
        currentRoom.drawingData.push({
          type: 'clear',
          data: {},
        });
        currentRoom.lastActivity = new Date();
        await currentRoom.save();
      }
      socket.to(roomId).emit('clear-canvas');
    } catch (err) {
      console.error('Error clearing canvas:', err);
    }
  };

  const handleCursorMove = (position) => {
    socket.to(roomId).emit('cursor-move', {
      userId: socket.id,
      position,
    });
  };

  const leaveRoom = async () => {
    if (roomId) {
      socket.leave(roomId);
      updateUserCount();
    }
  };

  // Register event handlers
  socket.on('join-room', joinRoom);
  socket.on('draw-start', handleDrawStart);
  socket.on('draw-move', handleDrawMove);
  socket.on('draw-end', handleDrawEnd);
  socket.on('clear-canvas', handleClearCanvas);
  socket.on('cursor-move', handleCursorMove);
  socket.on('disconnect', leaveRoom);
};