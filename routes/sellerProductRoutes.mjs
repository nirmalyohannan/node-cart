import express from 'express';
import { validationResult } from 'express-validator';
import auth from '../middleware/auth.mjs';
import checkRole from '../middleware/checkRole.mjs'; // Changed to default import
import Product from '../models/product.mjs'; // Assuming your Product model is Product.mjs
import { productValidation } from '../validators/productValidator.mjs'; // Assuming you have product validation rules

const router = express.Router();

// Apply auth and seller role check to all routes in this file
router.use(auth, checkRole(['seller']));

// @route   GET /api/seller/products
// @desc    Get all products for the authenticated seller
// @access  Private (Seller)
router.get('/', async (req, res) => {
    try {
        const products = await Product.find({ seller: req.user._id }).populate('seller', 'name email');
        res.json(products);
    } catch (err) {
        console.error('Error fetching seller products:', err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/seller/products
// @desc    Create a new product as the authenticated seller
// @access  Private (Seller)
router.post('/', productValidation, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, price, category, stockQuantity, brand, imageLinks } = req.body;

    try {
        const newProduct = new Product({
            name,
            description,
            price,
            category,
            stockQuantity,
            brand,
            imageLinks: imageLinks || [], // Ensure imageLinks is an array
            seller: req.user._id // Automatically associate with the logged-in seller
        });

        const product = await newProduct.save();
        res.status(201).json(product);
    } catch (err) {
        console.error('Error creating product for seller:', err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/seller/products/:productId
// @desc    Update a product owned by the authenticated seller
// @access  Private (Seller)
router.put('/:productId', productValidation, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, price, category, stockQuantity, brand, imageLinks } = req.body;
    const { productId } = req.params;

    try {
        let product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }

        // Ensure the authenticated seller owns this product
        if (product.seller.toString() !== req.user._id.toString()) {
            return res.status(401).json({ msg: 'User not authorized to update this product' });
        }

        // Update fields
        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price === undefined ? product.price : price;
        product.category = category || product.category;
        product.stockQuantity = stockQuantity === undefined ? product.stockQuantity : stockQuantity;
        product.brand = brand || product.brand;
        product.imageLinks = imageLinks === undefined ? product.imageLinks : imageLinks;

        await product.save();
        res.json(product);
    } catch (err) {
        console.error('Error updating seller product:', err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Product not found (invalid ID format)' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/seller/products/:productId
// @desc    Delete a product owned by the authenticated seller
// @access  Private (Seller)
router.delete('/:productId', async (req, res) => {
    const { productId } = req.params;
    try {
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }

        // Ensure the authenticated seller owns this product
        if (product.seller.toString() !== req.user._id.toString()) {
            return res.status(401).json({ msg: 'User not authorized to delete this product' });
        }

        await product.deleteOne();
        res.json({ msg: 'Product removed successfully' });
    } catch (err) {
        console.error('Error deleting seller product:', err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Product not found (invalid ID format)' });
        }
        res.status(500).send('Server Error');
    }
});

export default router;