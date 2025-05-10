// validators/userValidator.mjs
import { body, param } from 'express-validator';

// Validation chains for user operations
export const createUserValidation = [
    // Validate name
    body('name')
        .notEmpty().bail().withMessage('Name is required')
        .isString().withMessage('Name must be a string'),

    // Validate email
    body('email')
        .notEmpty().bail().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format'),

    // Validate password
    body('password').isString().bail().withMessage('Password must be a string')
        .notEmpty().bail().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),

    // Validate phone (optional)
    body('phone')
        .optional()
        .matches(/^\d{10}$/).withMessage('Phone number must be 10 digits'),

    // Optional fields
    body('address').optional().isString().withMessage('Address must be a string'),
    body('role').optional().isString().withMessage('Role must be a string')
];

export const updateUserValidation = [
    // Validate ID parameter
    param('id')
        .isNumeric().bail().withMessage('ID must be a number'),

    // Validate optional fields
    body('name').optional().bail().isString().withMessage('Name must be a string'),
    body('email').optional().bail().isEmail().withMessage('Invalid email format'),
    body('password').optional().bail().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('phone').optional().bail().matches(/^\d{10}$/).withMessage('Phone number must be 10 digits'),
    body('address').optional().bail().isString().withMessage('Address must be a string'),
    body('role').optional().bail().isString().withMessage('Role must be a string'),
    body('cartID').optional().bail().isNumeric().withMessage('Cart ID must be a number')
];

export const deleteUserValidation = [
    // Validate ID in body
    body('id').isNumeric().bail().withMessage('ID must be a number')
];

export const getUserByIdValidation = [
    // Validate ID parameter
    param('id').isNumeric().bail().withMessage('ID must be a number')
];