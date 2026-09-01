const editUserService = require('./editUser.service');
const { hashPassword } = require('../../../../utils/hash.util');
const path = require('path');
const fs = require('fs');

const editUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const doctorId = req.user.id;
        const { name, dob, sex, email, phone_number, note, status, age, password } = req.body;

        if (!name || !sex || !status) {
            return res.status(400).json({ success: false, message: 'Name, sex, and status are required' });
        }

        // Handle optional password update
        let passwordHash = null;
        if (password && password.trim() !== '') {
            passwordHash = await hashPassword(password);
        }

        // Handle the photo if a new one was uploaded
        let photoUrl = null;
        if (req.file) {
            photoUrl = 'profiles/' + req.file.filename; 
            
            // If storage provider is local, delete the old file to save space
            if (process.env.STORAGE_PROVIDER === 'local') {
                const oldUser = await editUserService.getUserById(userId, doctorId);
                if (oldUser && oldUser.photo_url) {
                    const oldFilePath = path.join(__dirname, '../../../../../uploads', oldUser.photo_url);
                    if (fs.existsSync(oldFilePath)) {
                        fs.unlinkSync(oldFilePath);
                    }
                }
            }
        }

        await editUserService.editUser(userId, doctorId, {
            name,
            dob: dob || null,
            sex,
            email: email || null,
            phoneNumber: phone_number || null,
            note: note || null,
            status,
            age: age || null,
            photoUrl,
            passwordHash
        });

        res.status(200).json({
            success: true,
            message: 'User updated successfully'
        });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = {
    editUser
};
