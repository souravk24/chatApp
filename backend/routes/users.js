const express = require('express');
const { searchUser } = require('../controllers/usersController'); // Corrected function name
const router = express.Router();

// Route for search user
router.get('/search/:searchkey', searchUser); // Corrected function name

module.exports = router;
