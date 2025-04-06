const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// Get messages for a channel
router.get('/:channelId', async (req, res) => {
    try {
        const messages = await Message.find({ channelId: req.params.channelId }).sort({ createdAt: 1 });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Send a message
router.post('/', async (req, res) => {
    const { channelId, userId, userName, userImage, content } = req.body;
    try {
        const newMessage = new Message({
            channelId,
            userId,
            userName,
            userImage,
            content,
        });
        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;