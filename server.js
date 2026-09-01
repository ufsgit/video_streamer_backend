require('dotenv').config();
const app = require('./src/app');
const pool = require('./db'); 

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
    console.log(`=========================================`);
    console.log(`🚀 Server is successfully connected on port: ${PORT}`);
    
    try {
        // Quick test to ensure the database is actually connecting
        await pool.query('SELECT 1');
        console.log(`🗄️  Database successfully connected to: ${process.env.DB_NAME}`);
    } catch (err) {
        console.error(`❌ Database connection failed:`, err.message);
    }
    
    console.log(`=========================================`);
});
