const express = require('express');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const port = 8001;
const authRoutes = require('./routes/auth');
const messageRoutes = require('./routes/message');
const { sendMessage } = require('./controllers/messageController');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.json());
app.use(cors());
app.use(express.static('public'));

// Store active users' socket IDs
const users = {};

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

mongoose.connect('mongodb+srv://web:Ju1eombBpv96hJJR@souravmongodb.zhuwg.mongodb.net/chatapp')
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log('A user connected: ' + socket.id);

  // Register user by associating userId with socketId
  socket.on('register', (userId) => {
    users[userId] = socket.id;  // Map userId to socketId
    console.log(`User registered: ${userId} -> ${socket.id}`);
  });

  // Handle sending messages via socket (real-time)
  socket.on('sendMessage', (data) => {
    sendMessage(socket, data,users); // Pass the socket and data to the controller for processing
  });

  // Handle disconnections
  socket.on('disconnect', () => {
    // Remove the user from the active user map
    for (let userId in users) {
      if (users[userId] === socket.id) {
        delete users[userId];
        console.log(`User disconnected: ${userId}`);
        break;
      }
    }
  });
});

server.listen(port, () => {
  console.log(`Server started at : ${port}`);
});















// //server js
// const express = require('express');
// const socketIo = require('socket.io');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const http = require('http');
// const port = 8001;
// const authRoutes = require('./routes/auth');
// const messageRoutes = require('./routes/message');
// // Import sendMessage from the messageController
// const { sendMessage } = require('./controllers/messageController');



// const app =  express();
// const server = http.createServer(app);
// const io = socketIo(server);

// app.use(express.json());
// app.use(cors());
// app.use(express.static('public'));

// // Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/messages', messageRoutes);



// mongoose.connect('mongodb+srv://web:Ju1eombBpv96hJJR@souravmongodb.zhuwg.mongodb.net/chatapp').then(() => {  console.log("Connected to MongoDB");
// }).catch((err) => {  console.error("Error connecting to MongoDB:", err);
// });

// // Socket.IO connection handler
// // Socket.IO connection handler
// io.on('connection', (socket) => {
//   console.log('A user connected: ' + socket.id);

//   // Handle sending messages via socket (real-time)
//   socket.on('sendMessage', (data) => {
//     // You can use the controller method to save the message and emit it to the receiver
//     sendMessage(socket, data); // We'll create sendMessage in the controller

//   });

//   // Handle disconnections
//   socket.on('disconnect', () => {
//     console.log('User disconnected: ' + socket.id);
//   });
// });


// // app.get('/',(req,res)=>{
// //     res.send("Welcome to chat backend")
// // })

// server.listen(port,()=>{
//     console.log(`Server started at : ${port}`)
// })