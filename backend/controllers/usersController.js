const User = require('../models/user');

const searchUser = async (req, res) => {
  const { searchkey } = req.params;

  if (!searchkey) {
    return res.send('Required: searchkey');
  }

  try {
    // Search only by username using regex (case-insensitive)
    const users = await User.find({
      username: { $regex: searchkey, $options: 'i' }  // Case-insensitive match for username
    }).sort({ timestamp: 1 });

    if (users.length === 0) {
      return res.status(404).json({ message: 'No user found' });
    }

    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching users' });
  }
};

module.exports = { searchUser };
