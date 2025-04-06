const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    text: String,
    senderId: String,
    senderName: String,
    channelId: String,
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Message', messageSchema);
