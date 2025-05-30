// models/DirectMessage.js
const mongoose = require('mongoose');

const dmSchema = new mongoose.Schema({
    participants: [{ type: mongoose.Schema.Types.String, ref: 'User' }],
    messages: [{
        sender: { type: mongoose.Schema.Types.String, ref: 'User' },
        content: { type: String },
        timestamp: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

module.exports = mongoose.model('DirectMessage', dmSchema);
