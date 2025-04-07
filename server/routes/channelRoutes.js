const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Channel = require('../models/Channel');
const Server = require('../models/Server');

router.post('/create', async (req, res) => {
    try {
        const { name, type, server } = req.body;

        // Validate server ID format
        if (!mongoose.Types.ObjectId.isValid(server)) {
            return res.status(400).json({ message: "Invalid server ID format." });
        }

        // Check if server exists
        const serverExists = await Server.findById(server);
        if (!serverExists) {
            return res.status(404).json({ message: "Server not found. Cannot create channel." });
        }

        // Create channel
        const channel = new Channel({ name, type, server });
        const savedChannel = await channel.save();
        res.status(201).json(savedChannel);
    } catch (error) {
        console.error("Error creating channel:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
});


// Get all channels for a specific server
router.get('/server/:serverId', async (req, res) => {
    try {
        const channels = await Channel.find({ server: req.params.serverId });
        res.status(200).json(channels);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching channels', error });
    }
});

// Get a single channel by ID
router.get('/:id', async (req, res) => {
    try {
        const channel = await Channel.findById(req.params.id);
        if (!channel) return res.status(404).json({ message: 'Channel not found' });
        res.status(200).json(channel);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching channel', error });
    }
});

// Update a channel
router.put('/:id', async (req, res) => {
    try {
        const updatedChannel = await Channel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedChannel);
    } catch (error) {
        res.status(500).json({ message: 'Error updating channel', error });
    }
});

// Delete a channel
router.delete('/:id', async (req, res) => {
    try {
        await Channel.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Channel deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting channel', error });
    }
});

module.exports = router;
