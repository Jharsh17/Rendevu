// routes/serverRoutes.js
const express = require('express');
const router = express.Router();
const Server = require('../models/ServerGlide');
const Channel = require('../models/Channel');
const User = require('../models/User'); 

// Create a new server
router.post('/create', async (req, res) => {
    try {
        const { name, owner} = req.body;

        if (!name || !owner) {
            return res.status(400).json({ message: 'Server name and owner are required.' });
        }
        const ownerInfo = await User.findOne({firebaseUID: owner});
        const server = new Server({ name, owner: ownerInfo._id, members: [ownerInfo._id] });
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
        const user = await User.findOne({firebaseUID: userId});
        const servers = await Server.find({members: user._id});
        res.status(200).json(servers);
    } catch (error) {
        console.error('Error fetching servers for user:', error.message);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

// invite a friend to a server
router.post('/:serverId/invite', async (req, res) => {
    try {
        const {serverId} = req.params;
        const {friendUsername} = req.body;
        friend = await User.findOne({username: friendUsername});
        if(!friend) {
            return res.status(404).json({message: 'Friend not found'});
        }
        // find the server
        const server = await Server.findById(serverId);
        if(!server) {
            return res.status(404).json({message: 'Server not found'});
        }

        // check if the friend is already a member of the server
        if(server.members.includes(friend._id)) {
            return res.status(400).json({message: 'User already a member of the server'});
        }
        server.members.push(friend._id);
        await server.save();

        // add friend to all channels in server
        const channels = await Channel.find({serverId: serverId});
        for(const channel of channels) {
            if (!channel.members.includes(friend._id)) {
                channel.members.push(friend._id);
                await channel.save();
            }
        }

        res.status(200).json({message: 'Friend added to server'});
    } catch (err) {
        console.error('Error inviting friend:', err.message);
        res.status(500).json({ message: 'Failed to invite friend to server', error: err.message });
    }
});

router.post('/:serverId/removeParticipant', async (req, res) => {
    try {
        const {serverId} = req.params;
        const {participantUsername} = req.body;
        const participant = await User.findOne({username: participantUsername});
        const server = await Server.findById(serverId);
        if (!participant) {
            return res.status(404).json({ message: 'Participant not found' });
        }
        if (!server) {
            return res.status(404).json({ message: 'Server not found' });
        }

        // remove participant from server
        server.members = server.members.filter((id) => id.toString() !== participant._id.toString());
        await server.save();

        res.status(200).json({ message: 'Participant removed from server' });
    } catch (err) {
        console.error('Error removing participant:', err);
        res.status(500).json({ message: 'Failed to remove participant from server', error: err.message });
    }
});

// Get a single server by ID
router.get('/:id', async (req, res) => {
    try {
        const server = await Server.findById(req.params.id).populate('owner members', 'firebaseUID username email');
        if (!server) {
            return res.status(404).json({ message: 'Server not found' });
        }
        console.log("Server details: ", server);
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
