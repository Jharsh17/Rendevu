const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const User = require('../models/User'); // <- import User model
const Channel = require('../models/Channel'); // (optional) if you want to validate channel too

// Create a new message
router.post('/create', async (req, res) => {
    try {
        const { content, sender, channel } = req.body;

        // Check if sender exists in User collection
        const userExists = await User.findById(sender);
        if (!userExists) {
            return res.status(400).json({ message: "Invalid sender: user not found" });
        }

        // Optional: Check if channel exists
        const channelExists = await Channel.findById(channel);
        if (!channelExists) {
            return res.status(400).json({ message: "Invalid channel: channel not found" });
        }

        const message = new Message({ content, sender, channel });
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
        const messages = await Message.find({ channel: req.params.channelId })
            .populate('sender', 'username')
            .sort({ createdAt: 1 });

        res.status(200).json(messages);
    } catch (err) {
        console.error("Error fetching messages:", err);
        res.status(500).json({ message: "Failed to fetch messages", error: err.message });
    }
});

module.exports = router;
