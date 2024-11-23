const express = require('express');
const { searchUser,myConnection } = require('../controllers/usersController'); // Corrected function name
const router = express.Router();

// Route for search user
router.get('/search/:searchkey', searchUser); // Corrected function name
router.get('/connection/:userid', myConnection); // Corrected function name


module.exports = router;
