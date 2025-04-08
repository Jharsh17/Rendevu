const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Channel = require('../models/Channel');
const Server = require('../models/ServerGlide');

// Create a new channel
router.post('/create', async (req, res) => {
    try {
        const { name, type = 'text', server } = req.body;

        // Validate input
        if (!name || !server) {
            return res.status(400).json({ message: "Channel name and server ID are required." });
        }

        if (!['text', 'voice'].includes(type)) {
            return res.status(400).json({ message: "Invalid channel type. Must be 'text' or 'voice'." });
        }

        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(server)) {
            return res.status(400).json({ message: "Invalid server ID format." });
        }

        // Check if server exists
        const serverExists = await Server.findById(server);
        if (!serverExists) {
            return res.status(404).json({ message: "Server not found. Cannot create channel." });
        }

        // Create and save channel
        const channel = new Channel({ name, type, server });
        const savedChannel = await channel.save();

        res.status(201).json(savedChannel);
    } catch (error) {
        console.error("Error creating channel:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

// Get all channels for a specific server
router.get('/server/:serverId', async (req, res) => {
    try {
        const { serverId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(serverId)) {
            return res.status(400).json({ message: "Invalid server ID format." });
        }

        const channels = await Channel.find({ server: serverId });
        res.status(200).json(channels);
    } catch (error) {
        console.error("Error fetching channels:", error);
        res.status(500).json({ message: 'Error fetching channels', error: error.message });
    }
});

// Get a single channel by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid channel ID format." });
        }

        const channel = await Channel.findById(id);
        if (!channel) return res.status(404).json({ message: 'Channel not found' });

        res.status(200).json(channel);
    } catch (error) {
        console.error("Error fetching channel:", error);
        res.status(500).json({ message: 'Error fetching channel', error: error.message });
    }
});

// Update a channel
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid channel ID format." });
        }

        const updatedChannel = await Channel.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedChannel) return res.status(404).json({ message: "Channel not found" });

        res.status(200).json(updatedChannel);
    } catch (error) {
        console.error("Error updating channel:", error);
        res.status(500).json({ message: 'Error updating channel', error: error.message });
    }
});

// Delete a channel
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid channel ID format." });
        }

        const deleted = await Channel.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ message: "Channel not found" });

        res.status(200).json({ message: 'Channel deleted' });
    } catch (error) {
        console.error("Error deleting channel:", error);
        res.status(500).json({ message: 'Error deleting channel', error: error.message });
    }
});

module.exports = router;
