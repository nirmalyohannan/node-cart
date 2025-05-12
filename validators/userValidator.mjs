// validators/userValidator.mjs
import { body } from 'express-validator';

// Validation chains for user operations
export const updateUserValidation = [
    // Validate optional fields
    body('name').optional().bail().isString().withMessage('Name must be a string'),
    body('password').optional().bail().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('phone')
        .optional({ nullable: true })
        .bail()
        .isString().withMessage('Phone number must be a string')
        .matches(/^\d{10}$/).withMessage('Phone number must be 10 digits'),
    body('address').optional().bail().isString().withMessage('Address must be a string'),
    body('role')
        .optional()
        .bail()
        .isString().withMessage('Role must be a string')
        .custom(value => {
            if (!value) return true; // Allow empty value
            const validRoles = ['customer', 'seller'];
            if (!validRoles.includes(value)) {
                throw new Error('Role must be either customer or seller');
            }
            return true;
        }),
    body('cartID').optional().bail().isNumeric().withMessage('Cart ID must be a number')
];
