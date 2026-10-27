const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Endpoint Rute Login
router.post('/login', authController.loginAdmin);

module.exports = router;