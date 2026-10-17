const User = require('../models/User');
 
exports.showLogin = (req, res) => {
  res.render('login', { title: 'Log In', error: null });
};
 
exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findByEmail(email);
 
  if (!user || !(await User.verifyPassword(password, user.password_hash))) {
    return res.render('login', { title: 'Log In', error: 'Incorrect email or password.' });
  }
 
  req.session.user = {
    id: user.id,
    name: user.name,
    role: user.role,
    auditedUnitId: user.audited_unit_id,
  };
  res.redirect('/dashboard');
};
 
exports.logout = (req, res) => {
  req.session.destroy(() => res.redirect('/'));
};
