const Room = require('../models/Room');
const { generateRoomId } = require('../utils/helpers');

exports.joinRoom = async (req, res) => {
  try {
    let { roomId } = req.body;

    if (!roomId) {
      roomId = generateRoomId();
    }

    let room = await Room.findOne({ roomId });
    if (!room) {
      room = new Room({ roomId });
      await room.save();
    }

    res.json({
      success: true,
      roomId: room.roomId,
      drawingData: room.drawingData,
    });
  } catch (err) {
    console.error('Error joining room:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getRoomInfo = async (req, res) => {
  try {
    const { roomId } = req.params;
    const room = await Room.findOne({ roomId });

    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    res.json({
      success: true,
      roomId: room.roomId,
      drawingData: room.drawingData,
    });
  } catch (err) {
    console.error('Error getting room info:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};