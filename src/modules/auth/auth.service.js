const pool = require('../../../db'); // Adjusted path to root db.js

// Using Stored Procedures via CALL
const getAdminByUsername = async (username) => {
    // Calling the SP we defined. Note: SPs return an array of result sets.
    // The actual rows are in the first element of the array: rows[0]
    const [rows] = await pool.query('CALL login_admin(?)', [username]);
    return rows[0]; 
};

const getUserByUsername = async (username) => {
    const [rows] = await pool.query('CALL login_user(?)', [username]);
    return rows[0];
};

module.exports = {
    getAdminByUsername,
    getUserByUsername
};
