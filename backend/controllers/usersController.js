const mongoose = require('mongoose');
const User = require('../models/user');
const Message = require('../models/message');

//search user
const searchUser = async (req, res) => {
  const {
    searchkey
  } = req.params;

  if (!searchkey) {
    return res.send('Required: searchkey');
  }

  try {
    // Search only by username using regex (case-insensitive)
    const users = await User.find({
      username: {
        $regex: searchkey,
        $options: 'i'
      } // Case-insensitive match for username
    }).sort({
      timestamp: 1
    });

    if (users.length === 0) {
      return res.status(404).json({
        message: 'No user found'
      });
    }

    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Error fetching users'
    });
  }
};




const myConnection = async (req, res) => {
  const { userid } = req.params;

  if (!userid) {
    return res.send('Required: userid');
  }

  try {
    // Convert the userid to an ObjectId using the 'new' keyword
    const userIdObj = new mongoose.Types.ObjectId(userid);

    // Step 1: Find unique senders and receivers for the user
    const connections = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: userIdObj },  // Match messages where the sender is the given ObjectId
            { receiver: userIdObj }  // Or where the receiver is the given ObjectId
          ]
        }
      },
      {
        $group: {
          _id: null, // We just want to group all the documents together
          users: { $addToSet: { $cond: { if: { $eq: ["$sender", userIdObj] }, then: "$receiver", else: "$sender" } } }
          // For each document, we add the opposite side (sender/receiver) as the user
        }
      },
      {
        $project: {
          _id: 0, // Exclude the _id field in the final output
          users: { $setDifference: ["$users", [userIdObj]] } // Remove the given userid from the list
        }
      }
    ]);

    // Step 2: Get user details for the unique users
    const userIds = connections.length > 0 ? connections[0].users : [];
    const users = await User.find({ '_id': { $in: userIds } }, 'username avtar _id');

    if (!users || users.length === 0) {
      return res.status(404).json({
        message: 'No users found for the given user'
      });
    }

    // Return user details along with their _id
    res.status(200).json(users);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Error fetching connections'
    });
  }
};





module.exports = {
  searchUser,myConnection
};