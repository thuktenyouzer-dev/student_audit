const AuditedUnit = require('../models/AuditedUnit');
 
const TYPES = ['club', 'forum', 'unit', 'hostel'];
 
async function renderUnits(res, error = null) {
  const units = await AuditedUnit.getAll();
  res.render('admin/units', { title: 'Audited Units', units, types: TYPES, error });
}
 
exports.listUnits = (req, res) => renderUnits(res);
 
exports.createUnit = async (req, res) => {
  const { name, type, description } = req.body;
  if (!name || !TYPES.includes(type)) {
    return renderUnits(res, 'A name and a valid type are required.');
  }
  try {
    await AuditedUnit.create({ name, type, description });
  } catch (err) {
    return renderUnits(res, 'That unit name already exists.');
  }
  req.session.flash = `${name} added.`;
  res.redirect('/admin/units');
};
