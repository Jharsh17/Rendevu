require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// ROUTES IMPORT
const userRoutes = require('./routes/userRoutes');
// ROUTE REGISTRATION BEFORE SERVER STARTS
app.use('/api/users', userRoutes);

const serverRoutes = require('./routes/serverRoutes');
app.use('/api/servers', serverRoutes);

const channelRoutes = require('./routes/channelRoutes');
app.use('/api/channels', channelRoutes);

const messageRoutes = require('./routes/messageRoutes');
app.use('/api/messages', messageRoutes);

const directMessageRoutes = require('./routes/directMessageRoutes');
app.use('/api/dms', directMessageRoutes);

const http = require('http');
const {Server} = require('socket.io');
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

// Socket.io connection
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Listen for messages
    socket.on('sendMessage', (messageData) => {
        // Emit the message to the specific channel
        io.to(messageData.channelId).emit('receiveMessage', messageData);
    });

    // Join a channel
    socket.on('joinChannel', (channelId) => {
        socket.join(channelId);
        console.log(`User ${socket.id} joined channel ${channelId}`);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});


// SERVER + DB
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected");
        server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch(err => console.error("MongoDB connection error:", err));

    