require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());


// const authRoutes = require('./routes/auth');
// app.use('/api/auth', authRoutes);

// const userRoutes = require('./routes/userRoutes');
// const channelRoutes = require('./routes/channelRoutes');
// const messageRoutes = require('./routes/messageRoutes');

// app.use('/api/users', userRoutes);
// app.use('/api/channels', channelRoutes);
// app.use('/api/messages', messageRoutes);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected");
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch(err => console.error("MongoDB connection error:", err));

    
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);
console.log("userRoutes");
    