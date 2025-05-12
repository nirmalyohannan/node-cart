// validators/authValidator.mjs
import { body } from 'express-validator';
import User from '../models/user.mjs';

// Validation chain for user signup
export const signupValidation = [
    // Validate name
    body('name')
        .notEmpty().bail().withMessage('Name is required')
        .isString().withMessage('Name must be a string'),

    // Validate email
    body('email')
        .notEmpty().bail().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .custom(async (email) => {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                throw new Error('Email already used');
            }
            return true;
        }),

    // Validate password
    body('password').isString().bail().withMessage('Password must be a string')
        .notEmpty().bail().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),

    // Validate phone (optional)
    body('phone')
        .optional()
        .isString().withMessage('Phone number must be a string')
        .matches(/^\d{10}$/).withMessage('Phone number must be 10 digits'),

    // Optional fields
    body('address').optional().isString().withMessage('Address must be a string'),
    body('role')
        .optional()
        .isString().withMessage('Role must be a string')
        .custom(value => {
            if (!value) return true; // Allow empty value
            const validRoles = ['customer', 'seller', 'admin'];
            if (!validRoles.includes(value)) {
                throw new Error('Role must be either customer, seller, or admin');
            }
            return true;
        })
];

// Validation chain for user login
export const loginValidation = [
    body('email')
        .notEmpty().bail().withMessage('Email is required')
        .isEmail().withMessage('Please enter a valid email'),
    body('password')
        .notEmpty().withMessage('Password is required')
];