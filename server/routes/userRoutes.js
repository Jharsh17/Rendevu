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

router.get('/search', async (req, res) => {
    try {
        const {username} = req.query;

        //find user by username
        const user = await User.findOne({username}, 'firebaseUID username email');
        if(!user){
            return res.status(404).json({message: "User not found"});
        }

        res.status(200).json(user);
    } catch (err){
        console.error("Error searching for user: ", err);
        res.status(500).json({message: "Failed to search for user", error: err.message});
    }
});

router.post('/sendFriendRequest', async (req, res) => {
    try {
        const { userId, friendId } = req.body;

        // Validate both users exist
        const user = await User.findOne({firebaseUID: userId});
        const friend = await User.findOne({firebaseUID: friendId});

        if(!user || !friend){
            return res.status(404).json({message: "User not found"});
        }

        // check if a friend request is already sent
        if(friend.friendRequests.includes(user._id)){
            return res.status(400).json({message: "Friend request already sent"})
        }

        // check if they are already friends
        if(friend.friends.includes(user._id)){
            return res.status(400).json({message: "This user is already in your Friends list"})
        }

        // add friend request
        friend.friendRequests.push(user._id);
        await friend.save();

        res.status(200).json({message: "Friend request sent successfully"});
    } catch (err) {
        console.error("Error sending friend request:", err);
        res.status(500).json({ message: "Failed to send friend request", error: err.message });
    }
});

router.post('/acceptFriendRequest', async (req, res) => {
    try {
        const {userId, friendId} = req.body;

        // Validate both users exist
        const user = await User.findOne({firebaseUID: userId});
        const friend = await User.findOne({firebaseUID: friendId});
        if(!user || !friend){
            return res.status(404).json({message: "User or Friend not found"});
        }
    
        // check if a friend request already exists
        if(!user.friendRequests.includes(friend._id)){
            return res.status(400).json({message: "No friend request found"})
        }
        

        // add each other as friends
        user.friends.push(friend._id);
        friend.friends.push(user._id);

        // remove friend request from user
        user.friendRequests = user.friendRequests.filter(id => id.toString() !== friend._id.toString());

        await user.save();
        await friend.save();

        res.status(200).json({message: "Friend request accepted successfully"});
    } catch (err) {
        console.error("Error accepting friend request:", err);
        res.status(500).json({ message: "Failed to accept friend request", error: err.message });
    }
});

router.post('/rejectFriendRequest', async (req, res) => {
    try {
        const {userId, friendId} = req.body;

        // Validate both users exist
        const user = await User.findOne({firebaseUID: userId});
        const friend = await User.findOne({firebaseUID: friendId});

        if(!user || !friend){
            return res.status(404).json({message: "User or Friend not found"});
        }

        // check if a friend request already exists
        if(!user.friendRequests.includes(friend._id)){
            return res.status(400).json({message: "No friend request found"})
        }

        // remove friend request from user
        user.friendRequests = user.friendRequests.filter(id => id !== friend._id);

        await user.save();

        res.status(200).json({message: "Friend request rejected successfully"});
    } catch (err) {
        console.error("Error rejecting friend request:", err);
        res.status(500).json({ message: "Failed to reject friend request", error: err.message });
    }
});

router.get('/:userId/friendRequests', async (req, res) => {
    try {
        const {userId} = req.params;
        const userinfo = await User.findOne({firebaseUID: userId})
        const user = await User.findById(userinfo._id).populate('friendRequests', 'firebaseUID username email');
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        console.log("Friend requests: ", user);
        res.status(200).json(user);
    } catch (err) {
        console.error("Error fetching friend requests: ", err);
        res.status(500).json({message: "Failed to fetch friend requests", error : err.message});
    }
});

// Get user by ID
router.get('/:userId', async (req, res) => {
    try {
        const {userId} = req.params;
        const user = await User.findOne({firebaseUID: userId}).populate('username');
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
