// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firebaseUID: {type: String, required: true, unique: true},
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    avatar: { type: String },
    servers: [{ type: mongoose.Schema.Types.String, ref: 'Server' }],
    friends: [{ type: mongoose.Schema.Types.String, ref: 'User' }],
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
