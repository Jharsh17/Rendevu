const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// Create a new message
router.post('/create', async (req, res) => {
    try {
        const { content, sender, channel } = req.body;

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
