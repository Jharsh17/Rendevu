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
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        res.status(200).json(user);
    } catch (err) {
        console.error("Error fetching user by ID:", err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
});

// Get all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        console.error("Error fetching all users:", err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
});

// Update user
router.put('/:id', async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found." });
        }
        res.status(200).json(updatedUser);
    } catch (err) {
        console.error("Error updating user:", err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
});

// Delete user
router.delete('/:id', async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found." });
        }
        res.status(200).json({ message: "User deleted successfully." });
    } catch (err) {
        console.error("Error deleting user:", err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
});

module.exports = router;
