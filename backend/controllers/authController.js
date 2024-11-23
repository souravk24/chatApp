const User = require('../models/user');
const jwt = require('jsonwebtoken');

// Sign up controller
const signUp = async (req, res) => {
  const { username, password } = req.body;
  if(!username || !password){
    return res.status(400).json({ message: 'username & password required' });
  }
  try {
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    const newUser = new User({ username, password });
    await newUser.save();
    
    const token = jwt.sign({ userId: newUser._id }, 'yourSecretKey', { expiresIn: '1h' });
    res.status(201).json({ token ,'id':newUser._id,name:newUser.username });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating user' });
  }
};

// Login controller
const login = async (req, res) => {
  const { username, password } = req.body;
  if(!username || !password){
    return res.status(400).json({ message: 'username & password required' });
  }  
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, 'yourSecretKey', { expiresIn: '1h' });
    res.status(200).json({ token,'id':user._id,name:user.username });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error logging in' });
  }
};

module.exports = { signUp, login };
