const createUserService = require('./createUser.service');
const { hashPassword } = require('../../../../utils/hash.util');

const createUser = async (req, res) => {
    try {
        const { username, password, name, dob, sex, email, phone_number, note, age } = req.body;
        
        if (!username || !password || !name || !sex) {
            return res.status(400).json({ success: false, message: 'Username, password, name, and sex are required.' });
        }

        const doctorId = req.user.id;
        const doctorName = req.user.name; // <--- This is required !
        const passwordHash = await hashPassword(password);

        // Handle the photo if it was uploaded successfully by the middleware
        let photoUrl = null;
        if (req.file) {
            // We only save the relative path to the database!
            // E.g. 'profiles/1691234567_john.jpg'
            photoUrl = 'profiles/' + req.file.filename; 
        }

        const newUserId = await createUserService.createUser({
            username,
            passwordHash,
            name,
            dob: dob || null,
            sex,
            email: email || null,
            phoneNumber: phone_number || null,
            note: note || null,
            doctorId,
            photoUrl,
            doctorName,
            age: age || null
        });

        // Generate the full URL to send back to Flutter right now
        let fullPhotoUrl = null;
        if (photoUrl) {
            fullPhotoUrl = `${process.env.BASE_UPLOAD_URL}/${photoUrl}`;
        }

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: { 
                id: newUserId,
                photo_url: fullPhotoUrl
            }
        });
        
    } catch (error) {
        console.error('Error creating user:', error);
        
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ success: false, message: 'Username or email already exists' });
        }
        
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = {
    createUser
};
