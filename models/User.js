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
function getRepresentativesByUnit(unitId) {
  return db.any(
    `SELECT id, name FROM users
     WHERE role = 'representative' AND audited_unit_id = $1
     ORDER BY name`,
    [unitId]
  );
}
 
function getById(id) {
  return db.oneOrNone(
    'SELECT id, name, email, role, audited_unit_id FROM users WHERE id = $1',
    [id]
  );
}

 
module.exports = {
  createUser, findByEmail, verifyPassword,
  getAllUsers, getRepresentativesByUnit, getById,
};

