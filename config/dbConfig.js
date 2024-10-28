const mysql = require('mysql2/promise');
require('dotenv').config();


const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
};

const createConnection = async () => {
    return await mysql.createPool(dbConfig);
};

module.exports = { dbConfig, createConnection };
