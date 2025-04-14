const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const User = require('../models/User'); // <- import User model
const Channel = require('../models/Channel'); // (optional) if you want to validate channel too

// Create a new message
router.post('/create', async (req, res) => {
    try {
        console.log("Request body:", req.body);
        const { content, sender, channelId } = req.body;

        // Check if sender exists in User collection
        const userExists = await User.findOne({firebaseUID: sender});
        if (!userExists) {
            return res.status(400).json({ message: "Invalid sender: user not found" });
        }

        // Optional: Check if channel exists
        const channelExists = await Channel.findById(channelId);
        if (!channelExists) {
            return res.status(400).json({ message: "Invalid channel: channel not found" });
        }

        const message = new Message({ content, sender, channelId });
        const savedMessage = await message.save();

        res.status(201).json(savedMessage);
    } catch (err) {
        console.error("Error creating message:", err);
        res.status(500).json({ message: "Failed to create message", error: err.message });
    }
});


// Get messages for a specific channel
router.get('/channel/:channelId', async (req, res) => {
    try {
        const messages = await Message.find({ channelId: req.params.channelId })
            .sort({ createdAt: 1 });

        // Get all unique sender IDs (firebaseUIDs)
        const senderIds = [...new Set(messages.map(msg => msg.sender))];

        // Fetch usernames for those IDs
        const users = await User.find({ firebaseUID: { $in: senderIds } }, 'firebaseUID username');

        // Map sender UID to username
        const uidToUsername = {};
        users.forEach(user => {
            uidToUsername[user.firebaseUID] = user.username;
        });

        // Attach username to each message
        const messagesWithUsernames = messages.map(msg => ({
            ...msg.toObject(),
            senderUsername: uidToUsername[msg.sender] || 'Unknown',
        }));
        
        res.status(200).json(messagesWithUsernames);
    } catch (err) {
        console.error("Error fetching messages:", err);
        res.status(500).json({ message: "Failed to fetch messages", error: err.message });
    }
});

module.exports = router;
