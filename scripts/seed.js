// Run once with: node scripts/seed.js
const db = require('../config/db');
const User = require('../models/User');
 
async function seed() {
  const existing = await User.findByEmail('admin@audit.test');
  if (existing) {
    console.log('Seed accounts already exist - nothing to do.');
    return;
  }
 
  const unit = await db.one("SELECT id FROM audited_units WHERE name = 'Photography Club'");
 
  await User.createUser({ name: 'System Admin', email: 'admin@audit.test', password: 'Admin@12345', role: 'admin' });
  await User.createUser({ name: 'Audit Officer', email: 'auditor@audit.test', password: 'Auditor@12345', role: 'auditor' });
  await User.createUser({
    name: 'Club President', email: 'rep@audit.test', password: 'Rep@12345',
    role: 'representative', auditedUnitId: unit.id,
  });
  console.log('Created admin, auditor and representative accounts.');
}
 
seed().then(() => process.exit(0)).catch((err) => { console.error(err); process.exit(1); });
