const express = require('express');
const router = express.Router();
const auditController = require('../controllers/auditController');
const findingController = require('../controllers/findingController');
const { requireAuth, requireRole } = require('../middleware/auth');
 
router.get('/', requireAuth, auditController.listAudits);
 
// /new must be declared before /:id, or Express would treat "new" as an id
router.get('/new', requireRole('auditor'), auditController.showNewAudit);
router.post('/', requireRole('auditor'), auditController.createAudit);
 
router.get('/:id', requireAuth, auditController.showAudit);
router.post('/:auditId/findings', requireRole('auditor'), findingController.createFinding);
 
module.exports = router;
