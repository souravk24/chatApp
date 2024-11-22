const express = require('express');
const { sendMessage, getMessages } = require('../controllers/messageController');
const router = express.Router();

// Route for sending a message
router.post('/send', sendMessage);

// Route for fetching chat messages between two users
router.get('/chat/:userId/:friendId', getMessages);

module.exports = router;
