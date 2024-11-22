const express = require('express');
const { signUp, login } = require('../controllers/authController');
const router = express.Router();

// Route for signing up a new user
router.post('/signup', signUp);

// Route for logging in an existing user
router.post('/login', login);

module.exports = router;
