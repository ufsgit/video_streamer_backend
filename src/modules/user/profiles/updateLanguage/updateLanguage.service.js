const pool = require('../../../../../db');

const updateUserLanguage = async (userId, languageId, languageName) => {
    const [result] = await pool.query(
        'UPDATE users SET language_id = ?, language_name = ? WHERE id = ?',
        [languageId, languageName, userId]
    );
    return result.affectedRows > 0;
};

module.exports = {
    updateUserLanguage
};
