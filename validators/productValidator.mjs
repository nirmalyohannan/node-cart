// validators/productValidator.mjs
import { body } from 'express-validator';

// Validation chain for creating/updating products
export const productValidation = [
    body('name')
        .notEmpty().bail().withMessage('Product name is required')
        .isString().withMessage('Product name must be a string')
        .trim(),

    body('description')
        .notEmpty().bail().withMessage('Product description is required')
        .isString().withMessage('Product description must be a string')
        .trim(),

    body('price')
        .notEmpty().bail().withMessage('Product price is required')
        .isNumeric().withMessage('Price must be a number')
        .custom(value => {
            if (value < 0) {
                throw new Error('Price cannot be negative');
            }
            return true;
        }),

    body('imageLinks')
        .isArray().bail().withMessage('Image links must be an array')
        .notEmpty().withMessage('At least one image link is required')
        .custom(links => {
            if (!links.every(link => typeof link === 'string' && link.trim().length > 0)) {
                throw new Error('All image links must be non-empty strings');
            }
            return true;
        }),

    body('brand')
        .notEmpty().bail().withMessage('Product brand is required')
        .isString().withMessage('Brand must be a string')
        .trim(),

    body('stock')
        .notEmpty().bail().withMessage('Stock quantity is required')
        .isInt({ min: 0 }).withMessage('Stock must be a non-negative integer')
];