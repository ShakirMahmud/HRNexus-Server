const { getDatabase } = require('../config/dbConnection');
const usersCollection = getDatabase().collection('menu');

const getUsers = async (req, res) => {
  try {
    const result = await usersCollection.find().toArray();
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Error fetching menu", error });
  }
};

module.exports = { getUsers };