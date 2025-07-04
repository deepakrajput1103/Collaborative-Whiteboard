const express = require('express');
const router = express.Router();
const Room = require('../models/Room');

router.post('/join', async (req, res) => {
  const { roomId } = req.body;
  let room = await Room.findOne({ roomId });
  if (!room) {
    room = new Room({ roomId });
    await room.save();
  }
  res.status(200).json(room);
});

router.get('/:roomId', async (req, res) => {
  const room = await Room.findOne({ roomId: req.params.roomId });
  if (room) {
    res.status(200).json(room);
  } else {
    res.status(404).json({ message: 'Room not found' });
  }
});

module.exports = router;
