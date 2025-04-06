const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/create', async (req, res) => {
    try {
        const { username, email } = req.body;
        const user = new User({ username, email });
        const savedUser = await user.save();
        res.status(201).json(savedUser);
        console.log("userHey");
        console.log("Request body:", req.body);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error });
        console.log("userHey");
    }
});
module.exports = router;
