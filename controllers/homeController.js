exports.getHome = (req, res) => {
  if (req.session.user) return res.redirect('/dashboard');
  res.render('index', { title: 'Student Audit Management System' });
};
