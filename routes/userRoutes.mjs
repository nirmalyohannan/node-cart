// routes/userRoutes.js
import User from '../models/user.mjs';

import express from 'express';
const router = express.Router();

// @route   POST /api/users
// @desc    Add a new user
// @example URL: http://localhost:3000/api/users
// @example Body: { "name": "John Doe", "mobile": "1234567890" }
router.post('/', async (req, res) => {
    const { name, mobile } = req.body;
    const regex = /^\d{10}$/;
    if (!mobile || !regex.test(mobile)) {
        return res.status(400).json({ error: 'Invalid mobile number. It should have 10 digits' });
    }
    try {
        //Generate id for new user
        const lastUser = await User.findOne().sort({ id: -1 });
        const id = lastUser ? lastUser.id + 1 : 1;
        // Create a new user
        const newUser = new User({ name, mobile, id });
        await newUser.save();
        res.status(201).json({ message: 'User created', user: newUser });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// @route   GET /api/users
// @desc    List all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @route   GET /api/users/:id
// @desc    Get a single user by ID
router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid ID' });
        }
        const user = await User.findOne({ id: req.params.id });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @route   DELETE /api/users/:id
// @desc    Delete a user by ID
router.delete('/', async (req, res) => {
    try {
        const id = req.body.id;
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid ID' });
        }
        const deletedUser = await User.findOneAndDelete({ id: id });
        if (!deletedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ message: 'User deleted', user: deletedUser });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
