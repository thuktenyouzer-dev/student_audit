const Audit = require('../models/Audit');
const AuditedUnit = require('../models/AuditedUnit');
const Finding = require('../models/Finding');
const User = require('../models/User');
const StatusUpdate = require('../models/StatusUpdate');
 
const SEVERITIES = ['High', 'Medium', 'Low'];
const STATUSES = ['Open', 'In Progress', 'Resolved'];

exports.listFindings = async (req, res) => {
  const { role, auditedUnitId } = req.session.user;
  const { audit, unit, status } = req.query;
 
  const findings = await Finding.filter({
    auditId: audit || null,
    // A representative's unit filter is forced, whatever the URL says
    unitId: role === 'representative' ? auditedUnitId : (unit || null),
    status: STATUSES.includes(status) ? status : null,
  });
 
  const audits = await Audit.getAll(role === 'representative' ? auditedUnitId : null);
  const units = role === 'representative' ? [] : await AuditedUnit.getAll();
 
  res.render('findings/index', {
    title: 'Findings', findings, audits, units, statuses: STATUSES,
    filters: { audit: audit || '', unit: unit || '', status: status || '' },
  });
};

 
exports.createFinding = async (req, res) => {
  const auditId = req.params.auditId;
  const audit = await Audit.getById(auditId);
  if (!audit) {
    return res.status(404).render('error', { title: 'Not Found', message: 'Audit not found.' });
  }
 
  const { description, severity, recommendation, responsibleUserId, dueDate } = req.body;
 
  async function fail(message) {
    const findings = await Finding.filter({ auditId: audit.id });
    const representatives = await User.getRepresentativesByUnit(audit.audited_unit_id);
    return res.render('audits/show', {
      title: audit.title, audit, findings, representatives, severities: SEVERITIES, error: message,
    });
  }
 
  if (!description || !recommendation || !SEVERITIES.includes(severity)) {
    return fail('Description, severity and recommendation are required.');
  }
 
  // The responsible person must be a representative of the audited unit
  const responsible = await User.getById(responsibleUserId);
  if (!responsible || responsible.role !== 'representative' ||
      responsible.audited_unit_id !== audit.audited_unit_id) {
    return fail('Choose a representative who belongs to this audited unit.');
  }
 
  await Finding.create({
    auditId: audit.id, description, severity, recommendation,
    responsibleUserId: responsible.id, dueDate,
  });
  req.session.flash = 'Finding recorded and assigned.';
  res.redirect(`/audits/${audit.id}`);
};
exports.showFinding = async (req, res) => {
  const finding = await Finding.getById(req.params.id);
  if (!finding) {
    return res.status(404).render('error', { title: 'Not Found', message: 'Finding not found.' });
  }
  const { id, role, auditedUnitId } = req.session.user;
  if (role === 'representative' && finding.audited_unit_id !== auditedUnitId) {
    return res.status(403).render('error', { title: 'Forbidden', message: 'That finding belongs to another unit.' });
  }
 
  const history = await StatusUpdate.getByFinding(finding.id);
  const nextStatus = Finding.NEXT_STATUS[finding.status] || null;
  const canUpdate = role === 'representative' && finding.responsible_user_id === id && nextStatus;
 
  res.render('findings/show', {
    title: `Finding #${finding.id}`, finding, history, nextStatus, canUpdate,
  });
};
exports.exportCsv = async (req, res) => {
  const findings = await Finding.filter({});
 
  // Wrap every value in quotes and double any quote inside it
  const cell = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`;
 
  const header = ['ID', 'Audit', 'Unit', 'Description', 'Severity', 'Status', 'Due date', 'Responsible'];
  const rows = findings.map((f) => [
    f.id, f.audit_title, f.unit_name, f.description,
    f.severity, f.status, f.due_date, f.responsible_name,
  ].map(cell).join(','));
 
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="findings.csv"');
  res.send([header.map(cell).join(','), ...rows].join('\n'));
};
