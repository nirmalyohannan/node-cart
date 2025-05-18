// middleware/checkRole.mjs

// Middleware to check if user has required role
// This runs before protected routes and checks if user has required role
// @example checkRole(['seller', 'admin']) - User must have 'seller' OR 'admin' role
// @example checkRole('seller') - User must have 'seller' role
const checkRole = (requiredRolesInput) => {
  
    
    return function (req, res, next) {
        // console.log('User object in checkRole:', req.user); // For debugging, remove in production

        if (!req.user || !req.user._id) {
            // This case should ideally be caught by the `auth` middleware first.
            // If it reaches here, it implies `auth` middleware might not have run or failed silently.
            return res.status(401).json({ error: 'Authentication required' });
        }
        if (!req.user.role) {
            console.error('checkRole.mjs: User document does not have a "role" field. User ID:', req.user._id);
            console.error('checkRole.mjs: Ensure the `auth` middleware correctly fetches and attaches the user with their role.');
            return res.status(500).json({ error: 'Server configuration error: User role not found.' });
        }

        const rolesToCheck = Array.isArray(requiredRolesInput) ? requiredRolesInput : [requiredRolesInput];

        if (!rolesToCheck.includes(req.user.role)) {
            return res.status(403).json({ error: 'Access denied. Insufficient permissions' });
        }

        next();
    };
};

export default checkRole;