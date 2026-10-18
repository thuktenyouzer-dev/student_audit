const Finding = require('../models/Finding');
 
exports.updateStatus = async (req, res) => {
  const finding = await Finding.getById(req.params.id);
  if (!finding) {
    return res.status(404).render('error', { title: 'Not Found', message: 'Finding not found.' });
  }
 
  // Business rule: only the person the finding is assigned to may change its status
  if (finding.responsible_user_id !== req.session.user.id) {
    return res.status(403).render('error', {
      title: 'Forbidden',
      message: 'Only the responsible representative can update this finding.',
    });
  }
 
  try {
    await Finding.updateStatus({
      findingId: finding.id,
      newStatus: req.body.newStatus,
      note: req.body.note,
      userId: req.session.user.id,
    });
  } catch (err) {
    req.session.flash = err.message;
    return res.redirect(`/findings/${finding.id}`);
  }
 
  req.session.flash = 'Status updated.';
  res.redirect(`/findings/${finding.id}`);
};

