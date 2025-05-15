import express from 'express';
import { validationResult } from 'express-validator';
import auth from '../middleware/auth.mjs';
import checkRole from '../middleware/checkRole.mjs';
import Cart from '../models/cart.mjs';
import Product from '../models/product.mjs';

const router = express.Router();

// @route   GET /api/cart
// @desc    Get the current user's cart
// @access  Private (Customer only)
router.get('/', auth, checkRole(['customer']), async (req, res) => {
    try {
        let cart = await Cart.findOne({ userId: req.user._id });
        if (!cart) {
            cart = await Cart.create({ userId: req.user._id, products: [] });
        }

        // Compute total dynamically
        const total = cart.products.reduce((sum, item) => sum + item.price * item.quantity, 0);

        res.json({ ...cart.toObject(), total });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @route   POST /api/cart/add
// @desc    Add a product to the cart
// @access  Private (Customer only)
router.post('/add', auth, checkRole(['customer']), async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ error: 'Product not found' });

        let cart = await Cart.findOne({ userId: req.user._id });
        if (!cart) {
            cart = new Cart({ userId: req.user._id, products: [] });
        }

        const existingProduct = cart.products.find(p => p.productId.toString() === productId);
        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.products.push({
                productId,
                name: product.name,
                price: product.price,
                quantity
            });
        }

        await cart.save();
        res.json({ message: 'Product added to cart' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @route   PUT /api/cart/update
// @desc    Update quantity of a product in the cart
// @access  Private (Customer only)
router.put('/update', auth, checkRole(['customer']), async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        const cart = await Cart.findOne({ userId: req.user._id });
        if (!cart) return res.status(404).json({ error: 'Cart not found' });

        const item = cart.products.find(p => p.productId.toString() === productId);
        if (!item) return res.status(404).json({ error: 'Product not in cart' });

        item.quantity = quantity;

        await cart.save();
        res.json({ message: 'Cart updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @route   DELETE /api/cart/remove
// @desc    Remove a product from the cart
// @access  Private (Customer only)
router.delete('/remove', auth, checkRole(['customer']), async (req, res) => {
    try {
        const { productId } = req.body;

        const cart = await Cart.findOne({ userId: req.user._id });
        if (!cart) return res.status(404).json({ error: 'Cart not found' });

        cart.products = cart.products.filter(p => p.productId.toString() !== productId);
        await cart.save();

        res.json({ message: 'Product removed from cart' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @route   DELETE /api/cart/clear
// @desc    Clear the cart
// @access  Private (Customer only)
router.delete('/clear', auth, checkRole(['customer']), async (req, res) => {
    try {
        await Cart.findOneAndUpdate(
            { userId: req.user._id },
            { products: [] }
        );
        res.json({ message: 'Cart cleared' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
