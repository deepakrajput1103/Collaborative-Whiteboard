require('dotenv').config();
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/db');
const roomRoutes = require('./routes/roomRoutes');
const socketHandlers = require('./socket/socketHandler');
const cleanup = require('./utils/cleanup');

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/rooms', roomRoutes);

// Socket.io connection
io.on('connection', (socket) => {
  socketHandlers(io, socket);
});

// Cleanup old rooms periodically
setInterval(async () => {
  try {
    await cleanup.cleanupOldRooms();
  } catch (err) {
    console.error('Error cleaning up old rooms:', err);
  }
}, 60 * 60 * 1000); // Run every hour

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});