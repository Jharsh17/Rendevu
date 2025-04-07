const express = require('express');
const router = express.Router();
const Server = require('../models/Server');

// Create a new server
router.post('/create', async (req, res) => {
    try {
        const { name, owner, members } = req.body;
        const server = new Server({ name, owner, members });
        const savedServer = await server.save();
        res.status(201).json(savedServer);
    } catch (error) {
        console.error('Error creating server:', error);
        res.status(500).json({ message: 'Server error', error });
    }
});

// Get all servers
router.get('/', async (req, res) => {
    try {
        const servers = await Server.find().populate('owner', 'username email');
        res.status(200).json(servers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching servers', error });
    }
});

// Get a single server by ID
router.get('/:id', async (req, res) => {
    try {
        const server = await Server.findById(req.params.id).populate('owner members', 'username email');
        if (!server) return res.status(404).json({ message: 'Server not found' });
        res.status(200).json(server);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching server', error });
    }
});

// Update a server
router.put('/:id', async (req, res) => {
    try {
        const updatedServer = await Server.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedServer);
    } catch (error) {
        res.status(500).json({ message: 'Error updating server', error });
    }
});

// Delete a server
router.delete('/:id', async (req, res) => {
    try {
        await Server.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Server deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting server', error });
    }
});

module.exports = router;
