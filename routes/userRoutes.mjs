// routes/userRoutes.js
import User from '../models/user.mjs';
import express from 'express';
import { validationResult } from 'express-validator';
import { updateUserValidation } from '../validators/userValidator.mjs';
import auth from '../middleware/auth.mjs';

const router = express.Router();

// Remove the POST / route as it's moved to authRoutes
// @route   GET /api/users
// @desc    Retrieve current user data
router.get('/', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @route   DELETE /api/users
// @desc    Delete current user
router.delete('/', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ message: 'User deleted successfully', user: deletedUser });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @route   PUT /api/users
// @desc    Update current user
// @example Body: { "name": "Updated Name", "email": "updated@example.com", "phone": "9876543210" }
router.put('/', auth, updateUserValidation, async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const userId = req.user.id;
        const { name, email, password, phone, address } = req.body;
        const updateData = {};

        // Only update allowed fields that are provided
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (password) updateData.password = password;
        if (phone) updateData.phone = phone;
        if (address) updateData.address = address;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: 'User updated successfully', user: updatedUser });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
