const db = require('../config/db');
 
const SELECT_AUDITS = `
  SELECT a.id, a.title,
         to_char(a.audit_date, 'YYYY-MM-DD') AS audit_date,
         a.audited_unit_id, u.name AS unit_name, u.type AS unit_type,
         c.name AS created_by_name,
         (SELECT COUNT(*) FROM findings f WHERE f.audit_id = a.id)::int AS finding_count
  FROM audits a
  JOIN audited_units u ON u.id = a.audited_unit_id
  JOIN users c ON c.id = a.created_by`;
 
// unitId is optional: pass it to limit the list to one audited unit
exports.getAll = (unitId) => {
  if (unitId) {
    return db.any(`${SELECT_AUDITS} WHERE a.audited_unit_id = $1 ORDER BY a.audit_date DESC, a.id DESC`, [unitId]);
  }
  return db.any(`${SELECT_AUDITS} ORDER BY a.audit_date DESC, a.id DESC`);
};
 
exports.getById = (id) =>
  db.oneOrNone(`${SELECT_AUDITS} WHERE a.id = $1`, [id]);
 
exports.create = ({ title, auditDate, auditedUnitId, createdBy }) =>
  db.one(
    `INSERT INTO audits (title, audit_date, audited_unit_id, created_by)
     VALUES ($1, $2, $3, $4) RETURNING id`,
    [title, auditDate, auditedUnitId, createdBy]
  );
