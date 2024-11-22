const mongoose = require('mongoose');

// Define the schema for messages
const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the user who sent the message
    ref: 'User',
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the user who receives the message
    ref: 'User',
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now, // Automatically set the current date and time
  },
  read: {
    type: Boolean,
    default: false, // Whether the message has been read
  },
});

// Create the Message model based on the schema
const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
