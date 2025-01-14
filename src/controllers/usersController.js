const { getDatabase } = require('../config/dbConnection');
const usersCollection = getDatabase().collection('users');
const jwt = require("jsonwebtoken");
require("dotenv").config();


const createToken = async (req, res) => {
    try {
        const user = req.body;
        const token = jwt.sign(user , process.env.JWT_SECRET, { expiresIn:process.env.JWT_EXPIRES_IN });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: "Error creating token", error });
    }
}

const getUsers = async (req, res) => {
  try {
    const result = await usersCollection.find().toArray();
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

const addUser = async (req, res) => {
  try {
    const user = req.body;
    const result = await usersCollection.insertOne(user);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Error adding user", error });
  }
};

const checkUserByEmail = async (req, res) => {
    try {
      const { email } = req.query;
      const user = await usersCollection.findOne({ email });
      
      if (user) {
        res.json({
          exists: true,
          roleValue: user.roleValue || null
        });
      } else {
        res.json({
          exists: false,
          roleValue: null
        });
      }
    } catch (error) {
      res.status(500).json({ 
        message: "Error checking user", 
        error,
        exists: false,
        roleValue: null 
      });
    }
  };

module.exports = { getUsers, addUser, checkUserByEmail };