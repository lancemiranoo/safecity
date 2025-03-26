const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify the token and check user role
const authorize = (roles) => {
    return async (req, res, next) => {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ message: 'Access denied, no token provided.' });
        }

        try {
            // Verify the token and extract user info
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id);

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            console.log("Allowed Roles:", roles, "User Role:", user.role); // Debug log

            // Check if the user's role is allowed to access the route
            if (!roles.includes(user.role)) {
                return res.status(403).json({ message: 'Forbidden: You do not have permission to access this resource.' });
            }

            req.user = user;
            next();
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server error' });
        }
    };
};

module.exports = authorize;
