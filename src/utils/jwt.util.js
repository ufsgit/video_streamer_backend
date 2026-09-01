const jwt = require('jsonwebtoken');

const generateToken = (userId, role, name) => {
    // role will be either 'admin' or 'user'
    return jwt.sign(
        { id: userId, role: role, name: name },
        process.env.JWT_SECRET,
        { expiresIn: '30d' } // Token expires in 30 days
    );
};

const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return null;
    }
};

module.exports = {
    generateToken,
    verifyToken
};
