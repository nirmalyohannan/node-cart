import User from '../models/user.mjs';

// Middleware to load user from database and enhance req.user
const loadUser = async (req, res, next) => {
    try {

        // Store the JWT decoded user data if it exists
        const jwtDecodedUser = req.user;

        if (!jwtDecodedUser) {
            console.error('load_user.mjs:', 'No JWT decoded user data found');
            console.error('load_user.mjs', 'Ensure Auth middleware is run before this middleware');
            return res.status(500).json({ error: 'Internal server error' });
        }

        // Fetch fresh user data from database
        const dbUser = await User.findById(req.user._id);

        if (!dbUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Merge JWT decoded data with database user
        req.user = {
            ...jwtDecodedUser,
            ...dbUser.toObject()
        };

        next();
    } catch (error) {
        console.error('load_user.mjs', 'Error loading user:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export default loadUser;