const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Create a new user
router.post('/create', async (req, res) => {
    try {
        const { username, email, avatar } = req.body;

        // Basic validation
        if (!username || !email) {
            return res.status(400).json({ message: "Username and email are required." });
        }

        // Check for existing user
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(409).json({
                message: existingUser.email === email
                    ? "Email is already in use."
                    : "Username is already taken."
            });
        }

        const newUser = new User({ username, email, avatar });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        console.error("Error creating user:", err);
        res.status(500).json({ message: "Internal server error", error: err.message });
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
