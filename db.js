const mysql = require('mysql2');

// Create a connection pool to handle multiple concurrent requests efficiently
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// We use .promise() so we can use modern async/await syntax in our service layers
// instead of old callback functions
const promisePool = pool.promise();

module.exports = promisePool;
