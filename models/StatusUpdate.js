const db = require('../config/db');
 
exports.getByFinding = (findingId) =>
  db.any(
    `SELECT s.id, s.old_status, s.new_status, s.note,
            to_char(s.created_at, 'YYYY-MM-DD HH24:MI') AS created_at,
            u.name AS updated_by_name
     FROM status_updates s
     JOIN users u ON u.id = s.updated_by
     WHERE s.finding_id = $1
     ORDER BY s.id DESC`,
    [findingId]
  );
