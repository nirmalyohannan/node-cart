
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new Schema({
    name: { type: String, required: true }, // User's full name
    email: { type: String, required: true, unique: true }, // User's email address
    password: { type: String, required: true }, // User's password (hashed for security)
    phone: { type: String }, // User's phone number (optional)
    address: { type: String }, // User's shipping and billing addresses
    cartID: { type: Number }, // ID of user's cart in Database
    role: { type: String, default: 'customer' } // User's role (e.g. customer, seller, admin)
});


// Middleware to hash password before saving user
// This runs before save operations and checks if password was modified
// If password was changed, it will hash it using bcrypt with salt rounds of 8
userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isNew || user.isModified('password')) {
        console.log('is NewUser: ', user.isNew);
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

// Add method to compare password
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// Add method to generate auth token
userSchema.methods.generateAuthToken = function () {
    return jwt.sign(
        { id: this._id, email: this.email, role: this.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );
};

export default model('User', userSchema);
