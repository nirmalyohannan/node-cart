// middleware/checkRole.mjs

// Middleware to check if user has required role
// This runs before protected routes and checks if user has required role
// @example checkRole(['seller', 'admin']) - User must have seller or admin role
const checkRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Access denied. Insufficient permissions' });
        }

        next();
    };
};

export default checkRole;