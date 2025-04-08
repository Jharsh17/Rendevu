const express = require('express');
const router = express.Router();
const DirectMessage = require('../models/DirectMessage');
const User = require('../models/User');

router.post('/', async (req, res) => {
    const { senderId, receiverId, content } = req.body;

    try {
        if (!content || typeof content !== 'string' || content.trim() === '') {
            return res.status(400).json({ message: "Message content is required" });
        }

        // Validate users
        const sender = await User.findById(senderId);
        const receiver = await User.findById(receiverId);

        if (!sender || !receiver) {
            return res.status(404).json({ message: "Sender or receiver not found" });
        }

        const participants = [senderId.toString(), receiverId.toString()].sort();

        let dmThread = await DirectMessage.findOne({ participants });

        const newMessage = {
            sender: senderId,
            content,
            timestamp: new Date()
        };

        if (dmThread) {
            dmThread.messages.push(newMessage);
        } else {
            dmThread = new DirectMessage({
                participants,
                messages: [newMessage]
            });
        }

        const saved = await dmThread.save();
        res.status(201).json(saved);

    } catch (err) {
        console.error("Error creating/sending DM:", err);
        res.status(500).json({ message: "Failed to send DM", error: err.message });
    }
});

// Fetch all DMs between two users
router.get('/:user1Id/:user2Id', async (req, res) => {
    const { user1Id, user2Id } = req.params;

    try {
        const participants = [user1Id, user2Id].sort();
        const thread = await DirectMessage.findOne({ participants })
            .populate('messages.sender', 'username')
            .populate('participants', 'username');

        if (!thread) return res.status(404).json({ message: "No DM thread found" });

        res.status(200).json(thread);

    } catch (err) {
        console.error("Error fetching DM thread:", err);
        res.status(500).json({ message: "Failed to fetch DMs", error: err.message });
    }
});

module.exports = router;
