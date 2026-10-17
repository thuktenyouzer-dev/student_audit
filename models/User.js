const db = require('../config/db');
const bcrypt = require('bcrypt');
 
async function createUser({ name, email, password, role, auditedUnitId }) {
  const passwordHash = await bcrypt.hash(password, 10);
  return db.one(
    `INSERT INTO users (name, email, password_hash, role, audited_unit_id)
     VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role`,
    [name, email, passwordHash, role, auditedUnitId || null]
  );
}
 
function findByEmail(email) {
  return db.oneOrNone('SELECT * FROM users WHERE email = $1', [email]);
}
 
function verifyPassword(plainPassword, passwordHash) {
  return bcrypt.compare(plainPassword, passwordHash);
}
 
function getAllUsers() {
  return db.any(
    `SELECT u.id, u.name, u.email, u.role, au.name AS unit_name
     FROM users u
     LEFT JOIN audited_units au ON au.id = u.audited_unit_id
     ORDER BY u.id`
  );
}
 
module.exports = { createUser, findByEmail, verifyPassword, getAllUsers };
