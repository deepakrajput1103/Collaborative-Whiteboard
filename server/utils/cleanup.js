const Room = require('../models/Room');

exports.cleanupOldRooms = async () => {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const result = await Room.deleteMany({ lastActivity: { $lt: oneDayAgo } });

  console.log(`🧹 Cleanup complete. Removed ${result.deletedCount} old room(s).`);
};
