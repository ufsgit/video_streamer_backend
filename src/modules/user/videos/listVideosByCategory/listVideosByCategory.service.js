const pool = require('../../../../../db');

const listVideosByCategoryAndLanguage = async (category, languageId, limit, offset, search) => {
    // Call the stored procedure, passing null if languageId or search are undefined
    const [rows] = await pool.query(
        'CALL get_videos_by_category_and_language(?, ?, ?, ?, ?)',
        [category, languageId || null, limit, offset, search || null]
    );
    return rows[0]; 
};

module.exports = { listVideosByCategoryAndLanguage };
