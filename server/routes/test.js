const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Route to create a new user
router.post('/create', async (req, res) => {
    try {
        

        const user = new User({
            uid: 'ABC123',
            displayName: 'TestUser',
            photoURL: 'https://www.pexels.com/search/photo%20editing/',
            email: 'test@example.com',

        });

        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;