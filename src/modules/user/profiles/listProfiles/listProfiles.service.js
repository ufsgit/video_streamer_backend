const pool = require('../../../../../db');

const listUserProfiles = async (userId) => {
    // Queries the specific user profile by calling the Stored Procedure
    const [rows] = await pool.query('CALL get_user_profile(?)', [userId]);
    
    // Stored Procedures return an array of result sets. 
    // rows[0] is the first result set (an array of rows), and rows[0][0] is the single user object.
    return rows[0][0]; 
};

module.exports = { listUserProfiles };
