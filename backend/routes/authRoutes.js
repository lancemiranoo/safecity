const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');


// POST route to register user
router.post('/register', authController.registerUser);

// POST route to log in user
router.post('/login', authController.loginUser);

module.exports = router;
