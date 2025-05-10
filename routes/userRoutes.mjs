// routes/userRoutes.js
import User from '../models/user.mjs';
import express from 'express';
import { validationResult } from 'express-validator';
import { createUserValidation, updateUserValidation, deleteUserValidation, getUserByIdValidation } from '../validators/userValidator.mjs';

const router = express.Router();

// @route   POST /api/users
// @desc    Add a new user
// @example URL: http://localhost:3000/api/users
// @example Body: { "name": "John Doe", "email": "john@example.com", "password": "securepassword", "phone": "1234567890" }
router.post('/', createUserValidation, async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, phone, address, role } = req.body;
    try {
        //Generate id for new user
        const lastUser = await User.findOne().sort({ id: -1 });
        const id = lastUser ? lastUser.id + 1 : 1;
        // Create a new user
        const newUser = new User({ id, name, email, password, phone, address, role });
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
router.get('/:id', getUserByIdValidation, async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
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
router.delete('/', deleteUserValidation, async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const id = req.body.id;
        const deletedUser = await User.findOneAndDelete({ id: id });
        if (!deletedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ message: 'User deleted', user: deletedUser });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @route   PUT /api/users/:id
// @desc    Update a user by ID
// @example URL: http://localhost:3000/api/users/1
// @example Body: { "name": "Updated Name", "email": "updated@example.com", "phone": "9876543210" }
router.put('/:id', updateUserValidation, async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const id = req.params.id;
        const { name, email, password, phone, address, role, cartID } = req.body;
        const updateData = {};

        // Only update fields that are provided
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (password) updateData.password = password;
        if (phone) updateData.phone = phone;
        if (address) updateData.address = address;
        if (role) updateData.role = role;
        if (cartID) updateData.cartID = cartID;

        const updatedUser = await User.findOneAndUpdate(
            { id: id },
            updateData,
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: 'User updated', user: updatedUser });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
