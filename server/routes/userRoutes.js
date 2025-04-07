const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Create a new user
router.post('/create', async (req, res) => {
    try {
        const {firebaseUID, email, username} = req.body;
        // Check if the username already exists
        const existingUsername = await User.findOne({username});
        if(existingUsername) {
            return res.status(400).json({success: false, message: 'Username is already taken'});
        }

        // Check if user exists in mongodb
        let user = await User.findOne({firebaseUID});
        if(!user){
            // Create a new user if it doesn't exist
            user = new User({firebaseUID, email, username, avatar: '', servers: [], friends: []});
            await user.save();
            return res.status(201).json({success: true, message: 'Username set successfully', user});
        }

        // Update the username if user exists
        user.username = username;
        await user.save();
        res.status(200).json({success: true, message: 'Username set succesfully', user})
    } catch (error) {
        console.error(error);
        res.status(500).json({success: false, message: 'Server error', error});
    }
});

// Get user by ID
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

// Get all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

// Update user
router.put('/:id', async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

// Delete user
router.delete('/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

router.get('/search-user', async (req, res) => {
    try {
        const {username} = req.query;

        // Find user by username
        const user = await User.findOne({username});
        if(!user){
            return res.status(404).json({success: false, message: 'User not found'});
        }

        res.status(200).json({success: true, user});
    } catch (error) {
        console.error(error);
        res.status(500).json({success: false, message: 'Server error', error});
    }
});


module.exports = router;
