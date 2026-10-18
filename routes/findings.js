const express = require('express');
const router = express.Router();
const findingController = require('../controllers/findingController');
const { requireAuth } = require('../middleware/auth');
 
router.get('/', requireAuth, findingController.listFindings);
 
module.exports = router;
