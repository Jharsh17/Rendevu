const express = require('express');
const router = express.Router();
const Channel = require('../models/Channel');

// Get all channels
router.get('/', async (req, res) => {
    try {
        const channels = await Channel.find();
        res.json(channels);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create new channel
router.post('/', async (req, res) => {
    const { name } = req.body;
    try {
        const newChannel = new Channel({ name });
        await newChannel.save();
        res.status(201).json(newChannel);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;