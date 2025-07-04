const mongoose = require('mongoose');

const drawingCommandSchema = new mongoose.Schema({
  type: { type: String, required: true, enum: ['stroke', 'clear'] },
  data: { type: Object, required: true },
  timestamp: { type: Date, default: Date.now },
});

const roomSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  lastActivity: { type: Date, default: Date.now },
  drawingData: [drawingCommandSchema],
});

// Cleanup old rooms (inactive for 24+ hours)
roomSchema.statics.cleanupOldRooms = async function() {
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
  await this.deleteMany({ lastActivity: { $lt: cutoff } });
  console.log(`Cleaned up rooms inactive before ${cutoff}`);
};

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;