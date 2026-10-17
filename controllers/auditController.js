const Audit = require('../models/Audit');
const AuditedUnit = require('../models/AuditedUnit');
const Finding = require('../models/Finding');
const User = require('../models/User');
 
const SEVERITIES = ['High', 'Medium', 'Low'];
 
exports.listAudits = async (req, res) => {
  const { role, auditedUnitId } = req.session.user;
  const audits = await Audit.getAll(role === 'representative' ? auditedUnitId : null);
  res.render('audits/index', { title: 'Audits', audits });
};
 
exports.showNewAudit = async (req, res) => {
  const units = await AuditedUnit.getAll();
  res.render('audits/new', { title: 'New Audit', units, error: null });
};
 
exports.createAudit = async (req, res) => {
  const { title, auditDate, auditedUnitId } = req.body;
  if (!title || !auditDate || !auditedUnitId) {
    const units = await AuditedUnit.getAll();
    return res.render('audits/new', { title: 'New Audit', units, error: 'Every field is required.' });
  }
  const audit = await Audit.create({
    title, auditDate, auditedUnitId, createdBy: req.session.user.id,
  });
  req.session.flash = 'Audit created. Now record its findings.';
  res.redirect(`/audits/${audit.id}`);
};
 
exports.showAudit = async (req, res) => {
  const audit = await Audit.getById(req.params.id);
  if (!audit) {
    return res.status(404).render('error', { title: 'Not Found', message: 'Audit not found.' });
  }
  const { role, auditedUnitId } = req.session.user;
  if (role === 'representative' && audit.audited_unit_id !== auditedUnitId) {
    return res.status(403).render('error', { title: 'Forbidden', message: 'That audit belongs to another unit.' });
  }
  const findings = await Finding.filter({ auditId: audit.id });
  const representatives = await User.getRepresentativesByUnit(audit.audited_unit_id);
  res.render('audits/show', {
    title: audit.title, audit, findings, representatives, severities: SEVERITIES, error: null,
  });
};
