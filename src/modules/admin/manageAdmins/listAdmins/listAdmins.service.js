const pool = require('../../../../../db');

const listAdmins = async () => {
    // Queries the admin table directly to avoid needing a Stored Procedure
    const [rows] = await pool.query('SELECT * FROM admin');
    
    return rows; 
};

module.exports = { listAdmins };
