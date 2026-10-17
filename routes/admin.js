const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const unitController = require('../controllers/unitController');
const { requireRole } = require('../middleware/auth');
 
// Every route in this file is admin-only
router.use(requireRole('admin'));
 
router.get('/users', userController.listUsers);
router.post('/users', userController.createUser);
router.get('/units', unitController.listUnits);
router.post('/units', unitController.createUnit);
 
module.exports = router;
