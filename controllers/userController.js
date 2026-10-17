const User = require('../models/User');
const AuditedUnit = require('../models/AuditedUnit');
 
const ROLES = ['admin', 'auditor', 'representative'];
 
async function renderUsers(res, error = null) {
  const users = await User.getAllUsers();
  const units = await AuditedUnit.getAll();
  res.render('admin/users', { title: 'Manage Users', users, units, roles: ROLES, error });
}
 
exports.listUsers = (req, res) => renderUsers(res);
 
exports.createUser = async (req, res) => {
  const { name, email, password, role, auditedUnitId } = req.body;
 
  if (!name || !email || !password || !ROLES.includes(role)) {
    return renderUsers(res, 'Please fill in every field and choose a valid role.');
  }
  if (password.length < 8) {
    return renderUsers(res, 'Password must be at least 8 characters.');
  }
  if (role === 'representative' && !auditedUnitId) {
    return renderUsers(res, 'A representative must be linked to an audited unit.');
  }
  if (await User.findByEmail(email)) {
    return renderUsers(res, 'An account with that email already exists.');
  }
 
  await User.createUser({
    name, email, password, role,
    auditedUnitId: role === 'representative' ? auditedUnitId : null,
  });
  req.session.flash = `Account created for ${name}.`;
  res.redirect('/admin/users');
};
