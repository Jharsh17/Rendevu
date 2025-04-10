// routes/serverRoutes.js
const express = require('express');
const router = express.Router();
const Server = require('../models/ServerGlide');

// Create a new server
router.post('/create', async (req, res) => {
    try {
        const { name, owner, members } = req.body;

        if (!name || !owner) {
            return res.status(400).json({ message: 'Server name and owner are required.' });
        }

        const server = new Server({ name, owner, members: [owner] });
        const savedServer = await server.save();
        res.status(201).json(savedServer);
    } catch (error) {
        console.error('Error creating server:', error.message);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

// Get all servers for a user
router.get('/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const servers = await Server.find({members: userId});
        res.status(200).json(servers);
    } catch (error) {
        console.error('Error fetching servers for user:', error.message);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

// Get a single server by ID
router.get('/:id', async (req, res) => {
    try {
        const server = await Server.findById(req.params.id).populate('owner members', 'username email');
        if (!server) {
            return res.status(404).json({ message: 'Server not found' });
        }
        res.status(200).json(server);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching server', error: error.message });
    }
});

// Update a server
router.put('/:id', async (req, res) => {
    try {
        const updatedServer = await Server.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedServer) {
            return res.status(404).json({ message: 'Server not found' });
        }
        res.status(200).json(updatedServer);
    } catch (error) {
        res.status(500).json({ message: 'Error updating server', error: error.message });
    }
});

// Delete a server
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Server.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: 'Server not found' });
        }
        res.status(200).json({ message: 'Server deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting server', error: error.message });
    }
});

module.exports = router;
