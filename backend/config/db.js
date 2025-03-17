const mysql = require("mysql2");
const dotenv = require("dotenv");

dotenv.config();

console.log("🟡 Loading database configuration...");

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// Log the connection attempt
console.log("🟡 Attempting to connect to MySQL...");

// Test database connection
pool.getConnection((err, connection) => {
    if (err) {
        console.error("❌ Database connection failed:", err.message);
    } else {
        console.log("✅ Connected to MySQL database!");
        connection.release(); // Release the connection
    }
});

module.exports = pool.promise();
