const { verifyToken } = require('../utils/jwt.util');

// Middleware to verify if a user/admin is logged in
const protect = (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
    }

    const decoded = verifyToken(token);

    if (!decoded) {
        return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }

    // Attach the decoded user payload (id, role) to the request object
    req.user = decoded;
    next();
};

// Middleware to ensure only admins can access a route
const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ success: false, message: 'Access denied. Admins only.' });
    }
};

module.exports = {
    protect,
    adminOnly
};
