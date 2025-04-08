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



// SERVER + DB
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected");
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch(err => console.error("MongoDB connection error:", err));

    