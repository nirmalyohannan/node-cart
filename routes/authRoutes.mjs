import express from 'express';
import { validationResult } from 'express-validator';
import User from '../models/user.mjs';
import { signupValidation, loginValidation } from '../validators/authValidator.mjs';
import auth from '../middleware/auth.mjs';

const router = express.Router();

// @route   POST /api/auth/signup
// @desc    Register a new user
router.post('/signup', signupValidation, async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, phone, address, role } = req.body;
    try {
        // Create a new user
        const newUser = new User({ name, email, password, phone, address, role });
        await newUser.save();

        // Generate token for immediate login
        const token = newUser.generateAuthToken();

        res.status(201).json({
            message: 'User created successfully',
            token,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// @route   POST /api/auth/login
// @desc    Login user and get token
router.post('/login', loginValidation, async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Generate token
        const token = user.generateAuthToken();

        // Send response
        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



// @route   POST /api/auth/signout
// @desc    Sign out user
router.post('/signout', auth, async (req, res) => {
    try {
        // Since JWT is stateless, we just send a success response
        // The client should handle removing the token
        res.json({ message: 'Successfully signed out' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;