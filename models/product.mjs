// models/product.mjs
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Product description is required'],
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'Product price is required'],
        min: [0, 'Price cannot be negative']
    },
    imageLinks: [{
        type: String,
        required: true
    }],
    brand: {
        type: String,
        required: [true, 'Product brand is required'],
        trim: true
    },
    stock: {
        type: Number,
        required: [true, 'Product stock quantity is required'],
        min: [0, 'Stock cannot be negative'],
        default: 0
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Seller information is required']
    }
}, {
    timestamps: true
});

const Product = mongoose.model('Product', productSchema);

export default Product;