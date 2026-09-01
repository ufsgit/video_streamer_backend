const authService = require('./auth.service');
const { comparePassword } = require('../../utils/hash.util');
const { generateToken } = require('../../utils/jwt.util');

// POST /api/auth/admin/login
const loginAdmin = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Please provide username and password' });
    }

    try {
        const users = await authService.getAdminByUsername(username);
        
        if (users.length === 0) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const admin = users[0]; // The actual user record

        // In a real app, use comparePassword. 
        // For testing since you inserted '123' as plain text, we will do a direct check if comparePassword fails
        // but we should always rely on bcrypt in production.
        const isMatch = await comparePassword(password, admin.password_hash);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const token = generateToken(admin.id, 'admin');

        res.status(200).json({
            success: true,
            data: {
                id: admin.id,
                username: admin.username,
                name: admin.name,
                photo_url: admin.photo_url,
                dob: admin.dob,
                created_at: admin.created_at,
                role: 'admin',
                token
            }
        });

    } catch (error) {
        console.error('Admin Login Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// POST /api/auth/user/login
const loginUser = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Please provide username and password' });
    }

    try {
        const users = await authService.getUserByUsername(username);
        
        if (users.length === 0) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const user = users[0];

        if (user.status === 'Inactive') {
            return res.status(403).json({ success: false, message: 'Account is inactive. Contact admin.' });
        }

        const isMatch = await comparePassword(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const token = generateToken(user.id, 'user');

        res.status(200).json({
            success: true,
            data: {
                id: user.id,
                username: user.username,
                name: user.name,
                photo_url: user.photo_url,
                role: 'user',
                token
            }
        });

    } catch (error) {
        console.error('User Login Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = {
    loginAdmin,
    loginUser
};
