// middleware/checkRole.mjs

// Middleware to check if user has required role
// This runs before protected routes and checks if user has required role
// @example checkRole(['seller', 'admin']) - User must have seller or admin role
const checkRole = (roles) => {
    return (req, res, next) => {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ error: 'Authentication required' });
        }
        if (!req.user.role) {
            console.error('checkRole.mjs', 'User document does not have role field');
            console.error('checkRole.mjs', 'Ensure load_user middleware is run before this middleware');
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Access denied. Insufficient permissions' });
        }

        next();
    };
};

export default checkRole;