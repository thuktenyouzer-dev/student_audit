const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const authController = require('../controllers/authController');
const aboutController = require('../controllers/aboutController');
const dashboardController = require('../controllers/dashboardController');
const { requireAuth } = require('../middleware/auth');
 
router.get('/', homeController.getHome);
router.get('/about', aboutController.getAbout);
router.get('/login', authController.showLogin);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/dashboard', requireAuth, dashboardController.getDashboard);
 
module.exports = router;
