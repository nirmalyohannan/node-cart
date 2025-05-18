import jwt from 'jsonwebtoken';
import User from '../models/user.mjs';

const auth = async (req, res, next) => {
    try {
        // Get token from header
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ error: 'No token, authorization denied' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const user = await User.findById(decoded._id).select('-password'); // Exclude password for security

        if (!user) {
            // If the user ID in the token doesn't match any user in the DB
            return res.status(401).json({ error: 'User not found, authorization denied' });
        }

        // Add the full user object (fetched from DB) to the request
        req.user = user;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Token is not valid' });
    }
};

export default auth;