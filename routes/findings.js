const express = require('express');
const router = express.Router();
const findingController = require('../controllers/findingController');
const statusController = require('../controllers/statusController');
const { requireAuth, requireRole } = require('../middleware/auth');

router.get('/', requireAuth, findingController.listFindings);
router.get(
    '/export.csv',
    requireRole('admin', 'auditor'),
    findingController.exportCsv
);
 
 
router.get('/:id', requireAuth, findingController.showFinding);
router.post('/:id/status', requireRole('representative'), statusController.updateStatus);
 
module.exports = router;

