const Message = require('../models/message');
const User = require('../models/user');

// Function to handle sending messages (via HTTP or Socket.IO)
const sendMessage = async (socket, data, users) => {
  const { senderId, receiverId, message } = data;

  if (!senderId || !receiverId || !message) {
    socket.emit('error', 'Required: senderId, receiverId, message');
    return;
  }

  try {
    // Save the message to the database
    const newMessage = new Message({
      sender: senderId,
      receiver: receiverId,
      message,
      timestamp: Date.now(),
    });

    await newMessage.save();

    // Emit the message to the receiver's socket using their socketId
    if (users[receiverId]) {
      // Emit the message to the receiver via their socketId
      socket.to(users[receiverId]).emit('receiveMessage', newMessage);
      console.log(`Message sent from ${senderId} to ${receiverId}: ${message}`);
    } else {
      console.log(`Receiver ${receiverId} not connected.`);
    }

    // Optionally, send the message back to the sender for confirmation
    socket.emit('receiveMessage', newMessage);

  } catch (error) {
    console.error(error);
    socket.emit('error', 'Error sending message');
  }
};

// Function to fetch messages between two users
const getMessages = async (req, res) => {
  const { senderId, receiverId } = req.params;
  if (!senderId || !receiverId) {
    return res.send('Required: senderId, receiverId');
  }

  try {
    const messages = await Message.find({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    }).sort({ timestamp: 1 });

    res.status(200).json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching messages' });
  }
};

module.exports = { sendMessage, getMessages };
