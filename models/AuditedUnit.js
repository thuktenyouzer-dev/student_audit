const db = require('../config/db');
 
exports.getAll = () =>
  db.any('SELECT * FROM audited_units ORDER BY name');
 
exports.getById = (id) =>
  db.oneOrNone('SELECT * FROM audited_units WHERE id = $1', [id]);
 
exports.create = ({ name, type, description }) =>
  db.one(
    `INSERT INTO audited_units (name, type, description)
     VALUES ($1, $2, $3) RETURNING *`,
    [name, type, description]
  );
