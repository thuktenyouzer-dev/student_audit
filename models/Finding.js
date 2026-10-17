const db = require('../config/db');
 
const SELECT_FINDINGS = `
  SELECT f.id, f.description, f.severity, f.recommendation, f.status,
         to_char(f.due_date, 'YYYY-MM-DD') AS due_date,
         (f.due_date < CURRENT_DATE AND f.status <> 'Resolved') AS overdue,
         f.audit_id, f.responsible_user_id,
         a.title AS audit_title, a.audited_unit_id,
         u.name AS unit_name, r.name AS responsible_name
  FROM findings f
  JOIN audits a ON a.id = f.audit_id
  JOIN audited_units u ON u.id = a.audited_unit_id
  LEFT JOIN users r ON r.id = f.responsible_user_id`;
 
exports.create = ({ auditId, description, severity, recommendation, responsibleUserId, dueDate }) =>
  db.one(
    `INSERT INTO findings
       (audit_id, description, severity, recommendation, responsible_user_id, due_date)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
    [auditId, description, severity, recommendation, responsibleUserId, dueDate || null]
  );
 
exports.getById = (id) =>
  db.oneOrNone(`${SELECT_FINDINGS} WHERE f.id = $1`, [id]);
 
// Every filter is optional; only the ones provided are added to the WHERE
exports.filter = ({ auditId, unitId, status } = {}) => {
  const where = [];
  const params = [];
  if (auditId) { params.push(auditId); where.push(`f.audit_id = $${params.length}`); }
  if (unitId)  { params.push(unitId);  where.push(`a.audited_unit_id = $${params.length}`); }
  if (status)  { params.push(status);  where.push(`f.status = $${params.length}`); }
  const clause = where.length ? 'WHERE ' + where.join(' AND ') : '';
  return db.any(`${SELECT_FINDINGS} ${clause} ORDER BY f.id DESC`, params);
};
