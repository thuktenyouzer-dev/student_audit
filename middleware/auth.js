function requireAuth(req, res, next) {
  if (!req.session.user) return res.redirect('/login');
  next();
}
 
// requireRole('admin') or requireRole('auditor', 'admin')
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.session.user) return res.redirect('/login');
    if (!roles.includes(req.session.user.role)) {
      return res.status(403).render('error', {
        title: 'Forbidden',
        message: 'You do not have permission to view this page.',
      });
    }
    next();
  };
}
 
module.exports = { requireAuth, requireRole };
