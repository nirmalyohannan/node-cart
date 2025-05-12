// routes/productRoutes.mjs
import express from 'express';
import { validationResult } from 'express-validator';
import Product from '../models/product.mjs';
import { productValidation } from '../validators/productValidator.mjs';
import auth from '../middleware/auth.mjs';
import checkRole from '../middleware/checkRole.mjs';

const router = express.Router();

// @route   POST /api/products
// @desc    Create a new product
// @access  Private (Sellers and Admins only)
router.post('/',
    auth,
    checkRole(['seller', 'admin']),
    productValidation,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const product = new Product({
                ...req.body,
                seller: req.user.id
            });

            await product.save();
            res.status(201).json(product);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
);

// @route   GET /api/products
// @desc    Get all products
// @access  Public
router.get('/', async (req, res) => {
    try {
        const products = await Product.find().populate('seller', 'name email');
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @route   GET /api/products/:id
// @desc    Get product by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('seller', 'name email');
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @route   PUT /api/products
// @desc    Update product
// @access  Private (Seller who created the product or Admin)
router.put('/',
    auth,
    checkRole(['seller', 'admin']),
    productValidation,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { id, ...updateData } = req.body;
            if (!id) {
                return res.status(400).json({ error: 'Product ID is required in request body' });
            }

            const product = await Product.findById(id);
            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }

            // Check if user is seller and owns the product or is admin
            if (req.user.role !== 'admin' && product.seller.toString() !== req.user.id) {
                return res.status(403).json({ error: 'Not authorized to update this product' });
            }

            const updatedProduct = await Product.findByIdAndUpdate(
                id,
                updateData,
                { new: true }
            ).populate('seller', 'name email');

            res.json(updatedProduct);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
);

// @route   DELETE /api/products
// @desc    Delete product
// @access  Private (Seller who created the product or Admin)
router.delete('/',
    auth,
    checkRole(['seller', 'admin']),
    async (req, res) => {
        try {
            const { id } = req.body;
            if (!id) {
                return res.status(400).json({ error: 'Product ID is required in request body' });
            }

            const product = await Product.findById(id);
            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }

            // Check if user is seller and owns the product or is admin
            if (req.user.role !== 'admin' && product.seller.toString() !== req.user.id) {
                return res.status(403).json({ error: 'Not authorized to delete this product' });
            }

            await product.remove();
            res.json({ message: 'Product removed' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
);

export default router;