const jwt = require('jsonwebtoken');

const roleAuth = (...roles) => {
    return (req, res, next) => {
        try {
            // Get the token from Authorization header
            const token = req.header('Authorization')?.replace('Bearer ', '');
            if (!token) {
                return res.status(401).json({ message: 'Access denied. No token provided.' });
            }

            // Verify the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;

            // Check if the user has the required role
            if (!roles.includes(req.user.role)) {
                return res.status(403).json({ message: 'Access denied. You do not have permission.' });
            }

            next();
        } catch (error) {
            return res.status(400).json({ message: 'Invalid token.' });
        }
    };
};

module.exports = roleAuth;
