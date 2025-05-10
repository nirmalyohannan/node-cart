
import { Schema, model } from 'mongoose';

const userSchema = new Schema({
    id: { type: Number, required: true, unique: true }, // Unique identifier for the user
    name: { type: String, required: true }, // User's full name
    email: { type: String, required: true, unique: true }, // User's email address
    password: { type: String, required: true }, // User's password (hashed for security)
    phone: { type: String }, // User's phone number (optional)
    address: { type: String }, // User's shipping and billing addresses
    cartID: { type: Number }, // ID of user's cart in Database
    role: { type: String, default: 'customer' } // User's role (e.g. customer, seller, admin)
});

export default model('User', userSchema);
