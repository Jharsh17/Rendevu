// models/Message.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    sender: {
        type: String,
        ref: 'User',
        required: true,
    },
    channelId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Channel',
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
