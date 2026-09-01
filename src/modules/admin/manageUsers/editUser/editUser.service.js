const pool = require('../../../../../db');

const getUserById = async (userId, doctorId) => {
    const [rows] = await pool.query('SELECT photo_url FROM users WHERE id = ? AND doctor_id = ?', [userId, doctorId]);
    return rows.length > 0 ? rows[0] : null;
};

const editUser = async (userId, doctorId, updateData) => {
    const { name, dob, sex, email, phoneNumber, note, status, age, photoUrl, passwordHash } = updateData;

    await pool.query(
        'CALL user_edit(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [userId, doctorId, name, photoUrl, dob, sex, age, email, phoneNumber, note, status, passwordHash]
    );
};

module.exports = {
    getUserById,
    editUser
};
