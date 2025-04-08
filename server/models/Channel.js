// models/Channel.js
const mongoose = require('mongoose');

const channelSchema = new mongoose.Schema({
    name: { type: String, required: true },
    server: { type: mongoose.Schema.Types.ObjectId, ref: 'Server', required: true },
    type: { type: String, enum: ['text', 'voice'], default: 'text' },
}, { timestamps: true });

module.exports = mongoose.model('Channel', channelSchema);
