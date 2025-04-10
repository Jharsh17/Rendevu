// models/Server.js
const mongoose = require('mongoose');

const serverSchema = new mongoose.Schema({
    name: { type: String, required: true },
    icon: { type: String },
    owner: { type: mongoose.Schema.Types.String, ref: 'User', required: true },
    members: [{ type: mongoose.Schema.Types.String, ref: 'User' }],
    channels: [{ type: mongoose.Schema.Types.String, ref: 'Channel' }],
}, { timestamps: true });

module.exports = mongoose.model('Server', serverSchema);
