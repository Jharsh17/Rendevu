require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
app.use(cors());
app.use(express.json());

// ROUTES IMPORT
const userRoutes = require('./routes/userRoutes');
const serverRoutes = require('./routes/serverRoutes');
const channelRoutes = require('./routes/channelRoutes');
const messageRoutes = require('./routes/messageRoutes');
const directMessageRoutes = require('./routes/directMessageRoutes');

// ROUTE REGISTRATION
app.use('/api/users', userRoutes);
app.use('/api/servers', serverRoutes);
app.use('/api/channels', channelRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/dms', directMessageRoutes);

// CREATE HTTP SERVER & SOCKET.IO
const io = new Server(httpServer, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST']
    }
  });
  

// SOCKET.IO HANDLER
io.on('connection', (socket) => {
    console.log(`🔌 User connected: ${socket.id}`);

    socket.on('join-voice', (roomId) => {
        socket.join(roomId);
        console.log(`🗣️ ${socket.id} joined voice room: ${roomId}`);
        socket.to(roomId).emit('user-joined', socket.id);
    });

    socket.on('offer', ({ targetId, offer }) => {
        io.to(targetId).emit('offer', { from: socket.id, offer });
    });

    socket.on('answer', ({ targetId, answer }) => {
        io.to(targetId).emit('answer', { from: socket.id, answer });
    });

    socket.on('ice-candidate', ({ targetId, candidate }) => {
        io.to(targetId).emit('ice-candidate', { from: socket.id, candidate });
    });

    socket.on('leave-voice', (roomId) => {
        socket.leave(roomId);
        socket.to(roomId).emit('user-left', socket.id);
        console.log(`🚪 ${socket.id} left voice room: ${roomId}`);
    });

    socket.on('disconnect', () => {
        console.log(`❌ User disconnected: ${socket.id}`);
    });
});

// SERVER + DB INIT
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("✅ MongoDB connected");
        server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    })
    .catch(err => console.error("❌ MongoDB connection error:", err));
