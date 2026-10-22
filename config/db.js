require('dotenv').config();
const pgp = require('pg-promise')();

const db = pgp({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 5432),
    database: process.env.DB_NAME || 'audit_db',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'yourpassword',

    ssl: process.env.DB_SSL === 'true'
        ? { sslmode: 'require' }
        : false
});

module.exports = db;