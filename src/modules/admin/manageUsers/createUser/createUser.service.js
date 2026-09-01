const pool = require('../../../../../db');

const createUser = async (userData) => {
    const { 
        username, passwordHash, name, dob, sex, 
        email, phoneNumber, note, doctorId, photoUrl, doctorName, age
    } = userData;

    // Call the stored procedure with arguments in the exact schema order
    const [rows] = await pool.query(
        'CALL user_create(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [username, passwordHash, name, photoUrl, dob, sex, age, email, phoneNumber, note, doctorId, doctorName]
    );

    // The SP returns the LAST_INSERT_ID() as new_user_id
    return rows[0][0].new_user_id; 
};

module.exports = {
    createUser
};
