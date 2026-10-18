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
// The only legal moves in the workflow
const NEXT_STATUS = {
  'Open': 'In Progress',
  'In Progress': 'Resolved',
};
exports.NEXT_STATUS = NEXT_STATUS;
 
// Changes the status AND writes the history row together, or neither
exports.updateStatus = ({ findingId, newStatus, note, userId }) =>
  db.tx(async (t) => {
    const current = await t.one(
      'SELECT status FROM findings WHERE id = $1 FOR UPDATE',
      [findingId]
    );
    if (NEXT_STATUS[current.status] !== newStatus) {
      throw new Error(`Cannot move a finding from ${current.status} to ${newStatus}.`);
    }
    await t.none('UPDATE findings SET status = $1 WHERE id = $2', [newStatus, findingId]);
    await t.none(
      `INSERT INTO status_updates (finding_id, old_status, new_status, note, updated_by)
       VALUES ($1, $2, $3, $4, $5)`,
      [findingId, current.status, newStatus, note, userId]
    );
  });

  // Counts for the dashboard. unitId is optional (representatives only see their unit).
exports.getStats = (unitId) => {
  const params = unitId ? [unitId] : [];
  const scope = unitId ? 'WHERE a.audited_unit_id = $1' : '';
  return db.one(
    `SELECT
       COUNT(*)::int AS total,
       COUNT(*) FILTER (WHERE f.status = 'Open')::int AS open,
       COUNT(*) FILTER (WHERE f.status = 'In Progress')::int AS in_progress,
       COUNT(*) FILTER (WHERE f.status = 'Resolved')::int AS resolved,
       COUNT(*) FILTER (WHERE f.due_date < CURRENT_DATE AND f.status <> 'Resolved')::int AS overdue
     FROM findings f JOIN audits a ON a.id = f.audit_id ${scope}`,
    params
  );
};
