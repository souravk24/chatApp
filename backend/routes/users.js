const express = require('express');
const { searchUser,myConnection,clearMessages } = require('../controllers/usersController');
const router = express.Router();

// Route for search user
router.get('/search/:searchkey', searchUser); 
router.get('/connection/:userid', myConnection); 
router.delete('/clearChat/:senderId/:receiverId', clearMessages);


module.exports = router;
