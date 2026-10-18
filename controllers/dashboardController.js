const Finding = require('../models/Finding');
 
exports.getDashboard = async (req, res) => {
  const { role, auditedUnitId } = req.session.user;
  // Representatives only ever see numbers for their own unit
  const scopeUnitId = role === 'representative' ? auditedUnitId : null;
 
  const stats = await Finding.getStats(scopeUnitId);
  const recent = (await Finding.filter({ unitId: scopeUnitId })).slice(0, 5);
 
  res.render('dashboard', { title: 'Dashboard', stats, recent });
};
