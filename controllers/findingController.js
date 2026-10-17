const Audit = require('../models/Audit');
const Finding = require('../models/Finding');
const User = require('../models/User');
 
const SEVERITIES = ['High', 'Medium', 'Low'];
 
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
